'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User as FirebaseUser } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updatePassword as firebaseUpdatePassword,
  onAuthStateChanged
} from 'firebase/auth'
import { useRouter } from 'next/navigation'

interface FirebaseAuthContextType {
  user: FirebaseUser | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{
    data: any
    error: any
  }>
  signIn: (email: string, password: string) => Promise<{
    data: any
    error: any
  }>
  signOut: () => Promise<{ error: any }>
  resetPassword: (email: string) => Promise<{
    data: any
    error: any
  }>
  updatePassword: (newPassword: string) => Promise<{
    data: any
    error: any
  }>
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType | undefined>(undefined)

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Listen for auth changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Firebase auth state changed:', firebaseUser?.email)
      
      if (firebaseUser) {
        setUser(firebaseUser)
        
        // Set session cookie for middleware with Firebase ID token
        if (typeof window !== 'undefined') {
          // Get the Firebase ID token
          const token = await firebaseUser.getIdToken()
          // Set cookie with token (1 hour expiry to match token expiry)
          document.cookie = `session=${token}; path=/; max-age=3600; SameSite=Lax`
        }
        
        // Create/update user profile in Firestore
        try {
          // Import dynamically to avoid circular dependencies
          const { db } = await import('@/lib/firebase')
          const { doc, setDoc } = await import('firebase/firestore')
          
          await setDoc(doc(db, 'user_profiles', firebaseUser.uid), {
            email: firebaseUser.email,
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || '',
            emailVerified: firebaseUser.emailVerified,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }, { merge: true })
          
          console.log('Firebase user profile created/updated for:', firebaseUser.email)
        } catch (error) {
          console.error('Error creating Firebase user profile:', error)
        }
      } else {
        setUser(null)
        // Clear session cookie
        if (typeof window !== 'undefined') {
          document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax'
        }
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      // Firebase Auth will check if email already exists
      // and return 'auth/email-already-in-use' error if it does
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      console.log('Firebase user created successfully:', userCredential.user.email)
      return { data: userCredential, error: null }
    } catch (error: any) {
      console.error('Firebase signup error:', error)
      
      let errorMessage = 'An error occurred during signup'
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already in use. Please sign in instead.'
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use a stronger password.'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.'
      }
      
      return {
        data: null,
        error: { message: errorMessage, code: error.code }
      }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      console.log('Firebase sign in successful:', userCredential.user.email)
      return { data: userCredential, error: null }
    } catch (error: any) {
      console.error('Firebase sign in error:', error)
      
      let errorMessage = 'An error occurred during sign in'
      if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password. Please check your credentials.'
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.'
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.'
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.'
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.'
      }
      
      return {
        data: null,
        error: { message: errorMessage, code: error.code }
      }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      await firebaseSignOut(auth)
      return { error: null }
    } catch (error: any) {
      console.error('Firebase sign out error:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setLoading(true)
      // Use production URL for password reset links
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
      await sendPasswordResetEmail(auth, email, {
        url: `${appUrl}/auth/reset-password`,
      })
      return { data: { success: true }, error: null }
    } catch (error: any) {
      console.error('Firebase password reset error:', error)
      
      let errorMessage = 'An error occurred while sending password reset email'
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.'
      }
      
      return {
        data: null,
        error: { message: errorMessage, code: error.code }
      }
    } finally {
      setLoading(false)
    }
  }

  const updatePassword = async (newPassword: string) => {
    try {
      setLoading(true)
      
      if (!auth.currentUser) {
        throw new Error('No user is currently signed in')
      }
      
      await firebaseUpdatePassword(auth.currentUser, newPassword)
      return { data: { success: true }, error: null }
    } catch (error: any) {
      console.error('Firebase password update error:', error)
      
      let errorMessage = 'An error occurred while updating password'
      if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'Please sign in again to update your password.'
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use a stronger password.'
      }
      
      return {
        data: null,
        error: { message: errorMessage, code: error.code }
      }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  }

  return (
    <FirebaseAuthContext.Provider value={value}>
      {children}
    </FirebaseAuthContext.Provider>
  )
}

export function useFirebaseAuth() {
  const context = useContext(FirebaseAuthContext)
  if (context === undefined) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider')
  }
  return context
}