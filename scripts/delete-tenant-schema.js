const { Client } = require("pg");
const { PrismaClient } = require("@prisma/client");

async function deleteTenantSchema() {
  const tenantSlug = process.argv[2];

  if (!tenantSlug) {
    console.error("Usage: node scripts/delete-tenant-schema.js <tenant-slug>");
    console.error("Example: node scripts/delete-tenant-schema.js hungry");
    process.exit(1);
  }

  const schemaName = `tenant_${tenantSlug.replace(/-/g, "_")}`;

  console.log(`\n⚠️  WARNING: This will permanently delete tenant "${tenantSlug}"`);
  console.log(`Schema to be deleted: ${schemaName}\n`);

  // Delete from shared database
  const client = new Client({
    user: "postgres",
    password: "bishnu12#",
    host: "127.0.0.1",
    port: 5432,
    database: "cafemate_shared",
  });

  // Delete from master database
  const masterPrisma = new PrismaClient({
    datasources: {
      db: {
        url: "postgresql://postgres:bishnu12%23@localhost:5432/cafemate_master?schema=public&connection_limit=5&pool_timeout=10",
      },
    },
  });

  try {
    await client.connect();

    // Drop the schema
    console.log(`Dropping schema ${schemaName}...`);
    await client.query(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`);
    console.log(`✅ Schema ${schemaName} deleted`);

    await client.end();

    // Delete from master database
    console.log(`\nDeleting from master database...`);
    const deleted = await masterPrisma.tenant.deleteMany({
      where: { slug: tenantSlug },
    });

    if (deleted.count > 0) {
      console.log(`✅ Deleted ${deleted.count} tenant record(s) from master database`);
    } else {
      console.log(`ℹ️  No tenant record found in master database (may not have been created)`);
    }

    console.log(`\n✅ Tenant "${tenantSlug}" completely removed!`);
    console.log(`You can now recreate it fresh.`);

  } catch (error) {
    console.error("\n❌ Error:", error.message);
  } finally {
    await masterPrisma.$disconnect();
  }
}

deleteTenantSchema();
