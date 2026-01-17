import { auth as firebaseAuth } from './firebase'
import { supabase } from './supabase'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { User as FirebaseUser } from 'firebase/auth'

// Check which auth provider to use
export const shouldUseFirebaseAuth = () => process.env.NEXT_PUBLIC_USE_FIREBASE_AUTH === 'true'

// Get current user based on auth provider
export async function getCurrentUser() {
  if (shouldUseFirebaseAuth()) {
    return getFirebaseUser()
  } else {
    return getSupabaseUser()
  }
}

// Get Firebase user
export async function getFirebaseUser(): Promise<FirebaseUser | null> {
  return new Promise((resolve) => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      unsubscribe()
      resolve(user)
    })
  })
}

// Get Supabase user
export async function getSupabaseUser(): Promise<SupabaseUser | null> {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user || null
}

// Get user ID
export async function getUserId(): Promise<string | null> {
  const user = await getCurrentUser()
  if (!user) return null
  
  if (shouldUseFirebaseAuth()) {
    return (user as FirebaseUser).uid
  } else {
    return (user as SupabaseUser).id
  }
}

// Get user email
export async function getUserEmail(): Promise<string | null> {
  const user = await getCurrentUser()
  return user?.email || null
}

// Check if user is admin
export async function isAdmin(): Promise<boolean> {
  const email = await getUserEmail()
  if (!email) return false
  
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.split(',') || []
  return adminEmails.includes(email.trim())
}

// Get auth token
export async function getAuthToken(): Promise<string | null> {
  if (shouldUseFirebaseAuth()) {
    const user = await getFirebaseUser()
    return user ? await user.getIdToken() : null
  } else {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token || null
  }
}

// Sign out from both systems (for cleanup)
export async function signOutBoth() {
  if (shouldUseFirebaseAuth()) {
    await firebaseAuth.signOut()
  }
  await supabase.auth.signOut()
}

// Migration helper: Check if user exists in both systems
export async function checkUserMigrationStatus(email: string) {
  const results = {
    existsInSupabase: false,
    existsInFirebase: false,
    needsMigration: false
  }
  
  try {
    // Check Supabase
    const { data: supabaseUser } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle()
    
    results.existsInSupabase = !!supabaseUser
    
    // Check Firebase
    try {
      // This would require Firebase Admin SDK on server side
      // For client side, we can check if user is signed in with Firebase
      const firebaseUser = await getFirebaseUser()
      results.existsInFirebase = firebaseUser?.email === email
    } catch {
      results.existsInFirebase = false
    }
    
    results.needsMigration = results.existsInSupabase && !results.existsInFirebase
    
  } catch (error) {
    console.error('Error checking user migration status:', error)
  }
  
  return results
}