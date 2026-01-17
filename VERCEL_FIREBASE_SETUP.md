# Vercel Firebase Environment Variables Setup

## Project Information
- **Project ID**: `prj_yjt2wTEDXd9dAfyncUBCdLfANBj2`
- **Project Name**: `luthando-fragrances`
- **Vercel URL**: https://vercel.com/your-username/luthando-fragrances

## Firebase Variables to Add to Vercel

### Client-Side Variables (Required)
Add these to Vercel Environment Variables:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAL0vzZxam1n75IgMQDV470ZAft6g_J-aE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=luthando-frangrances.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=luthando-frangrances
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=luthando-frangrances.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=708572342653
NEXT_PUBLIC_FIREBASE_APP_ID=1:708572342653:web:b8a2d29298c1a789598414
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-YM0XWDZGCZ
```

### Migration Feature Flags
```bash
NEXT_PUBLIC_USE_FIREBASE_AUTH=false
NEXT_PUBLIC_USE_FIRESTORE=false
NEXT_PUBLIC_USE_FIREBASE_STORAGE=false
NEXT_PUBLIC_FIRESTORE_BATCH_SIZE=100
```

### Existing Supabase Variables (Keep these)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://lidkzzqbtomofastzusb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZGt6enFidG9tb2Zhc3R6dXNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMDQwMzgsImV4cCI6MjA2ODg4MDAzOH0.wguzp6xbonilWeFRE1OaKPNwwPq-4MxraL1xXGBSS4I
```

## How to Add to Vercel

### Method 1: Vercel Dashboard (Easiest)
1. Go to: https://vercel.com/your-username/luthando-fragrances
2. Click **Settings** → **Environment Variables**
3. Click **Add New**
4. For each variable:
   - **Name**: Enter variable name (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`)
   - **Value**: Paste the value
   - **Environment**: Select "Production" (or "All" for all environments)
   - **Include in Build**: ✅ Check this box
5. Click **Save**
6. Repeat for all variables
7. **Redeploy** after adding all variables

### Method 2: Install Vercel CLI and Add Variables
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Link to your project (if not already linked)
vercel link

# Add each environment variable
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
vercel env add NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
vercel env add NEXT_PUBLIC_USE_FIREBASE_AUTH
vercel env add NEXT_PUBLIC_USE_FIRESTORE
vercel env add NEXT_PUBLIC_USE_FIREBASE_STORAGE

# Deploy with new variables
vercel --prod
```

## Important Security Notes

### ✅ **DO Add to Vercel** (Client-side):
- All `NEXT_PUBLIC_*` variables
- Firebase configuration variables
- Feature flags

### ❌ **DO NOT Add to Vercel** (Server-side/Secret):
- `FIREBASE_ADMIN_CLIENT_EMAIL`
- `FIREBASE_ADMIN_PRIVATE_KEY`
- `PAYFAST_PASSPHRASE`
- Any API keys that should stay server-side

### 🔒 **Already in Vercel (Check if present):**
- `NEXT_PUBLIC_PAYFAST_MERCHANT_ID`
- `NEXT_PUBLIC_PAYFAST_MERCHANT_KEY`
- `NEXT_PUBLIC_PAYFAST_SANDBOX`
- `NEXT_PUBLIC_ADMIN_EMAIL`
- `NEXT_PUBLIC_BUSINESS_NAME`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_APP_URL`

## Verification Steps

After adding variables:

1. **Check current variables**:
   ```bash
   # If using Vercel CLI
   vercel env ls
   ```

2. **Test deployment locally**:
   ```bash
   # Build with Vercel environment
   vercel build
   ```

3. **Deploy to test**:
   ```bash
   # Deploy to preview
   vercel
   
   # Deploy to production
   vercel --prod
   ```

4. **Verify in browser**:
   - Visit your deployed site
   - Check browser console for Firebase initialization
   - Test auth flows if `NEXT_PUBLIC_USE_FIREBASE_AUTH=true`

## Troubleshooting

### Common Issues:

1. **Variables not loading**:
   - Ensure variable names match exactly
   - Check "Include in Build" is checked
   - Redeploy after adding variables

2. **Firebase initialization errors**:
   - Verify all 7 Firebase config variables are present
   - Check for typos in values
   - Ensure project ID matches Firebase Console

3. **Mixed content errors**:
   - All Firebase URLs should use `https://`
   - Check `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` format

4. **Feature flags not working**:
   - Values must be strings: `"true"` or `"false"`
   - Restart dev server after changing locally
   - Redeploy after changing in Vercel

## Migration Timeline

### Phase 1: Setup (Now)
- Add Firebase variables to Vercel
- Keep `NEXT_PUBLIC_USE_FIREBASE_AUTH=false`
- Test deployment works

### Phase 2: Testing
- Set `NEXT_PUBLIC_USE_FIREBASE_AUTH=true` locally
- Test Firebase Auth flows
- Fix any issues

### Phase 3: Production Migration
- Set `NEXT_PUBLIC_USE_FIREBASE_AUTH=true` in Vercel
- Redeploy to production
- Monitor for issues
- Rollback by setting to `false` if needed

## Support
- Vercel Docs: https://vercel.com/docs/projects/environment-variables
- Firebase Setup: https://firebase.google.com/docs/web/setup
- Project Issues: Check `.vercel/README.txt` for project-specific notes