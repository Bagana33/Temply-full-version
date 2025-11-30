import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

type TemplateStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

const getAccessToken = (request: NextRequest) => {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.toLowerCase().startsWith('bearer ')) {
    return authHeader.slice(7)
  }
  const cookieToken = request.cookies.get('sb-access-token')?.value
  return cookieToken || null
}

async function getRequester(
  request: NextRequest,
  supabase: ReturnType<typeof createServerSupabaseClient>
) {
  const accessToken =
    request.headers.get('Authorization')?.replace('Bearer ', '') ||
    getAccessToken(request)

  if (!accessToken) {
    return { userId: null as string | null, role: null as string | null, isAdmin: false }
  }

  const { data: authData } = await supabase.auth.getUser(accessToken)
  const userId = authData.user?.id ?? null
  let role = (authData.user?.user_metadata?.role as string) ?? null

  if (userId && !role) {
    const { data: userRow } = await supabase.from('users').select('role').eq('id', userId).single()
    role = userRow?.role ?? null
  }

  return { userId, role, isAdmin: role === 'ADMIN', accessToken }
}

const templateSelect = `
  id,
  title,
  description,
  price,
  thumbnail_url,
  canva_link,
  status,
  category,
  tags,
  creator_id,
  users ( id, name )
`

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const templateId = params.id
  const supabase = createServerSupabaseClient()
  const { userId, isAdmin } = await getRequester(request, supabase)

  const { data, error } = await supabase
    .from('templates')
    .select(templateSelect)
    .eq('id', templateId)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: error?.message || 'Template not found' }, { status: 404 })
  }

  const isOwner = userId && data.creator_id === userId
  if (data.status !== 'APPROVED' && !isAdmin && !isOwner) {
    return NextResponse.json({ error: 'Template not available' }, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const templateId = params.id
    const supabase = createServerSupabaseClient()
    const requester = await getRequester(request, supabase)

    if (!requester.userId) {
      return NextResponse.json({ error: 'Нэвтэрсэн байх шаардлагатай' }, { status: 401 })
    }

    if (!requester.isAdmin) {
      return NextResponse.json({ error: 'Зөвхөн админ төлөв өөрчилнө' }, { status: 403 })
    }

    const body = await request.json()
    const status = body.status as TemplateStatus | undefined

    if (!status || !['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Хүчингүй төлөв байна' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('templates')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', templateId)
      .select('id, title, status, creator_id, updated_at, price, thumbnail_url')
      .single()

    if (error || !data) {
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
    const requester = await getRequester(request, supabase)

    if (!requester.userId) {
      return NextResponse.json({ error: 'Нэвтэрсэн байх шаардлагатай' }, { status: 401 })
    }

    const { data: template } = await supabase
      .from('templates')
      .select('creator_id')
      .eq('id', templateId)
      .single()

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    const isOwner = template.creator_id === requester.userId
    if (!requester.isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Энэ загварыг устгах эрхгүй' }, { status: 403 })
    }

    const { error } = await supabase.from('templates').delete().eq('id', templateId)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ message: 'Template deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 400 })
  }
}
