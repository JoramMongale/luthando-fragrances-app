import { storage } from './firebase'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

// Storage bucket configuration (Firebase Storage uses buckets, we'll use the default)
// Note: Firebase Storage uses paths, not buckets like Supabase
// The bucket is already configured in firebase.ts

// Allowed file types
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp'
]

// Max file size (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
  fileName?: string
}

// Upload image to Firebase Storage
export const uploadProductImage = async (
  file: File, 
  productId: string,
  existingFileName?: string
): Promise<UploadResult> => {
  try {
    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return {
        success: false,
        error: 'Invalid file type. Please upload JPG, PNG, or WebP images.'
      }
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: 'File too large. Please upload images smaller than 5MB.'
      }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${productId}_${Date.now()}.${fileExt}`
    const filePath = `products/${fileName}`

    // Delete existing image if provided
    if (existingFileName) {
      try {
        const existingRef = ref(storage, `products/${existingFileName}`)
        await deleteObject(existingRef)
      } catch (deleteError) {
        // Ignore errors if file doesn't exist
        console.log('Could not delete existing file (might not exist):', deleteError)
      }
    }

    // Upload new image
    const storageRef = ref(storage, filePath)
    await uploadBytes(storageRef, file, {
      cacheControl: 'public, max-age=3600'
    })

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef)

    return {
      success: true,
      url: downloadURL,
      fileName: fileName
    }

  } catch (error: any) {
    console.error('Firebase upload error:', error)
    return {
      success: false,
      error: error.message || 'Failed to upload image'
    }
  }
}

// Delete image from storage
export const deleteProductImage = async (fileName: string): Promise<boolean> => {
  try {
    const storageRef = ref(storage, `products/${fileName}`)
    await deleteObject(storageRef)
    return true
  } catch (error) {
    console.error('Firebase delete error:', error)
    return false
  }
}

// Get image URL from filename
export const getImageUrl = (fileName: string): string => {
  if (!fileName) return ''
  
  // Firebase Storage requires a reference to get a download URL
  // However, we can construct a public URL if the file is publicly accessible
  // But we need to use getDownloadURL which is async
  // For simplicity, we'll return an empty string and handle async elsewhere
  // Components that need the URL should call getDownloadURL directly
  // This function is kept for API compatibility but will return empty
  return ''
}

// Async version to get download URL
export const getImageUrlAsync = async (fileName: string): Promise<string> => {
  if (!fileName) return ''
  try {
    const storageRef = ref(storage, `products/${fileName}`)
    const url = await getDownloadURL(storageRef)
    return url
  } catch (error) {
    console.error('Error getting Firebase download URL:', error)
    return ''
  }
}

// Validate image dimensions (optional) - same as Supabase version
export const validateImageDimensions = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    
    img.onload = () => {
      URL.revokeObjectURL(url)
      // Minimum dimensions: 400x400, Maximum: 2000x2000
      const isValid = img.width >= 400 && img.height >= 400 && 
                     img.width <= 2000 && img.height <= 2000
      resolve(isValid)
    }
    
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(false)
    }
    
    img.src = url
  })
}

// Create optimized image preview
export const createImagePreview = (file: File): string => {
  return URL.createObjectURL(file)
}

// Cleanup preview URL
export const cleanupPreview = (previewUrl: string) => {
  URL.revokeObjectURL(previewUrl)
}