# Environment Configuration for Firebase Migration

## Overview
This document outlines the environment variables and configuration needed for the Supabase to Firebase migration. The configuration supports dual operation during migration with feature flags.

## Environment Variables

### Base Configuration (.env.local)
```bash
# ============================================
# SUPABASE CONFIGURATION (Existing - Keep during migration)
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://lidkzzqbtomofastzusb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZGt6enFidG9tb2Zhc3R6dXNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMDQwMzgsImV4cCI6MjA2ODg4MDAzOH0.wguzp6xbonilWeFRE1OaKPNwwPq-4MxraL1xXGBSS4I

# ============================================
# FIREBASE CONFIGURATION (New)
# ============================================
# Get these from Firebase Console → Project Settings → General → Your apps → Web app
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=luthando-fragrances-xxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=luthando-fragrances-xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=luthando-fragrances-xxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABCDEF1234

# Firebase Admin SDK (Server-side only - from Service Account JSON)
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxx@luthando-fragrances-xxx.iam.gserviceaccount.com

# ============================================
# MIGRATION FEATURE FLAGS
# ============================================
# Phase 2: Authentication Migration
NEXT_PUBLIC_USE_FIREBASE_AUTH=false  # Set to true when ready to use Firebase Auth

# Phase 3: Database Migration  
NEXT_PUBLIC_USE_FIRESTORE=false      # Set to true when ready to use Firestore
NEXT_PUBLIC_FIRESTORE_BATCH_SIZE=100 # Records per batch for migration

# Phase 4: Storage Migration
NEXT_PUBLIC_USE_FIREBASE_STORAGE=false # Set to true when ready to use Firebase Storage

# ============================================
# BUSINESS CONFIGURATION (Existing)
# ============================================
NEXT_PUBLIC_BUSINESS_NAME=Luthando Fragrances
NEXT_PUBLIC_WHATSAPP_NUMBER=27742961451
NEXT_PUBLIC_ADMIN_EMAIL=jorammongale@outlook.com

# ============================================
# PAYFAST PAYMENT CONFIGURATION (Existing)
# ============================================
NEXT_PUBLIC_PAYFAST_MERCHANT_ID=31286465
NEXT_PUBLIC_PAYFAST_MERCHANT_KEY=xrldb1t1n9tdn
PAYFAST_PASSPHRASE=payment-1TSHOLO
NEXT_PUBLIC_PAYFAST_SANDBOX=false

# ============================================
# APPLICATION URL
# ============================================
NEXT_PUBLIC_APP_URL=https://luthando-fragrances-7xob8z0xg-jorams-projects-1705f30c.vercel.app/
```

## Environment-Specific Configurations

### Development (.env.development.local)
```bash
# Development-specific overrides
NEXT_PUBLIC_USE_FIREBASE_AUTH=true  # Enable Firebase Auth in dev
NEXT_PUBLIC_USE_FIRESTORE=true      # Enable Firestore in dev
NEXT_PUBLIC_USE_FIREBASE_STORAGE=true # Enable Firebase Storage in dev

# Use Firebase Emulators for local development
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true
FIRESTORE_EMULATOR_HOST=localhost:8080
FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
FIREBASE_STORAGE_EMULATOR_HOST=localhost:9199
```

### Production (.env.production)
```bash
# Production configuration (minimal changes)
# Feature flags controlled via Vercel environment variables
NEXT_PUBLIC_USE_FIREBASE_AUTH=false  # Controlled via deployment
NEXT_PUBLIC_USE_FIRESTORE=false      # Controlled via deployment
NEXT_PUBLIC_USE_FIREBASE_STORAGE=false # Controlled via deployment

# Ensure production URLs
NEXT_PUBLIC_APP_URL=https://luthando-fragrances.vercel.app/
```

### Testing (.env.test)
```bash
# Test environment configuration
NEXT_PUBLIC_USE_FIREBASE_AUTH=true
NEXT_PUBLIC_USE_FIRESTORE=true
NEXT_PUBLIC_USE_FIREBASE_STORAGE=true

# Use test Firebase project
NEXT_PUBLIC_FIREBASE_PROJECT_ID=luthando-fragrances-test

# Mock services for testing
NEXT_PUBLIC_MOCK_PAYMENTS=true
```

## Firebase Service Account Configuration

### Service Account JSON Structure
The Firebase Admin SDK requires a service account JSON file. Extract these values:

```json
{
  "type": "service_account",
  "project_id": "luthando-fragrances-xxx",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VNUrtP...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-abc123@luthando-fragrances-xxx.iam.gserviceaccount.com",
  "client_id": "123456789012345678901",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-abc123%40luthando-fragrances-xxx.iam.gserviceaccount.com"
}
```

### Environment Variable Mapping
- `FIREBASE_ADMIN_PRIVATE_KEY`: The `private_key` value (with `\n` preserved)
- `FIREBASE_ADMIN_CLIENT_EMAIL`: The `client_email` value

## Feature Flag Implementation

### TypeScript Types
```typescript
// lib/feature-flags.ts
export interface FeatureFlags {
  useFirebaseAuth: boolean
  useFirestore: boolean
  useFirebaseStorage: boolean
  useFirebaseEmulators: boolean
}

export const getFeatureFlags = (): FeatureFlags => ({
  useFirebaseAuth: process.env.NEXT_PUBLIC_USE_FIREBASE_AUTH === 'true',
  useFirestore: process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true',
  useFirebaseStorage: process.env.NEXT_PUBLIC_USE_FIREBASE_STORAGE === 'true',
  useFirebaseEmulators: process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true',
})
```

### Usage in Code
```typescript
// Example: Database client selection
import { getFeatureFlags } from '@/lib/feature-flags'
import { supabase } from '@/lib/supabase'
import { db as firestoreDb } from '@/lib/firebase'

const flags = getFeatureFlags()

export const getDatabaseClient = () => {
  return flags.useFirestore ? firestoreDb : supabase
}

// Example: Auth provider selection
export const getAuthProvider = () => {
  return flags.useFirebaseAuth ? 'firebase' : 'supabase'
}
```

## Vercel Deployment Configuration

### Project Settings → Environment Variables
Add these variables in Vercel dashboard:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSy...` | Production, Preview |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `luthando-fragrances-xxx.firebaseapp.com` | Production, Preview |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `luthando-fragrances-xxx` | Production, Preview |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `luthando-fragrances-xxx.appspot.com` | Production, Preview |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `123456789012` | Production, Preview |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:123456789012:web:abcdef1234567890` | Production, Preview |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | `G-ABCDEF1234` | Production, Preview |
| `FIREBASE_ADMIN_PRIVATE_KEY` | `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n` | Production |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | `firebase-adminsdk-xxx@luthando-fragrances-xxx.iam.gserviceaccount.com` | Production |
| `NEXT_PUBLIC_USE_FIREBASE_AUTH` | `false` (set to `true` when ready) | Production |
| `NEXT_PUBLIC_USE_FIRESTORE` | `false` (set to `true` when ready) | Production |
| `NEXT_PUBLIC_USE_FIREBASE_STORAGE` | `false` (set to `true` when ready) | Production |

### Deployment Scripts
Add to `package.json`:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "deploy:staging": "vercel --env NEXT_PUBLIC_USE_FIREBASE_AUTH=true --env NEXT_PUBLIC_USE_FIRESTORE=true",
    "deploy:production": "vercel --prod"
  }
}
```

## Migration Phase Configuration

### Phase 2: Authentication Migration
```bash
# Start of Phase 2
NEXT_PUBLIC_USE_FIREBASE_AUTH=false  # Supabase Auth only

# During Phase 2 (testing)
NEXT_PUBLIC_USE_FIREBASE_AUTH=true   # Enable for testing
NEXT_PUBLIC_USE_FIRESTORE=false      # Still using Supabase DB
NEXT_PUBLIC_USE_FIREBASE_STORAGE=false # Still using Supabase Storage

# End of Phase 2
NEXT_PUBLIC_USE_FIREBASE_AUTH=true   # Firebase Auth enabled for all
```

### Phase 3: Database Migration
```bash
# Start of Phase 3
NEXT_PUBLIC_USE_FIREBASE_AUTH=true
NEXT_PUBLIC_USE_FIRESTORE=false      # Supabase DB
NEXT_PUBLIC_USE_FIREBASE_STORAGE=false

# During Phase 3 (dual operation)
NEXT_PUBLIC_USE_FIRESTORE=true       # Enable Firestore
NEXT_PUBLIC_DUAL_DATABASE_MODE=true  # Write to both databases

# End of Phase 3
NEXT_PUBLIC_USE_FIRESTORE=true       # Firestore only
NEXT_PUBLIC_DUAL_DATABASE_MODE=false # Single database mode
```

### Phase 4: Storage Migration
```bash
# Start of Phase 4
NEXT_PUBLIC_USE_FIREBASE_AUTH=true
NEXT_PUBLIC_USE_FIRESTORE=true
NEXT_PUBLIC_USE_FIREBASE_STORAGE=false # Supabase Storage

# During Phase 4
NEXT_PUBLIC_USE_FIREBASE_STORAGE=true  # Enable Firebase Storage
NEXT_PUBLIC_DUAL_STORAGE_MODE=true     # Read from both, write to Firebase

# End of Phase 4
NEXT_PUBLIC_USE_FIREBASE_STORAGE=true  # Firebase Storage only
NEXT_PUBLIC_DUAL_STORAGE_MODE=false    # Single storage mode
```

## Security Considerations

### Sensitive Variables
1. **Never commit to git**:
   - `FIREBASE_ADMIN_PRIVATE_KEY`
   - `PAYFAST_PASSPHRASE`
   - Any API keys or secrets

2. **Vercel environment variables**:
   - Use Vercel's encrypted environment variables
   - Set production-only variables as production-only
   - Rotate keys after migration completion

### Access Control
1. **Firebase service account**:
   - Grant minimal necessary permissions
   - Use separate service accounts for dev/prod
   - Regularly rotate service account keys

2. **Environment separation**:
   - Use different Firebase projects for dev/staging/prod
   - Never use production credentials in development
   - Implement environment validation on app startup

## Validation Script

### Environment Validation
Create `scripts/validate-env.js`:
```javascript
const requiredEnvVars = {
  // Firebase
  'NEXT_PUBLIC_FIREBASE_API_KEY': 'string',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN': 'string',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID': 'string',
  // ... other required variables
}

function validateEnvironment() {
  const missing = []
  const invalid = []
  
  for (const [varName, expectedType] of Object.entries(requiredEnvVars)) {
    const value = process.env[varName]
    
    if (!value) {
      missing.push(varName)
    } else if (typeof value !== expectedType) {
      invalid.push(`${varName} (expected ${expectedType}, got ${typeof value})`)
    }
  }
  
  if (missing.length > 0 || invalid.length > 0) {
    console.error('Environment validation failed:')
    if (missing.length > 0) console.error('Missing:', missing)
    if (invalid.length > 0) console.error('Invalid types:', invalid)
    process.exit(1)
  }
  
  console.log('Environment validation passed')
}

validateEnvironment()
```

## Troubleshooting

### Common Issues
1. **Missing environment variables**: Run validation script
2. **Firebase connection errors**: Check API keys and project configuration
3. **Feature flags not working**: Ensure boolean values are `'true'`/`'false'` strings
4. **Admin SDK initialization errors**: Check private key formatting (preserve `\n`)

### Debug Mode
Add debug configuration:
```bash
NEXT_PUBLIC_DEBUG_MIGRATION=true
NEXT_PUBLIC_LOG_LEVEL=debug
```

## Next Steps
1. Update `.env.local` with actual Firebase configuration
2. Set up Vercel environment variables
3. Test configuration with validation script
4. Proceed to Phase 2 implementation

---

*Configuration created: 2026-01-16*
*Update when Firebase project is created*