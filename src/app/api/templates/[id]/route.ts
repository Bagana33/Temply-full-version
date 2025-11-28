import { NextRequest, NextResponse } from 'next/server'

// Mock data for development
const mockTemplates = [
  {
    id: '1',
    title: 'Сошиал медиа пост загвар',
    description: 'Instagram, Facebook зориулсан мэдээллийн пост загвар. Энгийн, гоёмсгой дизайн. Энэ загвар нь таны брэндийг онцгой тодотгох болно. Орчин үеийн дизайн, уян хатан хэмжээ.',
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
    description: 'Бизнес уулзалт, танилцуулга зориулсан PowerPoint загвар. Мэргэжлийн, цэвэрхэн дизайн.',
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
  }
]

const mockReviews = [
  {
    id: '1',
    rating: 5,
    comment: 'Маш сайн загвар! Хурдан, хялбархан ашиглаж байна.',
    users: {
      name: 'Дорж'
    },
    created_at: '2024-01-16T10:00:00Z'
  },
  {
    id: '2',
    rating: 4,
    comment: 'Гоё дизайн, чанартай бүтээл. Баярлалаа!',
    users: {
      name: 'Болор'
    },
    created_at: '2024-01-15T14:30:00Z'
  }
]

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const templateId = params.id
  
  // Find template by ID
  const template = mockTemplates.find(t => t.id === templateId)
  
  if (!template) {
    return NextResponse.json(
      { error: 'Template not found' },
      { status: 404 }
    )
  }

  // Add mock reviews and related templates
  const templateWithDetails = {
    ...template,
    reviews: mockReviews,
    related_templates: mockTemplates.filter(t => t.id !== templateId).slice(0, 3)
  }

  return NextResponse.json(templateWithDetails)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const templateId = params.id
    const body = await request.json()
    
    // Mock update
    const template = mockTemplates.find(t => t.id === templateId)
    
    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    const updatedTemplate = {
      ...template,
      ...body,
      updated_at: new Date().toISOString()
    }

    return NextResponse.json(updatedTemplate)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const templateId = params.id
    
    // Mock deletion
    const template = mockTemplates.find(t => t.id === templateId)
    
    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Template deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 400 }
    )
  }
}