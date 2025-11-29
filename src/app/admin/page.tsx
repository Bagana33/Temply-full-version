import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, ClipboardCheck, Users, BarChart2 } from 'lucide-react'

export default async function AdminPage() {
  const supabase = createServerSupabaseClient()

  const { data: templates } = await supabase.from('templates').select('id')
  const { data: users } = await supabase.from('users').select('id')
  const { data: purchases } = await supabase.from('purchases').select('amount')

  const templateCount = templates?.length ?? 0
  const userCount = users?.length ?? 0
  const revenue = purchases?.reduce((sum, p) => sum + (p.amount ?? 0), 0) ?? 0

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col gap-2">
          <Badge className="w-fit bg-purple-100 text-purple-700 text-xs">
            <Shield className="h-3 w-3 mr-1" />
            Админ хяналт
          </Badge>
          <h1 className="text-3xl font-bold text-gray-900">Админ самбар</h1>
          <p className="text-gray-600">
            Платформын төлөв, хэрэглэгч, борлуулалтын тоймыг эндээс харах.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-500">Нийт загвар</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">{templateCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-500">Нийт хэрэглэгч</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">{userCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-500">Нийт орлого</CardTitle>
              <BarChart2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">₮{revenue.toLocaleString('mn-MN')}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
