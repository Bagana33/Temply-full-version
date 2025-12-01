-- ============================================
-- TEMPLY Supabase Database Schema
-- ============================================
-- 
-- Энэ файл нь Temply платформын бүх хүснэгт, функц, trigger, 
-- болон Row Level Security policies-ийг үүсгэдэг.
--
-- Ашиглах заавар:
-- 1. Supabase Dashboard (https://app.supabase.com) руу очно уу
-- 2. SQL Editor нээнэ уу
-- 3. Энэ файлын бүх агуулгыг хуулж буулгана уу
-- 4. "Run" товч дараана уу
--
-- Анхаар: Энэ скрипт нь idempotent байдаг (олон удаа ажиллуулж болно)
-- ============================================

-- ============================================
-- 1. EXTENSIONS
-- ============================================
-- pgcrypto: UUID үүсгэх, нууц үг хэшлэх зэрэгт ашиглана
create extension if not exists "pgcrypto";

-- ============================================
-- 2. CLEANUP (Хуучин trigger, function устгах)
-- ============================================
-- Энэ хэсэг нь хуучин trigger болон function-уудыг устгаж, 
-- дахин ажиллуулахад алдаа гарахгүй байхыг хангана

-- Auth users trigger устгах
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'auth' and table_name = 'users'
  ) then
    execute 'drop trigger if exists on_auth_user_created on auth.users';
  end if;
end $$;

-- Users table trigger устгах
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'users'
  ) then
    execute 'drop trigger if exists update_users_updated_at on public.users';
  end if;
end $$;

-- Templates table trigger устгах
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'templates'
  ) then
    execute 'drop trigger if exists update_templates_updated_at on public.templates';
  end if;
end $$;

-- Profiles table trigger устгах
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'profiles'
  ) then
    execute 'drop trigger if exists update_profiles_updated_at on public.profiles';
  end if;
end $$;

-- Posts table trigger устгах
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'posts'
  ) then
    execute 'drop trigger if exists update_posts_updated_at on public.posts';
  end if;
end $$;

-- Functions устгах (is_admin()-ийг эхлээд policies устгасны дараа устгана)
drop function if exists public.handle_new_user();
drop function if exists public.update_updated_at_column();
-- is_admin() function-ийг policies устгасны дараа устгана (доор харна уу)

-- ============================================
-- 3. TABLES (Хүснэгтүүд)
-- ============================================

-- Users table
-- Хэрэглэгчийн үндсэн мэдээлэл (auth.users-тай холбогдсон)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text not null,
  role text not null check (role in ('USER', 'CREATOR', 'ADMIN')) default 'USER',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

comment on table public.users is 'Хэрэглэгчийн үндсэн мэдээлэл';
comment on column public.users.id is 'Auth users-тай холбогдсон UUID';
comment on column public.users.role is 'Хэрэглэгчийн эрх: USER, CREATOR, эсвэл ADMIN';

-- Templates table
-- Загваруудын мэдээлэл
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  price integer not null check (price >= 0),
  thumbnail_url text not null,
  canva_link text not null,
  preview_images text[] default '{}',
  category text not null,
  tags text[] default '{}',
  status text check (status in ('PENDING', 'APPROVED', 'REJECTED')) default 'PENDING',
  creator_id uuid references public.users(id) on delete cascade not null,
  downloads_count integer default 0 check (downloads_count >= 0),
  views_count integer default 0 check (views_count >= 0),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Хуучин хүснэгтэд preview_images баганыг нэмэх (idempotent)
alter table public.templates
  add column if not exists preview_images text[] default '{}';

comment on table public.templates is 'Загваруудын мэдээлэл';
comment on column public.templates.status is 'Загварын статус: PENDING (хүлээгдэж байна), APPROVED (зөвшөөрөгдсөн), REJECTED (татгалзсан)';
comment on column public.templates.price is 'Загварын үнэ (төгрөгөөр)';

-- Purchases table
-- Худалдааны түүх
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  template_id uuid references public.templates(id) on delete cascade not null,
  amount integer not null check (amount >= 0),
  created_at timestamptz default now() not null
);

comment on table public.purchases is 'Худалдааны түүх';
comment on column public.purchases.amount is 'Төлсөн дүн (төгрөгөөр)';

-- Downloads table
-- Татаж авах түүх
create table if not exists public.downloads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  template_id uuid references public.templates(id) on delete cascade not null,
  created_at timestamptz default now() not null
);

comment on table public.downloads is 'Загвар татаж авах түүх';

-- Membership table
-- Гишүүнчлэлийн мэдээлэл
create table if not exists public.membership (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references public.users(id) on delete cascade not null,
  plan text not null check (plan in ('BASIC', 'PRO', 'PREMIUM')),
  status text default 'ACTIVE' check (status in ('ACTIVE', 'CANCELLED', 'EXPIRED')),
  start_date timestamptz not null,
  end_date timestamptz not null,
  created_at timestamptz default now() not null
);

comment on table public.membership is 'Гишүүнчлэлийн мэдээлэл';
comment on column public.membership.plan is 'Гишүүнчлэлийн төрөл: BASIC, PRO, эсвэл PREMIUM';

-- Cart items table
-- Сагсны мэдээлэл
create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  template_id uuid references public.templates(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique (user_id, template_id)
);

comment on table public.cart_items is 'Хэрэглэгчийн сагсны мэдээлэл';

-- Payouts table
-- Дизайнеруудад төлбөр төлөх мэдээлэл
create table if not exists public.payouts (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references public.users(id) on delete cascade not null,
  amount integer not null check (amount >= 0),
  status text default 'PENDING' check (status in ('PENDING', 'PAID', 'REJECTED')),
  method text not null,
  details text not null,
  created_at timestamptz default now() not null,
  paid_at timestamptz
);

comment on table public.payouts is 'Дизайнеруудад төлбөр төлөх мэдээлэл';
comment on column public.payouts.status is 'Төлбөрийн статус: PENDING, PAID, эсвэл REJECTED';

-- Reviews table
-- Загваруудын үнэлгээ
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  template_id uuid references public.templates(id) on delete cascade not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  created_at timestamptz default now() not null,
  unique (user_id, template_id)
);

comment on table public.reviews is 'Загваруудын үнэлгээ';
comment on column public.reviews.rating is 'Үнэлгээ (1-5 од)';

-- Posts table
-- Нийтлэлүүд (сошиал функц)
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.users(id) on delete cascade not null,
  content text not null,
  image_url text,
  likes_count integer default 0 check (likes_count >= 0),
  comments_count integer default 0 check (comments_count >= 0),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

comment on table public.posts is 'Нийтлэлүүд (сошиал функц)';

-- Profiles table
-- Хэрэглэгчийн профайл мэдээлэл
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references public.users(id) on delete cascade not null,
  display_name text,
  username text,
  avatar_url text,
  bio text,
  website text,
  location text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

comment on table public.profiles is 'Хэрэглэгчийн профайл мэдээлэл';

-- Follows table
-- Дагах функц (сошиал)
create table if not exists public.follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid references public.users(id) on delete cascade not null,
  following_id uuid references public.users(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique (follower_id, following_id),
  check (follower_id != following_id)
);

comment on table public.follows is 'Хэрэглэгчид бие биенээ дагах функц';
comment on column public.follows.follower_id is 'Дагагч хэрэглэгч';
comment on column public.follows.following_id is 'Дагагдагч хэрэглэгч';

-- ============================================
-- 4. INDEXES (Индексүүд)
-- ============================================
-- Индексүүд нь query хурдыг сайжруулдаг

-- Templates indexes
create index if not exists idx_templates_creator_id on public.templates(creator_id);
create index if not exists idx_templates_status on public.templates(status);
create index if not exists idx_templates_category on public.templates(category);
create index if not exists idx_templates_created_at on public.templates(created_at desc);

-- Purchases indexes
create index if not exists idx_purchases_user_id on public.purchases(user_id);
create index if not exists idx_purchases_template_id on public.purchases(template_id);
create index if not exists idx_purchases_created_at on public.purchases(created_at desc);

-- Downloads indexes
create index if not exists idx_downloads_user_id on public.downloads(user_id);
create index if not exists idx_downloads_template_id on public.downloads(template_id);

-- Cart items indexes
create index if not exists idx_cart_items_user_id on public.cart_items(user_id);
create index if not exists idx_cart_items_template_id on public.cart_items(template_id);

-- Payouts indexes
create index if not exists idx_payouts_creator_id on public.payouts(creator_id);
create index if not exists idx_payouts_status on public.payouts(status);

-- Reviews indexes
create index if not exists idx_reviews_template_id on public.reviews(template_id);
create index if not exists idx_reviews_user_id on public.reviews(user_id);
create index if not exists idx_reviews_rating on public.reviews(rating);

-- Posts indexes
create index if not exists idx_posts_author_id on public.posts(author_id);
create index if not exists idx_posts_created_at on public.posts(created_at desc);

-- Profiles indexes
create index if not exists idx_profiles_user_id on public.profiles(user_id);
create index if not exists idx_profiles_username on public.profiles(username) where username is not null;

-- Follows indexes
create index if not exists idx_follows_follower on public.follows(follower_id);
create index if not exists idx_follows_following on public.follows(following_id);

-- ============================================
-- 5. FUNCTIONS (Функцүүд)
-- ============================================

-- handle_new_user: Auth user үүсэхэд автоматаар public.users болон profiles үүсгэх
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- public.users хүснэгтэд мөр үүсгэх
  insert into public.users (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', 'User'),
    coalesce(new.raw_user_meta_data->>'role', 'USER')
  )
  on conflict (id) do update
  set email = excluded.email,
      name = coalesce(excluded.name, public.users.name);

  -- public.profiles хүснэгтэд мөр үүсгэх
  insert into public.profiles (user_id, display_name, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'User'),
    new.email
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

comment on function public.handle_new_user() is 'Auth user үүсэхэд автоматаар public.users болон profiles үүсгэх';

-- update_updated_at_column: updated_at талбарыг автоматаар шинэчлэх
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function public.update_updated_at_column() is 'updated_at талбарыг автоматаар шинэчлэх';

-- is_admin: Хэрэглэгч админ эсэхийг шалгах (RLS policies-д ашиглана)
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
  
  select role into role_value 
  from public.users 
  where id = auth.uid();
  
  return role_value = 'ADMIN';
exception
  when others then
    return false;
end;
$$;

comment on function public.is_admin() is 'Хэрэглэгч админ эсэхийг шалгах (RLS policies-д ашиглана)';

-- Функцүүдэд эрх олгох
grant execute on function public.is_admin() to anon, authenticated;

-- ============================================
-- 6. TRIGGERS (Trigger-ууд)
-- ============================================

-- Auth user үүсэхэд trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at автоматаар шинэчлэх trigger-ууд
create trigger update_users_updated_at
  before update on public.users
  for each row execute function public.update_updated_at_column();

create trigger update_templates_updated_at
  before update on public.templates
  for each row execute function public.update_updated_at_column();

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at_column();

create trigger update_posts_updated_at
  before update on public.posts
  for each row execute function public.update_updated_at_column();

-- ============================================
-- 7. ROW LEVEL SECURITY (RLS)
-- ============================================
-- RLS нь хэрэглэгч бүр зөвхөн өөрийн мэдээллийг харах, засах эрхтэй байхыг хангана

-- RLS идэвхжүүлэх
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

-- ============================================
-- 8. POLICIES (Бодлогууд)
-- ============================================
-- Хуучин policies устгах (дахин ажиллуулахад алдаа гарахгүй байхын тулд)
-- Анхаар: is_admin() function-д хамааралтай policies-уудыг эхлээд устгах хэрэгтэй

-- Users policies
drop policy if exists "Users can view their own profile" on public.users;
drop policy if exists "Users can update their own profile" on public.users;
drop policy if exists "Admins manage all users" on public.users;

-- Templates policies
drop policy if exists "Anyone can view approved templates" on public.templates;
drop policy if exists "Creators can view their own templates" on public.templates;
drop policy if exists "Admins can view all templates" on public.templates;
drop policy if exists "Creators can insert templates" on public.templates;
drop policy if exists "Creators can update templates" on public.templates;
drop policy if exists "Admins can update templates" on public.templates;
drop policy if exists "Delete templates" on public.templates;

-- Purchases policies
drop policy if exists "Users can view their own purchases" on public.purchases;
drop policy if exists "Admins can view all purchases" on public.purchases;
drop policy if exists "Insert purchases" on public.purchases;
drop policy if exists "Update purchases" on public.purchases;

-- Downloads policies
drop policy if exists "Users can view their own downloads" on public.downloads;
drop policy if exists "Admins can view all downloads" on public.downloads;
drop policy if exists "Insert downloads" on public.downloads;

-- Membership policies
drop policy if exists "Users can view their own membership" on public.membership;
drop policy if exists "Admins can view all memberships" on public.membership;
drop policy if exists "Manage membership system" on public.membership;

-- Cart items policies
drop policy if exists "Users can view their own cart items" on public.cart_items;
drop policy if exists "Users can manage their own cart items" on public.cart_items;

-- Payouts policies
drop policy if exists "Creators can view their own payouts" on public.payouts;
drop policy if exists "Admins can manage all payouts" on public.payouts;

-- Reviews policies
drop policy if exists "Anyone can view reviews" on public.reviews;
drop policy if exists "Users can insert their own reviews" on public.reviews;
drop policy if exists "Users can update their own reviews" on public.reviews;
drop policy if exists "Admins can manage all reviews" on public.reviews;

-- Posts policies
drop policy if exists "Select posts" on public.posts;
drop policy if exists "Write posts" on public.posts;

-- Profiles policies
drop policy if exists "Select profiles" on public.profiles;
drop policy if exists "Write profiles" on public.profiles;

-- Follows policies
drop policy if exists "Select follows" on public.follows;
drop policy if exists "Write follows" on public.follows;

-- ============================================
-- 9. CREATE POLICIES (Бодлогууд үүсгэх)
-- ============================================
-- Анхаар: is_admin() function аль хэдийн үүссэн байна (5-р хэсэгт)
-- create or replace ашиглаж байгаа учир дахин үүсгэх шаардлагагүй

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

-- ============================================
-- 10. COMPLETION
-- ============================================
-- Schema амжилттай суусан!

-- Шалгах query (ажиллуулаад хүснэгтүүд үүссэн эсэхийг харна уу):
-- SELECT table_name 
-- FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- ORDER BY table_name;
