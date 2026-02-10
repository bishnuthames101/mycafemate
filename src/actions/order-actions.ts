"use server";

import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client";
import { calculateTax } from "@/lib/config/business";

export async function createOrder(data: {
  tableId: string;
  locationId: string;
  staffId: string;
  items: Array<{ productId: string; quantity: number; price: number; notes?: string }>;
  notes?: string;
  includeTax?: boolean;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.tenantSlug) {
    throw new Error("Unauthorized: No tenant context");
  }
  const prisma = await getTenantPrisma(session.user.tenantSlug);

  // Generate order number
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const count = await prisma.order.count({
    where: {
      orderNumber: {
        startsWith: `ORD-${today}`,
      },
    },
  });
  const orderNumber = `ORD-${today}-${String(count + 1).padStart(4, "0")}`;

  // Calculate totals
  const subtotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = calculateTax(subtotal, data.includeTax ?? true);
  const total = subtotal + tax;

  // Create order with items
  const order = await prisma.order.create({
    data: {
      orderNumber,
      tableId: data.tableId,
      locationId: data.locationId,
      staffId: data.staffId,
      subtotal,
      tax,
      total,
      notes: data.notes,
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity,
          notes: item.notes,
        })),
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      table: true,
    },
  });

  // Update table status
  await prisma.table.update({
    where: { id: data.tableId },
    data: { status: "OCCUPIED" },
  });

  revalidatePath("/staff/orders");
  revalidatePath("/staff/tables");
  return order;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.tenantSlug) {
    throw new Error("Unauthorized: No tenant context");
  }
  const prisma = await getTenantPrisma(session.user.tenantSlug);

  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      status,
      completedAt: status === "COMPLETED" ? new Date() : null,
    },
    include: {
      table: true,
    },
  });

  // If completed, free up the table
  if (status === "COMPLETED" && order.tableId) {
    await prisma.table.update({
      where: { id: order.tableId },
      data: { status: "AVAILABLE" },
    });
  }

  revalidatePath("/staff/orders");
  revalidatePath("/staff/tables");
  return order;
}

export async function getOrdersByLocation(locationId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.tenantSlug) {
    throw new Error("Unauthorized: No tenant context");
  }
  const prisma = await getTenantPrisma(session.user.tenantSlug);

  const orders = await prisma.order.findMany({
    where: {
      locationId,
      status: {
        in: ["PENDING", "PREPARING", "READY", "SERVED"],
      },
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
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders;
}

export async function getOrderById(orderId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.tenantSlug) {
    throw new Error("Unauthorized: No tenant context");
  }
  const prisma = await getTenantPrisma(session.user.tenantSlug);

  const order = await prisma.order.findUnique({
    where: { id: orderId },
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

  return order;
}
