import { NextRequest, NextResponse } from "next/server";
import { measureAllTenantsUsage } from "@/lib/services/usage-tracking";
import { logger } from '@/lib/utils/logger';

/**
 * GET /api/cron/measure-usage
 * Measure DB size and update usage records for all active tenants
 *
 * This should be called daily via a cron job or scheduler (e.g., Vercel Cron, GitHub Actions)
 *
 * Example cron schedule: 0 2 * * * (2 AM daily)
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (support Authorization header or query param)
    const authHeader = request.headers.get("authorization");
    const querySecret = request.nextUrl.searchParams.get("secret");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      return NextResponse.json(
        { error: "CRON_SECRET not configured" },
        { status: 500 }
      );
    }

    const isAuthorized =
      authHeader === `Bearer ${cronSecret}` ||
      querySecret === cronSecret;

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Invalid cron secret." },
        { status: 401 }
      );
    }

    // Measure usage for all tenants
    logger.info("Starting scheduled usage measurement...");
    await measureAllTenantsUsage();

    return NextResponse.json({
      success: true,
      message: "Usage measurement completed",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    logger.error("Cron job error:", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cron/measure-usage
 * Alternative method for triggering usage measurement
 */
export async function POST(request: NextRequest) {
  return GET(request);
}
