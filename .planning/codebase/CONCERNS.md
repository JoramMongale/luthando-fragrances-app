# Codebase Concerns

**Analysis Date:** 2026-01-16

## Tech Debt

**Outdated Next.js with Critical Vulnerabilities:**
- Issue: Next.js 15.4.5 has known critical vulnerabilities (SSRF, RCE, DoS)
- Files: `package.json` (line with "next": "15.4.5")
- Why: Not updated to latest secure version
- Impact: Security vulnerabilities exposed to production
- Fix approach: Update to Next.js 15.4.9+ immediately

**Hardcoded Supabase Credentials:**
- Issue: `NEXT_PUBLIC_SUPABASE_ANON_KEY` exposed in `.env.local` file
- Files: `.env.local` (lines 2-3)
- Why: Client-side Supabase usage requires public key
- Impact: Security risk if key is compromised
- Fix approach: Implement server-side Supabase client for sensitive operations

**Missing .env.example File:**
- Issue: No template for environment variables exists
- Files: Root directory (missing `.env.example`)
- Why: Not created during project setup
- Impact: Difficult onboarding, environment configuration errors
- Fix approach: Create `.env.example` with all required variables

## Known Bugs

**Admin Middleware Lacks JWT Verification:**
- Symptoms: Admin routes protected only by email check, not authentication
- Files: `middleware.ts` (line 17 comment acknowledges issue)
- Trigger: Direct access to `/admin/*` routes
- Workaround: None
- Root cause: Missing JWT token verification in production
- Fix: Implement proper JWT verification in middleware

**Console.log Statements in Production Code:**
- Symptoms: Debug output visible in production
- Files: Multiple files with console.log statements
- Trigger: Normal application usage
- Workaround: None
- Root cause: Debug statements not removed
- Fix: Remove or conditionally enable console.log statements

## Security Considerations

**Public-facing Secrets:**
- Risk: PayFast passphrase and merchant keys exposed in client-side code
- Files: `.env.local` (lines 13-15), `lib/payments/payfast.ts`
- Current mitigation: Environment variables
- Recommendations: Move sensitive operations to server-side API routes

**Weak Cryptographic Signatures:**
- Risk: PayFast uses MD5 for signatures which is cryptographically weak
- Files: `lib/payments/payfast.ts` (line 100)
- Current mitigation: IP validation as additional security layer
- Recommendations: Upgrade to SHA-256 if PayFast supports it

**Missing Input Validation:**
- Risk: Insufficient validation of webhook data and user input
- Files: `app/api/payfast/notify/route.ts`, various form components
- Current mitigation: Basic validation in some forms
- Recommendations: Implement comprehensive Zod schemas for all inputs

## Performance Bottlenecks

**Large Bundle Sizes:**
- Problem: Admin pages are 300-500+ lines without code splitting
- Files: `app/admin/products/page.tsx` (526 lines), `app/admin/settings/page.tsx` (507 lines)
- Measurement: Not measured, but likely large bundle sizes
- Cause: No code splitting or lazy loading
- Improvement path: Implement dynamic imports for admin pages

**No Image Optimization:**
- Problem: Product images may not be optimized
- Files: `components/ProductCard.tsx`, `components/admin/ImageGallery.tsx`
- Measurement: Not measured
- Cause: No Next.js Image component usage
- Improvement path: Replace img tags with Next.js Image component

## Fragile Areas

**Payment Webhook Handler:**
- Files: `app/api/payfast/notify/route.ts`
- Why fragile: Critical business logic with limited error handling
- Common failures: Signature validation failures, database update errors
- Safe modification: Add comprehensive logging, implement idempotency
- Test coverage: No automated tests

**Cart State Management:**
- Files: `lib/cart-store.ts`
- Why fragile: Zustand store with localStorage persistence
- Common failures: localStorage quota exceeded, serialization errors
- Safe modification: Add error boundaries for storage operations
- Test coverage: No tests

**Admin Authentication:**
- Files: `lib/admin.ts`, `middleware.ts`
- Why fragile: Email-based whitelist without proper authentication
- Common failures: Unauthorized access if email list not maintained
- Safe modification: Implement proper role-based access control
- Test coverage: No tests

## Scaling Limits

**Supabase Free Tier:**
- Current capacity: 500MB database, 2GB bandwidth/month
- Limit: Estimated 1000-5000 users before hitting limits
- Symptoms at limit: 429 rate limit errors, database writes fail
- Scaling path: Upgrade to Supabase Pro plan

**Vercel Hobby Plan:**
- Current capacity: 10s function timeout, 100GB-hrs/month
- Limit: Concurrent users and processing time
- Symptoms at limit: 504 gateway timeouts, function execution limits
- Scaling path: Upgrade to Vercel Pro plan

## Dependencies at Risk

**Next.js 15.4.5:**
- Risk: Multiple critical security vulnerabilities
- Impact: SSRF, RCE, DoS vulnerabilities in production
- Migration plan: Update to 15.4.9+ immediately

**@supabase/supabase-js 2.53.0:**
- Risk: Outdated (latest is 2.90.1)
- Impact: Missing features, potential bugs
- Migration plan: Update to latest version

**Tailwind CSS 3.4.17:**
- Risk: Major version behind (latest is 4.1.18)
- Impact: Missing new features, utilities
- Migration plan: Consider upgrading to v4

## Missing Critical Features

**Automated Testing:**
- Problem: No test framework or automated tests
- Current workaround: Manual testing only
- Blocks: Confidence in changes, regression detection
- Implementation complexity: Medium (setup test framework, write initial tests)

**Error Monitoring:**
- Problem: No error tracking service (Sentry, etc.)
- Current workaround: Console.error statements
- Blocks: Production issue detection and debugging
- Implementation complexity: Low (add Sentry integration)

**API Documentation:**
- Problem: No documentation for payment webhook API
- Current workaround: Code inspection only
- Blocks: Integration with other systems
- Implementation complexity: Low (create OpenAPI/Swagger docs)

## Test Coverage Gaps

**Payment Processing:**
- What's not tested: PayFast form generation, signature validation, webhook handling
- Risk: Payment failures, revenue loss, security breaches
- Priority: High
- Difficulty to test: Medium (need mock PayFast environment)

**Order Management:**
- What's not tested: Order creation, status updates, validation
- Risk: Order processing errors, data corruption
- Priority: High
- Difficulty to test: Low (unit testable functions)

**Authentication Flow:**
- What's not tested: Login, registration, session management
- Risk: Authentication failures, security breaches
- Priority: High
- Difficulty to test: Medium (need mock Supabase auth)

---

*Concerns audit: 2026-01-16*
*Update as issues are fixed or new ones discovered*