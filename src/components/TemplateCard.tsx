'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ShoppingCart, Download, Eye, ExternalLink } from 'lucide-react'
type Template = {
  id: string
  title: string
  description: string
  price: number
  thumbnail_url: string
  canva_link: string
  category: string
  tags: string[]
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  creator_id: string
  downloads_count: number
  views_count: number
  created_at: string
  updated_at: string
  users: {
    name: string
  }
}

interface TemplateCardProps {
  template: Template
  onAddToCart?: (templateId: string) => void
  onBuyNow?: (templateId: string) => void
}

export function TemplateCard({ template, onAddToCart, onBuyNow }: TemplateCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('mn-MN').format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'Зөвшөөрөгдсөн'
      case 'PENDING':
        return 'Хүлээгдэж буй'
      case 'REJECTED':
        return 'Татгалзсан'
      default:
        return status
    }
  }

  const priceLabel = `${formatPrice(template.price)}₮`

  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_16px_50px_-24px_rgba(0,0,0,0.25)]">
      <div className="relative">
        <Link href={`/templates/${template.id}`}>
          <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
            <Image
              src={template.thumbnail_url}
              alt={template.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent opacity-40 group-hover:opacity-80 transition-opacity duration-300" />
          </div>
        </Link>
        
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <Badge className={`${getStatusColor(template.status)} shadow-sm text-[11px]`}>
            {getStatusText(template.status)}
          </Badge>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <Badge variant="secondary" className="bg-white/95 backdrop-blur-sm text-xs font-semibold shadow-sm">
            {priceLabel}
          </Badge>
        </div>
      </div>

      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <Link href={`/templates/${template.id}`}>
              <h3 className="font-semibold text-lg leading-snug text-gray-900 line-clamp-2 hover:text-primary transition-colors">
                {template.title}
              </h3>
            </Link>
            <p className="text-sm text-gray-600 line-clamp-2">
              {template.description}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-[11px] border-dashed">
                {template.category}
              </Badge>
              {template.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-[11px] bg-slate-100 text-slate-700">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <Button variant="ghost" size="icon" asChild className="h-9 w-9 text-slate-400 hover:text-primary">
            <Link href={`/templates/${template.id}`} aria-label="Дэлгэрэнгүй">
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-800">{template.users.name}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-gray-300" aria-hidden />
            <span className="font-medium text-gray-700">{priceLabel}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4 text-gray-400" />
              <span>{template.views_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="h-4 w-4 text-gray-400" />
              <span>{template.downloads_count}</span>
            </div>
          </div>
        </div>

        {template.status === 'APPROVED' && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Button
              size="sm"
              className="w-full whitespace-nowrap"
              onClick={() => onBuyNow?.(template.id)}
            >
              Худалдаж авах
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full px-3"
              onClick={() => onAddToCart?.(template.id)}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
