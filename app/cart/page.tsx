'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/cart-store'
import { formatCurrency } from '@/lib/utils'
import { openWhatsApp, formatOrderMessage } from '@/lib/whatsapp'
import { Minus, Plus, Trash2, ArrowLeft, ShoppingCart, CreditCard } from 'lucide-react'
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext'

export default function CartPage() {
  const [mounted, setMounted] = useState(false)
  const cartStore = useCartStore()
  const { user } = useUnifiedAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleWhatsAppOrder = () => {
    const items = cartStore.items.map(item => ({
      name: item.product.name,
      price: item.product.price * item.quantity,
      quantity: item.quantity
    }))
    const message = formatOrderMessage(items, cartStore.getTotalPrice())
    openWhatsApp(message)
  }

  const handleCheckout = () => {
    if (!user) {
      router.push('/auth/login?redirect=/checkout')
    } else {
      router.push('/checkout')
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-luxury-porcelain flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-obsidian mx-auto mb-4"></div>
          <p className="font-sans-luxury tracking-wide text-luxury-obsidian/70">Loading cart...</p>
        </div>
      </div>
    )
  }

  if (cartStore.items.length === 0) {
    return (
      <div className="min-h-screen bg-luxury-porcelain py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center py-24">
            <ShoppingCart className="w-32 h-32 text-luxury-vanilla-veil mx-auto mb-8" />
            <h1 className="font-serif-luxury text-4xl tracking-widest text-luxury-obsidian mb-6">Your Cart is Empty</h1>
            <p className="font-sans-luxury tracking-wide text-luxury-obsidian/70 mb-10 text-lg">Discover our amazing fragrances and add them to your cart</p>
            <Link 
              href="/"
              className="group relative inline-flex items-center gap-3 font-sans-luxury tracking-widest text-luxury-obsidian text-lg py-3 px-8 border border-luxury-obsidian overflow-hidden transition-all duration-300 hover:text-luxury-porcelain"
            >
              <span className="relative z-10 flex items-center gap-2">
                <ArrowLeft size={18} />
                Continue Shopping
              </span>
              <div className="absolute inset-0 bg-luxury-obsidian transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-luxury-porcelain py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center mb-8">
          <Link href="/" className="group relative inline-flex items-center gap-2 font-sans-luxury tracking-widest text-luxury-obsidian text-sm py-2 px-4 border border-luxury-obsidian/30 overflow-hidden transition-all duration-300 hover:text-luxury-porcelain">
            <span className="relative z-10 flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Shop
            </span>
            <div className="absolute inset-0 bg-luxury-obsidian transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
          </Link>
        </div>

        <h1 className="font-serif-luxury text-4xl tracking-widest text-luxury-obsidian mb-12">Shopping Cart</h1>

        <div className="bg-luxury-porcelain border border-luxury-obsidian/10 overflow-hidden">
          {cartStore.items.map((item, index) => (
             <div key={item.product.id} className={`p-8 ${index < cartStore.items.length - 1 ? 'border-b border-luxury-obsidian/10' : ''}`}>
              <div className="flex items-start gap-6">
                 <div className="w-24 h-24 bg-luxury-vanilla-veil flex items-center justify-center flex-shrink-0">
                  {item.product.image_url ? (
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                       className="w-full h-full object-cover"
                    />
                  ) : (
                     <span className="font-sans-luxury tracking-widest text-xs text-luxury-obsidian/30">NO IMAGE</span>
                  )}
                </div>
                
                <div className="flex-1">
                   <h3 className="font-serif-luxury text-2xl tracking-widest text-luxury-obsidian mb-3">{item.product.name}</h3>
                   <p className="font-sans-luxury tracking-wide text-luxury-obsidian/70 mb-4 leading-relaxed">{item.product.description || 'Premium fragrance'}</p>
                   <p className="font-serif-luxury text-2xl tracking-widest text-luxury-obsidian">{formatCurrency(item.product.price)}</p>
                </div>
                
                <div className="flex items-center gap-4 flex-shrink-0">
                   <div className="flex items-center gap-3 bg-luxury-vanilla-veil p-1">
                     <button
                      onClick={() => cartStore.updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 bg-luxury-porcelain flex items-center justify-center hover:bg-luxury-obsidian/10 transition-colors"
                    >
                      <Minus size={14} className="text-luxury-obsidian" />
                    </button>
                     <span className="w-8 text-center font-serif-luxury text-luxury-obsidian">{item.quantity}</span>
                     <button
                      onClick={() => cartStore.updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 bg-luxury-porcelain flex items-center justify-center hover:bg-luxury-obsidian/10 transition-colors"
                    >
                      <Plus size={14} className="text-luxury-obsidian" />
                    </button>
                  </div>
                  
                   <button
                    onClick={() => cartStore.removeItem(item.product.id)}
                    className="text-luxury-obsidian/50 hover:text-luxury-obsidian p-2 hover:bg-luxury-vanilla-veil transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
           <div className="p-8 bg-luxury-vanilla-veil">
            <div className="flex justify-between items-center mb-6">
               <span className="font-serif-luxury text-2xl tracking-widest text-luxury-obsidian">Total:</span>
               <span className="font-serif-luxury text-4xl tracking-widest text-luxury-obsidian">
                 {formatCurrency(cartStore.getTotalPrice())}
               </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
               <button
                onClick={handleCheckout}
                className="group/checkout flex-1 font-sans-luxury tracking-widest text-lg py-4 flex items-center justify-center gap-3 bg-luxury-obsidian text-luxury-porcelain border border-luxury-obsidian overflow-hidden transition-all duration-300 hover:text-luxury-obsidian"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <CreditCard size={20} />
                  Proceed to Checkout
                </span>
                <div className="absolute inset-0 bg-luxury-porcelain transform -translate-x-full group-hover/checkout:translate-x-0 transition-transform duration-300"></div>
              </button>
               <button
                onClick={handleWhatsAppOrder}
                className="group/whatsapp flex-1 font-sans-luxury tracking-widest text-lg py-4 flex items-center justify-center gap-3 text-luxury-obsidian border border-luxury-obsidian overflow-hidden transition-all duration-300 hover:text-luxury-porcelain"
              >
                <span className="relative z-10">Order via WhatsApp</span>
                <div className="absolute inset-0 bg-luxury-obsidian transform -translate-x-full group-hover/whatsapp:translate-x-0 transition-transform duration-300"></div>
              </button>
            </div>
            
             <p className="text-center font-sans-luxury tracking-wide text-luxury-obsidian/70 mt-6 text-sm">
               {!user && 'Sign in to checkout with PayFast or continue with WhatsApp'}
             </p>
          </div>
        </div>
      </div>
    </div>
  )
}
