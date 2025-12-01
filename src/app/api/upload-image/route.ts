import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const BUCKET_NAME = 'template-images'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Файл илгээгдээгүй байна' }, { status: 400 })
    }

    const ext = file.name.split('.').pop() || 'png'
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const filePath = `templates/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'image/png',
      })

    if (uploadError) {
      console.error('Image upload error:', uploadError)
      return NextResponse.json({ error: 'Зураг upload хийхэд алдаа гарлаа' }, { status: 500 })
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)

    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    console.error('Upload image route error:', error)
    return NextResponse.json(
      { error: 'Зураг upload хийх үед алдаа гарлаа' },
      { status: 500 },
    )
  }
}


