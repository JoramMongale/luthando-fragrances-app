#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })
console.log('Testing Admin Functions with Firestore...')
console.log('=========================================\n')

// Check environment
console.log('1. Checking environment...')
console.log(`   NEXT_PUBLIC_USE_FIRESTORE: ${process.env.NEXT_PUBLIC_USE_FIRESTORE}`)
console.log(`   NEXT_PUBLIC_USE_FIREBASE_STORAGE: ${process.env.NEXT_PUBLIC_USE_FIREBASE_STORAGE}`)

if (process.env.NEXT_PUBLIC_USE_FIRESTORE !== 'true') {
  console.log('❌ Firestore is not enabled. Set NEXT_PUBLIC_USE_FIRESTORE=true in .env.local')
  process.exit(1)
}

// Import the unified-db module
const path = require('path')

// Since we can't directly import ES modules, let's test via the actual functions
// by creating a simple test that mimics what the admin page would do

async function testAdminFunctions() {
  try {
    console.log('\n2. Testing Firestore admin functions...')
    
    // Initialize Firebase
    const { initializeApp } = require('firebase/app')
    const { getFirestore, collection, getDocs, query, orderBy, limit } = require('firebase/firestore')
    
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    }
    
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    
    console.log('   ✅ Firebase initialized')
    
    // Test 1: Get all products (paged)
    console.log('\n3. Testing product queries...')
    const productsQuery = query(collection(db, 'products'), orderBy('created_at', 'desc'), limit(10))
    const productsSnapshot = await getDocs(productsQuery)
    const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    console.log(`   ✅ Retrieved ${products.length} products`)
    
    if (products.length > 0) {
      console.log('   Sample products:')
      products.slice(0, 3).forEach((product, index) => {
        console.log(`     ${index + 1}. ${product.name} - R${product.price} (Stock: ${product.stock_quantity})`)
      })
    }
    
    // Test 2: Check if we have the necessary collections
    console.log('\n4. Checking collections...')
    const collections = ['products', 'orders', 'order_items', 'user_profiles']
    
    for (const collectionName of collections) {
      const colRef = collection(db, collectionName)
      const snapshot = await getDocs(query(colRef, limit(1)))
      console.log(`   ${collectionName}: ${snapshot.size > 0 ? '✅ Has data' : '⚠️  Empty or not accessible'}`)
    }
    
    // Test 3: Check order stats function
    console.log('\n5. Testing order statistics...')
    const ordersQuery = query(collection(db, 'orders'), limit(10))
    const ordersSnapshot = await getDocs(ordersQuery)
    const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    console.log(`   ✅ Found ${orders.length} orders`)
    
    if (orders.length > 0) {
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
      console.log(`   Total revenue: R${totalRevenue.toFixed(2)}`)
    }
    
    console.log('\n🎉 Admin functions test complete!')
    console.log('\n🔧 Next: Test the admin interface at http://localhost:3000/admin/products')
    console.log('   Make sure you are logged in with an admin account.')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.error('   Stack:', error.stack)
    process.exit(1)
  }
}

testAdminFunctions().then(() => {
  process.exit(0)
})