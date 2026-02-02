"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Package, Users, Coffee, UtensilsCrossed, ShoppingCart, UserPlus, Tag } from "lucide-react";
import Link from "next/link";

const dashboardCards = [
  {
    href: "/admin/reports",
    category: "Analytics",
    title: "Reports",
    subtitle: "Sales & Performance",
    icon: BarChart3,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    href: "/admin/orders",
    category: "Management",
    title: "Orders",
    subtitle: "Order Management",
    icon: ShoppingCart,
    bgColor: "bg-teal-100",
    iconColor: "text-teal-600",
  },
  {
    href: "/admin/inventory",
    category: "Management",
    title: "Inventory",
    subtitle: "Stock Management",
    icon: Package,
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    href: "/admin/products",
    category: "Menu",
    title: "Products",
    subtitle: "Menu Management",
    icon: Coffee,
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    href: "/admin/tables",
    category: "Restaurant",
    title: "Tables",
    subtitle: "Seating Management",
    icon: UtensilsCrossed,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    href: "/admin/creditors",
    category: "Finance",
    title: "Creditors",
    subtitle: "Credit Accounts",
    icon: UserPlus,
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    href: "/admin/users",
    category: "Team",
    title: "Users",
    subtitle: "Staff Management",
    icon: Users,
    bgColor: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    href: "/admin/categories",
    category: "Menu",
    title: "Categories",
    subtitle: "Product Categories",
    icon: Tag,
    bgColor: "bg-amber-100",
    iconColor: "text-amber-600",
  },
];

export default function AdminDashboard() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-cream-50 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="max-w-6xl mx-auto space-y-5 sm:space-y-6 lg:space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-coffee-700">
            Welcome to My-CafeMate
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-coffee-600 mt-1 truncate">
            Logged in as: {session?.user?.email} ({session?.user?.role})
          </p>
        </div>

        {/* Admin Navigation Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {dashboardCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.href} href={card.href}>
                <Card className="hover:shadow-cafe-lg transition-all cursor-pointer h-full">
                  <CardContent className="p-4 sm:p-5 lg:pt-6">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground hidden sm:block">
                          {card.category}
                        </p>
                        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-coffee-700 sm:mt-2 mt-0.5">
                          {card.title}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 hidden sm:block">
                          {card.subtitle}
                        </p>
                      </div>
                      <div className={`p-2 sm:p-3 rounded-full ${card.bgColor} shrink-0`}>
                        <Icon className={`h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 ${card.iconColor}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
