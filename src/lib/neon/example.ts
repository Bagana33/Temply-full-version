/**
 * Example usage of Neon database client
 * 
 * This file demonstrates how to use Neon database with your existing schema.
 * 
 * To use Neon:
 * 1. Get your connection string from Neon.tech dashboard
 * 2. Set DATABASE_URL environment variable:
 *    DATABASE_URL=postgresql://user:password@host/database?sslmode=require
 * 3. Import and use the sql client in your API routes or server components
 */

import { sql } from './server'

// Example: Get all templates
export async function getAllTemplates() {
  try {
    const result = await sql`
      SELECT 
        id,
        title,
        description,
        price,
        thumbnail_url,
        canva_link,
        category,
        tags,
        status,
        creator_id,
        downloads_count,
        views_count,
        created_at,
        updated_at
      FROM templates
      WHERE status = 'APPROVED'
      ORDER BY created_at DESC
    `
    return result
  } catch (error) {
    console.error('Error fetching templates:', error)
    throw error
  }
}

// Example: Get a single template by ID
export async function getTemplateById(id: string) {
  try {
    const result = await sql`
      SELECT * FROM templates
      WHERE id = ${id}
      LIMIT 1
    `
    return result[0] || null
  } catch (error) {
    console.error('Error fetching template:', error)
    throw error
  }
}

// Example: Get user by ID
export async function getUserById(id: string) {
  try {
    const result = await sql`
      SELECT 
        id,
        email,
        name,
        role,
        created_at,
        updated_at
      FROM users
      WHERE id = ${id}
      LIMIT 1
    `
    return result[0] || null
  } catch (error) {
    console.error('Error fetching user:', error)
    throw error
  }
}

// Example: Insert a new template
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
    const result = await sql`
      INSERT INTO templates (
        title,
        description,
        price,
        thumbnail_url,
        canva_link,
        category,
        tags,
        creator_id,
        status
      ) VALUES (
        ${data.title},
        ${data.description},
        ${data.price},
        ${data.thumbnail_url},
        ${data.canva_link},
        ${data.category},
        ${data.tags || []},
        ${data.creator_id},
        'PENDING'
      )
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error('Error creating template:', error)
    throw error
  }
}

// Example: Get cart items for a user
export async function getCartItems(userId: string) {
  try {
    const result = await sql`
      SELECT 
        ci.id,
        ci.created_at,
        t.id as template_id,
        t.title,
        t.description,
        t.price,
        t.thumbnail_url,
        t.category
      FROM cart_items ci
      INNER JOIN templates t ON ci.template_id = t.id
      WHERE ci.user_id = ${userId}
      ORDER BY ci.created_at DESC
    `
    return result
  } catch (error) {
    console.error('Error fetching cart items:', error)
    throw error
  }
}

// Example: Add item to cart
export async function addToCart(userId: string, templateId: string) {
  try {
    const result = await sql`
      INSERT INTO cart_items (user_id, template_id)
      VALUES (${userId}, ${templateId})
      ON CONFLICT (user_id, template_id) DO NOTHING
      RETURNING *
    `
    return result[0] || null
  } catch (error) {
    console.error('Error adding to cart:', error)
    throw error
  }
}

// Example: Transaction example
export async function createPurchase(data: {
  userId: string
  templateId: string
  amount: number
}) {
  try {
    // Note: Neon supports transactions, but the syntax may vary
    // This is a simplified example
    const purchase = await sql`
      INSERT INTO purchases (user_id, template_id, amount)
      VALUES (${data.userId}, ${data.templateId}, ${data.amount})
      RETURNING *
    `
    
    // Update downloads count
    await sql`
      UPDATE templates
      SET downloads_count = downloads_count + 1
      WHERE id = ${data.templateId}
    `
    
    // Remove from cart
    await sql`
      DELETE FROM cart_items
      WHERE user_id = ${data.userId} AND template_id = ${data.templateId}
    `
    
    return purchase[0]
  } catch (error) {
    console.error('Error creating purchase:', error)
    throw error
  }
}

