const { Client } = require("pg");

async function checkMasterTenants() {
  const client = new Client({
    user: "postgres",
    password: "bishnu12#",
    host: "127.0.0.1",
    port: 5432,
    database: "cafemate_master",
  });

  try {
    await client.connect();

    console.log("\nChecking tenants in master database:\n");

    const result = await client.query(`
      SELECT
        id,
        slug,
        "businessName",
        "contactEmail",
        status,
        "subscriptionStatus",
        "databaseName",
        "createdAt"
      FROM "Tenant"
      ORDER BY "createdAt" DESC
    `);

    if (result.rows.length === 0) {
      console.log("❌ No tenants found in master database!");
    } else {
      console.log(`✅ Found ${result.rows.length} tenant(s):\n`);
      result.rows.forEach((tenant, index) => {
        console.log(`${index + 1}. ${tenant.businessName} (${tenant.slug})`);
        console.log(`   Email: ${tenant.contactEmail}`);
        console.log(`   Status: ${tenant.status}`);
        console.log(`   Subscription: ${tenant.subscriptionStatus}`);
        console.log(`   Database/Schema: ${tenant.databaseName || 'N/A'}`);
        console.log(`   Created: ${tenant.createdAt}`);
        console.log("");
      });
    }

    await client.end();
  } catch (error) {
    console.error("\n❌ Error:", error.message);
  }
}

checkMasterTenants();
