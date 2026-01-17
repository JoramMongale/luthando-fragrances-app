import { createClient } from '@supabase/supabase-js'
import type { Product, Order, OrderItem, CartItem, UserProfile } from '@/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Product functions
export const getProducts = async (category?: string) => {
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (category && category !== 'All') {
    query = query.eq('category', category)
  }

  const { data, error } = await query
  return { data: data as Product[] | null, error }
}

export const getProduct = async (id: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  
  return { data: data as Product | null, error }
}

// Cart functions
export const getCartItems = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products (*)
      `)
      .eq('user_id', userId)
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error) {
    console.error('Supabase getCartItems error:', error)
    return { data: null, error }
  }
}

// User profile functions
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error) {
    console.error('Supabase getUserProfile error:', error)
    return { data: null, error }
  }
}
