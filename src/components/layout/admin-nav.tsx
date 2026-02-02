"use client";

import { User } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Home,
  BarChart3,
  Package,
  Users,
  LogOut,
  Menu,
  X,
  ShoppingCart,
  UserPlus,
  Tag,
  Coffee,
  UtensilsCrossed
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { NotificationBell } from "@/components/notifications/notification-bell";

interface AdminNavProps {
  user: User;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/products", label: "Products", icon: Coffee },
  { href: "/admin/tables", label: "Tables", icon: UtensilsCrossed },
  { href: "/admin/creditors", label: "Creditors", icon: UserPlus },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/inventory", label: "Inventory", icon: Package },
  { href: "/admin/users", label: "Users", icon: Users },
];

export function AdminNav({ user }: AdminNavProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="bg-white border-b border-coffee-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo/Brand */}
          <div className="flex items-center shrink-0">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-cafe-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-base sm:text-lg">M</span>
              </div>
              <span className="text-base sm:text-lg lg:text-xl font-bold text-coffee-700 hidden sm:inline">
                My-CafeMate
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - horizontal scrollable on lg, hidden below */}
          <div className="hidden lg:flex items-center flex-1 justify-center mx-4">
            <div className="flex items-center space-x-1 xl:space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));

                if (item.disabled) {
                  return (
                    <Button
                      key={item.href}
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 opacity-50 cursor-not-allowed text-xs xl:text-sm"
                      disabled
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {item.label}
                    </Button>
                  );
                }

                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={cn(
                        "gap-1.5 text-xs xl:text-sm",
                        isActive && "bg-coffee-600 hover:bg-coffee-700"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop: Notifications & User Info */}
          <div className="hidden lg:flex items-center space-x-3 shrink-0">
            <NotificationBell locationId={user.locationId} />
            <div className="text-right">
              <p className="text-sm font-medium text-coffee-700 truncate max-w-[120px]">{user.name}</p>
              <p className="text-xs text-coffee-500">{user.role}</p>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={async () => {
                await signOut({ redirect: false });
                window.location.href = "/login";
              }}
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile/Tablet: Notification Bell & Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <NotificationBell locationId={user.locationId} />
            <button
              className="p-2 rounded-md text-coffee-600 hover:bg-cream-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-3 sm:pb-4 border-t border-coffee-100 pt-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));

                if (item.disabled) {
                  return (
                    <Button
                      key={item.href}
                      variant="ghost"
                      className="justify-start gap-2 opacity-50 cursor-not-allowed h-10 text-sm"
                      disabled
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Button>
                  );
                }

                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-2 h-10 text-sm",
                        isActive && "bg-coffee-600 hover:bg-coffee-700"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-coffee-200">
              <div className="text-sm">
                <p className="font-medium text-coffee-700">{user.name}</p>
                <p className="text-xs text-coffee-500">{user.role}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={async () => {
                  await signOut({ redirect: false });
                  window.location.href = "/login";
                }}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
