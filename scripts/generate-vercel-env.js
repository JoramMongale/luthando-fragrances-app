#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })

console.log('📋 VERCEL ENVIRONMENT VARIABLES TO ADD')
console.log('=======================================\n')
console.log('Copy and paste these into Vercel Dashboard → Settings → Environment Variables')
console.log('Make sure "Include in Build" is checked for all.\n')

const vars = {
  // Firebase Configuration
  'NEXT_PUBLIC_FIREBASE_API_KEY': process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN': process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID': process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET': process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID': process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  'NEXT_PUBLIC_FIREBASE_APP_ID': process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID': process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  
  // Migration Feature Flags
  'NEXT_PUBLIC_USE_FIREBASE_AUTH': process.env.NEXT_PUBLIC_USE_FIREBASE_AUTH || 'true',
  'NEXT_PUBLIC_USE_FIRESTORE': process.env.NEXT_PUBLIC_USE_FIRESTORE || 'false',
  'NEXT_PUBLIC_USE_FIREBASE_STORAGE': process.env.NEXT_PUBLIC_USE_FIREBASE_STORAGE || 'false',
  'NEXT_PUBLIC_FIRESTORE_BATCH_SIZE': process.env.NEXT_PUBLIC_FIRESTORE_BATCH_SIZE || '100'
}

Object.entries(vars).forEach(([key, value]) => {
  if (value) {
    console.log(`${key}=${value}`)
  }
})

console.log('\n=======================================')
console.log('⚠️  IMPORTANT NOTES:')
console.log('1. These variables should be added to BOTH Production and Preview environments')
console.log('2. DO NOT add PAYFAST_PASSPHRASE or Firebase Admin credentials to Vercel')
console.log('3. Existing Supabase variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) should remain')
console.log('4. After adding variables, redeploy the project from Vercel Dashboard')
console.log('5. Current configuration: Firebase Auth ON, Firestore OFF, Firebase Storage OFF')
console.log('\n🔗 Vercel Dashboard: https://vercel.com/JoramMongale/luthando-fragrances-app/settings/environment-variables')