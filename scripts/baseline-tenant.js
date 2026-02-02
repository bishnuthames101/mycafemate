const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

async function baseline(tenantSlug) {
  if (!tenantSlug) {
    console.error('Usage: node scripts/baseline-tenant.js <tenant-slug>');
    process.exit(1);
  }

  const dbUrl = `postgresql://postgres:bishnu12%23@localhost:5432/cafemate_shared?schema=tenant_${tenantSlug}`;
  console.log(`Baselining tenant: ${tenantSlug}`);
  console.log(`Schema: tenant_${tenantSlug}`);

  const prisma = new PrismaClient({
    datasources: { db: { url: dbUrl } }
  });

  try {
    // Create _prisma_migrations table if it doesn't exist
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        checksum VARCHAR(64) NOT NULL,
        finished_at TIMESTAMPTZ,
        migration_name VARCHAR(255) NOT NULL,
        logs TEXT,
        rolled_back_at TIMESTAMPTZ,
        started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        applied_steps_count INTEGER NOT NULL DEFAULT 0
      )
    `);
    console.log('Created/verified _prisma_migrations table');

    // Mark all pre-creditor migrations as already applied (baseline)
    const migrations = [
      '20251217070633_init',
      '20251217165005_add_payment_tracking',
      '20251217172820_add_recipe_items',
      '20251230165141_init_master',
      '20251230165225_add_tenant_config',
      '20260102125009_add_usage_tracking',
      '20260103175615_add_usage_based_pricing',
      '20260104173728_add_account_lockout_security'
    ];

    for (const m of migrations) {
      const id = crypto.randomUUID();
      await prisma.$executeRawUnsafe(
        `INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, applied_steps_count) VALUES ('${id}', 'baseline', NOW(), '${m}', 1) ON CONFLICT DO NOTHING`
      );
      console.log('  Baselined:', m);
    }

    console.log('\nBaseline complete. Now run:');
    console.log(`  set DATABASE_URL=${dbUrl} && npx prisma migrate deploy`);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

const slug = process.argv[2];
baseline(slug);
