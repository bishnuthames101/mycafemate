import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { logger } from '@/lib/utils/logger';

/**
 * GET /api/admin/users
 * Fetch all users for the current tenant (admin only)
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
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

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        role: "asc", // ADMIN first, then KITCHEN_STAFF, then STAFF
      },
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    logger.error("Failed to fetch users", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
