#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })

const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

if (!API_KEY) {
  console.error('❌ NEXT_PUBLIC_FIREBASE_API_KEY not found in .env.local')
  process.exit(1)
}

console.log('Testing Firebase Auth Registration via REST API')
console.log('===============================================\n')
console.log(`Project ID: ${PROJECT_ID}`)
console.log(`API Key: ${API_KEY ? '****' + API_KEY.slice(-4) : 'Missing'}`)

async function testRegistration() {
  try {
    const testEmail = `test-${Date.now()}@example.com`
    const testPassword = 'test123456'
    
    console.log('\n1. Attempting to create test user...')
    console.log(`   Email: ${testEmail}`)
    console.log(`   Password: ${testPassword}`)
    
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
          returnSecureToken: true
        })
      }
    )
    
    const data = await response.json()
    
    console.log(`\n2. Response Status: ${response.status}`)
    
    if (response.ok) {
      console.log('✅ REGISTRATION SUCCESSFUL!')
      console.log(`   User ID: ${data.localId}`)
      console.log(`   Email: ${data.email}`)
      console.log(`   ID Token: ${data.idToken ? '****' + data.idToken.slice(-8) : 'None'}`)
      console.log('\n   This means:')
      console.log('   • Firebase Authentication is enabled')
      console.log('   • Email/Password provider is working')
      console.log('   • API key has correct permissions')
      console.log('   • localhost is in authorized domains')
      
      // Try to delete the test user (optional)
      console.log('\n3. Cleaning up test user...')
      console.log('   Note: Test user will remain in Firebase Console')
      console.log('   You can manually delete it if needed')
      
    } else {
      console.log('❌ REGISTRATION FAILED')
      console.log(`   Error: ${data.error?.message || 'Unknown error'}`)
      console.log(`   Code: ${data.error?.code || 'Unknown'}`)
      
      if (data.error?.message?.includes('OPERATION_NOT_ALLOWED')) {
        console.log('\n   🔧 This means:')
        console.log('   • Email/Password provider is NOT enabled')
        console.log('   • Go to Firebase Console → Authentication → Sign-in method')
        console.log('   • Enable "Email/Password" provider')
      } else if (data.error?.message?.includes('INVALID_EMAIL')) {
        console.log('\n   🔧 This means:')
        console.log('   • Invalid email format')
      } else if (data.error?.message?.includes('WEAK_PASSWORD')) {
        console.log('\n   🔧 This means:')
        console.log('   • Password too weak (minimum 6 characters)')
      } else if (data.error?.message?.includes('EMAIL_EXISTS')) {
        console.log('\n   🔧 This means:')
        console.log('   • User already exists (try again)')
      } else if (data.error?.message?.includes('UNAUTHORIZED_DOMAIN')) {
        console.log('\n   🔧 This means:')
        console.log('   • localhost not in authorized domains')
        console.log('   • Go to Firebase Console → Authentication → Settings')
        console.log('   • Add "localhost" to authorized domains')
      }
    }
    
  } catch (error) {
    console.error('\n❌ Network/Request error:', error.message)
    console.error('   This could be a CORS issue or network problem')
  }
}

testRegistration()