import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { updatePaymentSchema } from "@/lib/validations/payment";
import { revalidatePath } from "next/cache";

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

    // Validate input
    const validatedData = updatePaymentSchema.parse(body);

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

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
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to update payment" },
      { status: 500 }
    );
  }
}
