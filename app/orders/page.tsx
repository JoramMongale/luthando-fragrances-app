'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext'
import { getUserOrders } from '@/lib/orders'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Package, Calendar, CreditCard, Truck, CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface OrderWithItems {
 id: string
 total_amount: number
 status: string
 payment_status: string
 payment_method: string | null
 created_at: string
 order_items: Array<{
   id: string
   quantity: number
   price: number
   product: {
     id: string
     name: string
     description: string | null
     category: string | null
   }
 }>
}

export default function OrdersPage() {
 const [orders, setOrders] = useState<OrderWithItems[]>([])
 const [loading, setLoading] = useState(true)
 const [error, setError] = useState('')
 const { user } = useUnifiedAuth()
 const router = useRouter()

 useEffect(() => {
   if (!user) {
     router.push('/auth/login?redirect=/orders')
     return
   }
   fetchOrders()
 }, [user, router])

 const fetchOrders = async () => {
   if (!user) return

   try {
     setLoading(true)
     const { data, error } = await getUserOrders(user.id)
     
     if (error) {
       throw error
     }
     setOrders(data || [])
   } catch (err) {
     console.error('Error fetching orders:', err)
     setError('Failed to load orders')
   } finally {
     setLoading(false)
   }
 }

 const getStatusIcon = (status: string) => {
   switch (status) {
     case 'pending':
       return <Clock className="w-5 h-5 text-yellow-500" />
     case 'paid':
     case 'processing':
       return <Package className="w-5 h-5 text-blue-500" />
     case 'shipped':
       return <Truck className="w-5 h-5 text-purple-500" />
     case 'delivered':
       return <CheckCircle className="w-5 h-5 text-green-500" />
     case 'cancelled':
       return <XCircle className="w-5 h-5 text-red-500" />
     default:
       return <Clock className="w-5 h-5 text-gray-500" />
   }
 }

 const getStatusColor = (status: string) => {
   switch (status) {
     case 'pending':
       return 'bg-yellow-100 text-yellow-800'
     case 'paid':
     case 'processing':
       return 'bg-blue-100 text-blue-800'
     case 'shipped':
       return 'bg-purple-100 text-purple-800'
     case 'delivered':
       return 'bg-green-100 text-green-800'
     case 'cancelled':
       return 'bg-red-100 text-red-800'
     default:
       return 'bg-gray-100 text-gray-800'
   }
 }

 const getPaymentStatusColor = (status: string) => {
   switch (status) {
     case 'paid':
       return 'bg-green-100 text-green-800'
     case 'pending':
       return 'bg-yellow-100 text-yellow-800'
     case 'failed':
       return 'bg-red-100 text-red-800'
     case 'refunded':
       return 'bg-blue-100 text-blue-800'
     default:
       return 'bg-gray-100 text-gray-800'
   }
 }

 if (loading) {
   return (
     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
       <div className="text-center">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
         <p className="text-gray-600">Loading your orders...</p>
       </div>
     </div>
   )
 }

 if (!user) {
   return null // Will redirect
 }

 return (
   <div className="min-h-screen bg-gray-50 py-8">
     <div className="max-w-6xl mx-auto px-4">
       {/* Header */}
       <div className="flex items-center justify-between mb-8">
         <div className="flex items-center gap-4">
           <Link 
             href="/profile"
             className="btn btn-secondary flex items-center gap-2"
           >
             <ArrowLeft size={16} />
             Back to Profile
           </Link>
           <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
         </div>
         
         <Link 
           href="/"
           className="btn btn-primary"
         >
           Continue Shopping
         </Link>
       </div>

       {error && (
         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
           {error}
         </div>
       )}

       {orders.length === 0 ? (
         <div className="text-center py-16">
           <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
           <h2 className="text-2xl font-bold text-gray-900 mb-4">No Orders Yet</h2>
           <p className="text-gray-600 mb-8 text-lg">You haven't placed any orders yet. Start shopping to see your orders here!</p>
           <Link 
             href="/"
             className="btn btn-primary"
           >
             Start Shopping
           </Link>
         </div>
       ) : (
         <div className="space-y-6">
           {orders.map((order) => (
             <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
               {/* Order Header */}
               <div className="p-6 border-b border-gray-200 bg-gray-50">
                 <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                   <div className="flex items-center gap-4">
                     {getStatusIcon(order.status)}
                     <div>
                       <h3 className="text-lg font-bold text-gray-900">
                         Order #{order.id.substring(0, 8)}
                       </h3>
                       <p className="text-gray-600 flex items-center gap-2">
                         <Calendar size={16} />
                         {formatDate(order.created_at)}
                       </p>
                     </div>
                   </div>
                   
                   <div className="flex flex-col lg:items-end gap-2">
                     <div className="flex gap-2">
                       <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                         {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                       </span>
                       <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                         Payment: {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                       </span>
                     </div>
                     <div className="flex items-center gap-2 text-gray-600">
                       <CreditCard size={16} />
                       <span className="text-sm">
                         {order.payment_method || 'WhatsApp Order'}
                       </span>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Order Items */}
               <div className="p-6">
                 <div className="space-y-4">
                   {order.order_items.map((item) => (
                     <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-100">
                       <div className="flex-1">
                         <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                         <p className="text-sm text-gray-600">{item.product.category}</p>
                         <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                       </div>
                       <div className="text-right">
                         <p className="font-semibold text-gray-900">
                           {formatCurrency(item.price * item.quantity)}
                         </p>
                         <p className="text-sm text-gray-600">
                           {formatCurrency(item.price)} each
                         </p>
                       </div>
                     </div>
                   ))}
                 </div>

                 {/* Order Total */}
                 <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-4">
                   <span className="text-lg font-semibold text-gray-900">Order Total:</span>
                   <span className="text-xl font-bold text-blue-600">
                     {formatCurrency(order.total_amount)}
                   </span>
                 </div>
               </div>
             </div>
           ))}
         </div>
       )}
     </div>
   </div>
 )
}
