'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Send } from 'lucide-react'

export default function ContactPage() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Нүүр хуудас руу буцах
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Холбоо барих</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <Input name="name" placeholder="Таны нэр" required />
                <Input type="email" name="email" placeholder="Имэйл" required />
                <Input name="subject" placeholder="Сэдэв" required />
                <Textarea name="message" placeholder="Мессеж" rows={4} required />
                <Button type="submit" className="w-full" disabled={sent}>
                  <Send className="mr-2 h-4 w-4" />
                  {sent ? 'Илгээгдлээ' : 'Илгээх'}
                </Button>
              </form>
              {sent && (
                <p className="mt-3 text-sm text-green-600">
                  Бид таны захидлыг хүлээн авлаа. 24 цагийн дотор хариу өгөх болно.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Холбоо барих мэдээлэл</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-700">
              <p><span className="font-semibold text-gray-900">Имэйл:</span> support@temply.mn</p>
              <p><span className="font-semibold text-gray-900">Утас:</span> +976 9999-9999</p>
              <p><span className="font-semibold text-gray-900">Хаяг:</span> Улаанбаатар, Монгол</p>
              <p className="text-gray-600">
                Ажиллах цаг: Даваа - Баасан 09:00 - 18:00. Бидэнд имэйл илгээвэл 24 цагийн дотор хариулахыг хичээнэ.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
