import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getMasterPrisma } from "@/lib/prisma-multi-tenant";
import { deleteTenant } from "@/lib/services/tenant-provisioning";
import { logger } from '@/lib/utils/logger';

/**
 * GET /api/super-admin/tenants/[slug]
 * Fetch single tenant details
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
        contactName: true,
        contactEmail: true,
        contactPhone: true,
        subscriptionStatus: true,
        subscriptionTier: true,
        status: true,
        trialEndsAt: true,
        monthlyFee: true,
        customStorageLimitMB: true,
        customBandwidthLimitGB: true,
        customOrdersLimit: true,
        customStaffLimit: true,
        currentStaffCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      tenant,
    });
  } catch (error: any) {
    logger.error("Get tenant error:", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: "Failed to fetch tenant" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/super-admin/tenants/[slug]
 * Update tenant details (business name, contact info, custom pricing)
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

    // Get current tenant
    const tenant = await masterPrisma.tenant.findUnique({
      where: { slug: params.slug },
      select: { id: true, monthlyFee: true, contactEmail: true },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // Parse request body
    const body = await request.json();
    const { businessName, contactName, contactEmail, contactPhone, monthlyFee } = body;

    // Validation
    if (businessName !== undefined) {
      if (typeof businessName !== "string" || businessName.length < 3 || businessName.length > 100) {
        return NextResponse.json(
          { error: "Business name must be between 3-100 characters" },
          { status: 400 }
        );
      }
    }

    if (contactEmail !== undefined) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactEmail)) {
        return NextResponse.json(
          { error: "Invalid email format" },
          { status: 400 }
        );
      }

      // Check email uniqueness (exclude current tenant)
      const existingTenant = await masterPrisma.tenant.findUnique({
        where: { contactEmail },
        select: { id: true },
      });

      if (existingTenant && existingTenant.id !== tenant.id) {
        return NextResponse.json(
          { error: "Contact email already in use by another tenant" },
          { status: 400 }
        );
      }
    }

    if (monthlyFee !== undefined) {
      // Validate monthly fee
      if (typeof monthlyFee !== "number" || monthlyFee < 500 || monthlyFee > 50000) {
        return NextResponse.json(
          { error: "Monthly fee must be between NPR 500 and NPR 50,000" },
          { status: 400 }
        );
      }

      if (monthlyFee % 100 !== 0) {
        return NextResponse.json(
          { error: "Monthly fee must be in increments of NPR 100" },
          { status: 400 }
        );
      }
    }

    // Build update data
    const updateData: any = {};
    if (businessName !== undefined) updateData.businessName = businessName;
    if (contactName !== undefined) updateData.contactName = contactName;
    if (contactEmail !== undefined) updateData.contactEmail = contactEmail;
    if (contactPhone !== undefined) updateData.contactPhone = contactPhone;
    if (monthlyFee !== undefined) updateData.monthlyFee = monthlyFee;

    // Update tenant
    const updatedTenant = await masterPrisma.tenant.update({
      where: { id: tenant.id },
      data: updateData,
      select: {
        id: true,
        slug: true,
        businessName: true,
        contactName: true,
        contactEmail: true,
        contactPhone: true,
        monthlyFee: true,
      },
    });

    // Log activity
    const activityDetails: any = { updates: updateData };
    if (monthlyFee !== undefined && monthlyFee !== tenant.monthlyFee) {
      activityDetails.pricingChange = {
        oldMonthlyFee: tenant.monthlyFee,
        newMonthlyFee: monthlyFee,
        change: monthlyFee - tenant.monthlyFee,
      };
    }

    await masterPrisma.tenantActivityLog.create({
      data: {
        tenantId: tenant.id,
        action: "TENANT_DETAILS_UPDATED",
        performedBy: session.user.id,
        details: activityDetails,
      },
    });

    return NextResponse.json({
      success: true,
      tenant: updatedTenant,
    });
  } catch (error: any) {
    logger.error("Update tenant error:", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: "Failed to update tenant" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/super-admin/tenants/[slug]
 * Delete tenant (soft or hard delete)
 */
export async function DELETE(
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

    // Get tenant
    const tenant = await masterPrisma.tenant.findUnique({
      where: { slug: params.slug },
      select: { id: true, slug: true, businessName: true },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // Parse request body
    const body = await request.json();
    const { confirmSlug, hardDelete = false } = body;

    // Validate slug confirmation
    if (confirmSlug !== tenant.slug) {
      return NextResponse.json(
        { error: "Slug confirmation does not match" },
        { status: 400 }
      );
    }

    if (hardDelete) {
      // Hard delete: Call deleteTenant service function
      const result = await deleteTenant(tenant.id, tenant.slug, true);

      if (!result.success) {
        return NextResponse.json(
          { error: result.error || "Failed to delete tenant" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Tenant permanently deleted",
      });
    } else {
      // Soft delete: Mark as CANCELLED
      await masterPrisma.tenant.update({
        where: { id: tenant.id },
        data: {
          status: "CANCELLED",
          subscriptionStatus: "CANCELLED",
          suspendedAt: new Date(),
        },
      });

      // Log activity
      await masterPrisma.tenantActivityLog.create({
        data: {
          tenantId: tenant.id,
          action: "TENANT_CANCELLED",
          performedBy: session.user.id,
          details: {
            message: `Tenant marked as cancelled (database preserved)`,
            businessName: tenant.businessName,
          },
        },
      });

      return NextResponse.json({
        success: true,
        message: "Tenant marked as cancelled",
      });
    }
  } catch (error: any) {
    logger.error("Delete tenant error:", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: "Failed to delete tenant" },
      { status: 500 }
    );
  }
}
