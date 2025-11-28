'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ArrowLeft, MessageCircle } from 'lucide-react'

const faqs = [
  {
    q: 'Загвар татахад алдаа гарлаа, яах вэ?',
    a: 'Интернет холболтоо шалгаад дахин оролдоно уу. Алдаа үргэлжилбэл бидэнтэй холбогдож татах холбоосыг шинэчлүүлээрэй.'
  },
  {
    q: 'Платформ дээр бүртгэлгүйгээр загвар авч болох уу?',
    a: 'Үгүй, худалдан авалт болон таталт бүртгэгдсэн байх ёстой тул бүртгэл шаардлагатай.'
  },
  {
    q: 'Нэхэмжлэх / төлбөрийн баримт яаж авах вэ?',
    a: 'Худалдан авалт амжилттай болсны дараа таны имэйл рүү нэхэмжлэх автоматаар очно. Ирэхгүй бол support@temply.mn хаягаар бичээрэй.'
  },
  {
    q: 'Буруу загвар авчихлаа, буцаах боломжтой юу?',
    a: 'Худалдан авснаас хойш 24 цагийн дотор манай дэмжлэгтэй холбогдож нөхцөл хангасан тохиолдолд солиулах боломжтой.'
  }
]

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Нүүр хуудас руу буцах
          </Link>
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <MessageCircle className="h-4 w-4" />
              Тусламж & Дэмжлэг
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Түгээмэл асуултууд</h1>
            <p className="max-w-2xl text-gray-600">
              Ихэвчлэн тулгардаг асуултын хариуг энд бэлдлээ. Хэрэв танд өөр асуулт байвал бидэнтэй шууд холбогдоорой.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <Card>
            <CardHeader>
              <CardTitle>FAQ</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((item, idx) => (
                  <AccordionItem value={`faq-${idx}`} key={item.q}>
                    <AccordionTrigger className="text-left text-base">{item.q}</AccordionTrigger>
                    <AccordionContent className="text-gray-600">{item.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Тусламж авах</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-gray-700">
              <p>Имэйл: <span className="font-semibold text-gray-900">support@temply.mn</span></p>
              <p>Утас: <span className="font-semibold text-gray-900">+976 9999-9999</span></p>
              <p className="text-gray-600">
                Асуудлаа дэлгэрэнгүй бичиж илгээгээрэй. Бид 24 цагийн дотор хариу өгөх болно.
              </p>
              <Link href="/contact">
                <Button className="w-full">Холбоо барих</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
