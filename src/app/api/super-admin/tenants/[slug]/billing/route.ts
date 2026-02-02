/**
 * Super Admin Tenant Billing API
 * GET /api/super-admin/tenants/[slug]/billing
 *
 * Returns billing calculation for any tenant (super admin only)
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { calculateTenantBilling } from "@/lib/services/usage-calculator";
import { logger } from '@/lib/utils/logger';

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

    const { slug } = params;

    // Calculate billing for the specified tenant
    const billing = await calculateTenantBilling(slug);

    return NextResponse.json({
      success: true,
      billing,
    });
  } catch (error: any) {
    logger.error("Error calculating tenant billing:", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: error.message || "Failed to calculate billing" },
      { status: 500 }
    );
  }
}
