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

export function middleware(request: NextRequest) {
  // Only check admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // For now, we'll handle auth check on client side
    // In production, you'd verify the JWT token here
    return NextResponse.next()
  }
}

export const config = {
  matcher: '/admin/:path*'
}
