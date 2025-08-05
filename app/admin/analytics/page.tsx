'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'
import { 
 TrendingUp, 
 DollarSign, 
 ShoppingBag, 
 Users,
 Package,
 Calendar,
 BarChart3
} from 'lucide-react'

interface Analytics {
 totalRevenue: number
 totalOrders: number
 totalCustomers: number
 totalProducts: number
 averageOrderValue: number
 revenueByMonth: Array<{ month: string; revenue: number }>
 topProducts: Array<{ name: string; sales: number; revenue: number }>
 ordersByStatus: Array<{ status: string; count: number }>
}

export default function AdminAnalytics() {
 const [analytics, setAnalytics] = useState<Analytics>({
   totalRevenue: 0,
   totalOrders: 0,
   totalCustomers: 0,
   totalProducts: 0,
   averageOrderValue: 0,
   revenueByMonth: [],
   topProducts: [],
   ordersByStatus: []
 })
 const [loading, setLoading] = useState(true)
 const [timeRange, setTimeRange] = useState('all') // all, month, week

 useEffect(() => {
   fetchAnalytics()
 }, [timeRange])

 const fetchAnalytics = async () => {
   try {
     setLoading(true)

     // Fetch all orders
     const { data: orders } = await supabase
       .from('orders')
       .select(`
         *,
         order_items (
           *,
           product:products (name)
         )
       `)

     // Fetch customers
     const { data: customers } = await supabase
       .from('user_profiles')
       .select('id')

     // Fetch products
     const { data: products } = await supabase
       .from('products')
       .select('*')
       .eq('is_active', true)

     if (orders) {
       // Calculate total revenue
       const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0)
       
       // Calculate average order value
       const averageOrderValue = totalRevenue / (orders.length || 1)

       // Group orders by status
       const statusGroups = orders.reduce((acc, order) => {
         acc[order.status] = (acc[order.status] || 0) + 1
         return acc
       }, {} as Record<string, number>)

       const ordersByStatus = Object.entries(statusGroups).map(([status, count]) => ({
         status,
         count
       }))

       // Calculate revenue by month
       const monthlyRevenue = orders.reduce((acc, order) => {
         const month = new Date(order.created_at).toLocaleDateString('en-US', { 
           year: 'numeric', 
           month: 'short' 
         })
         acc[month] = (acc[month] || 0) + Number(order.total_amount)
         return acc
       }, {} as Record<string, number>)

       const revenueByMonth = Object.entries(monthlyRevenue).map(([month, revenue]) => ({
         month,
         revenue
       })).slice(-6) // Last 6 months

       // Calculate top products
       const productSales = orders.flatMap(order => 
         order.order_items.map(item => ({
           name: item.product.name,
           quantity: item.quantity,
           revenue: item.price * item.quantity
         }))
       ).reduce((acc, item) => {
         if (!acc[item.name]) {
           acc[item.name] = { sales: 0, revenue: 0 }
         }
         acc[item.name].sales += item.quantity
         acc[item.name].revenue += item.revenue
         return acc
       }, {} as Record<string, { sales: number; revenue: number }>)

       const topProducts = Object.entries(productSales)
         .map(([name, data]) => ({ name, ...data }))
         .sort((a, b) => b.revenue - a.revenue)
         .slice(0, 5)

       setAnalytics({
         totalRevenue,
         totalOrders: orders.length,
         totalCustomers: customers?.length || 0,
         totalProducts: products?.length || 0,
         averageOrderValue,
         revenueByMonth,
         topProducts,
         ordersByStatus
       })
     }
   } catch (error) {
     console.error('Error fetching analytics:', error)
   } finally {
     setLoading(false)
   }
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
     <div className="flex justify-between items-center">
       <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
       <select
         value={timeRange}
         onChange={(e) => setTimeRange(e.target.value)}
         className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
       >
         <option value="all">All Time</option>
         <option value="month">This Month</option>
         <option value="week">This Week</option>
       </select>
     </div>

     {/* Key Metrics */}
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
       <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm font-medium text-gray-600">Total Revenue</p>
             <p className="text-3xl font-bold text-gray-900">
               {formatCurrency(analytics.totalRevenue)}
             </p>
           </div>
           <div className="p-3 bg-green-100 rounded-full">
             <DollarSign className="w-6 h-6 text-green-600" />
           </div>
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
       </div>

       <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm font-medium text-gray-600">Customers</p>
             <p className="text-3xl font-bold text-gray-900">{analytics.totalCustomers}</p>
           </div>
           <div className="p-3 bg-purple-100 rounded-full">
             <Users className="w-6 h-6 text-purple-600" />
           </div>
         </div>
       </div>

       <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
             <p className="text-3xl font-bold text-gray-900">
               {formatCurrency(analytics.averageOrderValue)}
             </p>
           </div>
           <div className="p-3 bg-orange-100 rounded-full">
             <TrendingUp className="w-6 h-6 text-orange-600" />
           </div>
         </div>
       </div>
     </div>

     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       {/* Top Products */}
       <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
         <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
         {analytics.topProducts.length > 0 ? (
           <div className="space-y-4">
             {analytics.topProducts.map((product, index) => (
               <div key={index} className="flex items-center justify-between">
                 <div className="flex-1">
                   <div className="text-sm font-medium text-gray-900">{product.name}</div>
                   <div className="text-sm text-gray-500">{product.sales} sold</div>
                 </div>
                 <div className="text-sm font-semibold text-gray-900">
                   {formatCurrency(product.revenue)}
                 </div>
               </div>
             ))}
           </div>
         ) : (
           <p className="text-gray-500 text-center py-8">No sales data yet</p>
         )}
       </div>

       {/* Order Status Distribution */}
       <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
         <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
         {analytics.ordersByStatus.length > 0 ? (
           <div className="space-y-4">
             {analytics.ordersByStatus.map((item, index) => (
               <div key={index} className="flex items-center justify-between">
                 <div className="flex items-center space-x-3">
                   <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                     item.status === 'delivered' ? 'bg-green-100 text-green-800' :
                     item.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                     item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                     'bg-gray-100 text-gray-800'
                   }`}>
                     {item.status}
                   </span>
                 </div>
                 <div className="text-sm font-semibold text-gray-900">
                   {item.count} orders
                 </div>
               </div>
             ))}
           </div>
         ) : (
           <p className="text-gray-500 text-center py-8">No order data yet</p>
         )}
       </div>
     </div>

     {/* Monthly Revenue Chart (Simple) */}
     <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
       <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
       {analytics.revenueByMonth.length > 0 ? (
         <div className="space-y-4">
           {analytics.revenueByMonth.map((item, index) => (
             <div key={index} className="flex items-center space-x-4">
               <div className="w-20 text-sm text-gray-600">{item.month}</div>
               <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                 <div 
                   className="bg-blue-600 h-full rounded-full flex items-center justify-end pr-3"
                   style={{ 
                     width: `${(item.revenue / Math.max(...analytics.revenueByMonth.map(m => m.revenue))) * 100}%` 
                   }}
                 >
                   <span className="text-xs text-white font-medium">
                     {formatCurrency(item.revenue)}
                   </span>
                 </div>
               </div>
             </div>
           ))}
         </div>
       ) : (
         <p className="text-gray-500 text-center py-8">No revenue data yet</p>
       )}
     </div>
   </div>
 )
}
