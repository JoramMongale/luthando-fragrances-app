# Firebase Migration - Next Steps

## **✅ What's Been Completed**

### **Firebase Infrastructure**
1. **Firebase Project**: `luthando-frangrances` configured
2. **Firestore Database**: Initialized via CLI, rules deployed
3. **Firebase Storage**: Enabled in Console (test mode), rules file created
4. **Firebase Authentication**: Enabled in Console with Email/Password provider
5. **Authorized Domains**: Added `localhost`, `luthando-frangrances.firebaseapp.com`, `https://luthandofragrances.co.za/`

### **Code Implementation**
1. **Firestore Database Layer**: `lib/firestore-db.ts` - Full Supabase API compatibility
2. **Unified Database Layer**: `lib/unified-db.ts` - Feature flag switching between Supabase/Firestore
3. **Unified Authentication**: `contexts/UnifiedAuthContext.tsx` - Switches between Firebase/Supabase auth
4. **Updated Home Page**: Now uses unified database layer
5. **Firebase Configuration**: All environment variables set in `.env.local`

### **Current Configuration**
```bash
# .env.local settings
NEXT_PUBLIC_USE_FIREBASE_AUTH=true    # Using Firebase Authentication
NEXT_PUBLIC_USE_FIRESTORE=false       # Using Supabase for data (temporarily)
NEXT_PUBLIC_USE_FIREBASE_STORAGE=false # Using Supabase Storage (temporarily)
```

## **🚀 Immediate Next Steps**

### **1. Test Firebase Authentication**
```bash
# Start the development server
npm run dev

# Open browser and test:
# 1. Registration: http://localhost:3000/auth/register
# 2. Login: http://localhost:3000/auth/login
# 3. Check browser console for errors
```

**Expected Result**: You should be able to create accounts and login using Firebase Authentication.

### **2. Test Current App Functionality**
- Home page should load products (from Supabase)
- User authentication should work (Firebase)
- Cart and checkout should work (Supabase backend)
- Admin pages should work (Supabase)

### **3. If Authentication Fails**
Check these common issues:
1. **API Key Restrictions**: Go to Google Cloud Console → APIs & Services → Credentials
   - Find API key: `AIzaSyAL0vzZxam1n75IgMQDV470ZAft6g_J-aE`
   - Set "Application restrictions" to "None" or add `localhost/*`
2. **Firebase Console**: Verify Email/Password provider is enabled
3. **Authorized Domains**: Ensure `localhost` is in the list

## **📋 Phase 2: Data Migration (When Ready)**

### **Migrate from Supabase to Firestore**
```bash
# Enable Firestore
sed -i 's/NEXT_PUBLIC_USE_FIRESTORE=false/true/' .env.local

# Run migration scripts (when created)
npm run migrate:products
npm run migrate:users
npm run migrate:orders
```

### **Create Migration Scripts** (To be done)
We need scripts to:
1. Copy products from Supabase to Firestore
2. Copy users/profiles from Supabase to Firestore
3. Copy orders and order items from Supabase to Firestore

## **📦 Phase 3: Storage Migration**

### **Migrate from Supabase Storage to Firebase Storage**
```bash
# Enable Firebase Storage
sed -i 's/NEXT_PUBLIC_USE_FIREBASE_STORAGE=false/true/' .env.local

# Create Firebase Storage service
# (Need to create lib/firebase-storage.ts and lib/unified-storage.ts)
```

### **Storage Implementation Needed**
1. **Firebase Storage Service**: `lib/firebase-storage.ts` (mirror Supabase Storage API)
2. **Unified Storage Layer**: `lib/unified-storage.ts` (feature flag switching)
3. **Update Components**: Replace Supabase Storage imports with unified storage

## **🔧 Current Issues to Fix**

### **1. Firebase Storage Rules Deployment**
Error: "Could not find rules for the following storage targets: rules"
- **Status**: Rules file exists but CLI deployment fails
- **Workaround**: Use Firebase Console to upload rules temporarily

### **2. Admin Pages Need Updates**
- Analytics, Orders, Customers, Settings pages still import `supabase` directly
- Should be updated to use `unified-db` layer
- Some use `useAuth()` instead of `useUnifiedAuth()`

### **3. TypeScript Errors**
- `lib/firestore-db.ts` has TypeScript issues
- Some admin pages have type errors

## **🚨 Rollback Instructions**

If something breaks:
```bash
# Disable all Firebase services (use Supabase)
sed -i 's/NEXT_PUBLIC_USE_FIREBASE_AUTH=true/false/' .env.local
sed -i 's/NEXT_PUBLIC_USE_FIRESTORE=true/false/' .env.local  
sed -i 's/NEXT_PUBLIC_USE_FIREBASE_STORAGE=true/false/' .env.local

# Restart dev server
npm run dev
```

## **📊 Migration Status Summary**

| Service | Status | Notes |
|---------|--------|-------|
| **Authentication** | ✅ Ready to test | Firebase enabled, needs browser testing |
| **Database (Firestore)** | ✅ Code ready | Data migration needed from Supabase |
| **Storage** | ⚠️ Partially ready | Enabled in Console, code not implemented |
| **Admin Pages** | ⚠️ Needs updates | Still use Supabase directly |
| **User Facing Pages** | ✅ Mostly ready | Using unified layers |

## **🎯 Recommended Testing Order**

1. **Test Firebase Authentication** (immediate)
   - Registration, login, password reset
2. **Test Existing App** (with Firebase Auth + Supabase data)
   - Product browsing, cart, checkout
3. **Migrate Data to Firestore** (when ready)
   - Products, users, orders
4. **Test with Firestore** 
   - Enable Firestore, test all functionality
5. **Migrate Storage** (last step)
   - Product images, file uploads

## **📞 Troubleshooting Resources**

1. **Firebase Console**: https://console.firebase.google.com/project/luthando-frangrances
2. **Google Cloud Console (API Keys)**: https://console.cloud.google.com/apis/credentials
3. **Diagnostic Scripts**:
   ```bash
   npm run test:firebase-auth
   node scripts/diagnose-firebase.js
   node scripts/test-api-key.js
   ```

## **Next Action**
**Start testing Firebase Authentication by running the dev server and trying to create an account.**