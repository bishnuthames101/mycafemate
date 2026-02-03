import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getTenantSlug } from "@/lib/utils/tenant-resolver";
import { trackApiRequest } from "@/lib/services/api-usage-tracker";
import { apiRateLimit, adminRateLimit, checkRateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/utils/logger";

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const host = req.headers.get("host") || "";
    const hostWithoutPort = host.split(":")[0];

    // Check if this is super admin context
    const isSuperAdminDomain = host.startsWith("admin.");

    // Check if accessing root domain (no subdomain)
    const isRootDomain = hostWithoutPort === "localhost" ||
                         hostWithoutPort === "mycafemate.com" ||
                         hostWithoutPort === "www.mycafemate.com";

    // Allow public access to root landing page
    if (isRootDomain && path === "/") {
      return NextResponse.next();
    }

    // ============= RATE LIMITING =============
    // Apply rate limiting to API routes and admin actions
    if (path.startsWith("/api/")) {
      const identifier = req.ip ?? req.headers.get("x-forwarded-for") ?? "unknown";
      const limiter = isSuperAdminDomain ? adminRateLimit : apiRateLimit;

      const rateCheck = await checkRateLimit(limiter, identifier);
      if (!rateCheck.allowed && rateCheck.response) {
        return rateCheck.response;
      }
    }

    // ============= API USAGE TRACKING =============
    // Track API requests for tenant billing (exclude super admin)
    // Note: Tracking happens asynchronously to avoid blocking requests
    if (!isSuperAdminDomain && path.startsWith("/api/")) {
      const tenantSlug = getTenantSlug();
      if (tenantSlug) {
        // Track API request asynchronously (don't await - let it run in background)
        // This prevents slowing down every API request
        trackApiRequest(tenantSlug, path).catch((error) => {
          logger.error("API usage tracking error", error instanceof Error ? error : undefined);
        });
      }
    }

    // ============= SUPER ADMIN ROUTES =============
    if (path.startsWith("/super-admin")) {
      // Only SUPER_ADMIN role can access super admin routes
      if (token?.role !== "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      return NextResponse.next();
    }

    // ============= TENANT CONTEXT VALIDATION =============
    // For non-super-admin routes, ensure tenant context exists
    if (!isSuperAdminDomain && !path.startsWith("/login")) {
      // Extract tenant slug from subdomain
      const hostWithoutPort = host.split(":")[0];
      const parts = hostWithoutPort.split(".");

      // Check if tenant subdomain exists
      let hasTenantSlug = false;
      let tenantSlug = "";

      if (hostWithoutPort.includes(".localhost")) {
        // Development: tenant-slug.localhost
        hasTenantSlug = parts.length >= 2;
        if (hasTenantSlug) tenantSlug = parts[0];
      } else if (parts.length >= 3) {
        // Production: tenant-slug.mycafemate.com
        hasTenantSlug = true;
        tenantSlug = parts[0];
      }

      // If no tenant slug and not on base domain, show error
      if (!hasTenantSlug && parts.length > 1) {
        return NextResponse.json(
          {
            error: "Tenant not found",
            message: "Please access your cafe via the correct subdomain (e.g., your-cafe.mycafemate.com)",
          },
          { status: 404 }
        );
      }

      // ============= SUBSCRIPTION STATUS CHECK =============
      // NOTE: Subscription validation is performed in getTenantPrisma() (see src/lib/prisma-multi-tenant.ts)
      // This approach is better because:
      // - Middleware runs in Edge Runtime which doesn't support Prisma
      // - getTenantPrisma() is called for ALL tenant database operations
      // - Blocks access at the database level (more secure)
      // - Checks subscription status, tenant status, payment due dates, etc.
      // - Returns clear error messages to users (trial expired, payment due, suspended, etc.)
    }

    // ============= TENANT USER ROUTES =============
    // Prevent super admin from accessing tenant routes (but allow super admin API routes)
    if (token?.role === "SUPER_ADMIN" && !path.startsWith("/super-admin") && !path.startsWith("/api/super-admin")) {
      return NextResponse.redirect(new URL("/super-admin", req.url));
    }

    // Admin-only routes
    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      // Redirect to appropriate dashboard based on role
      if (token?.role === "KITCHEN_STAFF") {
        return NextResponse.redirect(new URL("/kitchen", req.url));
      }
      return NextResponse.redirect(new URL("/staff", req.url));
    }

    // Staff routes (accessible by staff and admin only, NOT kitchen staff)
    if (path.startsWith("/staff")) {
      if (token?.role === "KITCHEN_STAFF") {
        return NextResponse.redirect(new URL("/kitchen", req.url));
      }
      // If no role/token, let the authorized callback handle it (redirect to login)
      if (!token?.role) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    // Kitchen-only routes
    if (path.startsWith("/kitchen") && token?.role !== "KITCHEN_STAFF") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        const host = req.headers.get("host") || "";
        const hostWithoutPort = host.split(":")[0];

        // Allow public access to root landing page
        const isRootDomain = hostWithoutPort === "localhost" ||
                             hostWithoutPort === "mycafemate.com" ||
                             hostWithoutPort === "www.mycafemate.com";

        if (isRootDomain && path === "/") {
          return true; // Allow without authentication
        }

        // All other routes require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/staff/:path*",
    "/kitchen/:path*",
    "/super-admin/:path*",
    "/api/:path*",
  ],
};
