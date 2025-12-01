'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { UploadCloud, ArrowLeft } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TEMPLATE_CATEGORIES } from '@/lib/templateCategories'

const defaultTemplate = {
  title: '',
  description: '',
  price: '',
  canva_link: '',
  category: '',
  tags: ''
}

export default function UploadPageClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateId = searchParams.get('templateId')
  const isEditing = Boolean(templateId)
  const [form, setForm] = useState(defaultTemplate)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { user, session } = useAuth()
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [previewFiles, setPreviewFiles] = useState<(File | null)[]>([null, null, null, null])
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState<string | null>(null)
  const [existingPreviewUrls, setExistingPreviewUrls] = useState<string[]>([])

  useEffect(() => {
    const loadTemplate = async () => {
      if (!templateId || !session?.access_token) return
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/templates/${templateId}`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        })
        if (!res.ok) {
          throw new Error('Загварыг ачаалж чадсангүй')
        }
        const data = await res.json()
        setForm({
          title: data.title ?? '',
          description: data.description ?? '',
          price: String(data.price ?? ''),
          canva_link: data.canva_link ?? '',
          category: data.category ?? '',
          tags: Array.isArray(data.tags) ? data.tags.join(', ') : ''
        })
        setExistingThumbnailUrl(data.thumbnail_url ?? null)
        setExistingPreviewUrls(data.preview_images ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Алдаа гарлаа')
      } finally {
        setLoading(false)
      }
    }
    loadTemplate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId, session?.access_token])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }))
  }

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setThumbnailFile(file)
  }

  const handlePreviewChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setPreviewFiles((prev) => {
      const next = [...prev]
      next[index] = file
      return next
    })
  }

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('Зураг upload хийхэд алдаа гарлаа')
    }

    const data = await response.json()
    return data.url as string
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setMessage(null)
    setError(null)

    try {
      const accessToken = session?.access_token
      if (!user || !accessToken) {
        throw new Error('Нэвтэрсэн байх шаардлагатай')
      }

      let thumbnailUrl = existingThumbnailUrl
      if (thumbnailFile) {
        thumbnailUrl = await uploadImage(thumbnailFile)
      }
      if (!thumbnailUrl) {
        throw new Error('Үндсэн зургийг заавал оруулах шаардлагатай')
      }

      const previewUrls: string[] = [...existingPreviewUrls]
      for (const file of previewFiles) {
        if (file) {
          const url = await uploadImage(file)
          previewUrls.push(url)
        }
      }

      const payload = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        thumbnail_url: thumbnailUrl,
        canva_link: form.canva_link,
        preview_images: previewUrls,
        category: form.category,
        tags: form.tags.split(',').map((tag) => tag.trim()),
        creator_id: user.id,
        created_at: new Date().toISOString()
      }

      const response = await fetch(isEditing ? `/api/templates/${templateId}` : '/api/templates', {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error('Загвар илгээхэд алдаа гарлаа')
      }

      setForm(defaultTemplate)
      setThumbnailFile(null)
      setPreviewFiles([null, null, null, null])
      setExistingThumbnailUrl(null)
      setExistingPreviewUrls([])
      setMessage(isEditing ? 'Загвар амжилттай шинэчлэгдлээ.' : 'Загвар амжилттай илгээгдлээ! Хяналтын баг шалгаад мэдэгдэнэ.')
      setTimeout(() => {
        router.push('/dashboard')
      }, 1200)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Алдаа гарлаа')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Дашборд руу буцах
        </Link>

        <div>
          <Badge className="mb-2 bg-primary/10 text-primary">
            {isEditing ? 'Загвар засах' : 'Загвар илгээх'}
          </Badge>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Загвар засварлах' : 'Шинэ загвар байршуулах'}
          </h1>
          <p className="text-gray-600">
            Canva дээр бүтээсэн загварын мэдээллийг бүрэн бөглөж илгээгээрэй. Одоогоор mock API ашиглаж байна.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Загварын мэдээлэл</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="title">Загварын нэр</Label>
                <Input id="title" name="title" required value={form.title} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Тайлбар</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  value={form.description}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Үнэ (₮)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    required
                    value={form.price}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Ангилал</Label>
                  <Select
                    value={form.category}
                    onValueChange={(value) =>
                      setForm((prev) => ({
                        ...prev,
                        category: value
                      }))
                    }
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Ангиллаа сонгоно уу" />
                    </SelectTrigger>
                    <SelectContent>
                      {TEMPLATE_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="thumbnail">Үндсэн зураг (thumbnail)</Label>
                    <Input
                      id="thumbnail"
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="canva_link">Canva холбоос</Label>
                    <Input
                      id="canva_link"
                      name="canva_link"
                      placeholder="https://canva.com/..."
                      required
                      value={form.canva_link}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Нэмэлт preview зураг (ихдээ 4 ширхэг)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePreviewChange(0, e)}
                    />
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePreviewChange(1, e)}
                    />
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePreviewChange(2, e)}
                    />
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePreviewChange(3, e)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Түлхүүр үг (таслалаар тусгаарлаж бичнэ үү)</Label>
                <Input
                  id="tags"
                  name="tags"
                  placeholder="сошиал, маркетинг, подкаст"
                  value={form.tags}
                  onChange={handleChange}
                />
              </div>

              {message && (
                <Alert className="bg-green-50 text-green-700 border-green-200">
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading}>
                <UploadCloud className="h-4 w-4 mr-2" />
                {loading ? 'Илгээж байна...' : 'Загвар илгээх'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


