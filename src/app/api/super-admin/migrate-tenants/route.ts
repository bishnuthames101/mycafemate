import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getMasterPrisma, decryptDatabaseUrl } from "@/lib/prisma-multi-tenant";
import { runPrismaMigrations } from "@/lib/services/database-manager";
import { logger } from "@/lib/utils/logger";

/**
 * POST /api/super-admin/migrate-tenants
 * Apply latest schema migrations (tables/enums) to all existing tenant databases.
 * Safe to re-run — all statements use IF NOT EXISTS / EXCEPTION WHEN duplicate_object.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Super admin access required." },
        { status: 401 }
      );
    }

    const masterPrisma = getMasterPrisma();

    const tenants = await masterPrisma.tenant.findMany({
      where: { status: { in: ["ACTIVE", "PROVISIONING", "TRIAL_EXPIRED"] } },
      select: { slug: true, businessName: true, databaseUrl: true },
    });

    const results: { slug: string; success: boolean; error?: string }[] = [];

    for (const tenant of tenants) {
      try {
        const dbUrl = decryptDatabaseUrl(tenant.databaseUrl);
        await runPrismaMigrations(dbUrl);
        results.push({ slug: tenant.slug, success: true });
        logger.info(`Migration applied to tenant: ${tenant.slug}`);
      } catch (err: any) {
        results.push({ slug: tenant.slug, success: false, error: err.message });
        logger.error(`Migration failed for tenant: ${tenant.slug}`, err instanceof Error ? err : undefined);
      }
    }

    const failed = results.filter((r) => !r.success);

    return NextResponse.json({
      total: tenants.length,
      succeeded: results.filter((r) => r.success).length,
      failed: failed.length,
      details: results,
    });
  } catch (error: any) {
    logger.error("Migrate tenants failed", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: "Migration failed", details: error.message },
      { status: 500 }
    );
  }
}
