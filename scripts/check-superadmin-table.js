const { PrismaClient } = require('../src/generated/src/generated/prisma-master');

const prisma = new PrismaClient();

async function checkSuperAdminTable() {
  try {
    // Try to find a super admin
    const admin = await prisma.superAdmin.findFirst();
    console.log('✅ SuperAdmin table exists');

    if (admin) {
      console.log('\nSample admin record fields:');
      console.log(Object.keys(admin));
    } else {
      console.log('\nTable is empty');
    }

    // Check if failedLoginAttempts field is accessible
    const testQuery = await prisma.superAdmin.findFirst({
      select: {
        id: true,
        email: true,
        failedLoginAttempts: true,
        lockedUntil: true,
      }
    });
    console.log('\n✅ Security fields (failedLoginAttempts, lockedUntil) are accessible');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'P2021') {
      console.log('\n⚠️  SuperAdmin table does not exist. Need to run migrations.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkSuperAdminTable();
