/**
 * Tenant Usage Alerts API
 * GET /api/tenant/usage-alerts - Get active usage alerts
 * POST /api/tenant/usage-alerts - Check and create new alerts or mark as read
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getActiveAlerts,
  checkAndCreateAlerts,
  markAlertAsRead,
  markAllAlertsAsRead,
} from "@/lib/services/usage-alerts";
import { logger } from '@/lib/utils/logger';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get tenant slug from session (prevents tenant data leakage)
    const tenantSlug = session.user.tenantSlug;
    if (!tenantSlug) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 400 });
    }

    // Only ADMIN can view usage alerts
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

    // Get active alerts
    const alerts = await getActiveAlerts(tenantSlug);

    return NextResponse.json({
      success: true,
      alerts,
    });
  } catch (error: any) {
    logger.error("Error fetching usage alerts:", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: error.message || "Failed to fetch alerts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get tenant slug from session (prevents tenant data leakage)
    const tenantSlug = session.user.tenantSlug;
    if (!tenantSlug) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 400 });
    }

    // Only ADMIN can manage alerts
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

    const body = await request.json();
    const { action, alertId } = body;

    if (action === "check") {
      // Check and create new alerts
      const alerts = await checkAndCreateAlerts(tenantSlug);
      return NextResponse.json({
        success: true,
        alertsCreated: alerts.length,
        alerts,
      });
    }

    if (action === "mark-read") {
      if (alertId) {
        // Mark specific alert as read
        await markAlertAsRead(alertId);
      } else {
        // Mark all alerts as read
        await markAllAlertsAsRead(tenantSlug);
      }

      return NextResponse.json({
        success: true,
        message: alertId ? "Alert marked as read" : "All alerts marked as read",
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error: any) {
    logger.error("Error processing usage alert action:", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: error.message || "Failed to process action" },
      { status: 500 }
    );
  }
}
