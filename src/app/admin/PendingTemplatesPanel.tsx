'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle2, XCircle, Timer } from 'lucide-react'

type PendingTemplate = {
  id: string
  title: string
  description?: string | null
  price: number
  thumbnail_url?: string | null
  status?: 'PENDING' | 'APPROVED' | 'REJECTED'
  creator_id?: string | null
  created_at?: string | null
  users?: {
    name?: string | null
  } | null
}

export function PendingTemplatesPanel() {
  const { session, role, loading: authLoading } = useAuth()
  const [templates, setTemplates] = useState<PendingTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionId, setActionId] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (role === 'ADMIN' && session) {
      loadPending()
    } else {
      setLoading(false)
    }
  }, [role, session, authLoading])

  const loadPending = async () => {
    if (!session) return
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/templates?status=PENDING', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        throw new Error('Хүлээгдэж буй загваруудыг ачаалж чадсангүй')
      }

      const json = await response.json()
      const data = Array.isArray(json) ? json : json.templates
      setTemplates(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Алдаа гарлаа')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (templateId: string, nextStatus: 'APPROVED' | 'REJECTED') => {
    if (!session) return
    setActionId(templateId)
    setError(null)

    try {
      const response = await fetch(`/api/templates/${templateId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ status: nextStatus })
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.error || 'Төлөв шинэчлэхэд алдаа гарлаа')
      }

      setTemplates((prev) => prev.filter((item) => item.id !== templateId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Алдаа гарлаа')
    } finally {
      setActionId(null)
    }
  }

  if (authLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Хүлээгдэж буй загварууд</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-3 text-gray-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          Ачаалж байна...
        </CardContent>
      </Card>
    )
  }

  if (role !== 'ADMIN') {
    return null
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Хүлээгдэж буй загварууд</CardTitle>
          <p className="text-sm text-gray-500">Админ баталгаажуулсны дараа нийтэд харагдана.</p>
        </div>
        <Badge variant="outline" className="gap-1">
          <Timer className="h-3 w-3" />
          {templates.length} хүлээгдэж байна
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Жагсаалтыг татаж байна...
          </div>
        ) : templates.length === 0 ? (
          <div className="text-sm text-gray-500">Хүлээгдэж буй загвар алга байна.</div>
        ) : (
          <div className="space-y-3">
            {templates.map((template) => (
              <div
                key={template.id}
                className="flex flex-col gap-4 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-24 overflow-hidden rounded-md bg-gray-100">
                    {template.thumbnail_url ? (
                      <Image
                        src={template.thumbnail_url}
                        alt={template.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                        Thumbnail
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">{template.title}</p>
                      <Badge variant="secondary" className="text-[11px]">
                        {template.users?.name || 'Тодорхойгүй'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                    <p className="text-sm font-semibold text-primary">{template.price.toLocaleString('mn-MN')}₮</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateStatus(template.id, 'REJECTED')}
                    disabled={actionId === template.id}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Татгалзах
                  </Button>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => updateStatus(template.id, 'APPROVED')}
                    disabled={actionId === template.id}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Зөвшөөрөх
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
