'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Palette, 
  Users, 
  TrendingUp, 
  Shield, 
  Star,
  ArrowRight,
  CheckCircle,
  DollarSign,
  Globe,
  Zap
} from 'lucide-react'

export default function CreatorPage() {
  const benefits = [
    {
      icon: <DollarSign className="h-8 w-8 text-green-600" />,
      title: 'Өндөр орлого',
      description: 'Загварын үнийн 70% нь таны орлого. Хязгааргүй орлогын боломж.'
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: 'Олон мянган хэрэглэгч',
      description: 'Монгол улсад бидний платформоор сая мянган хүн загвар хайж байна.'
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      title: 'Хамгаалалт',
      description: 'Таны бүтээлийг зөвшөөрөлгүй ашиглахаас хамгаална.'
    },
    {
      icon: <Globe className="h-8 w-8 text-teal-600" />,
      title: 'Дэлхийд хүрэх',
      description: 'Олон улсын зах зээлд хүрэх боломж. Гадаад хэл дээр загвар байршуулах.'
    }
  ]

  const steps = [
    {
      number: '1',
      title: 'Бүртгүүлэх',
      description: 'Тэмплэдизайнер бүртгэл үүсгэж, дизайнерын эрх авна.'
    },
    {
      number: '2',
      title: 'Загвар байршуулах',
      description: 'Canva дээр хийсэн загвараа шууд байршуулна.'
    },
    {
      number: '3',
      title: 'Зөвшөөрөл',
      description: 'Манай баг шалгаж, зөвшөөрөөд зах зээлд гаргана.'
    },
    {
      number: '4',
      title: 'Орлого олох',
      description: 'Худалдагдсан тус бүрт орлого олоод төлбөр авна.'
    }
  ]

  const stats = [
    { number: '500+', label: 'Идэвхитэй дизайнер' },
    { number: '10M+', label: 'Нийт татсан' },
    { number: '₮5M+', label: 'Төлсөн мөнгө' },
    { number: '1000+', label: 'Нийт загвар' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary">
                <Palette className="h-3 w-3 mr-1" />
                Дизайнер хөтөлбөр
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Өөрийн <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">дизайнаа</span><br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">орлого болго</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Canva загварууд байршуулж, мянга мянган хэрэглэгчдэд 
                хүрч, сарын тогтмол орлого олоорой.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/register">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Дизайнер болох
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/templates">
                  <Button size="lg" variant="outline">
                    Загварууд үзэх
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 text-center">
                <Palette className="h-24 w-24 text-primary mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Дизайнер хөтөлбөр</h3>
                <p className="text-gray-600 mb-6">
                  Мэргэжилтэн дизайнчилсан загваруудыг бидний платформд 
                  байршуулж, орлогоо нэмэгдүүлээрэй.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-primary">70%</div>
                    <div className="text-sm text-gray-600">Таны хувь</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-secondary">24/7</div>
                    <div className="text-sm text-gray-600">Худалдаа</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className={`text-3xl md:text-4xl font-bold ${index % 2 === 0 ? 'text-primary' : 'text-secondary'}`}>
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Яагаад Temply дээр дизайнер болох вэ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Монголын хамгийн том загварын маркетплейс дээр өөрийн бүтээлээ 
              зарж, олон мянган хэрэглэгчдэд хүрээрэй.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4">{benefit.icon}</div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Хэрхэн ажилладаг вэ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Дөрвөн хялбар алхамд дизайнер болох
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full">
                    <div className="flex items-center justify-center">
                      <ArrowRight className="h-6 w-6 text-purple-300" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Шаардлагууд
            </h2>
            <p className="text-xl text-gray-600">
              Дизайнер болохын тулд эдгээр шаардлагуудыг хангах хэрэгтэй
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Техник шаардлага
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Canva-д ажиллах чадвар</li>
                  <li>• Компьютер, интернет холболт</li>
                  <li>• Үндсэн дизайн мэдлэг</li>
                  <li>• Файл удирдах чадвар</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-2" />
                  Чанарын шаардлага
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Өндөр чанарын дизайн</li>
                  <li>• Оригинал бүтээл</li>
                  <li>• Монгол хэл дээр контент</li>
                  <li>• Зөв хэмжээ, формат</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Амжилтын түүхүүд
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Манай дизайнчид ямар амжилтад хүрч байна вэ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Батбаатар',
                role: 'График дизайнер',
                earnings: '₮800,000/сар',
                templates: 45,
                story: 'Temply дээр орж сарын орлогоо 3 дахин нэмэгдүүлсэн.'
              },
              {
                name: 'Сарангэрэл',
                role: 'UI/UX дизайнер',
                earnings: '₮1,200,000/сар',
                templates: 78,
                story: 'Үндсэн ажлаа орхиод зөвхөн загвар зарж амьдардаг болсон.'
              },
              {
                name: 'Ганбаатар',
                role: 'Брэнд дизайнер',
                earnings: '₮600,000/сар',
                templates: 32,
                story: 'Сэтгэгдэл сайтай загваруудаараа хэрэглэгчдийн тав тухыг олгож байна.'
              }
            ].map((creator, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-teal-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-purple-600">
                      {creator.name.charAt(0)}
                    </span>
                  </div>
                  <CardTitle>{creator.name}</CardTitle>
                  <p className="text-gray-600">{creator.role}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="text-2xl font-bold text-green-600">{creator.earnings}</div>
                    <div className="text-sm text-gray-600">{creator.templates} загвар</div>
                  </div>
                  <p className="text-gray-600 italic">"{creator.story}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Өнөөдөр эхлээрэй
          </h2>
          <p className="text-xl mb-8">
            Өөрийн авъяас чадвараа орлого болгох боломж энд байна.
            Хүлээлгүй бүртгүүлээд эхлээрэй!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" variant="secondary">
                <Zap className="h-4 w-4 mr-2" />
                Дизайнер болох
              </Button>
            </Link>
            <Link href="/upload">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                Загвар байршуулах
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}