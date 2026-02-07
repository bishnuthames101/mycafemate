import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";

export async function GET() {
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

    const config = await prisma.tenantConfig.findUnique({
      where: { tenantSlug },
    });

    if (!config) {
      return NextResponse.json({ error: "Config not found" }, { status: 404 });
    }

    return NextResponse.json({
      businessName: config.businessName,
      taxRate: config.taxRate,
      currency: config.currency,
      timezone: config.timezone,
      logoUrl: config.logoUrl,
    });
  } catch (error) {
    console.error("Error fetching tenant config:", error);
    return NextResponse.json(
      { error: "Failed to fetch config" },
      { status: 500 }
    );
  }
}
