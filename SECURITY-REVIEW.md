# CafeMate Security Review

**Date:** 2026-06-17
**Scope:** Full application codebase (`src/`)
**Reviewed by:** Claude Code (automated + manual analysis)

---

## Executive Summary

CafeMate's security posture is **strong overall**. The application demonstrates security-conscious design across authentication, tenant isolation, and data handling. Critical foundations - bcrypt password hashing, AES-256-GCM encryption for DB URLs, subdomain-based tenant isolation with validated slugs, Zod input validation, and proper role-based access control - are all implemented correctly.

The findings below are **hardening improvements**, not active exploits. They are prioritized by business risk: what could cost the most money, reputation, or customer trust if left unaddressed.

---

## Findings Summary

| # | Finding | Severity | Effort | Business Risk |
|---|---------|----------|--------|---------------|
| 1 | [Cron secret accepted via query parameter](#1-cron-secret-accepted-via-query-parameter) | HIGH | 10 min | Secret leakage via logs |
| 2 | [Plaintext credentials in tenant provisioning response](#2-plaintext-credentials-in-tenant-provisioning-response) | HIGH | 30 min | Credential exposure |
| 3 | [Weak password policy on admin password change](#3-weak-password-policy-on-admin-password-change) | HIGH | 10 min | Weak accounts created |
| 4 | [CSP allows unsafe-eval and unsafe-inline](#4-csp-allows-unsafe-eval-and-unsafe-inline) | MEDIUM | 45 min | XSS attack surface |
| 5 | [Rate limiter uses spoofable x-forwarded-for](#5-rate-limiter-uses-spoofable-x-forwarded-for) | MEDIUM | 10 min | Rate limit bypass |
| 6 | [Inventory routes lack Zod validation](#6-inventory-routes-lack-zod-validation) | MEDIUM | 25 min | Bad data in DB |
| 7 | [Cached tenant connections skip subscription re-check](#7-cached-tenant-connections-skip-subscription-re-check) | MEDIUM | 30 min | Suspended tenants retain access |
| 8 | [console.error leaks in tenant config route](#8-consoleerror-leak-in-tenant-config-route) | LOW | 2 min | Internal details in logs |
| 9 | [console.log in client-side login page](#9-consolelog-in-client-side-login-page) | LOW | 2 min | Debug info in browser console |
| 10 | [No audit trail for password changes](#10-no-audit-trail-for-password-changes) | LOW | 15 min | Non-repudiation gap |
| 11 | [Super-admin tenant list has no pagination](#11-super-admin-tenant-list-has-no-pagination) | LOW | 15 min | Performance DoS at scale |
| 12 | [Default tenant passwords are weak and predictable](#12-default-tenant-passwords-are-weak-and-predictable) | MEDIUM | 20 min | Compromised new tenants |

---

## Detailed Findings & Solutions

---

### 1. Cron secret accepted via query parameter

**Severity:** HIGH
**Files:**
- `src/app/api/cron/check-subscriptions/route.ts:32`
- `src/app/api/cron/measure-usage/route.ts:17`

**The Problem:**
Both cron endpoints accept the `CRON_SECRET` via `?secret=<value>` in the URL query string. Query parameters end up in:
- Server access logs (Vercel, nginx, CloudFront)
- Browser address bars and history
- HTTP `Referer` headers sent to external resources
- CDN/WAF logs (Cloudflare, AWS WAF)
- Monitoring tools (Datadog, New Relic request traces)

If any of these logs are accessed by an unauthorized party, they have the CRON_SECRET and can trigger subscription checks or usage measurements at will.

**Current Code:**
```typescript
const querySecret = request.nextUrl.searchParams.get("secret");
// ...
const isAuthorized =
  authHeader === `Bearer ${cronSecret}` ||
  cronSecretHeader === cronSecret ||
  querySecret === cronSecret;  // <-- This line
```

**The Decision:**

The query parameter was likely added as a convenience during development (easy to test in browser). But it introduces real risk in production. Vercel Cron Jobs send requests server-side with headers - they don't need query params.

**Recommendation:** Remove query parameter support. Keep `Authorization: Bearer` header (standard) and `x-cron-secret` header (Vercel-friendly).

**Solution:**
```typescript
// In both cron route files, remove these lines:
const querySecret = request.nextUrl.searchParams.get("secret");

// And simplify the auth check to:
const isAuthorized =
  authHeader === `Bearer ${cronSecret}` ||
  cronSecretHeader === cronSecret;
```

**Files to change:**
1. `src/app/api/cron/check-subscriptions/route.ts` - Remove line 32 (`querySecret`), remove `querySecret` from line 44
2. `src/app/api/cron/measure-usage/route.ts` - Remove line 17 (`querySecret`), remove `querySecret` from line 26
3. `src/app/api/orders/auto-complete/route.ts` - Verify same pattern (currently only uses headers - already good)

---

### 2. Plaintext credentials in tenant provisioning response

**Severity:** HIGH
**Files:**
- `src/app/api/super-admin/tenants/route.ts:67`
- `src/lib/services/tenant-provisioning.ts:198-200`
- `src/lib/services/database-manager.ts:584-588`

**The Problem:**

When a super admin creates a new tenant, the API returns default credentials in plaintext:
```json
{
  "credentials": {
    "admin": { "email": "admin@cafe-abc.com", "password": "admin123" },
    "kitchen": { "email": "kitchen@cafe-abc.com", "password": "kitchen123" },
    "staff": { "email": "staff@cafe-abc.com", "password": "staff123" }
  }
}
```

This means:
- Plaintext passwords traverse the network (even over HTTPS, they exist in memory at both ends)
- The response may be cached by the browser, stored in DevTools history, or captured by browser extensions
- The default passwords themselves (`admin123`, `kitchen123`, `staff123`) are trivially guessable

Additionally, the provisioning function returns the **unencrypted database URL** in the response (`databaseUrl: databaseUrl`), which is the most sensitive piece of data in the entire system.

**The Decision:**

This is a first-use onboarding flow. The super admin needs to communicate credentials to the new tenant owner somehow. Options:

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| A. Return in API response (current) | Simple, immediate | Credentials in browser memory/logs, weak defaults | Current - risky |
| B. Display once, never store | Same UX, one-time display | Still in browser memory; defaults still weak | Better but not enough |
| C. Generate strong random passwords, display once | Strong passwords, one-time display | User must copy them somewhere; still in response | **Best practical option** |
| D. Send via email with forced password change | Credentials never in browser | Adds email dependency; more complex | Good but over-engineered for now |

**Recommendation:** Option C - Generate strong random passwords on provisioning, return them once in the API response (acceptable since it's SUPER_ADMIN-only over HTTPS), and **remove the raw database URL from the response** (there's no reason the super admin needs to see it in the UI).

**Solution:**

*database-manager.ts* - Generate random passwords instead of hardcoded ones:
```typescript
import crypto from "crypto";

function generateSecurePassword(): string {
  // 12 chars: mix of upper, lower, digits, specials
  const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const specials = "@#$%&!";
  let password = "";
  for (let i = 0; i < 10; i++) {
    password += chars[crypto.randomInt(chars.length)];
  }
  // Insert 2 special chars at random positions
  for (let i = 0; i < 2; i++) {
    const pos = crypto.randomInt(password.length);
    password = password.slice(0, pos) + specials[crypto.randomInt(specials.length)] + password.slice(pos);
  }
  return password;
}

const credentials: TenantCredentials = {
  admin: { email: `admin@${seedData.tenantSlug}.com`, password: generateSecurePassword() },
  kitchen: { email: `kitchen@${seedData.tenantSlug}.com`, password: generateSecurePassword() },
  staff: { email: `staff@${seedData.tenantSlug}.com`, password: generateSecurePassword() },
};
```

*tenant-provisioning.ts* - Stop returning the raw database URL:
```typescript
return {
  success: true,
  tenantId: tenant.id,
  slug: tenant.slug,
  // databaseUrl removed - never expose raw DB URLs in API responses
  loginUrl,
  credentials,
};
```

**Files to change:**
1. `src/lib/services/database-manager.ts` - Replace hardcoded passwords with random generation (~line 584-588)
2. `src/lib/services/tenant-provisioning.ts` - Remove `databaseUrl` from return object (line 198)
3. `src/lib/services/tenant-provisioning.ts` - Remove `databaseUrl` from `ProvisionTenantResult` interface (line 38)

---

### 3. Weak password policy on admin password change

**Severity:** HIGH
**File:** `src/app/api/admin/users/[userId]/password/route.ts:33`

**The Problem:**

The admin password change endpoint enforces only `length >= 6`:
```typescript
if (!newPassword || newPassword.length < 6) {
  return NextResponse.json(
    { error: "Password must be at least 6 characters" },
    { status: 400 }
  );
}
```

Meanwhile, the user creation schema (`src/lib/validations/user.ts:19-26`) enforces:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

This inconsistency means a tenant admin could set any user's password to `aaaaaa` - completely bypassing the strong password policy that was carefully defined.

**The Decision:**

There's a ready-made `passwordSchema` in `src/lib/validations/user.ts` that does exactly what we need. The password change route should use it. However, the admin password reset (changing someone else's password) shouldn't require `currentPassword` or `confirmPassword` - those are for self-service changes only.

**Recommendation:** Create a simpler admin-reset schema that reuses the core `passwordSchema` for the new password but doesn't require current/confirm password when an admin resets a subordinate's password.

**Solution:**

In the password route, replace the manual validation with:
```typescript
import { passwordSchema } from "@/lib/validations/user";

// Validate new password strength
const passwordResult = passwordSchema.safeParse(newPassword);
if (!passwordResult.success) {
  return NextResponse.json(
    { error: passwordResult.error.errors[0].message },
    { status: 400 }
  );
}
```

This gives us consistent 8+ character passwords with complexity requirements everywhere, with zero new code - just reusing the existing schema.

**Files to change:**
1. `src/app/api/admin/users/[userId]/password/route.ts` - Replace manual length check with `passwordSchema` validation

---

### 4. CSP allows unsafe-eval and unsafe-inline

**Severity:** MEDIUM
**File:** `next.config.js:101-102`

**The Problem:**

```javascript
script-src 'self' 'unsafe-inline' 'unsafe-eval';
style-src 'self' 'unsafe-inline';
```

- `'unsafe-eval'` allows `eval()`, `Function()`, and `setTimeout("string")` - if an attacker can inject content, they can execute arbitrary JavaScript.
- `'unsafe-inline'` allows any `<script>` tag or inline event handler - significantly weakens the CSP against XSS.

**The Decision:**

This is a trade-off between security and development complexity. Let's be pragmatic:

| Directive | Can we remove it? | Impact |
|-----------|-------------------|--------|
| `unsafe-eval` | **Likely yes.** Check if any dependency needs it. Next.js dev mode uses it, but that's fine - dev CSP doesn't matter. In production, most apps don't need it. | Blocks eval-based XSS |
| `unsafe-inline` for scripts | **Hard.** Next.js injects inline scripts for hydration. The proper fix is nonce-based CSP, which requires Next.js middleware and `nonce` propagation. This is a significant effort. | Blocks inline script XSS |
| `unsafe-inline` for styles | **Very hard.** Tailwind and most CSS-in-JS solutions rely on inline styles. Removing this breaks styling. | Not worth the effort |

**Recommendation:** Remove `unsafe-eval` from production CSP (keep in dev if needed). Leave `unsafe-inline` for now - the cost of implementing nonce-based CSP in Next.js 14 is high and the risk is mitigated by other controls (React's built-in XSS protection, no `dangerouslySetInnerHTML` with user input).

**Solution:**

```javascript
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ''};
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https: blob:;
  font-src 'self' data:;
  ${connectSrc};
  worker-src 'self';
  frame-ancestors 'self';
  base-uri 'self';
  ${formAction};
  ${upgradeInsecure}
`.replace(/\s{2,}/g, ' ').trim();
```

This removes `unsafe-eval` in production while keeping it for development (where Next.js Fast Refresh needs it). The inline change is safe - if any production dependency actually needs `eval`, the app will break visibly in staging, not silently.

**Files to change:**
1. `next.config.js` - Conditionally include `unsafe-eval` only in development

**Follow-up (future):** If you decide to implement nonce-based CSP later, Next.js 14 supports it via middleware. That would let you remove `unsafe-inline` for scripts too.

---

### 5. Rate limiter uses spoofable x-forwarded-for

**Severity:** MEDIUM
**File:** `src/middleware.ts:28`

**The Problem:**

```typescript
const identifier = req.ip ?? req.headers.get("x-forwarded-for") ?? "unknown";
```

The `x-forwarded-for` header is client-controlled. An attacker can send a different value with each request to get a fresh rate limit bucket every time, completely bypassing rate limiting.

The fallback to `"unknown"` means all requests without an IP or XFF header share one bucket. This is a shared-bucket DoS vector - one attacker exhausting the `"unknown"` bucket blocks all other unidentified requests.

**The Decision:**

On Vercel (the deployment target), `req.ip` is reliable and already the first choice. The XFF fallback only kicks in if `req.ip` is null, which shouldn't happen on Vercel. So this is more of a defense-in-depth concern than an active risk.

However, the `"unknown"` fallback is a real problem if the app is ever deployed elsewhere (Docker, self-hosted). Better to fail safe.

**Recommendation:** Remove the XFF fallback. Use only `req.ip`, and if it's not available, use a hash that includes more request attributes to create per-client buckets.

**Solution:**

```typescript
// Use req.ip (reliable on Vercel) or derive from connection
const identifier = req.ip || "anonymous";
```

On Vercel, `req.ip` is always set. If you move to self-hosted later, you'd configure the reverse proxy (nginx/Caddy) to set `x-real-ip` and use that instead.

**Files to change:**
1. `src/middleware.ts` - Simplify identifier to `req.ip || "anonymous"`

---

### 6. Inventory routes lack Zod validation

**Severity:** MEDIUM
**Files:**
- `src/app/api/inventory/route.ts:72-88` (POST)
- `src/app/api/inventory/[id]/route.ts:60-69` (PATCH)

**The Problem:**

Every other mutation endpoint uses Zod schemas: orders, products, creditors, categories, tenants. But inventory routes use manual validation with `parseFloat()`:

```typescript
const { inventoryId, productId, currentStock, minimumStock, maximumStock } = body;

if (!inventoryId || currentStock === undefined || minimumStock === undefined) {
  // ... basic presence check only
}

currentStock: parseFloat(currentStock),   // parseFloat("abc") = NaN
minimumStock: parseFloat(minimumStock),   // parseFloat("-999") = -999
maximumStock: maximumStock ? parseFloat(maximumStock) : null,  // no upper bound
```

Issues:
- `parseFloat("abc123")` returns `NaN`, which gets stored in the database
- No range validation: negative stock, absurdly large numbers
- No type checking on `inventoryId` or `productId`
- PATCH endpoint has zero validation - any value is accepted

**The Decision:**

This is a consistency gap. The validation pattern is well-established in the codebase. The fix is straightforward: create an inventory validation schema and apply it.

**Recommendation:** Create `src/lib/validations/inventory.ts` with schemas for create and update operations, matching the patterns used elsewhere.

**Solution:**

Create a new validation file:
```typescript
// src/lib/validations/inventory.ts
import { z } from "zod";

const cuidSchema = z.string().min(1, "ID is required");

export const createInventoryItemSchema = z.object({
  inventoryId: cuidSchema,
  productId: cuidSchema.optional().nullable(),
  currentStock: z
    .number()
    .min(0, "Stock cannot be negative")
    .max(999999, "Stock value too large"),
  minimumStock: z
    .number()
    .min(0, "Minimum stock cannot be negative")
    .max(999999, "Minimum stock value too large"),
  maximumStock: z
    .number()
    .min(0, "Maximum stock cannot be negative")
    .max(999999, "Maximum stock value too large")
    .optional()
    .nullable(),
});

export const updateInventoryItemSchema = z.object({
  currentStock: z
    .number()
    .min(0, "Stock cannot be negative")
    .max(999999, "Stock value too large")
    .optional(),
  minimumStock: z
    .number()
    .min(0, "Minimum stock cannot be negative")
    .max(999999, "Minimum stock value too large")
    .optional(),
  maximumStock: z
    .number()
    .min(0, "Maximum stock cannot be negative")
    .max(999999, "Maximum stock value too large")
    .optional()
    .nullable(),
});
```

Then use these schemas in the inventory routes, replacing the manual validation.

**Files to change:**
1. Create `src/lib/validations/inventory.ts`
2. `src/app/api/inventory/route.ts` - Import and use `createInventoryItemSchema`
3. `src/app/api/inventory/[id]/route.ts` - Import and use `updateInventoryItemSchema`

---

### 7. Cached tenant connections skip subscription re-check

**Severity:** MEDIUM
**File:** `src/lib/prisma-multi-tenant.ts:69-72`

**The Problem:**

```typescript
export async function getTenantPrisma(tenantSlug: string): Promise<PrismaClient> {
  // Check cache first
  if (tenantPrismaClients.has(tenantSlug)) {
    return tenantPrismaClients.get(tenantSlug)!;  // <-- returns immediately
  }
  // ... subscription checks only happen below, for new connections
}
```

Once a tenant's Prisma client is cached, all subsequent requests skip the subscription status validation (ACTIVE/TRIAL check, payment due check, suspended check). A tenant who is suspended by a super admin continues to have full access until the server restarts or is redeployed.

**The Decision:**

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| A. Check master DB on every request | Always accurate | Adds 1 DB query per API call (~5-20ms); doubles master DB load | Too expensive |
| B. TTL-based cache (re-check every N minutes) | Balance of accuracy and performance | Suspended tenant has access for up to N minutes | **Best trade-off** |
| C. Evict cache on status change | Instant enforcement, no performance cost | Only works if suspension goes through our API (not direct DB) | Good complement to B |
| D. Keep current behavior | Zero performance cost | Suspended tenants keep access indefinitely | Not acceptable |

**Recommendation:** Option B + C combined. Add a 5-minute TTL to cached connections (so status is re-validated periodically), AND evict the cache when a super admin changes a tenant's status. This gives instant enforcement for admin actions and a safety net for edge cases.

**Solution:**

Change the cache to store timestamps alongside clients:
```typescript
interface CachedTenantClient {
  client: PrismaClient;
  cachedAt: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const tenantPrismaClients = new Map<string, CachedTenantClient>();

export async function getTenantPrisma(tenantSlug: string): Promise<PrismaClient> {
  const cached = tenantPrismaClients.get(tenantSlug);

  // Return cached client if still within TTL
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
    return cached.client;
  }

  // If expired, keep the client connection but re-validate subscription
  // ... (existing subscription check code runs here)

  // On successful validation, update cache timestamp (reuse existing client if available)
  if (cached) {
    cached.cachedAt = Date.now();
    return cached.client;
  }

  // ... create new client for first-time connections
}
```

Then in the suspend/reactivate super-admin endpoints, call `disconnectTenant(slug)` to force immediate cache eviction.

**Files to change:**
1. `src/lib/prisma-multi-tenant.ts` - Add TTL to cache, restructure `getTenantPrisma`
2. `src/app/api/super-admin/tenants/[slug]/suspend/route.ts` - Add `disconnectTenant()` call
3. `src/app/api/super-admin/tenants/[slug]/reactivate/route.ts` - Add `disconnectTenant()` call

---

### 8. console.error leak in tenant config route

**Severity:** LOW
**File:** `src/app/api/tenant/config/route.ts:39`

**The Problem:**

```typescript
} catch (error) {
    console.error("Error fetching tenant config:", error);
```

This is the only API route still using raw `console.error` instead of the sanitized `logger`. The full error object (which could contain database connection strings, query details, or stack traces) goes to production logs unsanitized.

Every other API route uses `logger.error()` which redacts sensitive keys and excludes stack traces in production.

**Solution:**

```typescript
} catch (error) {
    logger.error("Error fetching tenant config", error instanceof Error ? error : undefined);
```

**Files to change:**
1. `src/app/api/tenant/config/route.ts` - Replace `console.error` with `logger.error`, add import for `logger`

---

### 9. console.log in client-side login page

**Severity:** LOW
**File:** `src/app/(auth)/login/page.tsx:72,75`

**The Problem:**

```typescript
console.log("Redirecting to:", redirectUrl);
// ...
console.error("Login error:", error);
```

These run in the browser. Any user can open DevTools and see redirect URLs and login error details. Not a direct vulnerability, but it's unprofessional and could leak error internals.

**Solution:**

Remove both console statements. The redirect is visible in the browser's network tab anyway, and error handling already sets `setError("Something went wrong...")` for the UI.

```typescript
// Remove: console.log("Redirecting to:", redirectUrl);
window.location.href = redirectUrl;
} catch (error) {
  // Remove: console.error("Login error:", error);
  setError("Something went wrong. Please try again.");
  setIsLoading(false);
}
```

**Files to change:**
1. `src/app/(auth)/login/page.tsx` - Remove console.log on line 72 and console.error on line 75

---

### 10. No audit trail for password changes

**Severity:** LOW
**File:** `src/app/api/admin/users/[userId]/password/route.ts`

**The Problem:**

When an admin changes a user's password, there's no audit log. If a malicious admin changes a staff member's password and performs actions on their behalf, there's no record. Compare this to the super-admin endpoints which log every action to `tenantActivityLog`.

**The Decision:**

This is about non-repudiation. In a cafe management system, this matters less than in a financial system. But it's still good practice, especially since the audit logging pattern already exists in the codebase.

**Recommendation:** Add a simple notification/log entry when an admin resets someone else's password. Don't over-engineer it - a notification to the affected user is sufficient.

**Solution:**

After the password update succeeds, create a notification:
```typescript
// Only log when admin changes ANOTHER user's password (not their own)
if (!isOwnPassword) {
  await prisma.notification.create({
    data: {
      type: "SYSTEM",
      title: "Password Changed",
      message: `Your password was reset by an administrator. If you did not request this, contact your admin immediately.`,
      userId: userId,
      locationId: user.locationId,
      priority: "HIGH",
    },
  }).catch(() => {}); // Don't fail the password change if notification fails
}
```

**Files to change:**
1. `src/app/api/admin/users/[userId]/password/route.ts` - Add notification after password update

---

### 11. Super-admin tenant list has no pagination

**Severity:** LOW
**File:** `src/app/api/super-admin/tenants/route.ts:107-124`

**The Problem:**

The GET endpoint returns all tenants in one response with no pagination:
```typescript
const tenants = await masterPrisma.tenant.findMany({
  where,
  orderBy: { createdAt: "desc" },
  // no skip/take
});
```

With 10 tenants this is fine. With 500, it's a slow response. With 5000, it could timeout or exhaust memory.

**The Decision:**

This is a scalability issue, not a security issue. Since the endpoint is SUPER_ADMIN-only, there's no risk of external abuse. But good engineering means planning for growth.

**Recommendation:** Add optional pagination, defaulting to unpaginated for backward compatibility.

**Solution:**

```typescript
const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50")));

const [tenants, total] = await Promise.all([
  masterPrisma.tenant.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
    select: { /* existing select */ },
  }),
  masterPrisma.tenant.count({ where }),
]);

return NextResponse.json({
  tenants,
  pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
});
```

**Files to change:**
1. `src/app/api/super-admin/tenants/route.ts` - Add pagination to GET handler

---

### 12. Default tenant passwords are weak and predictable

**Severity:** MEDIUM
**File:** `src/lib/services/database-manager.ts:584-588`

**The Problem:**

```typescript
const credentials: TenantCredentials = {
  admin: { email: `admin@${seedData.tenantSlug}.com`, password: "admin123" },
  kitchen: { email: `kitchen@${seedData.tenantSlug}.com`, password: "kitchen123" },
  staff: { email: `staff@${seedData.tenantSlug}.com`, password: "staff123" },
};
```

Every new tenant starts with the same predictable passwords. If a tenant doesn't change these immediately (and many won't), anyone who knows the pattern can log in as admin to any newly provisioned tenant.

The email pattern is also predictable: `admin@<slug>.com`. An attacker who knows a tenant's slug (visible in the subdomain) can attempt login with `admin@<slug>.com` / `admin123`.

**The Decision:**

This is connected to Finding #2. The fix for both is the same: generate random passwords during provisioning.

This is already covered in the solution for Finding #2. See that section for the implementation.

**Files to change:**
1. Same as Finding #2 - `src/lib/services/database-manager.ts`

---

## What's Already Done Well

These areas were reviewed and found to be properly implemented. No changes needed.

### Authentication & Session Management
- **bcrypt password hashing** with salt rounds of 10 across all password storage
- **Account lockout** after 5 failed attempts with 30-minute duration
- **Login rate limiting** that fails closed (denies logins when Redis is unavailable)
- **JWT sessions** with 24-hour expiry and proper cookie flags (`httpOnly`, `secure`, `sameSite: "lax"`)
- **`__Secure-` cookie prefix** in production, subdomain-scoped (no cross-tenant session sharing)

### Multi-Tenant Isolation
- **Subdomain-based tenant resolution** from `Host` header (not user-controlled input)
- **Tenant slug validation** with strict regex: `^[a-z0-9]([a-z0-9-]*[a-z0-9])?$`, 3-30 chars
- **Tenant slug in JWT** - all API calls use the tenant from the authenticated session, never from request params
- **AES-256-GCM encryption** for database URLs with random IV per encryption, proper auth tag
- **Encryption key validation** at startup - rejects placeholders, validates 32-byte length
- **Per-tenant Prisma clients** with connection pooling and limits (max 100)

### Input Validation & Injection Prevention
- **Zod schemas** on all critical mutation endpoints (orders, products, categories, creditors, tenants)
- **Parameterized raw SQL** via Prisma's `$queryRaw` tagged templates (not string interpolation)
- **Database identifier sanitization** in tenant provisioning (`/^[a-z0-9_]+$/`)
- **No eval/exec/child_process** usage in application code
- **No unsafe `dangerouslySetInnerHTML`** with user input (only used for hardcoded structured data)

### API Security
- **Role-based access control** on every endpoint - ADMIN, STAFF, KITCHEN_STAFF, SUPER_ADMIN
- **Location-based access control** - staff can only see orders/data from their assigned location
- **Consistent auth pattern** across all 57+ API routes: `getServerSession` -> check role -> get tenant from session
- **IDOR protection** via location checks on order access and updates

### Security Headers
- **HSTS** with 2-year max-age, includeSubDomains, preload
- **X-Frame-Options: SAMEORIGIN** + `frame-ancestors 'self'` in CSP
- **X-Content-Type-Options: nosniff**
- **Referrer-Policy: strict-origin-when-cross-origin**
- **Permissions-Policy** disabling camera, microphone, geolocation, payment

### Error Handling
- **Custom logger** sanitizes sensitive keys (password, token, secret, apiKey, etc.)
- **Stack traces excluded** from production logs
- **Generic error messages** in API responses ("Failed to fetch orders" not "Prisma query failed at...")
- **Environment validation** at startup prevents deployment with placeholder secrets

### Infrastructure
- **.env in .gitignore** - environment files not committed to git
- **Graceful shutdown handlers** for database connections
- **Subscription status checks** block access at the database level for expired/suspended tenants
- **Vercel Cron** with CRON_SECRET for scheduled tasks (just needs the query param fix)

---

## Implementation Priority

For a solo developer or small team, here's the order I'd tackle these in, grouped by "deploy session":

### Session 1: Quick Wins (30 minutes total)
These are copy-paste simple and eliminate the highest-risk items:

1. **Finding #1** - Remove cron query param secret (10 min)
2. **Finding #3** - Use `passwordSchema` in admin password route (10 min)
3. **Finding #8** - Replace console.error with logger (2 min)
4. **Finding #9** - Remove console.log from login page (2 min)

### Session 2: Input Validation (30 minutes total)
5. **Finding #6** - Create inventory Zod schemas and apply them (25 min)

### Session 3: Credential Hardening (40 minutes total)
6. **Finding #2 + #12** - Random passwords + remove DB URL from response (30 min)

### Session 4: Infrastructure Hardening (1.5 hours total)
7. **Finding #4** - Tighten CSP (remove unsafe-eval in prod) (15 min)
8. **Finding #5** - Simplify rate limit identifier (10 min)
9. **Finding #7** - TTL cache for tenant connections (30 min)
10. **Finding #10** - Add password change notification (15 min)
11. **Finding #11** - Add tenant list pagination (15 min)
