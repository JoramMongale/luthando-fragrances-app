#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })
const { initializeApp } = require('firebase/app')
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth')

console.log('Testing Firebase Auth Registration...')
console.log('=====================================\n')

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

console.log('Configuration:')
console.log(`  Project: ${firebaseConfig.projectId}`)
console.log(`  Auth Domain: ${firebaseConfig.authDomain}`)
console.log(`  API Key: ${firebaseConfig.apiKey ? '****' + firebaseConfig.apiKey.slice(-4) : 'Missing'}`)
console.log(`  USE_FIREBASE_AUTH: ${process.env.NEXT_PUBLIC_USE_FIREBASE_AUTH}`)
console.log('')

async function testAuth() {
  try {
    // Initialize Firebase
    console.log('1. Initializing Firebase...')
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
    console.log('   ✅ Firebase initialized')
    
    // Note: We can't actually create a user in Node.js without proper setup
    // but we can test if the SDK initializes correctly
    console.log('\n2. Testing Auth SDK...')
    console.log('   Auth instance created:', !!auth)
    console.log('   Current user:', auth.currentUser ? auth.currentUser.email : 'null (expected)')
    
    // Check if we can access auth methods
    console.log('\n3. Checking auth methods...')
    const methods = ['createUserWithEmailAndPassword', 'signInWithEmailAndPassword', 'signOut']
    let allMethodsAvailable = true
    for (const method of methods) {
      if (typeof auth[method] === 'undefined') {
        console.log(`   ❌ ${method} not available`)
        allMethodsAvailable = false
      }
    }
    
    if (allMethodsAvailable) {
      console.log('   ✅ All auth methods available')
    }
    
    console.log('\n4. Testing Firebase project status...')
    console.log('   IMPORTANT: Node.js can\'t test actual auth operations (browser only)')
    console.log('   But based on the configuration, Firebase Auth appears to be set up.')
    
    console.log('\n5. Next steps:')
    console.log('   - Start the dev server: npm run dev')
    console.log('   - Visit: http://localhost:3000/auth/register')
    console.log('   - Try creating an account')
    console.log('   - Check browser console for errors')
    
    // Check for common issues
    console.log('\n6. Common issues to check:')
    console.log('   - API key restrictions in Google Cloud Console')
    console.log('   - "localhost" added to authorized domains in Firebase Console')
    console.log('   - Email/Password provider enabled in Firebase Console')
    
    if (!process.env.NEXT_PUBLIC_USE_FIREBASE_AUTH || process.env.NEXT_PUBLIC_USE_FIREBASE_AUTH !== 'true') {
      console.log('\n⚠️  WARNING: NEXT_PUBLIC_USE_FIREBASE_AUTH is not set to "true"')
      console.log('   Firebase Auth is disabled in the app')
      console.log('   Check your .env.local file')
    }
    
    console.log('\n=====================================')
    console.log('Test complete. Start the dev server to test actual registration.')
    
  } catch (error) {
    console.error('\n❌ Firebase Auth test failed:')
    console.error(`   Error: ${error.message}`)
    console.error(`   Code: ${error.code || 'Unknown'}`)
    
    if (error.code === 'auth/configuration-not-found') {
      console.error('\n   🔧 Firebase Authentication not enabled in Console')
      console.error('   Go to: https://console.firebase.google.com/project/luthando-frangrances/authentication')
    }
  }
}

testAuth()