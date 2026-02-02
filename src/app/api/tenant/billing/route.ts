/**
 * Tenant Billing API
 * GET /api/tenant/billing
 *
 * Returns billing calculation with overage charges for the tenant
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { calculateTenantBilling } from "@/lib/services/usage-calculator";
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

    // Only ADMIN can view billing data
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

    // Calculate billing
    const billing = await calculateTenantBilling(tenantSlug);

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
