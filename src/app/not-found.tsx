'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl text-gray-600 mb-8">Хуудас олдсонгүй</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Та хайсан хуудас олдсонгүй байна. Нүүр хуудас руу бууж эсвэл 
            зөвхөө хуудаснаас үзнэ үү.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Home className="h-4 w-4 mr-2" />
              Нүүр хуудас руу буцах
            </Button>
          </Link>
          
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-lg"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Буцах
          </button>
        </div>
      </div>
    </div>
  )
}