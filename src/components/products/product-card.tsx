"use client";

import { Product } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  quantity?: number;
  onAdd?: () => void;
  onRemove?: () => void;
}

export function ProductCard({
  product,
  quantity = 0,
  onAdd,
  onRemove,
}: ProductCardProps) {
  return (
    <Card
      className={cn(
        "transition-all",
        quantity > 0 && "ring-2 ring-coffee-500",
        !product.isAvailable && "opacity-50"
      )}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{product.name}</CardTitle>
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-coffee-600">
            {formatCurrency(product.price)}
          </span>
          {product.isAvailable ? (
            <div className="flex items-center gap-2">
              {quantity > 0 && (
                <>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    onClick={onRemove}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-semibold">{quantity}</span>
                </>
              )}
              <Button
                size="icon"
                className="h-8 w-8"
                onClick={onAdd}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <span className="text-sm text-red-600">Unavailable</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
