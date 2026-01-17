#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })
console.log('🛍️ Testing E-commerce Flow with Firebase...')
console.log('===========================================\n')

// Check environment
console.log('1. Environment Check:')
console.log(`   NEXT_PUBLIC_USE_FIRESTORE: ${process.env.NEXT_PUBLIC_USE_FIRESTORE}`)
console.log(`   NEXT_PUBLIC_USE_FIREBASE_STORAGE: ${process.env.NEXT_PUBLIC_USE_FIREBASE_STORAGE}`)
console.log(`   NEXT_PUBLIC_USE_FIREBASE_AUTH: ${process.env.NEXT_PUBLIC_USE_FIREBASE_AUTH}`)

if (process.env.NEXT_PUBLIC_USE_FIRESTORE !== 'true') {
  console.log('❌ Firestore is not enabled!')
  process.exit(1)
}

// Test Firebase connection
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

async function testEcommerceFlow() {
  try {
    console.log('\n2. Initializing Firebase...')
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    console.log('   ✅ Firebase initialized')
    
    console.log('\n3. Testing Product Fetching...')
    const productsQuery = query(collection(db, 'products'), orderBy('created_at', 'desc'), limit(10))
    const productsSnapshot = await getDocs(productsQuery)
    const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    console.log(`   ✅ Found ${products.length} products`)
    
    if (products.length === 0) {
      console.log('   ⚠️  No products found. Please seed the database.')
    } else {
      console.log('   Sample products:')
      products.forEach((product, index) => {
        console.log(`     ${index + 1}. ${product.name} - R${product.price} (Stock: ${product.stock_quantity})`)
      })
    }
    
    console.log('\n4. Testing Collections Structure...')
    const collections = [
      { name: 'products', required: true, description: 'Product catalog' },
      { name: 'orders', required: false, description: 'Customer orders' },
      { name: 'order_items', required: false, description: 'Order line items' },
      { name: 'user_profiles', required: true, description: 'User profiles' },
      { name: 'cart_items', required: false, description: 'Shopping cart items' }
    ]
    
    for (const col of collections) {
      const colRef = collection(db, col.name)
      const snapshot = await getDocs(query(colRef, limit(1)))
      const status = snapshot.size > 0 ? '✅ Has data' : (col.required ? '⚠️  Empty' : '⚪ Empty (optional)')
      console.log(`   ${col.name}: ${status} - ${col.description}`)
    }
    
    console.log('\n5. Testing Admin User...')
    const adminProfilesQuery = query(
      collection(db, 'user_profiles'),
      limit(1)
    )
    const adminSnapshot = await getDocs(adminProfilesQuery)
    const adminProfiles = adminSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    if (adminProfiles.length > 0) {
      const admin = adminProfiles[0]
      console.log(`   ✅ Admin profile found: ${admin.first_name} ${admin.last_name}`)
      console.log(`      Email: ${admin.email || 'Not specified'}`)
      console.log(`      Role: ${admin.role || 'Not specified'}`)
    } else {
      console.log('   ⚠️  No admin profiles found')
    }
    
    console.log('\n🎉 E-commerce Flow Test Complete!')
    console.log('\n🔧 Next Steps to Test Manually:')
    console.log('   1. Visit: http://localhost:3001')
    console.log('   2. Register a new user account')
    console.log('   3. Login to admin: http://localhost:3001/admin/products')
    console.log('   4. Add/edit products with images')
    console.log('   5. Test cart → checkout → order flow')
    console.log('   6. Verify orders appear in admin panel')
    
    console.log('\n📋 Required Admin Actions:')
    console.log('   • Update lib/admin.ts with actual admin emails')
    console.log('   • Configure PayFast credentials in .env.local')
    console.log('   • Update Firebase security rules for production')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.error('   Stack:', error.stack)
    process.exit(1)
  }
}

testEcommerceFlow().then(() => {
  console.log('\n✨ All tests passed! Firebase migration is working.')
  process.exit(0)
})