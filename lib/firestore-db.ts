import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentSnapshot,
  DocumentData,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore'
import { db } from './firebase'
import type { Product, Order, OrderItem, CartItem, UserProfile } from '../types'

// Helper to convert Firestore Timestamp to ISO string
const convertTimestamp = (timestamp: any): string => {
  if (timestamp?.toDate) {
    return timestamp.toDate().toISOString()
  }
  if (timestamp instanceof Date) {
    return timestamp.toISOString()
  }
  return timestamp || new Date().toISOString()
}

// Helper to convert Firestore document to typed object
const convertDocument = <T>(doc: DocumentSnapshot<DocumentData> | QueryDocumentSnapshot<DocumentData>): T => {
  const data = doc.data()
  if (!data) {
    throw new Error('Document data is undefined')
  }
  // Convert Timestamps to ISO strings
  const converted: any = { ...data }
  Object.keys(converted).forEach(key => {
    if (converted[key]?.toDate) {
      converted[key] = converted[key].toDate().toISOString()
    }
  })
  return { id: doc.id, ...converted } as T
}

// Product functions matching Supabase API
export const getProducts = async (category?: string) => {
  try {
    let q = query(
      collection(db, 'products'),
      where('is_active', '==', true)
    )
    
    if (category && category !== 'All') {
      q = query(q, where('category', '==', category))
    }
    
    q = query(q, orderBy('name'))
    
    const snapshot = await getDocs(q)
    const data = snapshot.docs.map(doc => convertDocument<Product>(doc))
    
    return { data, error: null }
  } catch (error) {
    console.error('Firestore getProducts error:', error)
    return { data: null, error }
  }
}

export const getProduct = async (id: string) => {
  try {
    const docRef = doc(db, 'products', id)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
      return { data: null, error: { message: 'Product not found' } }
    }
    
    const data = convertDocument<Product>(docSnap)
    return { data, error: null }
  } catch (error) {
    console.error('Firestore getProduct error:', error)
    return { data: null, error }
  }
}

// Product management functions (admin)
export const getAllProducts = async (
  page = 1, 
  limit = 20, 
  category?: string, 
  search?: string
) => {
  try {
    let q = query(collection(db, 'products'), orderBy('created_at', 'desc'))
    
    if (category && category !== 'all') {
      q = query(q, where('category', '==', category))
    }
    
    if (search) {
      // Firestore doesn't support partial string matching easily
      // We'll need to implement a different approach (like Algolia)
      // For now, we'll skip search filtering
      console.warn('Search filtering not implemented for Firestore')
    }
    
    const snapshot = await getDocs(q)
    const allData = snapshot.docs.map(doc => convertDocument<Product>(doc))
    
    // Client-side pagination (inefficient for large datasets)
    const from = (page - 1) * limit
    const to = from + limit
    const data = allData.slice(from, to)
    
    return {
      data,
      error: null,
      totalCount: allData.length,
      totalPages: Math.ceil(allData.length / limit)
    }
  } catch (error) {
    console.error('Firestore getAllProducts error:', error)
    return { 
      data: null, 
      error, 
      totalCount: 0, 
      totalPages: 0 
    }
  }
}

export const createProduct = async (productData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    })
    
    const docSnap = await getDoc(docRef)
    const data = convertDocument<Product>(docSnap)
    
    return { data, error: null }
  } catch (error) {
    console.error('Firestore createProduct error:', error)
    return { data: null, error }
  }
}

export const updateProduct = async (id: string, productData: Partial<any>) => {
  try {
    const docRef = doc(db, 'products', id)
    await updateDoc(docRef, {
      ...productData,
      updated_at: serverTimestamp()
    })
    
    const docSnap = await getDoc(docRef)
    const data = convertDocument<Product>(docSnap)
    
    return { data, error: null }
  } catch (error) {
    console.error('Firestore updateProduct error:', error)
    return { data: null, error }
  }
}

export const deleteProduct = async (id: string) => {
  try {
    // Soft delete - set is_active to false
    const docRef = doc(db, 'products', id)
    await updateDoc(docRef, {
      is_active: false,
      updated_at: serverTimestamp()
    })
    
    const docSnap = await getDoc(docRef)
    const data = convertDocument<Product>(docSnap)
    
    return { data, error: null }
  } catch (error) {
    console.error('Firestore deleteProduct error:', error)
    return { data: null, error }
  }
}

export const hardDeleteProduct = async (id: string) => {
  try {
    const docRef = doc(db, 'products', id)
    await deleteDoc(docRef)
    
    return { data: { id }, error: null }
  } catch (error) {
    console.error('Firestore hardDeleteProduct error:', error)
    return { data: null, error }
  }
}

// Order functions
export const createOrder = async (orderData: any) => {
  try {
    // First create the order
    const orderRef = await addDoc(collection(db, 'orders'), {
      user_id: orderData.user_id,
      total_amount: orderData.total_amount || 0,
      status: 'pending',
      payment_status: 'pending',
      payment_method: orderData.payment_method || 'payfast',
      shipping_address: orderData.shipping_address || null,
      customer_notes: orderData.customer_notes || null,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    })
    
    // Create order items
    const orderItems = orderData.items || []
    const itemPromises = orderItems.map((item: any) => 
      addDoc(collection(db, 'order_items'), {
        order_id: orderRef.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        created_at: serverTimestamp()
      })
    )
    
    await Promise.all(itemPromises)
    
    // Fetch the complete order with items
    const orderSnap = await getDoc(orderRef)
    const order = convertDocument<Order>(orderSnap)
    
    // Fetch order items separately (Firestore doesn't support joins)
    const itemsQuery = query(
      collection(db, 'order_items'),
      where('order_id', '==', orderRef.id)
    )
    const itemsSnapshot = await getDocs(itemsQuery)
    const order_items = itemsSnapshot.docs.map(doc => convertDocument<OrderItem>(doc))
    
    return { 
      order: { ...order, order_items }, 
      error: null 
    }
  } catch (error) {
    console.error('Firestore createOrder error:', error)
    return { order: null, error }
  }
}

export const getUserOrders = async (userId: string) => {
  try {
    const ordersQuery = query(
      collection(db, 'orders'),
      where('user_id', '==', userId),
      orderBy('created_at', 'desc')
    )
    
    const ordersSnapshot = await getDocs(ordersQuery)
    const orders = await Promise.all(
      ordersSnapshot.docs.map(async (orderDoc) => {
        const order = convertDocument<Order>(orderDoc)
        
        // Fetch order items for each order
        const itemsQuery = query(
          collection(db, 'order_items'),
          where('order_id', '==', orderDoc.id)
        )
        const itemsSnapshot = await getDocs(itemsQuery)
        const order_items = itemsSnapshot.docs.map(doc => convertDocument<OrderItem>(doc))
        
        // Fetch product details for each item
        const itemsWithProducts = await Promise.all(
          order_items.map(async (item) => {
            if (item.product_id) {
              const productDoc = await getDoc(doc(db, 'products', item.product_id))
              if (productDoc.exists()) {
                const product = convertDocument<Product>(productDoc)
                return { ...item, product }
              }
            }
            return item
          })
        )
        
        return { ...order, order_items: itemsWithProducts }
      })
    )
    
    return { data: orders, error: null }
  } catch (error) {
    console.error('Firestore getUserOrders error:', error)
    return { data: null, error }
  }
}

export const getOrderById = async (orderId: string, userId?: string) => {
  try {
    const orderDoc = await getDoc(doc(db, 'orders', orderId))
    
    if (!orderDoc.exists()) {
      return { data: null, error: { message: 'Order not found' } }
    }
    
    const order = convertDocument<Order>(orderDoc)
    
    // Check if order belongs to user (if userId provided)
    if (userId && order.user_id !== userId) {
      return { data: null, error: { message: 'Access denied' } }
    }
    
    // Fetch order items
    const itemsQuery = query(
      collection(db, 'order_items'),
      where('order_id', '==', orderId)
    )
    const itemsSnapshot = await getDocs(itemsQuery)
    const order_items = await Promise.all(
      itemsSnapshot.docs.map(async (itemDoc) => {
        const item = convertDocument<OrderItem>(itemDoc)
        if (item.product_id) {
          const productDoc = await getDoc(doc(db, 'products', item.product_id))
          if (productDoc.exists()) {
            const product = convertDocument<Product>(productDoc)
            return { ...item, product }
          }
        }
        return item
      })
    )
    
    return { data: { ...order, order_items }, error: null }
  } catch (error) {
    console.error('Firestore getOrderById error:', error)
    return { data: null, error }
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
      updated_at: serverTimestamp()
    }
    
    if (status === 'paid') {
      updateData.payment_status = 'paid'
      if (paymentReference) {
        updateData.payment_reference = paymentReference
      }
    } else if (status === 'cancelled') {
      updateData.payment_status = 'failed'
    }
    
    const orderRef = doc(db, 'orders', orderId)
    await updateDoc(orderRef, updateData)
    
    const orderDoc = await getDoc(orderRef)
    const data = convertDocument<Order>(orderDoc)
    
    return { data, error: null }
  } catch (error) {
    console.error('Firestore updateOrderStatus error:', error)
    return { data: null, error }
  }
}

export const getRecentOrders = async (limit: number = 10) => {
  try {
    const ordersQuery = query(
      collection(db, 'orders'),
      orderBy('created_at', 'desc'),
      firestoreLimit(limit)
    )
    
    const ordersSnapshot = await getDocs(ordersQuery)
    const orders = await Promise.all(
      ordersSnapshot.docs.map(async (orderDoc) => {
        const order = convertDocument<Order>(orderDoc)
        
        // Fetch order items
        const itemsQuery = query(
          collection(db, 'order_items'),
          where('order_id', '==', orderDoc.id)
        )
        const itemsSnapshot = await getDocs(itemsQuery)
        const order_items = itemsSnapshot.docs.map(doc => convertDocument<OrderItem>(doc))
        
        // Fetch product names for display
        const itemsWithProducts = await Promise.all(
          order_items.map(async (item) => {
            if (item.product_id) {
              const productDoc = await getDoc(doc(db, 'products', item.product_id))
              if (productDoc.exists()) {
                const product = convertDocument<Product>(productDoc)
                return { ...item, product }
              }
            }
            return item
          })
        )
        
        return { ...order, order_items: itemsWithProducts }
      })
    )
    
    return { data: orders, error: null }
  } catch (error) {
    console.error('Firestore getRecentOrders error:', error)
    return { data: null, error }
  }
}

export const getAllOrders = async (page = 1, limit = 20) => {
  try {
    const ordersQuery = query(
      collection(db, 'orders'),
      orderBy('created_at', 'desc')
    )
    
    const ordersSnapshot = await getDocs(ordersQuery)
    const allOrders = await Promise.all(
      ordersSnapshot.docs.map(async (orderDoc) => {
        const order = convertDocument<Order>(orderDoc)
        
        // Fetch order items (just count for listing)
        const itemsQuery = query(
          collection(db, 'order_items'),
          where('order_id', '==', orderDoc.id)
        )
        const itemsSnapshot = await getDocs(itemsQuery)
        const itemCount = itemsSnapshot.size
        
        return { ...order, item_count: itemCount }
      })
    )
    
    // Client-side pagination
    const from = (page - 1) * limit
    const to = from + limit
    const data = allOrders.slice(from, to)
    
    return { 
      data, 
      error: null, 
      totalPages: Math.ceil(allOrders.length / limit), 
      currentPage: page 
    }
  } catch (error) {
    console.error('Firestore getAllOrders error:', error)
    return { 
      data: null, 
      error, 
      totalPages: 0, 
      currentPage: page 
    }
  }
}

// Order statistics
export const getOrderStats = async () => {
  try {
    const ordersQuery = query(collection(db, 'orders'))
    const ordersSnapshot = await getDocs(ordersQuery)
    const orders = ordersSnapshot.docs.map(doc => convertDocument<Order>(doc))
    
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0)
    const pendingOrders = orders.filter(order => order.status === 'pending').length
    const completedOrders = orders.filter(order => order.status === 'delivered').length
    
    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
      error: null
    }
  } catch (error) {
    console.error('Firestore getOrderStats error:', error)
    return {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      completedOrders: 0,
      error
    }
  }
}

// Cart functions (if needed)
export const getCartItems = async (userId: string) => {
  try {
    const cartQuery = query(
      collection(db, 'cart_items'),
      where('user_id', '==', userId)
    )
    
    const snapshot = await getDocs(cartQuery)
    const cartItems = await Promise.all(
      snapshot.docs.map(async (cartDoc) => {
        const item = convertDocument<CartItem>(cartDoc)
        if (item.product_id) {
          const productDoc = await getDoc(doc(db, 'products', item.product_id))
          if (productDoc.exists()) {
            const product = convertDocument<Product>(productDoc)
            return { ...item, product }
          }
        }
        return item
      })
    )
    
    return { data: cartItems, error: null }
  } catch (error) {
    console.error('Firestore getCartItems error:', error)
    return { data: null, error }
  }
}

// Order validation
export const validateOrderData = async (orderData: any) => {
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
    try {
      const productDoc = await getDoc(doc(db, 'products', item.product_id))
      if (!productDoc.exists()) {
        errors.push(`Product ${item.product_id} is not available`)
      } else {
        const product = convertDocument<Product>(productDoc)
        if (!product.is_active) {
          errors.push(`Product ${item.product_id} is not active`)
        } else if (product.stock_quantity < item.quantity) {
          errors.push(`Insufficient stock for product ${item.product_id}`)
        }
      }
    } catch (error) {
      errors.push(`Error checking product ${item.product_id}`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// User profile functions
export const getUserProfile = async (userId: string) => {
  try {
    const profileDoc = await getDoc(doc(db, 'user_profiles', userId))
    
    if (!profileDoc.exists()) {
      return { data: null, error: { message: 'Profile not found' } }
    }
    
    const data = convertDocument<UserProfile>(profileDoc)
    return { data, error: null }
  } catch (error) {
    console.error('Firestore getUserProfile error:', error)
    return { data: null, error }
  }
}