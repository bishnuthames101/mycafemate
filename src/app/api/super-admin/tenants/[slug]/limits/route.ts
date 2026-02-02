import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getMasterPrisma } from "@/lib/prisma-multi-tenant";
import { logger } from '@/lib/utils/logger';

/**
 * PATCH /api/super-admin/tenants/[slug]/limits
 * Update usage limits for a tenant
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
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

    // Get tenant by slug
    const tenant = await masterPrisma.tenant.findUnique({
      where: { slug: params.slug },
      select: { id: true },
    });

    if (!tenant) {
      return NextResponse.json(
        { error: "Tenant not found" },
        { status: 404 }
      );
    }

    const tenantId = tenant.id;
    const body = await request.json();

    const { maxDbSizeMB, maxApiRequests, maxStorageMB } = body;

    // Validate input
    if (
      maxDbSizeMB !== undefined &&
      (typeof maxDbSizeMB !== "number" || maxDbSizeMB < 0)
    ) {
      return NextResponse.json(
        { error: "Invalid maxDbSizeMB value" },
        { status: 400 }
      );
    }

    if (
      maxApiRequests !== undefined &&
      (typeof maxApiRequests !== "number" || maxApiRequests < 0)
    ) {
      return NextResponse.json(
        { error: "Invalid maxApiRequests value" },
        { status: 400 }
      );
    }

    if (
      maxStorageMB !== undefined &&
      (typeof maxStorageMB !== "number" || maxStorageMB < 0)
    ) {
      return NextResponse.json(
        { error: "Invalid maxStorageMB value" },
        { status: 400 }
      );
    }

    // Update limits
    const updateData: any = {};
    if (maxDbSizeMB !== undefined) updateData.maxDbSizeMB = maxDbSizeMB;
    if (maxApiRequests !== undefined) updateData.maxApiRequests = maxApiRequests;
    if (maxStorageMB !== undefined) updateData.maxStorageMB = maxStorageMB;

    const updatedTenant = await masterPrisma.tenant.update({
      where: { id: tenantId },
      data: updateData,
      select: {
        id: true,
        slug: true,
        businessName: true,
        maxDbSizeMB: true,
        maxApiRequests: true,
        maxStorageMB: true,
        currentDbSizeMB: true,
      },
    });

    // Log activity
    await masterPrisma.tenantActivityLog.create({
      data: {
        tenantId,
        action: "LIMITS_UPDATED",
        performedBy: session.user.id,
        details: {
          updates: updateData,
        },
      },
    });

    return NextResponse.json({
      success: true,
      tenant: updatedTenant,
    });
  } catch (error: any) {
    logger.error("Update limits error:", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/super-admin/tenants/[slug]/limits
 * Get current usage limits for a tenant
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
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

    const tenant = await masterPrisma.tenant.findUnique({
      where: { slug: params.slug },
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
      },
    });

    if (!tenant) {
      return NextResponse.json(
        { error: "Tenant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ tenant });
  } catch (error: any) {
    logger.error("Get limits error:", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
