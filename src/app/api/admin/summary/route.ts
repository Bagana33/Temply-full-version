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
  try {
    const supabase = createServerSupabaseClient()
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

    // Хэрэглэгчийн role шалгах
    let role = (authData.user.user_metadata?.role as string) ?? null

    if (!role) {
      const { data: userRow } = await supabase
        .from('users')
        .select('role')
        .eq('id', authData.user.id)
        .single()

      role = userRow?.role ?? null
    }

    if (role !== 'ADMIN') {
      return NextResponse.json({ error: 'Зөвхөн админ энэ мэдээллийг харах эрхтэй' }, { status: 403 })
    }

    // Статистик авах
    const [{ count: templatesCount }, { count: usersCount }, { data: purchases }] =
      await Promise.all([
        supabase.from('templates').select('id', { count: 'exact', head: true }),
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('purchases').select('amount'),
      ])

    const revenue =
      purchases?.reduce((sum, p) => sum + (p.amount ?? 0), 0) ?? 0

    return NextResponse.json({
      templateCount: templatesCount ?? 0,
      userCount: usersCount ?? 0,
      revenue,
    })
  } catch (error) {
    console.error('Admin summary API error:', error)
    return NextResponse.json(
      { error: 'Админ статистик ачаалж чадсангүй' },
      { status: 500 }
    )
  }
}


