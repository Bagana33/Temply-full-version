'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, CreditCard, ArrowLeft } from 'lucide-react'

type TemplateInfo = {
  id: string
  title: string
  price: number
  thumbnail_url: string
}

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateId = searchParams.get('template')
  const [template, setTemplate] = useState<TemplateInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPaying, setIsPaying] = useState(false)

  useEffect(() => {
    if (!templateId) {
      setError('Загвар сонгогдоогүй байна.')
      setLoading(false)
      return
    }
    fetchTemplate(templateId)
  }, [templateId])

  const fetchTemplate = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/templates/${id}`)
      if (!response.ok) {
        throw new Error('Загварын мэдээлэл олдсонгүй')
      }
      const data = await response.json()
      setTemplate(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Алдаа гарлаа')
    } finally {
      setLoading(false)
    }
  }

  const totalAmount = useMemo(() => template?.price ?? 0, [template])

  const handlePayment = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!template) return

    setIsPaying(true)
    setTimeout(() => {
      setIsPaying(false)
      router.push('/templates')
      alert('Төлбөр амжилттай! Хувийн имэйл рүү холбоос илгээлээ.')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link href="/cart" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Сагс руу буцах
        </Link>

        <h1 className="text-3xl font-bold text-gray-900">Төлбөр хийх</h1>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Картын мэдээлэл</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handlePayment}>
                <div className="space-y-2">
                  <Label htmlFor="name">Карт эзэмшигчийн нэр</Label>
                  <Input id="name" placeholder="Б. Болд" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card">Картын дугаар</Label>
                  <Input id="card" placeholder="XXXX XXXX XXXX XXXX" inputMode="numeric" required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Дуусах огноо</Label>
                    <Input id="expiry" placeholder="MM/YY" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" inputMode="numeric" required />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={!template || loading || isPaying}
                >
                  {isPaying ? 'Төлбөр хийж байна...' : `${totalAmount.toLocaleString('mn-MN')}₮ төлөх`}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Захиалгын мэдээлэл</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <p className="text-sm text-gray-500">Загварын мэдээллийг ачаалж байна...</p>
              ) : template ? (
                <>
                  <div className="rounded-lg border border-gray-200 p-4 bg-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{template.title}</p>
                        <p className="text-sm text-gray-500">ID: {template.id}</p>
                      </div>
                      <span className="font-bold text-purple-600">
                        {template.price.toLocaleString('mn-MN')}₮
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Нийт</span>
                      <span>{totalAmount.toLocaleString('mn-MN')}₮</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Төлөх дүн</span>
                      <span>{totalAmount.toLocaleString('mn-MN')}₮</span>
                    </div>
                  </div>
                  <Alert className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      Төлбөр амжилттай болсны дараа таны имэйл хаяг руу Canva холбоос илгээнэ.
                    </AlertDescription>
                  </Alert>
                </>
              ) : (
                <p className="text-sm text-gray-500">Загварын мэдээлэл олдсонгүй.</p>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CreditCard className="h-4 w-4" />
                Төлбөрийг Stripe/Голомт банкны туршилтын горимоор боловсруулж байна.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 py-10 px-4 flex items-center justify-center text-gray-600">
          Төлбөрийн хуудсыг ачаалж байна...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  )
}
