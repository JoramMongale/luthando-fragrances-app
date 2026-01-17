'use client'

import React from 'react'
import { MessageCircle, Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react'
import { openWhatsApp } from '@/lib/whatsapp'
import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-luxury-obsidian text-luxury-porcelain py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full border border-luxury-porcelain flex items-center justify-center">
                <span className="font-serif-luxury font-bold text-2xl text-luxury-porcelain">L</span>
              </div>
              <h3 className="font-serif-luxury text-2xl tracking-widest">LUTHANDO</h3>
            </div>
            <p className="font-sans-luxury tracking-wide text-luxury-porcelain/70 leading-relaxed">
              An olfactory journey through South Africa's most captivating landscapes. 
              Premium fragrances crafted with passion and precision.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif-luxury text-xl tracking-widest mb-8">QUICK LINKS</h4>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/" 
                  className="font-sans-luxury tracking-wide text-luxury-porcelain/70 hover:text-luxury-porcelain transition-colors inline-block"
                >
                  HOME
                </Link>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                  className="font-sans-luxury tracking-wide text-luxury-porcelain/70 hover:text-luxury-porcelain transition-colors text-left"
                >
                  SHOP
                </button>
              </li>
              <li>
                <Link 
                  href="/cart" 
                  className="font-sans-luxury tracking-wide text-luxury-porcelain/70 hover:text-luxury-porcelain transition-colors inline-block"
                >
                  CART
                </Link>
              </li>
              <li>
                <Link 
                  href="/orders" 
                  className="font-sans-luxury tracking-wide text-luxury-porcelain/70 hover:text-luxury-porcelain transition-colors inline-block"
                >
                  ORDERS
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif-luxury text-xl tracking-widest mb-8">CONTACT</h4>
            <ul className="space-y-6">
              <li className="flex items-start space-x-4">
                <Phone className="w-5 h-5 text-luxury-porcelain/50 mt-1 flex-shrink-0" />
                <span className="font-sans-luxury tracking-wide text-luxury-porcelain/70">
                  +27 73 827 9055
                </span>
              </li>
              <li className="flex items-start space-x-4">
                <Mail className="w-5 h-5 text-luxury-porcelain/50 mt-1 flex-shrink-0" />
                <span className="font-sans-luxury tracking-wide text-luxury-porcelain/70">
                  luthandofragrances@outlook.com
                </span>
              </li>
              <li className="flex items-start space-x-4">
                <MapPin className="w-5 h-5 text-luxury-porcelain/50 mt-1 flex-shrink-0" />
                <span className="font-sans-luxury tracking-wide text-luxury-porcelain/70">
                  South Africa
                </span>
              </li>
            </ul>
          </div>

          {/* WhatsApp CTA */}
          <div>
            <h4 className="font-serif-luxury text-xl tracking-widest mb-8">GET IN TOUCH</h4>
            <p className="font-sans-luxury tracking-wide text-luxury-porcelain/70 mb-6">
              Have questions about our fragrances? Chat with our experts directly on WhatsApp.
            </p>
            <button
              onClick={() => openWhatsApp('Hi! I\'d like to know more about your perfumes.')}
              className="group relative w-full font-sans-luxury tracking-widest text-luxury-obsidian py-4 bg-luxury-porcelain border border-luxury-porcelain overflow-hidden transition-all duration-500 hover:text-luxury-porcelain"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <MessageCircle size={20} />
                CHAT ON WHATSAPP
              </span>
              <div className="absolute inset-0 bg-luxury-obsidian transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            </button>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="border-t border-luxury-porcelain/20 pt-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center space-x-6">
              <a 
                href="#" 
                className="text-luxury-porcelain/50 hover:text-luxury-porcelain transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="#" 
                className="text-luxury-porcelain/50 hover:text-luxury-porcelain transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
            </div>

            <div className="text-center md:text-left">
              <p className="font-sans-luxury tracking-wide text-sm text-luxury-porcelain/50">
                © {currentYear} LUTHANDO FRAGRANCES. ALL RIGHTS RESERVED.
              </p>
              <p className="font-sans-luxury tracking-wide text-xs text-luxury-porcelain/30 mt-2">
                DEVELOPED BY SKEEM LOGISTICS
              </p>
            </div>

            <div className="text-center md:text-right">
              <p className="font-sans-luxury tracking-wide text-sm text-luxury-porcelain/50">
                TERMS & CONDITIONS | PRIVACY POLICY
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
