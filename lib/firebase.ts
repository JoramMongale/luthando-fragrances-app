import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAL0vzZxam1n75IgMQDV470ZAft6g_J-aE",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "luthando-frangrances.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "luthando-frangrances",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "luthando-frangrances.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "708572342653",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:708572342653:web:b8a2d29298c1a789598414",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-YM0XWDZGCZ"
}

// Initialize Firebase
// @ts-ignore - Firebase type issues
const apps = getApps()
// @ts-ignore - Firebase type issues  
const app = apps.length === 0 ? initializeApp(firebaseConfig) : apps[0]

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
// @ts-ignore - window check for SSR
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null

export default app