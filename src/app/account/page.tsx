'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, LogOut, Settings, ShieldCheck } from 'lucide-react'

export default function AccountPage() {
  const { user, role, signOut, loading } = useAuth()

  useEffect(() => {
    // Scroll to top to avoid staying at previous page position
    window.scrollTo(0, 0)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle>Нэвтрэх шаардлагатай</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Энэхүү хуудсыг харах үчүн эхлээд нэвтэрнэ үү.
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/auth/login">
                <Button className="w-full">Нэвтрэх</Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="outline" className="w-full">
                  Бүртгүүлэх
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Нүүр хуудас руу буцах
        </Link>

        <h1 className="text-3xl font-bold text-gray-900">Миний профайл</h1>

        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{user.user_metadata?.name || 'Нэргүй хэрэглэгч'}</CardTitle>
              <p className="text-gray-500">{user.email}</p>
            </div>
            {role && (
              <Badge variant="secondary" className="w-fit">
                {role === 'ADMIN' ? 'Админ' : role === 'CREATOR' ? 'Дизайнер' : 'Хэрэглэгч'}
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Settings className="h-4 w-4 text-primary" />
                  Аккаунтын мэдээлэл
                </h3>
                <p className="text-sm text-gray-500">Бүртгэгдсэн: {new Date(user.created_at).toLocaleDateString('mn-MN')}</p>
                <Separator className="my-3" />
                <p className="text-sm text-gray-500">
                  Сүүлд нэвтэрсэн: {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('mn-MN') : 'Тодорхойгүй'}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  Аюулгүй байдал
                </h3>
                <p className="text-sm text-gray-500">Имэйл баталгаажсан: {user.email_confirmed_at ? 'Тийм' : 'Үгүй'}</p>
                <Separator className="my-3" />
                <p className="text-sm text-gray-500">
                  Та нууц үгээ мартсан бол{' '}
                  <Link href="/auth/login" className="text-primary underline">
                    энд дарж шинэчилнэ үү
                  </Link>.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="flex-1" variant="outline" asChild>
                <Link href="/templates">Загварууд үзэх</Link>
              </Button>
              <Button className="flex-1" variant="outline" asChild>
                <Link href="/pricing">Гишүүнчлэл шинэчлэх</Link>
              </Button>
              <Button className="flex-1" variant="destructive" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Гарах
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

