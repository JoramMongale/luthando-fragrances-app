# Coding Conventions

**Analysis Date:** 2026-01-16

## Naming Patterns

**Files:**
- kebab-case for directories (`forgot-password/`, `reset-password/`)
- PascalCase for React components (`ProductCard.tsx`, `AuthContext.tsx`)
- camelCase for utility files (`cart-store.ts`, `admin-db.ts`)
- `page.tsx` for Next.js pages (App Router convention)
- `route.ts` for API route handlers

**Functions:**
- camelCase for all functions (`getProducts`, `formatCurrency`, `handleAddToCart`)
- No special prefix for async functions
- Descriptive names indicating action (`generatePayFastForm`, `verifyPayFastSignature`)

**Variables:**
- camelCase for variables (`productList`, `orderTotal`, `userProfile`)
- No underscore prefix for private members (TypeScript handles visibility)
- Descriptive names reflecting content or purpose

**Types:**
- PascalCase for interfaces and types (`Product`, `Order`, `UserProfile`)
- No `I` prefix for interfaces
- Generic types with descriptive names (`CartStore`, `PayFastData`)

## Code Style

**Formatting:**
- 2 space indentation (consistent across all files)
- Single quotes for strings
- Semicolons required
- Reasonable line lengths (typically under 100 characters)

**Linting:**
- ESLint with Next.js configuration (`.eslintrc.json`)
- Extends `next/core-web-vitals`
- Several strict rules disabled:
  - `@typescript-eslint/no-explicit-any`: off
  - `@typescript-eslint/no-unused-vars`: off
  - `react-hooks/exhaustive-deps`: off
  - `react/no-unescaped-entities`: off
  - `@next/next/no-img-element`: off
- Run: `npm run lint`

## Import Organization

**Order:**
1. React imports (`'use client'`, `import React from 'react'`)
2. External libraries (`lucide-react`, `zustand`, `react-hook-form`)
3. Internal modules (`@/components/*`, `@/lib/*`, `@/contexts/*`)
4. Type imports (`import type { Product } from '@/types'`)

**Grouping:**
- Blank lines between import groups
- Alphabetical ordering within groups
- Type imports last within each group

**Path Aliases:**
- `@/` maps to project root (configured in `tsconfig.json`)
- Used for all internal imports

## Error Handling

**Patterns:**
- Mixed approach with console logging and some try/catch blocks
- Console.error for logging errors throughout codebase
- Some try/catch in critical paths (payment processing, order creation)
- No centralized error handling or error boundaries

**Error Types:**
- Throw on invalid input, missing dependencies
- Log error with context before throwing: `console.error('Error context:', error)`
- Include cause in error messages when possible
- Inconsistent error handling patterns across components

**Logging:**
- Console.log and console.error statements throughout
- No structured logging framework
- No external logging service integration
- Extensive error logging in production code as debugging aid

## Logging

**Framework:**
- Console API only (`console.log`, `console.error`)
- No structured logging library (pino, winston, etc.)

**Patterns:**
- Console.log for debugging information
- Console.error for error conditions
- Log at service boundaries and error points
- No console.log cleanup in production code

## Comments

**When to Comment:**
- Explain complex business logic
- Document non-obvious algorithms or workarounds
- Note security considerations
- Mark TODO items for future improvements

**JSDoc/TSDoc:**
- Minimal usage in codebase
- Some function documentation in complex utilities
- TypeScript interfaces serve as primary documentation

**TODO Comments:**
- Format: `// TODO: description`
- Some TODO comments present for future improvements
- No issue tracking integration

## Function Design

**Size:**
- Large functions in admin pages (300-500+ lines)
- Utility functions typically smaller (under 100 lines)
- No consistent size limits enforced

**Parameters:**
- Typically 1-3 parameters
- Use objects for complex parameter sets
- Some destructuring in parameter lists

**Return Values:**
- Explicit return statements
- Return early for guard clauses in some functions
- Async functions return Promises

## Module Design

**Exports:**
- Named exports preferred
- Default exports for React components
- Barrel exports from `types/index.ts`

**Barrel Files:**
- `types/index.ts` re-exports all type definitions
- No other barrel files currently
- Direct imports from specific files

---

*Convention analysis: 2026-01-16*
*Update when patterns change*