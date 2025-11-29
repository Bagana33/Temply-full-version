import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient()
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')
  const category = searchParams.get('category')
  const sort = searchParams.get('sort') || 'created_at'
  const status = searchParams.get('status')

  let query = supabase
    .from('templates')
    .select(`
      id,
      title,
      description,
      price,
      thumbnail_url,
      status,
      creator_id,
      users ( id, name )
    `)

  if (status) {
    query = query.eq('status', status)
  }
  if (category) {
    query = query.eq('category', category)
  }
  if (search) {
    query = query.ilike('title', `%${search}%`)
  }

  query = query.order(sort, { ascending: false })

  const { data, error } = await query
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ templates: data ?? [] })
}

const getAccessToken = (request: NextRequest) => {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.toLowerCase().startsWith('bearer ')) {
    return authHeader.slice(7)
  }
  const cookieToken = request.cookies.get('sb-access-token')?.value
  return cookieToken || null
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const body = await request.json()

    const accessToken =
      request.headers.get('Authorization')?.replace('Bearer ', '') ||
      getAccessToken(request)

    if (!accessToken) {
      return NextResponse.json({ error: 'Нэвтэрсэн байх шаардлагатай' }, { status: 401 })
    }

    const { data: authData, error: authError } = await supabase.auth.getUser(accessToken)
    if (authError || !authData?.user) {
      return NextResponse.json({ error: 'Нэвтрэх мэдээлэл буруу байна' }, { status: 401 })
    }

    const insertPayload: import('@/types/database').Database['public']['Tables']['templates']['Insert'] = {
      title: body.title,
      description: body.description,
      price: body.price,
      thumbnail_url: body.thumbnail_url,
      canva_link: body.canva_link,
      category: body.category,
      tags: body.tags,
      creator_id: authData.user.id,
      status: 'PENDING',
      downloads_count: 0,
      views_count: 0
    }

    const { data, error } = await supabase
      .from('templates')
      .insert(insertPayload)
      .select(`
        id,
        title,
        price,
        thumbnail_url,
        users ( id, name )
      `)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: error?.message || 'Insert failed' }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create template' }, { status: 400 })
  }
}
