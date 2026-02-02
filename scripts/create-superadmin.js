const fs = require('fs');
const path = require('path');

// Load .env manually
const envPath = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('../src/generated/prisma-master');

async function main() {
  const masterPrisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.MASTER_DATABASE_URL,
      },
    },
  });

  try {
    // Hash the password
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create super admin
    const superAdmin = await masterPrisma.superAdmin.upsert({
      where: { email: 'admin@cafemate.local' },
      update: {},
      create: {
        name: 'System Administrator',
        email: 'admin@cafemate.local',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        isActive: true,
      },
    });

    console.log('✅ Super Admin created successfully!');
    console.log('Email:', superAdmin.email);
    console.log('Password: admin123');
    console.log('Access at: http://admin.localhost:3000/login');

  } catch (error) {
    console.error('Error creating super admin:', error.message);
    process.exit(1);
  } finally {
    await masterPrisma.$disconnect();
  }
}

main();
