import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getMasterPrisma } from "@/lib/prisma-multi-tenant";
import { logger } from '@/lib/utils/logger';

/**
 * PATCH /api/super-admin/tenants/[slug]/trial
 * Extend trial period or end trial early
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

    // Get tenant
    const tenant = await masterPrisma.tenant.findUnique({
      where: { slug: params.slug },
      select: {
        id: true,
        slug: true,
        subscriptionStatus: true,
        status: true,
        trialEndsAt: true,
        createdAt: true,
      },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // Parse request body
    const body = await request.json();
    const { action, days } = body;

    if (!action || !["extend", "end"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'extend' or 'end'" },
        { status: 400 }
      );
    }

    if (action === "extend") {
      // Validate: can only extend TRIAL status
      if (tenant.subscriptionStatus !== "TRIAL") {
        return NextResponse.json(
          { error: "Can only extend trial for tenants in TRIAL status" },
          { status: 400 }
        );
      }

      // Validate days parameter
      if (!days || typeof days !== "number" || days < 1 || days > 90) {
        return NextResponse.json(
          { error: "Extension must be between 1-90 days" },
          { status: 400 }
        );
      }

      // Check if trial has already ended
      if (tenant.trialEndsAt && new Date() > tenant.trialEndsAt) {
        return NextResponse.json(
          { error: "Trial has already ended. Use reactivate instead." },
          { status: 400 }
        );
      }

      // Calculate total trial days
      const trialEndsAt = tenant.trialEndsAt || new Date();
      const totalTrialDays = Math.ceil(
        (trialEndsAt.getTime() - tenant.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Check maximum trial extension (180 days total)
      if (totalTrialDays + days > 180) {
        return NextResponse.json(
          { error: `Maximum trial period is 180 days total. Current: ${totalTrialDays} days, requested: ${days} days` },
          { status: 400 }
        );
      }

      // Extend trialEndsAt
      const newTrialEndsAt = new Date(trialEndsAt);
      newTrialEndsAt.setDate(newTrialEndsAt.getDate() + days);

      await masterPrisma.tenant.update({
        where: { id: tenant.id },
        data: { trialEndsAt: newTrialEndsAt },
      });

      // Log activity
      await masterPrisma.tenantActivityLog.create({
        data: {
          tenantId: tenant.id,
          action: "TRIAL_EXTENDED",
          performedBy: session.user.id,
          details: {
            days,
            newTrialEndsAt: newTrialEndsAt.toISOString(),
            previousTrialEndsAt: trialEndsAt.toISOString(),
          },
        },
      });

      return NextResponse.json({
        success: true,
        tenant: {
          trialEndsAt: newTrialEndsAt,
          subscriptionStatus: tenant.subscriptionStatus,
        },
        message: `Trial extended by ${days} days`,
      });
    }

    if (action === "end") {
      // Validate: can only end trial for TRIAL status
      if (tenant.subscriptionStatus !== "TRIAL") {
        return NextResponse.json(
          { error: "Can only end trial for tenants in TRIAL status" },
          { status: 400 }
        );
      }

      // Change status to TRIAL_EXPIRED
      await masterPrisma.tenant.update({
        where: { id: tenant.id },
        data: {
          subscriptionStatus: "EXPIRED",
          status: "TRIAL_EXPIRED",
          suspendedAt: new Date(),
        },
      });

      // Log activity
      await masterPrisma.tenantActivityLog.create({
        data: {
          tenantId: tenant.id,
          action: "TRIAL_ENDED_EARLY",
          performedBy: session.user.id,
          details: {
            reason: "Manual termination by super admin",
            originalTrialEndsAt: tenant.trialEndsAt?.toISOString(),
          },
        },
      });

      return NextResponse.json({
        success: true,
        tenant: {
          trialEndsAt: tenant.trialEndsAt,
          subscriptionStatus: "EXPIRED",
          status: "TRIAL_EXPIRED",
        },
        message: "Trial ended early",
      });
    }
  } catch (error: any) {
    logger.error("Trial management error:", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
