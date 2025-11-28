import { User } from '@supabase/supabase-js'
import { Database } from '@/types/database'

export type UserRole = Database['public']['Tables']['users']['Row']['role']

export const hasRole = (user: User | null, role: UserRole): boolean => {
  if (!user) return false
  
  const userRole = user.user_metadata?.role as UserRole
  return userRole === role
}

export const hasAnyRole = (user: User | null, roles: UserRole[]): boolean => {
  if (!user) return false
  
  const userRole = user.user_metadata?.role as UserRole
  return roles.includes(userRole)
}

export const isAdmin = (user: User | null): boolean => hasRole(user, 'ADMIN')
export const isCreator = (user: User | null): boolean => hasRole(user, 'CREATOR')
export const isUser = (user: User | null): boolean => hasRole(user, 'USER')

export const canAccessCreatorFeatures = (user: User | null): boolean => {
  return hasAnyRole(user, ['CREATOR', 'ADMIN'])
}

export const canAccessAdminFeatures = (user: User | null): boolean => {
  return hasRole(user, 'ADMIN')
}