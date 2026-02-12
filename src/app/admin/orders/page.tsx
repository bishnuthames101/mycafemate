"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { OrderFilters } from "@/components/orders/order-filters";
import { OrderCard } from "@/components/orders/order-card";
import { formatCurrency } from "@/lib/utils";
import { Order, OrderItem, Product, User, Table, Location } from "@prisma/client";

interface OrderWithRelations extends Order {
  items: (OrderItem & { product: Product })[];
  table: Table | null;
  staff: Pick<User, "name" | "email">;
  location?: Location | null;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

const PAGE_SIZE = 20;

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderWithRelations[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  // Fetch locations once on mount
  useEffect(() => {
    fetch("/api/locations")
      .then((r) => r.ok ? r.json() : [])
      .then(setLocations)
      .catch(() => {});
  }, []);

  // Fetch orders when page, filters change
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(PAGE_SIZE));
      if (selectedLocation !== "ALL") {
        params.set("locationId", selectedLocation);
      }
      if (selectedStatus !== "ALL") {
        params.set("status", selectedStatus);
      }

      const res = await fetch(`/api/orders?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [page, selectedLocation, selectedStatus]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Reset page to 1 when filters change
  const handleLocationChange = (loc: string) => {
    setSelectedLocation(loc);
    setPage(1);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleOrderClick = (orderId: string) => {
    router.push(`/admin/orders/${orderId}`);
  };

  // Client-side search filter on current page results
  const displayedOrders = searchQuery
    ? orders.filter((order) =>
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : orders;

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <p>Loading orders...</p>
      </div>
    );
  }

  // Stats from pagination total
  const totalOrders = pagination?.total ?? 0;
  const totalRevenue = displayedOrders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = displayedOrders.filter((order) => order.status === "PENDING").length;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const completedToday = displayedOrders.filter(
    (order) =>
      order.status === "COMPLETED" &&
      new Date(order.createdAt).setHours(0, 0, 0, 0) === today.getTime()
  ).length;

  return (
    <div className="min-h-screen bg-cream-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <Button variant="outline" size="icon" className="shrink-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-4xl font-bold text-coffee-700">Order Management</h1>
              <p className="text-sm md:text-base text-coffee-600 mt-1 md:mt-2">
                View and manage orders from all locations
              </p>
            </div>
          </div>
          <Link href="/admin/orders/new" className="block">
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              New Order
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold text-coffee-700">{totalOrders}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Page Revenue</p>
                <p className="text-2xl font-bold text-coffee-700">{formatCurrency(totalRevenue)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Pending (page)</p>
                <p className="text-2xl font-bold text-coffee-700">{pendingOrders}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Completed Today</p>
                <p className="text-2xl font-bold text-coffee-700">{completedToday}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <OrderFilters
          locations={locations}
          selectedLocation={selectedLocation}
          selectedStatus={selectedStatus}
          searchQuery={searchQuery}
          onLocationChange={handleLocationChange}
          onStatusChange={handleStatusChange}
          onSearchChange={handleSearchChange}
        />

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedOrders.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No orders found</p>
            </div>
          ) : (
            displayedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={() => handleOrderClick(order.id)}
                showLocation={true}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} orders)
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasMore || loading}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
