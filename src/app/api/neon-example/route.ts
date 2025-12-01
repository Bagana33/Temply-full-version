import { NextResponse } from 'next/server'
import { sql } from '@/lib/neon/server'

/**
 * Example API route using Neon database
 * 
 * GET /api/neon-example
 * Returns a list of templates from the Neon database
 */
export async function GET() {
  try {
    const templates = await sql`
      SELECT 
        id,
        title,
        description,
        price,
        thumbnail_url,
        category,
        status,
        created_at
      FROM templates
      WHERE status = 'APPROVED'
      ORDER BY created_at DESC
      LIMIT 10
    `
    
    return NextResponse.json({ 
      success: true,
      data: templates,
      count: templates.length 
    })
  } catch (error) {
    console.error('Neon database error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Database error'
      },
      { status: 500 }
    )
  }
}

