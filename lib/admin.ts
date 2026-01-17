// Admin email addresses - read from environment variable or fallback
const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAIL?.split(',') || []).concat([
  'jorammongale@outlook.com', // Your email added here
  'admin@luthandofragrances.co.za',
  'info@luthandofragrances.co.za'
]).filter(email => email.trim())

export function isAdmin(email: string): boolean {
  const normalizedEmail = email.toLowerCase().trim()
  console.log('Checking admin access for:', normalizedEmail)
  console.log('Admin emails:', ADMIN_EMAILS.map(e => e.toLowerCase()))
  const isAdminUser = ADMIN_EMAILS.some(adminEmail => adminEmail.toLowerCase() === normalizedEmail)
  console.log('Is admin:', isAdminUser)
  return isAdminUser
}

export function checkAdminAccess(email?: string): boolean {
  if (!email) return false
  return isAdmin(email)
}

export const ADMIN_CONFIG = {
  emails: ADMIN_EMAILS,
  routes: {
    dashboard: '/admin',
    orders: '/admin/orders',
    products: '/admin/products',
    customers: '/admin/customers',
    analytics: '/admin/analytics',
    settings: '/admin/settings'
  }
}
