import { supabase } from './supabase'

// Storage bucket configuration
export const STORAGE_BUCKET = 'product-images'

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

// Upload image to Supabase Storage
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
      await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([`products/${existingFileName}`])
    }

    // Upload new image
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      throw uploadError
    }

    // Get public URL
    const { data } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath)

    return {
      success: true,
      url: data.publicUrl,
      fileName: fileName
    }

  } catch (error: any) {
    console.error('Upload error:', error)
    return {
      success: false,
      error: error.message || 'Failed to upload image'
    }
  }
}

// Delete image from storage
export const deleteProductImage = async (fileName: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([`products/${fileName}`])

    if (error) throw error
    return true
  } catch (error) {
    console.error('Delete error:', error)
    return false
  }
}

// Get image URL from filename
export const getImageUrl = (fileName: string): string => {
  if (!fileName) return ''
  
  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(`products/${fileName}`)
    
  return data.publicUrl
}

// Validate image dimensions (optional)
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
