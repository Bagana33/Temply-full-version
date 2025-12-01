'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PenSquare, UploadCloud } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

type MyTemplate = {
  id: string
  title: string
  status?: 'PENDING' | 'APPROVED' | 'REJECTED'
  price: number
}

export default function CreatorDashboardPage() {
  const { session } = useAuth()
  const [templates, setTemplates] = useState<MyTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      if (!session?.access_token) {
        setLoading(false)
        return
      }
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/templates?status=PENDING', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        })
        if (!res.ok) {
          throw new Error('Миний загваруудыг ачаалж чадсангүй')
        }
        const json = await res.json()
        const data = Array.isArray(json) ? json : json.templates
        setTemplates(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Алдаа гарлаа')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [session?.access_token])

  const formatStatus = (status?: string) => {
    switch (status) {
      case 'APPROVED':
        return { label: 'Зөвшөөрөгдсөн', className: 'bg-green-100 text-green-800' }
      case 'PENDING':
        return { label: 'Хяналтанд', className: 'bg-yellow-100 text-yellow-800' }
      case 'REJECTED':
        return { label: 'Татгалзсан', className: 'bg-red-100 text-red-800' }
      default:
        return { label: 'Тодорхойгүй', className: 'bg-gray-100 text-gray-800' }
    }
  }

  return (
    <ProtectedRoute requiredRole="CREATOR">
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Миний загварууд</h1>
              <p className="text-gray-600">Өөрийн оруулсан Canva загваруудыг эндээс удирдаарай.</p>
            </div>
            <Link href="/upload">
              <Button className="bg-primary hover:bg-primary/90">
                <UploadCloud className="h-4 w-4 mr-2" />
                Шинэ загвар нэмэх
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenSquare className="h-5 w-5 text-primary" />
                Миний оруулсан загварууд
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-gray-500">Ачаалж байна...</p>
              ) : error ? (
                <p className="text-sm text-red-600">{error}</p>
              ) : templates.length === 0 ? (
                <p className="text-sm text-gray-500">Одоогоор оруулсан загвар алга байна.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {templates.map((tpl) => {
                    const status = formatStatus(tpl.status)
                    return (
                      <li key={tpl.id} className="flex items-center justify-between py-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-900">{tpl.title}</p>
                          <p className="text-xs text-gray-500">
                            Үнэ: {new Intl.NumberFormat('mn-MN').format(tpl.price)}₮
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
                          >
                            {status.label}
                          </span>
                          <Link href={`/upload?templateId=${tpl.id}`}>
                            <Button variant="outline" size="sm">
                              Засах
                            </Button>
                          </Link>
                          <Link href={`/templates/${tpl.id}`}>
                            <Button variant="ghost" size="sm">
                              Харах
                            </Button>
                          </Link>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}

