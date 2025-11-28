'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldAlert, ArrowLeft } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center text-red-600">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl">Хандах эрхгүй</CardTitle>
          <p className="text-gray-500">
            Энэ хуудсыг харах эрх танд байхгүй байна. Нэвтрэх төрлөө шалгаад дахин оролдоно уу.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/">
            <Button className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Нүүр хуудас руу буцах
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="outline" className="w-full">
              Өөр аккаунтаар нэвтрэх
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

