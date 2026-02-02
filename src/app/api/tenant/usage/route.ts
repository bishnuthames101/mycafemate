/**
 * Tenant Usage API
 * GET /api/tenant/usage
 *
 * Returns current usage statistics for the tenant
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantUsage } from "@/lib/services/usage-calculator";
import { USAGE_LIMITS } from "@/lib/constants/usage-limits";
import { getMasterPrisma } from "@/lib/prisma-multi-tenant";
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

    // Only ADMIN can view usage data
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

    // Get tenant custom limits
    const masterPrisma = getMasterPrisma();
    const tenant = await masterPrisma.tenant.findUnique({
      where: { slug: tenantSlug },
      select: {
        customStorageLimitMB: true,
        customBandwidthLimitGB: true,
        customOrdersLimit: true,
        customStaffLimit: true,
      },
    });

    if (!tenant) {
      return NextResponse.json(
        { error: "Tenant not found" },
        { status: 404 }
      );
    }

    // Get current usage
    const usage = await getTenantUsage(tenantSlug);

    // Get limits (custom or default)
    const limits = {
      databaseStorageMB: tenant.customStorageLimitMB || USAGE_LIMITS.DATABASE_STORAGE_MB,
      bandwidthGB: tenant.customBandwidthLimitGB || USAGE_LIMITS.BANDWIDTH_GB,
      ordersPerMonth: tenant.customOrdersLimit || USAGE_LIMITS.ORDERS_PER_MONTH,
      staffAccounts: tenant.customStaffLimit || USAGE_LIMITS.STAFF_ACCOUNTS,
    };

    // Calculate usage percentages
    const usagePercentages = {
      databaseStorage: (usage.databaseStorageMB / limits.databaseStorageMB) * 100,
      bandwidth: (usage.bandwidthGB / limits.bandwidthGB) * 100,
      orders: (usage.ordersCount / limits.ordersPerMonth) * 100,
      staff: (usage.staffCount / limits.staffAccounts) * 100,
    };

    return NextResponse.json({
      success: true,
      usage,
      limits,
      usagePercentages,
    });
  } catch (error: any) {
    logger.error("Error fetching tenant usage:", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: error.message || "Failed to fetch usage" },
      { status: 500 }
    );
  }
}
