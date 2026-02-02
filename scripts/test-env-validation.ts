/**
 * Test script for environment validation
 * Run with: npx ts-node scripts/test-env-validation.ts
 */

import { validateEnvironment, getEnvironmentSummary } from '../src/lib/config/env-validation';

console.log('='.repeat(60));
console.log('Environment Validation Test');
console.log('='.repeat(60));
console.log('');

// Get environment summary (safe, doesn't expose secrets)
console.log('📋 Environment Summary:');
const summary = getEnvironmentSummary();
console.log(JSON.stringify(summary, null, 2));
console.log('');

// Run validation
console.log('🔍 Running Validation...');
console.log('');

try {
  const result = validateEnvironment();

  if (result.warnings.length > 0) {
    console.log('⚠️  Warnings:');
    result.warnings.forEach((warning, index) => {
      console.log(`   ${index + 1}. ${warning}`);
    });
    console.log('');
  }

  if (result.errors.length > 0) {
    console.log('❌ Errors:');
    result.errors.forEach((error, index) => {
      console.log(`   ${index + 1}. ${error}`);
    });
    console.log('');
    console.log('Result: FAILED ❌');
    process.exit(1);
  } else {
    console.log('✅ All validation checks passed!');
    console.log('');
    console.log('Result: SUCCESS ✅');
    process.exit(0);
  }
} catch (error) {
  console.error('Unexpected error during validation:', error);
  process.exit(1);
}
