'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getOrderById } from '@/lib/orders'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function PaymentSuccessPage() {
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')

  useEffect(() => {
    if (!orderId) {
      router.push('/')
      return
    }
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    if (!orderId) return

    try {
      const { data, error } = await getOrderById(orderId)
      if (error) throw error
      setOrder(data)
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Confirming your payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your order. Your payment has been processed successfully.
          </p>

          {order && (
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Details</h2>
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">#{order.id.substring(0, 8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-bold text-green-600">{formatCurrency(order.total_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Paid
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/orders')}
              className="btn btn-primary flex items-center justify-center gap-2"
            >
              <Package size={16} />
              View Order History
            </button>
            <button
              onClick={() => router.push('/')}
              className="btn btn-secondary flex items-center justify-center gap-2"
            >
              Continue Shopping
              <ArrowRight size={16} />
            </button>
          </div>

          <div className
          "mt-8 p-4 bg-blue-50 rounded-lg">
           <h3 className="font-bold text-blue-900 mb-2">What happens next?</h3>
           <p className="text-blue-800 text-sm">
             You'll receive an email confirmation shortly. Your order will be processed and shipped within 2-3 business days.
           </p>
         </div>
       </div>
     </div>
   </div>
 )
}
