import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { UserRole } from '@/lib/role'

const allowedRoles: UserRole[] = ['USER', 'CREATOR', 'ADMIN']

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = body.email as string | undefined
    const password = body.password as string | undefined
    const name = body.name as string | undefined
    const role = (body.role as UserRole | undefined) ?? 'USER'
    const safeRole = allowedRoles.includes(role) ? role : 'USER'

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Имэйл болон нууц үг заавал хэрэгтэй' },
        { status: 400 }
      )
    }

    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        role: safeRole
      }
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ user: data.user })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Бүртгэл үүсгэх үед алдаа гарлаа' },
      { status: 500 }
    )
  }
}
