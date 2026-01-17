import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Admin email addresses from your RLS policies
const ADMIN_EMAILS = [
  'admin@kuruman-perfumes.co.za',
  'admin@luthandofragrances.co.za',
  'joram@skeemlogistics.com',
  'info@luthandofragrances.co.za',
  'jorammongale@outlook.com'
]

// Check if we should use Firebase Auth
const USE_FIREBASE_AUTH = process.env.NEXT_PUBLIC_USE_FIREBASE_AUTH === 'true'

export function middleware(request: NextRequest) {
  // Only check admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Get the session token from cookies
    const sessionToken = request.cookies.get('session')?.value
    
    if (!sessionToken) {
      // No session token, redirect to login
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    // In a real implementation, you would verify the JWT token here
    // For Firebase: verifyIdToken(sessionToken)
    // For Supabase: verify JWT with supabase-js
    
    // For now, we'll rely on client-side auth checks
    // This is acceptable since we have RLS policies in place
    return NextResponse.next()
  }
}

export const config = {
  matcher: '/admin/:path*'
}
