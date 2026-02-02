import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getMasterPrisma, getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { USAGE_LIMITS } from "@/lib/constants/usage-limits";
import bcrypt from "bcryptjs";
import { logger } from '@/lib/utils/logger';

/**
 * GET /api/super-admin/tenants/[slug]/users
 * List all users in tenant's database
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

    // Get tenant from master DB
    const tenant = await masterPrisma.tenant.findUnique({
      where: { slug: params.slug },
      select: {
        id: true,
        customStaffLimit: true,
        currentStaffCount: true,
      },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // Get tenant database connection
    const tenantPrisma = await getTenantPrisma(params.slug);

    // Fetch all users from tenant DB
    const users = await tenantPrisma.user.findMany({
      include: {
        location: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    // Calculate usage
    const staffLimit =
      tenant.customStaffLimit || USAGE_LIMITS.STAFF_ACCOUNTS; // Default: 3 (1 Admin, 1 Waiter, 1 Kitchen)
    const isOverLimit = users.length > staffLimit;
    const overageCharge = isOverLimit
      ? (users.length - staffLimit) * USAGE_LIMITS.STAFF_ACCOUNT_OVERAGE_RATE
      : 0;

    return NextResponse.json({
      success: true,
      users,
      usage: {
        currentCount: users.length,
        limit: staffLimit,
        isOverLimit,
        overageCharge,
      },
    });
  } catch (error: any) {
    logger.error("List users error:", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/super-admin/tenants/[slug]/users
 * Create new user in tenant's database
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

    // Get tenant from master DB
    const tenant = await masterPrisma.tenant.findUnique({
      where: { slug: params.slug },
      select: { id: true, customStaffLimit: true },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // Parse request body
    const body = await request.json();
    const { name, email, password, role, locationId } = body;

    // Validation
    if (!name || typeof name !== "string" || name.length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters" },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Validate password contains letter and number
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      return NextResponse.json(
        { error: "Password must contain at least one letter and one number" },
        { status: 400 }
      );
    }

    if (!role || !["ADMIN", "STAFF", "KITCHEN_STAFF"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be ADMIN, STAFF, or KITCHEN_STAFF" },
        { status: 400 }
      );
    }

    // Get tenant database
    const tenantPrisma = await getTenantPrisma(params.slug);

    // Check email uniqueness in tenant DB
    const existingUser = await tenantPrisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    // Get location (default to first if not specified)
    let targetLocationId = locationId;
    if (!targetLocationId) {
      const firstLocation = await tenantPrisma.location.findFirst({
        where: { isActive: true },
      });

      if (!firstLocation) {
        return NextResponse.json(
          { error: "No active location found" },
          { status: 400 }
        );
      }

      targetLocationId = firstLocation.id;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in tenant database
    const user = await tenantPrisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as any,
        locationId: targetLocationId,
        isTenantOwner: false,
      },
    });

    // Update currentStaffCount in master DB
    const newStaffCount = await tenantPrisma.user.count();

    await masterPrisma.tenant.update({
      where: { id: tenant.id },
      data: {
        currentStaffCount: newStaffCount,
      },
    });

    // Log activity in master DB
    await masterPrisma.tenantActivityLog.create({
      data: {
        tenantId: tenant.id,
        action: "USER_CREATED",
        performedBy: session.user.id,
        details: {
          userName: name,
          userEmail: email,
          userRole: role,
          newStaffCount,
        },
      },
    });

    // Calculate usage
    const staffLimit =
      tenant.customStaffLimit || USAGE_LIMITS.STAFF_ACCOUNTS;
    const isOverLimit = newStaffCount > staffLimit;
    const overageCharge = isOverLimit
      ? (newStaffCount - staffLimit) * USAGE_LIMITS.STAFF_ACCOUNT_OVERAGE_RATE
      : 0;

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      usage: {
        currentCount: newStaffCount,
        limit: staffLimit,
        isOverLimit,
        overageCharge,
      },
    });
  } catch (error: any) {
    logger.error("Create user error:", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
