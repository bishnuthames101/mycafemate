import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantSlug } from "@/lib/utils/tenant-resolver";
import { getMasterPrisma } from "@/lib/prisma-multi-tenant";
import { logger } from '@/lib/utils/logger';

/**
 * GET /api/admin/usage
 * Get usage statistics for the current tenant (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    // Get tenant context
    const tenantSlug = getTenantSlug();
    if (!tenantSlug) {
      return NextResponse.json(
        { error: "Tenant context not found" },
        { status: 400 }
      );
    }

    const masterPrisma = getMasterPrisma();
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");

    // Get tenant info
    const tenant = await masterPrisma.tenant.findUnique({
      where: { slug: tenantSlug },
      select: {
        id: true,
        slug: true,
        businessName: true,
        subscriptionTier: true,
        maxDbSizeMB: true,
        maxApiRequests: true,
        maxStorageMB: true,
        currentDbSizeMB: true,
        currentStorageMB: true,
        dbLimitExceeded: true,
        apiLimitExceeded: true,
        limitExceededAt: true,
        monthlyFee: true,
      },
    });

    if (!tenant) {
      return NextResponse.json(
        { error: "Tenant not found" },
        { status: 404 }
      );
    }

    // Get usage history
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const usageHistory = await masterPrisma.tenantUsage.findMany({
      where: {
        tenantId: tenant.id,
        date: { gte: startDate },
      },
      orderBy: { date: "desc" },
      select: {
        date: true,
        dbSizeMB: true,
        apiRequests: true,
        storageSizeMB: true,
        dbOverage: true,
        apiOverage: true,
        overageAmount: true,
      },
    });

    // Get today's usage
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayUsage = await masterPrisma.tenantUsage.findUnique({
      where: {
        tenantId_date: {
          tenantId: tenant.id,
          date: today,
        },
      },
      select: {
        apiRequests: true,
        apiRequestsByEndpoint: true,
      },
    });

    // Calculate percentage used
    const dbUsagePercent = (tenant.currentDbSizeMB / tenant.maxDbSizeMB) * 100;
    const apiUsagePercent = todayUsage
      ? (todayUsage.apiRequests / tenant.maxApiRequests) * 100
      : 0;

    // Calculate total overage charges for the period
    const totalOverageCharges = usageHistory.reduce(
      (sum, usage) => sum + (usage.overageAmount || 0),
      0
    );

    return NextResponse.json({
      tenant: {
        name: tenant.businessName,
        slug: tenant.slug,
        tier: tenant.subscriptionTier,
        monthlyFee: tenant.monthlyFee,
      },
      limits: {
        dbSizeMB: tenant.maxDbSizeMB,
        apiRequests: tenant.maxApiRequests,
        storageMB: tenant.maxStorageMB,
      },
      current: {
        dbSizeMB: tenant.currentDbSizeMB,
        dbUsagePercent: Math.round(dbUsagePercent),
        storageMB: tenant.currentStorageMB,
        todayApiRequests: todayUsage?.apiRequests || 0,
        apiUsagePercent: Math.round(apiUsagePercent),
      },
      alerts: {
        dbLimitExceeded: tenant.dbLimitExceeded,
        apiLimitExceeded: tenant.apiLimitExceeded,
        limitExceededAt: tenant.limitExceededAt,
      },
      billing: {
        totalOverageCharges,
        currency: "NPR",
      },
      history: usageHistory,
      todayBreakdown: {
        totalRequests: todayUsage?.apiRequests || 0,
        byEndpoint: todayUsage?.apiRequestsByEndpoint || {},
      },
    });
  } catch (error: any) {
    logger.error("Usage statistics error", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
