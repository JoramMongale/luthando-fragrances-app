#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

console.log('Testing User Migration Setup...')
console.log('================================')

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials not found in .env.local')
  console.error('Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

console.log('✅ Supabase credentials loaded')

const supabase = createClient(supabaseUrl, supabaseKey)

async function testMigrationSetup() {
  try {
    // Test 1: Connect to Supabase
    console.log('\n1. Testing Supabase connection...')
    const { data: testData, error: testError } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error(`   ❌ Supabase connection failed: ${testError.message}`)
      console.error(`   Code: ${testError.code}, Details: ${testError.details}`)
    } else {
      console.log('   ✅ Connected to Supabase successfully')
    }
    
    // Test 2: Count users in Supabase
    console.log('\n2. Counting users in Supabase...')
    const { data: users, error: usersError } = await supabase
      .from('user_profiles')
      .select('id, email, created_at')
    
    if (usersError) {
      console.error(`   ❌ Error fetching users: ${usersError.message}`)
    } else {
      console.log(`   ✅ Found ${users.length} users in Supabase`)
      if (users.length > 0) {
        console.log('   Sample users:')
        users.slice(0, 3).forEach(user => {
          console.log(`     - ${user.email} (${user.id})`)
        })
        if (users.length > 3) {
          console.log(`     ... and ${users.length - 3} more`)
        }
      }
    }
    
    // Test 3: Check Firebase Admin credentials
    console.log('\n3. Checking Firebase Admin setup...')
    const hasAdminEmail = !!process.env.FIREBASE_ADMIN_CLIENT_EMAIL
    const hasAdminKey = !!process.env.FIREBASE_ADMIN_PRIVATE_KEY
    
    console.log(`   Firebase Admin Client Email: ${hasAdminEmail ? '✅ Present' : '❌ Missing'}`)
    console.log(`   Firebase Admin Private Key: ${hasAdminKey ? '✅ Present' : '❌ Missing'}`)
    
    if (!hasAdminEmail || !hasAdminKey) {
      console.log('\n   To set up Firebase Admin SDK:')
      console.log('   1. Go to Firebase Console → Project Settings → Service accounts')
      console.log('   2. Click "Generate new private key"')
      console.log('   3. Add the credentials to .env.local:')
      console.log('      FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxx@luthando-frangrances.iam.gserviceaccount.com')
      console.log('      FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"')
    }
    
    // Test 4: Check migration readiness
    console.log('\n4. Migration readiness check...')
    const readyForMigration = users && users.length > 0 && hasAdminEmail && hasAdminKey
    
    if (readyForMigration) {
      console.log('   ✅ Ready for migration!')
      console.log(`   You can migrate ${users.length} users to Firebase`)
    } else {
      console.log('   ⚠️  Not ready for migration yet')
      if (!users || users.length === 0) {
        console.log('   - No users found in Supabase')
      }
      if (!hasAdminEmail || !hasAdminKey) {
        console.log('   - Firebase Admin credentials missing')
      }
    }
    
    console.log('\n================================')
    console.log('Migration Setup Test Complete')
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message)
    console.error('Stack:', error.stack)
  }
}

testMigrationSetup()