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

    if (error) throw error

    return {
      data: data as Product[],
      error: null,
      totalCount: count || 0,
      totalPages: Math.ceil((count || 0) / limit)
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return { data: null, error, totalCount: 0, totalPages: 0 }
  }
}

export const createProduct = async (productData: ProductFormData) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error creating product:', error)
    return { data: null, error }
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

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error updating product:', error)
    return { data: null, error }
  }
}

export const deleteProduct = async (id: string) => {
  try {
    // Soft delete by setting is_active to false
    const { data, error } = await supabase
      .from('products')
      .update({ is_active: false })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error deleting product:', error)
    return { data: null, error }
  }
}

// Order Statistics
export const getOrderStats = async () => {
  try {
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')

    if (ordersError) throw ordersError

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
    return {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      completedOrders: 0,
      error
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

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching recent orders:', error)
    return { data: null, error }
  }
}
