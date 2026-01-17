# Luthando Fragrances Backend Migration

## What This Is

A production Next.js e-commerce fragrance store deployed on Vercel that needs to migrate from Supabase to Google Firebase for cost reduction. The application currently uses Supabase for authentication, database, and image storage, with PayFast for payments and WhatsApp for notifications.

## Core Value

Successfully migrate the entire backend from Supabase to Firebase without breaking the production application, while maintaining all existing functionality and adding comprehensive testing.

## Requirements

### Validated

- ✓ Next.js 15 e-commerce application - existing
- ✓ User authentication with email/password - existing
- ✓ Product catalog with images - existing
- ✓ Shopping cart with Zustand state management - existing
- ✓ Checkout with PayFast payment integration - existing
- ✓ Order management system - existing
- ✓ Admin dashboard with access control - existing
- ✓ WhatsApp notifications for orders - existing
- ✓ Vercel deployment - existing

### Active

- [ ] Migrate authentication from Supabase Auth to Firebase Auth
- [ ] Migrate database from Supabase PostgreSQL to Firestore
- [ ] Migrate image storage from Supabase Storage to Firebase Storage
- [ ] Update all data layer code to use Firebase SDKs
- [ ] Add comprehensive test suite (unit, integration, E2E)
- [ ] Ensure zero data loss during migration
- [ ] Maintain existing API endpoints and webhook functionality
- [ ] Update environment configuration for Firebase

### Out of Scope

- Redesigning UI/UX - focus is on backend migration only
- Changing payment provider (PayFast remains)
- Adding new features beyond migration
- Changing deployment platform (stays on Vercel)

## Context

This is a production e-commerce fragrance store with real customers and orders. The current stack is Next.js 15 with Supabase backend, deployed on Vercel. The migration is motivated by cost reduction goals with Firebase offering better pricing for the application's scale.

Key existing patterns:
- Clear separation of layers (presentation, business logic, data, infrastructure)
- Zustand for client-side state management
- React Context for authentication
- Supabase client for all data operations
- PayFast webhook for payment processing
- WhatsApp API for order notifications

## Constraints

- **Production environment**: Migration must not break existing functionality
- **Data integrity**: No data loss during migration
- **Cost**: Firebase must provide cost reduction over current Supabase usage
- **Compatibility**: Must work with existing Vercel deployment

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Migrate to full Firebase suite | Cost reduction is primary goal | ✅ Planned in Phase 1 |
| Maintain existing frontend | UI/UX is working well, focus on backend | ✅ Frontend remains unchanged |
| Add comprehensive testing | Production app needs reliability | ✅ Planned in Phase 5 |
| Zero-downtime migration | Production app cannot be taken offline | ✅ Feature flag approach planned |
| Gradual migration with dual operation | Minimize risk and ensure continuity | ✅ Core strategy for all phases |
| Passwordless user migration | Secure and simple user transition | ✅ Phase 2 implementation plan |
| Firestore denormalized data model | Optimize for NoSQL query patterns | ✅ Phase 3 data structure designed |

---
*Last updated: 2026-01-16 after initialization*