'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'
import { 
  ShoppingBag, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  XCircle,
  Eye,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard
} from 'lucide-react'

interface OrderWithDetails {
  id: string
  user_id: string
  total_amount: number
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_method: string | null
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  payment_reference: string | null
  shipping_address: any
  customer_notes: string | null
  created_at: string
  updated_at: string
  order_items: Array<{
    id: string
    quantity: number
    price: number
    product: {
      id: string
      name: string
      description: string
      category: string
    }
  }>
  user_profile?: {
    email: string
    first_name: string | null
    last_name: string | null
    phone: string | null
  }
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchOrders()
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('admin-orders')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders'
      }, () => {
        fetchOrders()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      
      // First get orders with items
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products (*)
          )
        `)
        .order('created_at', { ascending: false })

      if (ordersError) throw ordersError

      // Then get user profiles for each order
      if (ordersData && ordersData.length > 0) {
        const userIds = [...new Set(ordersData.map(order => order.user_id))]
        
        const { data: profiles, error: profilesError } = await supabase
          .from('user_profiles')
          .select('*')
          .in('id', userIds)

        if (!profilesError && profiles) {
          // Merge profile data with orders
          const ordersWithProfiles = ordersData.map(order => ({
            ...order,
            user_profile: profiles.find(p => p.id === order.user_id)
          }))
          
          setOrders(ordersWithProfiles)
        } else {
          setOrders(ordersData)
        }
      } else {
        setOrders([])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString()
      }

      // Update payment status based on order status
      if (newStatus === 'paid' || newStatus === 'processing') {
        updateData.payment_status = 'paid'
      } else if (newStatus === 'cancelled') {
        updateData.payment_status = 'failed'
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)

      if (error) throw error

      // Refresh orders
      await fetchOrders()
      
      // Show success message
      alert(`Order status updated to ${newStatus}`)
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Failed to update order status')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'paid':
        return <CreditCard className="w-5 h-5 text-green-500" />
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
        return 'bg-green-100 text-green-800'
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

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <div className="flex items-center gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={fetchOrders}
            className="btn btn-secondary"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h2>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'No orders have been placed yet.' 
                : `No ${filter} orders found.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getStatusIcon(order.status)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            #{order.id.substring(0, 8)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.order_items.length} items
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {order.user_profile?.first_name && order.user_profile?.last_name
                            ? `${order.user_profile.first_name} ${order.user_profile.last_name}`
                            : 'Customer'}
                        </div>
                        <div className="text-gray-500">
                          {order.user_profile?.email || 'No email'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(order.total_amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)} cursor-pointer`}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(order)
                          setShowDetails(true)
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowDetails(false)}></div>
            
            <div className="relative bg-white rounded-lg max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Order Details</h2>
              
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-medium">#{selectedOrder.id.substring(0, 8)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">
                    {new Date(selectedOrder.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    selectedOrder.payment_status === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedOrder.payment_status}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              {selectedOrder.shipping_address && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Shipping Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      {selectedOrder.shipping_address.firstName} {selectedOrder.shipping_address.lastName}
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      {selectedOrder.shipping_address.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      {selectedOrder.shipping_address.phone}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      {selectedOrder.shipping_address.address}, {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.postalCode}
                    </p>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Order Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  {selectedOrder.order_items.map((item) => (
                    <div key={item.id} className="flex justify-between p-4 border-b last:border-b-0">
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-600">
                          {item.product.category} • Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                        <p className="text-sm text-gray-600">{formatCurrency(item.price)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-xl font-bold text-blue-600">
                  {formatCurrency(selectedOrder.total_amount)}
                </span>
              </div>

              {/* Close Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetails(false)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
