#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })

console.log('Checking Supabase Setup...')
console.log('==========================')

// Check environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('1. Environment Variables:')
console.log(`   NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✅ Present' : '❌ Missing'}`)
console.log(`   NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseKey ? '✅ Present' : '❌ Missing'}`)

if (supabaseUrl) {
  console.log(`   URL: ${supabaseUrl}`)
  
  // Check URL format
  if (!supabaseUrl.startsWith('https://')) {
    console.log('   ⚠️  Warning: URL should start with https://')
  }
  
  // Extract domain for testing
  const urlObj = new URL(supabaseUrl)
  const domain = urlObj.hostname
  console.log(`   Domain: ${domain}`)
}

console.log('\n2. Next Steps:')
console.log('   a. Verify the Supabase URL is correct')
console.log('   b. Check if Supabase project is active')
console.log('   c. Test network connectivity to Supabase')
console.log('   d. If Supabase is not accessible, you may need to:')
console.log('      - Renew Supabase subscription if expired')
console.log('      - Migrate to a new Supabase project')
console.log('      - Use Firebase exclusively (skip Supabase migration)')

console.log('\n3. Firebase Admin SDK Status:')
const hasAdminEmail = !!process.env.FIREBASE_ADMIN_CLIENT_EMAIL
const hasAdminKey = !!process.env.FIREBASE_ADMIN_PRIVATE_KEY
console.log(`   FIREBASE_ADMIN_CLIENT_EMAIL: ${hasAdminEmail ? '✅ Present' : '❌ Missing'}`)
console.log(`   FIREBASE_ADMIN_PRIVATE_KEY: ${hasAdminKey ? '✅ Present' : '❌ Missing'}`)

if (!hasAdminEmail || !hasAdminKey) {
  console.log('\n   To set up Firebase Admin SDK:')
  console.log('   1. Go to Firebase Console → Project Settings → Service accounts')
  console.log('   2. Click "Generate new private key"')
  console.log('   3. Save the JSON file')
  console.log('   4. Add to .env.local:')
  console.log('      FIREBASE_ADMIN_CLIENT_EMAIL=from-json-file')
  console.log('      FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"')
}

console.log('\n==========================')
console.log('Recommendation:')
if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Fix Supabase environment variables first')
} else if (!hasAdminEmail || !hasAdminKey) {
  console.log('⚠️  Set up Firebase Admin SDK to enable user migration')
} else {
  console.log('✅ Ready to proceed with migration setup')
}