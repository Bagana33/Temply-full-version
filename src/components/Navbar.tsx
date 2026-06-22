'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ArrowRight,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
  Upload,
  X,
} from 'lucide-react'

const baseNavItems = [
  { href: '/templates', label: 'Загварууд' },
  { href: '/pricing', label: 'Үнэ' },
  { href: '/creator', label: 'Дизайнер болох' },
]

export function Navbar() {
  const { user, signOut, role, session } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [cartCount, setCartCount] = useState(0)

  const navItems = role === 'CREATOR'
    ? [
        { href: '/templates', label: 'Загварууд' },
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/upload', label: 'Загвар оруулах' },
      ]
    : baseNavItems

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const fetchCartCount = async () => {
      if (!session?.access_token) {
        setCartCount(0)
        return
      }

      try {
        const response = await fetch('/api/cart', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        if (!response.ok) return
        const data = await response.json()
        setCartCount(Array.isArray(data) ? data.length : 0)
      } catch {
        // Cart failure should not block navigation.
      }
    }

    fetchCartCount()
    const handler = () => fetchCartCount()
    window.addEventListener('cart-updated', handler)
    return () => window.removeEventListener('cart-updated', handler)
  }, [session?.access_token])

  const runSearch = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    const query = searchQuery.trim()
    router.push(query ? `/templates?search=${encodeURIComponent(query)}` : '/templates')
  }

  const getDashboardLink = () => {
    if (role === 'ADMIN') return '/admin'
    if (role === 'CREATOR') return '/dashboard'
    return '/account'
  }

  const getDashboardLabel = () => {
    if (role === 'ADMIN') return 'Админ самбар'
    if (role === 'CREATOR') return 'Миний загварууд'
    return 'Профайл'
  }

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-white/90 backdrop-blur-xl">
      <div className="border-b border-black/[0.05] bg-[#171827] text-white">
        <Link href="/creator" className="mx-auto flex min-h-8 max-w-7xl items-center justify-center gap-2 px-4 text-center text-xs text-white/70 transition hover:text-white sm:text-sm">
          <Sparkles className="h-3.5 w-3.5 text-[#00CEC9]" />
          Дизайнер уу? Бүтээлээ Temply дээр зарж орлого олоорой.
          <ArrowRight className="hidden h-3.5 w-3.5 sm:block" />
        </Link>
      </div>

      <nav className="mx-auto flex h-[70px] max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="Temply home">
          <div className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-[#6C5CE7] text-sm font-extrabold text-white shadow-lg shadow-[#6C5CE7]/20 transition group-hover:-rotate-3 group-hover:scale-105">
            <span className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-[#00CEC9]" />
            <span className="relative">T</span>
          </div>
          <span className="text-xl font-extrabold tracking-[-0.035em] text-[#202124]">Temply</span>
        </Link>

        <div className="ml-4 hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-[#F1EFFF] text-[#6C5CE7]' : 'text-[#5F6368] hover:bg-[#F7F7FA] hover:text-[#202124]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <form onSubmit={runSearch} className="mx-auto hidden w-full max-w-md items-center rounded-xl border border-black/[0.08] bg-[#F7F7FA] px-3 transition focus-within:border-[#6C5CE7]/40 focus-within:bg-white focus-within:ring-4 focus-within:ring-[#6C5CE7]/5 md:flex">
          <Search className="h-4 w-4 shrink-0 text-[#A0A2A8]" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Загвар хайх..."
            className="h-10 w-full bg-transparent px-3 text-sm text-[#2D3436] outline-none placeholder:text-[#A0A2A8]"
            aria-label="Загвар хайх"
          />
        </form>

        <div className="ml-auto hidden shrink-0 items-center gap-2 md:flex">
          {user ? (
            <>
              <Link href="/cart" className="relative grid h-10 w-10 place-items-center rounded-xl text-[#5F6368] transition hover:bg-[#F7F7FA] hover:text-[#202124]" aria-label="Сагс">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute right-0.5 top-0.5 min-w-4 rounded-full bg-[#6C5CE7] px-1 text-center text-[10px] font-bold leading-4 text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full p-0.5 ring-offset-2 transition hover:ring-2 hover:ring-[#6C5CE7]/25" aria-label="Профайл цэс">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.name || 'User'} />
                      <AvatarFallback className="bg-[#6C5CE7] text-sm font-semibold text-white">
                        {user.user_metadata?.name?.charAt(0) || user.email?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 rounded-2xl p-2">
                  <div className="px-2 py-2">
                    <p className="font-semibold text-[#202124]">{user.user_metadata?.name || 'Temply хэрэглэгч'}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="rounded-xl">
                    <Link href={getDashboardLink()}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      {getDashboardLabel()}
                    </Link>
                  </DropdownMenuItem>
                  {role === 'CREATOR' && (
                    <DropdownMenuItem asChild className="rounded-xl">
                      <Link href="/upload">
                        <Upload className="mr-2 h-4 w-4" />
                        Загвар байршуулах
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild className="rounded-xl">
                    <Link href="/account">
                      <Settings className="mr-2 h-4 w-4" />
                      Тохиргоо
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="rounded-xl text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Гарах
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#4E5257] transition hover:bg-[#F7F7FA] hover:text-[#202124]">
                Нэвтрэх
              </Link>
              <Link href="/auth/register" className="rounded-xl bg-[#6C5CE7] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#6C5CE7]/15 transition hover:-translate-y-0.5 hover:bg-[#7B6CF0]">
                Бүртгүүлэх
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          className="ml-auto grid h-10 w-10 place-items-center rounded-xl text-[#2D3436] transition hover:bg-[#F7F7FA] md:hidden"
          aria-label={isMobileMenuOpen ? 'Цэс хаах' : 'Цэс нээх'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {isMobileMenuOpen && (
        <div className="border-t border-black/[0.06] bg-white px-4 pb-5 pt-4 shadow-xl md:hidden">
          <form onSubmit={runSearch} className="flex items-center rounded-xl border border-black/[0.08] bg-[#F7F7FA] px-3">
            <Search className="h-4 w-4 text-[#A0A2A8]" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Загвар хайх..."
              className="h-11 w-full bg-transparent px-3 text-sm outline-none"
            />
          </form>

          <div className="mt-3 space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="block rounded-xl px-3 py-3 font-medium text-[#4E5257] transition hover:bg-[#F7F7FA] hover:text-[#6C5CE7]">
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-4 border-t border-black/[0.06] pt-4">
            {user ? (
              <div className="grid gap-2">
                <Link href="/cart" className="flex items-center justify-between rounded-xl px-3 py-3 font-medium text-[#4E5257] hover:bg-[#F7F7FA]">
                  Сагс
                  {cartCount > 0 && <span className="rounded-full bg-[#6C5CE7] px-2 py-0.5 text-xs font-bold text-white">{cartCount}</span>}
                </Link>
                <Link href={getDashboardLink()} className="rounded-xl px-3 py-3 font-medium text-[#4E5257] hover:bg-[#F7F7FA]">{getDashboardLabel()}</Link>
                <button onClick={signOut} className="rounded-xl px-3 py-3 text-left font-medium text-red-600 hover:bg-red-50">Гарах</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/auth/login" className="rounded-xl border border-black/10 px-4 py-3 text-center text-sm font-semibold text-[#2D3436]">Нэвтрэх</Link>
                <Link href="/auth/register" className="rounded-xl bg-[#6C5CE7] px-4 py-3 text-center text-sm font-semibold text-white">Бүртгүүлэх</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
