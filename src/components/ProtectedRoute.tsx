'use client'

import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/lib/role'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
  allowedRoles?: UserRole[]
  fallbackPath?: string
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  allowedRoles, 
  fallbackPath = '/auth/login' 
}: ProtectedRouteProps) {
  const { user, loading, role } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push(fallbackPath)
      return
    }

    if (requiredRole && role !== requiredRole) {
      router.push('/unauthorized')
      return
    }

    if (allowedRoles && role && !allowedRoles.includes(role)) {
      router.push('/unauthorized')
      return
    }
  }, [user, loading, role, requiredRole, allowedRoles, fallbackPath, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requiredRole && role !== requiredRole) {
    return null
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return null
  }

  return <>{children}</>
}