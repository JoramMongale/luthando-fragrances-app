import { supabase } from './supabase'

export interface Order {
  id: string
  user_id: string
  total_amount: number
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_method: string | null
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  payment_reference: string | null
  shipping_address: ShippingAddress | null
  customer_notes: string | null
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  created_at: string
  product?: any
}

export interface ShippingAddress {
  firstName: string
  lastName: string
  address: string
  city: string
  postalCode: string
  phone: string
  email?: string
}

export interface CreateOrderData {
  user_id: string
  items: Array<{ product_id: string; quantity: number; price: number }>
  shipping_address?: ShippingAddress
  customer_notes?: string
}

// Validate order data before creation
export const validateOrderData = async (orderData: CreateOrderData) => {
  const errors: string[] = []

  // Validate user exists
  if (!orderData.user_id) {
    errors.push('User ID is required')
  }

  // Validate items
  if (!orderData.items || orderData.items.length === 0) {
    errors.push('Order must contain at least one item')
  }

  // Validate each item
  for (const item of orderData.items) {
    if (!item.product_id) {
      errors.push('Product ID is required for all items')
    }
    if (!item.quantity || item.quantity <= 0) {
      errors.push('Item quantity must be greater than 0')
    }
    if (!item.price || item.price <= 0) {
      errors.push('Item price must be greater than 0')
    }

    // Check if product exists and is active
    const { data: product, error } = await supabase
      .from('products')
      .select('id, is_active, stock_quantity')
      .eq('id', item.product_id)
      .eq('is_active', true)
      .single()

    if (error || !product) {
      errors.push(`Product ${item.product_id} is not available`)
    } else if (product.stock_quantity < item.quantity) {
      errors.push(`Insufficient stock for product ${item.product_id}`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const createOrder = async (orderData: CreateOrderData) => {
  try {
    // Validate order data
    const validation = await validateOrderData(orderData)
    if (!validation.isValid) {
      return { 
        order: null, 
        error: { message: validation.errors.join(', ') }
      }
    }

    // Calculate total
    const total_amount = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: orderData.user_id,
        total_amount,
        status: 'pending',
        payment_status: 'pending',
        payment_method: 'payfast',
        shipping_address: orderData.shipping_address,
        customer_notes: orderData.customer_notes,
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Create order items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    return { order, error: null }
  } catch (error) {
    console.error('Create order error:', error)
    return { order: null, error }
  }
}

export const updateOrderStatus = async (
  orderId: string, 
  status: Order['status'], 
  paymentReference?: string
) => {
  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    }

    if (status === 'paid') {
      updateData.payment_status = 'paid'
      if (paymentReference) {
        updateData.payment_reference = paymentReference
      }
    } else if (status === 'cancelled') {
      updateData.payment_status = 'failed'
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Update order status error:', error)
    return { data: null, error }
  }
}

export const getUserOrders = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Get user orders error:', error)
    return { data: null, error }
  }
}

export const getOrderById = async (orderId: string, userId?: string) => {
  try {
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        )
      `)
      .eq('id', orderId)

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query.single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Get order by ID error:', error)
    return { data: null, error }
  }
}

// Get recent orders for admin dashboard
export const getRecentOrders = async (limit: number = 10) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Get recent orders error:', error)
    return { data: null, error }
  }
}

// Get all orders for admin (with pagination)
export const getAllOrders = async (page = 1, limit = 20) => {
  try {
    const offset = (page - 1) * limit

    const { data, error, count } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    const totalPages = Math.ceil((count || 0) / limit)

    return { data, error: null, totalPages, currentPage: page }
  } catch (error) {
    console.error('Get all orders error:', error)
    return { data: null, error, totalPages: 0, currentPage: page }
  }
}
