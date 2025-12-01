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

  const { data, error } = await supabase
    .from('downloads')
    .select(`
      id,
      template_id,
      created_at,
      templates (
        id,
        title,
        thumbnail_url,
        canva_link
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
    created_at: row.created_at,
    template: row.templates
      ? {
          id: row.templates.id,
          title: row.templates.title,
          thumbnail_url: row.templates.thumbnail_url,
          canva_link: row.templates.canva_link,
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

  // Хэрэглэгч энэ template-г худалдаж авсан эсэхийг шалгах
  const { data: purchase, error: purchaseError } = await supabase
    .from('purchases')
    .select('id')
    .eq('user_id', authData.user.id)
    .eq('template_id', templateId)
    .maybeSingle()

  if (purchaseError) {
    return NextResponse.json({ error: purchaseError.message }, { status: 500 })
  }

  if (!purchase) {
    return NextResponse.json(
      { error: 'Энэ загварыг татах эрхгүй байна. Эхлээд худалдаж аваарай.' },
      { status: 403 },
    )
  }

  const { data: template, error: templateError } = await supabase
    .from('templates')
    .select('id, canva_link, downloads_count')
    .eq('id', templateId)
    .single()

  if (templateError || !template) {
    return NextResponse.json({ error: 'Загвар олдсонгүй' }, { status: 404 })
  }

  if (!template.canva_link) {
    return NextResponse.json(
      { error: 'Энэ загварт татах холбоос тохируулаагүй байна' },
      { status: 400 },
    )
  }

  // Download бүртгэх
  const { error: insertError } = await supabase.from('downloads').insert({
    user_id: authData.user.id,
    template_id: templateId,
  })

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  // downloads_count-г нэмэгдүүлэх (алдааг үл тооцож болно)
  await supabase
    .from('templates')
    .update({ downloads_count: (template.downloads_count ?? 0) + 1 })
    .eq('id', templateId)

  return NextResponse.json({ canva_link: template.canva_link })
}
