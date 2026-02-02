import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getMasterPrisma } from "@/lib/prisma-multi-tenant";
import { logger } from '@/lib/utils/logger';

/**
 * GET /api/super-admin/usage
 * Get usage statistics for all tenants or a specific tenant
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Super admin access required." },
        { status: 401 }
      );
    }

    const masterPrisma = getMasterPrisma();
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const days = parseInt(searchParams.get("days") || "30");

    if (tenantId) {
      // Get usage for specific tenant
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const tenant = await masterPrisma.tenant.findUnique({
        where: { id: tenantId },
        include: {
          usageHistory: {
            where: {
              date: { gte: startDate },
            },
            orderBy: { date: "desc" },
          },
        },
      });

      if (!tenant) {
        return NextResponse.json(
          { error: "Tenant not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        tenant: {
          id: tenant.id,
          slug: tenant.slug,
          businessName: tenant.businessName,
          subscriptionTier: tenant.subscriptionTier,
          limits: {
            maxDbSizeMB: tenant.maxDbSizeMB,
            maxApiRequests: tenant.maxApiRequests,
            maxStorageMB: tenant.maxStorageMB,
          },
          current: {
            dbSizeMB: tenant.currentDbSizeMB,
            storageMB: tenant.currentStorageMB,
          },
          exceeded: {
            db: tenant.dbLimitExceeded,
            api: tenant.apiLimitExceeded,
            at: tenant.limitExceededAt,
          },
        },
        usage: tenant.usageHistory,
      });
    } else {
      // Get overview for all tenants
      const tenants = await masterPrisma.tenant.findMany({
        where: { isActive: true },
        select: {
          id: true,
          slug: true,
          businessName: true,
          subscriptionTier: true,
          currentDbSizeMB: true,
          maxDbSizeMB: true,
          maxApiRequests: true,
          dbLimitExceeded: true,
          apiLimitExceeded: true,
          limitExceededAt: true,
        },
        orderBy: { currentDbSizeMB: "desc" },
      });

      // Get today's usage for all tenants
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayUsage = await masterPrisma.tenantUsage.findMany({
        where: { date: today },
        select: {
          tenantId: true,
          apiRequests: true,
          dbSizeMB: true,
          dbOverage: true,
          apiOverage: true,
        },
      });

      // Create map for quick lookup
      const usageMap = new Map(
        todayUsage.map((u) => [u.tenantId, u])
      );

      // Combine data
      const combinedData = tenants.map((tenant) => {
        const usage = usageMap.get(tenant.id);
        return {
          ...tenant,
          todayApiRequests: usage?.apiRequests || 0,
          todayDbSizeMB: usage?.dbSizeMB || tenant.currentDbSizeMB,
          hasOverage: usage?.dbOverage || usage?.apiOverage || false,
        };
      });

      return NextResponse.json({ tenants: combinedData });
    }
  } catch (error: any) {
    logger.error("Usage statistics error:", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
