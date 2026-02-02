"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, CheckCircle, Clock, RefreshCw, Loader2 } from "lucide-react";

const POLLING_INTERVAL = 7000; // 7 seconds

interface OrderItem {
  id: string;
  quantity: number;
  product: {
    name: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  table?: {
    number: string;
  } | null;
  items: OrderItem[];
}

interface DashboardStats {
  pendingOrders: number;
  servedToday: number;
  totalToday: number;
  recentOrders: Order[];
}

export default function KitchenDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    pendingOrders: 0,
    servedToday: 0,
    totalToday: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchStats = useCallback(async () => {
    if (!session?.user?.locationId) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/kitchen/stats?locationId=${session.user.locationId}`);

      if (!res.ok) {
        throw new Error("Failed to fetch stats");
      }

      const data = await res.json();
      setStats(data);
      setLastUpdate(new Date());
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.locationId]);

  // Initial fetch
  useEffect(() => {
    if (status === "authenticated") {
      fetchStats();
    }
  }, [fetchStats, status]);

  // Polling for updates
  useEffect(() => {
    if (status !== "authenticated") return;

    const interval = setInterval(() => {
      fetchStats();
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchStats, status]);

  if (status === "loading" || (loading && stats.pendingOrders === 0)) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="flex items-center space-x-3">
            <Loader2 className="h-6 w-6 animate-spin text-coffee-600" />
            <span className="text-coffee-700 font-medium">Loading dashboard...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session?.user?.locationId) {
    return <div>No location assigned</div>;
  }

  return (
    <div className="min-h-screen bg-cream-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Auto-refresh Indicator */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-coffee-700">
              Kitchen Dashboard
            </h1>
            <p className="text-sm md:text-base text-coffee-600 mt-1 md:mt-2">
              Hello, {session.user.name}! Monitor and manage incoming orders.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-coffee-500">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-yellow-800">
                Pending Orders
              </CardTitle>
              <Clock className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-900">{stats.pendingOrders}</div>
              <p className="text-xs text-yellow-700 mt-1">
                Orders waiting to be prepared
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-green-800">
                Served Today
              </CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">{stats.servedToday}</div>
              <p className="text-xs text-green-700 mt-1">
                Orders completed today
              </p>
            </CardContent>
          </Card>

          <Card className="border-coffee-200 bg-coffee-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-coffee-800">
                Total Orders Today
              </CardTitle>
              <ClipboardList className="h-5 w-5 text-coffee-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-coffee-900">{stats.totalToday}</div>
              <p className="text-xs text-coffee-700 mt-1">
                All orders received today
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Action */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/kitchen/orders">
              <Button className="w-full md:w-auto bg-coffee-600 hover:bg-coffee-700">
                <ClipboardList className="h-4 w-4 mr-2" />
                View Order Queue
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Pending Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentOrders.length === 0 ? (
              <p className="text-coffee-500 text-center py-8">
                No pending orders at the moment
              </p>
            ) : (
              <div className="space-y-3">
                {stats.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-coffee-200 rounded-lg p-4 bg-white hover:bg-cream-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-coffee-700">
                          {order.orderNumber}
                        </p>
                        <p className="text-sm text-coffee-500">
                          Table: {order.table?.number || "No table"}
                        </p>
                      </div>
                      <span className="text-xs text-coffee-500">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-sm text-coffee-600">
                      <p className="font-medium">Items:</p>
                      <ul className="list-disc list-inside mt-1">
                        {order.items.slice(0, 3).map((item) => (
                          <li key={item.id}>
                            {item.quantity}x {item.product.name}
                          </li>
                        ))}
                        {order.items.length > 3 && (
                          <li className="text-coffee-500">
                            +{order.items.length - 3} more items
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                ))}
                <Link href="/kitchen/orders">
                  <Button variant="outline" className="w-full mt-4">
                    View All Orders
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
