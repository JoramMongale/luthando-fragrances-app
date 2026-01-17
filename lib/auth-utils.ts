import { auth as firebaseAuth } from './firebase'
import { User as FirebaseUser } from 'firebase/auth'

// Get current user based on auth provider
export async function getCurrentUser() {
  return getFirebaseUser()
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

// Get user ID
export async function getUserId(): Promise<string | null> {
  const user = await getCurrentUser()
  if (!user) return null
  return (user as FirebaseUser).uid
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
  const user = await getFirebaseUser()
  return user ? await user.getIdToken() : null
}

// Sign out from both systems (for cleanup)
export async function signOutBoth() {
  await firebaseAuth.signOut()
}