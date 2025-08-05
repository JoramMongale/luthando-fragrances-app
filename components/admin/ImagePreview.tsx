'use client'

import React, { useState } from 'react'
import { X, ZoomIn, Download } from 'lucide-react'

interface ImagePreviewProps {
  src: string
  alt: string
  className?: string
}

export default function ImagePreview({ src, alt, className = '' }: ImagePreviewProps) {
  const [showModal, setShowModal] = useState(false)

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = src
    link.download = alt
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <div className={`relative group cursor-pointer ${className}`}>
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover rounded-lg"
          onClick={() => setShowModal(true)}
        />
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <button
                onClick={handleDownload}
                className="p-2 bg-white bg-opacity-20 text-white hover:bg-opacity-30 rounded-full transition-colors"
              >
                <Download size={20} />
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 bg-white bg-opacity-20 text-white hover:bg-opacity-30 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  )
}
