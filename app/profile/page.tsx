'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { User, Mail, Phone, MapPin, Package, LogOut, Edit } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    }
  }, [user, router])

  const handleSignOut = async () => {
    setLoading(true)
    await signOut()
    router.push('/')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">My Profile</h1>
                  <p className="text-blue-100">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                disabled={loading}
                className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2"
              >
                <LogOut size={16} />
                {loading ? 'Signing out...' : 'Sign Out'}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Profile Information */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
                <div className="space-y-4">
                 <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                   <Mail className="w-5 h-5 text-gray-400" />
                   <div>
                     <p className="text-sm text-gray-500">Email</p>
                     <p className="font-medium">{user.email}</p>
                   </div>
                 </div>
                 
                 <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                   <User className="w-5 h-5 text-gray-400" />
                   <div>
                     <p className="text-sm text-gray-500">Member Since</p>
                     <p className="font-medium">
                       {new Date(user.created_at).toLocaleDateString('en-ZA', {
                         year: 'numeric',
                         month: 'long',
                         day: 'numeric'
                       })}
                     </p>
                   </div>
                 </div>

                 <Link 
                   href="/auth/reset-password"
                   className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                 >
                   <Edit className="w-5 h-5 text-gray-400" />
                   <div>
                     <p className="font-medium text-blue-600">Change Password</p>
                     <p className="text-sm text-gray-500">Update your password</p>
                   </div>
                 </Link>
               </div>
             </div>

             {/* Quick Actions */}
             <div>
               <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
               <div className="space-y-3">
                 <Link
                   href="/orders"
                   className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                 >
                   <Package className="w-5 h-5 text-gray-400" />
                   <div className="text-left">
                     <p className="font-medium">Order History</p>
                     <p className="text-sm text-gray-500">View your past orders</p>
                   </div>
                 </Link>
                 
                 <Link
                   href="/cart"
                   className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                 >
                   <Package className="w-5 h-5 text-gray-400" />
                   <div className="text-left">
                     <p className="font-medium">Shopping Cart</p>
                     <p className="text-sm text-gray-500">View items in your cart</p>
                   </div>
                 </Link>
                 
                 <Link
                   href="/"
                   className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                 >
                   <Package className="w-5 h-5 text-gray-400" />
                   <div className="text-left">
                     <p className="font-medium">Continue Shopping</p>
                     <p className="text-sm text-gray-500">Browse our products</p>
                   </div>
                 </Link>
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
   </div>
 )
}
