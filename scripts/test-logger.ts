/**
 * Test script for the logger utility
 * Run with: npx tsx scripts/test-logger.ts
 */

import { logger, createLogger } from '../src/lib/utils/logger';

console.log('='.repeat(60));
console.log('Logger Utility Test');
console.log('='.repeat(60));
console.log('');

// Test basic logging levels
console.log('1. Testing basic logging levels:');
console.log('-'.repeat(40));
logger.debug('This is a debug message', { userId: '123' });
logger.info('This is an info message', { action: 'user_login' });
logger.warn('This is a warning message', { issue: 'low_disk_space' });
logger.error('This is an error message', new Error('Test error'));
console.log('');

// Test sensitive data sanitization
console.log('2. Testing sensitive data sanitization:');
console.log('-'.repeat(40));
logger.info('User data logged', {
  username: 'john@example.com',
  password: 'secret123',  // Should be redacted
  token: 'abc123xyz',      // Should be redacted
  age: 30
});
console.log('');

// Test with prefixed logger
console.log('3. Testing prefixed logger:');
console.log('-'.repeat(40));
const tenantLogger = createLogger('[TenantService]');
tenantLogger.info('Creating new tenant', { slug: 'cafe-abc', business: 'Cafe ABC' });
tenantLogger.error('Failed to provision tenant', new Error('Database connection failed'));
console.log('');

// Test error formatting
console.log('4. Testing error formatting:');
console.log('-'.repeat(40));
try {
  throw new Error('Simulated database error');
} catch (error) {
  logger.error('Database operation failed', error as Error, {
    operation: 'INSERT',
    table: 'users'
  });
}
console.log('');

// Test request/response logging
console.log('5. Testing request/response logging:');
console.log('-'.repeat(40));
logger.request('POST', '/api/orders', { body: { items: 3 } });
logger.response('POST', '/api/orders', 201, 145);
logger.response('GET', '/api/products', 500, 523);
console.log('');

console.log('='.repeat(60));
console.log('✅ Logger test completed successfully!');
console.log('');
console.log('Note: In production, logs will be in JSON format');
console.log('      and sensitive data will be automatically redacted.');
console.log('='.repeat(60));
