'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const clauses = [
  {
    title: 'Үйлчилгээ ашиглах',
    body:
      'Temply платформыг ашигласнаар та хуульд нийцсэн, бусдын эрх ашгийг хохироохгүй байдлаар загваруудыг хэрэглэх үүрэг хүлээнэ.'
  },
  {
    title: 'Худалдан авалт ба төлбөр',
    body:
      'Төлбөр амжилттай хийгдсэний дараа загварын татах эрх нээгдэнэ. Төлбөрийг буцаах нөхцөлийг тусгайлан тохирно.'
  },
  {
    title: 'Оюуны өмч',
    body:
      'Загварууд Temply болон зохиогчийн оюуны өмч бөгөөд зөвхөн хувь хэрэглээ, эсвэл тохиролцсон нөхцөлтэйгөөр ашиглана.'
  },
  {
    title: 'Хариуцлагаас чөлөөлөх',
    body:
      'Платформын ашиглалттай холбоотой шууд бус алдагдалд Temply хариуцлага хүлээхгүй. Үйлчилгээ түр зогсох боломжтой.'
  },
  {
    title: 'Өөрчлөлт',
    body:
      'Бид нөхцөлөө шинэчлэх эрхтэй. Шинэчилсэн нөхцөл нийтлэгдсэнээр хүчинтэй болно.'
  }
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Нүүр хуудас руу буцах
        </Link>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">Үйлчилгээний нөхцөл</h1>
          <p className="mt-3 text-gray-600">
            Temply платформыг ашиглахтай холбоотой эрх, үүргийг дараах нөхцөлд тусгалаа.
          </p>

          <div className="mt-8 space-y-6">
            {clauses.map((item) => (
              <div key={item.title}>
                <h2 className="text-xl font-semibold text-gray-900">{item.title}</h2>
                <p className="mt-2 text-gray-600">{item.body}</p>
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
