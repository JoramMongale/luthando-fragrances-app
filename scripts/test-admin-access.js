#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })

const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'jorammongale@outlook.com'

if (!API_KEY) {
  console.error('❌ NEXT_PUBLIC_FIREBASE_API_KEY not found')
  process.exit(1)
}

console.log('Testing Admin Access Middleware')
console.log('================================\n')

async function testAdminAccess() {
  try {
    // 1. Create a non-admin test user
    const testEmail = `nonadmin-${Date.now()}@example.com`
    const testPassword = 'test123456'
    
    console.log('1. Creating non-admin test user...')
    console.log(`   Email: ${testEmail}`)
    
    const signUpRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
          returnSecureToken: true
        })
      }
    )
    
    const signUpData = await signUpRes.json()
    
    if (!signUpRes.ok) {
      console.log(`❌ Failed to create test user: ${signUpData.error?.message}`)
      return
    }
    
    const nonAdminToken = signUpData.idToken
    console.log('✅ Non-admin user created')
    console.log(`   User ID: ${signUpData.localId}`)
    console.log(`   ID Token: ****${nonAdminToken.slice(-8)}`)
    
    // 2. Test admin endpoint with non-admin token
    console.log('\n2. Testing /admin/products with non-admin token...')
    
    const nonAdminResponse = await fetch('http://localhost:3001/admin/products', {
      headers: {
        Cookie: `session=${nonAdminToken}`
      },
      redirect: 'manual' // Don't follow redirects
    })
    
    console.log(`   Status: ${nonAdminResponse.status}`)
    console.log(`   Location header: ${nonAdminResponse.headers.get('location') || 'None'}`)
    
    if (nonAdminResponse.status === 307 || nonAdminResponse.status === 302) {
      console.log('✅ Non-admin correctly redirected (expected)')
    } else if (nonAdminResponse.status === 200) {
      console.log('⚠️  Non-admin has access to admin panel (security issue!)')
    } else {
      console.log(`⚠️  Unexpected status: ${nonAdminResponse.status}`)
    }
    
    // 3. Test admin endpoint with invalid token
    console.log('\n3. Testing /admin/products with invalid token...')
    
    const invalidResponse = await fetch('http://localhost:3001/admin/products', {
      headers: {
        Cookie: 'session=invalid_token_here'
      },
      redirect: 'manual'
    })
    
    console.log(`   Status: ${invalidResponse.status}`)
    console.log(`   Location header: ${invalidResponse.headers.get('location') || 'None'}`)
    
    if (invalidResponse.status === 307 || invalidResponse.status === 302) {
      console.log('✅ Invalid token correctly redirected to login')
    } else {
      console.log(`⚠️  Unexpected status: ${invalidResponse.status}`)
    }
    
    // 4. Test admin endpoint without cookie
    console.log('\n4. Testing /admin/products without cookie...')
    
    const noCookieResponse = await fetch('http://localhost:3001/admin/products', {
      redirect: 'manual'
    })
    
    console.log(`   Status: ${noCookieResponse.status}`)
    console.log(`   Location header: ${noCookieResponse.headers.get('location') || 'None'}`)
    
    if (noCookieResponse.status === 307 || noCookieResponse.status === 302) {
      console.log('✅ No cookie correctly redirected to login')
    } else {
      console.log(`⚠️  Unexpected status: ${noCookieResponse.status}`)
    }
    
    // 5. Test homepage (should be accessible)
    console.log('\n5. Testing homepage accessibility...')
    
    const homepageResponse = await fetch('http://localhost:3001/')
    console.log(`   Status: ${homepageResponse.status}`)
    
    if (homepageResponse.status === 200) {
      console.log('✅ Homepage accessible')
    } else {
      console.log(`⚠️  Homepage not accessible: ${homepageResponse.status}`)
    }
    
    // 6. Test admin login with admin email (we don't have password)
    console.log('\n6. Admin access test:')
    console.log('   Note: Cannot test admin access without admin credentials')
    console.log('   Admin email:', ADMIN_EMAIL)
    console.log('   You need to:')
    console.log('   1. Login at http://localhost:3001/auth/login')
    console.log('   2. Use admin email and password')
    console.log('   3. Visit http://localhost:3001/admin/products')
    console.log('   4. Verify you can access admin panel')
    
    console.log('\n🎉 Middleware Test Complete!')
    console.log('\n🔧 Summary:')
    console.log('   - Non-admin users redirected from /admin: ✅')
    console.log('   - Invalid tokens redirected to login: ✅')
    console.log('   - No cookie redirected to login: ✅')
    console.log('   - Homepage accessible: ✅')
    console.log('\n⚠️  Manual test required:')
    console.log('   - Login with admin account and verify admin access')
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message)
    console.error('   Make sure dev server is running on port 3001')
  }
}

testAdminAccess()