'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ShoppingCart, ExternalLink } from 'lucide-react'

type TemplateCardProps = {
  template: {
    id: string
    title: string
    description?: string
    price: number
    thumbnail_url?: string | null
    preview_images?: string[] | null
    status?: 'PENDING' | 'APPROVED' | 'REJECTED'
    category?: string
    tags?: string[] | null
    downloads_count?: number | null
    views_count?: number | null
    users?: {
      id?: string
      name?: string
    } | null
  }
  onAddToCart?: (templateId: string) => void
  onBuyNow?: (templateId: string) => void
}

export function TemplateCard({ template, onAddToCart, onBuyNow }: TemplateCardProps) {
  const formatPrice = (price: number) => new Intl.NumberFormat('mn-MN').format(price)

  const getStatusColor = (status?: string) => {
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

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'APPROVED':
        return 'Зөвшөөрөгдсөн'
      case 'PENDING':
        return 'Хүлээгдэж буй'
      case 'REJECTED':
        return 'Татгалзсан'
      default:
        return status ?? 'Төлөв тодорхойгүй'
    }
  }

  const priceLabel = `${formatPrice(template.price)}₮`
  const mainImage =
    (template.preview_images && template.preview_images[0]) ||
    template.thumbnail_url ||
    '/placeholder.png'
  const tags = template.tags ?? []

  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_16px_50px_-24px_rgba(0,0,0,0.25)]">
      <div className="relative">
        <Link href={`/templates/${template.id}`}>
          <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
            <Image
              src={mainImage}
              alt={template.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent opacity-40 group-hover:opacity-80 transition-opacity duration-300" />
          </div>
        </Link>

        {/* Top-left status */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <Badge className={`${getStatusColor(template.status)} shadow-sm text-[11px]`}>
            {getStatusText(template.status)}
          </Badge>
        </div>

        {/* Top-right orange Add-to-cart button */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onAddToCart?.(template.id)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-white shadow-md transition-colors hover:bg-orange-600"
            aria-label="Сагсанд нэмэх"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>

      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <Link href={`/templates/${template.id}`}>
              <h3 className="font-semibold text-lg leading-snug text-gray-900 line-clamp-2 hover:text-primary transition-colors">
                {template.title}
              </h3>
            </Link>
            {template.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {template.description}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {template.category && (
                <Badge variant="outline" className="text-[11px] border-dashed">
                  {template.category}
                </Badge>
              )}
              {tags.slice(0, 3).map((tag, index) => (
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

        {/* Price only */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-base font-semibold text-gray-900">{priceLabel}</span>
        </div>
      </CardContent>
    </Card>
  )
}
