import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')
  const category = searchParams.get('category')
  const sort = searchParams.get('sort') || 'created_at'
  const status = searchParams.get('status')

  if (!supabase) {
    return NextResponse.json({ error: 'Supabase client not initialized' }, { status: 500 })
  }
  let query = supabase.from('templates').select('*')

  if (status) {
    query = query.eq('status', status)
  }
  if (category) {
    query = query.eq('category', category)
  }
  if (search) {
    query = query.ilike('title', `%${search}%`)
  }
  // TODO: Add more search logic for description/tags if needed

  // Sorting
  query = query.order(sort, { ascending: false })

  const { data, error } = await query
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Insert type from Database
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client not initialized' }, { status: 500 })
    }
    const templateData: import('@/types/database').Database['public']['Tables']['templates']['Insert'] = {
      ...body,
      status: 'PENDING',
      downloads_count: 0,
      views_count: 0
    }
    const { data, error } = await supabase
      .from('templates')
      .insert([templateData])
      .select()
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create template' }, { status: 400 })
  }
}