import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { provisionNewTenant } from "@/lib/services/tenant-provisioning";
import { getMasterPrisma } from "@/lib/prisma-multi-tenant";
import { createTenantSchema } from "@/lib/validations/tenant";
import { ZodError } from "zod";
import { logger } from '@/lib/utils/logger';

/**
 * POST /api/super-admin/tenants
 * Create a new tenant
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Super admin access required." },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();

    let validatedData;
    try {
      validatedData = createTenantSchema.parse(body);
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            error: "Validation failed",
            details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
          },
          { status: 400 }
        );
      }
      throw error;
    }

    // Provision the tenant (auto-creates 3 users with default passwords)
    // All tenants use BASIC tier with 1200 NPR usage-based pricing
    const result = await provisionNewTenant({
      businessName: validatedData.businessName,
      slug: validatedData.slug,
      contactEmail: validatedData.contactEmail,
      contactPhone: validatedData.contactPhone,
      trialDays: validatedData.trialDays,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      tenantId: result.tenantId,
      slug: result.slug,
      loginUrl: result.loginUrl,
      credentials: result.credentials, // Include credentials for display
    });
  } catch (error: any) {
    logger.error("Tenant creation error:", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: "Failed to create tenant" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/super-admin/tenants
 * List all tenants with optional filtering
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const subscriptionStatus = searchParams.get("subscriptionStatus");

    // Build filter
    const where: any = {};
    if (status) where.status = status;
    if (subscriptionStatus) where.subscriptionStatus = subscriptionStatus;

    // Fetch tenants
    const tenants = await masterPrisma.tenant.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        businessName: true,
        contactEmail: true,
        contactPhone: true,
        subscriptionStatus: true,
        subscriptionTier: true,
        status: true,
        trialEndsAt: true,
        nextPaymentDue: true,
        monthlyFee: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ tenants });
  } catch (error: any) {
    logger.error("Tenant listing error:", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: "Failed to list tenants" },
      { status: 500 }
    );
  }
}
