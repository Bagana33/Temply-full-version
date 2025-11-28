import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// For development, provide mock values if environment variables are not set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key'

// Only create Supabase client if we have real environment variables
const isDevelopment = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = isDevelopment ? null : createClient<Database>(supabaseUrl, supabaseAnonKey)

export const supabaseAdmin = isDevelopment ? null : createClient<Database>(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-service-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)