# External Integrations

**Analysis Date:** 2026-01-16

## APIs & External Services

**Payment Processing:**
- PayFast - South African payment gateway for e-commerce transactions
  - SDK/Client: Custom implementation in `lib/payments/payfast.ts`
  - Auth: API credentials in `NEXT_PUBLIC_PAYFAST_MERCHANT_ID`, `NEXT_PUBLIC_PAYFAST_MERCHANT_KEY`, `PAYFAST_PASSPHRASE` env vars
  - Endpoints used: Form submission, signature validation, webhook processing (`app/api/payfast/notify/route.ts`)

**Communication:**
- WhatsApp Business - Customer communication for order confirmations
  - Implementation: Custom integration in `lib/whatsapp.ts`
  - Configuration: `NEXT_PUBLIC_WHATSAPP_NUMBER` env var
  - Usage: Order notifications and customer support

## Data Storage

**Databases:**
- Supabase PostgreSQL - Primary data store for products, orders, users
  - Connection: Via `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` env vars
  - Client: @supabase/supabase-js v2.53.0 in `lib/supabase.ts`
  - Schema: Defined in TypeScript interfaces in `types/index.ts`

**File Storage:**
- Supabase Storage - Product images and file uploads
  - SDK/Client: @supabase/supabase-js v2.53.0
  - Auth: Service role key in Supabase configuration
  - Buckets: Product images, admin uploads (managed via `lib/storage.ts` and `lib/admin-storage.ts`)

**Caching:**
- None currently - All database queries, no Redis or similar

## Authentication & Identity

**Auth Provider:**
- Supabase Auth - Email/password authentication
  - Implementation: Supabase client SDK with server-side session management
  - Token storage: Cookies via @supabase/auth-helpers-nextjs
  - Session management: JWT tokens handled by Supabase

**Admin Access Control:**
- Email-based whitelist - Admin panel access control
  - Implementation: Email verification in `lib/admin.ts`
  - Configuration: Admin emails in environment or hardcoded list

## Monitoring & Observability

**Error Tracking:**
- Console logging - Basic error tracking via console.error
  - Implementation: Extensive console.error calls throughout codebase
  - No external error tracking service (Sentry, etc.)

**Analytics:**
- None currently - No product analytics integration

**Logs:**
- Console output - stdout/stderr only
  - Implementation: console.log and console.error statements
  - No structured logging service

## CI/CD & Deployment

**Hosting:**
- Vercel - Next.js app hosting
  - Deployment: Manual or automatic via Git integration
  - Environment vars: Configured in Vercel dashboard

**CI Pipeline:**
- Not configured - No automated testing or deployment pipeline
  - Manual deployment process
  - No GitHub Actions or similar CI/CD

## Environment Configuration

**Development:**
- Required env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_PAYFAST_MERCHANT_ID`, `NEXT_PUBLIC_PAYFAST_MERCHANT_KEY`, `PAYFAST_PASSPHRASE`
- Secrets location: `.env.local` (gitignored)
- Mock/stub services: PayFast sandbox mode, Supabase local development

**Staging:**
- Not configured - Single environment setup
- Uses same Supabase project as development

**Production:**
- Secrets management: Vercel environment variables
- Database: Supabase production project
- Payment: PayFast production credentials

## Webhooks & Callbacks

**Incoming:**
- PayFast - `/api/payfast/notify` (`app/api/payfast/notify/route.ts`)
  - Verification: Signature validation via MD5 hash in `lib/payments/payfast.ts`
  - Events: Payment status updates (complete, pending, failed)
  - IP validation: Source IP verification in production

**Outgoing:**
- WhatsApp notifications - Order confirmation messages
  - Trigger: Successful order placement
  - Implementation: `lib/whatsapp.ts` sendMessage function

---

*Integration audit: 2026-01-16*
*Update when adding/removing external services*