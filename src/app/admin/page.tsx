'use client'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Shield, Users, ClipboardCheck, BarChart2 } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'


export default function AdminPage() {
  const [templateCount, setTemplateCount] = useState<number | null>(null)
  const [userCount, setUserCount] = useState<number | null>(null)
  const [revenue, setRevenue] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      setLoading(true)
      if (!supabase) {
        setTemplateCount(null)
        setUserCount(null)
        setRevenue(null)
        setLoading(false)
        return
      }
      // Загварын тоо (status = 'PENDING' гэж үзье)
      const { data: templates, error: templatesError } = await supabase
        .from('templates')
        .select('id, status')
      setTemplateCount(templates ? templates.filter(t => t.status === 'PENDING').length : 0)

      // Идэвхтэй хэрэглэгчийн тоо
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id')
      setUserCount(users ? users.length : 0)

      // Сүүлийн 7 хоногийн орлого (purchases table)
      const lastWeek = new Date()
      lastWeek.setDate(lastWeek.getDate() - 7)
      const { data: purchases, error: purchasesError } = await supabase
        .from('purchases')
        .select('amount, created_at')
      const weekRevenue = purchases
        ? purchases.filter(p => p.created_at && new Date(p.created_at) >= lastWeek)
            .reduce((sum, p) => sum + (p.amount ?? 0), 0)
        : 0
      setRevenue(weekRevenue)
      setLoading(false)
    }
    fetchStats()
  }, [])

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col gap-2">
            <Badge className="w-fit bg-purple-100 text-purple-700 text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Админ хяналт
            </Badge>
            <h1 className="text-3xl font-bold text-gray-900">Админ самбар</h1>
            <p className="text-gray-600">
              Платформын төлөв, дизайнерын хүсэлт, хэрэглэгчийн статистикийг эндээс хянаарай.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-500">Шалгах шаардлагатай загвар</CardTitle>
                <ClipboardCheck className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : templateCount}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-500">Идэвхтэй хэрэглэгч</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : userCount}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-500">Сүүлийн 7 хоногийн орлого</CardTitle>
                <BarChart2 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : `₮${revenue?.toLocaleString()}`}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Системийн мэдэгдэл</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-gray-600">
              <p>
                {loading
                  ? 'Статистик мэдээлэл ачааллаж байна...'
                  : 'Бодит backend холбогдсон. Статистик мэдээлэл Supabase-аас авч байна.'}
              </p>
              <Button className="bg-primary hover:bg-primary/90 w-fit">Шинэ загвар шалгах</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}

