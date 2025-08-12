import { supabase } from './supabase'
import type { Product } from '@/types'

// Product Management Functions
export interface ProductFormData {
  name: string
  description: string
  price: number
  category: 'For Him' | 'For Her' | 'Unisex'
  stock_quantity: number
  is_active: boolean
  image_url?: string
}

export const getAllProducts = async (page = 1, limit = 20, category?: string, search?: string) => {
  try {
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query.range(from, to)

    if (error) {
      console.error('Supabase error fetching products:', {
        message: error.message,
        details: error.details,
        code: error.code
      })
      throw new Error(error.message || 'Failed to fetch products')
    }

    return {
      data: data as Product[],
      error: null,
      totalCount: count || 0,
      totalPages: Math.ceil((count || 0) / limit)
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred while fetching products'
    
    return { 
      data: null, 
      error: { message: errorMessage }, 
      totalCount: 0, 
      totalPages: 0 
    }
  }
}

export const createProduct = async (productData: ProductFormData) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single()

    if (error) {
      console.error('Supabase error creating product:', {
        message: error.message,
        details: error.details,
        code: error.code
      })
      throw new Error(error.message || 'Failed to create product')
    }

    return { data, error: null }
  } catch (error) {
    console.error('Error creating product:', error)
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred while creating the product'
    
    return { 
      data: null, 
      error: { message: errorMessage }
    }
  }
}

export const updateProduct = async (id: string, productData: Partial<ProductFormData>) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({
        ...productData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error updating product:', {
        message: error.message,
        details: error.details,
        code: error.code
      })
      throw new Error(error.message || 'Failed to update product')
    }

    return { data, error: null }
  } catch (error) {
    console.error('Error updating product:', error)
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred while updating the product'
    
    return { 
      data: null, 
      error: { message: errorMessage }
    }
  }
}

export const deleteProduct = async (id: string) => {
  try {
    // Soft delete by setting is_active to false
    const { data, error } = await supabase
      .from('products')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error deleting product:', {
        message: error.message,
        details: error.details,
        code: error.code,
        hint: error.hint
      })
      throw new Error(error.message || `Failed to deactivate product: ${error.code || 'Unknown error'}`)
    }

    return { data, error: null }
  } catch (error) {
    console.error('Error deleting product:', error)
    
    // Ensure we return a proper error object with a message
    const errorMessage = error instanceof Error 
      ? error.message 
      : typeof error === 'string' 
        ? error 
        : 'An unknown error occurred while deactivating the product'
    
    return { 
      data: null, 
      error: { message: errorMessage }
    }
  }
}

// Alternative hard delete function if needed
export const hardDeleteProduct = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error hard deleting product:', {
        message: error.message,
        details: error.details,
        code: error.code
      })
      throw new Error(error.message || 'Failed to delete product')
    }

    return { data, error: null }
  } catch (error) {
    console.error('Error hard deleting product:', error)
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred while deleting the product'
    
    return { 
      data: null, 
      error: { message: errorMessage }
    }
  }
}

// Order Statistics
export const getOrderStats = async () => {
  try {
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')

    if (ordersError) {
      console.error('Error fetching orders for stats:', ordersError)
      throw new Error(ordersError.message || 'Failed to fetch order statistics')
    }

    const totalOrders = orders?.length || 0
    const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0
    const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0
    const completedOrders = orders?.filter(order => order.status === 'delivered').length || 0

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
      error: null
    }
  } catch (error) {
    console.error('Error fetching order stats:', error)
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to fetch order statistics'
    
    return {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      completedOrders: 0,
      error: { message: errorMessage }
    }
  }
}

// Recent Orders
export const getRecentOrders = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (name)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching recent orders:', error)
      throw new Error(error.message || 'Failed to fetch recent orders')
    }

    return { data, error: null }
  } catch (error) {
    console.error('Error fetching recent orders:', error)
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to fetch recent orders'
    
    return { 
      data: null, 
      error: { message: errorMessage }
    }
  }
}