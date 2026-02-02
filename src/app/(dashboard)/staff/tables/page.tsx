import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { redirect } from "next/navigation";
import { TableGrid } from "@/components/tables/table-grid";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function StaffTablesPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  // Get tenant-specific Prisma client
  const tenantSlug = session.user.tenantSlug;
  if (!tenantSlug) {
    redirect("/login");
  }

  const prisma = await getTenantPrisma(tenantSlug);

  const tables = await prisma.table.findMany({
    where: {
      locationId: session.user.locationId || "",
    },
    orderBy: {
      number: "asc",
    },
    include: {
      orders: {
        where: {
          status: {
            in: ["PENDING", "PREPARING", "READY", "SERVED"],
          },
        },
        take: 1,
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-cream-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/staff">
            <Button variant="outline" size="icon" className="shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-coffee-700">Table Status</h1>
            <p className="text-sm md:text-base text-coffee-600 mt-1">
              View all tables and their current status
            </p>
          </div>
        </div>

        <TableGrid tables={tables} />
      </div>
    </div>
  );
}
