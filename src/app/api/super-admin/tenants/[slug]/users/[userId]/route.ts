import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getMasterPrisma, getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { logger } from '@/lib/utils/logger';

/**
 * DELETE /api/super-admin/tenants/[slug]/users/[userId]
 * Delete user from tenant's database
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string; userId: string } }
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

    // Get tenant from master DB
    const tenant = await masterPrisma.tenant.findUnique({
      where: { slug: params.slug },
      select: { id: true },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // Get tenant database
    const tenantPrisma = await getTenantPrisma(params.slug);

    // Get user details before deletion
    const user = await tenantPrisma.user.findUnique({
      where: { id: params.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isTenantOwner: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent deletion of tenant owner
    if (user.isTenantOwner) {
      return NextResponse.json(
        { error: "Cannot delete tenant owner account" },
        { status: 403 }
      );
    }

    // Prevent deletion of last ADMIN user
    if (user.role === "ADMIN") {
      const adminCount = await tenantPrisma.user.count({
        where: { role: "ADMIN" },
      });

      if (adminCount === 1) {
        return NextResponse.json(
          {
            error:
              "Cannot delete last admin user. Tenant must have at least one admin.",
          },
          { status: 403 }
        );
      }
    }

    // Delete user
    await tenantPrisma.user.delete({
      where: { id: params.userId },
    });

    // Update staff count in master DB
    const newStaffCount = await tenantPrisma.user.count();

    await masterPrisma.tenant.update({
      where: { id: tenant.id },
      data: { currentStaffCount: newStaffCount },
    });

    // Log activity
    await masterPrisma.tenantActivityLog.create({
      data: {
        tenantId: tenant.id,
        action: "USER_DELETED",
        performedBy: session.user.id,
        details: {
          deletedUserName: user.name,
          deletedUserEmail: user.email,
          deletedUserRole: user.role,
          newStaffCount,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    logger.error("Delete user error:", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
