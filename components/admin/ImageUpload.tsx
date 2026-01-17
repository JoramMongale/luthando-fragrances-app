'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { 
  uploadProductImage, 
  deleteProductImage, 
  ALLOWED_FILE_TYPES, 
  MAX_FILE_SIZE,
  createImagePreview,
  cleanupPreview
} from '@/lib/unified-storage'
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Loader2, 
  Check,
  AlertCircle,
  Trash2
} from 'lucide-react'

interface ImageUploadProps {
  productId: string
  currentImageUrl?: string | null
  currentFileName?: string | null
  onImageUpdate: (imageUrl: string | null, fileName: string | null) => void
  disabled?: boolean
}

export default function ImageUpload({ 
  productId, 
  currentImageUrl, 
  currentFileName,
  onImageUpdate,
  disabled = false 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (disabled || acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    setError(null)
    setSuccess(false)

    // Create preview
    const previewUrl = createImagePreview(file)
    setPreview(previewUrl)

    try {
      setUploading(true)

      // Upload image
      const result = await uploadProductImage(file, productId, currentFileName || undefined)

      if (result.success && result.url && result.fileName) {
        onImageUpdate(result.url, result.fileName)
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        throw new Error(result.error || 'Upload failed')
      }

    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to upload image')
    } finally {
      setUploading(false)
      // Cleanup preview after a delay
      setTimeout(() => {
        if (previewUrl) {
          cleanupPreview(previewUrl)
          setPreview(null)
        }
      }, 2000)
    }
  }, [productId, currentFileName, onImageUpdate, disabled])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    disabled: disabled || uploading
  })

  const handleDeleteImage = async () => {
    if (!currentFileName || uploading) return

    try {
      setUploading(true)
      const deleted = await deleteProductImage(currentFileName)
      
      if (deleted) {
        onImageUpdate(null, null)
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        throw new Error('Failed to delete image')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete image')
    } finally {
      setUploading(false)
    }
  }

  const displayImage = preview || currentImageUrl

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Product Image
      </label>

      {/* Current/Preview Image */}
      {displayImage && (
        <div className="relative group">
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={displayImage}
              alt="Product"
              className="w-full h-full object-cover"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                {currentImageUrl && !preview && (
                  <button
                    onClick={handleDeleteImage}
                    disabled={uploading}
                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Upload Status Overlay */}
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-white text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p className="text-sm">Uploading...</p>
                </div>
              </div>
            )}

            {success && !uploading && (
              <div className="absolute top-2 right-2 bg-green-600 text-white p-2 rounded-full">
                <Check size={16} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-3">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            {uploading ? (
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isDragActive ? 'Drop image here' : 'Upload product image'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {displayImage ? 'Click or drag to replace image' : 'Click or drag image to upload'}
            </p>
          </div>
          
          <div className="text-xs text-gray-400 space-y-1">
            <p>Supported: JPG, PNG, WebP</p>
            <p>Max size: 5MB</p>
            <p>Recommended: 800x800px or larger</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle size={16} />
          <span className="text-sm">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-700 hover:text-red-900"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
          <Check size={16} />
          <span className="text-sm">
            {currentImageUrl ? 'Image uploaded successfully!' : 'Image deleted successfully!'}
          </span>
        </div>
      )}
    </div>
  )
}
