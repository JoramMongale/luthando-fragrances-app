# Firebase Setup Guide for Luthando Fragrances

## Prerequisites
1. Google Cloud Platform account with billing enabled
2. Firebase CLI installed (`npm install -g firebase-tools`)
3. Node.js 18+ installed

## Step 1: Create Firebase Project

### Via Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Project name: `luthando-fragrances`
4. Enable Google Analytics (optional but recommended)
5. Accept terms and create project

### Project Configuration
- **Project ID**: `luthando-fragrances-{random-suffix}` (auto-generated)
- **Location**: Select region closest to your users (e.g., `us-central1`)
- **Billing**: Ensure billing is enabled for Blaze plan (required for some features)

## Step 2: Configure Firebase Services

### 2.1 Firebase Authentication
1. In Firebase Console, go to **Build** → **Authentication**
2. Click **Get Started**
3. Enable **Email/Password** provider
4. Configure settings:
   - Enable "Email link (passwordless sign-in)" if needed
   - Configure authorized domains (your Vercel domain)
   - Set up email templates for verification/password reset

### 2.2 Firestore Database
1. Go to **Build** → **Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode** (we'll update rules later)
4. Select location: Same as project or closest region
5. Create initial collections:
   - `products`
   - `orders`
   - `users`
   - `user_profiles`

### 2.3 Firebase Storage
1. Go to **Build** → **Storage**
2. Click **Get Started**
3. Choose **Start in production mode** (we'll update rules later)
4. Select location: Same as Firestore location
5. Create folder structure:
   - `product-images/` (for product photos)

## Step 3: Set Up Firebase Admin SDK

### 3.1 Generate Service Account Key
1. Go to **Project Settings** → **Service accounts**
2. Click **Generate new private key**
3. Download JSON file
4. Save securely (DO NOT commit to git)

### 3.2 Configure Admin SDK
The service account JSON contains:
```json
{
  "type": "service_account",
  "project_id": "luthando-fragrances-xxx",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxx@luthando-fragrances-xxx.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

## Step 4: Configure Environment Variables

### Update `.env.local`
Add these Firebase configuration variables:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=luthando-fragrances-xxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=luthando-fragrances-xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=luthando-fragrances-xxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABCDEF1234

# Firebase Admin SDK (Server-side only)
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxx@luthando-fragrances-xxx.iam.gserviceaccount.com
```

### Get Firebase Config Values
1. Go to **Project Settings** → **General**
2. Scroll to "Your apps" section
3. Click **</>** (web app) to get configuration
4. Copy the `firebaseConfig` object values

## Step 5: Security Rules Configuration

### 5.1 Firestore Security Rules
Create `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access for products
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
                   request.auth.token.email in ['admin@example.com', 'jorammongale@outlook.com'];
    }
    
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // User profiles
    match /user_profiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Orders: users can create/read their own, admins can read all
    match /orders/{orderId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && 
                   (resource.data.user_id == request.auth.uid || 
                    request.auth.token.email in ['admin@example.com', 'jorammongale@outlook.com']);
      allow update: if request.auth != null && 
                     request.auth.token.email in ['admin@example.com', 'jorammongale@outlook.com'];
    }
    
    // Order items (subcollection)
    match /orders/{orderId}/items/{itemId} {
      allow read: if request.auth != null && 
                   (get(/databases/$(database)/documents/orders/$(orderId)).data.user_id == request.auth.uid ||
                    request.auth.token.email in ['admin@example.com', 'jorammongale@outlook.com']);
      allow write: if request.auth != null && 
                    request.auth.token.email in ['admin@example.com', 'jorammongale@outlook.com'];
    }
  }
}
```

### 5.2 Storage Security Rules
Create `storage.rules`:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Product images: public read, admin write
    match /product-images/{imageId} {
      allow read: if true;
      allow write: if request.auth != null && 
                   request.auth.token.email in ['admin@example.com', 'jorammongale@outlook.com'];
    }
  }
}
```

## Step 6: Install Firebase Dependencies

### Update `package.json`
```bash
npm install firebase firebase-admin
```

### Updated dependencies section:
```json
"dependencies": {
  "firebase": "^10.14.0",
  "firebase-admin": "^12.6.0",
  // ... existing dependencies
}
```

## Step 7: Initialize Firebase Client

### Create `lib/firebase.ts`
```typescript
import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app
```

### Create `lib/firebase-admin.ts` (server-side only)
```typescript
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  })
}

export const adminAuth = getAuth()
export const adminDb = getFirestore()
export const adminStorage = getStorage()
```

## Step 8: Test Firebase Setup

### Test Script `test-firebase.js`
```javascript
const { initializeApp } = require('firebase/app')
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth')

const firebaseConfig = {
  // ... your config
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

// Test authentication
async function testAuth() {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      'test@example.com', 
      'password123'
    )
    console.log('Auth test passed:', userCredential.user.email)
  } catch (error) {
    console.log('Auth test error:', error.message)
  }
}

testAuth()
```

## Step 9: Vercel Deployment Configuration

### Update `vercel.json` or project settings
```json
{
  "env": {
    "NEXT_PUBLIC_FIREBASE_API_KEY": "@firebase_api_key",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN": "@firebase_auth_domain",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID": "@firebase_project_id",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET": "@firebase_storage_bucket",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID": "@firebase_messaging_sender_id",
    "NEXT_PUBLIC_FIREBASE_APP_ID": "@firebase_app_id",
    "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID": "@firebase_measurement_id",
    "FIREBASE_ADMIN_PRIVATE_KEY": "@firebase_admin_private_key",
    "FIREBASE_ADMIN_CLIENT_EMAIL": "@firebase_admin_client_email"
  }
}
```

## Step 10: Monitoring and Maintenance

### Enable Firebase Services
1. **Firebase Performance Monitoring**: For app performance insights
2. **Firebase Crashlytics**: For error reporting
3. **Google Analytics for Firebase**: For user analytics
4. **Firebase Cloud Messaging**: For push notifications (future)

### Set Up Alerts
1. Billing alerts in Google Cloud Console
2. Usage quotas for Firestore reads/writes
3. Storage bucket size monitoring

## Troubleshooting

### Common Issues
1. **CORS errors**: Configure authorized domains in Firebase Auth
2. **Permission denied**: Check security rules and authentication state
3. **Quota exceeded**: Monitor usage and upgrade plan if needed
4. **Connection issues**: Check network rules and Firebase project status

### Testing Commands
```bash
# Test Firebase CLI
firebase --version

# Test Firebase emulators (for local development)
firebase emulators:start

# Deploy security rules
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

## Next Steps After Setup
1. Run basic connectivity tests
2. Update migration strategy with actual Firebase project details
3. Proceed to Phase 2: Authentication Migration
4. Set up Firebase emulators for local development

---

*Guide created: 2026-01-16*
*For Luthando Fragrances Backend Migration Project*