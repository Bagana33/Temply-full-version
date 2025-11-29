import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const templateId = params.id
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from('templates').select('*').eq('id', templateId).single()
  if (error || !data) {
    return NextResponse.json({ error: error?.message || 'Template not found' }, { status: 404 })
  }
  // TODO: Fetch reviews and related templates if needed
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
    const updateData: Partial<import('@/types/database').Database['public']['Tables']['templates']['Update']> = { ...body, updated_at: new Date().toISOString() };
    const { data, error } = await supabase
      .from('templates')
      .update(updateData)
      .eq('id', templateId)
      .select();
    if (error || !data || !data[0]) {
      return NextResponse.json({ error: error?.message || 'Template not found' }, { status: 404 })
    }
    return NextResponse.json(data[0])
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
    const { error } = await supabase.from('templates').delete().eq('id', templateId)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ message: 'Template deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 400 })
  }
}
