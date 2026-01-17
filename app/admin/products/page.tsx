'use client'

import React, { useState, useEffect } from 'react'
import { getAllProducts, createProduct, updateProduct, deleteProduct, ProductFormData } from '@/lib/unified-db'
import { formatCurrency } from '@/lib/utils'
import ImageUpload from '@/components/admin/ImageUpload'
import { 
  Package, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  EyeOff,
  AlertTriangle,
  Image as ImageIcon
} from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: 'For Him' | 'For Her' | 'Unisex'
  stock_quantity: number
  is_active: boolean
  image_url: string | null
  image_filename: string | null
  created_at: string
  updated_at: string
}

const CATEGORIES = ['For Him', 'For Her', 'Unisex']

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    category: 'For Him',
    stock_quantity: 0,
    is_active: true
  })
  const [submitting, setSubmitting] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchProducts()
  }, [page, categoryFilter])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError('')
      
      const { data, error, totalPages: pages } = await getAllProducts(
        page, 
        20, 
        categoryFilter === 'all' ? undefined : categoryFilter,
        searchTerm
      )
      
      if (error) throw error
      
      setProducts((data || []).map((p: any) => ({
        ...p,
        description: p.description ?? ''
      })))
      setTotalPages(pages)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setPage(1)
    fetchProducts()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)
      setError('')

      if (editingProduct) {
        const { error } = await updateProduct(editingProduct.id, formData)
        if (error) throw error
      } else {
        const { error } = await createProduct(formData)
        if (error) throw error
      }

      await fetchProducts()
      resetForm()
    } catch (err: any) {
      console.error('Error saving product:', err)
      setError(err.message || 'Failed to save product')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock_quantity: product.stock_quantity,
      is_active: product.is_active,
      image_url: product.image_url || ''
    })
    setShowForm(true)
  }

const handleDelete = async (productId: string) => {
  if (!confirm('Are you sure you want to deactivate this product?')) return

  try {
    const { error } = await deleteProduct(productId)
    if (error) {
      // Handle both error object formats
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? (error as any).message 
        : 'Failed to deactivate product'
      throw new Error(errorMessage)
    }
    await fetchProducts()
  } catch (err: any) {
    console.error('Error deleting product:', err)
    // More defensive error message extraction
    const errorMessage = err?.message || err?.error?.message || 'Failed to deactivate product'
    setError(errorMessage)
  }
}
  const handleImageUpdate = (imageUrl: string | null, fileName: string | null) => {
    setFormData((prev: any) => ({
      ...prev,
      image_url: imageUrl || ''
    }))
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingProduct(null)
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'For Him',
      stock_quantity: 0,
      is_active: true
    })
  }

  if (loading && products.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">Manage your product catalog and inventory</p>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="lg:w-48">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value)
                setPage(1)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSearch}
            className="btn btn-primary flex items-center gap-2"
          >
            <Search size={16} />
            Search
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
              {product.image_url ? (
                <img 
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <ImageIcon className="w-16 h-16 mb-2" />
                  <span className="text-sm">No Image</span>
                </div>
              )}
              
              {!product.is_active && (
                <div className="absolute top-2 left-2 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                  Inactive
                </div>
              )}
              
              {product.stock_quantity <= 5 && (
                <div className="absolute top-2 right-2 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <AlertTriangle size={12} />
                  Low Stock
                </div>
              )}
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full whitespace-nowrap">
                  {product.category}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-blue-600">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-sm text-gray-500">
                  Stock: {product.stock_quantity}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors"
                    title="Edit product"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors"
                    title="Delete product"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="flex items-center">
                  {product.is_active ? (
                    <Eye className="w-4 h-4 text-green-500" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {products.length === 0 && !loading && (
        <div className="text-center py-12">
          <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || categoryFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Get started by adding your first product'}
          </p>
          {!searchTerm && categoryFilter === 'all' && (
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              Add Your First Product
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Product Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe the fragrance notes, occasion, and unique characteristics..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (ZAR) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock Quantity *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.stock_quantity}
                        onChange={(e) => setFormData({...formData, stock_quantity: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value as ProductFormData['category']})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      {CATEGORIES.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                      className="mr-2"
                    />
                    <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                      Product is active and visible to customers
                    </label>
                  </div>
                </div>

                {/* Right Column - Image Upload */}
                <div>
                  <ImageUpload
                    productId={editingProduct?.id || 'new'}
                    currentImageUrl={formData.image_url || editingProduct?.image_url}
                    currentFileName={editingProduct?.image_filename}
                    onImageUpdate={handleImageUpdate}
                    disabled={submitting}
                  />
                  
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Image Guidelines</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Use high-quality images (800x800px or larger)</li>
                      <li>• Show the product clearly against a clean background</li>
                      <li>• JPG, PNG, or WebP formats supported</li>
                      <li>• Maximum file size: 5MB</li>
                      <li>• Square aspect ratio works best</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-secondary"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}