'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { TemplateCard } from '@/components/TemplateCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Grid, List, SlidersHorizontal, Sparkles } from 'lucide-react'
import { Database } from '@/types/database'
import { useAuth } from '@/contexts/AuthContext'
import { TEMPLATE_CATEGORIES, TEMPLATE_QUICK_FILTERS } from '@/lib/templateCategories'

type Template = {
  id: string
  title: string
  description: string
  price: number
  thumbnail_url: string
  preview_images?: string[] | null
  canva_link: string
  category: string
  tags: string[]
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  creator_id: string
  downloads_count: number
  views_count: number
  created_at: string
  updated_at: string
  users?: {
    name?: string | null
  } | null
}

function TemplatesContent() {
  const searchParams = useSearchParams()
  const { session } = useAuth()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
  const [sortBy, setSortBy] = useState('created_at')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const categories = [...TEMPLATE_CATEGORIES]

  const sortOptions = [
    { value: 'created_at', label: 'Шинээр нэмэгдсэн' },
    { value: 'views_count', label: 'Үзсэн' },
    { value: 'downloads_count', label: 'Татсан' },
    { value: 'price', label: 'Үнээр' },
    { value: 'title', label: 'Нэрээр' }
  ]

  const quickFilters = TEMPLATE_QUICK_FILTERS

  useEffect(() => {
    fetchTemplates()
  }, [searchTerm, selectedCategory, sortBy])

  const fetchTemplates = async () => {
    setLoading(true)
    setErrorMessage(null)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory)
      params.append('sort', sortBy)
      params.append('status', 'APPROVED')

      const response = await fetch(`/api/templates?${params}`)
      if (!response.ok) {
        throw new Error('Загваруудыг ачаалах боломжгүй байна. Дахин оролдоно уу.')
      }
      const json = await response.json()
      const data = Array.isArray(json) ? json : json.templates
      setTemplates(data || [])
      setErrorMessage(null)
    } catch (error) {
      setErrorMessage('Загваруудыг ачаалах боломжгүй байна. Сүлжээг шалгаад дахин оролдоно уу.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (templateId: string) => {
    setErrorMessage(null)
    try {
      if (!session) {
        setErrorMessage('Нэвтэрч орсны дараа сагсанд нэмэх боломжтой')
        return
      }
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ template_id: templateId })
      })
      
      if (response.ok) {
        // Global event to let Navbar/cart update its count
        window.dispatchEvent(new CustomEvent('cart-updated'))
        setErrorMessage(null)
      }
    } catch (error) {
      setErrorMessage('Сагсанд нэмэх үед алдаа гарлаа. Дахин оролдоно уу.')
    }
  }

  const handleBuyNow = (templateId: string) => {
    // Redirect to checkout
    window.location.href = `/checkout?template=${templateId}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        {/* Header */}
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                Шинэ, хамгийн их татсан загварууд
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Загварууд</h1>
              <p className="text-lg text-gray-600">
                Мэргэжилтэн дизайнчилсан Canva загваруудаас сонгоорой
              </p>
            </div>
            <div className="hidden sm:block text-sm text-gray-500">
              <span className="font-semibold text-gray-900">{templates.length}</span> загвар бэлэн
            </div>
          </div>
          {errorMessage && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Result summary */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" />
            <span>{templates.length} загвар олдлоо</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Эрэмбэлэх: {sortOptions.find((s) => s.value === sortBy)?.label}</span>
          </div>
        </div>
      </div>

      {/* Templates Grid/List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-4 h-44 rounded-lg bg-slate-100" />
                <div className="mb-2 h-4 rounded bg-slate-100" />
                <div className="h-4 w-3/4 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : templates.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mb-4 text-5xl">📁</div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Загвар олдсонгүй</h3>
            <p className="mb-6 text-gray-600">
              Хайлтын нөхцөлд тохирох загвар байхгүй байна.
            </p>
            <div className="flex items-center justify-center gap-2">
              <Button onClick={() => setSearchTerm('')} variant="outline">
                Хайлт арилгах
              </Button>
              <Button onClick={() => setSelectedCategory('all')} variant="outline">
                Бүх ангилал
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }
          >
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function TemplatesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>}>
      <TemplatesContent />
    </Suspense>
  )
}
