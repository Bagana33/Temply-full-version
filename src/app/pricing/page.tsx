'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PricingCard } from '@/components/PricingCard'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Crown, Zap, Shield, Star } from 'lucide-react'

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const pricingPlans = [
    {
      title: 'Basic',
      price: billingCycle === 'monthly' ? 0 : 0,
      description: 'Хувь хүн болон жижиг бизнесд зориулсан',
      features: [
        '10 үнэгүй загвар сар бүр',
        'Үндсэн ангиллууд',
        'Стандарт чанар',
        'Имэйл дэмжлэг',
        '1 сар хадгалах'
      ],
      buttonText: 'Үнэгүй эхлэх',
      icon: <Shield className="h-8 w-8 text-gray-600" />
    },
    {
      title: 'Pro',
      price: billingCycle === 'monthly' ? 15000 : 150000,
      description: 'Идэвхитэй хэрэглэгчдэд зориулсан',
      features: [
        'Хязгааргүй загвар татаж авах',
        'Бүх ангилалд хандах',
        'Өндөр чанарын загварууд',
        'Шууд дэмжлэг',
        '6 сар хадгалах',
        'Шинэ загварууд түрүүлж харах',
        'Ad-free туршлага'
      ],
      buttonText: 'Pro гишүүн болох',
      popular: true,
      icon: <Zap className="h-8 w-8 text-purple-600" />
    },
    {
      title: 'Premium',
      price: billingCycle === 'monthly' ? 30000 : 300000,
      description: 'Бизнес болон багуудад зориулсан',
      features: [
        'Pro бүх боломжууд',
        'Нийтээс татаж авах',
        'Коммерциал эрхтэй',
        'Урьдчилан сануулах дэмжлэг',
        'Үл хязгаарлагдмал хадгалалт',
        'API хандах эрх',
        'Багийн гишүүд нэмэх',
        'Тусгай захиалга'
      ],
      buttonText: 'Premium гишүүн болох',
      icon: <Crown className="h-8 w-8 text-yellow-600" />
    }
  ]

  const handlePlanSelect = (planTitle: string) => {
    // In a real app, this would redirect to checkout
    console.log(`Selected plan: ${planTitle}`)
    alert(`${planTitle} төлөвлөгөөг сонгосон байна. Төлбөрийн хуудас руу шилжүүлнэ.`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-primary/10 text-primary">
            <Star className="h-3 w-3 mr-1" />
            14 хоногийн үнэгүй туршилт
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Танд тохирох <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">гишүүнчлэл</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Төлбөрийн төлөвлөгөөгөө сонгоод дэлхийн мэргэжилтэн дизайнчилсан 
            загваруудыг хязгааргүй татаж аваарай.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-lg ${billingCycle === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Сар бүр
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-lg ${billingCycle === 'yearly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Жил бүр
              <Badge className="ml-2 bg-green-100 text-green-800">
                20% хөнгөлөлт
              </Badge>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <PricingCard
                key={index}
                title={plan.title}
                price={plan.price}
                description={plan.description}
                features={plan.features}
                popular={plan.popular}
                buttonText={plan.buttonText}
                onButtonClick={() => handlePlanSelect(plan.title)}
                icon={plan.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Төлөвлөгөөний харьцуулалт
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Таны хэрэгцээнд тохирох боломжыг харна уу
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Боломж</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Basic</th>
                  <th className="text-center py-4 px-6 font-semibold text-purple-600">Pro</th>
                  <th className="text-center py-4 px-6 font-semibold text-yellow-600">Premium</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Үнэгүй загварууд', basic: '10/сар', pro: 'Хязгааргүй', premium: 'Хязгааргүй' },
                  { feature: 'Платформ загварууд', basic: 'Үгүй', pro: 'Хязгааргүй', premium: 'Хязгааргүй' },
                  { feature: 'Коммерциал эрх', basic: 'Үгүй', pro: 'Үгүй', premium: 'Тийм' },
                  { feature: 'Дэмжлэг', basic: 'Имэйл', pro: 'Шууд', premium: 'Урьдчилан сануулах' },
                  { feature: 'Хадгалах хугацаа', basic: '1 сар', pro: '6 сар', premium: 'Үл хязгаарлагдмал' },
                  { feature: 'Багийн гишүүд', basic: '1', pro: '1', premium: '5+' },
                  { feature: 'API хандах эрх', basic: 'Үгүй', pro: 'Үгүй', premium: 'Тийм' }
                ].map((row, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium text-gray-900">{row.feature}</td>
                    <td className="py-4 px-6 text-center text-gray-600">{row.basic}</td>
                    <td className="py-4 px-6 text-center text-purple-600 font-medium">{row.pro}</td>
                    <td className="py-4 px-6 text-center text-yellow-600 font-medium">{row.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Түгээмэл асуултууд
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                question: 'Гишүүнчлэлээ цуцлах боломжтой юу?',
                answer: 'Тиймээ. Та хүссэн үедээ гишүүнчлэлээ цуцлаж болно. Цуцалсны дараа тухайн сарын төгсгөл хүртэл ашиглах боломжтой.'
              },
              {
                question: 'Төлбөрийн хэрхэн хийдэг вэ?',
                answer: 'Банк картын, QPay, SocialPay зэрэг олон төрлийн төлбөрийн хэрэгсэл ашиглаж болно. Төлбөр аюулгүй, шифрлэгдсэн орчинд явагдана.'
              },
              {
                question: 'Нэг гишүүнчлэлээр хэдэн хэрэглэгч ашиглаж болох вэ?',
                answer: 'Basic болон Pro төлөвлөгөөнд нэг хэрэглэгч, Premium төлөвлөгөөнд 5 хүртэлх багийн гишүүд нэмэх боломжтой.'
              },
              {
                question: 'Загваруудыг татаж авсны дараа хэрхэн ашиглах вэ?',
                answer: 'Татаж авсан загваруудаа Canva дээр шууд нээж, өөрийн хэрэгцээнд нийцүүлж засварлаж болно. Мөн PNG, JPG, PDF зэрэг форматаар татаж авах боломжтой.'
              }
            ].map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{faq.answer}</p>
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
            14 хоногийн үнэгүй туршилтаар бүх боломжыг туршаж үзээрэй
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" variant="secondary">
                Үнэгүй туршилт эхлэх
                <Check className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/templates">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-purple-600">
                Загварууд үзэх
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}