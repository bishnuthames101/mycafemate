const { Client } = require("pg");

async function listTenantSchemas() {
  const client = new Client({
    user: "postgres",
    password: "bishnu12#",
    host: "127.0.0.1",
    port: 5432,
    database: "cafemate_shared",
  });

  try {
    await client.connect();

    console.log("\nListing all tenant schemas in cafemate_shared database:\n");

    const result = await client.query(`
      SELECT schema_name
      FROM information_schema.schemata
      WHERE schema_name LIKE 'tenant_%'
      ORDER BY schema_name
    `);

    if (result.rows.length === 0) {
      console.log("❌ No tenant schemas found!");
      console.log("\nThis means no tenants have been created yet.");
    } else {
      console.log(`✅ Found ${result.rows.length} tenant schema(s):\n`);
      result.rows.forEach((row, index) => {
        const tenantSlug = row.schema_name.replace("tenant_", "").replace(/_/g, "-");
        console.log(`${index + 1}. ${row.schema_name} (slug: ${tenantSlug})`);
      });
    }

    await client.end();
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    if (error.message.includes("does not exist")) {
      console.error("\nThe 'cafemate_shared' database does not exist!");
      console.error("You may need to create it first.");
    }
  }
}

listTenantSchemas();
