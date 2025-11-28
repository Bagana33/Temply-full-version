import { NextRequest, NextResponse } from 'next/server'

// Mock data for development
const mockTemplates = [
  {
    id: '1',
    title: 'Сошиал медиа пост загвар',
    description: 'Instagram, Facebook зориулсан мэдээллийн пост загвар. Энгийн, гоёмсгой дизайн.',
    price: 5000,
    thumbnail_url: 'https://via.placeholder.com/400x300/6C5CE7/FFFFFF?text=Social+Media',
    canva_link: 'https://canva.com/template/1',
    category: 'Нийгмийн сүлжээ',
    tags: ['сошиал', 'пост', 'мэдээлэл'],
    status: 'APPROVED',
    creator_id: 'creator-1',
    downloads_count: 150,
    views_count: 1200,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    users: {
      name: 'Батбаатар'
    }
  },
  {
    id: '2',
    title: 'Бизнес презентаци',
    description: 'Бизнес уулзалт, танилцуулга зориулсан PowerPoint загвар.',
    price: 15000,
    thumbnail_url: 'https://via.placeholder.com/400x300/00CEC9/FFFFFF?text=Business',
    canva_link: 'https://canva.com/template/2',
    category: 'Бизнес',
    tags: ['презентаци', 'бизнес', 'уулзалт'],
    status: 'APPROVED',
    creator_id: 'creator-2',
    downloads_count: 89,
    views_count: 650,
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
    users: {
      name: 'Сарангэрэл'
    }
  },
  {
    id: '3',
    title: 'Хүүхдийн төрсөн өдрийн карт',
    description: 'Хүүхдийн төрсөн өдрийн урилга, бэлгийн карт зориулсан загвар.',
    price: 3000,
    thumbnail_url: 'https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Birthday',
    canva_link: 'https://canva.com/template/3',
    category: 'Нийгмийн сүлжээ',
    tags: ['төрсөн өдөр', 'хүүхэд', 'урьдлага'],
    status: 'APPROVED',
    creator_id: 'creator-1',
    downloads_count: 200,
    views_count: 1800,
    created_at: '2024-01-05T10:00:00Z',
    updated_at: '2024-01-05T10:00:00Z',
    users: {
      name: 'Батбаатар'
    }
  },
  {
    id: '4',
    title: 'Ресторан цэс',
    description: 'Ресторан, кафе зориулсан цэсний загвар. Аравал, гоёмсгой дизайн.',
    price: 8000,
    thumbnail_url: 'https://via.placeholder.com/400x300/4ECDC4/FFFFFF?text=Menu',
    canva_link: 'https://canva.com/template/4',
    category: 'Хоол хүнс',
    tags: ['цэс', 'ресторан', 'кафе'],
    status: 'APPROVED',
    creator_id: 'creator-3',
    downloads_count: 67,
    views_count: 450,
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-01-12T10:00:00Z',
    users: {
      name: 'Ганбаатар'
    }
  },
  {
    id: '5',
    title: 'Боловсролын постер',
    description: 'Сургууль, курс зориулсан зар сурталчилгааны постер загвар.',
    price: 6000,
    thumbnail_url: 'https://via.placeholder.com/400x300/9B59B6/FFFFFF?text=Education',
    canva_link: 'https://canva.com/template/5',
    category: 'Боловсрол',
    tags: ['боловсрол', 'постер', 'сургууль'],
    status: 'APPROVED',
    creator_id: 'creator-2',
    downloads_count: 95,
    views_count: 720,
    created_at: '2024-01-08T10:00:00Z',
    updated_at: '2024-01-08T10:00:00Z',
    users: {
      name: 'Сарангэрэл'
    }
  }
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')
  const category = searchParams.get('category')
  const sort = searchParams.get('sort') || 'created_at'
  const status = searchParams.get('status')

  let filteredTemplates = [...mockTemplates]

  // Filter by status
  if (status) {
    filteredTemplates = filteredTemplates.filter(t => t.status === status)
  }

  // Filter by search term
  if (search) {
    const searchLower = search.toLowerCase()
    filteredTemplates = filteredTemplates.filter(template =>
      template.title.toLowerCase().includes(searchLower) ||
      template.description.toLowerCase().includes(searchLower) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchLower))
    )
  }

  // Filter by category
  if (category) {
    filteredTemplates = filteredTemplates.filter(template =>
      template.category === category
    )
  }

  // Sort
  filteredTemplates.sort((a, b) => {
    switch (sort) {
      case 'price':
        return a.price - b.price
      case 'views_count':
        return b.views_count - a.views_count
      case 'downloads_count':
        return b.downloads_count - a.downloads_count
      case 'title':
        return a.title.localeCompare(b.title)
      case 'created_at':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
  })

  return NextResponse.json(filteredTemplates)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Mock creation
    const newTemplate = {
      id: Date.now().toString(),
      ...body,
      status: 'PENDING',
      downloads_count: 0,
      views_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    return NextResponse.json(newTemplate, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 400 }
    )
  }
}