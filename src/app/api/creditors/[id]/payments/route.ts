import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { recordPaymentSchema } from "@/lib/validations/creditor";
import { ZodError } from "zod";
import { logger } from '@/lib/utils/logger';

/**
 * POST /api/creditors/:id/payments
 * Record a payment for a creditor
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantSlug = session.user.tenantSlug;
    if (!tenantSlug) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 400 });
    }

    const prisma = await getTenantPrisma(tenantSlug);

    const body = await request.json();
    const validatedData = recordPaymentSchema.parse(body);

    const { amount, paymentMethod, notes } = validatedData;

    // Fetch creditor and validate before any updates
    const creditor = await prisma.creditor.findUnique({
      where: { id: params.id },
    });

    if (!creditor) {
      return NextResponse.json(
        { error: "Creditor not found" },
        { status: 404 }
      );
    }

    // Staff can only record payments for their location
    if (session.user.role === "STAFF" && session.user.locationId !== creditor.locationId) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // Validate payment amount
    if (amount > creditor.currentBalance) {
      return NextResponse.json(
        { error: "Payment amount exceeds outstanding balance" },
        { status: 400 }
      );
    }

    const newBalance = creditor.currentBalance - amount;

    // Create payment record and update balance using batch transaction
    // Batch transactions work with Transaction mode pooler (single request)
    const [payment, updatedCreditor] = await prisma.$transaction([
      prisma.creditPayment.create({
        data: {
          creditorId: params.id,
          amount,
          balanceBefore: creditor.currentBalance,
          balanceAfter: newBalance,
          paymentMethod,
          notes,
          recordedById: session.user.id,
        },
        include: {
          recordedBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.creditor.update({
        where: { id: params.id },
        data: { currentBalance: newBalance },
        include: {
          location: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
    ]);

    const result = {
      payment,
      creditor: updatedCreditor,
      deleted: false,
      message: newBalance === 0
        ? "Payment recorded successfully. Balance fully cleared."
        : "Payment recorded successfully.",
    };

    return NextResponse.json(result);
  } catch (error: any) {
    logger.error("Error recording payment:", error instanceof Error ? error : undefined);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    if (error.message === "Creditor not found") {
      return NextResponse.json(
        { error: "Creditor not found" },
        { status: 404 }
      );
    }

    if (error.message === "Access denied") {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    if (error.message === "Payment amount exceeds outstanding balance") {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to record payment" },
      { status: 500 }
    );
  }
}
