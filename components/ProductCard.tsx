'use client'

import React, { useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import { useCartStore } from '@/lib/cart-store'
import { openWhatsApp } from '@/lib/whatsapp'
import { ShoppingCart, MessageCircle, Plus, Package } from 'lucide-react'

import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const cartStore = useCartStore()
  const [isHovered, setIsHovered] = useState(false)

  const handleAddToCart = () => {
    cartStore.addItem(product)
  }

  const handleWhatsAppInquiry = () => {
    const message = `Hello, I'm interested in "${product.name}" priced at ${formatCurrency(product.price)}. Could you provide more details?`
    openWhatsApp(message)
  }

  return (
    <div 
      className="group relative bg-luxury-porcelain overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container - 4:5 Aspect Ratio */}
      <div className="relative aspect-[4/5] overflow-hidden bg-luxury-vanilla-veil">
        {product.image_url ? (
          <>
            <img
              src={product.image_url}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-700 ${
                isHovered ? 'scale-105' : 'scale-100'
              }`}
            />
            {/* Overlay on hover */}
            <div className={`absolute inset-0 bg-luxury-obsidian transition-all duration-500 ${
              isHovered ? 'opacity-10' : 'opacity-0'
            }`}></div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-luxury-obsidian/30">
            <Package className="w-16 h-16 mb-4" />
            <span className="font-sans-luxury tracking-widest text-sm">PRODUCT IMAGE</span>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-4 right-4">
          <span className="font-sans-luxury tracking-widest text-xs bg-luxury-porcelain/90 text-luxury-obsidian px-3 py-2 backdrop-blur-sm">
            {product.category?.toUpperCase() ?? 'FRAGRANCE'}
          </span>
        </div>

        {/* Low Stock Indicator */}
        {product.stock_quantity <= 5 && (
          <div className="absolute top-4 left-4">
            <span className="font-sans-luxury tracking-widest text-xs bg-luxury-obsidian text-luxury-porcelain px-3 py-2">
              ONLY {product.stock_quantity} LEFT
            </span>
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-8">
        <h3 className="font-serif-luxury text-2xl tracking-widest text-luxury-obsidian mb-4">
          {product.name}
        </h3>
        <p className="font-sans-luxury tracking-wide text-luxury-obsidian/70 mb-6 leading-relaxed line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-8">
          <span className="font-serif-luxury text-2xl tracking-widest text-luxury-obsidian">
            {formatCurrency(product.price)}
          </span>
          {product.stock_quantity <= 5 && (
            <span className="font-sans-luxury tracking-widest text-xs text-luxury-obsidian/50">
              LOW STOCK
            </span>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleAddToCart}
            className="flex-1 group/btn relative font-sans-luxury tracking-widest text-sm text-luxury-obsidian py-3 border border-luxury-obsidian overflow-hidden transition-all duration-300 hover:text-luxury-porcelain"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Plus size={14} />
              ADD TO CART
            </span>
            <div className="absolute inset-0 bg-luxury-obsidian transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300"></div>
          </button>
          <button
            onClick={handleWhatsAppInquiry}
            className="flex-1 group/btn relative font-sans-luxury tracking-widest text-sm text-luxury-obsidian py-3 border border-luxury-obsidian overflow-hidden transition-all duration-300 hover:text-luxury-porcelain"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <MessageCircle size={14} />
              INQUIRE
            </span>
            <div className="absolute inset-0 bg-luxury-obsidian transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300"></div>
          </button>
        </div>
      </div>
    </div>
  )
}
