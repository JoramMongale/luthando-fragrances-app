import { supabase } from './supabase'

export const STORAGE_BUCKET = 'product-images'

export const uploadProductImage = async (
  file: File,
  productId: string
): Promise<{ url: string | null; error: any }> => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${productId}_${Date.now()}.${fileExt}`
    const filePath = `products/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath)

    return { url: data.publicUrl, error: null }
  } catch (error) {
    console.error('Upload error:', error)
    return { url: null, error }
  }
}

export const deleteProductImage = async (imageUrl: string): Promise<boolean> => {
  try {
    if (!imageUrl) return true
    
    // Extract file path from URL
    const urlParts = imageUrl.split('/storage/v1/object/public/product-images/')
    if (urlParts.length < 2) return false
    
    const filePath = urlParts[1]
    
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath])

    if (error) throw error
    return true
  } catch (error) {
    console.error('Delete error:', error)
    return false
  }
}
