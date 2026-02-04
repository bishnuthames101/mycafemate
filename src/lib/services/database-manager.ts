/**
 * Database Manager Service
 *
 * Handles low-level database operations for tenant provisioning:
 * - Creating PostgreSQL databases
 * - Creating tenant schema tables via raw SQL
 * - Seeding initial tenant data
 */

import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { Client } from "pg";
import { logger } from '@/lib/utils/logger';

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

    // Create database using SQL (quote identifier for safety)
    await adminClient.query(`CREATE DATABASE "${dbName}"`);

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

    // Create schema (quote identifier to handle special characters)
    await adminClient.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

    // Get the actual database role name (Supabase pooler usernames like
    // "postgres.projectref" differ from the real role which is just "postgres")
    const roleResult = await adminClient.query(`SELECT current_user`);
    const dbRole = roleResult.rows[0].current_user;

    // Grant permissions using the real database role
    await adminClient.query(`GRANT ALL ON SCHEMA "${schemaName}" TO "${dbRole}"`);

    await adminClient.end();
    logger.info(`Schema created: ${schemaName}`);
  } catch (error: any) {
    throw new Error(`Failed to create schema: ${error.message}`);
  }
}

/**
 * Create all tenant tables via raw SQL
 *
 * Replaces `npx prisma db push` which cannot run on Vercel serverless.
 * Creates enums, tables, indexes, and constraints matching the Prisma schema.
 *
 * @param databaseUrl - Full connection string for the tenant database/schema
 */
export async function runPrismaMigrations(databaseUrl: string): Promise<void> {
  // Parse the schema name from the URL
  const urlObj = new URL(databaseUrl.replace("postgresql://", "http://"));
  const schemaName = urlObj.searchParams.get("schema") || "public";

  const adminUrl = process.env.POSTGRES_ADMIN_URL || process.env.MASTER_DATABASE_URL;
  if (!adminUrl) {
    throw new Error("POSTGRES_ADMIN_URL not configured");
  }

  const parsedUrl = new URL(adminUrl.replace("postgresql://", "http://"));
  const client = new Client({
    user: parsedUrl.username,
    password: decodeURIComponent(parsedUrl.password),
    host: parsedUrl.hostname === 'localhost' ? '127.0.0.1' : parsedUrl.hostname,
    port: parseInt(parsedUrl.port || "5432"),
    database: parsedUrl.pathname.replace('/', ''),
  });

  try {
    await client.connect();
    logger.info(`Applying schema tables to ${schemaName}...`);

    // Use the tenant schema as search path
    await client.query(`SET search_path TO "${schemaName}"`);

    // Create enums (use IF NOT EXISTS pattern with DO block)
    const enums = [
      { name: "Role", values: ["ADMIN", "STAFF", "KITCHEN_STAFF"] },
      { name: "TableStatus", values: ["AVAILABLE", "OCCUPIED", "RESERVED", "CLEANING"] },
      { name: "OrderStatus", values: ["PENDING", "PREPARING", "READY", "SERVED", "COMPLETED", "CANCELLED"] },
      { name: "PaymentMethod", values: ["CASH", "ESEWA", "FONEPAY", "BANK_TRANSFER", "CREDIT"] },
      { name: "PaymentStatus", values: ["PENDING", "PAID", "REFUNDED"] },
      { name: "NotificationType", values: [
        "LOW_STOCK", "OUT_OF_STOCK",
        "TRIAL_EXPIRING_SOON", "TRIAL_EXPIRED", "PAYMENT_DUE", "PAYMENT_OVERDUE",
        "SUBSCRIPTION_RENEWED", "SUBSCRIPTION_UPGRADED", "SUBSCRIPTION_DOWNGRADED",
        "USAGE_LIMIT_WARNING", "DB_LIMIT_EXCEEDED", "API_LIMIT_EXCEEDED",
        "NEW_ORDER", "ORDER_READY", "TABLE_RESERVED", "DAILY_REPORT_READY",
        "DAILY_REPORT", "SYSTEM"
      ]},
      { name: "NotificationPriority", values: ["LOW", "NORMAL", "HIGH", "URGENT"] },
    ];

    for (const e of enums) {
      const values = e.values.map(v => `'${v}'`).join(", ");
      await client.query(`
        DO $$ BEGIN
          CREATE TYPE "${schemaName}"."${e.name}" AS ENUM (${values});
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;
      `);
    }

    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS "${schemaName}"."TenantConfig" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
        "tenantSlug" TEXT NOT NULL,
        "businessName" TEXT NOT NULL,
        "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 0.13,
        "currency" TEXT NOT NULL DEFAULT 'NPR',
        "timezone" TEXT NOT NULL DEFAULT 'Asia/Kathmandu',
        "logoUrl" TEXT,
        "primaryColor" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "TenantConfig_pkey" PRIMARY KEY ("id")
      );
      CREATE UNIQUE INDEX IF NOT EXISTS "TenantConfig_tenantSlug_key" ON "${schemaName}"."TenantConfig"("tenantSlug");
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "${schemaName}"."Location" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
        "name" TEXT NOT NULL,
        "address" TEXT NOT NULL,
        "phone" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
      );
      CREATE INDEX IF NOT EXISTS "Location_isActive_idx" ON "${schemaName}"."Location"("isActive");
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "${schemaName}"."User" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "role" "${schemaName}"."Role" NOT NULL DEFAULT 'STAFF',
        "isTenantOwner" BOOLEAN NOT NULL DEFAULT false,
        "locationId" TEXT,
        "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
        "lockedUntil" TIMESTAMP(3),
        "lastFailedLogin" TIMESTAMP(3),
        "lastLoginAt" TIMESTAMP(3),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "User_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "${schemaName}"."Location"("id") ON DELETE SET NULL ON UPDATE CASCADE
      );
      CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "${schemaName}"."User"("email");
      CREATE INDEX IF NOT EXISTS "User_email_idx" ON "${schemaName}"."User"("email");
      CREATE INDEX IF NOT EXISTS "User_locationId_idx" ON "${schemaName}"."User"("locationId");
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "${schemaName}"."Creditor" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
        "name" TEXT NOT NULL,
        "phone" TEXT,
        "email" TEXT,
        "locationId" TEXT NOT NULL,
        "currentBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "lastOrderDate" TIMESTAMP(3),
        CONSTRAINT "Creditor_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "Creditor_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "${schemaName}"."Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
      CREATE INDEX IF NOT EXISTS "Creditor_locationId_currentBalance_idx" ON "${schemaName}"."Creditor"("locationId", "currentBalance");
      CREATE INDEX IF NOT EXISTS "Creditor_name_idx" ON "${schemaName}"."Creditor"("name");
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "${schemaName}"."CreditPayment" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
        "creditorId" TEXT NOT NULL,
        "amount" DOUBLE PRECISION NOT NULL,
        "balanceBefore" DOUBLE PRECISION NOT NULL,
        "balanceAfter" DOUBLE PRECISION NOT NULL,
        "paymentMethod" "${schemaName}"."PaymentMethod" NOT NULL DEFAULT 'CASH',
        "notes" TEXT,
        "recordedById" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "CreditPayment_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "CreditPayment_creditorId_fkey" FOREIGN KEY ("creditorId") REFERENCES "${schemaName}"."Creditor"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "CreditPayment_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "${schemaName}"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
      CREATE INDEX IF NOT EXISTS "CreditPayment_creditorId_createdAt_idx" ON "${schemaName}"."CreditPayment"("creditorId", "createdAt");
      CREATE INDEX IF NOT EXISTS "CreditPayment_createdAt_idx" ON "${schemaName}"."CreditPayment"("createdAt");
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "${schemaName}"."Table" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
        "number" TEXT NOT NULL,
        "capacity" INTEGER NOT NULL,
        "status" "${schemaName}"."TableStatus" NOT NULL DEFAULT 'AVAILABLE',
        "locationId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Table_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "Table_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "${schemaName}"."Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
      CREATE UNIQUE INDEX IF NOT EXISTS "Table_number_locationId_key" ON "${schemaName}"."Table"("number", "locationId");
      CREATE INDEX IF NOT EXISTS "Table_locationId_status_idx" ON "${schemaName}"."Table"("locationId", "status");
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "${schemaName}"."Product" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "category" TEXT NOT NULL,
        "price" DOUBLE PRECISION NOT NULL,
        "isAvailable" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
      );
      CREATE INDEX IF NOT EXISTS "Product_category_isAvailable_idx" ON "${schemaName}"."Product"("category", "isAvailable");
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "${schemaName}"."ProductCategory" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
        "name" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "sortOrder" INTEGER NOT NULL DEFAULT 0,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id")
      );
      CREATE UNIQUE INDEX IF NOT EXISTS "ProductCategory_slug_key" ON "${schemaName}"."ProductCategory"("slug");
      CREATE INDEX IF NOT EXISTS "ProductCategory_isActive_sortOrder_idx" ON "${schemaName}"."ProductCategory"("isActive", "sortOrder");
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "${schemaName}"."Order" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
        "orderNumber" TEXT NOT NULL,
        "tableId" TEXT,
        "locationId" TEXT NOT NULL,
        "staffId" TEXT NOT NULL,
        "creditorId" TEXT,
        "status" "${schemaName}"."OrderStatus" NOT NULL DEFAULT 'PENDING',
        "subtotal" DOUBLE PRECISION NOT NULL,
        "tax" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "total" DOUBLE PRECISION NOT NULL,
        "notes" TEXT,
        "paymentMethod" "${schemaName}"."PaymentMethod" DEFAULT 'CASH',
        "paymentStatus" "${schemaName}"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
        "paidAt" TIMESTAMP(3),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "completedAt" TIMESTAMP(3),
        CONSTRAINT "Order_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "Order_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "${schemaName}"."Table"("id") ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT "Order_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "${schemaName}"."Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "Order_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "${schemaName}"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "Order_creditorId_fkey" FOREIGN KEY ("creditorId") REFERENCES "${schemaName}"."Creditor"("id") ON DELETE SET NULL ON UPDATE CASCADE
      );
      CREATE UNIQUE INDEX IF NOT EXISTS "Order_orderNumber_key" ON "${schemaName}"."Order"("orderNumber");
      CREATE INDEX IF NOT EXISTS "Order_locationId_createdAt_idx" ON "${schemaName}"."Order"("locationId", "createdAt");
      CREATE INDEX IF NOT EXISTS "Order_status_idx" ON "${schemaName}"."Order"("status");
      CREATE INDEX IF NOT EXISTS "Order_orderNumber_idx" ON "${schemaName}"."Order"("orderNumber");
      CREATE INDEX IF NOT EXISTS "Order_creditorId_createdAt_idx" ON "${schemaName}"."Order"("creditorId", "createdAt");
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "${schemaName}"."OrderItem" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
        "orderId" TEXT NOT NULL,
        "productId" TEXT NOT NULL,
        "quantity" INTEGER NOT NULL,
        "price" DOUBLE PRECISION NOT NULL,
        "subtotal" DOUBLE PRECISION NOT NULL,
        "notes" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "${schemaName}"."Order"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "${schemaName}"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
      CREATE INDEX IF NOT EXISTS "OrderItem_orderId_idx" ON "${schemaName}"."OrderItem"("orderId");
      CREATE INDEX IF NOT EXISTS "OrderItem_productId_idx" ON "${schemaName}"."OrderItem"("productId");
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "${schemaName}"."Inventory" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
        "name" TEXT NOT NULL,
        "unit" TEXT NOT NULL,
        "locationId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "Inventory_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "${schemaName}"."Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
      CREATE INDEX IF NOT EXISTS "Inventory_locationId_idx" ON "${schemaName}"."Inventory"("locationId");
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "${schemaName}"."InventoryItem" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
        "inventoryId" TEXT NOT NULL,
        "productId" TEXT,
        "currentStock" DOUBLE PRECISION NOT NULL,
        "minimumStock" DOUBLE PRECISION NOT NULL,
        "maximumStock" DOUBLE PRECISION,
        "lastRestocked" TIMESTAMP(3),
        "restockAmount" DOUBLE PRECISION,
        "usageRate" DOUBLE PRECISION,
        "lowStockAlerted" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "InventoryItem_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "${schemaName}"."Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "InventoryItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "${schemaName}"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE
      );
      CREATE INDEX IF NOT EXISTS "InventoryItem_inventoryId_idx" ON "${schemaName}"."InventoryItem"("inventoryId");
      CREATE INDEX IF NOT EXISTS "InventoryItem_currentStock_minimumStock_idx" ON "${schemaName}"."InventoryItem"("currentStock", "minimumStock");
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "${schemaName}"."RecipeItem" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
        "productId" TEXT NOT NULL,
        "inventoryId" TEXT NOT NULL,
        "quantityUsed" DOUBLE PRECISION NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "RecipeItem_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "RecipeItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "${schemaName}"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "RecipeItem_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "${schemaName}"."Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
      CREATE UNIQUE INDEX IF NOT EXISTS "RecipeItem_productId_inventoryId_key" ON "${schemaName}"."RecipeItem"("productId", "inventoryId");
      CREATE INDEX IF NOT EXISTS "RecipeItem_productId_idx" ON "${schemaName}"."RecipeItem"("productId");
      CREATE INDEX IF NOT EXISTS "RecipeItem_inventoryId_idx" ON "${schemaName}"."RecipeItem"("inventoryId");
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "${schemaName}"."DailySales" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
        "date" DATE NOT NULL,
        "locationId" TEXT NOT NULL,
        "totalOrders" INTEGER NOT NULL,
        "totalRevenue" DOUBLE PRECISION NOT NULL,
        "totalTax" DOUBLE PRECISION NOT NULL,
        "totalDiscount" DOUBLE PRECISION NOT NULL,
        "topProducts" JSONB NOT NULL,
        "salesByCategory" JSONB NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "DailySales_pkey" PRIMARY KEY ("id")
      );
      CREATE UNIQUE INDEX IF NOT EXISTS "DailySales_date_locationId_key" ON "${schemaName}"."DailySales"("date", "locationId");
      CREATE INDEX IF NOT EXISTS "DailySales_date_idx" ON "${schemaName}"."DailySales"("date");
      CREATE INDEX IF NOT EXISTS "DailySales_locationId_date_idx" ON "${schemaName}"."DailySales"("locationId", "date");
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "${schemaName}"."Notification" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
        "type" "${schemaName}"."NotificationType" NOT NULL,
        "title" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "locationId" TEXT,
        "userId" TEXT,
        "isRead" BOOLEAN NOT NULL DEFAULT false,
        "metadata" JSONB,
        "priority" "${schemaName}"."NotificationPriority" NOT NULL DEFAULT 'NORMAL',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "expiresAt" TIMESTAMP(3),
        CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
      );
      CREATE INDEX IF NOT EXISTS "Notification_isRead_createdAt_idx" ON "${schemaName}"."Notification"("isRead", "createdAt");
      CREATE INDEX IF NOT EXISTS "Notification_locationId_idx" ON "${schemaName}"."Notification"("locationId");
      CREATE INDEX IF NOT EXISTS "Notification_userId_idx" ON "${schemaName}"."Notification"("userId");
      CREATE INDEX IF NOT EXISTS "Notification_priority_isRead_idx" ON "${schemaName}"."Notification"("priority", "isRead");
    `);

    logger.info(`Schema tables applied successfully to ${schemaName}`);
  } catch (error: any) {
    logger.error(`Schema creation failed: ${error.message}`, error instanceof Error ? error : undefined);
    throw new Error(`Failed to apply schema: ${error.message}`);
  } finally {
    await client.end();
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
  // Append connection_limit=1 to minimize connections on Supabase free tier
  const seedUrl = databaseUrl.includes('connection_limit')
    ? databaseUrl
    : databaseUrl + (databaseUrl.includes('?') ? '&' : '?') + 'connection_limit=1';

  const prisma = new PrismaClient({
    datasources: {
      db: { url: seedUrl },
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
