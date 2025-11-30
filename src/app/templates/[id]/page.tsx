import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type TemplateDetailPageProps = {
  params: { id: string }
}

export default async function TemplateDetailPage({ params }: TemplateDetailPageProps) {
  const { id } = params
  const supabase = createServerSupabaseClient()

  const { data: template } = await supabase
    .from('templates')
    .select(`
      id,
      title,
      description,
      price,
      thumbnail_url,
      canva_link,
      status,
      users ( id, name )
    `)
    .eq('id', id)
    .eq('status', 'APPROVED')
    .single()

  if (!template) {
    return notFound()
  }

  const authorName = template.users?.name || 'Зохиогч тодорхойгүй'
  const priceLabel = `${new Intl.NumberFormat('mn-MN').format(template.price)}₮`

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/templates" className="text-sm text-gray-600 hover:text-gray-800">
            ← Загварууд руу буцах
          </Link>
          <Badge variant="secondary" className="text-xs">
            {authorName}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="overflow-hidden">
            <div className="relative aspect-[4/3] bg-gray-100">
              <Image
                src={template.thumbnail_url}
                alt={template.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </Card>

          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">{template.title}</h1>
              <p className="text-gray-600">{template.description}</p>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline">Зохиогч: {authorName}</Badge>
              <Badge className="bg-primary text-white">{priceLabel}</Badge>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button className="w-full sm:w-auto">Худалдаж авах</Button>
              <Button variant="outline" className="w-full sm:w-auto">
                Сагсанд нэмэх
              </Button>
            </div>

            {template.canva_link && (
              <div className="pt-4">
                <Link
                  href={template.canva_link}
                  target="_blank"
                  className="text-primary hover:underline text-sm"
                >
                  Canva холбоосыг нээх →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
