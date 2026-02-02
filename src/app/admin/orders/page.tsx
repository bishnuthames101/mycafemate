"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, ShoppingCart } from "lucide-react";
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

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderWithRelations[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderWithRelations[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, selectedLocation, selectedStatus, searchQuery]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all orders (no locationId param for admin)
      const ordersRes = await fetch("/api/orders");
      const locationsRes = await fetch("/api/locations");

      if (ordersRes.ok && locationsRes.ok) {
        const ordersData = await ordersRes.json();
        const locationsData = await locationsRes.json();
        setOrders(ordersData);
        setLocations(locationsData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by location
    if (selectedLocation !== "ALL") {
      filtered = filtered.filter((order) => order.locationId === selectedLocation);
    }

    // Filter by status
    if (selectedStatus !== "ALL") {
      filtered = filtered.filter((order) => order.status === selectedStatus);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((order) =>
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  const handleOrderClick = (orderId: string) => {
    router.push(`/admin/orders/${orderId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <p>Loading orders...</p>
      </div>
    );
  }

  // Calculate stats
  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = filteredOrders.filter((order) => order.status === "PENDING").length;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const completedToday = filteredOrders.filter(
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
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-coffee-700">{formatCurrency(totalRevenue)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Pending Orders</p>
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
          onLocationChange={setSelectedLocation}
          onStatusChange={setSelectedStatus}
          onSearchChange={setSearchQuery}
        />

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No orders found</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={() => handleOrderClick(order.id)}
                showLocation={true}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
