import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { recordPayment } from "@/lib/services/subscription-management";
import { getMasterPrisma } from "@/lib/prisma-multi-tenant";
import { createPaymentRecordSchema } from "@/lib/validations/payment";
import { ZodError } from "zod";
import { logger } from '@/lib/utils/logger';

/**
 * POST /api/super-admin/tenants/[slug]/payments
 * Record a new payment for a tenant
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

    // Parse and validate request body
    const body = await request.json();

    let validatedData;
    try {
      validatedData = createPaymentRecordSchema.parse(body);
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

    // Record the payment
    const paymentId = await recordPayment({
      tenantId: tenant.id,
      amount: validatedData.amount,
      paymentDate: new Date(validatedData.paymentDate),
      paymentMethod: validatedData.paymentMethod,
      referenceNumber: validatedData.referenceNumber,
      billingPeriodStart: new Date(validatedData.billingPeriodStart),
      billingPeriodEnd: new Date(validatedData.billingPeriodEnd),
      notes: validatedData.notes,
      receivedBy: body.receivedBy || session.user.email,
    });

    return NextResponse.json({
      success: true,
      paymentId,
      message: "Payment recorded successfully",
    });
  } catch (error: any) {
    logger.error("Payment recording error:", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/super-admin/tenants/[slug]/payments
 * Get payment history for a tenant
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

    // Get payments
    const payments = await masterPrisma.paymentRecord.findMany({
      where: { tenantId: tenant.id },
      orderBy: { paymentDate: "desc" },
    });

    // Calculate stats
    const total = payments.reduce((sum, p) => sum + p.amount, 0);

    return NextResponse.json({
      payments,
      stats: {
        total,
        count: payments.length,
      },
    });
  } catch (error: any) {
    logger.error("Payment listing error:", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
