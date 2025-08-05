'use client'

import React, { useState, useEffect } from 'react'
import { listProductImages, getStorageStats, cleanupUnusedImages, formatFileSize } from '@/lib/admin-storage'
import { HardDrive, Image as ImageIcon, Trash2, RefreshCw, AlertCircle } from 'lucide-react'

export default function AdminStorage() {
  const [images, setImages] = useState<any[]>([])
  const [stats, setStats] = useState({ totalFiles: 0, totalSize: 0 })
  const [loading, setLoading] = useState(true)
  const [cleaning, setCleaning] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadStorageData()
  }, [])

  const loadStorageData = async () => {
    try {
      setLoading(true)
      setError('')

      const [imagesResult, statsResult] = await Promise.all([
        listProductImages(),
        getStorageStats()
      ])

      if (imagesResult.error) throw imagesResult.error

      setImages(imagesResult.data || [])
      setStats(statsResult)
    } catch (err: any) {
      setError(err.message || 'Failed to load storage data')
    } finally {
      setLoading(false)
    }
  }

  const handleCleanup = async () => {
    if (!confirm('This will delete all unused images. Are you sure?')) return

    try {
      setCleaning(true)
      setError('')
      setSuccess('')

      const result = await cleanupUnusedImages()

      if (result.errors.length > 0) {
        throw new Error('Some files could not be deleted')
      }

      setSuccess(`Successfully deleted ${result.deleted} unused images`)
      await loadStorageData()
    } catch (err: any) {
      setError(err.message || 'Failed to cleanup images')
    } finally {
      setCleaning(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Storage Management</h1>
          <p className="text-gray-600">Manage product images and storage usage</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={loadStorageData}
            disabled={loading}
            className="btn btn-secondary flex items-center gap-2"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={handleCleanup}
            disabled={cleaning || images.length === 0}
            className="btn btn-outline flex items-center gap-2 text-orange-600 border-orange-600 hover:bg-orange-600 hover:text-white"
          >
            <Trash2 size={16} />
            {cleaning ? 'Cleaning...' : 'Cleanup Unused'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Images</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalFiles}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <ImageIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Storage Used</p>
              <p className="text-3xl font-bold text-gray-900">{formatFileSize(stats.totalSize)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <HardDrive className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Size</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalFiles > 0 ? formatFileSize(stats.totalSize / stats.totalFiles) : '0 B'}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <ImageIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Images Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Product Images</h3>
          <p className="text-sm text-gray-600 mt-1">
            All uploaded product images are listed below
          </p>
        </div>

        {images.length > 0 ? (
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {images.map((image, index) => (
                <div key={image.name} className="group relative">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/products/${image.name}`}
                      alt={image.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 truncate">{image.name}</p>
                    <p className="text-xs text-gray-400">
                      {image.metadata?.size ? formatFileSize(image.metadata.size) : 'Unknown size'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No images found</p>
            <p className="text-sm">Upload some product images to see them here</p>
          </div>
        )}
      </div>
    </div>
  )
}
