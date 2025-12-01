import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const getAccessToken = (request: NextRequest) => {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.toLowerCase().startsWith('bearer ')) {
    return authHeader.slice(7)
  }
  const cookieToken = request.cookies.get('sb-access-token')?.value
  return cookieToken || null
}

export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient()
  const accessToken = getAccessToken(request)
  if (!accessToken) {
    return NextResponse.json({ error: 'Нэвтэрсэн байх шаардлагатай' }, { status: 401 })
  }

  const { data: authData, error: authError } = await supabase.auth.getUser(accessToken)
  if (authError || !authData?.user) {
    return NextResponse.json({ error: 'Нэвтрэх мэдээлэл буруу байна' }, { status: 401 })
  }

  const userRole =
    (authData.user.user_metadata?.role as string | undefined) ?? null
  if (userRole === 'CREATOR') {
    return NextResponse.json({ error: 'Дизайнер хэрэглэгч худалдан авалт хийх боломжгүй' }, { status: 403 })
  }

  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      id,
      template_id,
      created_at,
      templates (
        id,
        title,
        price,
        thumbnail_url
      )
    `)
    .eq('user_id', authData.user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const normalized = (data ?? []).map((item) => ({
    id: item.id,
    template_id: item.template_id,
    template: item.templates
      ? {
          id: item.templates.id,
          title: item.templates.title,
          price: item.templates.price,
          thumbnail_url: item.templates.thumbnail_url
        }
      : null
  }))

  return NextResponse.json(normalized)
}

export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient()
  const accessToken = getAccessToken(request)
  if (!accessToken) {
    return NextResponse.json({ error: 'Нэвтэрсэн байх шаардлагатай' }, { status: 401 })
  }

  const { data: authData, error: authError } = await supabase.auth.getUser(accessToken)
  if (authError || !authData?.user) {
    return NextResponse.json({ error: 'Нэвтрэх мэдээлэл буруу байна' }, { status: 401 })
  }

  const body = await request.json()
  const templateId = body.template_id as string | undefined
  if (!templateId) {
    return NextResponse.json({ error: 'template_id шаардлагатай' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('cart_items')
    .insert({ user_id: authData.user.id, template_id: templateId })
    .select(`
      id,
      template_id,
      templates (
        id,
        title,
        price,
        thumbnail_url
      )
    `)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    id: data.id,
    template_id: data.template_id,
    template: data.templates
      ? {
          id: data.templates.id,
          title: data.templates.title,
          price: data.templates.price,
          thumbnail_url: data.templates.thumbnail_url
        }
      : null
  })
}

export async function DELETE(request: NextRequest) {
  const supabase = createServerSupabaseClient()
  const accessToken = getAccessToken(request)
  if (!accessToken) {
    return NextResponse.json({ error: 'Нэвтэрсэн байх шаардлагатай' }, { status: 401 })
  }

  const { data: authData, error: authError } = await supabase.auth.getUser(accessToken)
  if (authError || !authData?.user) {
    return NextResponse.json({ error: 'Нэвтрэх мэдээлэл буруу байна' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const templateId = searchParams.get('template_id')

  const query = supabase.from('cart_items').delete().eq('user_id', authData.user.id)
  if (templateId) {
    query.eq('template_id', templateId)
  }

  const { error } = await query
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
