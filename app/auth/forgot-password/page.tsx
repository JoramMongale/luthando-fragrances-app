'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext'
import { Mail, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  
  const { resetPassword } = useUnifiedAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await resetPassword(email)
      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
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
              <Mail className="w-10 h-10 text-luxury-obsidian" />
            </div>
            <h1 className="font-serif-luxury text-3xl tracking-widest text-luxury-obsidian mb-6">CHECK YOUR EMAIL</h1>
            <div className="h-px w-16 bg-luxury-sand mx-auto mb-8"></div>
            <p className="font-sans-luxury tracking-wide text-luxury-obsidian/70 mb-6">
              We've sent a password reset link to <strong className="font-medium text-luxury-obsidian">{email}</strong>
            </p>
            <p className="font-sans-luxury tracking-wide text-sm text-luxury-obsidian/50 mb-10">
              Click the link in the email to reset your password. If you don't see it, check your spam folder.
            </p>
            <Link 
              href="/auth/login" 
              className="inline-block font-sans-luxury tracking-widest text-luxury-obsidian py-3 px-8 border border-luxury-obsidian hover:bg-luxury-obsidian hover:text-luxury-porcelain transition-all duration-300"
            >
              BACK TO LOGIN
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
              FORGOT PASSWORD?
            </h1>
            <div className="h-px w-16 bg-luxury-sand mx-auto mb-6"></div>
            <p className="font-sans-luxury tracking-wide text-luxury-obsidian/70">
              Enter your email to reset your password
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full font-sans-luxury tracking-widest text-luxury-obsidian py-4 border border-luxury-obsidian overflow-hidden transition-all duration-500 hover:text-luxury-porcelain disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">
                {loading ? 'SENDING...' : 'SEND RESET LINK'}
              </span>
              <div className="absolute inset-0 bg-luxury-obsidian transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-10 pt-8 border-t border-luxury-sand text-center">
            <Link 
              href="/auth/login" 
              className="font-sans-luxury tracking-widest text-sm text-luxury-obsidian hover:text-luxury-obsidian/70 transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              BACK TO LOGIN
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
