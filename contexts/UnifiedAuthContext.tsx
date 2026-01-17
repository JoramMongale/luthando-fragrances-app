'use client'

import React, { createContext, useContext } from 'react'
import { useAuth } from './AuthContext'
import { useFirebaseAuth } from './FirebaseAuthContext'

interface UnifiedAuthContextType {
  user: any
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
  authProvider: 'supabase' | 'firebase'
}

const UnifiedAuthContext = createContext<UnifiedAuthContextType | undefined>(undefined)

export function UnifiedAuthProvider({ children }: { children: React.ReactNode }) {
  const useFirebaseAuthFlag = process.env.NEXT_PUBLIC_USE_FIREBASE_AUTH === 'true'
  
  const supabaseAuth = useAuth()
  const firebaseAuth = useFirebaseAuth()

  const contextValue = useFirebaseAuthFlag 
    ? {
        user: firebaseAuth.user,
        loading: firebaseAuth.loading,
        signUp: firebaseAuth.signUp,
        signIn: firebaseAuth.signIn,
        signOut: firebaseAuth.signOut,
        resetPassword: firebaseAuth.resetPassword,
        updatePassword: firebaseAuth.updatePassword,
        authProvider: 'firebase' as const
      }
    : {
        user: supabaseAuth.user,
        loading: supabaseAuth.loading,
        signUp: supabaseAuth.signUp,
        signIn: supabaseAuth.signIn,
        signOut: supabaseAuth.signOut,
        resetPassword: supabaseAuth.resetPassword,
        updatePassword: supabaseAuth.updatePassword,
        authProvider: 'supabase' as const
      }

  return (
    <UnifiedAuthContext.Provider value={contextValue}>
      {children}
    </UnifiedAuthContext.Provider>
  )
}

export function useUnifiedAuth() {
  const context = useContext(UnifiedAuthContext)
  if (context === undefined) {
    throw new Error('useUnifiedAuth must be used within a UnifiedAuthProvider')
  }
  return context
}