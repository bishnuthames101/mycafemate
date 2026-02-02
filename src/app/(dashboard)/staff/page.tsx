import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { redirect } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Coffee, Users, UtensilsCrossed } from "lucide-react";
import Link from "next/link";

export default async function StaffDashboard() {
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

  // Fetch quick stats
  const activeOrders = await prisma.order.count({
    where: {
      locationId: session.user.locationId || "",
      status: {
        in: ["PENDING", "PREPARING", "READY", "SERVED"],
      },
    },
  });

  const occupiedTables = await prisma.table.count({
    where: {
      locationId: session.user.locationId || "",
      status: "OCCUPIED",
    },
  });

  const totalTables = await prisma.table.count({
    where: {
      locationId: session.user.locationId || "",
    },
  });

  const recentOrders = await prisma.order.findMany({
    where: {
      locationId: session.user.locationId || "",
      status: {
        in: ["PENDING", "PREPARING", "READY", "SERVED"],
      },
    },
    include: {
      table: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  const stats = [
    {
      title: "Active Orders",
      value: activeOrders,
      icon: ClipboardList,
      href: "/staff/orders",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Occupied Tables",
      value: `${occupiedTables}/${totalTables}`,
      icon: UtensilsCrossed,
      href: "/staff/tables",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="min-h-screen bg-cream-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-coffee-700">Welcome to My-CafeMate</h1>
          <p className="text-sm md:text-base text-coffee-600 mt-1 md:mt-2">
            Hello, {session.user.name}! Here's your dashboard overview.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-cafe-lg transition-all cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-bold text-coffee-700 mt-2">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {/* New Order Button */}
          <Link href="/staff/orders/new">
            <Card className="hover:shadow-cafe-lg transition-all cursor-pointer bg-cafe-gradient text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-cream-100">Quick Action</p>
                    <p className="text-xl font-bold mt-2">New Order</p>
                  </div>
                  <div className="p-3 rounded-full bg-white/20">
                    <Coffee className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest active orders from your shift</CardDescription>
              </div>
              <Link href="/staff/orders">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No active orders</p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <Link key={order.id} href={`/staff/orders/${order.id}`}>
                    <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-cream-100 transition-colors cursor-pointer">
                      <div>
                        <p className="font-semibold">{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.table?.number} • {order.items.length} items
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-coffee-600">
                          Rs.{order.total.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">{order.status}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-cafe transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UtensilsCrossed className="h-5 w-5" />
                Table Management
              </CardTitle>
              <CardDescription>View and manage table statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/staff/tables">
                <Button className="w-full">View Tables</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-cafe transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Order Management
              </CardTitle>
              <CardDescription>Create and track customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/staff/orders">
                <Button className="w-full">Manage Orders</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
