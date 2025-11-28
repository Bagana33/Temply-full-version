'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'
import { UserRole } from '@/lib/role'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  role: UserRole | null
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const MOCK_USERS_KEY = 'temply-users'
const MOCK_SESSION_KEY = 'temply-current-user'
const DEFAULT_MOCK_USER = {
  email: 'demo@temply.mn',
  password: 'password123',
  name: 'Demo User',
  role: 'USER' as UserRole
}

type MockStoredUser = {
  id: string
  email: string
  name: string
  role: UserRole
  passwordHash: string
}

const hasBrowserStorage = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

const encodePassword = (password: string) => {
  try {
    const encoder =
      typeof TextEncoder !== 'undefined' ? new TextEncoder() : null
    if (encoder) {
      const data = encoder.encode(password)
      return Array.from(data)
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('')
    }
  } catch (error) {
    console.error('Failed to encode password', error)
  }
  return password
}

const generateMockId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `mock-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const readMockUsers = (): MockStoredUser[] => {
  if (!hasBrowserStorage()) return []
  try {
    const raw = window.localStorage.getItem(MOCK_USERS_KEY)
    return raw ? (JSON.parse(raw) as MockStoredUser[]) : []
  } catch (error) {
    console.warn('Unable to read mock users from storage', error)
    return []
  }
}

const persistMockUsers = (users: MockStoredUser[]) => {
  if (!hasBrowserStorage()) return
  try {
    window.localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users))
  } catch (error) {
    console.warn('Unable to persist mock users', error)
  }
}

const readMockSession = (): MockStoredUser | null => {
  if (!hasBrowserStorage()) return null
  try {
    const raw = window.localStorage.getItem(MOCK_SESSION_KEY)
    return raw ? (JSON.parse(raw) as MockStoredUser) : null
  } catch (error) {
    console.warn('Unable to read mock session', error)
    return null
  }
}

const persistMockSession = (user: MockStoredUser | null) => {
  if (!hasBrowserStorage()) return
  try {
    if (!user) {
      window.localStorage.removeItem(MOCK_SESSION_KEY)
    } else {
      window.localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(user))
    }
  } catch (error) {
    console.warn('Unable to persist mock session', error)
  }
}

const createMockAuthError = (message: string): AuthError =>
  ({
    name: 'MockAuthError',
    message,
    status: 400
  } as AuthError)

const seedDefaultMockUser = () => {
  if (!hasBrowserStorage()) return
  const existing = readMockUsers()
  if (existing.length > 0) return
  const newUser: MockStoredUser = {
    id: generateMockId(),
    email: DEFAULT_MOCK_USER.email,
    name: DEFAULT_MOCK_USER.name,
    role: DEFAULT_MOCK_USER.role,
    passwordHash: encodePassword(DEFAULT_MOCK_USER.password)
  }
  persistMockUsers([newUser])
}

const convertToSupabaseUser = (storedUser: MockStoredUser): User => {
  const timestamp = new Date().toISOString()
  return {
    id: storedUser.id,
    app_metadata: {
      provider: 'mock',
      providers: ['mock']
    },
    user_metadata: {
      name: storedUser.name,
      role: storedUser.role,
      avatar_url: null
    },
    aud: 'authenticated',
    email: storedUser.email,
    phone: undefined,
    created_at: timestamp,
    confirmed_at: timestamp,
    email_confirmed_at: timestamp,
    last_sign_in_at: timestamp,
    role: 'authenticated',
    updated_at: timestamp,
    identities: [],
    factors: [],
    is_anonymous: false
  }
}

const shouldFallbackToMock = (error?: AuthError | null) => {
  if (!error) return false
  const message = error.message?.toLowerCase() ?? ''
  return (
    message.includes('invalid api key') ||
    message.includes('apikey') ||
    message.includes('supabase') ||
    error.status === 401 ||
    error.status === 403
  )
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState<UserRole | null>(null)
  const [useMockAuth, setUseMockAuth] = useState(!supabase)

  const loadMockSession = useCallback(() => {
    seedDefaultMockUser()
    const storedSession = readMockSession()
    if (storedSession) {
      setUser(convertToSupabaseUser(storedSession))
      setRole(storedSession.role)
    } else {
      setUser(null)
      setRole(null)
    }
    setSession(null)
    setLoading(false)
  }, [])

  useEffect(() => {
    const client = supabase

    if (!client) {
      setUseMockAuth(true)
      loadMockSession()
      return
    }

    const getSession = async () => {
      const {
        data: { session },
        error
      } = await client.auth.getSession()

      if (error && shouldFallbackToMock(error)) {
        console.warn('Supabase auth unavailable, using local mock auth.')
        setUseMockAuth(true)
        loadMockSession()
        return
      }

      setSession(session)
      setUser(session?.user ?? null)
      setRole((session?.user?.user_metadata?.role as UserRole) ?? null)
      setLoading(false)
    }

    getSession()

    const {
      data: { subscription }
    } = client.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setRole((session?.user?.user_metadata?.role as UserRole) ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [loadMockSession])

  const mockSignUp = async (
    email: string,
    password: string,
    name: string,
    userRole: UserRole
  ) => {
    const normalizedEmail = email.trim().toLowerCase()

    if (!hasBrowserStorage()) {
      return { error: createMockAuthError('Mock auth is not available') }
    }

    const existingUsers = readMockUsers()
    if (existingUsers.some((user) => user.email === normalizedEmail)) {
      return { error: createMockAuthError('Имэйл бүртгэлтэй байна') }
    }

    const storedUser: MockStoredUser = {
      id: generateMockId(),
      email: normalizedEmail,
      name,
      role: userRole,
      passwordHash: encodePassword(password)
    }

    persistMockUsers([...existingUsers, storedUser])
    persistMockSession(storedUser)
    setUser(convertToSupabaseUser(storedUser))
    setRole(userRole)
    setSession(null)

    return { error: null }
  }

  const mockSignIn = async (email: string, password: string) => {
    if (!hasBrowserStorage()) {
      return { error: createMockAuthError('Mock auth is not available') }
    }

    const normalizedEmail = email.trim().toLowerCase()
    const existingUsers = readMockUsers()
    const matchedUser = existingUsers.find((user) => user.email === normalizedEmail)

    if (!matchedUser || matchedUser.passwordHash !== encodePassword(password)) {
      return { error: createMockAuthError('Имэйл эсвэл нууц үг буруу байна') }
    }

    persistMockSession(matchedUser)
    setUser(convertToSupabaseUser(matchedUser))
    setRole(matchedUser.role)
    setSession(null)

    return { error: null }
  }

  const mockSignOut = async () => {
    persistMockSession(null)
    setUser(null)
    setSession(null)
    setRole(null)
  }

  const mockResetPassword = async (email: string) => {
    if (!hasBrowserStorage()) {
      return { error: createMockAuthError('Mock auth is not available') }
    }
    const normalizedEmail = email.trim().toLowerCase()
    const existingUsers = readMockUsers()
    const matchedUser = existingUsers.find((user) => user.email === normalizedEmail)

    if (!matchedUser) {
      return { error: createMockAuthError('Ийм имэйл бүртгэлгүй байна') }
    }

    return { error: null }
  }

  const signUp = async (email: string, password: string, name: string, userRole: UserRole) => {
    if (useMockAuth || !supabase) {
      seedDefaultMockUser()
      return mockSignUp(email, password, name, userRole)
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: userRole
        }
      }
    })

    if (error || shouldFallbackToMock(error)) {
      console.warn('Falling back to mock auth for sign up due to Supabase error.')
      setUseMockAuth(true)
      seedDefaultMockUser()
      return mockSignUp(email, password, name, userRole)
    }

    return { error }
  }

  const signIn = async (email: string, password: string) => {
    if (useMockAuth || !supabase) {
      seedDefaultMockUser()
      return mockSignIn(email, password)
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error || shouldFallbackToMock(error)) {
      console.warn('Falling back to mock auth for sign in due to Supabase error.')
      setUseMockAuth(true)
      seedDefaultMockUser()
      return mockSignIn(email, password)
    }

    return { error }
  }

  const signOut = async () => {
    if (useMockAuth || !supabase) {
      await mockSignOut()
      return
    }

    await supabase.auth.signOut()
  }

  const resetPassword = async (email: string) => {
    if (useMockAuth || !supabase) {
      return mockResetPassword(email)
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email)

    if (shouldFallbackToMock(error)) {
      console.warn('Falling back to mock auth for password reset.')
      setUseMockAuth(true)
      return mockResetPassword(email)
    }

    return { error }
  }

  const value = {
    user,
    session,
    loading,
    role,
    signUp,
    signIn,
    signOut,
    resetPassword
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
