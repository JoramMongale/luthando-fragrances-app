'use client'

import React from 'react'
import { formatCurrency } from '@/lib/utils'
import { useCartStore } from '@/lib/cart-store'
import { openWhatsApp, createProductInquiryMessage } from '@/lib/whatsapp'
import { ShoppingCart, MessageCircle, Plus, Package } from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: 'For Him' | 'For Her' | 'Unisex'
  image_url: string | null
  stock_quantity: number
  is_active: boolean
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const cartStore = useCartStore()

  const handleAddToCart = () => {
    cartStore.addItem(product)
  }

  const handleWhatsAppInquiry = () => {
    const message = createProductInquiryMessage(product.name, product.price)
    openWhatsApp(message)
  }

  return (
    <div className="product-card group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative overflow-hidden">
        <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex flex-col items-center text-gray-400">
              <Package className="w-16 h-16 mb-2" />
              <span className="text-sm font-medium">Product Image</span>
            </div>
          )}
        </div>
        
        <div className="absolute top-4 right-4">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
            {product.category}
          </span>
        </div>

        {product.stock_quantity <= 5 && (
          <div className="absolute top-4 left-4">
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
              Only {product.stock_quantity} left!
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-blue-600">
            {formatCurrency(product.price)}
          </span>
          {product.stock_quantity <= 5 && (
            <span className="text-sm text-orange-600 font-medium">
              Low Stock!
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 btn btn-outline flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all duration-200"
          >
            <Plus size={16} />
            Add to Cart
          </button>
          <button
            onClick={handleWhatsAppInquiry}
            className="flex-1 btn btn-success flex items-center justify-center gap-2"
          >
            <MessageCircle size={16} />
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}
