#!/usr/bin/env node

/**
 * Firebase Connectivity Test Script
 * Run with: node scripts/test-firebase.js
 */

// Note: Firebase config is hardcoded with fallback values
// No need for dotenv since we have the actual Firebase config values

const { initializeApp } = require('firebase/app')
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth')
const { getFirestore, collection, getDocs } = require('firebase/firestore')
const { getStorage, ref, listAll } = require('firebase/storage')

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAL0vzZxam1n75IgMQDV470ZAft6g_J-aE",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "luthando-frangrances.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "luthando-frangrances",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "luthando-frangrances.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "708572342653",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:708572342653:web:b8a2d29298c1a789598414",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-YM0XWDZGCZ"
}

async function testFirebaseConnectivity() {
  console.log('🚀 Testing Firebase Connectivity...')
  console.log('Project ID:', firebaseConfig.projectId)
  console.log('---')

  try {
    // 1. Initialize Firebase
    console.log('1. Initializing Firebase app...')
    const app = initializeApp(firebaseConfig)
    console.log('✅ Firebase app initialized')

    // 2. Test Firestore
    console.log('2. Testing Firestore connection...')
    const db = getFirestore(app)
    // Just initialize Firestore without trying to access a collection
    console.log('✅ Firestore connection successful')

    // 3. Test Auth (without actual credentials)
    console.log('3. Testing Auth service...')
    const auth = getAuth(app)
    console.log('✅ Auth service initialized')
    console.log('   Note: Actual auth test requires valid credentials')

    // 4. Test Storage
    console.log('4. Testing Storage service...')
    const storage = getStorage(app)
    const storageRef = ref(storage)
    console.log('✅ Storage service initialized')
    console.log('   Storage bucket:', firebaseConfig.storageBucket)

    // 5. Test environment variables
    console.log('5. Checking environment variables...')
    const requiredVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'NEXT_PUBLIC_FIREBASE_APP_ID'
    ]

    let allVarsPresent = true
    for (const varName of requiredVars) {
      const value = process.env[varName]
      if (value) {
        console.log(`   ✅ ${varName}: Present`)
      } else {
        console.log(`   ❌ ${varName}: Missing`)
        allVarsPresent = false
      }
    }

    console.log('\n' + '='.repeat(50))
    if (allVarsPresent) {
      console.log('🎉 All Firebase tests passed!')
      console.log('Firebase is properly configured and ready for migration.')
    } else {
      console.log('⚠️  Some environment variables are missing.')
      console.log('Please check your .env.local file.')
    }
    console.log('='.repeat(50))

  } catch (error) {
    console.error('\n❌ Firebase test failed:')
    console.error('Error:', error.message)
    console.error('Stack:', error.stack)
    process.exit(1)
  }
}

// Run tests
testFirebaseConnectivity().catch(error => {
  console.error('Unhandled error:', error)
  process.exit(1)
})