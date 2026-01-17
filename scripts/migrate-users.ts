#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js'
import { initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Initialize Firebase Admin
const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')
}

if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
  console.error('Firebase Admin credentials not found in environment variables')
  console.error('Please add FIREBASE_ADMIN_CLIENT_EMAIL and FIREBASE_ADMIN_PRIVATE_KEY to .env.local')
  process.exit(1)
}

const firebaseApp = initializeApp({
  credential: cert(serviceAccount as any)
})

const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)

interface SupabaseUser {
  id: string
  email: string
  created_at: string
  updated_at: string
  role?: string
}

async function migrateUsers() {
  console.log('Starting user migration from Supabase to Firebase...')
  
  try {
    // Fetch all users from Supabase
    const { data: supabaseUsers, error } = await supabase
      .from('user_profiles')
      .select('*')
    
    if (error) {
      console.error('Error fetching users from Supabase:', error)
      return
    }
    
    console.log(`Found ${supabaseUsers?.length || 0} users in Supabase`)
    
    if (!supabaseUsers || supabaseUsers.length === 0) {
      console.log('No users to migrate')
      return
    }
    
    let migratedCount = 0
    let skippedCount = 0
    let errorCount = 0
    
    // Migrate each user
    for (const user of supabaseUsers) {
      try {
        console.log(`Migrating user: ${user.email}`)
        
        // Check if user already exists in Firebase Auth
        try {
          await auth.getUserByEmail(user.email)
          console.log(`User ${user.email} already exists in Firebase Auth, skipping...`)
          skippedCount++
          continue
        } catch (error: any) {
          // User doesn't exist, which is what we want
          if (error.code !== 'auth/user-not-found') {
            throw error
          }
        }
        
        // Create user in Firebase Auth with a temporary password
        // Users will need to reset their password
        const tempPassword = generateTempPassword()
        const firebaseUser = await auth.createUser({
          email: user.email,
          password: tempPassword,
          emailVerified: true, // Mark as verified since they were using the app
          disabled: false
        })
        
        console.log(`Created Firebase user: ${firebaseUser.uid}`)
        
        // Create user profile in Firestore
        await db.collection('user_profiles').doc(firebaseUser.uid).set({
          email: user.email,
          uid: firebaseUser.uid,
          supabaseId: user.id,
          role: user.role || 'customer',
          createdAt: new Date(user.created_at).toISOString(),
          updatedAt: new Date().toISOString(),
          migratedAt: new Date().toISOString(),
          needsPasswordReset: true // Flag for password reset
        })
        
        // Send password reset email
        await auth.generatePasswordResetLink(user.email)
        console.log(`Password reset link generated for: ${user.email}`)
        
        migratedCount++
        
      } catch (error: any) {
        console.error(`Error migrating user ${user.email}:`, error.message)
        errorCount++
      }
    }
    
    console.log('\n=== Migration Summary ===')
    console.log(`Total users in Supabase: ${supabaseUsers.length}`)
    console.log(`Successfully migrated: ${migratedCount}`)
    console.log(`Skipped (already exists): ${skippedCount}`)
    console.log(`Errors: ${errorCount}`)
    
    if (errorCount > 0) {
      console.log('\nSome users failed to migrate. Check the logs above for details.')
    }
    
  } catch (error: any) {
    console.error('Migration failed:', error)
  }
}

function generateTempPassword(): string {
  const length = 16
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return password
}

// Run migration
migrateUsers()