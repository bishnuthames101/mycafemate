"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Product } from "@prisma/client";
import { Plus, Minus, X, Trash2 } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import {
  getCached,
  setCache,
  CACHE_KEYS,
  CACHE_TTL,
} from "@/lib/utils/cache";

interface AddItemsDialogProps {
  orderId: string;
  orderNumber: string;
  tableNumber: string | null;
  locationId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface CategoryOption {
  value: string;
  label: string;
}

export function AddItemsDialog({
  orderId,
  orderNumber,
  tableNumber,
  locationId,
  open,
  onOpenChange,
  onSuccess,
}: AddItemsDialogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([
    { value: "ALL", label: "All" },
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      // Load from cache first
      const cachedProducts = getCached<Product[]>(CACHE_KEYS.PRODUCTS);
      if (cachedProducts) {
        setProducts(cachedProducts.filter((p: Product) => p.isAvailable));
      }
      const cachedCategories = getCached<CategoryOption[]>(CACHE_KEYS.CATEGORIES);
      if (cachedCategories) {
        setCategories(cachedCategories);
      }

      // Fetch fresh data
      fetchProducts();
      fetchCategories();

      // Reset state
      setCart({});
      setError(null);
      setSelectedCategory("ALL");
    }
  }, [open]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products?isAvailable=true");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
        setCache(CACHE_KEYS.PRODUCTS, data, CACHE_TTL.PRODUCTS);
      }
    } catch (err) {
      console.error("Failed to fetch products");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        const categoryOptions = [
          { value: "ALL", label: "All" },
          ...data.map((c: any) => ({ value: c.slug, label: c.name })),
        ];
        setCategories(categoryOptions);
        setCache(CACHE_KEYS.CATEGORIES, categoryOptions, CACHE_TTL.CATEGORIES);
      }
    } catch (err) {
      console.error("Failed to fetch categories");
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

  const handleAddItems = async () => {
    if (Object.keys(cart).length === 0) {
      setError("Please add at least one item");
      return;
    }

    setIsLoading(true);
    setError(null);

    const items = Object.entries(cart)
      .map(([productId, quantity]) => {
        const product = products.find((p) => p.id === productId);
        if (!product) return null;
        return {
          productId,
          quantity,
          price: product.price,
        };
      })
      .filter(Boolean);

    try {
      const res = await fetch(`/api/orders/${orderId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      if (res.ok) {
        onOpenChange(false);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        const data = await res.json();

        // Handle inventory validation errors
        if (data.insufficientItems && data.insufficientItems.length > 0) {
          const itemsList = data.insufficientItems
            .map(
              (item: any) =>
                `${item.inventoryName}: need ${item.required}${item.unit}, only ${item.available}${item.unit} available`
            )
            .join("\n");
          setError(`Insufficient inventory:\n${itemsList}`);
        } else {
          setError(data.message || data.error || "Failed to add items");
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts =
    selectedCategory === "ALL"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const cartItems = Object.entries(cart)
    .map(([productId, quantity]) => ({
      product: products.find((p) => p.id === productId),
      quantity,
    }))
    .filter((item): item is { product: Product; quantity: number } => item.product != null);

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Items to Order</DialogTitle>
          <DialogDescription>
            {orderNumber} {tableNumber && `| Table ${tableNumber}`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-hidden flex flex-col gap-4 py-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 shrink-0">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className={cn(
                  selectedCategory === category.value && "bg-coffee-500 hover:bg-coffee-600"
                )}
              >
                {category.label}
              </Button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredProducts.map((product) => {
                  const quantity = cart[product.id] || 0;
                  return (
                    <div
                      key={product.id}
                      className={cn(
                        "border rounded-lg p-3 transition-all",
                        quantity > 0 && "ring-2 ring-coffee-500 bg-coffee-50"
                      )}
                    >
                      <div className="mb-2">
                        <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                        <p className="text-coffee-600 font-semibold">
                          {formatCurrency(product.price)}
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        {quantity > 0 && (
                          <>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => handleRemoveFromCart(product)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-semibold">{quantity}</span>
                          </>
                        )}
                        <Button
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleAddToCart(product)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cart Summary */}
          {cartItems.length > 0 && (
            <div className="border-t pt-4 shrink-0">
              <p className="text-sm font-semibold mb-2">Items to Add:</p>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span>{item.product.name}</span>
                      <span className="text-muted-foreground">x {item.quantity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleRemoveItem(item.product.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 pt-2 border-t font-semibold">
                <span>New Items Total:</span>
                <span className="text-coffee-600">{formatCurrency(cartTotal)}</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm whitespace-pre-line shrink-0">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAddItems}
            disabled={isLoading || cartItems.length === 0}
          >
            {isLoading
              ? "Adding..."
              : `Add Items${cartTotal > 0 ? ` - ${formatCurrency(cartTotal)}` : ""}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
