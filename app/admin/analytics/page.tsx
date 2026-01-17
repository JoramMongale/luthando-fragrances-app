'use client'

import React, { useState, useEffect } from 'react'
import { 
  BarChart3, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Filter
} from 'lucide-react'

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('30d')
  const [loading, setLoading] = useState(false)

  // Mock data for analytics
  const analyticsData = {
    overview: {
      revenue: { current: 12540, previous: 9800, change: 28 },
      orders: { current: 89, previous: 72, change: 24 },
      customers: { current: 45, previous: 38, change: 18 },
      avgOrder: { current: 140, previous: 136, change: 3 }
    },
    revenueByDay: [
      { day: 'Mon', revenue: 1200 },
      { day: 'Tue', revenue: 1800 },
      { day: 'Wed', revenue: 1500 },
      { day: 'Thu', revenue: 2200 },
      { day: 'Fri', revenue: 2800 },
      { day: 'Sat', revenue: 2500 },
      { day: 'Sun', revenue: 1400 }
    ],
    topProducts: [
      { name: 'Midnight Obsidian', sales: 42, revenue: 5880 },
      { name: 'Vanilla Veil', sales: 38, revenue: 5320 },
      { name: 'Porcelain Dream', sales: 35, revenue: 4900 },
      { name: 'Charcoal Essence', sales: 28, revenue: 3920 },
      { name: 'Golden Sand', sales: 24, revenue: 3360 }
    ],
    trafficSources: [
      { source: 'Direct', visitors: 1200, percentage: 40 },
      { source: 'Social Media', visitors: 800, percentage: 27 },
      { source: 'Search', visitors: 600, percentage: 20 },
      { source: 'Referral', visitors: 400, percentage: 13 }
    ]
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track your store performance and insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                R {analyticsData.overview.revenue.current.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center">
            {analyticsData.overview.revenue.change > 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${analyticsData.overview.revenue.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analyticsData.overview.revenue.change > 0 ? '+' : ''}{analyticsData.overview.revenue.change}%
            </span>
            <span className="text-sm text-gray-600 ml-2">vs previous period</span>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.orders.current}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center">
            {analyticsData.overview.orders.change > 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${analyticsData.overview.orders.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analyticsData.overview.orders.change > 0 ? '+' : ''}{analyticsData.overview.orders.change}%
            </span>
            <span className="text-sm text-gray-600 ml-2">vs previous period</span>
          </div>
        </div>

        {/* Customers Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">New Customers</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.customers.current}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center">
            {analyticsData.overview.customers.change > 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${analyticsData.overview.customers.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analyticsData.overview.customers.change > 0 ? '+' : ''}{analyticsData.overview.customers.change}%
            </span>
            <span className="text-sm text-gray-600 ml-2">vs previous period</span>
          </div>
        </div>

        {/* Avg Order Value Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Avg. Order Value</p>
              <p className="text-2xl font-bold text-gray-900">R {analyticsData.overview.avgOrder.current}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center">
            {analyticsData.overview.avgOrder.change > 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${analyticsData.overview.avgOrder.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analyticsData.overview.avgOrder.change > 0 ? '+' : ''}{analyticsData.overview.avgOrder.change}%
            </span>
            <span className="text-sm text-gray-600 ml-2">vs previous period</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Revenue Trends</h2>
            <span className="text-sm text-gray-600">Last 7 days</span>
          </div>
          <div className="space-y-4">
            {analyticsData.revenueByDay.map((item, index) => (
              <div key={item.day} className="flex items-center">
                <div className="w-16 text-sm text-gray-600">{item.day}</div>
                <div className="flex-1">
                  <div className="relative h-8 bg-gray-100 rounded overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-blue-500 rounded"
                      style={{ width: `${(item.revenue / 3000) * 100}%` }}
                    />
                    <div className="absolute inset-0 flex items-center pl-2">
                      <span className="text-sm font-medium text-gray-900">
                        R {item.revenue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
            <span className="text-sm text-gray-600">By revenue</span>
          </div>
          <div className="space-y-4">
            {analyticsData.topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-medium">{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.sales} units sold</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">R {product.revenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Revenue</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Traffic Sources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="space-y-4">
              {analyticsData.trafficSources.map((source) => (
                <div key={source.source} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-3" />
                    <span className="font-medium text-gray-900">{source.source}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{source.visitors.toLocaleString()} visitors</div>
                    <div className="text-sm text-gray-500">{source.percentage}% of total</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              {/* Simple pie chart visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">2,980</div>
                  <div className="text-sm text-gray-600">Total Visitors</div>
                </div>
              </div>
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Pie segments */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="20" 
                  strokeDasharray={`${40 * 0.4} ${40 * 0.6}`} strokeDashoffset="0" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="20" 
                  strokeDasharray={`${40 * 0.27} ${40 * 0.73}`} strokeDashoffset={`-${40 * 0.4}`} />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="20" 
                  strokeDasharray={`${40 * 0.2} ${40 * 0.8}`} strokeDashoffset={`-${40 * 0.67}`} />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#ef4444" strokeWidth="20" 
                  strokeDasharray={`${40 * 0.13} ${40 * 0.87}`} strokeDashoffset={`-${40 * 0.87}`} />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Information Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Analytics Information</h3>
            <p className="text-blue-800 mb-3">
              This analytics dashboard provides insights into your store's performance. Currently showing mock data for demonstration purposes.
              In a production environment, this data would be automatically populated from your store's actual sales, orders, and traffic.
            </p>
            <p className="text-blue-700 text-sm">
              <strong>Note:</strong> Real analytics data will appear as your store receives orders and traffic. 
              The dashboard will help you track revenue trends, product performance, and customer behavior.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}