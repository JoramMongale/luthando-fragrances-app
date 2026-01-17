import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Get admin emails from environment variable (same as in auth-utils.ts)
const getAdminEmails = (): string[] => {
  const adminEmailStr = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'jorammongale@outlook.com'
  return adminEmailStr.split(',').map(email => email.trim())
}

// Simple JWT payload decoder (does not verify signature)
// Firebase ID tokens are JWTs with format: header.payload.signature
const decodeJwtPayload = (token: string): any => {
  try {
    // JWT format: header.payload.signature
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }
    
    // Decode base64 payload (replace URL-safe characters)
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    // Add padding if needed
    const pad = payload.length % 4
    const paddedPayload = pad ? payload + '='.repeat(4 - pad) : payload
    // Decode using Buffer (works in Node.js/edge runtime)
    const decoded = Buffer.from(paddedPayload, 'base64').toString()
    return JSON.parse(decoded)
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}

export function middleware(request: NextRequest) {
  // Only check admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Get the session token from cookies (Firebase ID token)
    const sessionToken = request.cookies.get('session')?.value
    
    if (!sessionToken) {
      // No session token, redirect to login
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    // Try to decode the JWT token to get user email
    const payload = decodeJwtPayload(sessionToken)
    if (!payload || !payload.email) {
      // Invalid token or no email, redirect to login
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    // Check if user email is in admin list
    const adminEmails = getAdminEmails()
    const userEmail = payload.email.toLowerCase()
    const isAdmin = adminEmails.some(adminEmail => 
      adminEmail.toLowerCase() === userEmail
    )
    
    if (!isAdmin) {
      // Not an admin, redirect to home
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    // Admin user, allow access
    return NextResponse.next()
  }
}

export const config = {
  matcher: '/admin/:path*'
}
