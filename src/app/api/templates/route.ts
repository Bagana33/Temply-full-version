import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')
  const category = searchParams.get('category')
  const sort = searchParams.get('sort') || 'created_at'
  const status = searchParams.get('status')

  const readClient = supabase ?? supabaseAdmin
  if (!readClient) {
    return NextResponse.json({ error: 'Supabase client not initialized' }, { status: 500 })
  }
  let query = readClient.from('templates').select('*')

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
    const body = await request.json()
    const client = supabaseAdmin ?? supabase
    if (!client) {
      return NextResponse.json({ error: 'Supabase client not initialized' }, { status: 500 })
    }

    const accessToken = getAccessToken(request)
    if (!accessToken) {
      return NextResponse.json({ error: 'Нэвтэрсэн байх шаардлагатай' }, { status: 401 })
    }

    const { data: userData, error: userError } = await (supabaseAdmin ?? supabase)!.auth.getUser(accessToken)
    if (userError || !userData?.user) {
      return NextResponse.json({ error: 'Нэвтрэх мэдээлэл буруу байна' }, { status: 401 })
    }

    const templateData: import('@/types/database').Database['public']['Tables']['templates']['Insert'] = {
      ...body,
      creator_id: userData.user.id,
      status: 'PENDING',
      downloads_count: 0,
      views_count: 0
    }

    const { data, error } = await client
      .from('templates')
      .insert([templateData])
      .select()
      .single()

    if (error || !data) {
      return NextResponse.json({ error: error?.message || 'Insert failed' }, { status: 400 })
    }
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create template' }, { status: 400 })
  }
}
