#!/usr/bin/env node

/**
 * Firebase Setup Verification Script
 * Run with: node scripts/verify-setup.js
 */

console.log('🔍 Verifying Firebase Setup...')
console.log('='.repeat(50))

// Check Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAL0vzZxam1n75IgMQDV470ZAft6g_J-aE",
  authDomain: "luthando-frangrances.firebaseapp.com",
  projectId: "luthando-frangrances",
  storageBucket: "luthando-frangrances.firebasestorage.app",
  messagingSenderId: "708572342653",
  appId: "1:708572342653:web:b8a2d29298c1a789598414",
  measurementId: "G-YM0XWDZGCZ"
}

console.log('📋 Firebase Configuration:')
console.log('─'.repeat(30))
console.log('Project ID:', firebaseConfig.projectId)
console.log('Auth Domain:', firebaseConfig.authDomain)
console.log('Storage Bucket:', firebaseConfig.storageBucket)
console.log('App ID:', firebaseConfig.appId)
console.log()

// Check configuration files
const fs = require('fs')
const path = require('path')

const filesToCheck = [
  'firebase.json',
  '.firebaserc',
  'firestore.rules',
  'firestore.indexes.json',
  'storage.rules',
  'lib/firebase.ts',
  'lib/firebase-admin.ts',
  'lib/feature-flags.ts',
  '.env.local'
]

console.log('📁 Configuration Files:')
console.log('─'.repeat(30))

let allFilesExist = true
for (const file of filesToCheck) {
  const filePath = path.join(__dirname, '..', file)
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`)
  } else {
    console.log(`❌ ${file} (missing)`)
    allFilesExist = false
  }
}
console.log()

// Check Firebase CLI
console.log('🛠️  Firebase CLI Status:')
console.log('─'.repeat(30))
try {
  const { execSync } = require('child_process')
  const firebaseVersion = execSync('firebase --version', { encoding: 'utf8' }).trim()
  console.log(`✅ Firebase CLI: ${firebaseVersion}`)
} catch (error) {
  console.log('❌ Firebase CLI not available')
  allFilesExist = false
}

// Check npm dependencies
console.log('\n📦 NPM Dependencies:')
console.log('─'.repeat(30))
try {
  const packageJson = require('../package.json')
  const requiredDeps = ['firebase', 'firebase-admin']
  
  for (const dep of requiredDeps) {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`)
    } else {
      console.log(`❌ ${dep}: Not installed`)
      allFilesExist = false
    }
  }
} catch (error) {
  console.log('❌ Could not read package.json')
  allFilesExist = false
}

// Summary
console.log('\n' + '='.repeat(50))
if (allFilesExist) {
  console.log('🎉 Firebase setup verification PASSED!')
  console.log('\nNext steps:')
  console.log('1. Enable Firebase Storage in the console')
  console.log('2. Test Firebase Auth with a sample user')
  console.log('3. Begin Phase 2: Authentication Migration')
} else {
  console.log('⚠️  Some setup items need attention')
  console.log('Please check the missing items above')
}
console.log('='.repeat(50))