'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { checkAdminAccess } from '@/lib/admin'
import { useRouter } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'
import { 
  ShoppingBag, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  Package,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface OrderWithDetails {
  id: string
  user_id: string
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
      name: string
      category: string
    }
  }>
  user_profile?: {
    first_name: string
    last_name: string
    email: string
  }
}

export default function AdminOrders() {
  const { user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<OrderWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/admin/orders')
      return
    }
    
    if (!checkAdminAccess(user.email || '')) {
      router.push('/?error=unauthorized')
      return
    }

    fetchOrders()
  }, [user, router, page, statusFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError('')

      const limit = 20
      const offset = (page - 1) * limit

      // Build query
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products (name, category)
          )
        `, { count: 'exact' })
        .order('created_at', { ascending: false })

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      if (searchTerm.trim()) {
        query = query.ilike('id', `%${searchTerm.trim()}%`)
      }

      const { data: ordersData, error: ordersError, count } = await query
        .range(offset, offset + limit - 1)

      if (ordersError) throw ordersError

      // Calculate total pages
      const total = Math.ceil((count || 0) / limit)
      setTotalPages(total)

      // Get user profiles for orders
      let ordersWithProfiles = ordersData || []
      
      // Then get user profiles for each order
      if (ordersData && ordersData.length > 0) {
        // Fix the Set iteration issue by using Array.from
        const userIds = Array.from(new Set(ordersData.map(order => order.user_id)))
        
        const { data: profiles, error: profilesError } = await supabase
          .from('user_profiles')
          .select('id, first_name, last_name')
          .in('id', userIds)

        if (!profilesError && profiles) {
          // Also get user emails from auth.users
          const { data: authUsers } = await supabase
            .from('auth.users')
            .select('id, email')
            .in('id', userIds)

          ordersWithProfiles = ordersData.map(order => ({
            ...order,
            user_profile: {
              first_name: profiles.find(p => p.id === order.user_id)?.first_name || '',
              last_name: profiles.find(p => p.id === order.user_id)?.last_name || '',
              email: authUsers?.find(u => u.id === order.user_id)?.email || 'Unknown'
            }
          }))
        }
      }

      setOrders(ordersWithProfiles)

    } catch (err) {
      console.error('Error fetching orders:', err)
      setError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setPage(1)
    fetchOrders()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'paid':
      case 'processing':
        return <Package className="w-4 h-4 text-blue-500" />
      case 'shipped':
        return <Package className="w-4 h-4 text-purple-500" />
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'paid': return 'bg-green-100 text-green-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!user || !checkAdminAccess(user.email || '')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking admin access...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">View and manage customer orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="lg:w-48">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <button
            onClick={handleSearch}
            className="btn btn-primary flex items-center gap-2"
          >
            <Search size={16} />
            Search
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(order.status)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            #{order.id.substring(0, 8)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.payment_method || 'WhatsApp'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.user_profile?.first_name || 'Unknown'} {order.user_profile?.last_name || 'Customer'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.user_profile?.email || 'No email'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.order_items.length} item{order.order_items.length !== 1 ? 's' : ''}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.order_items.slice(0, 2).map(item => item.product.name).join(', ')}
                        {order.order_items.length > 2 && '...'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(order.total_amount)}
                      </div>
                      <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 
                        order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.payment_status}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Eye size={16} />
                        </button>
                        <button className="text-green-600 hover:text-green-800">
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Orders will appear here when customers make purchases'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
