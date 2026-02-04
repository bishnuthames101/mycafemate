/**
 * Tenant Provisioning Service
 *
 * High-level service for creating and managing tenants.
 * Orchestrates database creation, migration, seeding, and tenant registration.
 */

import { getMasterPrisma } from "@/lib/prisma-multi-tenant";
import {
  createPostgresDatabase,
  runPrismaMigrations,
  seedTenantDatabase,
  generateDatabaseName,
  generateDatabaseUrl,
  isValidDatabaseName,
  TenantCredentials,
} from "./database-manager";
import { isValidTenantSlug } from "@/lib/utils/tenant-resolver";
import { encryptDatabaseUrl } from "@/lib/prisma-multi-tenant";
import { addDomainToVercel } from "./vercel-domain";
import { createLogger } from "@/lib/utils/logger";

const log = createLogger('[Provisioning]');

export interface ProvisionTenantInput {
  businessName: string;
  slug: string;
  contactEmail: string;
  contactPhone?: string;
  trialDays?: number;
  // subscriptionTier removed - all tenants use BASIC (1200 NPR usage-based pricing)
}

export interface ProvisionTenantResult {
  success: boolean;
  tenantId?: string;
  slug?: string;
  databaseUrl?: string;
  loginUrl?: string;
  credentials?: TenantCredentials;
  error?: string;
}

/**
 * Provision a new tenant
 *
 * This is the main function that orchestrates the entire tenant creation process:
 * 1. Validate input
 * 2. Check slug availability
 * 3. Create PostgreSQL database
 * 4. Run Prisma migrations
 * 5. Seed initial data
 * 6. Create tenant record in master DB
 *
 * @param input - Tenant provisioning details
 * @returns Provisioning result with tenant info or error
 */
export async function provisionNewTenant(
  input: ProvisionTenantInput
): Promise<ProvisionTenantResult> {
  const masterPrisma = getMasterPrisma();

  try {
    // ============= STEP 1: VALIDATION =============
    log.info(`Starting tenant provisioning: ${input.slug}`);

    // Validate slug format
    if (!isValidTenantSlug(input.slug)) {
      return {
        success: false,
        error: "Invalid slug format. Use lowercase letters, numbers, and hyphens only (3-30 characters).",
      };
    }

    // Check if slug already exists
    const existingTenant = await masterPrisma.tenant.findUnique({
      where: { slug: input.slug },
    });

    if (existingTenant) {
      return {
        success: false,
        error: `Tenant with slug "${input.slug}" already exists.`,
      };
    }

    // Check if contact email already used
    const existingEmail = await masterPrisma.tenant.findFirst({
      where: { contactEmail: input.contactEmail },
    });

    if (existingEmail) {
      return {
        success: false,
        error: `A tenant with email "${input.contactEmail}" already exists.`,
      };
    }

    // ============= STEP 2: DATABASE CREATION =============
    log.info(`Creating database...`);

    const dbName = generateDatabaseName(input.slug);

    if (!isValidDatabaseName(dbName)) {
      return {
        success: false,
        error: "Generated database name is invalid. Please use a different slug.",
      };
    }

    // Create the database (pass slug, not dbName, so schema name is correct)
    await createPostgresDatabase(input.slug);

    // ============= STEP 3: GENERATE DATABASE URL =============
    const databaseUrl = generateDatabaseUrl(input.slug);

    // ============= STEP 4: RUN MIGRATIONS =============
    log.info(`Running migrations...`);
    await runPrismaMigrations(databaseUrl);

    // ============= STEP 5: SEED INITIAL DATA =============
    log.info(`Seeding tenant data...`);
    const credentials = await seedTenantDatabase(databaseUrl, {
      tenantSlug: input.slug,
      businessName: input.businessName,
    });

    // ============= STEP 6: CREATE TENANT RECORD =============
    log.info(`Registering tenant in master database...`);

    // Encrypt database URL before storing
    const encryptedDatabaseUrl = encryptDatabaseUrl(databaseUrl);

    // Calculate trial end date
    const trialDays = input.trialDays || 14; // Default 14 days
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + trialDays);

    const tenant = await masterPrisma.tenant.create({
      data: {
        slug: input.slug,
        businessName: input.businessName,
        contactName: "Admin User", // Default contact name
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone || "",
        databaseUrl: encryptedDatabaseUrl,
        databaseHost: process.env.DB_HOST || "localhost",
        databaseName: dbName,
        subscriptionStatus: "TRIAL",
        subscriptionTier: "BASIC", // All tenants use BASIC tier (usage-based pricing)
        status: "ACTIVE",
        trialEndsAt,
        monthlyFee: 1200, // Base fee: NPR 1,200/month (overages calculated separately)
        // Usage limits use defaults from USAGE_LIMITS config (customizable per tenant)
      },
    });

    // ============= STEP 7: LOG ACTIVITY =============
    await masterPrisma.tenantActivityLog.create({
      data: {
        tenantId: tenant.id,
        action: "TENANT_CREATED",
        details: {
          message: `Tenant provisioned with ${trialDays}-day trial`,
          subscriptionTier: tenant.subscriptionTier,
          trialEndsAt: tenant.trialEndsAt,
          monthlyFee: 1200,
          pricingModel: "usage-based",
        },
      },
    });

    // ============= STEP 8: REGISTER VERCEL DOMAIN =============
    // Non-blocking: failure here does NOT fail tenant creation
    if (process.env.NODE_ENV === "production") {
      const domain =
        process.env.SUPER_ADMIN_DOMAIN?.replace("admin.", "") ||
        "mycafemate.com";
      const tenantDomain = `${input.slug}.${domain}`;

      log.info(`Registering Vercel domain: ${tenantDomain}`);
      const domainAdded = await addDomainToVercel(tenantDomain);
      if (!domainAdded) {
        log.warn(
          `Vercel domain registration failed for ${tenantDomain}. Add it manually in the Vercel dashboard.`
        );
      }
    }

    log.info(`Tenant provisioned successfully: ${input.slug}`);

    // Generate login URL
    const loginUrl = getLoginUrl(input.slug);

    return {
      success: true,
      tenantId: tenant.id,
      slug: tenant.slug,
      databaseUrl: databaseUrl, // Return unencrypted for display
      loginUrl,
      credentials, // Include credentials for display to super admin
    };
  } catch (error: any) {
    log.error(`Tenant provisioning failed`, error instanceof Error ? error : undefined);

    return {
      success: false,
      error: error.message || "Unknown error during tenant provisioning",
    };
  }
}

/**
 * Suspend a tenant (for non-payment, trial expiry, or violations)
 *
 * @param tenantId - The tenant ID to suspend
 * @param reason - Reason for suspension
 */
export async function suspendTenant(
  tenantId: string,
  reason: string
): Promise<void> {
  const masterPrisma = getMasterPrisma();

  await masterPrisma.tenant.update({
    where: { id: tenantId },
    data: {
      status: "SUSPENDED",
      suspendedAt: new Date(),
    },
  });

  await masterPrisma.tenantActivityLog.create({
    data: {
      tenantId,
      action: "TENANT_SUSPENDED",
      details: {
        reason: reason,
      },
    },
  });

  log.info(`Tenant suspended: ${tenantId}`);
}

/**
 * Reactivate a suspended tenant
 *
 * @param tenantId - The tenant ID to reactivate
 */
export async function reactivateTenant(tenantId: string): Promise<void> {
  const masterPrisma = getMasterPrisma();

  await masterPrisma.tenant.update({
    where: { id: tenantId },
    data: {
      status: "ACTIVE",
      suspendedAt: null,
    },
  });

  await masterPrisma.tenantActivityLog.create({
    data: {
      tenantId,
      action: "TENANT_REACTIVATED",
      details: {
        message: "Tenant reactivated by admin",
      },
    },
  });

  log.info(`Tenant reactivated: ${tenantId}`);
}

/**
 * Delete a tenant (dangerous - soft delete recommended instead)
 *
 * @param tenantId - The tenant ID to delete
 * @param confirmSlug - Slug confirmation for safety
 */
export async function deleteTenant(
  tenantId: string,
  confirmSlug: string,
  hardDelete: boolean = false
): Promise<{ success: boolean; error?: string }> {
  const masterPrisma = getMasterPrisma();

  try {
    const tenant = await masterPrisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      return { success: false, error: "Tenant not found" };
    }

    if (tenant.slug !== confirmSlug) {
      return { success: false, error: "Slug confirmation does not match" };
    }

    if (hardDelete) {
      // Hard delete: Drop database permanently
      const dbName = generateDatabaseName(tenant.slug);

      try {
        // Get admin database URL (connect to postgres database)
        const adminUrl = process.env.POSTGRES_ADMIN_URL || process.env.MASTER_DATABASE_URL;

        if (!adminUrl) {
          throw new Error("POSTGRES_ADMIN_URL or MASTER_DATABASE_URL not configured");
        }

        const { Client } = require("pg");
        const client = new Client({
          connectionString: adminUrl,
          database: "postgres", // Connect to postgres database to drop tenant database
        });

        await client.connect();

        // Terminate all connections to the tenant database
        await client.query(
          `SELECT pg_terminate_backend(pid)
           FROM pg_stat_activity
           WHERE datname = $1 AND pid <> pg_backend_pid()`,
          [dbName]
        );

        // Drop the database
        await client.query(`DROP DATABASE IF EXISTS "${dbName}"`);

        await client.end();

        log.info(`Database dropped: ${dbName}`);
      } catch (dbError: any) {
        log.error(`Failed to drop database ${dbName}`, dbError instanceof Error ? dbError : undefined);
        // Continue with master DB deletion even if database drop fails
      }

      // Delete tenant record from master DB (cascades to related records)
      await masterPrisma.tenant.delete({
        where: { id: tenantId },
      });

      log.info(`Tenant hard deleted: ${confirmSlug}`);

      return { success: true };
    } else {
      // Soft delete: just mark as cancelled
      await masterPrisma.tenant.update({
        where: { id: tenantId },
        data: {
          status: "CANCELLED",
          suspendedAt: new Date(),
        },
      });

      await masterPrisma.tenantActivityLog.create({
        data: {
          tenantId,
          action: "TENANT_CANCELLED",
          details: {
            message: `Tenant marked as cancelled (database preserved)`,
          },
        },
      });

      log.info(`Tenant soft deleted: ${confirmSlug}`);

      return { success: true };
    }
  } catch (error: any) {
    log.error("Delete tenant error", error instanceof Error ? error : undefined);
    return { success: false, error: error.message };
  }
}

/**
 * Get monthly fee based on subscription tier
 * @deprecated All tenants now use usage-based pricing with 1200 NPR base fee
 */
function getMonthlyFee(tier: string): number {
  // All tiers now use the same base fee with usage-based overages
  return 1200; // NPR 1,200/month base fee
}

/**
 * Generate login URL for a tenant
 */
function getLoginUrl(slug: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
  const url = new URL(baseUrl);

  if (process.env.NODE_ENV === "production") {
    // Production: cafe-abc.mycafemate.com
    const domain = process.env.SUPER_ADMIN_DOMAIN?.replace("admin.", "") || "mycafemate.local";
    url.hostname = `${slug}.${domain}`;
  } else {
    // Development: cafe-abc.localhost:3001
    url.hostname = `${slug}.localhost`;
  }

  url.pathname = "/login";

  return url.toString();
}
