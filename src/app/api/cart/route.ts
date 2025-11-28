import { NextRequest, NextResponse } from 'next/server'

// Mock cart data for development
let mockCartItems = [
  {
    id: 'cart-1',
    user_id: 'user-1',
    template_id: '1',
    created_at: '2024-01-16T10:00:00Z'
  }
]

const mockTemplates = [
  {
    id: '1',
    title: 'Сошиал медиа пост загвар',
    price: 5000,
    thumbnail_url: 'https://via.placeholder.com/400x300/6C5CE7/FFFFFF?text=Social+Media',
  }
]

export async function GET(request: NextRequest) {
  // In a real app, you would get user_id from session
  const userId = 'user-1'
  
  const userCartItems = mockCartItems.filter(item => item.user_id === userId)
  
  // Add template details to cart items
  const cartWithTemplates = userCartItems.map(item => {
    const template = mockTemplates.find(t => t.id === item.template_id)
    return {
      ...item,
      template
    }
  })

  return NextResponse.json(cartWithTemplates)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { template_id } = body
    
    // In a real app, you would get user_id from session
    const userId = 'user-1'
    
    // Check if item already exists in cart
    const existingItem = mockCartItems.find(
      item => item.user_id === userId && item.template_id === template_id
    )
    
    if (existingItem) {
      return NextResponse.json(
        { error: 'Item already in cart' },
        { status: 400 }
      )
    }
    
    // Add to cart
    const newCartItem = {
      id: `cart-${Date.now()}`,
      user_id: userId,
      template_id,
      created_at: new Date().toISOString()
    }
    
    mockCartItems.push(newCartItem)
    
    return NextResponse.json(newCartItem, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 400 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const template_id = searchParams.get('template_id')
    
    // In a real app, you would get user_id from session
    const userId = 'user-1'
    
    if (!template_id) {
      // Clear entire cart
      mockCartItems = mockCartItems.filter(item => item.user_id !== userId)
    } else {
      // Remove specific item
      mockCartItems = mockCartItems.filter(
        item => !(item.user_id === userId && item.template_id === template_id)
      )
    }
    
    return NextResponse.json({ message: 'Item removed from cart' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to remove from cart' },
      { status: 400 }
    )
  }
}