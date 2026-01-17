import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

// Initialize Firebase Admin SDK only on server side
if (getApps().length === 0) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "luthando-frangrances",
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "luthando-frangrances.firebasestorage.app"
    })
  } catch (error) {
    console.error('Firebase Admin initialization error:', error)
    // Don't throw in development - allow client-side to work
    if (process.env.NODE_ENV === 'production') {
      throw error
    }
  }
}

export const adminAuth = getAuth()
export const adminDb = getFirestore()
export const adminStorage = getStorage()

// Helper function to check if Admin SDK is initialized
export const isAdminInitialized = () => getApps().length > 0