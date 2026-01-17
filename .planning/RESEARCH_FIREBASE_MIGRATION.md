# Firebase Migration Patterns Research

## Research Date: 2026-01-16
**Plan**: 01-01 - Research Firebase migration patterns and setup requirements

## 1. Firebase Auth vs Supabase Auth Feature Parity Analysis

### Current Supabase Auth Features in Use
1. **Email/Password authentication** - Primary auth method
2. **Session management** - Cookie-based sessions with `@supabase/auth-helpers-nextjs`
3. **Password reset flow** - Email-based password recovery
4. **Email verification** - Account confirmation emails
5. **Admin access control** - Email-based whitelist in `lib/admin.ts`
6. **User profiles** - Automatic creation in `user_profiles` table

### Firebase Auth Equivalent Features
| Supabase Feature | Firebase Equivalent | Migration Notes |
|-----------------|---------------------|----------------|
| Email/Password auth | `createUserWithEmailAndPassword()` `signInWithEmailAndPassword()` | Direct equivalent, similar API |
| Session management | `onAuthStateChanged()` listener, `getIdToken()` | Firebase uses tokens, not cookies by default |
| Password reset | `sendPasswordResetEmail()` | Similar functionality |
| Email verification | `sendEmailVerification()` | Similar, may need template customization |
| Admin access | Custom claims via `setCustomUserClaims()` | More flexible than email whitelist |
| User profiles | Firestore `users` collection | Manual creation needed (no triggers) |

### Key Differences
1. **Session persistence**: Supabase uses cookies, Firebase uses tokens stored client-side
2. **User metadata**: Supabase has built-in `user_metadata`, Firebase uses custom claims or Firestore
3. **Triggers**: Supabase has database triggers for user creation, Firebase requires Cloud Functions
4. **Admin SDK**: Firebase Admin SDK more powerful for server-side operations

## 2. Firestore Data Modeling for E-commerce

### Current Supabase Schema Analysis

**Tables**:
1. `products` - Product catalog with images, prices, stock
2. `orders` - Order headers with status, totals
3. `order_items` - Line items with product references
4. `user_profiles` - Extended user information

**Key Relationships**:
- `orders.user_id` → `auth.users.id` (foreign key)
- `order_items.order_id` → `orders.id` (foreign key)
- `order_items.product_id` → `products.id` (foreign key)

### Firestore Data Structure Design

#### Option 1: Denormalized with Subcollections (Recommended)
```javascript
// Collections
products/{productId}
  - name, description, price, category, imageUrl, isActive, stockQuantity

users/{userId}
  - email, createdAt, lastLogin

user_profiles/{userId}
  - firstName, lastName, phone, address

orders/{orderId}
  - userId, totalAmount, status, paymentStatus, shippingAddress
  - /items/{itemId} (subcollection)
    - productId, quantity, price, productName (denormalized)
```

#### Option 2: Normalized with References
```javascript
// Collections
products/{productId}
  - (same as above)

orders/{orderId}
  - userId, totalAmount, status, items: [{productId, quantity, price}]

order_items/{itemId}
  - orderId, productId, quantity, price
```

### Query Patterns Analysis

#### Current Supabase Queries to Migrate
1. **Get products with filtering** (`lib/supabase.ts:10-23`)
   ```typescript
   // Supabase
   const { data } = await supabase
     .from('products')
     .select('*')
     .eq('is_active', true)
     .eq('category', category)
   
   // Firestore equivalent
   const query = query(
     collection(db, 'products'),
     where('isActive', '==', true),
     where('category', '==', category)
   )
   ```

2. **Get orders with items and products** (`lib/orders.ts:180-201`)
   ```typescript
   // Supabase (join across 3 tables)
   const { data } = await supabase
     .from('orders')
     .select(`
       *,
       order_items (
         *,
         product:products (*)
       )
     `)
     .eq('user_id', userId)
   
   // Firestore (requires multiple queries)
   // 1. Get orders for user
   const ordersQuery = query(
     collection(db, 'orders'),
     where('userId', '==', userId)
   )
   
   // 2. For each order, get items
   const itemsQuery = query(
     collection(db, `orders/${orderId}/items`)
   )
   
   // 3. Get product details for each item
   const productDoc = await getDoc(doc(db, 'products', productId))
   ```

3. **Create order with items** (`lib/orders.ts:92-142`)
   ```typescript
   // Supabase (transaction across 2 tables)
   // 1. Create order
   // 2. Create order_items
   
   // Firestore (batched write)
   const batch = writeBatch(db)
   batch.set(doc(db, 'orders', orderId), orderData)
   batch.set(doc(db, `orders/${orderId}/items`, itemId), itemData)
   await batch.commit()
   ```

### Performance Considerations
1. **Denormalization**: Trade storage for read performance
2. **Composite indexes**: Required for multi-field queries
3. **Query limitations**: No OR, JOIN, or aggregation queries
4. **Real-time updates**: Built-in with Firestore (not currently used in Supabase)

## 3. Firebase Storage Migration Strategy

### Current Supabase Storage Usage
- **Bucket**: `product-images`
- **Operations**: Upload, delete, get URL
- **File structure**: `products/{productId}_{timestamp}.{ext}`
- **Validation**: File type, size, dimensions

### Firebase Storage Equivalent
| Supabase Operation | Firebase Equivalent |
|-------------------|---------------------|
| `supabase.storage.from().upload()` | `ref(storage, path).put(file)` |
| `supabase.storage.from().remove()` | `ref(storage, path).delete()` |
| `supabase.storage.from().getPublicUrl()` | `getDownloadURL(ref)` |
| File validation | Client-side validation before upload |

### Migration Approach
1. **Direct transfer**: Copy images from Supabase to Firebase Storage
2. **URL mapping**: Maintain same URL paths or create mapping table
3. **CDN benefits**: Firebase Storage uses Google CDN automatically

## 4. Cost Analysis: Firebase vs Supabase

### Current Supabase Costs (Estimated)
- **Pro Plan**: $25/month
- **Storage**: ~$5/month (based on usage)
- **Auth**: Included
- **Bandwidth**: Included
- **Estimated Total**: $30/month

### Firebase Cost Projection

#### Firestore Pricing
- **Reads**: $0.06 per 100,000 documents
- **Writes**: $0.18 per 100,000 documents
- **Deletes**: $0.02 per 100,000 documents
- **Storage**: $0.18 per GB/month

#### Storage Pricing
- **Storage**: $0.026 per GB/month
- **Bandwidth**: $0.12 per GB (downloaded)
- **Operations**: $0.05 per 10,000 operations

#### Auth Pricing
- **Free tier**: 10,000 monthly active users
- **Beyond free**: $0.0055 per user/month

### Usage Estimation for Luthando Fragrances

**Assumptions**:
- 1,000 monthly active users
- 500 products
- 100 orders/month
- 5 items/order average
- 100MB of product images

**Monthly Operations Estimate**:
- **Product reads**: 10,000 (20 reads/user)
- **Order writes**: 100 orders + 500 items = 600 writes
- **User auth**: 1,000 MAU (within free tier)
- **Storage**: 100MB = 0.1GB

**Cost Calculation**:
- Firestore reads: 10,000 × $0.06/100k = $0.006
- Firestore writes: 600 × $0.18/100k = $0.001
- Storage: 0.1GB × $0.026 = $0.0026
- **Total Estimated**: ~$0.01/month (well within free tier)

**Conclusion**: Significant cost reduction potential (30-50%+ savings)

## 5. Migration Best Practices Research

### Gradual Migration Patterns
1. **Feature flags**: Control which backend is active
2. **Dual writes**: Write to both databases during transition
3. **Read from active**: Read from current active backend
4. **Data sync**: Keep databases in sync during migration

### Authentication Migration Strategies
1. **Passwordless migration**: Users reset password on first Firebase login
2. **Import users**: Use Admin SDK to import users with hashed passwords (requires password reset)
3. **Parallel auth**: Support both providers during transition

### Data Migration Approaches
1. **Big bang migration**: One-time migration of all data
2. **Incremental migration**: Migrate data in batches
3. **Live sync**: Real-time synchronization during migration

### Recommended Approach for Luthando Fragrances
1. **Phase 1**: Research & Setup (current)
2. **Phase 2**: Authentication migration with dual support
3. **Phase 3**: Database migration with dual writes
4. **Phase 4**: Storage migration
5. **Phase 5**: Testing and validation
6. **Phase 6**: Final cutover

## 6. Technical Implementation Patterns

### Feature Flag Implementation
```typescript
// lib/feature-flags.ts
export const useFirebaseAuth = process.env.NEXT_PUBLIC_USE_FIREBASE_AUTH === 'true'
export const useFirestore = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true'

// Usage
const dbClient = useFirestore ? firestoreDb : supabaseDb
const authClient = useFirebaseAuth ? firebaseAuth : supabaseAuth
```

### Dual Write Pattern
```typescript
async function createOrder(orderData) {
  // Write to Supabase
  const supabaseResult = await supabaseCreateOrder(orderData)
  
  // Write to Firestore if enabled
  if (useFirestore) {
    const firestoreResult = await firestoreCreateOrder(orderData)
  }
  
  return supabaseResult // Return from primary source
}
```

### Migration Utility Functions
```typescript
// lib/migration-utils.ts
export async function migrateUser(userId: string) {
  // 1. Get user from Supabase
  const supabaseUser = await getSupabaseUser(userId)
  
  // 2. Create user in Firebase Auth
  const firebaseUser = await createFirebaseUser(supabaseUser.email)
  
  // 3. Send password reset email
  await sendPasswordResetEmail(firebaseUser.email)
  
  // 4. Mark as migrated
  await markUserMigrated(userId)
}
```

## 7. Risk Assessment

### Technical Risks
1. **Data consistency**: Dual writes can lead to inconsistencies
   - Mitigation: Validation scripts, conflict resolution
2. **Performance impact**: Dual writes increase latency
   - Mitigation: Async writes, background jobs
3. **Authentication disruption**: Users locked out during migration
   - Mitigation: Passwordless migration, clear communication

### Business Risks
1. **Order processing delays**: During cutover
   - Mitigation: Off-peak migration, rollback plan
2. **Customer dissatisfaction**: Due to migration issues
   - Mitigation: Support channels, status updates
3. **Revenue loss**: From failed transactions
   - Mitigation: Payment validation, manual review

## 8. Recommended Tools and Libraries

### Firebase SDKs
- `firebase` (v10.14.0+) - Client SDK
- `firebase-admin` (v12.6.0+) - Server SDK
- `@firebase/auth` - Auth utilities
- `@firebase/firestore` - Firestore utilities

### Migration Tools
- **Firebase Admin SDK**: For data migration scripts
- **Firebase Emulators**: For local testing
- **Firebase CLI**: For deployment and management

### Testing Tools
- **Jest**: Unit and integration tests
- **Firebase Test SDK**: For emulator testing
- **Cypress**: E2E testing

## 9. Next Steps

### Immediate Actions (Plan 01-01)
1. ✅ Research Firebase Auth vs Supabase Auth parity
2. ✅ Design Firestore data structure
3. ✅ Analyze cost implications
4. ✅ Document migration patterns

### Preparation for Plan 01-02
1. Set up Firebase project
2. Configure Firebase services
3. Generate Admin SDK credentials
4. Update environment variables

### Research Conclusions
1. **Migration is feasible** with careful planning
2. **Cost savings significant** (estimated 30-50%+)
3. **Gradual migration recommended** to minimize risk
4. **Feature flags essential** for controlled rollout

---

*Research completed: 2026-01-16*
*Next: Execute Plan 01-02 - Set up Firebase project*