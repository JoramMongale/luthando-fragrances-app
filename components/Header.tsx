'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, Menu, X, MessageCircle, User, LogOut, Package } from 'lucide-react'
import { openWhatsApp } from '@/lib/whatsapp'
import { useAuth } from '@/contexts/AuthContext'
import { useCartStore } from '@/lib/cart-store'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user, signOut } = useAuth()
  const cartStore = useCartStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setMobileMenuOpen(false)
  }

  const cartItemCount = mounted ? cartStore.getItemCount() : 0

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Luthando Fragrances</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => openWhatsApp('Hi! I\'d like to know more about your perfumes.')}
              className="btn btn-success flex items-center gap-2"
            >
              <MessageCircle size={16} />
              <span className="hidden lg:inline">WhatsApp</span>
            </button>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/orders"
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Package className="w-5 h-5" />
                  <span className="hidden lg:inline">Orders</span>
                </Link>
                
                <Link 
                  href="/profile"
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden lg:inline">Profile</span>
                </Link>
                
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden lg:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Sign In
                </Link>
                <Link href="/auth/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-blue-600"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 animate-slide-down">
            <div className="flex flex-col space-y-4 pt-4">
              <Link 
                href="/cart" 
                className="flex items-center space-x-3 text-gray-700 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Cart ({cartItemCount})</span>
              </Link>

              <button
                onClick={() => {
                  openWhatsApp('Hi! I\'d like to know more about your perfumes.')
                  setMobileMenuOpen(false)
                }}
                className="flex items-center space-x-3 text-gray-700 hover:text-green-600 text-left"
              >
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp Us</span>
              </button>

              {user ? (
                <>
                  <Link 
                    href="/orders"
                    className="flex items-center space-x-3 text-gray-700 hover:text-blue-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Package className="w-5 h-5" />
                    <span>My Orders</span>
                  </Link>
                  
                  <Link 
                    href="/profile"
                    className="flex items-center space-x-3 text-gray-700 hover:text-blue-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </Link>
                  
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-3 text-gray-700 hover:text-red-600 text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/auth/login"
                    className="text-gray-700 hover:text-blue-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/auth/register"
                    className="btn btn-primary text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
