#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })
const { initializeApp } = require('firebase/app')
const { getFirestore, collection, addDoc, getDocs } = require('firebase/firestore')

console.log('Testing Firestore Connection...')
console.log('==============================\n')

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

console.log('Firebase Config:')
console.log(`  Project ID: ${firebaseConfig.projectId}`)
console.log(`  API Key: ${firebaseConfig.apiKey ? '****' + firebaseConfig.apiKey.slice(-4) : 'Missing'}`)
console.log(`  Auth Domain: ${firebaseConfig.authDomain}`)
console.log('')

async function testFirestore() {
  try {
    // Initialize Firebase
    console.log('1. Initializing Firebase app...')
    const app = initializeApp(firebaseConfig)
    console.log('   ✅ Firebase app initialized')
    
    // Get Firestore instance
    console.log('\n2. Getting Firestore instance...')
    const db = getFirestore(app)
    console.log('   ✅ Firestore instance created')
    
    // Test connection by trying to list collections
    console.log('\n3. Testing Firestore connection...')
    console.log('   Note: Firestore might require authentication for some operations')
    console.log('   Trying to access Firestore...')
    
    // Try to get a simple collection
    try {
      // This will fail if Firestore is not properly set up or requires auth
      const testCollection = collection(db, 'test_connection')
      console.log('   ✅ Firestore collection reference created')
      
      // Try to add a test document (might fail without auth)
      console.log('\n4. Testing write operation...')
      try {
        const docRef = await addDoc(testCollection, {
          test: true,
          timestamp: new Date().toISOString(),
          message: 'Firestore connection test'
        })
        console.log(`   ✅ Document written with ID: ${docRef.id}`)
        
        // Try to read it back
        console.log('\n5. Testing read operation...')
        const querySnapshot = await getDocs(testCollection)
        console.log(`   ✅ Read ${querySnapshot.size} documents`)
        
        // Clean up (optional)
        console.log('\n6. Cleaning up test document...')
        // Note: We can't delete without admin SDK, but the test document is harmless
        
      } catch (writeError) {
        console.log(`   ⚠️  Write failed (might need auth): ${writeError.message}`)
        console.log('   This is expected if Firebase Auth is not set up yet')
      }
      
    } catch (collectionError) {
      console.log(`   ❌ Collection creation failed: ${collectionError.message}`)
      console.log('   This suggests Firestore is not properly initialized')
    }
    
    console.log('\n==============================')
    console.log('Firestore Test Complete')
    console.log('\nNext steps:')
    console.log('1. If writes failed, enable Firebase Authentication in Console')
    console.log('2. Check Firestore security rules')
    console.log('3. Verify the Firestore database is created in Console')
    
  } catch (error) {
    console.error('\n❌ Firestore test failed:')
    console.error(`   Error: ${error.message}`)
    console.error(`   Code: ${error.code || 'Unknown'}`)
    
    if (error.code === 'failed-precondition') {
      console.error('\n   🔧 This usually means:')
      console.error('   - Firestore is not enabled for the project')
      console.error('   - The database needs to be created in Firebase Console')
      console.error('   - Go to: https://console.firebase.google.com/project/luthando-frangrances/firestore')
    }
  }
}

testFirestore()