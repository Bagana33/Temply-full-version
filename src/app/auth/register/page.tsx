'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/lib/role'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<UserRole>('USER')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signUp, signIn, user } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Нууц үг таарахгүй байна')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой')
      setLoading(false)
      return
    }

    const { error: signUpError } = await signUp(email, password, name, role)
    
    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Sign up хийсний дараа шууд sign in хийх (auto-login)
    // Mock auth-д шууд session үүснэ, Supabase auth-д sign in хийх хэрэгтэй
    const { error: signInError } = await signIn(email, password)
    
    if (signInError) {
      // Sign up амжилттай, гэхдээ sign in алдаатай - login хуудас руу redirect
      router.push('/auth/login?message=registration-success')
    } else {
      // Амжилттай - account хуудас руу redirect
      router.push('/account')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Temply</span>
          </Link>
          
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Бүртгүүлэх</CardTitle>
              <CardDescription>
                Temply-д тавтай морилно уу. Шинэ бүртгэл үүсгэх.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="name">Нэр</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Таны нэр"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Имэйл хаяг</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Бүртгэлийн төрөл</Label>
                  <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Төрлөө сонгоно уу" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">Хэрэглэгч</SelectItem>
                      <SelectItem value="CREATOR">Дизайнер (Үүсгэгч)</SelectItem>
                      <SelectItem value="ADMIN">Админ</SelectItem>
                    </SelectContent>
                  </Select>
                  {role === 'CREATOR' && (
                    <p className="text-sm text-gray-600 mt-1">
                      Дизайнерууд загвар байршуулж орлого олох боломжтой
                    </p>
                  )}
                  {role === 'ADMIN' && (
                    <p className="text-sm text-red-600 mt-1">
                      Админ эрхтэй бүртгэл үүсгэх гэж байна!
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Нууц үг</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Нууц үг давтах</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? 'Бүртгэж байна...' : 'Бүртгүүлэх'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Бүртгэлтэй бол?{' '}
                  <Link href="/auth/login" className="text-purple-600 hover:text-purple-500 font-medium">
                    Нэвтрэх
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center">
          <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Нүүр хуудас руу буцах
          </Link>
        </div>
      </div>
    </div>
  )
}
