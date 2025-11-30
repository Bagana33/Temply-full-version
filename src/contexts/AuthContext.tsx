'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { UserRole } from '@/lib/role'

type AuthContextType = {
  user: User | null
  session: Session | null
  role: UserRole | null
  isLoading: boolean
  loading: boolean
  signUp: (
    email: string,
    password: string,
    name?: string,
    role?: string
  ) => Promise<{ error: Error | AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUserRole = async (nextUser: User | null) => {
    if (!nextUser) {
      setRole(null)
      return
    }

    const metaRole = nextUser.user_metadata?.role as UserRole | undefined
    if (metaRole) {
      setRole(metaRole)
      return
    }

    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', nextUser.id)
      .single()

    if (!error) {
      setRole(data?.role as UserRole)
    } else {
      setRole(null)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)
      await fetchUserRole(data.session?.user ?? null)
      setIsLoading(false)
    })
  }, [])

  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      fetchUserRole(nextSession?.user ?? null)
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, name?: string, role?: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role })
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        return { error: new Error(payload.error || 'Бүртгэл амжилтгүй боллоо') }
      }

      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) {
      await fetchUserRole(data.session?.user ?? null)
    }
    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setRole(null)
    }
    return { error }
  }

  const value: AuthContextType = {
    user,
    session,
    role,
    isLoading,
    loading: isLoading,
    signUp,
    signIn,
    signOut
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
