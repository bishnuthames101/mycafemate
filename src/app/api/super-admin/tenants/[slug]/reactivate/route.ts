import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { reactivateTenant } from "@/lib/services/tenant-provisioning";
import { getMasterPrisma } from "@/lib/prisma-multi-tenant";
import { logger } from '@/lib/utils/logger';

/**
 * POST /api/super-admin/tenants/[slug]/reactivate
 * Reactivate a suspended tenant
 */
export async function POST(
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

    // Reactivate the tenant
    await reactivateTenant(tenant.id);

    return NextResponse.json({
      success: true,
      message: "Tenant reactivated successfully",
    });
  } catch (error: any) {
    logger.error("Tenant reactivation error:", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
