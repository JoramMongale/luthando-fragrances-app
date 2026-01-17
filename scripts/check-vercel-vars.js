#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })

console.log('Vercel Environment Variables Checklist')
console.log('======================================\n')

console.log('IMPORTANT: Add these to Vercel Dashboard → Settings → Environment Variables\n')

// Firebase Configuration
const firebaseVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'
]

console.log('1. FIREBASE CONFIGURATION (Required):')
firebaseVars.forEach(varName => {
  const value = process.env[varName]
  console.log(`   ${varName}: ${value ? '✅ Has value' : '❌ Missing'}`)
  if (value) {
    console.log(`      Value: ${varName.includes('KEY') ? '***' + value.slice(-4) : value}`)
  }
})

// Migration Feature Flags
const featureFlags = [
  'NEXT_PUBLIC_USE_FIREBASE_AUTH',
  'NEXT_PUBLIC_USE_FIRESTORE',
  'NEXT_PUBLIC_USE_FIREBASE_STORAGE',
  'NEXT_PUBLIC_FIRESTORE_BATCH_SIZE'
]

console.log('\n2. MIGRATION FEATURE FLAGS:')
featureFlags.forEach(varName => {
  const value = process.env[varName]
  console.log(`   ${varName}: ${value !== undefined ? `✅ = ${value}` : '❌ Missing (add with default)'}`)
})

// Existing variables that should already be in Vercel
const existingVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_PAYFAST_MERCHANT_ID',
  'NEXT_PUBLIC_PAYFAST_MERCHANT_KEY',
  'NEXT_PUBLIC_PAYFAST_SANDBOX',
  'NEXT_PUBLIC_ADMIN_EMAIL',
  'NEXT_PUBLIC_BUSINESS_NAME',
  'NEXT_PUBLIC_WHATSAPP_NUMBER',
  'NEXT_PUBLIC_APP_URL'
]

console.log('\n3. EXISTING VARIABLES (Should already be in Vercel):')
existingVars.forEach(varName => {
  const value = process.env[varName]
  console.log(`   ${varName}: ${value ? '✅ Present locally' : '❌ Missing locally'}`)
})

// Variables that should NOT be added to Vercel
const secretVars = [
  'FIREBASE_ADMIN_CLIENT_EMAIL',
  'FIREBASE_ADMIN_PRIVATE_KEY',
  'PAYFAST_PASSPHRASE'
]

console.log('\n4. SECRET VARIABLES (DO NOT add to Vercel):')
secretVars.forEach(varName => {
  const value = process.env[varName]
  console.log(`   ${varName}: ${value ? '⚠️  Present locally (keep secret!)' : '✅ Not set'}`)
})

console.log('\n======================================')
console.log('ACTION REQUIRED:')
console.log('1. Go to https://vercel.com/your-username/luthando-fragrances')
console.log('2. Settings → Environment Variables')
console.log('3. Add ALL variables from sections 1 and 2 above')
console.log('4. Make sure "Include in Build" is checked')
console.log('5. Redeploy after adding variables')
console.log('\nNote: Section 3 variables should already exist in Vercel')
console.log('      Section 4 variables should NEVER be added to Vercel')