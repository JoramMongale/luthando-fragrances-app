import { getFeatureFlags } from './feature-flags'
import * as supabaseStorage from './storage'
import * as firebaseStorage from './firebase-storage'

const { useFirebaseStorage } = getFeatureFlags()

// Helper to get the appropriate implementation
const getImpl = () => useFirebaseStorage ? firebaseStorage : supabaseStorage

// Re-export constants
export const ALLOWED_FILE_TYPES = getImpl().ALLOWED_FILE_TYPES
export const MAX_FILE_SIZE = getImpl().MAX_FILE_SIZE

// Export interface
export interface UploadResult {
  success: boolean
  url?: string
  error?: string
  fileName?: string
}

// Unified functions
export const uploadProductImage = async (
  file: File, 
  productId: string,
  existingFileName?: string
): Promise<UploadResult> => {
  const impl = getImpl()
  return impl.uploadProductImage(file, productId, existingFileName)
}

export const deleteProductImage = async (fileName: string): Promise<boolean> => {
  const impl = getImpl()
  return impl.deleteProductImage(fileName)
}

export const getImageUrl = (fileName: string): string => {
  const impl = getImpl()
  // If using Firebase, we need to handle async differently
  // For compatibility, return empty string and components should use getImageUrlAsync
  if (useFirebaseStorage) {
    return '' // Firebase requires async call
  }
  return impl.getImageUrl(fileName)
}

// Async version for Firebase compatibility
export const getImageUrlAsync = async (fileName: string): Promise<string> => {
  const impl = getImpl()
  if (useFirebaseStorage && 'getImageUrlAsync' in impl) {
    return (impl as any).getImageUrlAsync(fileName)
  }
  // For Supabase, getImageUrl is synchronous
  return impl.getImageUrl(fileName)
}

export const validateImageDimensions = (file: File): Promise<boolean> => {
  const impl = getImpl()
  return impl.validateImageDimensions(file)
}

export const createImagePreview = (file: File): string => {
  const impl = getImpl()
  return impl.createImagePreview(file)
}

export const cleanupPreview = (previewUrl: string) => {
  const impl = getImpl()
  return impl.cleanupPreview(previewUrl)
}