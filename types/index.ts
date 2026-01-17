// Database types matching your Supabase schema
export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  category: 'For Him' | 'For Her' | 'Unisex' | null
  image_url: string | null
  stock_quantity: number
  is_active: boolean
  created_at: string
  updated_at: string
  image_filename: string | null
  sku?: string
  featured?: boolean
}

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
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  created_at: string
  product?: Product
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  updated_at: string
  product?: Product
}

export interface UserProfile {
  id: string
  first_name: string | null
  last_name: string | null
  email?: string | null
  phone: string | null
  address: any
  role?: 'user' | 'admin'
  created_at: string
  updated_at: string
}

export interface ShippingAddress {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
}
