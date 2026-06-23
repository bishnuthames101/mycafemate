import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { restockInventory } from "@/lib/utils/inventory-management";
import { logger } from '@/lib/utils/logger';
import { z } from "zod";

const restockSchema = z.object({
  quantity: z.number().positive("Quantity must be positive").max(999999, "Quantity too large"),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantSlug = session.user.tenantSlug;
    if (!tenantSlug) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 400 });
    }

    const prisma = await getTenantPrisma(tenantSlug);

    const body = await request.json();
    const { quantity } = restockSchema.parse(body);

    const result = await restockInventory(prisma, params.id, quantity);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`) },
        { status: 400 }
      );
    }
    logger.error("Error restocking inventory", error instanceof Error ? error : undefined);
    return NextResponse.json({ error: "Failed to restock inventory" }, { status: 500 });
  }
}
