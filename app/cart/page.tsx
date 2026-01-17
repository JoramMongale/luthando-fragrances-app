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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    )
  }

  if (cartStore.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center py-16">
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8 text-lg">Discover our amazing fragrances and add them to your cart</p>
            <Link 
              href="/"
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center mb-8">
          <Link href="/" className="btn btn-secondary flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Shop
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {cartStore.items.map((item, index) => (
            <div key={item.product.id} className={`p-6 ${index < cartStore.items.length - 1 ? 'border-b border-gray-200' : ''}`}>
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
                  {item.product.image_url ? (
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-gray-500 text-sm">No Image</span>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.product.name}</h3>
                  <p className="text-gray-600 mb-3">{item.product.description || 'Premium fragrance'}</p>
                  <p className="text-lg font-semibold text-blue-600">{formatCurrency(item.product.price)}</p>
                </div>
                
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => cartStore.updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-md bg-white flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => cartStore.updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-md bg-white flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => cartStore.removeItem(item.product.id)}
                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <div className="p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-semibold text-gray-900">Total:</span>
              <span className="text-3xl font-bold text-blue-600">
                {formatCurrency(cartStore.getTotalPrice())}
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleCheckout}
                className="flex-1 btn btn-primary text-lg py-4 flex items-center justify-center gap-2"
              >
                <CreditCard size={20} />
                Proceed to Checkout
              </button>
              <button
                onClick={handleWhatsAppOrder}
                className="flex-1 btn btn-success text-lg py-4"
              >
                Order via WhatsApp
              </button>
            </div>
            
            <p className="text-center text-gray-600 mt-4 text-sm">
              {!user && 'Sign in to checkout with PayFast or continue with WhatsApp'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
