'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Edit, Trash2, RefreshCw, FileText } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type Template = {
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

export function AllTemplatesPanel() {
  const { session, role, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionId, setActionId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return

    if (role === 'ADMIN' && session) {
      loadAllTemplates()
    } else {
      setLoading(false)
      if (role && role !== 'ADMIN') {
        setError(`Админ эрх шаардлагатай. Таны эрх: ${role}`)
      } else if (!session) {
        setError('Нэвтрэх мэдээлэл олдсонгүй')
      }
    }
  }, [role, session, authLoading])

  const loadAllTemplates = async () => {
    if (!session?.access_token) {
      setError('Нэвтрэх мэдээлэл олдсонгүй. Дахин нэвтэрнэ үү.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      // Бүх статусын template-үүдийг авах
      const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
        fetch('/api/templates?status=PENDING', {
          headers: { Authorization: `Bearer ${session.access_token}` }
        }),
        fetch('/api/templates?status=APPROVED', {
          headers: { Authorization: `Bearer ${session.access_token}` }
        }),
        fetch('/api/templates?status=REJECTED', {
          headers: { Authorization: `Bearer ${session.access_token}` }
        })
      ])

      const pendingData = pendingRes.ok ? await pendingRes.json() : { templates: [] }
      const approvedData = approvedRes.ok ? await approvedRes.json() : { templates: [] }
      const rejectedData = rejectedRes.ok ? await rejectedRes.json() : { templates: [] }

      const allTemplates = [
        ...(Array.isArray(pendingData) ? pendingData : pendingData.templates || []),
        ...(Array.isArray(approvedData) ? approvedData : approvedData.templates || []),
        ...(Array.isArray(rejectedData) ? rejectedData : rejectedData.templates || [])
      ]

      setTemplates(allTemplates)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Алдаа гарлаа'
      setError(errorMessage)
      console.error('Load all templates error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (templateId: string) => {
    if (!session?.access_token) return

    setActionId(templateId)
    setError(null)

    try {
      const response = await fetch(`/api/templates/${templateId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.error || 'Устгах үед алдаа гарлаа')
      }

      const template = templates.find(t => t.id === templateId)
      setTemplates((prev) => prev.filter((item) => item.id !== templateId))
      
      toast({
        title: 'Амжилттай устгагдлаа',
        description: `"${template?.title}" загвар устгагдсан.`,
        variant: 'default',
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Алдаа гарлаа'
      setError(errorMessage)
      toast({
        title: 'Алдаа гарлаа',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setActionId(null)
      setDeleteDialogOpen(false)
      setTemplateToDelete(null)
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'APPROVED':
        return 'Зөвшөөрөгдсөн'
      case 'PENDING':
        return 'Хүлээгдэж буй'
      case 'REJECTED':
        return 'Татгалзсан'
      default:
        return status ?? 'Тодорхойгүй'
    }
  }

  if (authLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Бүх загварууд</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-3 text-gray-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          Ачаалж байна...
        </CardContent>
      </Card>
    )
  }

  if (role !== 'ADMIN') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Бүх загварууд</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              Админ эрх шаардлагатай. Таны эрх: {role || 'Тодорхойгүй'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Бүх загварууд
            </CardTitle>
            <p className="text-sm text-gray-500">Бүх загваруудыг засах, устгах боломжтой.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              {templates.length} нийт
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={loadAllTemplates}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Дахин ачаалах
            </Button>
          </div>
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
            <div className="text-sm text-gray-500">Загвар алга байна.</div>
          ) : (
            <div className="space-y-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="flex flex-col gap-4 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4 flex-1">
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
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900">{template.title}</p>
                        <Badge className={`${getStatusColor(template.status)} text-[11px]`}>
                          {getStatusText(template.status)}
                        </Badge>
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
                      asChild
                      className="gap-1"
                    >
                      <Link href={`/upload?templateId=${template.id}`}>
                        <Edit className="h-4 w-4" />
                        Засах
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setTemplateToDelete(template.id)
                        setDeleteDialogOpen(true)
                      }}
                      disabled={actionId === template.id}
                      className="gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Устгах
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Загварыг устгах уу?</AlertDialogTitle>
            <AlertDialogDescription>
              Энэ үйлдлийг буцаах боломжгүй. Загвар бүрэн устгагдах болно.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Цуцлах</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (templateToDelete) {
                  handleDelete(templateToDelete)
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Устгах
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

