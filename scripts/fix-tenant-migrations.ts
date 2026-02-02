/**
 * Fix Tenant Migrations Script
 * 
 * This script runs Prisma migrations on an existing tenant database
 * that was created but migrations weren't applied.
 * 
 * Usage:
 *   npx tsx scripts/fix-tenant-migrations.ts <tenant-slug>
 * 
 * Example:
 *   npx tsx scripts/fix-tenant-migrations.ts hungry
 */

import { exec } from "child_process";
import { promisify } from "util";
import {
  generateDatabaseUrl,
  generateDatabaseName,
} from "../src/lib/services/database-manager";

const execAsync = promisify(exec);

async function fixTenantMigrations(tenantSlug: string) {
  console.log(`🔧 Fixing migrations for tenant: ${tenantSlug}\n`);

  try {
    // Generate database URL for the tenant
    const databaseUrl = generateDatabaseUrl(tenantSlug);
    const dbName = generateDatabaseName(tenantSlug);

    console.log(`📦 Database: ${dbName}`);
    console.log(`🔗 URL: ${databaseUrl.replace(/:[^:@]+@/, ':****@')}\n`);

    // Run migrations
    console.log(`🚀 Running Prisma migrations...`);
    await execAsync("npx prisma migrate deploy", {
      env: { ...process.env, DATABASE_URL: databaseUrl },
    });

    console.log(`\n✅ Migrations applied successfully!`);
    console.log(`\nYou can now retry the tenant provisioning or seeding.`);
  } catch (error: any) {
    console.error(`\n❌ Error: ${error.message}`);
    if (error.stderr) {
      console.error(`\nDetails: ${error.stderr}`);
    }
    process.exit(1);
  }
}

// Get tenant slug from command line arguments
const tenantSlug = process.argv[2];

if (!tenantSlug) {
  console.error("❌ Error: Tenant slug is required");
  console.log("\nUsage: npx tsx scripts/fix-tenant-migrations.ts <tenant-slug>");
  console.log("Example: npx tsx scripts/fix-tenant-migrations.ts hungry");
  process.exit(1);
}

fixTenantMigrations(tenantSlug);








