'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, Menu, X, MessageCircle, User, LogOut, Package, Shield } from 'lucide-react'
import { openWhatsApp } from '@/lib/whatsapp'
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext'
import { useCartStore } from '@/lib/cart-store'
import { isAdmin } from '@/lib/auth-utils'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isUserAdmin, setIsUserAdmin] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, signOut } = useUnifiedAuth()
  const cartStore = useCartStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        const adminStatus = await isAdmin()
        setIsUserAdmin(adminStatus)
      } else {
        setIsUserAdmin(false)
      }
    }
    checkAdmin()
  }, [user])

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20
      setScrolled(isScrolled)
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setMobileMenuOpen(false)
  }

  const scrollToProducts = () => {
    const productsSection = document.getElementById('products')
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' })
      setMobileMenuOpen(false)
    }
  }

  const cartItemCount = mounted ? cartStore.getItemCount() : 0

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-luxury-porcelain/95 backdrop-blur-md border-b border-luxury-sand' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-5 md:py-6">
        <div className="flex items-center justify-between">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 ${
              scrolled 
                ? 'border-luxury-obsidian bg-luxury-porcelain' 
                : 'border-white bg-white/10 backdrop-blur-sm'
            }`}>
              <span className={`font-serif-luxury font-bold text-lg transition-all duration-500 ${
                scrolled ? 'text-luxury-obsidian' : 'text-white'
              }`}>L</span>
            </div>
            <h1 className={`text-2xl font-serif-luxury font-bold transition-all duration-500 tracking-widest ${
              scrolled ? 'text-luxury-obsidian' : 'text-white'
            }`}>LUTHANDO</h1>
          </Link>

          {/* Desktop Center Navigation - Minimal Links */}
          <nav className="hidden md:flex items-center space-x-10 absolute left-1/2 transform -translate-x-1/2">
            <button
              onClick={scrollToProducts}
              className={`font-sans-luxury font-medium tracking-widest transition-all duration-500 hover:opacity-70 ${
                scrolled ? 'text-luxury-obsidian' : 'text-white'
              }`}
            >
              SHOP
            </button>
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-6">
            {/* WhatsApp Button */}
            <button
              onClick={() => openWhatsApp('Hi! I\'d like to know more about your perfumes.')}
              className={`flex items-center gap-2 transition-all duration-500 ${
                scrolled 
                  ? 'text-luxury-obsidian hover:text-luxury-gold' 
                  : 'text-white hover:text-luxury-sand'
              }`}
            >
              <MessageCircle size={18} />
              <span className="font-sans-luxury tracking-widest text-sm">WHATSAPP</span>
            </button>

            {/* Cart */}
            <Link href="/cart" className={`relative p-2 transition-all duration-500 ${
              scrolled 
                ? 'text-luxury-obsidian hover:text-luxury-gold' 
                : 'text-white hover:text-luxury-sand'
            }`}>
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className={`absolute -top-1 -right-1 text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium transition-all duration-500 ${
                  scrolled 
                    ? 'bg-luxury-obsidian text-luxury-porcelain' 
                    : 'bg-white text-luxury-obsidian'
                }`}>
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Auth */}
            {user ? (
              <div className="flex items-center space-x-4">
                {isUserAdmin && (
                  <Link 
                    href="/admin"
                    className={`flex items-center space-x-2 transition-all duration-500 ${
                      scrolled 
                        ? 'text-luxury-obsidian hover:text-luxury-gold' 
                        : 'text-white hover:text-luxury-sand'
                    }`}
                  >
                    <Shield className="w-5 h-5" />
                    <span className="font-sans-luxury tracking-widest text-sm">ADMIN</span>
                  </Link>
                )}
                <div className="relative group">
                  <button className={`flex items-center space-x-2 transition-all duration-500 ${
                    scrolled 
                      ? 'text-luxury-obsidian hover:text-luxury-gold' 
                      : 'text-white hover:text-luxury-sand'
                  }`}>
                    <User className="w-5 h-5" />
                    <span className="font-sans-luxury tracking-widest text-sm">ACCOUNT</span>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-luxury-porcelain border border-luxury-sand shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <Link 
                      href="/orders"
                      className="block px-4 py-3 text-luxury-obsidian hover:bg-luxury-vanilla-veil font-sans-luxury tracking-widest text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      MY ORDERS
                    </Link>
                    <Link 
                      href="/profile"
                      className="block px-4 py-3 text-luxury-obsidian hover:bg-luxury-vanilla-veil font-sans-luxury tracking-widest text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      PROFILE
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-3 text-luxury-obsidian hover:bg-luxury-vanilla-veil font-sans-luxury tracking-widest text-sm"
                    >
                      SIGN OUT
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className={`font-sans-luxury tracking-widest text-sm transition-all duration-500 ${
                    scrolled 
                      ? 'text-luxury-obsidian hover:text-luxury-gold' 
                      : 'text-white hover:text-luxury-sand'
                  }`}
                >
                  SIGN IN
                </Link>
                <Link 
                  href="/auth/register" 
                  className={`border font-sans-luxury tracking-widest text-sm px-4 py-2 transition-all duration-500 ${
                    scrolled 
                      ? 'border-luxury-obsidian text-luxury-obsidian hover:bg-luxury-obsidian hover:text-luxury-porcelain' 
                      : 'border-white text-white hover:bg-white hover:text-luxury-obsidian'
                  }`}
                >
                  SIGN UP
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 transition-all duration-500 ${
              scrolled ? 'text-luxury-obsidian' : 'text-white'
            }`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden mt-4 pb-4 animate-fade-in-up ${
            scrolled 
              ? 'border-t border-luxury-sand' 
              : 'border-t border-white/30'
          }`}>
            <div className="flex flex-col space-y-4 pt-4">
              <Link 
                href="/cart" 
                className={`flex items-center space-x-3 ${
                  scrolled ? 'text-luxury-obsidian' : 'text-white'
                }`}
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
                className={`flex items-center space-x-3 text-left ${
                  scrolled ? 'text-luxury-obsidian' : 'text-white'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp Us</span>
              </button>

              {/* Mobile Navigation Links */}
              <button
                onClick={scrollToProducts}
                className={`text-left ${scrolled ? 'text-luxury-obsidian' : 'text-white'}`}
              >
                SHOP
              </button>

              {user ? (
                <>
                  {isUserAdmin && (
                    <Link 
                      href="/admin"
                      className={scrolled ? 'text-luxury-obsidian' : 'text-white'}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Shield className="w-5 h-5 inline mr-2" />
                      Admin Panel
                    </Link>
                  )}
                  <Link 
                    href="/orders"
                    className={scrolled ? 'text-luxury-obsidian' : 'text-white'}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  
                  <Link 
                    href="/profile"
                    className={scrolled ? 'text-luxury-obsidian' : 'text-white'}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  
                  <button
                    onClick={handleSignOut}
                    className={`text-left ${
                      scrolled ? 'text-luxury-obsidian' : 'text-white'
                    }`}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/auth/login"
                    className={scrolled ? 'text-luxury-obsidian' : 'text-white'}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/auth/register"
                    className={`text-center py-2 ${
                      scrolled 
                        ? 'border border-luxury-obsidian text-luxury-obsidian' 
                        : 'border border-white text-white'
                    }`}
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
