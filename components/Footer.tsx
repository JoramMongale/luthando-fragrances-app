'use client'

import React from 'react'
import { MessageCircle } from 'lucide-react'
import { openWhatsApp } from '@/lib/whatsapp'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <h3 className="text-2xl font-bold">Luthando Fragrances</h3>
          </div>
          <p className="text-gray-400 mb-8 text-lg">Premium fragrances for every occasion</p>
          
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => openWhatsApp('Hi! I\'d like to know more about your perfumes.')}
              className="btn btn-success flex items-center gap-2"
            >
              <MessageCircle size={20} />
              Contact Us on WhatsApp
            </button>
          </div>
          
          <div className="border-t border-gray-700 pt-8">
            <p className="text-gray-400">
              © 2025 Luthando Fragrances. All rights reserved. | Developed by SKEEM LOGISTICS
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
