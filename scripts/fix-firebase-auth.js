#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })

console.log('Firebase Auth Troubleshooting Guide')
console.log('====================================\n')

console.log('ERROR: "createErrorInternal" when creating account')
console.log('This usually means Firebase Auth API calls are failing.\n')

console.log('1. CHECK FIREBASE CONSOLE SETTINGS:\n')

console.log('   A. Enable Firebase Authentication:')
console.log('      1. Go to: https://console.firebase.google.com/project/luthando-frangrances')
console.log('      2. Click "Authentication" in left menu')
console.log('      3. Click "Get Started"')
console.log('      4. Select "Email/Password" provider')
console.log('      5. Enable "Email/Password" sign-in')
console.log('      6. Click "Save"\n')

console.log('   B. Add Authorized Domains:')
console.log('      1. In Authentication → Settings → Authorized domains')
console.log('      2. Click "Add domain"')
console.log('      3. Add: "localhost"')
console.log('      4. Add: "luthando-frangrances.firebaseapp.com"')
console.log('      5. Add your Vercel domain if known')
console.log('      6. Click "Save"\n')

console.log('   C. Check API Key Restrictions:')
console.log('      1. Go to: Google Cloud Console')
console.log('      2. Navigate to: APIs & Services → Credentials')
console.log('      3. Find API key: AIzaSyAL0vzZxam1n75IgMQDV470ZAft6g_J-aE')
console.log('      4. Check "Application restrictions":')
console.log('         - Should be "None" or include your domains')
console.log('         - If "HTTP referrers", add: "localhost/*"')
console.log('         - If "IP addresses", add your server IP')
console.log('      5. Check "API restrictions":')
console.log('         - Should be "None" or include "Firebase Authentication API"\n')

console.log('2. TEST IN BROWSER CONSOLE:\n')

console.log('   Open browser console (F12) and run:')
console.log('   ```javascript')
console.log('   // Check Firebase initialization')
console.log('   console.log("Firebase app:", window.firebaseApp)')
console.log('   console.log("Firebase auth:", window.firebaseAuth)')
console.log('   ')
console.log('   // Try to create user directly')
console.log('   import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"')
console.log('   const auth = getAuth()')
console.log('   createUserWithEmailAndPassword(auth, "test@test.com", "Test123!")')
console.log('     .then(user => console.log("Success:", user))')
console.log('     .catch(error => console.error("Full error:", error))')
console.log('   ```\n')

console.log('3. CHECK NETWORK REQUESTS:\n')

console.log('   In browser DevTools → Network tab:')
console.log('   1. Filter by "fetch" or "xhr"')
console.log('   2. Try to create account')
console.log('   3. Look for failed requests to:')
console.log('      - https://identitytoolkit.googleapis.com/v1/accounts:signUp')
console.log('      - https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser')
console.log('   4. Check response status and error details\n')

console.log('4. TEMPORARY FIX - DISABLE OTHER FIREBASE SERVICES:\n')

console.log('   Edit .env.local and set:')
console.log('   NEXT_PUBLIC_USE_FIRESTORE=false')
console.log('   NEXT_PUBLIC_USE_FIREBASE_STORAGE=false')
console.log('   ')
console.log('   Then restart: npm run dev')
console.log('   This isolates Auth from potential Firestore/Storage issues\n')

console.log('5. ALTERNATIVE: TEST WITH FIREBASE EMULATOR:\n')

console.log('   ```bash')
console.log('   # Install emulator if not already')
console.log('   firebase init emulators')
console.log('   ')
console.log('   # Start emulators')
console.log('   npm run firebase:emulators')
console.log('   ')
console.log('   # In another terminal, update .env.local:')
console.log('   # Use emulator config (temporarily)')
console.log('   ```\n')

console.log('6. VERIFY FIREBASE PROJECT STATUS:\n')

console.log('   Check if project is active:')
console.log('   1. Firebase Console → Project Overview')
console.log('   2. Check for any warnings or suspensions')
console.log('   3. Verify billing is set up if needed')
console.log('   4. Check project usage limits\n')

console.log('====================================')
console.log('QUICK DIAGNOSIS:\n')

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
}

console.log('Current Firebase Config:')
Object.entries(config).forEach(([key, value]) => {
  console.log(`  ${key}: ${value ? '✅ Present' : '❌ Missing'}`)
  if (value && key.includes('Key')) {
    console.log(`    Value: ***${value.slice(-4)}`)
  }
})

console.log('\nFeature Flags:')
console.log(`  USE_FIREBASE_AUTH: ${process.env.NEXT_PUBLIC_USE_FIREBASE_AUTH}`)
console.log(`  USE_FIRESTORE: ${process.env.NEXT_PUBLIC_USE_FIRESTORE}`)
console.log(`  USE_FIREBASE_STORAGE: ${process.env.NEXT_PUBLIC_USE_FIREBASE_STORAGE}`)

console.log('\n====================================')
console.log('NEXT STEPS:')
console.log('1. Enable Firebase Authentication in Console (MOST LIKELY ISSUE)')
console.log('2. Add localhost to authorized domains')
console.log('3. Check API key restrictions')
console.log('4. Test with browser console for detailed error')
console.log('5. Disable Firestore/Storage temporarily to isolate')