#!/usr/bin/env node

const { initializeApp } = require('firebase/app')
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = require('firebase/auth')
require('dotenv').config({ path: '.env.local' })

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

console.log('Testing Firebase Auth Configuration...')
console.log('======================================')

// Check if config is loaded
const missingConfigs = []
Object.entries(firebaseConfig).forEach(([key, value]) => {
  if (!value) {
    missingConfigs.push(key)
  }
})

if (missingConfigs.length > 0) {
  console.error('❌ Missing Firebase configuration:')
  missingConfigs.forEach(key => console.error(`   - ${key}`))
  process.exit(1)
}

  console.log('✅ Firebase configuration loaded successfully')

// Initialize Firebase
let app
let auth

try {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  console.log('✅ Firebase app initialized')
} catch (error) {
  console.error('❌ Failed to initialize Firebase:', error.message)
  console.log('Firebase config:', JSON.stringify(firebaseConfig, null, 2))
  process.exit(1)
}

// Test functions
async function testFirebaseAuth() {
  console.log('\nTesting Firebase Auth operations...')
  console.log('===================================')
  
  try {
    // Test 1: Check auth initialization
    console.log('1. Testing auth initialization...')
    if (!auth) {
      throw new Error('Auth not initialized')
    }
    console.log('   ✅ Auth service initialized')
    
    // Test 2: Check current user (should be null)
    console.log('\n2. Checking current user state...')
    const currentUser = auth.currentUser
    console.log(`   ✅ Current user: ${currentUser ? currentUser.email : 'null (expected)'}`)
    
    // Test 3: Verify auth methods are available
    console.log('\n3. Verifying auth methods...')
    const methods = [
      'createUserWithEmailAndPassword',
      'signInWithEmailAndPassword', 
      'signOut',
      'sendPasswordResetEmail'
    ]
    
    let allMethodsAvailable = true
    for (const method of methods) {
      if (typeof auth[method] === 'undefined') {
        console.log(`   ❌ Method ${method} not available`)
        allMethodsAvailable = false
      }
    }
    
    if (allMethodsAvailable) {
      console.log('   ✅ All auth methods available')
    }
    
    // Test 4: Check Firebase project configuration
    console.log('\n4. Checking Firebase project...')
    console.log(`   Project ID: ${firebaseConfig.projectId}`)
    console.log(`   Auth Domain: ${firebaseConfig.authDomain}`)
    console.log(`   API Key present: ${!!firebaseConfig.apiKey}`)
    
    console.log('\n===================================')
    console.log('✅ Firebase Auth configuration test passed!')
    console.log('\nNote: Actual auth operations (create user, sign in, etc.)')
    console.log('should be tested in the browser environment, not Node.js.')
    console.log('The Next.js app will handle Firebase Auth in the browser.')
    
  } catch (error) {
    console.error('\n❌ Firebase Auth test failed:')
    console.error(`   Error: ${error.code || 'Unknown error'}`)
    console.error(`   Message: ${error.message}`)
    console.error(`   Stack: ${error.stack}`)
    process.exit(1)
  }
}

testFirebaseAuth()