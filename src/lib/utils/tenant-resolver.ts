import { headers } from "next/headers";

/**
 * Extract tenant slug from the current request
 *
 * Uses subdomain routing only (cannot be spoofed by client):
 *   cafe-abc.mycafemate.com → "cafe-abc"
 *   cafe-abc.localhost:3000 → "cafe-abc"
 *
 * @returns Tenant slug or null if not found/in super admin context
 */
export function getTenantSlug(): string | null {
  const headersList = headers();

  const host = headersList.get("host");
  if (!host) return null;

  const hostWithoutPort = host.split(":")[0];

  // Super admin dashboard: admin.mycafemate.com or admin.localhost
  if (hostWithoutPort.startsWith("admin.")) {
    return null; // No tenant context for super admin
  }

  // Development: tenant-slug.localhost
  if (hostWithoutPort.includes(".localhost")) {
    const parts = hostWithoutPort.split(".");
    if (parts.length >= 2) {
      const slug = parts[0].toLowerCase();
      return isValidTenantSlug(slug) ? slug : null;
    }
  }

  // Production: tenant-slug.mycafemate.com
  const parts = hostWithoutPort.split(".");
  if (parts.length >= 3) {
    const slug = parts[0].toLowerCase();
    return isValidTenantSlug(slug) ? slug : null;
  }

  return null;
}

/**
 * Check if the current request is in super admin context
 *
 * @returns true if accessing super admin dashboard
 */
export function isSuperAdminContext(): boolean {
  const headersList = headers();
  const host = headersList.get("host");

  if (!host) {
    return false;
  }

  // Remove port if present
  const hostWithoutPort = host.split(":")[0];

  // Check for admin subdomain
  return hostWithoutPort.startsWith("admin.");
}

/**
 * Get the tenant URL for a given slug
 * Useful for generating login links, redirects, etc.
 *
 * @param tenantSlug - The tenant identifier
 * @returns Full URL to the tenant subdomain
 */
export function getTenantUrl(tenantSlug: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // If base URL already has a subdomain, replace it
  const url = new URL(baseUrl);

  if (process.env.NODE_ENV === "production") {
    // Production: cafe-abc.mycafemate.com
    url.hostname = `${tenantSlug}.${getDomain()}`;
  } else {
    // Development: cafe-abc.localhost:3000
    url.hostname = `${tenantSlug}.localhost`;
  }

  return url.toString();
}

/**
 * Get the super admin URL
 *
 * @returns Full URL to the super admin dashboard
 */
export function getSuperAdminUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const url = new URL(baseUrl);

  if (process.env.NODE_ENV === "production") {
    // Production: admin.mycafemate.com
    url.hostname = `admin.${getDomain()}`;
  } else {
    // Development: admin.localhost:3000
    url.hostname = "admin.localhost";
  }

  return url.toString();
}

/**
 * Extract base domain from environment
 *
 * @returns Base domain (e.g., "mycafemate.com")
 */
function getDomain(): string {
  const superAdminDomain =
    process.env.SUPER_ADMIN_DOMAIN || "admin.cafemate.local";

  // Extract domain after "admin." prefix
  // admin.mycafemate.com → mycafemate.com
  if (superAdminDomain.startsWith("admin.")) {
    return superAdminDomain.substring(6);
  }

  // Fallback
  return "cafemate.local";
}

/**
 * Validate tenant slug format
 * Slugs must be lowercase, alphanumeric with hyphens only
 *
 * @param slug - The slug to validate
 * @returns true if valid, false otherwise
 */
export function isValidTenantSlug(slug: string): boolean {
  // Slug must be 3-30 characters
  if (slug.length < 3 || slug.length > 30) {
    return false;
  }

  // Must match pattern: lowercase letters, numbers, hyphens
  // Must start and end with alphanumeric
  const slugPattern = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;

  return slugPattern.test(slug);
}

/**
 * Generate a URL-friendly slug from a business name
 *
 * @param businessName - The business name to convert
 * @returns A valid tenant slug
 */
export function generateSlugFromName(businessName: string): string {
  return businessName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
    .substring(0, 30); // Limit length
}
