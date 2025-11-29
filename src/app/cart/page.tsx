'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ShoppingCart, Trash2, ArrowLeft, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

type CartItem = {
  id: string
  template_id: string
  template: {
    id: string
    title: string
    price: number
    thumbnail_url: string
  }
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const { session, user } = useAuth()

  useEffect(() => {
    if (session) {
      fetchCart()
    } else {
      setLoading(false)
    }
  }, [session])

  const fetchCart = async () => {
    setLoading(true)
    setError(null)
    try {
      if (!session) {
        setError('Нэвтэрч орсны дараа сагсыг харах боломжтой')
        setItems([])
        return
      }
      const response = await fetch('/api/cart', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })
      if (!response.ok) {
        throw new Error('Сагс ачаалах боломжгүй байна')
      }
      const data = (await response.json()) as CartItem[]
      setItems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Алдаа гарлаа')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (templateId?: string) => {
    try {
      setRemovingId(templateId ?? 'all')
      if (!session) {
        throw new Error('Нэвтэрсэн байх шаардлагатай')
      }
      const url = templateId ? `/api/cart?template_id=${templateId}` : '/api/cart'
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })
      if (!response.ok) {
        throw new Error('Сагснаас хасахад алдаа гарлаа')
      }
      if (templateId) {
        setItems((prev) => prev.filter((item) => item.template_id !== templateId))
      } else {
        setItems([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Алдаа гарлаа')
    } finally {
      setRemovingId(null)
    }
  }

  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.template?.price ?? 0), 0)
  }, [items])

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link href="/templates" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Загварууд руу буцах
        </Link>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Миний сагс</h1>
            <p className="text-gray-500">
              {user ? `Танд ${items.length} загвар байна` : 'Нэвтэрч орж сагсаа үзнэ үү'}
            </p>
          </div>
          {items.length > 0 && user && (
            <Button
              variant="outline"
              onClick={() => handleRemove()}
              disabled={removingId === 'all'}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Сагс хоослох
            </Button>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Загварууд</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-10">
                  <ShoppingCart className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600 mb-4">Таны сагс хоосон байна</p>
                  <Link href="/templates">
                    <Button>Загварууд үзэх</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row gap-4 rounded-xl border border-gray-200 p-4 bg-white"
                    >
                      <div className="relative h-32 w-full sm:w-40 overflow-hidden rounded-lg bg-gray-100">
                        {item.template?.thumbnail_url && (
                          <Image
                            src={item.template.thumbnail_url}
                            alt={item.template.title}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold">{item.template?.title}</h3>
                            <p className="text-sm text-gray-500">ID: {item.template_id}</p>
                          </div>
                          <span className="text-xl font-bold text-purple-600">
                            {item.template?.price?.toLocaleString('mn-MN')}₮
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemove(item.template_id)}
                            disabled={removingId === item.template_id}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Сагснаас хасах
                          </Button>
                          <Link href={`/templates/${item.template_id}`}>
                            <Button variant="outline" size="sm">
                              Дэлгэрэнгүй
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Тооцоо</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Нийт загвар</span>
                <span>{items.length} ширхэг</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Нийт төлөх дүн</span>
                <span>{totalPrice.toLocaleString('mn-MN')}₮</span>
              </div>
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={items.length === 0}
                asChild
              >
                <Link href={items.length ? `/checkout?template=${items[0].template_id}` : '#'}>
                  Тооцоо хийх
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/templates">Шоппинг үргэлжлүүлэх</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
