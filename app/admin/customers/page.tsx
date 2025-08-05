'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'
import { Users, Mail, Calendar, ShoppingBag, Search } from 'lucide-react'

interface Customer {
 id: string
 email: string
 first_name: string | null
 last_name: string | null
 phone: string | null
 created_at: string
 updated_at: string
 total_orders?: number
 total_spent?: number
}

export default function AdminCustomers() {
 const [customers, setCustomers] = useState<Customer[]>([])
 const [loading, setLoading] = useState(true)
 const [searchTerm, setSearchTerm] = useState('')

 useEffect(() => {
   fetchCustomers()
 }, [])

 const fetchCustomers = async () => {
   try {
     setLoading(true)
     
     // Fetch all user profiles
     const { data: profiles, error: profilesError } = await supabase
       .from('user_profiles')
       .select('*')
       .order('created_at', { ascending: false })

     if (profilesError) throw profilesError

     // Fetch order statistics for each customer
     if (profiles && profiles.length > 0) {
       const customersWithStats = await Promise.all(
         profiles.map(async (profile) => {
           const { data: orders } = await supabase
             .from('orders')
             .select('total_amount')
             .eq('user_id', profile.id)

           const totalOrders = orders?.length || 0
           const totalSpent = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0

           return {
             ...profile,
             total_orders: totalOrders,
             total_spent: totalSpent
           }
         })
       )

       setCustomers(customersWithStats)
     } else {
       setCustomers([])
     }
   } catch (error) {
     console.error('Error fetching customers:', error)
   } finally {
     setLoading(false)
   }
 }

 const filteredCustomers = customers.filter(customer => {
   const searchLower = searchTerm.toLowerCase()
   return (
     customer.email?.toLowerCase().includes(searchLower) ||
     customer.first_name?.toLowerCase().includes(searchLower) ||
     customer.last_name?.toLowerCase().includes(searchLower) ||
     customer.phone?.includes(searchTerm)
   )
 })

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
       <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
       <div className="relative">
         <input
           type="text"
           placeholder="Search customers..."
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
           className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
         />
         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
       </div>
     </div>

     {/* Customer Stats */}
     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
       <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm font-medium text-gray-600">Total Customers</p>
             <p className="text-3xl font-bold text-gray-900">{customers.length}</p>
           </div>
           <div className="p-3 bg-blue-100 rounded-full">
             <Users className="w-6 h-6 text-blue-600" />
           </div>
         </div>
       </div>

       <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm font-medium text-gray-600">Total Revenue</p>
             <p className="text-3xl font-bold text-gray-900">
               {formatCurrency(customers.reduce((sum, c) => sum + (c.total_spent || 0), 0))}
             </p>
           </div>
           <div className="p-3 bg-green-100 rounded-full">
             <ShoppingBag className="w-6 h-6 text-green-600" />
           </div>
         </div>
       </div>

       <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
             <p className="text-3xl font-bold text-gray-900">
               {formatCurrency(
                 customers.reduce((sum, c) => sum + (c.total_spent || 0), 0) / 
                 Math.max(customers.reduce((sum, c) => sum + (c.total_orders || 0), 0), 1)
               )}
             </p>
           </div>
           <div className="p-3 bg-purple-100 rounded-full">
             <ShoppingBag className="w-6 h-6 text-purple-600" />
           </div>
         </div>
       </div>
     </div>

     {/* Customers Table */}
     <div className="bg-white rounded-lg shadow-sm border border-gray-200">
       {filteredCustomers.length === 0 ? (
         <div className="text-center py-16">
           <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
           <h2 className="text-xl font-semibold text-gray-900 mb-2">No Customers Found</h2>
           <p className="text-gray-600">
             {searchTerm ? 'No customers match your search.' : 'No customers have registered yet.'}
           </p>
         </div>
       ) : (
         <div className="overflow-x-auto">
           <table className="min-w-full divide-y divide-gray-200">
             <thead className="bg-gray-50">
               <tr>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   Customer
                 </th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   Contact
                 </th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   Orders
                 </th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   Total Spent
                 </th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   Joined
                 </th>
               </tr>
             </thead>
             <tbody className="bg-white divide-y divide-gray-200">
               {filteredCustomers.map((customer) => (
                 <tr key={customer.id} className="hover:bg-gray-50">
                   <td className="px-6 py-4">
                     <div>
                       <div className="text-sm font-medium text-gray-900">
                         {customer.first_name && customer.last_name
                           ? `${customer.first_name} ${customer.last_name}`
                           : 'No name'}
                       </div>
                       <div className="text-sm text-gray-500">
                         ID: {customer.id.substring(0, 8)}
                       </div>
                     </div>
                   </td>
                   <td className="px-6 py-4">
                     <div className="text-sm">
                       <div className="flex items-center gap-1 text-gray-900">
                         <Mail className="w-4 h-4 text-gray-400" />
                         {customer.email}
                       </div>
                       {customer.phone && (
                         <div className="text-gray-500 mt-1">
                           {customer.phone}
                         </div>
                       )}
                     </div>
                   </td>
                   <td className="px-6 py-4">
                     <div className="text-sm font-medium text-gray-900">
                       {customer.total_orders || 0}
                     </div>
                   </td>
                   <td className="px-6 py-4">
                     <div className="text-sm font-medium text-gray-900">
                       {formatCurrency(customer.total_spent || 0)}
                     </div>
                   </td>
                   <td className="px-6 py-4">
                     <div className="text-sm text-gray-900">
                       {new Date(customer.created_at).toLocaleDateString()}
                     </div>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       )}
     </div>
   </div>
 )
}
