# Phase 1: Research & Setup Plan

## Overview
**Goal**: Establish Firebase project and understand migration patterns for Luthando Fragrances backend migration from Supabase to Firebase.

**Timeline**: 3 plans (01-01, 01-02, 01-03)
**Status**: Ready for execution
**Dependencies**: None (first phase)

## Current State Analysis

### Existing Supabase Implementation
**Authentication**:
- Supabase Auth with email/password (`@supabase/auth-helpers-nextjs`)
- AuthContext with user state management
- Session persistence via cookies
- Admin access via email whitelist

**Database**:
- PostgreSQL via Supabase (`@supabase/supabase-js`)
- Tables: products, orders, order_items, user_profiles
- Complex queries with joins (orders + order_items + products)
- Real-time subscriptions not currently used

**Storage**:
- Supabase Storage for product images
- Bucket: `product-images`
- Image upload/delete operations with validation

**Key Files to Migrate**:
1. `lib/supabase.ts` - Database client and queries
2. `contexts/AuthContext.tsx` - Authentication state
3. `lib/orders.ts` - Order management with complex queries
4. `lib/storage.ts` - Image storage operations
5. `lib/admin-db.ts` - Admin database operations
6. `lib/admin-storage.ts` - Admin storage operations

### Current Dependencies to Replace
```json
"@supabase/supabase-js": "^2.53.0",
"@supabase/auth-helpers-nextjs": "^0.10.0"
```

### Firebase Dependencies to Add
```json
"firebase": "^10.14.0",
"firebase-admin": "^12.6.0" (server-side only)
```

## Plan 01-01: Research Firebase Migration Patterns

### Objectives
1. Research Firebase Auth migration patterns from Supabase
2. Understand Firestore data modeling for e-commerce
3. Research Firebase Storage migration strategies
4. Analyze cost implications and setup requirements

### Tasks
- [ ] Research Firebase Auth vs Supabase Auth feature parity
- [ ] Study Firestore data modeling for relational data (products, orders, users)
- [ ] Research Firebase Storage setup and migration patterns
- [ ] Analyze Firebase pricing vs current Supabase costs
- [ ] Document migration patterns and best practices

### Deliverables
- Migration patterns document
- Feature parity analysis
- Cost comparison analysis

## Plan 01-02: Set Up Firebase Project and Configure Services

### Objectives
1. Create Firebase project in Google Cloud Console
2. Configure Firebase services (Auth, Firestore, Storage)
3. Set up Firebase Admin SDK for server-side operations
4. Configure environment variables

### Tasks
- [ ] Create Firebase project "luthando-fragrances"
- [ ] Enable Firebase Authentication (email/password)
- [ ] Create Firestore database with appropriate rules
- [ ] Set up Firebase Storage bucket with security rules
- [ ] Generate Firebase Admin SDK credentials
- [ ] Configure environment variables (.env.local)
- [ ] Test basic Firebase connectivity

### Environment Variables to Add
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
FIREBASE_ADMIN_PRIVATE_KEY=
FIREBASE_ADMIN_CLIENT_EMAIL=
```

### Deliverables
- Firebase project setup complete
- All services configured and accessible
- Environment variables documented
- Basic connectivity tested

## Plan 01-03: Create Migration Strategy Document

### Objectives
1. Create detailed migration strategy
2. Design Firestore data structure
3. Plan authentication migration approach
4. Create environment configuration plan

### Tasks
- [ ] Design Firestore collections structure
- [ ] Map Supabase tables to Firestore collections
- [ ] Plan authentication migration (users, sessions)
- [ ] Design storage migration approach
- [ ] Create phased migration timeline
- [ ] Define rollback procedures
- [ ] Document testing strategy

### Firestore Data Structure Design
```
Collections:
- users (documents by user_id)
- products (documents by product_id)
- orders (documents by order_id)
- order_items (subcollection under orders/{order_id}/items)
- user_profiles (documents by user_id)
```

### Migration Strategy Components
1. **Authentication Migration**: User migration with password reset flow
2. **Database Migration**: Batch migration with validation
3. **Storage Migration**: Image transfer with URL mapping
4. **Code Migration**: Gradual replacement with feature flags
5. **Testing Strategy**: Parallel testing before cutover

### Deliverables
- Complete migration strategy document
- Firestore data structure design
- Migration timeline and phases
- Rollback and testing procedures

## Success Criteria

### Phase 1 Completion
- [ ] Firebase project created and configured
- [ ] Migration patterns researched and documented
- [ ] Environment variables configured
- [ ] Migration strategy document complete
- [ ] Ready to proceed to Phase 2 (Authentication Migration)

### Quality Gates
- All research documented with references
- Firebase setup tested with basic operations
- Migration strategy reviewed for completeness
- Environment configuration validated

## Risks and Mitigations

### Technical Risks
1. **Data loss during migration**: Mitigation - Comprehensive backup strategy, validation checks
2. **Authentication session disruption**: Mitigation - Gradual migration with dual auth support
3. **Firestore query limitations**: Mitigation - Data modeling optimization, composite indexes

### Business Risks
1. **Production downtime**: Mitigation - Zero-downtime migration strategy
2. **Cost overruns**: Mitigation - Firebase cost monitoring setup
3. **User experience disruption**: Mitigation - Thorough testing, gradual rollout

## Next Steps
After Phase 1 completion, proceed to Phase 2: Authentication Migration with plans:
- 02-01: Implement Firebase Auth client and update authentication context
- 02-02: Migrate user authentication flows and session management
- 02-03: Update admin access control and middleware

---

*Plan created: 2026-01-16*
*Phase 1 of 7 in Luthando Fragrances Backend Migration*