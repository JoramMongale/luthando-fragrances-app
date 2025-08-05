'use client'

import React, { useState } from 'react'
import { Image as ImageIcon, Plus, X, Eye } from 'lucide-react'

interface ImageGalleryProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

export default function ImageGallery({ 
  images, 
  onImagesChange, 
  maxImages = 5 
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const canAddMore = images.length < maxImages

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Product Gallery ({images.length}/{maxImages})
        </label>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={image}
                alt={`Product ${index + 1}`}
                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setSelectedImage(image)}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button
                    onClick={() => setSelectedImage(image)}
                    className="p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <Eye size={12} />
                  </button>
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>

              {/* Primary Image Badge */}
              {index === 0 && (
                <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded">
                  Primary
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Add Image Button */}
        {canAddMore && (
          <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="add-image"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  // Handle file upload here
                  // This would integrate with the uploadProductImage function
                }
              }}
            />
            <label
              htmlFor="add-image"
              className="flex flex-col items-center justify-center w-full h-full cursor-pointer text-gray-400 hover:text-gray-600"
            >
              <Plus size={24} />
              <span className="text-xs mt-1">Add Image</span>
            </label>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X size={24} />
            </button>
            <img
              src={selectedImage}
              alt="Product preview"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Instructions */}
      {images.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <ImageIcon className="w-16 h-16 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">No images uploaded yet</p>
          <p className="text-xs text-gray-400 mt-1">
            The first image will be used as the primary product image
          </p>
        </div>
      )}
    </div>
  )
}
