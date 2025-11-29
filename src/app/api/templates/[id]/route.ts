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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const templateId = params.id
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('templates')
    .select(`
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
      users ( id, name )
    `)
    .eq('id', templateId)
    .single()
  if (error || !data) {
    return NextResponse.json({ error: error?.message || 'Template not found' }, { status: 404 })
  }
  return NextResponse.json(data)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const templateId = params.id
    const body = await request.json()
    const supabase = createServerSupabaseClient()

    const accessToken = getAccessToken(request)
    if (!accessToken) {
      return NextResponse.json({ error: 'Нэвтэрсэн байх шаардлагатай' }, { status: 401 })
    }
    const { data: authData, error: authError } = await supabase.auth.getUser(accessToken)
    if (authError || !authData?.user) {
      return NextResponse.json({ error: 'Нэвтрэх мэдээлэл буруу байна' }, { status: 401 })
    }

    const updateData: Partial<import('@/types/database').Database['public']['Tables']['templates']['Update']> = { ...body, updated_at: new Date().toISOString() };
    const { data, error } = await supabase
      .from('templates')
      .update(updateData)
      .eq('id', templateId)
      .eq('creator_id', authData.user.id)
      .select()
      .single();
    if (error || !data || !data[0]) {
      return NextResponse.json({ error: error?.message || 'Template not found' }, { status: 404 })
    }
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update template' }, { status: 400 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const templateId = params.id
    const supabase = createServerSupabaseClient()

    const accessToken = getAccessToken(request)
    if (!accessToken) {
      return NextResponse.json({ error: 'Нэвтэрсэн байх шаардлагатай' }, { status: 401 })
    }
    const { data: authData, error: authError } = await supabase.auth.getUser(accessToken)
    if (authError || !authData?.user) {
      return NextResponse.json({ error: 'Нэвтрэх мэдээлэл буруу байна' }, { status: 401 })
    }

    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('id', templateId)
      .eq('creator_id', authData.user.id)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ message: 'Template deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 400 })
  }
}
