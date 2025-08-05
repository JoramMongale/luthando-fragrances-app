// Admin email addresses from RLS policies
const ADMIN_EMAILS = [
  'admin@kuruman-perfumes.co.za',
  'admin@luthandofragrances.co.za',
  'joram@skeemlogistics.com',
  'info@luthandofragrances.co.za',
  'jorammongale@outlook.com'
]

export function isAdmin(email: string): boolean {
  return ADMIN_EMAILS.includes(email)
}

export function checkAdminAccess(email?: string): boolean {
  if (!email) return false
  return isAdmin(email)
}
