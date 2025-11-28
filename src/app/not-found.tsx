'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft, Compass, Sparkles } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary/5 via-white to-secondary/10">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-20 top-10 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-4xl items-center px-6 py-16">
        <div className="w-full rounded-3xl border border-slate-200 bg-white/80 p-10 shadow-xl backdrop-blur">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex items-center gap-3 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-primary">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold">404 · Хуудас олдсонгүй</span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">Алдаа гарлаа</h1>
            <p className="max-w-2xl text-lg text-gray-600">
              Хүссэн хуудас одоогоор байхгүй байна. Доорх товчоор буцах эсвэл нүүр хуудас руу орж үргэлжлүүлээрэй.
            </p>

            <div className="grid w-full gap-3 sm:grid-cols-3">
              <Link href="/" className="sm:col-span-2">
                <Button size="lg" className="w-full bg-primary hover:bg-primary/90">
                  <Home className="mr-2 h-4 w-4" />
                  Нүүр хуудас руу буцах
                </Button>
              </Link>
              <Link href="/templates">
                <Button variant="outline" size="lg" className="w-full">
                  <Compass className="mr-2 h-4 w-4" />
                  Загварууд үзэх
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="lg"
                className="sm:col-span-3"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Өмнөх хуудсанд буцах
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
