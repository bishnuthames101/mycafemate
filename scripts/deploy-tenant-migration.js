const { execSync } = require('child_process');

const slug = process.argv[2];
if (!slug) {
  console.error('Usage: node scripts/deploy-tenant-migration.js <tenant-slug>');
  process.exit(1);
}

const dbUrl = `postgresql://postgres:bishnu12%23@localhost:5432/cafemate_shared?schema=tenant_${slug}`;
console.log(`Deploying migrations for tenant: ${slug}`);
console.log(`Schema: tenant_${slug}`);

try {
  // Override DATABASE_URL for this child process
  const result = execSync('npx prisma migrate deploy', {
    cwd: process.cwd(),
    env: {
      ...process.env,
      DATABASE_URL: dbUrl,
    },
    stdio: 'pipe',
    encoding: 'utf-8',
  });
  console.log(result);
} catch (error) {
  console.error('Migration failed:');
  console.error(error.stdout || '');
  console.error(error.stderr || '');
  process.exit(1);
}
