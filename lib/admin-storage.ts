import { supabase } from './supabase'
import { STORAGE_BUCKET } from './storage'

// List all images in the product storage bucket
export const listProductImages = async () => {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list('products', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      })

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error listing images:', error)
    return { data: null, error }
  }
}

// Get storage statistics
export const getStorageStats = async () => {
  try {
    const { data: files } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list('products')

    if (!files) return { totalFiles: 0, totalSize: 0 }

    const totalFiles = files.length
    const totalSize = files.reduce((sum, file) => sum + (file.metadata?.size || 0), 0)

    return { totalFiles, totalSize }
  } catch (error) {
    console.error('Error getting storage stats:', error)
    return { totalFiles: 0, totalSize: 0 }
  }
}

// Clean up unused images (images not referenced by any product)
export const cleanupUnusedImages = async () => {
  try {
    // Get all product image URLs
    const { data: products } = await supabase
      .from('products')
      .select('image_filename')
      .not('image_filename', 'is', null)

    const usedFilenames = new Set(
      products?.map(p => p.image_filename).filter(Boolean) || []
    )

    // Get all storage files
    const { data: files } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list('products')

    if (!files) return { deleted: 0, errors: [] }

    // Find unused files
    const unusedFiles = files.filter(file => !usedFilenames.has(file.name))
    
    if (unusedFiles.length === 0) {
      return { deleted: 0, errors: [] }
    }

    // Delete unused files
    const filePaths = unusedFiles.map(file => `products/${file.name}`)
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove(filePaths)

    if (error) throw error

    return { 
      deleted: unusedFiles.length, 
      errors: [],
      deletedFiles: unusedFiles.map(f => f.name)
    }
  } catch (error) {
    console.error('Error cleaning up images:', error)
    return { deleted: 0, errors: [error] }
  }
}

// Convert bytes to human readable format
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
