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
  const flags = getFeatureFlags()
  if (flags.useFirestore) {
    return { type: 'firestore' as const, client: require('@/lib/firebase').db }
  } else {
    return { type: 'supabase' as const, client: require('@/lib/supabase').supabase }
  }
}

// Helper to get appropriate auth client
export const getAuthClient = () => {
  const flags = getFeatureFlags()
  if (flags.useFirebaseAuth) {
    return { type: 'firebase' as const, client: require('@/lib/firebase').auth }
  } else {
    return { type: 'supabase' as const, client: require('@/lib/supabase').supabase.auth }
  }
}

// Helper to get appropriate storage client
export const getStorageClient = () => {
  const flags = getFeatureFlags()
  if (flags.useFirebaseStorage) {
    return { type: 'firebase' as const, client: require('@/lib/firebase').storage }
  } else {
    return { type: 'supabase' as const, client: require('@/lib/supabase').supabase.storage }
  }
}

// Check if migration is in progress
export const isMigrationInProgress = () => {
  const flags = getFeatureFlags()
  return flags.useFirebaseAuth || flags.useFirestore || flags.useFirebaseStorage
}

// Get current migration phase
export const getMigrationPhase = (): string => {
  const flags = getFeatureFlags()
  
  if (!flags.useFirebaseAuth && !flags.useFirestore && !flags.useFirebaseStorage) {
    return 'pre-migration'
  }
  
  if (flags.useFirebaseAuth && !flags.useFirestore && !flags.useFirebaseStorage) {
    return 'auth-migration'
  }
  
  if (flags.useFirebaseAuth && flags.useFirestore && !flags.useFirebaseStorage) {
    return 'database-migration'
  }
  
  if (flags.useFirebaseAuth && flags.useFirestore && flags.useFirebaseStorage) {
    return 'storage-migration'
  }
  
  return 'mixed-phase'
}