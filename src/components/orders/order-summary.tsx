"use client";

import { Product } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { calculateTax, BUSINESS_CONFIG } from "@/lib/config/business";

interface CartItem {
  product: Product;
  quantity: number;
}

interface OrderSummaryProps {
  items: CartItem[];
  onRemoveItem: (productId: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  includeTax: boolean;
  onIncludeTaxChange: (value: boolean) => void;
}

export function OrderSummary({
  items,
  onRemoveItem,
  onSubmit,
  isLoading = false,
  includeTax,
  onIncludeTaxChange,
}: OrderSummaryProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const tax = calculateTax(subtotal, includeTax);
  const total = subtotal + tax;
  const vatPercent = Math.round(BUSINESS_CONFIG.TAX_RATE * 100);

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No items in cart
          </p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.product.id} className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} × {formatCurrency(item.product.price)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onRemoveItem(item.product.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className="pt-4 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeTax}
                  onChange={(e) => onIncludeTaxChange(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-coffee-600 focus:ring-coffee-500 cursor-pointer"
                />
                <span className="text-muted-foreground">VAT ({vatPercent}%)</span>
              </label>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total</span>
              <span className="text-coffee-600">{formatCurrency(total)}</span>
            </div>
          </div>
        )}
      </CardContent>
      {items.length > 0 && (
        <CardFooter>
          <Button
            className="w-full"
            size="lg"
            onClick={onSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Creating Order..." : "Create Order"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
