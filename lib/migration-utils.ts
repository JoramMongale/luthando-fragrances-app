import { getFeatureFlags } from './feature-flags'
import { supabase } from './supabase'
import { db, auth, storage } from './firebase'
import { adminDb, adminAuth, adminStorage } from './firebase-admin'
import type { Product, Order, OrderItem, UserProfile } from '@/types'

export interface MigrationResult {
  success: boolean
  migratedCount: number
  errorCount: number
  errors: Array<{ id: string; error: string }>
  duration: number
}

export interface MigrationConfig {
  batchSize: number
  validateEachBatch: boolean
  stopOnError: boolean
  logProgress: boolean
}

// Default migration configuration
export const defaultMigrationConfig: MigrationConfig = {
  batchSize: 100,
  validateEachBatch: true,
  stopOnError: false,
  logProgress: true
}

// Migration status tracking
export interface MigrationStatus {
  phase: string
  startedAt: Date
  completedAt?: Date
  totalRecords: number
  migratedRecords: number
  failedRecords: number
  status: 'pending' | 'in-progress' | 'completed' | 'failed'
}

// Product migration
export async function migrateProducts(config: MigrationConfig = defaultMigrationConfig): Promise<MigrationResult> {
  const startTime = Date.now()
  const result: MigrationResult = {
    success: false,
    migratedCount: 0,
    errorCount: 0,
    errors: [],
    duration: 0
  }

  try {
    // Get products from Supabase
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)

    if (error) throw error
    if (!products) return result

    // Migrate in batches
    for (let i = 0; i < products.length; i += config.batchSize) {
      const batch = products.slice(i, i + config.batchSize)
      
      for (const product of batch) {
        try {
          // Convert Supabase product to Firestore format
          const firestoreProduct = {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            imageUrl: product.image_url,
            isActive: product.is_active,
            stockQuantity: product.stock_quantity,
            createdAt: product.created_at,
            updatedAt: product.updated_at
          }

          // Write to Firestore
          await adminDb.collection('products').doc(product.id).set(firestoreProduct)
          
          result.migratedCount++
          
          if (config.logProgress) {
            console.log(`Migrated product: ${product.name} (${product.id})`)
          }
        } catch (error: any) {
          result.errorCount++
          result.errors.push({
            id: product.id,
            error: error.message
          })
          
          if (config.stopOnError) throw error
        }
      }
    }

    result.success = true
  } catch (error: any) {
    result.errors.push({
      id: 'global',
      error: error.message
    })
  }

  result.duration = Date.now() - startTime
  return result
}

// User migration
export async function migrateUsers(config: MigrationConfig = defaultMigrationConfig): Promise<MigrationResult> {
  const startTime = Date.now()
  const result: MigrationResult = {
    success: false,
    migratedCount: 0,
    errorCount: 0,
    errors: [],
    duration: 0
  }

  try {
    // Get users from Supabase Auth (via user_profiles table)
    const { data: userProfiles, error } = await supabase
      .from('user_profiles')
      .select('*')

    if (error) throw error
    if (!userProfiles) return result

    for (const profile of userProfiles) {
      try {
        // Create user in Firebase Auth
        const userRecord = await adminAuth.createUser({
          uid: profile.id,
          email: profile.email,
          emailVerified: false,
          disabled: false
        })

        // Create user profile in Firestore
        await adminDb.collection('users').doc(profile.id).set({
          id: profile.id,
          email: profile.email,
          createdAt: profile.created_at,
          updatedAt: profile.updated_at,
          lastLogin: null
        })

        // Create user profile document
        await adminDb.collection('user_profiles').doc(profile.id).set({
          id: profile.id,
          email: profile.email,
          firstName: profile.first_name,
          lastName: profile.last_name,
          phone: profile.phone,
          address: profile.address,
          createdAt: profile.created_at,
          updatedAt: profile.updated_at
        })

        result.migratedCount++
        
        if (config.logProgress) {
          console.log(`Migrated user: ${profile.email} (${profile.id})`)
        }
      } catch (error: any) {
        result.errorCount++
        result.errors.push({
          id: profile.id,
          error: error.message
        })
        
        if (config.stopOnError) throw error
      }
    }

    result.success = true
  } catch (error: any) {
    result.errors.push({
      id: 'global',
      error: error.message
    })
  }

  result.duration = Date.now() - startTime
  return result
}

// Order migration
export async function migrateOrders(config: MigrationConfig = defaultMigrationConfig): Promise<MigrationResult> {
  const startTime = Date.now()
  const result: MigrationResult = {
    success: false,
    migratedCount: 0,
    errorCount: 0,
    errors: [],
    duration: 0
  }

  try {
    // Get orders with items from Supabase
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        )
      `)

    if (error) throw error
    if (!orders) return result

    for (const order of orders) {
      try {
        // Convert order to Firestore format
        const firestoreOrder = {
          id: order.id,
          userId: order.user_id,
          totalAmount: order.total_amount,
          status: order.status,
          paymentStatus: order.payment_status,
          paymentReference: order.payment_reference,
          paymentMethod: order.payment_method,
          shippingAddress: order.shipping_address,
          customerNotes: order.customer_notes,
          createdAt: order.created_at,
          updatedAt: order.updated_at
        }

        // Write order to Firestore
        await adminDb.collection('orders').doc(order.id).set(firestoreOrder)

        // Migrate order items (as subcollection)
        if (order.order_items && Array.isArray(order.order_items)) {
          for (const item of order.order_items) {
            const firestoreItem = {
              id: item.id,
              productId: item.product_id,
              quantity: item.quantity,
              price: item.price,
              productName: item.product?.name || 'Unknown Product'
            }

            await adminDb.collection('orders').doc(order.id).collection('items').doc(item.id).set(firestoreItem)
          }
        }

        result.migratedCount++
        
        if (config.logProgress) {
          console.log(`Migrated order: ${order.id} for user ${order.user_id}`)
        }
      } catch (error: any) {
        result.errorCount++
        result.errors.push({
          id: order.id,
          error: error.message
        })
        
        if (config.stopOnError) throw error
      }
    }

    result.success = true
  } catch (error: any) {
    result.errors.push({
      id: 'global',
      error: error.message
    })
  }

  result.duration = Date.now() - startTime
  return result
}

// Validation functions
export async function validateMigration(): Promise<{
  products: { supabase: number; firestore: number; match: boolean }
  users: { supabase: number; firestore: number; match: boolean }
  orders: { supabase: number; firestore: number; match: boolean }
}> {
  // Get counts from Supabase
  const [productsSupabase, usersSupabase, ordersSupabase] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true })
  ])

  // Get counts from Firestore
  const [productsFirestore, usersFirestore, ordersFirestore] = await Promise.all([
    adminDb.collection('products').count().get(),
    adminDb.collection('users').count().get(),
    adminDb.collection('orders').count().get()
  ])

  return {
    products: {
      supabase: productsSupabase.count || 0,
      firestore: productsFirestore.data().count,
      match: (productsSupabase.count || 0) === productsFirestore.data().count
    },
    users: {
      supabase: usersSupabase.count || 0,
      firestore: usersFirestore.data().count,
      match: (usersSupabase.count || 0) === usersFirestore.data().count
    },
    orders: {
      supabase: ordersSupabase.count || 0,
      firestore: ordersFirestore.data().count,
      match: (ordersSupabase.count || 0) === ordersFirestore.data().count
    }
  }
}

// Dual write helper (for transition period)
export async function dualWrite<T>(
  supabaseOperation: () => Promise<T>,
  firestoreOperation: () => Promise<T>,
  useFirestore: boolean = getFeatureFlags().useFirestore
): Promise<T> {
  try {
    // Always write to Supabase during transition
    const supabaseResult = await supabaseOperation()
    
    // Write to Firestore if enabled
    if (useFirestore) {
      try {
        await firestoreOperation()
      } catch (firestoreError) {
        console.error('Firestore write failed (continuing with Supabase):', firestoreError)
        // Don't fail the operation if Firestore write fails
      }
    }
    
    return supabaseResult
  } catch (error) {
    console.error('Dual write failed:', error)
    throw error
  }
}