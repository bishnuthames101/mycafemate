/**
 * Database Manager Service
 *
 * Handles low-level database operations for tenant provisioning:
 * - Creating PostgreSQL databases
 * - Running Prisma migrations
 * - Seeding initial tenant data
 */

import { PrismaClient } from "@prisma/client";
import { exec } from "child_process";
import { promisify } from "util";
import * as bcrypt from "bcryptjs";
import { Client } from "pg";
import { logger } from '@/lib/utils/logger';

const execAsync = promisify(exec);

/**
 * Create a new PostgreSQL database OR schema for a tenant
 *
 * Modes:
 * - DATABASE (development): Creates separate database per tenant
 * - SCHEMA (production): Creates separate schema in shared database
 *
 * @param tenantSlug - Tenant identifier (e.g., "baithak")
 * @returns Database/schema creation success status
 */
export async function createPostgresDatabase(tenantSlug: string): Promise<void> {
  const multiTenancyMode = process.env.MULTI_TENANCY_MODE || 'DATABASE';

  if (multiTenancyMode === 'SCHEMA') {
    return await createPostgresSchema(tenantSlug);
  } else {
    return await createPostgresDatabaseMode(tenantSlug);
  }
}

/**
 * Create a new PostgreSQL database (Development mode)
 */
async function createPostgresDatabaseMode(tenantSlug: string): Promise<void> {
  try {
    const dbName = generateDatabaseName(tenantSlug);
    const adminUrl = process.env.POSTGRES_ADMIN_URL || process.env.MASTER_DATABASE_URL;

    if (!adminUrl) {
      throw new Error("POSTGRES_ADMIN_URL not configured");
    }

    // Extract connection details from URL
    const url = new URL(adminUrl.replace("postgresql://", "http://"));
    const user = url.username;
    const password = decodeURIComponent(url.password);
    const host = url.hostname === 'localhost' ? '127.0.0.1' : url.hostname;
    const port = parseInt(url.port || "5432");

    // Connect to PostgreSQL using pg client
    const adminClient = new Client({
      user,
      password,
      host,
      port,
      database: 'postgres', // Connect to default postgres database
    });

    await adminClient.connect();

    // Create database using SQL
    await adminClient.query(`CREATE DATABASE ${dbName}`);

    await adminClient.end();
    logger.info(`Database created: ${dbName}`);
  } catch (error: any) {
    // If database already exists, that's okay
    if (error.message?.includes("already exists") || error.code === '42P04') {
      logger.info(`Database already exists: ${generateDatabaseName(tenantSlug)}`);
      return;
    }
    throw new Error(`Failed to create database: ${error.message}`);
  }
}

/**
 * Create a new PostgreSQL schema (Production mode - Supabase, etc.)
 */
async function createPostgresSchema(tenantSlug: string): Promise<void> {
  try {
    const schemaName = `tenant_${tenantSlug.replace(/-/g, '_')}`;
    const adminUrl = process.env.POSTGRES_ADMIN_URL || process.env.MASTER_DATABASE_URL;

    if (!adminUrl) {
      throw new Error("POSTGRES_ADMIN_URL not configured");
    }

    // Extract connection details from URL
    const url = new URL(adminUrl.replace("postgresql://", "http://"));
    const user = url.username;
    const password = decodeURIComponent(url.password);
    const host = url.hostname === 'localhost' ? '127.0.0.1' : url.hostname;
    const port = parseInt(url.port || "5432");
    const database = url.pathname.replace('/', '');

    // Connect to the shared production database
    const adminClient = new Client({
      user,
      password,
      host,
      port,
      database, // Connect to the shared database
    });

    await adminClient.connect();

    // Create schema
    await adminClient.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);

    // Grant permissions to the user
    await adminClient.query(`GRANT ALL ON SCHEMA ${schemaName} TO ${user}`);

    await adminClient.end();
    logger.info(`Schema created: ${schemaName}`);
  } catch (error: any) {
    throw new Error(`Failed to create schema: ${error.message}`);
  }
}

/**
 * Run Prisma schema push on a tenant database/schema
 *
 * For schema-per-tenant, we use `prisma db push` to directly apply the schema
 * instead of `migrate deploy` which is designed for single-database migrations.
 *
 * @param databaseUrl - Full connection string for the tenant database/schema
 */
export async function runPrismaMigrations(databaseUrl: string): Promise<void> {
  try {
    logger.info(`Applying schema to tenant database...`);

    // Use prisma db push for schema-per-tenant (creates tables directly from schema)
    // --skip-generate: Don't regenerate Prisma Client
    // --force-reset: Drop and recreate the database schema (safe for new tenant provisioning)
    await execAsync('npx prisma db push --skip-generate --force-reset --accept-data-loss', {
      env: { ...process.env, DATABASE_URL: databaseUrl },
    });

    logger.info(`Schema applied successfully`);
  } catch (error: any) {
    logger.error(`Schema push failed: ${error.message}`, error instanceof Error ? error : undefined);
    throw new Error(`Failed to apply schema: ${error.message}`);
  }
}

/**
 * Seed initial data for a new tenant
 *
 * @param databaseUrl - Connection string for the tenant database
 * @param seedData - Initial data to seed
 */
export interface TenantCredentials {
  admin: { email: string; password: string };
  kitchen: { email: string; password: string };
  staff: { email: string; password: string };
}

export async function seedTenantDatabase(
  databaseUrl: string,
  seedData: {
    tenantSlug: string;
    businessName: string;
  }
): Promise<TenantCredentials> {
  const prisma = new PrismaClient({
    datasources: {
      db: { url: databaseUrl },
    },
  });

  try {
    // 1. Create or update TenantConfig (use upsert to handle existing config)
    await prisma.tenantConfig.upsert({
      where: {
        tenantSlug: seedData.tenantSlug,
      },
      create: {
        tenantSlug: seedData.tenantSlug,
        businessName: seedData.businessName,
        taxRate: 0.13, // Default 13% tax
        currency: "NPR",
        timezone: "Asia/Kathmandu",
      },
      update: {
        businessName: seedData.businessName,
      },
    });

    // 2. Create or get Main Location
    let location = await prisma.location.findFirst({
      where: { name: "Main Branch" },
    });

    if (!location) {
      location = await prisma.location.create({
        data: {
          name: "Main Branch",
          address: "",
          phone: "",
          isActive: true,
        },
      });
    }

    // 3. Create three standard users with default passwords
    const credentials: TenantCredentials = {
      admin: { email: `admin@${seedData.tenantSlug}.com`, password: "admin123" },
      kitchen: { email: `kitchen@${seedData.tenantSlug}.com`, password: "kitchen123" },
      staff: { email: `staff@${seedData.tenantSlug}.com`, password: "staff123" },
    };

    // Create Admin User (if doesn't exist)
    const existingAdmin = await prisma.user.findUnique({
      where: { email: credentials.admin.email },
    });

    if (!existingAdmin) {
      await prisma.user.create({
        data: {
          name: "Admin User",
          email: credentials.admin.email,
          password: await bcrypt.hash(credentials.admin.password, 10),
          role: "ADMIN",
          locationId: location.id,
          isTenantOwner: true,
        },
      });
    }

    // Create Kitchen Staff User (if doesn't exist)
    const existingKitchen = await prisma.user.findUnique({
      where: { email: credentials.kitchen.email },
    });

    if (!existingKitchen) {
      await prisma.user.create({
        data: {
          name: "Kitchen Staff",
          email: credentials.kitchen.email,
          password: await bcrypt.hash(credentials.kitchen.password, 10),
          role: "KITCHEN_STAFF",
          locationId: location.id,
          isTenantOwner: false,
        },
      });
    }

    // Create Staff User (if doesn't exist)
    const existingStaff = await prisma.user.findUnique({
      where: { email: credentials.staff.email },
    });

    if (!existingStaff) {
      await prisma.user.create({
        data: {
          name: "Staff User",
          email: credentials.staff.email,
          password: await bcrypt.hash(credentials.staff.password, 10),
          role: "STAFF",
          locationId: location.id,
          isTenantOwner: false,
        },
      });
    }

    // 4. Create default product categories
    const defaultCategories = [
      { id: "cat_tea", name: "Tea", slug: "TEA", sortOrder: 1 },
      { id: "cat_coffee", name: "Coffee", slug: "COFFEE", sortOrder: 2 },
      { id: "cat_cold_beverage", name: "Cold Beverage", slug: "COLD_BEVERAGE", sortOrder: 3 },
      { id: "cat_snacks", name: "Snacks", slug: "SNACKS", sortOrder: 4 },
      { id: "cat_desserts", name: "Desserts", slug: "DESSERTS", sortOrder: 5 },
      { id: "cat_other", name: "Other", slug: "OTHER", sortOrder: 6 },
    ];

    for (const cat of defaultCategories) {
      const existing = await prisma.productCategory.findUnique({
        where: { slug: cat.slug },
      });
      if (!existing) {
        await prisma.productCategory.create({ data: cat });
      }
    }

    // 5. Create sample tables (optional - can be skipped)
    // Only create tables if none exist for this location
    const existingTables = await prisma.table.findMany({
      where: { locationId: location.id },
    });

    if (existingTables.length === 0) {
      const tablePromises = Array.from({ length: 5 }, (_, i) => {
        return prisma.table.create({
          data: {
            number: `T${i + 1}`,
            capacity: 4,
            locationId: location.id,
            status: "AVAILABLE",
          },
        });
      });

      await Promise.all(tablePromises);
    }

    logger.info(`Tenant data seeded successfully`);

    // Return credentials for display to super admin
    return credentials;
  } catch (error: any) {
    throw new Error(`Failed to seed tenant database: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Validate database name format
 * Must be PostgreSQL-safe (lowercase, alphanumeric, underscores)
 */
export function isValidDatabaseName(dbName: string): boolean {
  const dbPattern = /^[a-z0-9_]+$/;
  return dbPattern.test(dbName) && dbName.length >= 3 && dbName.length <= 63;
}

/**
 * Generate database name from tenant slug
 *
 * @param tenantSlug - The tenant identifier
 * @returns PostgreSQL-safe database name
 */
export function generateDatabaseName(tenantSlug: string): string {
  // Convert slug to database name: cafe-abc → cafemate_cafe_abc
  const safeName = tenantSlug.replace(/-/g, "_");
  return `cafemate_${safeName}`;
}

/**
 * Generate full database URL for a tenant
 *
 * @param tenantSlug - Tenant slug (e.g., "baithak")
 * @returns Full PostgreSQL connection string
 */
export function generateDatabaseUrl(tenantSlug: string): string {
  const adminUrl = process.env.POSTGRES_ADMIN_URL || process.env.MASTER_DATABASE_URL;
  const multiTenancyMode = process.env.MULTI_TENANCY_MODE || 'DATABASE';

  if (!adminUrl) {
    throw new Error("POSTGRES_ADMIN_URL not configured");
  }

  // Parse the admin URL
  const url = new URL(adminUrl.replace("postgresql://", "http://"));

  if (multiTenancyMode === 'SCHEMA') {
    // Schema mode: Use shared database with schema parameter
    const schemaName = `tenant_${tenantSlug.replace(/-/g, '_')}`;
    const database = url.pathname.replace('/', '') || 'postgres';
    return `postgresql://${url.username}:${url.password}@${url.hostname}:${url.port || 5432}/${database}?schema=${schemaName}`;
  } else {
    // Database mode: Each tenant has their own database
    const dbName = generateDatabaseName(tenantSlug);
    return `postgresql://${url.username}:${url.password}@${url.hostname}:${url.port || 5432}/${dbName}`;
  }
}

/**
 * Test database connection
 *
 * @param databaseUrl - Connection string to test
 * @returns true if connection successful
 */
export async function testDatabaseConnection(databaseUrl: string): Promise<boolean> {
  const prisma = new PrismaClient({
    datasources: {
      db: { url: databaseUrl },
    },
  });

  try {
    await prisma.$connect();
    await prisma.$disconnect();
    return true;
  } catch (error) {
    return false;
  }
}
