#!/usr/bin/env node

const { initializeApp } = require('firebase/app')
require('dotenv').config({ path: '.env.local' })

console.log('Testing Firebase initialization...')

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

console.log('Config:', JSON.stringify(firebaseConfig, null, 2))

try {
  const app = initializeApp(firebaseConfig)
  console.log('✅ Firebase initialized successfully!')
  console.log('App name:', app.name)
} catch (error) {
  console.error('❌ Firebase initialization failed:', error.message)
  console.error('Error code:', error.code)
  console.error('Full error:', error)
}