// Admin email addresses
const ADMIN_EMAILS = [
  'jorammongale@outlook.com', // Your email added here
]

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
