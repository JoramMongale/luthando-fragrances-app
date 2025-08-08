'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // This page handles the redirect from email confirmation
    // Supabase will automatically handle the token exchange
    setTimeout(() => {
      router.push('/auth/login?verified=true')
    }, 1000)
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
       <p className="text-gray-600">Verifying your email...</p>
     </div>
   </div>
 )
}
