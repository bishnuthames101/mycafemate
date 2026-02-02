/**
 * Environment Variable Validation
 *
 * Validates critical environment variables on application startup.
 * Prevents deployment with insecure placeholder values.
 *
 * This module runs ONCE during app initialization and throws errors
 * if any security-critical variables are missing or contain placeholders.
 */

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Known insecure placeholder patterns that should never be in production
 */
const INSECURE_PATTERNS = [
  'your-secret-key-here',
  'your-encryption-key-here',
  'generate-with-openssl',
  'change-in-production',
  'placeholder',
  'example',
  'dev_secret',
  'test_secret',
  'replace-this',
];

/**
 * Check if a value contains any insecure placeholder patterns
 */
function containsPlaceholder(value: string | undefined): boolean {
  if (!value) return false;

  const lowerValue = value.toLowerCase();
  return INSECURE_PATTERNS.some(pattern => lowerValue.includes(pattern));
}

/**
 * Validate encryption key format and security
 */
function validateEncryptionKey(key: string | undefined): string[] {
  const errors: string[] = [];

  if (!key) {
    errors.push('DB_ENCRYPTION_KEY is not set');
    return errors;
  }

  if (containsPlaceholder(key)) {
    errors.push(
      'DB_ENCRYPTION_KEY contains a placeholder value. ' +
      'Generate a secure key with: openssl rand -base64 32'
    );
    return errors;
  }

  // Validate it's a valid base64 string
  try {
    const keyBuffer = Buffer.from(key, 'base64');

    if (keyBuffer.length !== 32) {
      errors.push(
        `DB_ENCRYPTION_KEY must be exactly 32 bytes (256 bits). ` +
        `Current length: ${keyBuffer.length} bytes. ` +
        `Generate a new key with: openssl rand -base64 32`
      );
    }
  } catch (error) {
    errors.push(
      'DB_ENCRYPTION_KEY is not a valid base64 string. ' +
      'Generate a secure key with: openssl rand -base64 32'
    );
  }

  return errors;
}

/**
 * Validate NextAuth secret
 */
function validateNextAuthSecret(secret: string | undefined): string[] {
  const errors: string[] = [];

  if (!secret) {
    errors.push('NEXTAUTH_SECRET is not set');
    return errors;
  }

  if (containsPlaceholder(secret)) {
    errors.push(
      'NEXTAUTH_SECRET contains a placeholder value. ' +
      'Generate a secure secret with: openssl rand -base64 32'
    );
    return errors;
  }

  if (secret.length < 32) {
    errors.push(
      `NEXTAUTH_SECRET is too short (${secret.length} characters). ` +
      'It should be at least 32 characters. ' +
      'Generate a secure secret with: openssl rand -base64 32'
    );
  }

  return errors;
}

/**
 * Validate CRON secret (less critical but should still be secure)
 */
function validateCronSecret(secret: string | undefined): string[] {
  const errors: string[] = [];

  if (!secret) {
    // CRON_SECRET is optional, only warn
    return errors;
  }

  if (containsPlaceholder(secret)) {
    errors.push(
      'CRON_SECRET contains a placeholder value. ' +
      'Generate a secure secret with: openssl rand -base64 32'
    );
  }

  return errors;
}

/**
 * Validate database URLs are set
 */
function validateDatabaseUrls(): string[] {
  const errors: string[] = [];

  if (!process.env.MASTER_DATABASE_URL) {
    errors.push('MASTER_DATABASE_URL is not set');
  }

  if (!process.env.POSTGRES_ADMIN_URL) {
    errors.push('POSTGRES_ADMIN_URL is not set');
  }

  return errors;
}

/**
 * Validate environment configuration
 * Returns validation result with errors and warnings
 */
export function validateEnvironment(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Only enforce strict validation in production
  const isProduction = process.env.NODE_ENV === 'production';

  // Critical: Encryption key
  errors.push(...validateEncryptionKey(process.env.DB_ENCRYPTION_KEY));

  // Critical: NextAuth secret
  errors.push(...validateNextAuthSecret(process.env.NEXTAUTH_SECRET));

  // Important: CRON secret
  const cronErrors = validateCronSecret(process.env.CRON_SECRET);
  if (isProduction) {
    errors.push(...cronErrors);
  } else {
    warnings.push(...cronErrors);
  }

  // Critical: Database URLs
  errors.push(...validateDatabaseUrls());

  // Warning: Check NODE_ENV is set correctly
  if (!process.env.NODE_ENV) {
    warnings.push('NODE_ENV is not set. Defaulting to development mode.');
  }

  // Warning: Check public URL is set for production
  if (isProduction && !process.env.NEXT_PUBLIC_APP_URL) {
    warnings.push('NEXT_PUBLIC_APP_URL is not set in production');
  }

  // Warning: Check rate limiting is configured for production
  if (isProduction && (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN)) {
    warnings.push(
      'UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not set. ' +
      'Rate limiting will fall back to in-memory storage (not recommended for production)'
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate and throw if critical errors are found
 * Call this during application initialization
 */
export function validateEnvironmentOrThrow(): void {
  const result = validateEnvironment();

  // Always log warnings
  if (result.warnings.length > 0) {
    console.warn('\n⚠️  Environment Configuration Warnings:');
    result.warnings.forEach((warning, index) => {
      console.warn(`   ${index + 1}. ${warning}`);
    });
    console.warn('');
  }

  // Throw if there are critical errors
  if (!result.isValid) {
    console.error('\n❌ Environment Configuration Errors:');
    result.errors.forEach((error, index) => {
      console.error(`   ${index + 1}. ${error}`);
    });
    console.error('\nApplication cannot start with these configuration errors.');
    console.error('Please fix the above issues and restart the application.\n');

    throw new Error(
      'Environment validation failed. Check the console output above for details.'
    );
  }

  // Success message (only in development)
  if (process.env.NODE_ENV !== 'production') {
    console.log('✅ Environment validation passed');
  }
}

/**
 * Get a safe summary of environment configuration
 * (Useful for debugging without exposing secrets)
 */
export function getEnvironmentSummary() {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    isProduction,
    hasEncryptionKey: !!process.env.DB_ENCRYPTION_KEY,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasCronSecret: !!process.env.CRON_SECRET,
    hasMasterDatabase: !!process.env.MASTER_DATABASE_URL,
    hasAdminDatabase: !!process.env.POSTGRES_ADMIN_URL,
    hasRedis: !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN),
    superAdminDomain: process.env.SUPER_ADMIN_DOMAIN || 'not set',
  };
}
