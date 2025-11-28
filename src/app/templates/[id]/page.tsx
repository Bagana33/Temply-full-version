'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ShoppingCart, 
  Star, 
  Download, 
  Eye, 
  Heart, 
  Share2, 
  ArrowLeft,
  ExternalLink,
  Calendar,
  Tag
} from 'lucide-react'
import { Database } from '@/types/database'

type Template = Database['public']['Tables']['templates']['Row'] & {
  users: {
    name: string
  }
  reviews?: Array<{
    id: string
    rating: number
    comment: string
    users: {
      name: string
    }
    created_at: string
  }>
  related_templates?: Template[]
}

export default function TemplateDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchTemplate(params.id as string)
    }
  }, [params.id])

  const fetchTemplate = async (id: string) => {
    try {
      const response = await fetch(`/api/templates/${id}`)
      if (response.ok) {
        const data = await response.json()
        setTemplate(data)
      } else {
        router.push('/templates')
      }
    } catch (error) {
      console.error('Error fetching template:', error)
      router.push('/templates')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!template) return
    
    setAddingToCart(true)
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template_id: template.id })
      })
      
      if (response.ok) {
        alert('Загвар сагсанд нэмэгдлээ!')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setAddingToCart(false)
    }
  }

  const handleBuyNow = () => {
    if (!template) return
    router.push(`/checkout?template=${template.id}`)
  }

  const handleShare = async () => {
    if (navigator.share && template) {
      try {
        await navigator.share({
          title: template.title,
          text: template.description,
          url: window.location.href
        })
      } catch (error) {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(window.location.href)
        alert('Холбоос хуулагдлаа!')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-200 rounded-lg h-96"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Загвар олдсонгүй</h2>
          <Button onClick={() => router.push('/templates')}>
            Загварууд руу буцах
          </Button>
        </div>
      </div>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('mn-MN').format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('mn-MN')
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Буцах
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Preview Image */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-white border border-gray-200">
              <Image
                src={template.thumbnail_url}
                alt={template.title}
                fill
                className="object-cover"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={addingToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {addingToCart ? 'Нэмж байна...' : 'Сагсанд нэмэх'}
              </Button>
              <Button
                className="flex-1 bg-purple-600 hover:bg-purple-700"
                onClick={handleBuyNow}
              >
                Худалдаж авах - {formatPrice(template.price)}₮
              </Button>
            </div>
          </div>

          {/* Template Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge className="bg-green-100 text-green-800">
                  Зөвшөөрөгдсөн
                </Badge>
                <Badge variant="outline">{template.category}</Badge>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {template.title}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                {template.description}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {template.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6 text-gray-600">
              <div className="flex items-center space-x-1">
                <Eye className="h-5 w-5" />
                <span>{template.views_count.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Download className="h-5 w-5" />
                <span>{template.downloads_count.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-5 w-5" />
                <span>{formatDate(template.created_at)}</span>
              </div>
            </div>

            <Separator />

            {/* Creator Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={template.users.name} />
                  <AvatarFallback>
                    {template.users.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{template.users.name}</p>
                  <p className="text-sm text-gray-600">Дизайнер</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Профайл харах
              </Button>
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex space-x-4">
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Хуваалцах
              </Button>
              <Button variant="outline">
                <Heart className="h-4 w-4 mr-2" />
                Таалагдсан
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Тайлбар</TabsTrigger>
            <TabsTrigger value="canva">Canva заавар</TabsTrigger>
            <TabsTrigger value="reviews">Сэтгэгдэл</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Загварын дэлгэрэнгүй</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p>{template.description}</p>
                  <div className="mt-4 space-y-2">
                    <h4 className="font-semibold">Загварын онцлог:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>Canva дээр шууд засварлах боломжтой</li>
                      <li>Хэмжээг өөрчлөх боломжтой</li>
                      <li>Өнгө, фонт өөрчлөх боломжтой</li>
                      <li>Хэвлэх чанартай</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="canva" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Canva дээр хэрхэн ашиглах вэ?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Алхам 1: Загварыг нээх</h4>
                    <p className="text-blue-800">
                      Худалдан авсны дараа танд Canva холбоос ирнэ. Энэхүү холбоосыг дарж загварыг нээнэ үү.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2">Алхам 2: Хувилбарлах</h4>
                    <p className="text-green-800">
                      Загварыг өөрийн хэрэгцээнд нийцүүлж текст, зураг, өнгө зэргийг өөрчилж болно.
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-900 mb-2">Алхам 3: Татаж авах</h4>
                    <p className="text-purple-800">
                      Засварласан загвараа PNG, JPG, PDF зэрэг форматаар татаж авна.
                    </p>
                  </div>
                  
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Canva дээр нээх
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Хэрэглэгчдийн сэтгэгдэл</CardTitle>
              </CardHeader>
              <CardContent>
                {template.reviews && template.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {template.reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {review.users.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{review.users.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-sm text-gray-500">
                              {formatDate(review.created_at)}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Сэтгэгдэл байхгүй байна</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Templates */}
        {template.related_templates && template.related_templates.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Холбогдох загварууд</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {template.related_templates.map((relatedTemplate) => (
                <Card key={relatedTemplate.id} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                    <Image
                      src={relatedTemplate.thumbnail_url}
                      alt={relatedTemplate.title}
                      width={300}
                      height={225}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                      {relatedTemplate.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-purple-600 font-bold">
                        {formatPrice(relatedTemplate.price)}₮
                      </span>
                      <Link href={`/templates/${relatedTemplate.id}`}>
                        <Button size="sm" variant="outline">
                          Үзэх
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}