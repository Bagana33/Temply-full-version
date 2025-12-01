'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { TEMPLATE_CATEGORIES } from '@/lib/templateCategories'
import {
  ShoppingCart,
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  Upload,
  Crown,
  Menu,
  X,
  Search,
} from 'lucide-react'
import { useEffect, useState } from 'react'

export function Navbar() {
  const { user, signOut, role, session } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [cartCount, setCartCount] = useState(0)
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
  }

  const getDashboardLink = () => {
    switch (role) {
      case 'ADMIN':
        return '/admin'
      case 'CREATOR':
        return '/dashboard'
      default:
        return '/account'
    }
  }

  const getDashboardLabel = () => {
    switch (role) {
      case 'ADMIN':
        return 'Админ самбар'
      case 'CREATOR':
        return 'Дашборд'
      default:
        return 'Профайл'
    }
  }

  // Cart count fetcher
  useEffect(() => {
    const fetchCartCount = async () => {
      if (!session?.access_token) {
        setCartCount(0)
        return
      }
      try {
        const res = await fetch('/api/cart', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        })
        if (!res.ok) return
        const data = await res.json()
        setCartCount(Array.isArray(data) ? data.length : 0)
      } catch {
        // ignore
      }
    }

    fetchCartCount()

    const handler = () => fetchCartCount()
    window.addEventListener('cart-updated', handler)
    return () => window.removeEventListener('cart-updated', handler)
  }, [session?.access_token])

  const runSearch = () => {
    const query = searchQuery.trim()
    if (!query) {
      router.push('/templates')
      return
    }
    router.push(`/templates?search=${encodeURIComponent(query)}`)
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Temply</span>
          </Link>

          {/* Desktop Navigation + Search */}
          <div className="hidden md:flex items-center flex-1 gap-6">
            <div className="flex items-center space-x-6">
            <Link href="/templates" className="text-gray-700 hover:text-primary transition-colors">
              Загварууд
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-primary transition-colors">
              Үнэ
            </Link>
            <Link href="/creator" className="text-gray-700 hover:text-primary transition-colors">
              Дизайнер болох
            </Link>
            </div>

            {/* Search bar (desktop only) */}
            <div className="hidden lg:flex flex-1">
              <div className="flex w-full items-center rounded-full border border-gray-300 bg-white px-2 py-1.5 shadow-sm">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-gray-700 border-r border-gray-200"
                    >
                      <Menu className="h-4 w-4" />
                      <span>Ангилал</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem
                      onClick={() => router.push('/templates')}
                    >
                      Бүх ангилал
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {TEMPLATE_CATEGORIES.map((category) => (
                      <DropdownMenuItem
                        key={category}
                        onClick={() =>
                          router.push(
                            `/templates?category=${encodeURIComponent(category)}`,
                          )
                        }
                      >
                        {category}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <input
                  type="text"
                  placeholder="Search for anything"
                  className="flex-1 border-0 bg-transparent px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      runSearch()
                    }
                  }}
                />
                <button
                  type="button"
                  className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                  onClick={runSearch}
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right side items */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {/* Cart */}
                <Link href="/cart">
                  <Button variant="ghost" size="sm" className="relative">
                    <ShoppingCart className="h-4 w-4" />
                    {cartCount > 0 && (
                      <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">
                        {cartCount}
                      </span>
                    )}
                  </Button>
                </Link>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.name} />
                        <AvatarFallback>
                          {user.user_metadata?.name?.charAt(0) || user.email?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        {user.user_metadata?.name && (
                          <p className="font-medium">{user.user_metadata?.name}</p>
                        )}
                        {user.email && (
                          <p className="w-[200px] truncate text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        )}
                        {role && (
                          <Badge variant="secondary" className="w-fit">
                            {role === 'ADMIN' ? 'Админ' : role === 'CREATOR' ? 'Үүсгэгч' : 'Хэрэглэгч'}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={getDashboardLink()}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        {getDashboardLabel()}
                      </Link>
                    </DropdownMenuItem>
                    {role === 'CREATOR' && (
                      <DropdownMenuItem asChild>
                        <Link href="/upload">
                          <Upload className="mr-2 h-4 w-4" />
                          Загвар байршуулах
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/account">
                        <Settings className="mr-2 h-4 w-4" />
                        Тохиргоо
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Гарах
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/login">
                  <Button variant="ghost">Нэвтрэх</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Бүртгүүлэх</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-gray-200">
            <Link href="/templates" className="block px-3 py-2 text-gray-700 hover:text-primary">
              Загварууд
            </Link>
            <Link href="/pricing" className="block px-3 py-2 text-gray-700 hover:text-primary">
              Үнэ
            </Link>
            <Link href="/creator" className="block px-3 py-2 text-gray-700 hover:text-primary">
              Дизайнер болох
            </Link>
            {user ? (
              <>
                <Link href="/cart" className="block px-3 py-2 text-gray-700 hover:text-primary">
              Сагс
            </Link>
                <Link href={getDashboardLink()} className="block px-3 py-2 text-gray-700 hover:text-primary">
                  {getDashboardLabel()}
                </Link>
                {role === 'CREATOR' && (
                  <Link href="/upload" className="block px-3 py-2 text-gray-700 hover:text-primary">
                    Загвар байршуулах
                  </Link>
                )}
                <Link href="/account" className="block px-3 py-2 text-gray-700 hover:text-primary">
                  Тохиргоо
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary"
                >
                  Гарах
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block px-3 py-2 text-gray-700 hover:text-primary">
                  Нэвтрэх
                </Link>
                <Link href="/auth/register" className="block px-3 py-2 text-gray-700 hover:text-primary">
                  Бүртгүүлэх
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}