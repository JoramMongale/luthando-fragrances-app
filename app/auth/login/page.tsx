'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signIn } = useUnifiedAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await signIn(email.toLowerCase().trim(), password)
      if (error) {
        setError(error.message)
      } else {
        // Redirect to intended page or home
        const params = new URLSearchParams(window.location.search)
        const redirect = params.get('redirect') || '/'
        router.push(redirect)
      }
    } catch (err: any) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
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
              WELCOME BACK
            </h1>
            <div className="h-px w-16 bg-luxury-sand mx-auto mb-6"></div>
            <p className="font-sans-luxury tracking-wide text-luxury-obsidian/70">
              Sign in to your Luthando Fragrances account
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
                  placeholder="ENTER YOUR PASSWORD"
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
            </div>

            {/* Forgot Password */}
            <div className="text-center">
              <Link 
                href="/auth/forgot-password" 
                className="font-sans-luxury tracking-widest text-sm text-luxury-obsidian/70 hover:text-luxury-obsidian transition-colors"
              >
                FORGOT YOUR PASSWORD?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full font-sans-luxury tracking-widest text-luxury-obsidian py-4 border border-luxury-obsidian overflow-hidden transition-all duration-500 hover:text-luxury-porcelain disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">
                {loading ? 'SIGNING IN...' : 'SIGN IN'}
              </span>
              <div className="absolute inset-0 bg-luxury-obsidian transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-10 pt-8 border-t border-luxury-sand text-center">
            <p className="font-sans-luxury tracking-wide text-luxury-obsidian/70">
              DON'T HAVE AN ACCOUNT?{' '}
              <Link 
                href="/auth/register" 
                className="font-sans-luxury tracking-widest text-luxury-obsidian hover:underline"
              >
                SIGN UP HERE
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
