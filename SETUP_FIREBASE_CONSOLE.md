# Firebase Console Setup Guide

## **🛠️ Current Issues Identified**

Our diagnostics show these Firebase services are **NOT enabled**:
- ❌ **Authentication** - Not enabled (causing "createErrorInternal" errors)
- ❌ **Firestore Database** - Not created
- ❌ **Storage** - Not enabled

## **📋 Step-by-Step Console Setup**

### **1. Open Firebase Console**
```
https://console.firebase.google.com/project/luthando-frangrances
```

### **2. Enable Authentication**

**Step 2.1: Navigate to Authentication**
1. Click **"Build"** in left sidebar
2. Click **"Authentication"**
3. Click **"Get Started"**

**Step 2.2: Enable Email/Password Provider**
1. Click **"Sign-in method"** tab
2. Find **"Email/Password"** in the list
3. Click **"Enable"** toggle
4. Click **"Save"**

**Step 2.3: Add Authorized Domains**
1. Click **"Settings"** tab (gear icon)
2. Scroll to **"Authorized domains"**
3. Click **"Add domain"**
4. Add these domains (one at a time):
   - `localhost`
   - `luthando-frangrances.firebaseapp.com`
   - Your Vercel domain (if known)

### **3. Enable Firestore Database**

**Step 3.1: Navigate to Firestore**
1. Click **"Build"** in left sidebar
2. Click **"Firestore Database"**
3. Click **"Create database"**

**Step 3.2: Configure Firestore**
1. Choose **"Start in test mode"** (for development)
2. Click **"Next"**
3. Choose location (e.g., `nam5 (us-central)`)
4. Click **"Enable"**

### **4. Enable Storage**

**Step 4.1: Navigate to Storage**
1. Click **"Build"** in left sidebar
2. Click **"Storage"**
3. Click **"Get Started"**

**Step 4.2: Configure Storage**
1. Choose **"Start in test mode"** (for development)
2. Click **"Next"**
3. Choose location (same as Firestore)
4. Click **"Done"**

## **🔧 Verify API Key Restrictions**

Sometimes API keys have restrictions that block localhost:

### **Check Google Cloud Console**
1. Go to: **https://console.cloud.google.com/apis/credentials**
2. Find API key: `AIzaSyAL0vzZxam1n75IgMQDV470ZAft6g_J-aE`
3. Click on the API key

### **Adjust Restrictions (if needed)**
1. Under **"Application restrictions"**:
   - Choose **"None"** (for development)
   - OR choose **"HTTP referrers"** and add:
     - `localhost:*`
     - `luthando-frangrances.firebaseapp.com/*`
2. Under **"API restrictions"**:
   - Choose **"Don't restrict"** (for development)
   - OR select Firebase services

## **✅ Verification Steps**

After enabling all services:

### **1. Test Firebase Auth**
```bash
# Re-enable Firebase Auth
sed -i 's/NEXT_PUBLIC_USE_FIREBASE_AUTH=false/NEXT_PUBLIC_USE_FIREBASE_AUTH=true/' .env.local

# Restart dev server
npm run dev

# Test registration
# Go to: http://localhost:3000/auth/register
```

### **2. Test with Diagnostics**
```bash
# Run comprehensive test
npm run test:firebase-auth

# Check API key
node scripts/test-api-key.js

# Run general diagnostics
node scripts/diagnose-firebase.js
```

### **3. Deploy Security Rules**
```bash
# Now that Storage is enabled
npm run firebase:deploy:rules
```

## **🚀 After Successful Setup**

### **Enable Firestore & Storage**
```bash
# Use the toggle script
npm run toggle:firebase-services
# Select option 1: "Enable all services"
```

### **Test Complete Migration**
1. **Auth**: Test registration/login
2. **Database**: Test product listing/orders
3. **Storage**: Test image uploads

### **Configure Admin SDK** (Optional)
For server-side operations (user migration, etc.):
1. Firebase Console → Project Settings → Service Accounts
2. Generate new private key
3. Add to `.env.local`:
   ```
   FIREBASE_ADMIN_CLIENT_EMAIL="firebase-adminsdk-xxx@luthando-frangrances.iam.gserviceaccount.com"
   FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

## **📞 Troubleshooting**

### **Common Errors & Solutions**

| Error | Cause | Solution |
|-------|-------|----------|
| `createErrorInternal` | Auth not enabled | Enable Authentication in Console |
| `CONFIGURATION_NOT_FOUND` | Auth not configured | Complete Auth setup |
| `API key not valid` | API key restricted | Check API key restrictions |
| `404` on Firestore | Firestore not created | Create Firestore database |
| Storage deploy fails | Storage not enabled | Enable Storage in Console |

### **Quick Rollback**
If something breaks:
```bash
# Disable all Firebase services
sed -i 's/NEXT_PUBLIC_USE_FIREBASE_AUTH=true/false/' .env.local
sed -i 's/NEXT_PUBLIC_USE_FIRESTORE=true/false/' .env.local
sed -i 's/NEXT_PUBLIC_USE_FIREBASE_STORAGE=true/false/' .env.local

# Restart with Supabase
npm run dev
```

## **📊 Migration Progress**

**Current Status:**
- ✅ Firebase config in `.env.local`
- ✅ Firestore code layer ready
- ✅ Unified database layer ready
- ❌ Firebase services not enabled (BLOCKING)
- ❌ Admin SDK not configured
- ❌ Storage layer not implemented

**Next after Console Setup:**
1. Test Firebase Auth
2. Create Firebase Storage layer
3. Update components to use unified layer
4. Migrate data from Supabase
5. Deploy to production