# Setting Up Firebase Admin SDK for User Migration

## Why Firebase Admin SDK is Needed

The Firebase Admin SDK is required for server-side operations like:
- Creating users programmatically
- Generating password reset links
- Managing user accounts
- Bulk user migration

## Step-by-Step Setup Guide

### 1. Generate Service Account Key

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **luthando-frangrances**
3. Click the gear icon ⚙️ → **Project Settings**
4. Go to the **Service accounts** tab
5. Click **Generate new private key**
6. Click **Generate key**
7. Save the JSON file securely

### 2. Extract Credentials from JSON

Open the downloaded JSON file. You'll need two values:

```json
{
  "client_email": "firebase-adminsdk-xxx@luthando-frangrances.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
}
```

### 3. Update `.env.local`

Add these lines to your `.env.local` file:

```bash
# ============================================
# FIREBASE ADMIN SDK (Server-side only)
# ============================================
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxx@luthando-frangrances.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**Important**: The private key contains newlines. Make sure to:
- Keep the `\n` characters in the string
- Don't add extra spaces or line breaks
- The entire key should be on one line with `\n` for newlines

### 4. Test the Setup

After adding the credentials, test with:

```bash
npm run test:migration
```

This will check if:
- ✅ Supabase connection works
- ✅ Firebase Admin credentials are present
- ✅ Users can be counted for migration

### 5. Run User Migration

Once setup is complete, migrate users:

```bash
npm run migrate:users
```

## Security Notes

1. **Never commit** the service account key or `.env.local` to version control
2. The `.env.local` file is already in `.gitignore`
3. In production, use environment variables on your hosting platform
4. Rotate keys periodically (every 6-12 months)

## Troubleshooting

### Common Issues

#### 1. "Invalid private key" error
- Make sure the private key includes `\n` for newlines
- Don't modify the key format
- Copy the exact value from the JSON file

#### 2. "Permission denied" error
- The service account needs proper permissions
- In Firebase Console, go to IAM & Admin
- Ensure the service account has "Firebase Admin" role

#### 3. Network connectivity issues
- Check if you can access Supabase and Firebase APIs
- Verify firewall settings
- Test with `curl` to check connectivity

### Testing Connectivity

```bash
# Test Supabase connectivity
curl -I https://lidkzzqbtomofastzusb.supabase.co

# Test Firebase connectivity  
curl -I https://luthando-frangrances.firebaseio.com
```

## Migration Process

When you run `npm run migrate:users`:

1. **Read users from Supabase**: Fetches all users from `user_profiles` table
2. **Create Firebase users**: Creates each user in Firebase Auth with temporary password
3. **Create Firestore profiles**: Creates user profiles in Firestore
4. **Generate reset links**: Creates password reset links for migrated users
5. **Log results**: Shows migration summary

## Post-Migration Steps

1. **Notify users**: Inform users they need to reset their password
2. **Monitor logs**: Check for any migration errors
3. **Test auth flows**: Verify login, signup, password reset work
4. **Enable Firebase Auth**: Set `NEXT_PUBLIC_USE_FIREBASE_AUTH=true`

## Rollback Plan

If migration fails:
1. Keep `NEXT_PUBLIC_USE_FIREBASE_AUTH=false`
2. Users continue using Supabase Auth
3. Fix issues and retry migration
4. No user data is lost during migration attempt