'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, ClipboardCheck, Users, BarChart2, AlertTriangle } from 'lucide-react'
import { PendingTemplatesPanel } from './PendingTemplatesPanel'
import { AllTemplatesPanel } from './AllTemplatesPanel'
import { Alert, AlertDescription } from '@/components/ui/alert'

type AdminSummary = {
  templateCount: number
  userCount: number
  revenue: number
}

export default function AdminPage() {
  const { session } = useAuth()
  const [summary, setSummary] = useState<AdminSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSummary = async () => {
      if (!session?.access_token) {
        setError('Нэвтэрсэн байх шаардлагатай')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/admin/summary', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        })

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}))
          throw new Error(payload.error || 'Админ статистик ачаалж чадсангүй')
        }

        const data = (await response.json()) as AdminSummary
        setSummary(data)
      } catch (err) {
        console.error('Admin summary error:', err)
        setError(err instanceof Error ? err.message : 'Алдаа гарлаа')
      } finally {
        setLoading(false)
      }
    }

    loadSummary()
  }, [session?.access_token])

  const templateCount = summary?.templateCount ?? 0
  const userCount = summary?.userCount ?? 0
  const revenue = summary?.revenue ?? 0

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
            Платформын төлөв, хэрэглэгч, борлуулалтын тоймыг эндээс харах.
          </p>
        </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-500">Нийт загвар</CardTitle>
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
              <CardTitle className="text-sm text-gray-500">Нийт хэрэглэгч</CardTitle>
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
              <CardTitle className="text-sm text-gray-500">Нийт орлого</CardTitle>
              <BarChart2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : `₮${revenue.toLocaleString('mn-MN')}`}
                </p>
            </CardContent>
          </Card>
        </div>

        <PendingTemplatesPanel />
        <AllTemplatesPanel />
      </div>
    </div>
    </ProtectedRoute>
  )
}
