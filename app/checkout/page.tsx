'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext'
import { useCartStore } from '@/lib/cart-store'
import { formatCurrency } from '@/lib/utils'
import { createOrder } from '@/lib/orders'
import { generatePayFastForm, submitPayFastForm } from '@/lib/payments/payfast'
import { openWhatsApp, formatOrderMessage } from '@/lib/whatsapp'
import { ArrowLeft, CreditCard, MessageCircle, Loader2 } from 'lucide-react'

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'payfast' | 'whatsapp'>('payfast')
  const [shippingDetails, setShippingDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  })

  const { user } = useUnifiedAuth()
  const cartStore = useCartStore()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/checkout')
      return
    }

    if (cartStore.items.length === 0) {
      router.push('/cart')
      return
    }

    // Pre-fill email
    if (user?.email) {
      setShippingDetails(prev => ({
        ...prev,
        email: user.email!
      }))
    }
  }, [user, cartStore.items.length, router])

  const handleInputChange = (field: string, value: string) => {
    setShippingDetails(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode']
    const missing = required.filter(field => !shippingDetails[field as keyof typeof shippingDetails])
    
    if (missing.length > 0) {
      setError(`Please fill in all required fields`)
      return false
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(shippingDetails.email)) {
      setError('Please enter a valid email address')
      return false
    }

    return true
  }

  const handlePayFastCheckout = async () => {
    if (!validateForm()) return

    setLoading(true)
    setError('')

    try {
      // Create order in database
      const orderData = {
        user_id: user!.id,
        items: cartStore.items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        shipping_address: shippingDetails,
        customer_notes: ''
      }

      const { order, error: orderError } = await createOrder(orderData)
      
      if (orderError || !order) {
        throw new Error(orderError?.message || 'Failed to create order')
      }

      // Generate PayFast form
      const paymentConfig = {
        orderId: order.id,
        amount: cartStore.getTotalPrice(),
        customerEmail: shippingDetails.email,
        customerName: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
        items: cartStore.items.map(item => ({
          name: item.product.name,
          quantity: item.quantity
        }))
      }

      const paymentResult = generatePayFastForm(paymentConfig)
      
      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Failed to generate payment form')
      }

      // Clear cart before redirecting
      cartStore.clearCart()

      // Submit to PayFast
      const submitResult = submitPayFastForm(paymentResult.formData!, paymentResult.actionUrl!)
      
      if (!submitResult.success) {
        throw new Error(submitResult.error || 'Failed to submit payment')
      }

    } catch (err) {
      console.error('Checkout error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred during checkout')
      setLoading(false)
    }
  }

  const handleWhatsAppCheckout = () => {
    if (!validateForm()) return

    const orderMessage = formatOrderMessage(
      cartStore.items.map(item => ({
        name: item.product.name,
        price: item.product.price * item.quantity,
        quantity: item.quantity
      })),
      cartStore.getTotalPrice(),
      shippingDetails
    )

    openWhatsApp(orderMessage)
    cartStore.clearCart()
    router.push('/')
  }

  if (!user || cartStore.items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => router.push('/cart')}
            className="btn btn-secondary flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Cart
          </button>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Shipping Details */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Details</h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={shippingDetails.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={shippingDetails.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={shippingDetails.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={shippingDetails.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+27 12 345 6789"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  value={shippingDetails.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={shippingDetails.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    value={shippingDetails.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                {cartStore.items.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center py-3 border-b border-gray-200">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-xl font-bold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(cartStore.getTotalPrice())}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
              
              <div className="space-y-3 mb-6">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="payfast"
                    checked={paymentMethod === 'payfast'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'payfast')}
                    className="mr-3"
                  />
                  <CreditCard className="mr-3 text-gray-600" size={20} />
                  <div>
                    <div className="font-medium">Online Payment (PayFast)</div>
                    <div className="text-sm text-gray-600">Credit card, EFT, SnapScan</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="whatsapp"
                    checked={paymentMethod === 'whatsapp'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'whatsapp')}
                    className="mr-3"
                  />
                  <MessageCircle className="mr-3 text-green-600" size={20} />
                  <div>
                    <div className="font-medium">WhatsApp Order</div>
                    <div className="text-sm text-gray-600">Complete order via WhatsApp</div>
                  </div>
                </label>
              </div>

              {paymentMethod === 'payfast' ? (
                <button
                  onClick={handlePayFastCheckout}
                  disabled={loading}
                  className="w-full btn btn-primary py-4 text-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      Pay Now
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full btn btn-success py-4 text-lg flex items-center justify-center gap-2"
                >
                  <MessageCircle size={20} />
                  Complete via WhatsApp
                </button>
              )}

              <p className="text-center text-gray-600 mt-4 text-sm">
                Your order will be processed securely
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
