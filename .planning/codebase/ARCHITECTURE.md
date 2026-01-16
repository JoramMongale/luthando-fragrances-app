# Architecture

**Analysis Date:** 2026-01-16

## Pattern Overview

**Overall:** Next.js Monolithic Application with Client-Server Architecture

**Key Characteristics:**
- Full-stack Next.js 15 with App Router
- Monolithic web application with clear separation of concerns
- Serverless deployment on Vercel
- TypeScript for type safety
- Supabase backend-as-a-service

## Layers

**Presentation Layer:**
- Purpose: User interface and user experience
- Contains: Next.js pages (`app/**/page.tsx`), React components (`components/`), layouts
- Location: `app/`, `components/`
- Depends on: Business logic layer for data
- Used by: End users via web browser

**Business Logic Layer:**
- Purpose: Core application logic, data processing, state management
- Contains: Utility functions, payment processing, order management, authentication logic
- Location: `lib/`
- Depends on: Data layer for persistence
- Used by: Presentation layer

**Data Layer:**
- Purpose: Data persistence and external service integration
- Contains: Database client (`lib/supabase.ts`), storage utilities, external API clients
- Location: `lib/supabase.ts`, `lib/storage.ts`, `lib/admin-storage.ts`
- Depends on: External services (Supabase, PayFast)
- Used by: Business logic layer

**Infrastructure Layer:**
- Purpose: Application configuration, routing, middleware
- Contains: Next.js middleware, API routes, configuration files
- Location: `middleware.ts`, `app/api/`, config files
- Depends on: Platform services (Vercel, Node.js)
- Used by: All other layers

## Data Flow

**User Request Flow:**

1. User accesses URL → Middleware (`middleware.ts`) intercepts request
2. Middleware checks authentication and admin access
3. Next.js routes request to appropriate page component (`app/**/page.tsx`)
4. Page component fetches data via `lib/supabase.ts` or other utilities
5. Data is processed and rendered with React components
6. Response sent to user's browser

**Order Processing Flow:**

1. User adds items to cart (`lib/cart-store.ts`)
2. User proceeds to checkout (`app/checkout/page.tsx`)
3. Payment form generated via `lib/payments/payfast.ts`
4. User redirected to PayFast for payment
5. PayFast webhook calls `app/api/payfast/notify/route.ts`
6. Webhook validates signature and updates order status via `lib/orders.ts`
7. WhatsApp notification sent via `lib/whatsapp.ts`

**Authentication Flow:**

1. User submits credentials via `app/auth/login/page.tsx`
2. Auth context (`contexts/AuthContext.tsx`) calls Supabase Auth
3. Session established and stored in cookies
4. Middleware validates session for protected routes
5. Admin access verified via email whitelist in `lib/admin.ts`

**State Management:**
- Client-side: Zustand store for cart (`lib/cart-store.ts`) with localStorage persistence
- Server-side: Supabase sessions via cookies
- React Context: Authentication state (`contexts/AuthContext.tsx`)
- Component state: Local useState for UI state

## Key Abstractions

**Service:**
- Purpose: Encapsulate business logic for a domain
- Examples: `lib/orders.ts` (order management), `lib/payments/payfast.ts` (payment processing), `lib/whatsapp.ts` (messaging)
- Pattern: Module exports with related functions

**Store:**
- Purpose: Client-side state management
- Examples: `lib/cart-store.ts` (shopping cart state)
- Pattern: Zustand store with persistence middleware

**Context:**
- Purpose: React context for shared state
- Examples: `contexts/AuthContext.tsx` (authentication state)
- Pattern: React Context Provider with custom hooks

**Utility:**
- Purpose: Shared helper functions
- Examples: `lib/utils.ts` (formatting helpers), `lib/admin-utils.ts` (admin helpers)
- Pattern: Pure functions exported from modules

## Entry Points

**Application Entry:**
- Location: `app/layout.tsx`
- Triggers: Initial page load
- Responsibilities: Root layout, AuthProvider setup, global styles

**API Entry Points:**
- Payment webhook: `app/api/payfast/notify/route.ts`
- Triggers: PayFast payment notifications
- Responsibilities: Validate signatures, update orders, send notifications

**Admin Entry:**
- Location: `app/admin/page.tsx`
- Triggers: Admin navigation
- Responsibilities: Admin dashboard, access control verification

**Authentication Entry:**
- Location: `app/auth/login/page.tsx`, `app/auth/register/page.tsx`
- Triggers: User authentication actions
- Responsibilities: Credential collection, auth state management

## Error Handling

**Strategy:** Mixed approach with console logging and some try/catch blocks

**Patterns:**
- Console.error for logging errors throughout codebase
- Some try/catch blocks in critical paths (payment processing, order creation)
- No centralized error handling or error boundaries
- Inconsistent error handling patterns across components

## Cross-Cutting Concerns

**Logging:**
- Approach: Console.log and console.error statements throughout
- No structured logging framework
- No external logging service integration

**Validation:**
- Approach: Mixed - some Zod validation, some manual validation
- Form validation: react-hook-form with some Zod schemas
- API validation: Manual validation in webhook handler

**Authentication:**
- Approach: Supabase Auth with email/password
- Admin access: Email-based whitelist in `lib/admin.ts`
- Route protection: Middleware for admin routes

**Security:**
- Approach: Basic security measures
- Payment: Signature validation for PayFast webhooks
- Environment: Some secrets in environment variables
- Concerns: Public-facing secrets, outdated dependencies with vulnerabilities

---

*Architecture analysis: 2026-01-16*
*Update when major patterns change*