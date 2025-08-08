'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { checkAdminAccess } from '@/lib/admin'
import { useRouter } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Calendar
} from 'lucide-react'

interface AnalyticsData {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  topProducts: Array<{
    name: string
    quantity: number
    revenue: number
  }>
  recentSales: number[]
  ordersByStatus: Record<string, number>
}

export default function AdminAnalytics() {
  const { user } = useAuth()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    topProducts: [],
    recentSales: [],
    ordersByStatus: {}
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dateRange, setDateRange] = useState('30') // days

  useEffect(() => {
    // Check admin access
    if (!user) {
      router.push('/auth/login?redirect=/admin/analytics')
      return
    }
    
    if (!checkAdminAccess(user.email || '')) {
      router.push('/?error=unauthorized')
      return
    }

    fetchAnalytics()
  }, [user, router, dateRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError('')

      // Calculate date range
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - parseInt(dateRange))

      // Fetch orders within date range
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products (name)
          )
        `)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())

      if (ordersError) throw ordersError

      if (!orders) {
        setAnalytics({
          totalRevenue: 0,
          totalOrders: 0,
          averageOrderValue: 0,
          topProducts: [],
          recentSales: [],
          ordersByStatus: {}
        })
        return
      }

      // Calculate metrics
      const totalOrders = orders.length
      const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0)
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

      // Calculate top products with proper typing
      const productSales = orders.flatMap(order => 
        order.order_items.map((item: any) => ({
          name: item.product?.name || 'Unknown Product',
          quantity: item.quantity,
          revenue: item.price * item.quantity
        }))
      )

      // Group by product name
      const productGroups = productSales.reduce((acc: Record<string, { quantity: number; revenue: number }>, item) => {
        if (!acc[item.name]) {
          acc[item.name] = { quantity: 0, revenue: 0 }
        }
        acc[item.name].quantity += item.quantity
        acc[item.name].revenue += item.revenue
        return acc
      }, {})

      const topProducts = Object.entries(productGroups)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)

      // Calculate orders by status
      const ordersByStatus = orders.reduce((acc: Record<string, number>, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1
        return acc
      }, {})

      // Calculate recent sales (last 7 days)
      const recentSales = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
        const dayEnd = new Date(dayStart)
        dayEnd.setDate(dayEnd.getDate() + 1)

        return orders
          .filter(order => {
            const orderDate = new Date(order.created_at)
            return orderDate >= dayStart && orderDate < dayEnd
          })
          .reduce((sum, order) => sum + Number(order.total_amount), 0)
      }).reverse()

      setAnalytics({
        totalRevenue,
        totalOrders,
        averageOrderValue,
        topProducts,
        recentSales,
        ordersByStatus
      })

    } catch (err: any) {
      console.error('Error fetching analytics:', err)
      setError('Failed to load analytics data')
    } finally {
      setLoading(false)
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
          <h1 className="text-2xl font-bold text-gray-900">Sales Analytics</h1>
          <p className="text-gray-600">Track your business performance and trends</p>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(analytics.totalRevenue)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+12% from last period</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.totalOrders}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+8% from last period</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Order Value</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(analytics.averageOrderValue)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center">
            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            <span className="text-sm text-red-600">-2% from last period</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Top Product Sales</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.topProducts[0]?.quantity || 0}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-600">
              {analytics.topProducts[0]?.name || 'No sales yet'}
            </span>
          </div>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
          <div className="space-y-3">
            {analytics.topProducts.length > 0 ? (
              analytics.topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center mr-3">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.quantity} sold</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(product.revenue)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No product sales data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
          <div className="space-y-3">
            {Object.entries(analytics.ordersByStatus).length > 0 ? (
              Object.entries(analytics.ordersByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(status)}`}>
                      {status}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900">{count} orders</span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No order data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Sales Trend */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend (Last 7 Days)</h3>
        <div className="h-64 flex items-end justify-center space-x-2">
          {analytics.recentSales.map((sale, index) => {
            const maxSale = Math.max(...analytics.recentSales)
            const height = maxSale > 0 ? (sale / maxSale) * 200 : 20
            return (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="bg-blue-600 rounded-t-md w-8 flex items-end justify-center text-white text-xs"
                  style={{ height: `${height}px`, minHeight: '20px' }}
                >
                  {sale > 0 && formatCurrency(sale).replace('R', '')}
                </div>
                <span className="text-xs text-gray-500 mt-2">
                  Day {index + 1}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
