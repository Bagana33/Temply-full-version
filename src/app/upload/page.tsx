'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { UploadCloud, ArrowLeft } from 'lucide-react'

const defaultTemplate = {
  title: '',
  description: '',
  price: '',
  thumbnail_url: '',
  canva_link: '',
  category: '',
  tags: ''
}

export default function UploadPage() {
  const router = useRouter()
  const [form, setForm] = useState(defaultTemplate)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  // Хэрэглэгчийн мэдээлэл авах
  // useAuth context-оос user-г авна
  // import { useAuth } from '@/contexts/AuthContext'
  // const { user } = useAuth()
  // demo: const user = { id: 'demo-user-id' }
  // Жинхэнэ төсөлд useAuth-г ашиглана
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('temply-current-user') || '{}') : {}

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setMessage(null)
    setError(null)

    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          price: Number(form.price),
          thumbnail_url: form.thumbnail_url,
          canva_link: form.canva_link,
          category: form.category,
          tags: form.tags.split(',').map((tag) => tag.trim()),
          creator_id: user?.id || '',
          created_at: new Date().toISOString()
        })
      })

      if (!response.ok) {
        throw new Error('Загвар илгээхэд алдаа гарлаа')
      }

      setForm(defaultTemplate)
      setMessage('Загвар амжилттай илгээгдлээ! Хяналтын баг шалгаад мэдэгдэнэ.')
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
    <ProtectedRoute allowedRoles={['CREATOR', 'ADMIN']}>
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Link href="/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Дашборд руу буцах
          </Link>

          <div>
            <Badge className="mb-2 bg-primary/10 text-primary">Загвар илгээх</Badge>
            <h1 className="text-3xl font-bold text-gray-900">Шинэ загвар байршуулах</h1>
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
                    <Input id="price" name="price" type="number" min="0" required value={form.price} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Ангилал</Label>
                    <Input id="category" name="category" required value={form.category} onChange={handleChange} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="thumbnail_url">Thumbnail холбоос</Label>
                    <Input
                      id="thumbnail_url"
                      name="thumbnail_url"
                      placeholder="https://..."
                      required
                      value={form.thumbnail_url}
                      onChange={handleChange}
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
                  <Label htmlFor="tags">Түлхүүр үг (таслалаар тусгаарлаж бичнэ үү)</Label>
                  <Input id="tags" name="tags" placeholder="сошиал, маркетинг, подкаст" value={form.tags} onChange={handleChange} />
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
    </ProtectedRoute>
  )
}

