import { getFeatureFlags } from './feature-flags'
import * as firestore from './firestore-db'
import type { Product, Order, OrderItem, CartItem, UserProfile, ShippingAddress } from '@/types'
// Types placeholder
type ProductFormData = any
type CreateOrderData = any

const { useFirestore } = getFeatureFlags()

// Helper to get the appropriate implementation
const getImpl = () => firestore
const getOrdersImpl = () => firestore
const getAdminImpl = () => firestore

// Product functions (from supabase.ts)
export const getProducts = async (category?: string) => {
  const impl = getImpl()
  return impl.getProducts(category)
}

export const getProduct = async (id: string) => {
  const impl = getImpl()
  return impl.getProduct(id)
}

// Product management functions (from admin-db.ts)
export const getAllProducts = async (
  page = 1, 
  limit = 20, 
  category?: string, 
  search?: string
) => {
  const impl = getAdminImpl()
  return impl.getAllProducts(page, limit, category, search)
}

export const createProduct = async (productData: ProductFormData) => {
  const impl = getAdminImpl()
  return impl.createProduct(productData)
}

export const updateProduct = async (id: string, productData: Partial<ProductFormData>) => {
  const impl = getAdminImpl()
  return impl.updateProduct(id, productData)
}

export const deleteProduct = async (id: string) => {
  const impl = getAdminImpl()
  return impl.deleteProduct(id)
}

export const hardDeleteProduct = async (id: string) => {
  const impl = getAdminImpl()
  return impl.hardDeleteProduct(id)
}

// Order statistics (from admin-db.ts)
export const getOrderStats = async () => {
  const impl = getAdminImpl()
  return impl.getOrderStats()
}

// Recent orders (from admin-db.ts)
export const getRecentOrders = async (limit = 10) => {
  const impl = getAdminImpl()
  return impl.getRecentOrders(limit)
}

// Order functions (from orders.ts)
export const validateOrderData = async (orderData: CreateOrderData) => {
  const impl = getOrdersImpl()
  return impl.validateOrderData(orderData)
}

export const createOrder = async (orderData: CreateOrderData) => {
  const impl = getOrdersImpl()
  return impl.createOrder(orderData)
}

export const updateOrderStatus = async (
  orderId: string, 
  status: Order['status'], 
  paymentReference?: string
) => {
  const impl = getOrdersImpl()
  return impl.updateOrderStatus(orderId, status, paymentReference)
}

export const getUserOrders = async (userId: string) => {
  const impl = getOrdersImpl()
  return impl.getUserOrders(userId)
}

export const getOrderById = async (orderId: string, userId?: string) => {
  const impl = getOrdersImpl()
  return impl.getOrderById(orderId, userId)
}

export const getAllOrders = async (page = 1, limit = 20) => {
  const impl = getOrdersImpl()
  return impl.getAllOrders(page, limit)
}

// Cart functions
export const getCartItems = async (userId: string) => {
  const impl = getImpl()
  return impl.getCartItems(userId)
}

// User profile functions
export const getUserProfile = async (userId: string) => {
  const impl = getImpl()
  return impl.getUserProfile(userId)
}

// Re-export types for convenience
export type { Product, Order, OrderItem, CartItem, UserProfile, ShippingAddress }
export type { ProductFormData, CreateOrderData }