import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { UserRole } from '@/lib/role'

const allowedRoles: UserRole[] = ['USER', 'CREATOR', 'ADMIN']

export async function POST(request: NextRequest) {
  try {
    // Check environment variables first
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('SUPABASE_SERVICE_ROLE_KEY is not set')
      return NextResponse.json(
        { error: 'Серверийн тохиргоо дутуу байна. Админд хандана уу.' },
        { status: 500 }
      )
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error('NEXT_PUBLIC_SUPABASE_URL is not set')
      return NextResponse.json(
        { error: 'Серверийн тохиргоо дутуу байна. Админд хандана уу.' },
        { status: 500 }
      )
    }

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
      // Handle specific Supabase errors
      let errorMessage = error.message
      
      console.error('Supabase registration error:', {
        message: error.message,
        status: error.status,
        name: error.name
      })
      
      if (error.message?.includes('invalid api key') || error.message?.includes('Invalid API key') || error.message?.includes('JWT')) {
        errorMessage = 'Серверийн тохиргоо буруу байна. Supabase API keys-ийг шалгана уу.'
        console.error('Supabase API key error - check SUPABASE_SERVICE_ROLE_KEY in .env.local')
      } else if (error.message?.includes('already registered') || error.message?.includes('already exists') || error.message?.includes('User already registered')) {
        errorMessage = 'Энэ имэйл хаяг аль хэдийн бүртгэгдсэн байна'
      } else if (error.message?.includes('password') || error.message?.includes('Password')) {
        errorMessage = 'Нууц үг сул байна. Илүү хүчтэй нууц үг сонгоно уу.'
      } else if (error.message?.includes('Invalid email')) {
        errorMessage = 'Имэйл хаяг буруу байна'
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      )
    }

    return NextResponse.json({ user: data.user })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Бүртгэл үүсгэх үед алдаа гарлаа' },
      { status: 500 }
    )
  }
}
