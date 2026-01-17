# Firebase CLI Configuration Guide

## Prerequisites
- Firebase CLI installed: `npm install -g firebase-tools`
- Logged in: `firebase login`
- Project linked: `firebase use luthando-frangrances`

## 1. Enable Firebase Services via CLI

### A. Enable Authentication
```bash
# Check if auth is enabled
firebase auth:export --project luthando-frangrances 2>&1

# If not enabled, you need to enable it via Console first:
# 1. Go to https://console.firebase.google.com/project/luthando-frangrances
# 2. Click "Authentication" → "Get Started"
# 3. Enable "Email/Password" provider
```

### B. Enable Firestore Database
```bash
# Initialize Firestore
firebase init firestore

# Deploy security rules
firebase deploy --only firestore:rules

# Create indexes if needed
firebase deploy --only firestore:indexes
```

### C. Enable Firebase Storage
```bash
# Initialize Storage
firebase init storage

# Deploy storage rules
firebase deploy --only storage:rules
```

### D. Check Project Services
```bash
# List all enabled services
firebase projects:list

# Check project details
firebase projects:get luthando-frangrances
```

## 2. Configure Firebase Services

### Authentication Configuration
```bash
# Export users (if you had any)
firebase auth:export users.json --format=json

# Import users (for migration)
firebase auth:import users.json --hash-algo=BCRYPT

# List auth providers
# Note: Must be configured in Console, not CLI
```

### Firestore Configuration
```bash
# View current rules
firebase firestore:rules:get

# Test rules with emulator
firebase emulators:start --only firestore

# Backup data
firebase firestore:export backup/
```

### Storage Configuration
```bash
# View storage rules
firebase storage:rules:get

# Upload files
firebase storage:upload /path/to/file /destination/path

# List files
firebase storage:list /
```

## 3. Local Development with Emulators

```bash
# Install emulators
firebase init emulators

# Start all emulators
npm run firebase:emulators

# Or start specific emulators
firebase emulators:start --only auth,firestore,storage

# Emulator UI: http://localhost:4000
```

## 4. Environment Setup for Local Development

Update `.env.local` for emulator use:
```bash
# For emulator development
NEXT_PUBLIC_FIREBASE_USE_EMULATOR=true
NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_HOST=localhost:8080
NEXT_PUBLIC_FIREBASE_STORAGE_EMULATOR_HOST=localhost:9199
```

## 5. Common CLI Commands

### Project Management
```bash
# List projects
firebase projects:list

# Switch project
firebase use luthando-frangrances

# Create new project
firebase projects:create new-project-name
```

### Deployment
```bash
# Deploy everything
firebase deploy

# Deploy specific services
firebase deploy --only hosting,firestore,storage

# Deploy functions
firebase deploy --only functions
```

### Monitoring
```bash
# View logs
firebase functions:log

# Check project status
firebase projects:get luthando-frangrances
```

## 6. Troubleshooting

### Authentication Not Working
```bash
# Check if auth is enabled
curl "https://identitytoolkit.googleapis.com/v1/projects/luthando-frangrances/config?key=AIzaSyAL0vzZxam1n75IgMQDV470ZAft6g_J-aE"

# Expected response should show enabled providers
```

### Firestore Issues
```bash
# Test connectivity
curl "https://firestore.googleapis.com/v1/projects/luthando-frangrances/databases/(default)/documents"

# Check rules syntax
firebase firestore:rules:dry-run
```

### Storage Issues
```bash
# Test bucket exists
curl "https://storage.googleapis.com/storage/v1/b/luthando-frangrances.firebasestorage.app"
```

## 7. Quick Setup Script

Create `setup-firebase.sh`:
```bash
#!/bin/bash

# Enable services (must be done in Console first)
echo "1. Enable these in Firebase Console:"
echo "   - Authentication (Email/Password)"
echo "   - Firestore Database"
echo "   - Storage"

# Initialize locally
firebase init firestore
firebase init storage
firebase init emulators

# Deploy rules
firebase deploy --only firestore:rules,storage:rules

# Start emulators for testing
firebase emulators:start
```

## 8. Next Steps

1. **Enable services in Console** (required before CLI)
2. **Initialize local config** with `firebase init`
3. **Deploy security rules** for production
4. **Test with emulators** locally
5. **Update environment variables** for emulator/production

**Note**: Some services (like enabling Authentication providers) must be done in the Firebase Console first, then configured via CLI.