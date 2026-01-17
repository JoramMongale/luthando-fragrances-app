import { storage } from './firebase'
import { ref, listAll, getMetadata } from 'firebase/storage'

// List all product images in the products folder
export const listProductImages = async () => {
  try {
    const listRef = ref(storage, 'products')
    const res = await listAll(listRef)
    
    const files = await Promise.all(
      res.items.map(async (itemRef) => {
        const metadata = await getMetadata(itemRef)
        return {
          name: itemRef.name,
          metadata: {
            size: metadata.size,
            contentType: metadata.contentType,
            updated: metadata.updated
          }
        }
      })
    )
    
    return { data: files, error: null }
  } catch (error: any) {
    console.error('Error listing product images:', error)
    return { data: null, error: error.message || 'Failed to list images' }
  }
}

// Get storage statistics
export const getStorageStats = async () => {
  try {
    const listRef = ref(storage, 'products')
    const res = await listAll(listRef)
    
    let totalSize = 0
    const items = res.items
    
    for (const itemRef of items) {
      const metadata = await getMetadata(itemRef)
      totalSize += metadata.size || 0
    }
    
    return {
      totalFiles: items.length,
      totalSize
    }
  } catch (error: any) {
    console.error('Error getting storage stats:', error)
    return { totalFiles: 0, totalSize: 0 }
  }
}

// Cleanup unused images (stub - implement later)
export const cleanupUnusedImages = async () => {
  // For now, just return empty result
  console.log('Cleanup unused images not implemented for Firebase yet')
  return { deleted: 0, errors: [] }
}

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}