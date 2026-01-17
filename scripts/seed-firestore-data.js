#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })
const { initializeApp } = require('firebase/app')
const { getFirestore, collection, doc, setDoc, serverTimestamp } = require('firebase/firestore')

console.log('🌱 Seeding Firestore with sample e-commerce data...')

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Sample products data for Luthando Fragrances
const sampleProducts = [
  {
    id: 'prod_mens_001',
    name: 'Midnight Oud',
    description: 'A bold and mysterious fragrance with notes of oud, leather, and spice. Perfect for evening events.',
    price: 129.99,
    category: 'For Him',
    stock_quantity: 50,
    sku: 'LF-MO-001',
    is_active: true,
    featured: true,
    image_url: 'https://firebasestorage.googleapis.com/v0/b/luthando-frangrances.appspot.com/o/products%2Fmidnight-oud.jpg?alt=media',
    created_at: serverTimestamp(),
    updated_at: serverTimestamp()
  },
  {
    id: 'prod_mens_002',
    name: 'Ocean Breeze',
    description: 'Fresh and aquatic scent with notes of sea salt, bergamot, and musk. Ideal for daytime wear.',
    price: 109.99,
    category: 'For Him',
    stock_quantity: 75,
    sku: 'LF-OB-002',
    is_active: true,
    featured: true,
    image_url: 'https://firebasestorage.googleapis.com/v0/b/luthando-frangrances.appspot.com/o/products%2Focean-breeze.jpg?alt=media',
    created_at: serverTimestamp(),
    updated_at: serverTimestamp()
  },
  {
    id: 'prod_womens_001',
    name: 'Rose Velvet',
    description: 'Elegant floral fragrance with Bulgarian rose, peony, and vanilla. A timeless classic.',
    price: 139.99,
    category: 'For Her',
    stock_quantity: 45,
    sku: 'LF-RV-001',
    is_active: true,
    featured: true,
    image_url: 'https://firebasestorage.googleapis.com/v0/b/luthando-frangrances.appspot.com/o/products%2Frose-velvet.jpg?alt=media',
    created_at: serverTimestamp(),
    updated_at: serverTimestamp()
  },
  {
    id: 'prod_womens_002',
    name: 'Citrus Bloom',
    description: 'Bright and energetic with notes of grapefruit, mandarin, and jasmine. Perfect for summer.',
    price: 119.99,
    category: 'For Her',
    stock_quantity: 60,
    sku: 'LF-CB-002',
    is_active: true,
    featured: false,
    image_url: 'https://firebasestorage.googleapis.com/v0/b/luthando-frangrances.appspot.com/o/products%2Fcitrus-bloom.jpg?alt=media',
    created_at: serverTimestamp(),
    updated_at: serverTimestamp()
  },
  {
    id: 'prod_unisex_001',
    name: 'Zen Harmony',
    description: 'A balanced unisex scent with sandalwood, green tea, and white musk. Promotes calm and focus.',
    price: 99.99,
    category: 'Unisex',
    stock_quantity: 80,
    sku: 'LF-ZH-001',
    is_active: true,
    featured: true,
    image_url: 'https://firebasestorage.googleapis.com/v0/b/luthando-frangrances.appspot.com/o/products%2Fzen-harmony.jpg?alt=media',
    created_at: serverTimestamp(),
    updated_at: serverTimestamp()
  },
  {
    id: 'prod_unisex_002',
    name: 'Urban Spice',
    description: 'Modern urban fragrance with black pepper, cedarwood, and amber. Bold and contemporary.',
    price: 124.99,
    category: 'Unisex',
    stock_quantity: 40,
    sku: 'LF-US-002',
    is_active: true,
    featured: false,
    image_url: 'https://firebasestorage.googleapis.com/v0/b/luthando-frangrances.appspot.com/o/products%2Furban-spice.jpg?alt=media',
    created_at: serverTimestamp(),
    updated_at: serverTimestamp()
  }
]

// Sample admin user (for testing admin functions)
const sampleAdminProfile = {
  id: 'admin_user_001',
  first_name: 'Admin',
  last_name: 'User',
  email: 'admin@luthandofragrances.com',
  phone: '+27123456789',
  role: 'admin',
  created_at: serverTimestamp(),
  updated_at: serverTimestamp()
}

async function seedDatabase() {
  try {
    console.log('📦 Seeding products...')
    
    // Seed products
    for (const product of sampleProducts) {
      const productRef = doc(db, 'products', product.id)
      await setDoc(productRef, product)
      console.log(`   ✅ Added: ${product.name} (${product.sku})`)
    }
    
    console.log('\n👤 Seeding admin profile...')
    const adminRef = doc(db, 'user_profiles', sampleAdminProfile.id)
    await setDoc(adminRef, sampleAdminProfile)
    console.log(`   ✅ Added admin profile: ${sampleAdminProfile.first_name} ${sampleAdminProfile.last_name}`)
    
    console.log('\n🎉 Seeding complete!')
    console.log(`   Total products: ${sampleProducts.length}`)
    console.log('   Collections created: products, user_profiles')
    console.log('\n🔧 Next steps:')
    console.log('   1. Enable Firestore in .env.local: NEXT_PUBLIC_USE_FIRESTORE=true')
    console.log('   2. Restart dev server: npm run dev')
    console.log('   3. Visit: http://localhost:3000/admin/products')
    
  } catch (error) {
    console.error('❌ Seeding error:', error.message)
    console.error('   Stack:', error.stack)
    process.exit(1)
  }
}

seedDatabase().then(() => {
  console.log('\n✨ Database seeded successfully!')
  process.exit(0)
})