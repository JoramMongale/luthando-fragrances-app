# Codebase Structure

**Analysis Date:** 2026-01-16

## Directory Layout

```
luthando-fragrances/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin panel pages
│   │   ├── analytics/     # Analytics dashboard
│   │   ├── customers/     # Customer management
│   │   ├── orders/        # Order management
│   │   ├── products/      # Product management
│   │   ├── settings/      # Application settings
│   │   └── storage/       # File storage management
│   ├── api/               # API routes
│   │   └── payfast/notify/ # PayFast webhook handler
│   ├── auth/              # Authentication pages
│   │   ├── callback/      # Auth callback
│   │   ├── forgot-password/ # Password recovery
│   │   ├── login/         # Login page
│   │   ├── register/      # Registration page
│   │   └── reset-password/ # Password reset
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout process
│   ├── orders/            # User order history
│   ├── payment/           # Payment success/cancel pages
│   ├── profile/           # User profile
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Reusable UI components
│   ├── admin/            # Admin-specific components
│   │   ├── ImageGallery.tsx
│   │   ├── ImagePreview.tsx
│   │   └── ImageUpload.tsx
│   ├── ClientLayout.tsx  # Client-side layout wrapper
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── ProductCard.tsx
│   └── ui/               # UI components (empty)
├── contexts/             # React Context providers
│   └── AuthContext.tsx   # Authentication context
├── lib/                  # Business logic and utilities
│   ├── payments/         # Payment processing
│   │   └── payfast.ts    # PayFast integration
│   ├── admin-db.ts       # Admin database operations
│   ├── admin-storage.ts  # Admin storage operations
│   ├── admin.ts          # Admin utilities
│   ├── admin-utils.ts    # Additional admin utilities
│   ├── cart-store.ts     # Cart state management (Zustand)
│   ├── orders.ts         # Order management
│   ├── storage.ts        # Storage utilities
│   ├── supabase.ts       # Supabase client and queries
│   ├── utils.ts          # General utilities
│   └── whatsapp.ts       # WhatsApp integration
├── types/                # TypeScript type definitions
│   └── index.ts          # Core interfaces
├── public/               # Static assets
│   └── images/           # Static images
├── middleware.ts         # Next.js middleware
└── set-up-bash/          # Deployment scripts
```

## Directory Purposes

**app/:**
- Purpose: Next.js App Router pages and layouts
- Contains: Route-based pages, API routes, authentication flows
- Key files: `layout.tsx` (root layout), `page.tsx` (homepage)
- Subdirectories: Feature-based organization (admin, auth, cart, etc.)

**components/:**
- Purpose: Reusable React components
- Contains: UI components, admin components, layout components
- Key files: `ProductCard.tsx`, `Header.tsx`, `Footer.tsx`
- Subdirectories: `admin/` for admin-specific components

**contexts/:**
- Purpose: React Context providers for shared state
- Contains: Authentication context
- Key files: `AuthContext.tsx` (auth state management)
- Subdirectories: None

**lib/:**
- Purpose: Business logic, utilities, and external integrations
- Contains: Database operations, payment processing, state management, utilities
- Key files: `supabase.ts` (database client), `payfast.ts` (payment integration), `cart-store.ts` (state)
- Subdirectories: `payments/` for payment-related utilities

**types/:**
- Purpose: TypeScript type definitions
- Contains: Core interfaces for data models
- Key files: `index.ts` (Product, Order, UserProfile interfaces)
- Subdirectories: None

**public/:**
- Purpose: Static assets served directly
- Contains: Images, fonts, other static files
- Key files: None specific
- Subdirectories: `images/` for static images

## Key File Locations

**Entry Points:**
- `app/layout.tsx` - Root application layout with AuthProvider
- `app/page.tsx` - Homepage with product listing
- `middleware.ts` - Request middleware for route protection

**Configuration:**
- `package.json` - Dependencies and scripts
- `next.config.js` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `.env.local` - Environment variables

**Core Logic:**
- `lib/supabase.ts` - Database client and queries
- `lib/orders.ts` - Order management logic
- `lib/payments/payfast.ts` - Payment processing
- `lib/cart-store.ts` - Shopping cart state management

**Authentication:**
- `contexts/AuthContext.tsx` - Authentication state and hooks
- `app/auth/**/page.tsx` - Authentication pages
- `lib/admin.ts` - Admin access control

**Testing:**
- `test-payfast.js` - Manual payment testing script
- No automated test files currently

**Documentation:**
- `README.md` - Minimal project documentation
- `PAYFAST_TESTING.md` - Payment integration testing guide
- `PRODUCTION_CHECKLIST.md` - Deployment checklist

## Naming Conventions

**Files:**
- kebab-case for directories: `forgot-password/`, `reset-password/`
- PascalCase for components: `ProductCard.tsx`, `AuthContext.tsx`
- camelCase for utilities: `cart-store.ts`, `admin-db.ts`
- `page.tsx` for Next.js pages (App Router convention)
- `route.ts` for API route handlers

**Directories:**
- kebab-case for all directories
- Plural names for collections: `components/`, `contexts/`, `types/`
- Feature-based naming: `admin/`, `auth/`, `cart/`, `checkout/`

**Special Patterns:**
- `layout.tsx` for layout components
- `page.tsx` for page components
- `route.ts` for API route handlers
- `index.ts` for barrel exports (in `types/`)

## Where to Add New Code

**New Feature Page:**
- Primary code: `app/{feature-name}/page.tsx`
- Components: `components/{FeatureName}.tsx` if reusable
- Utilities: `lib/{feature-name}.ts` for business logic
- Types: Add to `types/index.ts` or create `types/{feature-name}.ts`

**New Admin Feature:**
- Primary code: `app/admin/{feature-name}/page.tsx`
- Components: `components/admin/{FeatureName}.tsx`
- Utilities: `lib/admin-{feature-name}.ts` or add to existing admin files
- Access control: Update `lib/admin.ts` if needed

**New API Route:**
- Definition: `app/api/{route-name}/route.ts`
- Handler: Implement in the route file
- Validation: Add validation logic in the route or shared utility

**New Utility Function:**
- Shared helpers: `lib/utils.ts` or create `lib/{domain}-utils.ts`
- Type definitions: `types/index.ts` or new type file
- External integration: `lib/{service-name}.ts`

**New Component:**
- Reusable UI: `components/{ComponentName}.tsx`
- Admin-specific: `components/admin/{AdminComponentName}.tsx`
- Layout: `components/{LayoutName}.tsx`

## Special Directories

**app/api/:**
- Purpose: Next.js API routes (serverless functions)
- Source: Implemented as route handlers
- Committed: Yes

**set-up-bash/:**
- Purpose: Deployment and setup scripts
- Source: Manual scripts for environment setup
- Committed: Yes

**public/images/:**
- Purpose: Static image assets
- Source: Manually added images
- Committed: Yes (for default/placeholder images)

---

*Structure analysis: 2026-01-16*
*Update when directory structure changes*