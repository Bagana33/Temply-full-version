// @ts-nocheck
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
    .from('purchases')
    .select(`
      id,
      template_id,
      amount,
      created_at,
      templates (
        id,
        title,
        price,
        thumbnail_url
      )
    `)
    .eq('user_id', authData.user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const normalized = (data ?? []).map((row: any) => ({
    id: row.id,
    template_id: row.template_id,
    amount: row.amount,
    created_at: row.created_at,
    template: row.templates
      ? {
          id: row.templates.id,
          title: row.templates.title,
          price: row.templates.price,
          thumbnail_url: row.templates.thumbnail_url,
        }
      : null,
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
  const templateId = (body.template_id || body.templateId) as string | undefined

  if (!templateId) {
    return NextResponse.json({ error: 'template_id шаардлагатай' }, { status: 400 })
  }

  // Загварын үнийг server-ээс уншиж баталгаажуулах
  const { data: template, error: templateError } = await supabase
    .from('templates')
    .select('id, price, status')
    .eq('id', templateId)
    .single()

  if (templateError || !template) {
    return NextResponse.json({ error: 'Загвар олдсонгүй' }, { status: 404 })
  }

  if (template.status !== 'APPROVED') {
    return NextResponse.json({ error: 'Энэ загвар худалдах эрхгүй байна' }, { status: 400 })
  }

  const amount = template.price ?? 0

  const { data, error } = await supabase
    .from('purchases')
    .insert({
      user_id: authData.user.id,
      template_id: templateId,
      amount,
    })
    .select(`
      id,
      template_id,
      amount,
      created_at,
      templates (
        id,
        title,
        price,
        thumbnail_url
      )
    `)
    .single()

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || 'Худалдан авалт бүртгэхэд алдаа гарлаа' },
      { status: 500 },
    )
  }

  // Худалдан авсны дараа сагснаас устгах (хэрэв байгаа бол)
  await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', authData.user.id)
    .eq('template_id', templateId)

  return NextResponse.json({ success: true, purchase: data })
}
