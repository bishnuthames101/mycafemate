/**
 * Trial Expiry Checker - Cron Job
 *
 * This job runs daily to check for:
 * 1. Expired trials → suspend tenants
 * 2. Overdue payments → mark as payment due
 * 3. Severely overdue → suspend accounts
 *
 * Schedule: Run once daily at 2:00 AM
 *
 * Usage:
 * - API Route: GET /api/cron/check-subscriptions (with cron secret)
 * - Manual: Call checkSubscriptions() function
 * - Vercel Cron: Configure in vercel.json
 */

import {
  checkTrialExpiry,
  markOverduePayments,
  suspendOverdueAccounts,
} from "@/lib/services/subscription-management";
import { logger } from '@/lib/utils/logger';

export interface SubscriptionCheckResult {
  timestamp: Date;
  trialsExpired: number;
  paymentsMarkedOverdue: number;
  accountsSuspended: number;
  success: boolean;
  errors: string[];
}

/**
 * Main function to check all subscription statuses
 * Run this daily via cron
 */
export async function checkSubscriptions(): Promise<SubscriptionCheckResult> {
  logger.info("Starting subscription status check...");

  const result: SubscriptionCheckResult = {
    timestamp: new Date(),
    trialsExpired: 0,
    paymentsMarkedOverdue: 0,
    accountsSuspended: 0,
    success: true,
    errors: [],
  };

  try {
    // Step 1: Check for expired trials
    logger.info("Checking expired trials...");
    try {
      const trialResult = await checkTrialExpiry();
      result.trialsExpired = trialResult.expiredCount;
      logger.info(`Trials checked: ${result.trialsExpired} expired`);
    } catch (error: any) {
      result.errors.push(`Trial expiry check failed: ${error.message}`);
      logger.error("Trial expiry check failed:", error instanceof Error ? error : undefined);
    }

    // Step 2: Mark overdue payments (5 day grace period)
    logger.info("Checking overdue payments...");
    try {
      result.paymentsMarkedOverdue = await markOverduePayments(5);
      logger.info(`Overdue payments: ${result.paymentsMarkedOverdue} marked`);
    } catch (error: any) {
      result.errors.push(`Overdue payment check failed: ${error.message}`);
      logger.error("Overdue payment check failed:", error instanceof Error ? error : undefined);
    }

    // Step 3: Suspend severely overdue accounts (15 days overdue)
    logger.info("Suspending severely overdue accounts...");
    try {
      result.accountsSuspended = await suspendOverdueAccounts(15);
      logger.info(`Accounts suspended: ${result.accountsSuspended}`);
    } catch (error: any) {
      result.errors.push(`Account suspension failed: ${error.message}`);
      logger.error("Account suspension failed:", error instanceof Error ? error : undefined);
    }

    // Final result
    if (result.errors.length > 0) {
      result.success = false;
      logger.error(`Subscription check completed with ${result.errors.length} errors`);
    } else {
      logger.info("Subscription check completed successfully");
    }

    logger.info("Summary:");
    logger.info(`   - Trials expired: ${result.trialsExpired}`);
    logger.info(`   - Payments overdue: ${result.paymentsMarkedOverdue}`);
    logger.info(`   - Accounts suspended: ${result.accountsSuspended}`);

    return result;
  } catch (error: any) {
    result.success = false;
    result.errors.push(`Fatal error: ${error.message}`);
    logger.error("Subscription check failed:", error instanceof Error ? error : undefined);
    return result;
  }
}

/**
 * Verify cron secret for security
 * Prevents unauthorized access to cron endpoints
 */
export function verifyCronSecret(secret: string | null): boolean {
  const expectedSecret = process.env.CRON_SECRET;

  if (!expectedSecret) {
    logger.warn("CRON_SECRET not configured - cron jobs are unprotected!");
    return true; // Allow in development
  }

  return secret === expectedSecret;
}

/**
 * Get next run time (2:00 AM next day)
 */
export function getNextRunTime(): Date {
  const next = new Date();
  next.setDate(next.getDate() + 1);
  next.setHours(2, 0, 0, 0); // 2:00 AM
  return next;
}

/**
 * Send summary email to super admin (future implementation)
 */
export async function sendSubscriptionCheckSummary(
  result: SubscriptionCheckResult
): Promise<void> {
  // TODO: Implement email notification
  logger.info("Email summary (not implemented yet):");
  logger.info(`   Timestamp: ${result.timestamp.toISOString()}`);
  logger.info(`   Trials Expired: ${result.trialsExpired}`);
  logger.info(`   Overdue Payments: ${result.paymentsMarkedOverdue}`);
  logger.info(`   Suspended: ${result.accountsSuspended}`);
  logger.info(`   Status: ${result.success ? "Success" : "Failed"}`);
}
