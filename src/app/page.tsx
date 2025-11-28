'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  Star, 
  Users, 
  Palette, 
  Download, 
  ShoppingCart,
  Zap,
  Shield,
  TrendingUp,
  CheckCircle,
  Search
} from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/10">
              <Zap className="h-3 w-3 mr-1" />
              Мэргэжилтэн дизайнчилсан загварууд
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Дизайнаа <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">хурдан</span>,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">гоё болго.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Мэргэжилтэн дизайнчилсан Canva загваруудыг таны гар хүрэхэд. 
              Хямд, хурдан, чанартай дизайн шийдлүүд.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/templates">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Загваруудыг үзэх
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/creator">
                <Button size="lg" variant="outline">
                  Дизайнер болох
                  <Palette className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">1000+</div>
              <div className="text-gray-600">Загварууд</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-secondary">500+</div>
              <div className="text-gray-600">Дизайнер</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-gray-600">Татаж авсан</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-secondary">4.9/5</div>
              <div className="text-gray-600">Үнэлгээ</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Яаж ажилладаг вэ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Гурван алхамд шийдэлээ олоорой
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>1. Загвар сонгох</CardTitle>
                <CardDescription>
                  Хэдэн зуун мэргэжилтэн дизайнчилсан загваруудаас 
                  танд тохирохыг сонгоно уу.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle>2. Худалдан авах</CardTitle>
                <CardDescription>
                  Хурдан, аюулгүй төлбөр хийж загварын 
                  бүрэн эрхтэй болно.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>3. Татаж авах</CardTitle>
                <CardDescription>
                  Canva дээр шууд нээж хувилбарлаж, 
                  өөрийн хэрэгцээнд зориулж засварлана.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ангилалууд
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Төрөл бүрийн зориулалттай загварууд
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Нийгмийн сүлжээ', icon: '📱', count: 150 },
              { name: 'Бизнес', icon: '💼', count: 200 },
              { name: 'Боловсрол', icon: '📚', count: 100 },
              { name: 'Маркетинг', icon: '📢', count: 180 },
              { name: 'Эрүүл мэнд', icon: '🏥', count: 80 },
              { name: 'Хоол хүнс', icon: '🍔', count: 120 },
              { name: 'Аялал жуулчлал', icon: '✈️', count: 90 },
              { name: 'Технологи', icon: '💻', count: 110 }
            ].map((category, index) => (
              <Link key={index} href={`/templates?category=${category.name}`}>
                <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.count} загвар</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Templates */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Онцлох загварууд
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Хамгийн их татагдсан, үнэлгээ өндөр загварууд
            </p>
          </div>
          
          <div className="text-center">
            <Link href="/templates">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Бүх загваруудыг үзэх
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Membership CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Гишүүнчлэлээр илүү олон давуу тал
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Сар бүр шинэ загварууд, хямд үнэ, зөвхөн гишүүдэд зориулсан контент
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing">
              <Button size="lg" variant="secondary">
                Үнэ харах
                <TrendingUp className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/templates">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-purple-600">
              Үнэгүй загварууд үзэх
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Creator CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Дизайнер болож орлогоо нэмэгдүүлээрэй
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Өөрийн бүтээлээ Temply дээр зарж, мянга мянган хэрэглэгчдэд 
                хүрч, сарын орлогоо нэмэгдүүлээрэй.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">70% хувийн таны орлого</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Хязгааргүй загвар байршуулах</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Дэмжлэг хамгаалалт</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Нийтлэлийн хөтөлбөр</span>
                </div>
              </div>
              <Link href="/creator">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Дизайнер болох
                  <Palette className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 text-center">
              <Users className="h-16 w-16 text-primary mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-lg text-gray-600">Идэвхитэй дизайнер</div>
              <div className="text-2xl font-bold text-primary mt-4 mb-2">₮5M+</div>
              <div className="text-lg text-gray-600">Нийт төлсөн мөнгө</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}