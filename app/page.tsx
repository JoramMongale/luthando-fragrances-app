'use client'

import React, { useState, useEffect } from 'react'
import ProductCard from '@/components/ProductCard'
import { getProducts } from '@/lib/unified-db'
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
    <div className="min-h-screen bg-luxury-porcelain">
      {/* Hero Section - Editorial Luxury */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-luxury-obsidian via-luxury-charcoal to-luxury-obsidian z-0"></div>
        
        {/* Optional subtle texture overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1590736969956-8e3e599de7ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20 z-0"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="animate-fade-in-up">
            <h1 className="font-serif-luxury font-light text-5xl md:text-7xl lg:text-8xl tracking-widest text-luxury-porcelain mb-8 leading-tight">
              LUTHANDO
              <span className="block font-serif-luxury italic text-3xl md:text-4xl lg:text-5xl tracking-widest text-luxury-sand mt-6">
                Fragrances
              </span>
            </h1>
            
            <div className="h-px w-32 bg-luxury-sand mx-auto my-12"></div>
            
            <p className="font-sans-luxury text-xl md:text-2xl lg:text-3xl tracking-widest text-luxury-porcelain/80 max-w-3xl mx-auto mb-12 leading-relaxed">
              An olfactory journey through South Africa's most captivating landscapes.
              <span className="block mt-4 text-lg md:text-xl tracking-widest text-luxury-sand">
                Where each scent tells a story, and every bottle holds a memory.
              </span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative font-sans-luxury tracking-widest text-luxury-porcelain text-lg py-4 px-12 border border-luxury-porcelain overflow-hidden transition-all duration-500 hover:border-luxury-sand"
              >
                <span className="relative z-10">EXPLORE THE COLLECTION</span>
                <div className="absolute inset-0 bg-luxury-porcelain transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              </button>
              
              <button
                onClick={() => openWhatsApp('Hi! I\'d like a fragrance consultation.')}
                className="font-sans-luxury tracking-widest text-luxury-sand text-lg py-4 px-12 border border-transparent hover:border-luxury-sand transition-all duration-500"
              >
                BOOK A CONSULTATION
              </button>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-px h-12 bg-luxury-sand/50"></div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 bg-luxury-vanilla-veil">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-16">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 border border-luxury-obsidian/20 transform rotate-45 transition-all duration-500 group-hover:rotate-90"></div>
                  <Star className="w-10 h-10 text-luxury-obsidian absolute inset-0 m-auto transition-all duration-500 group-hover:scale-110" />
                </div>
              </div>
              <h3 className="font-serif-luxury text-2xl tracking-widest mb-6 text-luxury-obsidian">PREMIUM QUALITY</h3>
              <p className="font-sans-luxury tracking-wide text-luxury-obsidian/70 leading-relaxed">
                Carefully curated fragrances made from the finest ingredients sourced from across the globe.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 border border-luxury-obsidian/20 transform rotate-45 transition-all duration-500 group-hover:rotate-90"></div>
                  <Truck className="w-10 h-10 text-luxury-obsidian absolute inset-0 m-auto transition-all duration-500 group-hover:scale-110" />
                </div>
              </div>
              <h3 className="font-serif-luxury text-2xl tracking-widest mb-6 text-luxury-obsidian">FAST DELIVERY</h3>
              <p className="font-sans-luxury tracking-wide text-luxury-obsidian/70 leading-relaxed">
                Quick and secure delivery across South Africa within 2-5 business days.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 border border-luxury-obsidian/20 transform rotate-45 transition-all duration-500 group-hover:rotate-90"></div>
                  <Shield className="w-10 h-10 text-luxury-obsidian absolute inset-0 m-auto transition-all duration-500 group-hover:scale-110" />
                </div>
              </div>
              <h3 className="font-serif-luxury text-2xl tracking-widest mb-6 text-luxury-obsidian">SATISFACTION GUARANTEE</h3>
              <p className="font-sans-luxury tracking-wide text-luxury-obsidian/70 leading-relaxed">
                100% satisfaction guarantee or your money back, no questions asked.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Collection Section */}
      <section id="products" className="py-32 bg-luxury-porcelain">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="font-serif-luxury text-4xl md:text-5xl tracking-widest text-luxury-obsidian mb-8">
              THE COLLECTION
            </h2>
            <div className="h-px w-24 bg-luxury-sand mx-auto mb-8"></div>
            <p className="font-sans-luxury text-xl tracking-wide text-luxury-obsidian/70 max-w-3xl mx-auto leading-relaxed">
              A curated selection of premium fragrances, each crafted to tell a unique story and evoke emotion.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex justify-center mb-16">
            <div className="flex flex-wrap gap-2 p-1 bg-luxury-vanilla-veil rounded-none">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`font-sans-luxury tracking-widest text-sm px-8 py-4 transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-luxury-obsidian text-luxury-porcelain'
                      : 'text-luxury-obsidian/70 hover:text-luxury-obsidian hover:bg-luxury-sand'
                  }`}
                >
                  {category.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="relative">
                <div className="w-16 h-16 border border-luxury-obsidian/20 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border border-luxury-obsidian animate-pulse"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-24">
                  <p className="font-sans-luxury tracking-wide text-luxury-obsidian/50 text-lg">
                    No products found in this category.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Consultation CTA */}
      <section className="py-32 bg-luxury-obsidian text-luxury-porcelain">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif-luxury text-3xl md:text-4xl tracking-widest mb-8">
            NEED GUIDANCE?
          </h2>
          <div className="h-px w-16 bg-luxury-sand mx-auto mb-8"></div>
          <p className="font-sans-luxury text-xl tracking-wide text-luxury-porcelain/80 mb-12 max-w-2xl mx-auto">
            Our fragrance experts are here to help you find your perfect scent. 
            Book a personal consultation to discover your signature fragrance.
          </p>
          <button
            onClick={() => openWhatsApp('Hi! I need help choosing the perfect fragrance.')}
            className="group relative font-sans-luxury tracking-widest text-luxury-obsidian text-lg py-4 px-12 bg-luxury-porcelain border border-luxury-porcelain overflow-hidden transition-all duration-500 hover:text-luxury-porcelain"
          >
            <span className="relative z-10">BOOK A CONSULTATION</span>
            <div className="absolute inset-0 bg-luxury-obsidian transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
          </button>
        </div>
      </section>
    </div>
  )
}
