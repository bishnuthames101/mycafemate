import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import bcrypt from "bcryptjs";
import { logger } from '@/lib/utils/logger';

/**
 * GET /api/admin/users/:userId/password
 * Test endpoint to verify route is working
 */
export async function GET(
  request: NextRequest,
  context: { params: { userId: string } }
) {
  const { userId } = context.params;
  return NextResponse.json({
    message: "Password route is working",
    userId,
    method: "GET"
  });
}

/**
 * PUT /api/admin/users/:userId/password
 * Change password for a user (admin only)
 */
export async function PUT(
  request: NextRequest,
  context: { params: { userId: string } }
) {
  try {
    const { userId } = context.params;

    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // Validation
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Get tenant slug from session
    const tenantSlug = session.user.tenantSlug;
    if (!tenantSlug) {
      return NextResponse.json(
        { error: "Tenant not found in session" },
        { status: 400 }
      );
    }

    const prisma = await getTenantPrisma(tenantSlug);

    // Get the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // If changing own password, verify current password
    const isOwnPassword = session.user.id === userId;

    if (isOwnPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required" },
          { status: 400 }
        );
      }

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      }
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      message: "Password updated successfully",
    });
  } catch (error: any) {
    logger.error("[Password Change] ERROR", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: error.message || "Failed to update password" },
      { status: 500 }
    );
  }
}
