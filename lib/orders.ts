import { supabase } from './supabase'
import type { Order, OrderItem, ShippingAddress } from '@/types'

export interface CreateOrderData {
  user_id: string
  items: Array<{ product_id: string; quantity: number; price: number }>
  shipping_address?: ShippingAddress
  customer_notes?: string
}

export const createOrder = async (orderData: CreateOrderData) => {
  try {
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
