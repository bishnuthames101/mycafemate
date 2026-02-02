const { PrismaClient } = require("@prisma/client");

async function checkTenantUsers() {
  const tenantSlug = process.argv[2];

  if (!tenantSlug) {
    console.error("Usage: node scripts/check-tenant-users.js <tenant-slug>");
    console.error("Example: node scripts/check-tenant-users.js hungry");
    process.exit(1);
  }

  // Check multi-tenancy mode from environment
  const multiTenancyMode = process.env.MULTI_TENANCY_MODE || "DATABASE";

  let databaseUrl;
  let location;

  if (multiTenancyMode === "SCHEMA") {
    // SCHEMA mode: Use shared database with tenant schema
    const schemaName = `tenant_${tenantSlug.replace(/-/g, "_")}`;
    databaseUrl = `postgresql://postgres:bishnu12%23@127.0.0.1:5432/cafemate_shared?schema=${schemaName}`;
    location = `Schema: ${schemaName} (in cafemate_shared database)`;
  } else {
    // DATABASE mode: Separate database per tenant
    const dbName = `cafemate_${tenantSlug.replace(/-/g, "_")}`;
    databaseUrl = `postgresql://postgres:bishnu12%23@127.0.0.1:5432/${dbName}`;
    location = `Database: ${dbName}`;
  }

  console.log(`\nChecking users for tenant: ${tenantSlug}`);
  console.log(`Mode: ${multiTenancyMode}`);
  console.log(`${location}\n`);

  const prisma = new PrismaClient({
    datasources: {
      db: { url: databaseUrl },
    },
  });

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isTenantOwner: true,
        locationId: true,
      },
      orderBy: { email: "asc" },
    });

    if (users.length === 0) {
      console.log("❌ No users found in this tenant database!");
      return;
    }

    console.log(`✅ Found ${users.length} users:\n`);

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Is Owner: ${user.isTenantOwner}`);
      console.log(`   Location ID: ${user.locationId}`);
      console.log("");
    });

    // Check for the expected admin user
    const admin = users.find(u => u.role === "ADMIN");
    const kitchen = users.find(u => u.role === "KITCHEN_STAFF");
    const staff = users.find(u => u.role === "STAFF");

    console.log("\n=== Role Summary ===");
    console.log(`Admin user: ${admin ? `✅ ${admin.email}` : "❌ NOT FOUND"}`);
    console.log(`Kitchen user: ${kitchen ? `✅ ${kitchen.email}` : "❌ NOT FOUND"}`);
    console.log(`Staff user: ${staff ? `✅ ${staff.email}` : "❌ NOT FOUND"}`);

  } catch (error) {
    console.error("\n❌ Error:", error.message);
    if (error.message.includes("does not exist") || error.message.includes("schema")) {
      console.error(`\nThe tenant "${tenantSlug}" does not exist or was not created properly.`);
      console.error("Make sure you created the tenant successfully.");
      if (multiTenancyMode === "SCHEMA") {
        console.error(`\nExpected schema: tenant_${tenantSlug.replace(/-/g, "_")}`);
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkTenantUsers();
