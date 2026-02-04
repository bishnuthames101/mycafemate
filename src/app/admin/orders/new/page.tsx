"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Product, Table, Location, User } from "@prisma/client";
import { ProductGrid } from "@/components/products/product-grid";
import { OrderSummary } from "@/components/orders/order-summary";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminNewOrderPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [locations, setLocations] = useState<Location[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [staffUsers, setStaffUsers] = useState<User[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [selectedStaff, setSelectedStaff] = useState<string>("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [includeTax, setIncludeTax] = useState(true);

  useEffect(() => {
    fetchLocations();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      fetchTables(selectedLocation);
      fetchStaff(selectedLocation);
    } else {
      setTables([]);
      setStaffUsers([]);
      setSelectedTable("");
      setSelectedStaff("");
    }
  }, [selectedLocation]);

  const fetchLocations = async () => {
    const res = await fetch("/api/locations");
    if (res.ok) {
      const data = await res.json();
      setLocations(data);
    }
  };

  const fetchProducts = async () => {
    const res = await fetch("/api/products?isAvailable=true");
    if (res.ok) {
      const data = await res.json();
      setProducts(data);
    }
  };

  const fetchTables = async (locationId: string) => {
    const res = await fetch(`/api/tables?locationId=${locationId}`);
    if (res.ok) {
      const data = await res.json();
      setTables(data.filter((t: Table) => t.status === "AVAILABLE"));
    }
  };

  const fetchStaff = async (locationId: string) => {
    // Fetch users with role STAFF for selected location
    const res = await fetch(`/api/admin/users?role=STAFF&locationId=${locationId}`);
    if (res.ok) {
      const data = await res.json();
      // API returns { users: [...] } wrapper
      setStaffUsers(Array.isArray(data) ? data : data.users || []);
    } else {
      // If endpoint doesn't exist, use current admin as fallback
      setStaffUsers([]);
      if (session?.user) {
        setSelectedStaff(session.user.id);
      }
    }
  };

  const handleAddToCart = (product: Product) => {
    setCart((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + 1,
    }));
  };

  const handleRemoveFromCart = (product: Product) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[product.id] > 1) {
        newCart[product.id]--;
      } else {
        delete newCart[product.id];
      }
      return newCart;
    });
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => {
      const newCart = { ...prev };
      delete newCart[productId];
      return newCart;
    });
  };

  const handleSubmit = async () => {
    if (!selectedLocation) {
      alert("Please select a location");
      return;
    }
    if (!selectedTable) {
      alert("Please select a table");
      return;
    }
    if (Object.keys(cart).length === 0) {
      alert("Please add items to cart");
      return;
    }

    // Use selected staff or current user as fallback
    const staffId = selectedStaff || session?.user.id;
    if (!staffId) {
      alert("Please select a staff member");
      return;
    }

    setIsLoading(true);

    const items = Object.entries(cart).map(([productId, quantity]) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return null;
      return {
        productId,
        quantity,
        price: product.price,
      };
    }).filter(Boolean);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableId: selectedTable,
          locationId: selectedLocation,
          staffId,
          items,
          includeTax,
        }),
      });

      if (res.ok) {
        router.push("/admin/orders");
      } else {
        const errorData = await res.json();

        // Handle inventory validation errors with detailed message
        if (errorData.insufficientItems && errorData.insufficientItems.length > 0) {
          const itemsList = errorData.insufficientItems
            .map((item: any) =>
              `\n• ${item.inventoryName}: need ${item.required}${item.unit}, only ${item.available}${item.unit} available (for ${item.productName})`
            )
            .join("");

          alert(`Cannot create order - Insufficient inventory:${itemsList}\n\nPlease adjust quantities or restock inventory.`);
        } else {
          alert(errorData.message || "Failed to create order");
        }
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const cartItems = Object.entries(cart)
    .map(([productId, quantity]) => ({
      product: products.find((p) => p.id === productId),
      quantity,
    }))
    .filter((item): item is { product: Product; quantity: number } => item.product != null);

  return (
    <div className="min-h-screen bg-cream-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-coffee-700">New Order</h1>
            <p className="text-coffee-600 mt-1">
              Select location, table, and add items to create an order
            </p>
          </div>
        </div>

        {/* Location, Staff, and Table Selection */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Location Selection */}
              <div>
                <Label htmlFor="location" className="text-base font-semibold mb-2 block">
                  Select Location
                </Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Choose a location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Table Selection */}
              <div>
                <Label htmlFor="table" className="text-base font-semibold mb-2 block">
                  Select Table
                </Label>
                <Select
                  value={selectedTable}
                  onValueChange={setSelectedTable}
                  disabled={!selectedLocation}
                >
                  <SelectTrigger id="table">
                    <SelectValue placeholder={!selectedLocation ? "Select location first" : "Choose a table"} />
                  </SelectTrigger>
                  <SelectContent>
                    {tables.length === 0 ? (
                      <SelectItem value="none" disabled>No available tables</SelectItem>
                    ) : (
                      tables.map((table) => (
                        <SelectItem key={table.id} value={table.id}>
                          {table.number} (Capacity: {table.capacity})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Staff Selection */}
              <div>
                <Label htmlFor="staff" className="text-base font-semibold mb-2 block">
                  Assign to Staff
                </Label>
                <Select
                  value={selectedStaff}
                  onValueChange={setSelectedStaff}
                  disabled={!selectedLocation}
                >
                  <SelectTrigger id="staff">
                    <SelectValue placeholder={!selectedLocation ? "Select location first" : "Choose staff member"} />
                  </SelectTrigger>
                  <SelectContent>
                    {staffUsers.length === 0 ? (
                      <SelectItem value={session?.user.id || "current"}>
                        Current User
                      </SelectItem>
                    ) : (
                      staffUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name || user.email}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Grid and Order Summary */}
        {selectedLocation && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ProductGrid
                products={products}
                cart={cart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
              />
            </div>
            <div>
              <OrderSummary
                items={cartItems}
                onRemoveItem={handleRemoveItem}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                includeTax={includeTax}
                onIncludeTaxChange={setIncludeTax}
              />
            </div>
          </div>
        )}

        {!selectedLocation && (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              <p>Please select a location to continue</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
