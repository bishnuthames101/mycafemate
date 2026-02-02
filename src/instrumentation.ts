/**
 * Next.js Instrumentation Hook
 *
 * This file runs ONCE when the server starts (both dev and production).
 * Perfect place for environment validation and initialization tasks.
 *
 * Docs: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

import { validateEnvironmentOrThrow } from '@/lib/config/env-validation';
import { logger } from '@/lib/utils/logger';

/**
 * Register function runs once on server startup
 * This is the earliest hook available in Next.js
 */
export async function register() {
  // Only run on server (not in edge runtime)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      // Validate environment variables before app starts
      validateEnvironmentOrThrow();

      // Initialize Sentry for server-side error tracking
      if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
        await import('../sentry.server.config');
      }

      // Log startup info (only in development)
      if (process.env.NODE_ENV !== 'production') {
        logger.info('Server instrumentation initialized');
      }
    } catch (error) {
      // Log the error and exit
      logger.error('Failed to initialize server', error instanceof Error ? error : undefined);

      // In production, we want to fail fast
      // In development, we also want to fail to catch issues early
      process.exit(1);
    }
  }

}
