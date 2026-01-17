#!/usr/bin/env node

const https = require('https')
require('dotenv').config({ path: '.env.local' })

console.log('🔑 Testing Firebase API Key Configuration')
console.log('=========================================\n')

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

if (!apiKey) {
  console.log('❌ No API key found in .env.local')
  process.exit(1)
}

console.log(`API Key: ${apiKey.slice(0, 10)}...${apiKey.slice(-4)}`)
console.log(`Project ID: ${projectId}`)
console.log('\nTesting API key with different endpoints...\n')

// Test endpoints
const endpoints = [
  {
    name: 'Identity Toolkit (Auth)',
    url: `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
    method: 'POST',
    body: JSON.stringify({ returnSecureToken: true })
  },
  {
    name: 'Firestore REST API',
    url: `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`,
    method: 'GET'
  }
]

function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const req = https.request(endpoint.url, {
      method: endpoint.method || 'GET',
      headers: endpoint.headers || { 'Content-Type': 'application/json' }
    }, (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          resolve({
            status: res.statusCode,
            statusText: res.statusMessage,
            data: json,
            endpoint: endpoint.name
          })
        } catch {
          resolve({
            status: res.statusCode,
            statusText: res.statusMessage,
            data: data.substring(0, 200),
            endpoint: endpoint.name
          })
        }
      })
    })
    
    req.on('error', (error) => {
      resolve({
        status: 'NETWORK_ERROR',
        error: error.message,
        endpoint: endpoint.name
      })
    })
    
    if (endpoint.body) {
      req.write(endpoint.body)
    }
    req.end()
  })
}

async function runTests() {
  for (const endpoint of endpoints) {
    console.log(`Testing: ${endpoint.name}`)
    console.log(`URL: ${endpoint.url.split('?')[0]}`)
    
    const result = await testEndpoint(endpoint)
    
    console.log(`Status: ${result.status} ${result.statusText || ''}`)
    
    if (result.status === 400) {
      if (result.data?.error?.message?.includes('API key not valid')) {
        console.log('❌ ERROR: API key is invalid or has incorrect restrictions')
        console.log('   Solution: Check API key restrictions in Google Cloud Console')
        console.log('   URL: https://console.cloud.google.com/apis/credentials')
      } else if (result.data?.error?.message?.includes('CONFIGURATION_NOT_FOUND')) {
        console.log('❌ ERROR: Firebase Authentication not enabled')
        console.log('   Solution: Enable Authentication in Firebase Console')
        console.log('   URL: https://console.firebase.google.com/project/luthando-frangrances/authentication')
      } else if (result.data?.error?.message) {
        console.log(`❌ ERROR: ${result.data.error.message}`)
      } else {
        console.log('⚠️  Received 400 error (this is somewhat expected for test calls)')
      }
    } else if (result.status === 403) {
      console.log('❌ ERROR: 403 Forbidden - API key restricted')
      console.log('   Solution: Check API key application restrictions')
      console.log('   - Go to: https://console.cloud.google.com/apis/credentials')
      console.log('   - Find your API key')
      console.log('   - Check "Application restrictions"')
      console.log('   - Should be "None" or include localhost')
    } else if (result.status === 200) {
      console.log('✅ SUCCESS: API key is working')
    } else if (result.status === 404) {
      console.log('⚠️  404 Not Found - Service endpoint not found')
      console.log('   This could mean:')
      console.log('   - Service not enabled (Firestore, Auth, etc.)')
      console.log('   - Wrong endpoint URL')
    } else {
      console.log(`⚠️  Unexpected status: ${result.status}`)
    }
    
    console.log('')
  }
  
  console.log('📋 Summary of Issues:')
  console.log('====================')
  console.log('Based on the errors, here are the likely issues:')
  console.log('')
  console.log('1. ❌ FIREBASE AUTHENTICATION NOT ENABLED')
  console.log('   - Go to Firebase Console → Authentication → Get Started')
  console.log('   - Enable "Email/Password" provider')
  console.log('   - URL: https://console.firebase.google.com/project/luthando-frangrances/authentication')
  console.log('')
  console.log('2. 🔧 API KEY RESTRICTIONS (Possible)')
  console.log('   - Go to Google Cloud Console → APIs & Services → Credentials')
  console.log('   - Find your API key')
  console.log('   - Check "Application restrictions"')
  console.log('   - For development, set to "None"')
  console.log('   - Or add: localhost/*')
  console.log('')
  console.log('3. 🌐 FIREBASE SERVICES NOT ENABLED')
  console.log('   - Firestore: Needs to be created')
  console.log('   - Storage: Needs to be enabled')
  console.log('   - URL: https://console.firebase.google.com/project/luthando-frangrances')
  console.log('')
  console.log('🚀 Quick Fix Commands:')
  console.log('=====================')
  console.log('# Temporarily disable Firebase Auth to test app:')
  console.log(`sed -i 's/NEXT_PUBLIC_USE_FIREBASE_AUTH=true/NEXT_PUBLIC_USE_FIREBASE_AUTH=false/' .env.local`)
  console.log('')
  console.log('# Restart dev server:')
  console.log('npm run dev')
  console.log('')
  console.log('# After fixing Firebase Console, re-enable:')
  console.log(`sed -i 's/NEXT_PUBLIC_USE_FIREBASE_AUTH=false/NEXT_PUBLIC_USE_FIREBASE_AUTH=true/' .env.local`)
}

runTests()