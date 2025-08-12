'use client'

import React, { useState, useEffect } from 'react'
import ProductCard from '@/components/ProductCard'
import { getProducts } from '@/lib/supabase'
import { openWhatsApp } from '@/lib/whatsapp'
import { Star, Truck, Shield, MessageCircle } from 'lucide-react'
import type { Product } from '@/types'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  const categories = ['All', 'For Him', 'For Her', 'Unisex']

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory])

  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await getProducts(selectedCategory)
    
    if (error) {
      console.error('Error fetching products:', error)
    } else {
      setProducts(data || [])
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-500 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Discover Your
            <span className="block text-yellow-300">Signature Scent</span>
          </h2>
          <p className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto opacity-90 leading-relaxed">
            Premium fragrances from South Africa. Each bottle tells a story, 
            each scent creates a memory that lasts forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Explore Collection
            </button>
            <button
              onClick={() => openWhatsApp('Hi! I\'d like a fragrance consultation.')}
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              Get Consultation
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Premium Quality</h3>
              <p className="text-gray-600 leading-relaxed">Carefully curated fragrances made from the finest ingredients sourced globally</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <Truck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Fast Delivery</h3>
              <p className="text-gray-600 leading-relaxed">Quick and secure delivery across South Africa within 2-5 business days</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Satisfaction Guarantee</h3>
              <p className="text-gray-600 leading-relaxed">100% satisfaction guarantee or your money back, no questions asked</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Premium Collection</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore our carefully curated selection of premium fragrances, each crafted to tell your unique story
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex justify-center mb-12">
            <div className="flex flex-wrap gap-4 p-2 bg-white rounded-xl shadow-md">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600 text-lg">No products found in this category.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-500 to-blue-50 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Help Choosing?</h2>
          <p className="text-xl mb-8 opacity-90">
            Our fragrance experts are here to help you find your perfect scent
          </p>
          <button
            onClick={() => openWhatsApp('Hi! I need help choosing the perfect fragrance.')}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 inline-flex items-center gap-2"
          >
            <MessageCircle size={24} />
            Chat with Our Experts
          </button>
        </div>
      </section>
    </div>
  )
}
