-- ============================================
-- TEMPLY Supabase schema (run in SQL Editor)
-- This script is idempotent: it recreates functions, triggers,
-- policies, and ensures all tables exist for the app.
-- ============================================

-- Extensions ---------------------------------------------------------------
create extension if not exists "pgcrypto";

-- Clean up old helpers -----------------------------------------------------
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'auth' and table_name = 'users'
  ) then
    execute 'drop trigger if exists on_auth_user_created on auth.users';
  end if;
end $$;

do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'users'
  ) then
    execute 'drop trigger if exists update_users_updated_at on public.users';
  end if;
end $$;

do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'templates'
  ) then
    execute 'drop trigger if exists update_templates_updated_at on public.templates';
  end if;
end $$;

do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'profiles'
  ) then
    execute 'drop trigger if exists update_profiles_updated_at on public.profiles';
  end if;
end $$;

drop function if exists public.handle_new_user();
drop function if exists public.update_updated_at_column();
drop function if exists public.is_admin();

-- Tables -------------------------------------------------------------------
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text not null,
  role text not null check (role in ('USER', 'CREATOR', 'ADMIN')) default 'USER',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  price integer not null,
  thumbnail_url text not null,
  canva_link text not null,
  category text not null,
  tags text[] default '{}',
  status text check (status in ('PENDING', 'APPROVED', 'REJECTED')) default 'PENDING',
  creator_id uuid references public.users(id) on delete cascade,
  downloads_count integer default 0,
  views_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  template_id uuid references public.templates(id) on delete cascade,
  amount integer not null,
  created_at timestamptz default now()
);

create table if not exists public.downloads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  template_id uuid references public.templates(id) on delete cascade,
  created_at timestamptz default now()
);

create table if not exists public.membership (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references public.users(id) on delete cascade,
  plan text not null check (plan in ('BASIC', 'PRO', 'PREMIUM')),
  status text default 'ACTIVE' check (status in ('ACTIVE', 'CANCELLED', 'EXPIRED')),
  start_date timestamptz not null,
  end_date timestamptz not null
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  template_id uuid references public.templates(id) on delete cascade,
  created_at timestamptz default now(),
  unique (user_id, template_id)
);

create table if not exists public.payouts (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references public.users(id) on delete cascade,
  amount integer not null,
  status text default 'PENDING' check (status in ('PENDING', 'PAID', 'REJECTED')),
  method text not null,
  details text not null,
  created_at timestamptz default now(),
  paid_at timestamptz
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  template_id uuid references public.templates(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  created_at timestamptz default now(),
  unique (user_id, template_id)
);

-- Social/extra tables used by types ---------------------------------------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.users(id) on delete cascade,
  content text not null,
  image_url text,
  likes_count integer default 0,
  comments_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references public.users(id) on delete cascade,
  display_name text,
  username text,
  avatar_url text,
  bio text,
  website text,
  location text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid references public.users(id) on delete cascade,
  following_id uuid references public.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique (follower_id, following_id)
);

-- Indexes ------------------------------------------------------------------
create index if not exists idx_templates_creator_id on public.templates(creator_id);
create index if not exists idx_templates_status on public.templates(status);
create index if not exists idx_templates_category on public.templates(category);
create index if not exists idx_purchases_user_id on public.purchases(user_id);
create index if not exists idx_downloads_user_id on public.downloads(user_id);
create index if not exists idx_cart_items_user_id on public.cart_items(user_id);
create index if not exists idx_payouts_creator_id on public.payouts(creator_id);
create index if not exists idx_reviews_template_id on public.reviews(template_id);
create index if not exists idx_reviews_user_id on public.reviews(user_id);
create index if not exists idx_posts_author_id on public.posts(author_id);
create index if not exists idx_profiles_user_id on public.profiles(user_id);
create index if not exists idx_follows_follower on public.follows(follower_id);
create index if not exists idx_follows_following on public.follows(following_id);

-- Functions ---------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', 'User'),
    coalesce(new.raw_user_meta_data->>'role', 'USER')
  )
  on conflict (id) do nothing;

  insert into public.profiles (user_id, display_name, username)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', 'User'), new.email)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Helper to avoid recursive policies when checking admin role
create or replace function public.is_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  role_value text;
begin
  if auth.uid() is null then
    return false;
  end if;
  select role into role_value from public.users where id = auth.uid();
  return role_value = 'ADMIN';
exception
  when others then
    return false;
end;
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- Triggers -----------------------------------------------------------------
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create trigger update_users_updated_at
  before update on public.users
  for each row execute function public.update_updated_at_column();

create trigger update_templates_updated_at
  before update on public.templates
  for each row execute function public.update_updated_at_column();

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at_column();

-- Row Level Security -------------------------------------------------------
alter table public.users enable row level security;
alter table public.templates enable row level security;
alter table public.purchases enable row level security;
alter table public.downloads enable row level security;
alter table public.membership enable row level security;
alter table public.cart_items enable row level security;
alter table public.payouts enable row level security;
alter table public.reviews enable row level security;
alter table public.posts enable row level security;
alter table public.profiles enable row level security;
alter table public.follows enable row level security;

-- Reset policies so we can recreate cleanly
drop policy if exists "Users can view their own profile" on public.users;
drop policy if exists "Users can update their own profile" on public.users;
drop policy if exists "Admins manage all users" on public.users;

drop policy if exists "Anyone can view approved templates" on public.templates;
drop policy if exists "Creators can view their own templates" on public.templates;
drop policy if exists "Admins can view all templates" on public.templates;
drop policy if exists "Creators can insert templates" on public.templates;
drop policy if exists "Creators can update templates" on public.templates;
drop policy if exists "Admins can update templates" on public.templates;
drop policy if exists "Delete templates" on public.templates;

drop policy if exists "Users can view their own purchases" on public.purchases;
drop policy if exists "Admins can view all purchases" on public.purchases;
drop policy if exists "Insert purchases" on public.purchases;
drop policy if exists "Update purchases" on public.purchases;

drop policy if exists "Users can view their own downloads" on public.downloads;
drop policy if exists "Admins can view all downloads" on public.downloads;
drop policy if exists "Insert downloads" on public.downloads;

drop policy if exists "Users can view their own membership" on public.membership;
drop policy if exists "Admins can view all memberships" on public.membership;
drop policy if exists "Manage membership system" on public.membership;

drop policy if exists "Users can view their own cart items" on public.cart_items;
drop policy if exists "Users can manage their own cart items" on public.cart_items;

drop policy if exists "Creators can view their own payouts" on public.payouts;
drop policy if exists "Admins can manage all payouts" on public.payouts;

drop policy if exists "Anyone can view reviews" on public.reviews;
drop policy if exists "Users can insert their own reviews" on public.reviews;
drop policy if exists "Users can update their own reviews" on public.reviews;
drop policy if exists "Admins can manage all reviews" on public.reviews;

drop policy if exists "Select posts" on public.posts;
drop policy if exists "Write posts" on public.posts;

drop policy if exists "Select profiles" on public.profiles;
drop policy if exists "Write profiles" on public.profiles;

drop policy if exists "Select follows" on public.follows;
drop policy if exists "Write follows" on public.follows;

-- Users policies
create policy "Users can view their own profile"
  on public.users
  for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.users
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Admins manage all users"
  on public.users
  for all
  using (is_admin());

-- Templates policies
create policy "Anyone can view approved templates"
  on public.templates
  for select
  using (status = 'APPROVED' or is_admin() or creator_id = auth.uid());

create policy "Creators can insert templates"
  on public.templates
  for insert
  with check (creator_id = auth.uid() or is_admin() or auth.role() = 'service_role');

create policy "Creators can update templates"
  on public.templates
  for update
  using (creator_id = auth.uid() or is_admin() or auth.role() = 'service_role')
  with check (creator_id = auth.uid() or is_admin() or auth.role() = 'service_role');

create policy "Delete templates"
  on public.templates
  for delete
  using (creator_id = auth.uid() or is_admin() or auth.role() = 'service_role');

-- Purchases policies
create policy "Users can view their own purchases"
  on public.purchases
  for select
  using (user_id = auth.uid() or is_admin());

create policy "Insert purchases"
  on public.purchases
  for insert
  with check (user_id = auth.uid() or is_admin() or auth.role() = 'service_role');

create policy "Update purchases"
  on public.purchases
  for update
  using (user_id = auth.uid() or is_admin() or auth.role() = 'service_role')
  with check (user_id = auth.uid() or is_admin() or auth.role() = 'service_role');

-- Downloads policies
create policy "Users can view their own downloads"
  on public.downloads
  for select
  using (user_id = auth.uid() or is_admin());

create policy "Insert downloads"
  on public.downloads
  for insert
  with check (user_id = auth.uid() or is_admin() or auth.role() = 'service_role');

-- Membership policies
create policy "Users can view their own membership"
  on public.membership
  for select
  using (user_id = auth.uid() or is_admin());

create policy "Manage membership system"
  on public.membership
  for all
  using (is_admin() or auth.role() = 'service_role');

-- Cart items policies
create policy "Users can view their own cart items"
  on public.cart_items
  for select
  using (user_id = auth.uid() or is_admin());

create policy "Users can manage their own cart items"
  on public.cart_items
  for all
  using (user_id = auth.uid() or is_admin())
  with check (user_id = auth.uid() or is_admin());

-- Payouts policies
create policy "Creators can view their own payouts"
  on public.payouts
  for select
  using (creator_id = auth.uid() or is_admin());

create policy "Admins can manage all payouts"
  on public.payouts
  for all
  using (is_admin() or auth.role() = 'service_role');

-- Reviews policies
create policy "Anyone can view reviews"
  on public.reviews
  for select
  using (true);

create policy "Users can insert their own reviews"
  on public.reviews
  for insert
  with check (user_id = auth.uid() or is_admin() or auth.role() = 'service_role');

create policy "Users can update their own reviews"
  on public.reviews
  for update
  using (user_id = auth.uid() or is_admin() or auth.role() = 'service_role')
  with check (user_id = auth.uid() or is_admin() or auth.role() = 'service_role');

create policy "Admins can manage all reviews"
  on public.reviews
  for all
  using (is_admin() or auth.role() = 'service_role');

-- Posts policies
create policy "Select posts"
  on public.posts
  for select
  using (true);

create policy "Write posts"
  on public.posts
  for all
  using (author_id = auth.uid() or is_admin() or auth.role() = 'service_role')
  with check (author_id = auth.uid() or is_admin() or auth.role() = 'service_role');

-- Profiles policies
create policy "Select profiles"
  on public.profiles
  for select
  using (true);

create policy "Write profiles"
  on public.profiles
  for all
  using (user_id = auth.uid() or is_admin() or auth.role() = 'service_role')
  with check (user_id = auth.uid() or is_admin() or auth.role() = 'service_role');

-- Follows policies
create policy "Select follows"
  on public.follows
  for select
  using (true);

create policy "Write follows"
  on public.follows
  for all
  using (follower_id = auth.uid() or is_admin() or auth.role() = 'service_role')
  with check (follower_id = auth.uid() or is_admin() or auth.role() = 'service_role');

-- Done --------------------------------------------------------------------
comment on function public.is_admin is 'Security definer helper to check admin role without recursive RLS';
