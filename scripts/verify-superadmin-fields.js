const { PrismaClient } = require('../src/generated/prisma-master');

const prisma = new PrismaClient();

async function verify() {
  try {
    // Try to select the security fields
    const admin = await prisma.superAdmin.findFirst({
      select: {
        id: true,
        email: true,
        name: true,
        failedLoginAttempts: true,
        lockedUntil: true,
        lastFailedLogin: true,
      }
    });

    console.log('✅ SUCCESS: All security fields are accessible in SuperAdmin model');
    console.log('Admin count:', await prisma.superAdmin.count());

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verify();
