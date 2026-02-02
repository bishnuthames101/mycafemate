import { NextRequest, NextResponse } from "next/server";
import { runAllSubscriptionChecks } from "@/lib/services/subscription-notifications";
import { logger } from '@/lib/utils/logger';

/**
 * Cron endpoint for subscription checks
 *
 * GET /api/cron/check-subscriptions
 *
 * Security: Requires CRON_SECRET header (Bearer token or x-cron-secret)
 *
 * Vercel Cron configuration (vercel.json):
 * {
 *   "crons": [{
 *     "path": "/api/cron/check-subscriptions",
 *     "schedule": "0 2 * * *"
 *   }]
 * }
 *
 * This endpoint checks:
 * - Trial expirations (7, 3, 1 day warnings + expired)
 * - Payment due dates (7, 3, 1 day warnings + overdue)
 * - Usage limits (DB size, API requests)
 *
 * Creates notifications in tenant databases for all relevant events
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (support both Authorization header and x-cron-secret)
    const authHeader = request.headers.get("authorization");
    const cronSecretHeader = request.headers.get("x-cron-secret");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      logger.error("CRON_SECRET not configured");
      return NextResponse.json(
        { error: "Cron secret not configured" },
        { status: 500 }
      );
    }

    // Check either Bearer token or x-cron-secret header
    const isAuthorized =
      authHeader === `Bearer ${cronSecret}` || cronSecretHeader === cronSecret;

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid cron secret" },
        { status: 401 }
      );
    }

    logger.info("Cron job triggered: Subscription notification checks");

    // Run all subscription notification checks
    const results = await runAllSubscriptionChecks();

    // Return result
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results: {
        trials: {
          expiringSoon: results.trials.expiringSoon,
          expired: results.trials.expired,
        },
        payments: {
          upcomingPayments: results.payments.upcomingPayments,
          overduePayments: results.payments.overduePayments,
        },
        usage: {
          warningsCreated: results.usage.warningsCreated,
        },
      },
    });
  } catch (error: any) {
    logger.error("Cron job failed:", error instanceof Error ? error : undefined);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
