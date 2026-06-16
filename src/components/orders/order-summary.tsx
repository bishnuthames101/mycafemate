"use client";

import { useState } from "react";
import { Product } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Percent, Hash } from "lucide-react";
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
  discount: number;
  onDiscountChange: (value: number) => void;
}

export function OrderSummary({
  items,
  onRemoveItem,
  onSubmit,
  isLoading = false,
  includeTax,
  onIncludeTaxChange,
  discount,
  onDiscountChange,
}: OrderSummaryProps) {
  const [discountMode, setDiscountMode] = useState<"amount" | "percent">("amount");
  const [discountInput, setDiscountInput] = useState("");

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const tax = calculateTax(subtotal, includeTax);
  const total = subtotal + tax - discount;
  const vatPercent = Math.round(BUSINESS_CONFIG.TAX_RATE * 100);

  const handleDiscountInput = (value: string) => {
    setDiscountInput(value);
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) {
      onDiscountChange(0);
      return;
    }
    if (discountMode === "percent") {
      const clamped = Math.min(num, 100);
      onDiscountChange(Math.round((subtotal + tax) * clamped / 100 * 100) / 100);
    } else {
      onDiscountChange(Math.min(num, subtotal + tax));
    }
  };

  const handleModeSwitch = (mode: "amount" | "percent") => {
    setDiscountMode(mode);
    setDiscountInput("");
    onDiscountChange(0);
  };

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
            {/* Discount */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Discount</span>
                <div className="flex items-center border rounded-md overflow-hidden h-7">
                  <button
                    type="button"
                    onClick={() => handleModeSwitch("amount")}
                    className={`px-2 h-full text-xs flex items-center ${discountMode === "amount" ? "bg-coffee-600 text-white" : "text-muted-foreground hover:bg-gray-100"}`}
                  >
                    <Hash className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeSwitch("percent")}
                    className={`px-2 h-full text-xs flex items-center ${discountMode === "percent" ? "bg-coffee-600 text-white" : "text-muted-foreground hover:bg-gray-100"}`}
                  >
                    <Percent className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max={discountMode === "percent" ? 100 : subtotal + tax}
                  step="any"
                  value={discountInput}
                  onChange={(e) => handleDiscountInput(e.target.value)}
                  placeholder={discountMode === "percent" ? "0%" : "Rs.0"}
                  className="w-full h-8 px-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-coffee-500"
                />
                {discount > 0 && (
                  <span className="text-sm text-green-600 whitespace-nowrap">
                    -{formatCurrency(discount)}
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total</span>
              <span className="text-coffee-600">{formatCurrency(Math.max(0, total))}</span>
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
