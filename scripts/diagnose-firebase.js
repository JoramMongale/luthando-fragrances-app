#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const https = require('https')
const { execSync } = require('child_process')

require('dotenv').config({ path: '.env.local' })

console.log('🔥 Firebase Migration Diagnostics Tool')
console.log('======================================\n')

// Check environment variables
console.log('1. Checking Environment Variables...')
console.log('------------------------------------')

const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
  'NEXT_PUBLIC_USE_FIREBASE_AUTH'
]

let allVarsPresent = true
requiredVars.forEach(varName => {
  const value = process.env[varName]
  if (!value) {
    console.log(`❌ ${varName}: MISSING`)
    allVarsPresent = false
  } else {
    console.log(`✅ ${varName}: ${varName.includes('KEY') || varName.includes('ID') ? '****' + value.slice(-4) : value}`)
  }
})

if (!allVarsPresent) {
  console.log('\n⚠️  Missing required environment variables!')
  console.log('   Check your .env.local file')
}

// Check Firebase project configuration
console.log('\n2. Checking Firebase Project Configuration...')
console.log('--------------------------------------------')

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY

if (!projectId || !apiKey) {
  console.log('❌ Cannot check Firebase project without Project ID and API Key')
  process.exit(1)
}

// Make HTTP request to Firebase API to check project status
function checkFirebaseAPI() {
  return new Promise((resolve, reject) => {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`
    
    const req = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    }, (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        try {
          const result = JSON.parse(data)
          resolve({ statusCode: res.statusCode, data: result })
        } catch (e) {
          resolve({ statusCode: res.statusCode, data: { error: 'Invalid JSON response' } })
        }
      })
    })
    
    req.on('error', (error) => {
      reject(error)
    })
    
    req.write(JSON.stringify({
      returnSecureToken: true
    }))
    req.end()
  })
}

async function runDiagnostics() {
  try {
    console.log(`   Project ID: ${projectId}`)
    console.log(`   API Key: ****${apiKey.slice(-4)}`)
    
    // Check if we can reach Firebase APIs
    console.log('   Testing Firebase API connectivity...')
    
    try {
      const result = await checkFirebaseAPI()
      
      if (result.statusCode === 400 && result.data.error && result.data.error.message) {
        const errorMsg = result.data.error.message
        
        if (errorMsg.includes('API key not valid')) {
          console.log('❌ API Key is invalid or restricted')
          console.log('   Go to: https://console.firebase.google.com/project/luthando-frangrances/settings/general')
          console.log('   Under "Your apps" → Web app → "Firebase SDK snippet" → "Config"')
          console.log('   Copy the correct API key')
        } else if (errorMsg.includes('TOO_MANY_ATTEMPTS_TRY_LATER')) {
          console.log('⚠️  Firebase API rate limited (normal for testing)')
          console.log('   This actually means the API is reachable!')
        } else if (errorMsg.includes('MISSING_REQUEST_TYPE')) {
          console.log('✅ Firebase API is reachable and responding')
          console.log('   The error is expected (missing proper request)')
        } else {
          console.log(`⚠️  Firebase API responded with: ${errorMsg}`)
          console.log('   This means the API is reachable at least')
        }
      } else if (result.statusCode === 200) {
        console.log('✅ Firebase API is working correctly')
      } else {
        console.log(`⚠️  Unexpected response: ${result.statusCode}`)
      }
    } catch (error) {
      console.log('❌ Cannot connect to Firebase APIs')
      console.log(`   Error: ${error.message}`)
    }
    
    // Check feature flags
    console.log('\n3. Checking Feature Flags...')
    console.log('---------------------------')
    
    const useFirebaseAuth = process.env.NEXT_PUBLIC_USE_FIREBASE_AUTH === 'true'
    const useFirestore = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true'
    const useFirebaseStorage = process.env.NEXT_PUBLIC_USE_FIREBASE_STORAGE === 'true'
    
    console.log(`   NEXT_PUBLIC_USE_FIREBASE_AUTH: ${useFirebaseAuth}`)
    console.log(`   NEXT_PUBLIC_USE_FIRESTORE: ${useFirestore}`)
    console.log(`   NEXT_PUBLIC_USE_FIREBASE_STORAGE: ${useFirebaseStorage}`)
    
    if (useFirebaseAuth) {
      console.log('   ✅ Firebase Auth is ENABLED in app')
    } else {
      console.log('   ⚠️  Firebase Auth is DISABLED in app')
      console.log('      Set NEXT_PUBLIC_USE_FIREBASE_AUTH=true to enable')
    }
    
    // Check Firebase CLI
    console.log('\n4. Checking Firebase CLI...')
    console.log('--------------------------')
    
    try {
      const firebaseVersion = execSync('firebase --version', { encoding: 'utf8' }).trim()
      console.log(`   ✅ Firebase CLI installed: ${firebaseVersion}`)
      
      // Check current project
      try {
        const currentProject = execSync('firebase use', { encoding: 'utf8' }).trim()
        console.log(`   ✅ Firebase project: ${currentProject}`)
        
        if (!currentProject.includes(projectId)) {
          console.log(`   ⚠️  CLI project (${currentProject}) doesn't match .env (${projectId})`)
          console.log(`      Run: firebase use ${projectId}`)
        }
      } catch (e) {
        console.log('   ⚠️  No Firebase project selected')
        console.log(`      Run: firebase use ${projectId}`)
      }
    } catch (e) {
      console.log('❌ Firebase CLI not installed or not in PATH')
      console.log('   Install: npm install -g firebase-tools')
    }
    
    // Console setup checklist
    console.log('\n5. Firebase Console Setup Checklist')
    console.log('-----------------------------------')
    console.log('   Go to: https://console.firebase.google.com/project/luthando-frangrances')
    console.log('\n   Required steps:')
    console.log('   [ ] 1. Authentication → Enable Email/Password provider')
    console.log('   [ ] 2. Authentication → Settings → Add "localhost" to authorized domains')
    console.log('   [ ] 3. Firestore Database → Create database (test mode)')
    console.log('   [ ] 4. Storage → Get Started (test mode)')
    console.log('   [ ] 5. Check API key restrictions:')
    console.log('       - Go to: https://console.cloud.google.com/apis/credentials')
    console.log('       - Find API key: ****' + apiKey.slice(-4))
    console.log('       - Ensure "Application restrictions" are set correctly')
    console.log('       - "HTTP referrers" should include:')
    console.log('         • localhost:*')
    console.log('         • luthando-frangrances.firebaseapp.com')
    
    // Browser test instructions
    console.log('\n6. Browser Test Instructions')
    console.log('---------------------------')
    console.log('   After enabling Authentication in Console:')
    console.log('   1. Restart dev server: npm run dev')
    console.log('   2. Open browser console (F12)')
    console.log('   3. Go to: http://localhost:3000/auth/register')
    console.log('   4. Try creating an account')
    console.log('   5. Check browser console for errors')
    
    // Quick fix command
    console.log('\n7. Quick Fix Commands')
    console.log('--------------------')
    console.log('   To temporarily disable Firebase Auth for testing:')
    console.log('   sed -i \'s/NEXT_PUBLIC_USE_FIREBASE_AUTH=true/NEXT_PUBLIC_USE_FIREBASE_AUTH=false/\' .env.local')
    console.log('\n   To enable Auth-only mode:')
    console.log('   npm run toggle:firebase-services')
    console.log('   (Select option 2: Auth only)')
    
    console.log('\n======================================')
    console.log('Diagnostics complete!')
    
  } catch (error) {
    console.error('Diagnostic error:', error)
  }
}

runDiagnostics()