export interface FeatureFlags {
  useFirebaseAuth: boolean
  useFirestore: boolean
  useFirebaseStorage: boolean
  useFirebaseEmulators: boolean
  firestoreBatchSize: number
}

export const getFeatureFlags = (): FeatureFlags => ({
  useFirebaseAuth: process.env.NEXT_PUBLIC_USE_FIREBASE_AUTH === 'true',
  useFirestore: process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true',
  useFirebaseStorage: process.env.NEXT_PUBLIC_USE_FIREBASE_STORAGE === 'true',
  useFirebaseEmulators: process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true',
  firestoreBatchSize: parseInt(process.env.NEXT_PUBLIC_FIRESTORE_BATCH_SIZE || '100', 10)
})

// Helper to get appropriate database client
export const getDatabaseClient = () => {
  return { type: 'firestore' as const, client: require('@/lib/firebase').db }
}

// Helper to get appropriate auth client
export const getAuthClient = () => {
  return { type: 'firebase' as const, client: require('@/lib/firebase').auth }
}

// Helper to get appropriate storage client
export const getStorageClient = () => {
  return { type: 'firebase' as const, client: require('@/lib/firebase').storage }
}