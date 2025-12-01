/**
 * Example usage of Prisma Client with Neon database
 * 
 * Note: These examples assume the database schema has been applied.
 * Run the schema migration first using supabase-schema.sql
 */

import { prisma } from './client'

// Example: Get all approved templates
export async function getAllApprovedTemplates() {
  try {
    const templates = await prisma.templates.findMany({
      where: {
        status: 'APPROVED'
      },
      orderBy: {
        created_at: 'desc'
      },
      include: {
        users: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })
    return templates
  } catch (error) {
    console.error('Error fetching templates:', error)
    throw error
  }
}

// Example: Get a single template by ID
export async function getTemplateById(id: string) {
  try {
    const template = await prisma.templates.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
    return template
  } catch (error) {
    console.error('Error fetching template:', error)
    throw error
  }
}

// Example: Create a new template
export async function createTemplate(data: {
  title: string
  description: string
  price: number
  thumbnail_url: string
  canva_link: string
  category: string
  tags?: string[]
  creator_id: string
}) {
  try {
    const template = await prisma.templates.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        thumbnail_url: data.thumbnail_url,
        canva_link: data.canva_link,
        category: data.category,
        tags: data.tags || [],
        creator_id: data.creator_id,
        status: 'PENDING'
      }
    })
    return template
  } catch (error) {
    console.error('Error creating template:', error)
    throw error
  }
}

// Example: Update template status
export async function updateTemplateStatus(
  id: string,
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
) {
  try {
    const template = await prisma.templates.update({
      where: { id },
      data: {
        status,
        updated_at: new Date()
      }
    })
    return template
  } catch (error) {
    console.error('Error updating template:', error)
    throw error
  }
}

// Example: Get user's cart items
export async function getCartItems(userId: string) {
  try {
    const cartItems = await prisma.cart_items.findMany({
      where: {
        user_id: userId
      },
      include: {
        templates: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            thumbnail_url: true,
            category: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })
    return cartItems
  } catch (error) {
    console.error('Error fetching cart items:', error)
    throw error
  }
}

// Example: Add item to cart
export async function addToCart(userId: string, templateId: string) {
  try {
    const cartItem = await prisma.cart_items.upsert({
      where: {
        user_id_template_id: {
          user_id: userId,
          template_id: templateId
        }
      },
      update: {},
      create: {
        user_id: userId,
        template_id: templateId
      }
    })
    return cartItem
  } catch (error) {
    console.error('Error adding to cart:', error)
    throw error
  }
}

// Example: Create a purchase (transaction)
export async function createPurchase(data: {
  userId: string
  templateId: string
  amount: number
}) {
  try {
    // Use Prisma transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create purchase
      const purchase = await tx.purchases.create({
        data: {
          user_id: data.userId,
          template_id: data.templateId,
          amount: data.amount
        }
      })

      // Update template downloads count
      await tx.templates.update({
        where: { id: data.templateId },
        data: {
          downloads_count: {
            increment: 1
          }
        }
      })

      // Remove from cart
      await tx.cart_items.deleteMany({
        where: {
          user_id: data.userId,
          template_id: data.templateId
        }
      })

      return purchase
    })

    return result
  } catch (error) {
    console.error('Error creating purchase:', error)
    throw error
  }
}

// Example: Get user by ID
export async function getUserById(id: string) {
  try {
    const user = await prisma.users.findUnique({
      where: { id },
      include: {
        profiles: true
      }
    })
    return user
  } catch (error) {
    console.error('Error fetching user:', error)
    throw error
  }
}

// Example: Search templates
export async function searchTemplates(query: string) {
  try {
    const templates = await prisma.templates.findMany({
      where: {
        status: 'APPROVED',
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } }
        ]
      },
      orderBy: {
        created_at: 'desc'
      }
    })
    return templates
  } catch (error) {
    console.error('Error searching templates:', error)
    throw error
  }
}

