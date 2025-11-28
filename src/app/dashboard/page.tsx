'use client'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PenSquare, LineChart, UploadCloud, DollarSign } from 'lucide-react'

export default function CreatorDashboardPage() {
  return (
    <ProtectedRoute requiredRole="CREATOR">
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Дизайнерын дашборд</h1>
              <p className="text-gray-600">Загварын борлуулалт, статистикаа эндээс хянаарай.</p>
            </div>
            <Link href="/upload">
              <Button className="bg-primary hover:bg-primary/90">
                <UploadCloud className="h-4 w-4 mr-2" />
                Шинэ загвар нэмэх
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Энэ сарын орлого', value: '₮1,200,000', trend: '+12%' },
              { label: 'Нийт таталт', value: '320', trend: '+8%' },
              { label: 'Нийт загвар', value: '28', trend: '+2' }
            ].map((stat) => (
              <Card key={stat.label}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <Badge variant="secondary">{stat.trend}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PenSquare className="h-5 w-5 text-primary" />
                  Миний загварууд
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-gray-600">
                <p>Одоогоор бодит өгөгдөл холбогдоогүй тул mock мэдээлэл харуулж байна.</p>
                <ul className="space-y-3">
                  <li className="flex items-center justify-between">
                    <span>Сошиал пост цуглуулга</span>
                    <Badge variant="outline">75 таталт</Badge>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Бизнес танилцуулга</span>
                    <Badge variant="outline">42 таталт</Badge>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Подкаст Cover</span>
                    <Badge variant="outline">18 таталт</Badge>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-secondary" />
                  Төлбөрийн мэдээлэл
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Орлогоо сар бүрийн 25-нд шилжүүлэх бөгөөд одоогоор дараах төлбөр бэлэн байна.
                </p>
                <div className="rounded-xl border border-gray-200 p-4 bg-white flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Бэлэн мөнгө</p>
                    <p className="text-2xl font-bold text-gray-900">₮850,000</p>
                  </div>
                  <Button variant="outline">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Мөнгө татах
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

