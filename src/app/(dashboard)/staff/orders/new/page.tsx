"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Product } from "@prisma/client";
import { ProductGrid } from "@/components/products/product-grid";
import { OrderSummary } from "@/components/orders/order-summary";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useProducts } from "@/lib/hooks/use-products";
import { useAvailableTables } from "@/lib/hooks/use-tables";

export default function NewOrderPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const locationId = session?.user?.locationId;

  const { products } = useProducts({ isAvailable: true });
  const { tables } = useAvailableTables(locationId);

  const [selectedTable, setSelectedTable] = useState<string>("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [includeTax, setIncludeTax] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

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
    if (!selectedTable || Object.keys(cart).length === 0) {
      alert("Please select a table and add items to cart");
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
          locationId: session?.user.locationId,
          staffId: session?.user.id,
          items,
          includeTax,
          discount,
        }),
      });

      if (res.ok) {
        router.push("/staff/orders");
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
          <Link href="/staff/orders">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-coffee-700">New Order</h1>
            <p className="text-coffee-600 mt-1">
              Select a table and add items to create an order
            </p>
          </div>
        </div>

        {/* Table Selection */}
        <div className="bg-white p-4 rounded-lg shadow-cafe">
          <Label htmlFor="table" className="text-base font-semibold mb-2 block">
            Select Table
          </Label>
          <Select value={selectedTable} onValueChange={setSelectedTable}>
            <SelectTrigger id="table" className="w-full md:w-64">
              <SelectValue placeholder="Choose a table" />
            </SelectTrigger>
            <SelectContent>
              {tables.map((table) => (
                <SelectItem key={table.id} value={table.id}>
                  {table.number} (Capacity: {table.capacity})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Product Grid and Order Summary */}
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
              discount={discount}
              onDiscountChange={setDiscount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
