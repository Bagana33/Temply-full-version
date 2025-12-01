'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ShoppingCart, ExternalLink } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

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
  const { role } = useAuth()
  const isCreator = role === 'CREATOR'
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
    <Card className="group relative bg-transparent p-0 shadow-none">
      <div className="relative overflow-hidden rounded-[28px] bg-white shadow-[0_22px_70px_-30px_rgba(15,23,42,0.65)] transition-transform duration-300 group-hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-64 sm:h-72 overflow-hidden">
          <Link href={`/templates/${template.id}`}>
            <Image
              src={mainImage}
              alt={template.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
          {/* Dark gradient overlay at bottom */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/85 via-black/60 to-transparent" />

          {/* Text and price overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-4 pt-6 text-white">
            <div className="mb-2 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <Link href={`/templates/${template.id}`}>
                  <h3 className="font-semibold text-lg leading-snug text-white line-clamp-1">
                    {template.title}
                  </h3>
                </Link>
                {template.description && (
                  <p className="text-xs text-slate-200/80 line-clamp-1">
                    {template.description}
                  </p>
                )}
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {template.category && (
                    <Badge variant="outline" className="border-white/20 bg-white/5 text-[11px] text-slate-50">
                      {template.category}
                    </Badge>
                  )}
                  {tags.slice(0, 2).map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-white/10 text-[11px] text-slate-50 backdrop-blur-sm"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="mt-1 h-8 w-8 rounded-full bg-white/10 text-slate-100 hover:bg-white/20"
              >
                <Link href={`/templates/${template.id}`} aria-label="Дэлгэрэнгүй">
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-1 flex items-center justify-between">
              {!isCreator && (
                <button
                  type="button"
                  onClick={() => onAddToCart?.(template.id)}
                  className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-1 text-sm font-semibold text-slate-900 shadow-sm transition-colors hover:bg-white"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>{priceLabel}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
