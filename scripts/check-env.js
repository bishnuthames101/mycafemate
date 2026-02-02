/**
 * Simple environment check script
 * This uses Node.js directly to check current environment state
 */

console.log('='.repeat(60));
console.log('Environment Variables Check');
console.log('='.repeat(60));
console.log('');

// Check critical variables
const criticalVars = [
  'DB_ENCRYPTION_KEY',
  'NEXTAUTH_SECRET',
  'CRON_SECRET',
  'MASTER_DATABASE_URL',
  'POSTGRES_ADMIN_URL',
  'NODE_ENV'
];

const placeholderPatterns = [
  'your-secret-key-here',
  'your-encryption-key-here',
  'generate-with-openssl',
  'change-in-production',
  'dev_secret'
];

function containsPlaceholder(value) {
  if (!value) return false;
  const lower = value.toLowerCase();
  return placeholderPatterns.some(pattern => lower.includes(pattern));
}

let hasIssues = false;

console.log('Status of critical environment variables:\n');

criticalVars.forEach(varName => {
  const value = process.env[varName];

  if (!value) {
    console.log(`❌ ${varName}: NOT SET`);
    hasIssues = true;
  } else if (containsPlaceholder(value)) {
    console.log(`⚠️  ${varName}: PLACEHOLDER DETECTED`);
    console.log(`   Value starts with: ${value.substring(0, 30)}...`);
    hasIssues = true;
  } else {
    console.log(`✅ ${varName}: SET`);
  }
});

console.log('');

if (hasIssues) {
  console.log('⚠️  Action Required: Please check your .env file');
  console.log('   Generate secure secrets with: openssl rand -base64 32');
  process.exit(1);
} else {
  console.log('✅ All critical environment variables are properly configured');
  process.exit(0);
}
