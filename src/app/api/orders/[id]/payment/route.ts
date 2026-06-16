import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { updatePaymentSchema, splitPaymentSchema } from "@/lib/validations/payment";
import { revalidatePath } from "next/cache";
import { logger } from '@/lib/utils/logger';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only ADMIN and STAFF can process payments
    if (session.user.role === "KITCHEN_STAFF") {
      return NextResponse.json(
        { error: "Kitchen staff cannot process payments" },
        { status: 403 }
      );
    }

    const tenantSlug = session.user.tenantSlug;
    if (!tenantSlug) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 400 });
    }

    const prisma = await getTenantPrisma(tenantSlug);

    const orderId = params.id;
    const body = await request.json();

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Handle split payment
    if (body.isSplitPayment === true) {
      return handleSplitPayment(prisma, orderId, existingOrder, body);
    }

    // Validate input for single payment
    const validatedData = updatePaymentSchema.parse(body);

    // Handle CREDIT payment method specially
    if (validatedData.paymentMethod === "CREDIT") {
      if (!validatedData.creditorId) {
        return NextResponse.json(
          { error: "Creditor ID is required for credit payments" },
          { status: 400 }
        );
      }

      // Verify creditor exists before any updates
      const creditor = await prisma.creditor.findUnique({
        where: { id: validatedData.creditorId },
      });

      if (!creditor) {
        return NextResponse.json(
          { error: "Creditor not found" },
          { status: 404 }
        );
      }

      // Update order and creditor balance using batch transaction
      // Batch transactions work with Transaction mode pooler (single request)
      const [updatedOrder] = await prisma.$transaction([
        prisma.order.update({
          where: { id: orderId },
          data: {
            paymentMethod: "CREDIT",
            paymentStatus: "PENDING", // Credit orders remain PENDING until paid
            creditorId: validatedData.creditorId,
          },
          include: {
            items: {
              include: {
                product: true,
              },
            },
            table: true,
            staff: {
              select: {
                name: true,
                email: true,
              },
            },
            creditor: {
              select: {
                id: true,
                name: true,
                currentBalance: true,
              },
            },
          },
        }),
        prisma.creditor.update({
          where: { id: validatedData.creditorId },
          data: {
            currentBalance: { increment: existingOrder.total },
            lastOrderDate: new Date(),
          },
        }),
      ]);

      // Revalidate relevant paths
      revalidatePath("/staff/orders");
      revalidatePath(`/staff/orders/${orderId}`);

      return NextResponse.json(updatedOrder);
    }

    // Standard payment method handling (non-CREDIT)
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentMethod: validatedData.paymentMethod,
        paymentStatus: validatedData.paymentStatus,
        // Auto-set paidAt timestamp when status changes to PAID
        paidAt:
          validatedData.paymentStatus === "PAID" ? new Date() : existingOrder.paidAt,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        table: true,
        staff: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Revalidate relevant paths
    revalidatePath("/staff/orders");
    revalidatePath(`/staff/orders/${orderId}`);

    return NextResponse.json(updatedOrder);
  } catch (error) {
    logger.error("Payment update error:", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: "Failed to update payment" },
      { status: 500 }
    );
  }
}

// Handle split payment logic
async function handleSplitPayment(
  prisma: any,
  orderId: string,
  existingOrder: any,
  body: any
) {
  // Add orderTotal from existing order for validation
  const validationData = {
    ...body,
    orderTotal: existingOrder.total,
  };

  // Validate split payment
  const validatedData = splitPaymentSchema.parse(validationData);

  // Check for credit payment and verify creditor exists
  const creditPayment = validatedData.payments.find(p => p.paymentMethod === "CREDIT");
  let creditorId: string | null = null;

  if (creditPayment) {
    const creditor = await prisma.creditor.findUnique({
      where: { id: creditPayment.creditorId },
    });
    if (!creditor) {
      return NextResponse.json(
        { error: "Creditor not found" },
        { status: 404 }
      );
    }
    creditorId = creditPayment.creditorId!;
  }

  // Determine payment status:
  // - PAID if no credit portion
  // - PARTIAL if has credit portion
  const hasCredit = !!creditPayment;
  const paymentStatus = hasCredit ? "PARTIAL" : "PAID";

  // Build transaction operations
  const operations: any[] = [];

  // 1. Update order
  operations.push(
    prisma.order.update({
      where: { id: orderId },
      data: {
        isSplitPayment: true,
        paymentMethod: null, // Split payments don't use the single method field
        paymentStatus,
        creditorId: creditorId, // Set if there's a credit component
        paidAt: hasCredit ? null : new Date(),
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        table: true,
        staff: {
          select: {
            name: true,
            email: true,
          },
        },
        creditor: {
          select: {
            id: true,
            name: true,
            currentBalance: true,
          },
        },
        payments: {
          include: {
            creditor: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })
  );

  // 2. Create OrderPayment records
  for (const payment of validatedData.payments) {
    const isCredit = payment.paymentMethod === "CREDIT";
    operations.push(
      prisma.orderPayment.create({
        data: {
          orderId,
          paymentMethod: payment.paymentMethod,
          amount: payment.amount,
          creditorId: isCredit ? payment.creditorId : null,
          paidAt: isCredit ? null : new Date(),
        },
      })
    );
  }

  // 3. Update creditor balance if credit payment exists
  if (creditPayment && creditorId) {
    operations.push(
      prisma.creditor.update({
        where: { id: creditorId },
        data: {
          currentBalance: { increment: creditPayment.amount },
          lastOrderDate: new Date(),
        },
      })
    );
  }

  // Execute transaction — results[0] is the updated order with all includes
  const results = await prisma.$transaction(operations);

  // Revalidate relevant paths
  revalidatePath("/staff/orders");
  revalidatePath(`/staff/orders/${orderId}`);

  return NextResponse.json(results[0]);
}
