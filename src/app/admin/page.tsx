'use client'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Shield, Users, ClipboardCheck, BarChart2 } from 'lucide-react'

export default function AdminPage() {
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
            {[
              { label: 'Шалгах шаардлагатай загвар', value: '12', icon: ClipboardCheck },
              { label: 'Идэвхтэй хэрэглэгч', value: '4,820', icon: Users },
              { label: 'Сүүлийн 7 хоногийн орлого', value: '₮3,400,000', icon: BarChart2 }
            ].map((stat) => (
              <Card key={stat.label}>
                <CardHeader className="flex items-center justify-between">
                  <CardTitle className="text-sm text-gray-500">{stat.label}</CardTitle>
                  <stat.icon className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Системийн мэдэгдэл</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-gray-600">
              <p>
                Одоогоор бодит backend холбогдоогүй тул mock өгөгдөл харуулж байна. Энэхүү хуудас нь платформын
                админы хэрэгцээг хангах UI бэлэн болсныг харуулна.
              </p>
              <Button className="bg-primary hover:bg-primary/90 w-fit">Шинэ загвар шалгах</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}

