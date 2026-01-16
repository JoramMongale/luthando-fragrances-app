# Technology Stack

**Analysis Date:** 2026-01-16

## Languages

**Primary:**
- TypeScript 5.9.2 - All application code

**Secondary:**
- JavaScript (ESNext) - Build scripts, config files

## Runtime

**Environment:**
- Node.js - Implied by Next.js and package.json scripts
- Next.js 15.4.5 - Full-stack React framework

**Package Manager:**
- npm 10.x - Package management
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 15.4.5 - Full-stack React framework with App Router
- React 19.1.1 - UI library

**Testing:**
- No test framework currently configured
- Manual testing documented for critical paths

**Build/Dev:**
- TypeScript 5.9.2 - Type checking and compilation
- Tailwind CSS 3.4.17 - Utility-first CSS framework
- PostCSS 8.5.6 - CSS processing
- ESLint 9.32.0 - Code linting

## Key Dependencies

**Critical:**
- @supabase/supabase-js 2.53.0 - Database and authentication client (`lib/supabase.ts`)
- @supabase/auth-helpers-nextjs 0.10.0 - Authentication helpers
- zustand 5.0.7 - State management (`lib/cart-store.ts`)
- react-hook-form 7.62.0 - Form management
- zod 4.0.14 - Schema validation

**Infrastructure:**
- lucide-react - Icon library
- crypto-js - Cryptographic functions for payment signatures
- date-fns - Date manipulation utilities
- react-dropzone - File upload handling
- sharp - Image processing

## Configuration

**Environment:**
- `.env.local` files for environment variables
- Key configs: DATABASE_URL, API_KEY, PAYFAST credentials required

**Build:**
- `next.config.js` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `.eslintrc.json` - ESLint rules

## Platform Requirements

**Development:**
- Node.js environment
- Supabase account for database and authentication
- PayFast merchant account for payments

**Production:**
- Vercel deployment with serverless functions
- Supabase production project
- PayFast production credentials

---

*Stack analysis: 2026-01-16*
*Update after major dependency changes*