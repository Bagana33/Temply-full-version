import { Suspense } from 'react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import UploadPageClient from './UploadPageClient'

export default function UploadPage() {
  return (
    <ProtectedRoute allowedRoles={['CREATOR', 'ADMIN']}>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
          </div>
        }
      >
        <UploadPageClient />
      </Suspense>
    </ProtectedRoute>
  )
}
