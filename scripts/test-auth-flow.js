#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })

const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'jorammongale@outlook.com'

if (!API_KEY) {
  console.error('❌ NEXT_PUBLIC_FIREBASE_API_KEY not found in .env.local')
  process.exit(1)
}

console.log('Testing Firebase Auth Flow (Registration → Login → Admin)')
console.log('========================================================\n')
console.log(`Project ID: ${PROJECT_ID}`)
console.log(`Admin Email: ${ADMIN_EMAIL}`)
console.log(`API Key: ${API_KEY ? '****' + API_KEY.slice(-4) : 'Missing'}`)

async function testAuthFlow() {
  try {
    // Create a unique test user
    const testEmail = `test-${Date.now()}@example.com`
    const testPassword = 'test123456'
    
    console.log('\n1. Testing Registration...')
    console.log(`   Email: ${testEmail}`)
    
    // Register new user
    const signUpResponse = await fetch(
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
    
    const signUpData = await signUpResponse.json()
    
    if (signUpResponse.ok) {
      console.log('✅ Registration successful')
      console.log(`   User ID: ${signUpData.localId}`)
      console.log(`   ID Token: ${signUpData.idToken ? '****' + signUpData.idToken.slice(-8) : 'None'}`)
    } else {
      console.log('❌ Registration failed')
      console.log(`   Error: ${signUpData.error?.message}`)
      return
    }
    
    // Test login with the new user
    console.log('\n2. Testing Login...')
    
    const signInResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
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
    
    const signInData = await signInResponse.json()
    
    if (signInResponse.ok) {
      console.log('✅ Login successful')
      console.log(`   User ID: ${signInData.localId}`)
      console.log(`   ID Token: ${signInData.idToken ? '****' + signInData.idToken.slice(-8) : 'None'}`)
      
      // Decode JWT to check payload
      const token = signInData.idToken
      const payload = decodeJwtPayload(token)
      if (payload) {
        console.log(`   JWT Email: ${payload.email}`)
        console.log(`   JWT Issuer: ${payload.iss}`)
        console.log(`   JWT Expiry: ${new Date(payload.exp * 1000).toISOString()}`)
      }
    } else {
      console.log('❌ Login failed')
      console.log(`   Error: ${signInData.error?.message}`)
      return
    }
    
    // Test admin email registration
    console.log('\n3. Testing Admin Email Registration...')
    console.log(`   Admin Email: ${ADMIN_EMAIL}`)
    
    const adminPassword = 'Admin123456!'
    
    const adminSignUpResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: ADMIN_EMAIL,
          password: adminPassword,
          returnSecureToken: true
        })
      }
    )
    
    const adminSignUpData = await adminSignUpResponse.json()
    
    if (adminSignUpResponse.ok) {
      console.log('✅ Admin registration successful')
      console.log(`   User ID: ${adminSignUpData.localId}`)
      console.log(`   IMPORTANT: Save these credentials:`)
      console.log(`   Email: ${ADMIN_EMAIL}`)
      console.log(`   Password: ${adminPassword}`)
      console.log(`   Use these to login to the admin panel`)
    } else if (adminSignUpData.error?.message?.includes('EMAIL_EXISTS')) {
      console.log('ℹ️  Admin email already registered')
      console.log('   You can use existing credentials to login')
    } else {
      console.log('❌ Admin registration failed')
      console.log(`   Error: ${adminSignUpData.error?.message}`)
    }
    
    // Test password reset (just check if endpoint works)
    console.log('\n4. Testing Password Reset Request...')
    
    const resetResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestType: 'PASSWORD_RESET',
          email: testEmail
        })
      }
    )
    
    const resetData = await resetResponse.json()
    
    if (resetResponse.ok) {
      console.log('✅ Password reset request sent')
      console.log('   Check email for reset link (may go to spam)')
    } else {
      console.log('⚠️  Password reset request failed (might be rate limited)')
      console.log(`   Error: ${resetData.error?.message || 'Unknown'}`)
    }
    
    console.log('\n🎉 Auth Flow Test Complete!')
    console.log('\n🔧 Next Steps:')
    console.log('   1. Start dev server: npm run dev')
    console.log('   2. Visit: http://localhost:3000/auth/login')
    console.log('   3. Login with admin credentials')
    console.log('   4. Visit: http://localhost:3000/admin/products')
    console.log('   5. Verify admin access works')
    
  } catch (error) {
    console.error('\n❌ Network/Request error:', error.message)
    console.error('   This could be a CORS issue or network problem')
  }
}

// Simple JWT payload decoder
function decodeJwtPayload(token) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const pad = payload.length % 4
    const paddedPayload = pad ? payload + '='.repeat(4 - pad) : payload
    const decoded = Buffer.from(paddedPayload, 'base64').toString()
    return JSON.parse(decoded)
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}

testAuthFlow()