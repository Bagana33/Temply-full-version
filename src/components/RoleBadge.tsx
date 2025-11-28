import { Badge } from '@/components/ui/badge'
import { UserRole } from '@/lib/role'
import { Crown, Shield, User } from 'lucide-react'

interface RoleBadgeProps {
  role: UserRole | null
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

export function RoleBadge({ role, size = 'md', showIcon = true }: RoleBadgeProps) {
  const getRoleConfig = (role: UserRole | null) => {
    switch (role) {
      case 'ADMIN':
        return {
          label: 'Админ',
          variant: 'destructive' as const,
          icon: Crown,
          className: 'bg-red-100 text-red-800 hover:bg-red-100'
        }
      case 'CREATOR':
        return {
          label: 'Үүсгэгч',
          variant: 'default' as const,
          icon: Shield,
          className: 'bg-purple-100 text-purple-800 hover:bg-purple-100'
        }
      case 'USER':
        return {
          label: 'Хэрэглэгч',
          variant: 'secondary' as const,
          icon: User,
          className: 'bg-gray-100 text-gray-800 hover:bg-gray-100'
        }
      default:
        return {
          label: 'Тодорхойгүй',
          variant: 'outline' as const,
          icon: User,
          className: 'bg-gray-50 text-gray-600 hover:bg-gray-50'
        }
    }
  }

  const config = getRoleConfig(role)
  const Icon = config.icon

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-0.5'
      case 'lg':
        return 'text-base px-3 py-1.5'
      default:
        return 'text-sm px-2.5 py-1'
    }
  }

  return (
    <Badge className={`${config.className} ${getSizeClasses()}`}>
      {showIcon && <Icon className="h-3 w-3 mr-1" />}
      {config.label}
    </Badge>
  )
}