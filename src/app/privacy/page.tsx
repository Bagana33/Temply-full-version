'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const sections = [
  {
    title: 'Мэдээлэл цуглуулах',
    body:
      'Бид бүртгэл, захиалга, дэмжлэгийн хүсэлтээс таны нэр, имэйл, төлбөрийн мэдээлэл зэрэг мэдээллийг цуглуулдаг. Эдгээрийг зөвхөн үйлчилгээ үзүүлэх зорилгоор ашиглана.'
  },
  {
    title: 'Мэдээллийг ашиглах',
    body:
      'Бид таны мэдээллийг захиалга боловсруулах, дэмжлэг үзүүлэх, бүтээгдэхүүн шинэчлэлт болон онцгой санал илгээхэд ашиглаж болно. Та сурталчилгааны имэйлийг дур үедээ цуцлах боломжтой.'
  },
  {
    title: 'Хадгалалт ба хамгаалалт',
    body:
      'Таны мэдээллийг шифрлэлт болон стандарт аюулгүй байдлын арга хэмжээгээр хамгаалж, зөвхөн шаардлагатай хугацаанд хадгална.'
  },
  {
    title: 'Гуравдагч тал',
    body:
      'Төлбөрийн үйлчилгээ зэрэг зайлшгүй шаардлагатай тохиолдлоос бусад үед таны мэдээллийг гуравдагч талд худалдахгүй, дамжуулахгүй.'
  },
  {
    title: 'Таны эрх',
    body:
      'Та өөрийн мэдээллийг үзэх, засах, устгуулах хүсэлт гаргах эрхтэй. support@temply.mn хаягаар бидэнтэй холбогдоорой.'
  }
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Нүүр хуудас руу буцах
        </Link>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">Нууцлалын бодлого</h1>
          <p className="mt-3 text-gray-600">
            Temply платформыг ашиглах үед таны хувийн мэдээллийг хэрхэн цуглуулах, ашиглах, хамгаалах талаар дараах мэдээлэл
            багтсан.
          </p>

          <div className="mt-8 space-y-6">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                <p className="mt-2 text-gray-600">{section.body}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-gray-500">
            Сүүлд шинэчилсэн: 2025 оны 11-р сар. Асуулт байвал support@temply.mn хаягаар бичнэ үү.
          </p>
        </div>
      </div>
    </div>
  )
}
