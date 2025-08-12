'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{
    data: any
    error: AuthError | null
  }>
  signIn: (email: string, password: string) => Promise<{
    data: any
    error: AuthError | null
  }>
  signOut: () => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{
    data: any
    error: AuthError | null
  }>
  updatePassword: (newPassword: string) => Promise<{
    data: any
    error: AuthError | null
  }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    checkUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, 'User:', session?.user?.email)
        
        if (session?.user) {
          setUser(session.user)
          
          // Create/update user profile with comprehensive error handling
          try {
            const { error } = await supabase
              .from('user_profiles')
              .upsert({
                id: session.user.id,
                email: session.user.email,
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'id'
              })
              
            if (error) {
              console.error('Supabase error creating user profile:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
              })
            } else {
              console.log('User profile created/updated successfully for:', session.user.email)
            }
          } catch (error) {
            console.error('Unexpected error creating user profile:', error)
            // Log the actual error object structure
            if (error && typeof error === 'object') {
              console.error('Error object keys:', Object.keys(error))
              console.error('Error stringified:', JSON.stringify(error, null, 2))
            }
          }
        } else {
          setUser(null)
        }
        
        setLoading(false)

        // Handle auth events
        if (event === 'SIGNED_IN') {
          console.log('User signed in:', session?.user?.email)
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out')
          router.push('/')
        } else if (event === 'PASSWORD_RECOVERY') {
          console.log('Password recovery initiated')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  const checkUser = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error getting session:', error)
      }
      
      setUser(session?.user ?? null)
    } catch (error) {
      console.error('Error checking user session:', error)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      // First, check if user already exists (with better error handling)
      const { data: existingUser, error: checkError } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('email', email)
        .maybeSingle() // Use maybeSingle instead of single
      
      // Handle check errors more gracefully
      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing user:', checkError)
        // Don't fail signup for check errors, just log them
      }
      
      if (existingUser) {
        return {
          data: null,
          error: { message: 'User already exists. Please sign in instead.' } as AuthError
        }
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            email: email,
          }
        }
      })

      if (error) {
        console.error('Signup error:', error)
        return { data: null, error }
      }

      if (data?.user) {
        console.log('User created successfully:', data.user.email)
        
        // The trigger should create the profile automatically
        // but we'll ensure it exists with better error handling
        try {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .upsert({
              id: data.user.id,
              email: data.user.email,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'id'
            })
          
          if (profileError) {
            console.error('Error creating profile during signup:', {
              message: profileError.message,
              details: profileError.details,
              code: profileError.code
            })
            // Don't fail the signup for profile creation issues
          } else {
            console.log('Profile created successfully during signup')
          }
        } catch (profileError) {
          console.error('Unexpected error creating profile during signup:', profileError)
        }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Unexpected signup error:', error)
      return {
        data: null,
        error: { message: 'An unexpected error occurred during signup' } as AuthError
      }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Sign in error:', error)
        
        // Provide more specific error messages
        if (error.message.includes('Invalid login credentials')) {
          return {
            data: null,
            error: { message: 'Invalid email or password. Please check your credentials and try again.' } as AuthError
          }
        } else if (error.message.includes('Email not confirmed')) {
          return {
            data: null,
            error: { message: 'Please verify your email before signing in. Check your inbox for the verification link.' } as AuthError
          }
        }
        
        return { data: null, error }
      }

      console.log('Sign in successful:', data.user?.email)
      return { data, error: null }
    } catch (error) {
      console.error('Unexpected sign in error:', error)
      return {
        data: null,
        error: { message: 'An unexpected error occurred during sign in' } as AuthError
      }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
      }
      return { error }
    } catch (error) {
      console.error('Unexpected sign out error:', error)
      return { error: error as AuthError }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        console.error('Password reset error:', error)
        return { data: null, error }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Unexpected password reset error:', error)
      return {
        data: null,
        error: { message: 'An unexpected error occurred' } as AuthError
      }
    }
  }

  const updatePassword = async (newPassword: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        console.error('Password update error:', error)
        return { data: null, error }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Unexpected password update error:', error)
      return {
        data: null,
        error: { message: 'An unexpected error occurred' } as AuthError
      }
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
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}