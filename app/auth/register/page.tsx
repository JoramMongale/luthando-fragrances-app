'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const { signUp, user } = useUnifiedAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const { error } = await signUp(email, password)
      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push('/auth/login')
        }, 3000)
      }
    } catch (err: any) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-luxury-porcelain flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-luxury-porcelain border border-luxury-sand p-12 text-center">
            <div className="w-20 h-20 rounded-full border border-luxury-obsidian flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10 text-luxury-obsidian" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="font-serif-luxury text-4xl tracking-widest text-luxury-obsidian mb-6">ACCOUNT CREATED</h1>
            <div className="h-px w-16 bg-luxury-sand mx-auto mb-8"></div>
            <p className="font-sans-luxury tracking-wide text-luxury-obsidian/70 mb-10">
              Please check your email for a verification link before signing in.
            </p>
            <Link 
              href="/auth/login" 
              className="inline-block font-sans-luxury tracking-widest text-luxury-obsidian py-3 px-8 border border-luxury-obsidian hover:bg-luxury-obsidian hover:text-luxury-porcelain transition-all duration-300"
            >
              GO TO SIGN IN
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-luxury-porcelain flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Luxury Card */}
        <div className="bg-luxury-porcelain border border-luxury-sand p-10">
          {/* Logo Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 rounded-full border border-luxury-obsidian flex items-center justify-center mx-auto mb-6">
              <span className="font-serif-luxury font-bold text-3xl text-luxury-obsidian">L</span>
            </div>
            <h1 className="font-serif-luxury text-4xl tracking-widest text-luxury-obsidian mb-4">
              CREATE ACCOUNT
            </h1>
            <div className="h-px w-16 bg-luxury-sand mx-auto mb-6"></div>
            <p className="font-sans-luxury tracking-wide text-luxury-obsidian/70">
              Join Luthando Fragrances today
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="border border-luxury-obsidian/20 bg-luxury-vanilla-veil px-6 py-4 mb-8">
              <p className="font-sans-luxury tracking-wide text-luxury-obsidian">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Email Field */}
            <div>
              <label className="block font-sans-luxury tracking-widest text-sm text-luxury-obsidian mb-3">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-luxury-obsidian/50" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 border border-luxury-obsidian/30 bg-transparent font-sans-luxury tracking-wide text-luxury-obsidian placeholder:text-luxury-obsidian/30 focus:outline-none focus:border-luxury-obsidian transition-all duration-300"
                  placeholder="ENTER YOUR EMAIL"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block font-sans-luxury tracking-widest text-sm text-luxury-obsidian mb-3">
                PASSWORD
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-luxury-obsidian/50" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-12 py-4 border border-luxury-obsidian/30 bg-transparent font-sans-luxury tracking-wide text-luxury-obsidian placeholder:text-luxury-obsidian/30 focus:outline-none focus:border-luxury-obsidian transition-all duration-300"
                  placeholder="CREATE A PASSWORD"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-luxury-obsidian/50 hover:text-luxury-obsidian transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-luxury-obsidian/50 hover:text-luxury-obsidian transition-colors" />
                  )}
                </button>
              </div>
              <p className="font-sans-luxury tracking-wide text-xs text-luxury-obsidian/50 mt-2 pl-4">
                Must be at least 6 characters
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block font-sans-luxury tracking-widest text-sm text-luxury-obsidian mb-3">
                CONFIRM PASSWORD
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-luxury-obsidian/50" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 border border-luxury-obsidian/30 bg-transparent font-sans-luxury tracking-wide text-luxury-obsidian placeholder:text-luxury-obsidian/30 focus:outline-none focus:border-luxury-obsidian transition-all duration-300"
                  placeholder="CONFIRM YOUR PASSWORD"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full font-sans-luxury tracking-widest text-luxury-obsidian py-4 border border-luxury-obsidian overflow-hidden transition-all duration-500 hover:text-luxury-porcelain disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">
                {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
              </span>
              <div className="absolute inset-0 bg-luxury-obsidian transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-10 pt-8 border-t border-luxury-sand text-center">
            <p className="font-sans-luxury tracking-wide text-luxury-obsidian/70">
              ALREADY HAVE AN ACCOUNT?{' '}
              <Link 
                href="/auth/login" 
                className="font-sans-luxury tracking-widest text-luxury-obsidian hover:underline"
              >
                SIGN IN HERE
              </Link>
            </p>
          </div>

          {/* Back to Store */}
          <div className="mt-8 text-center">
            <Link 
              href="/" 
              className="font-sans-luxury tracking-widest text-sm text-luxury-obsidian/50 hover:text-luxury-obsidian transition-colors inline-flex items-center gap-2"
            >
              ← BACK TO STORE
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
