"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "./product-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductGridProps {
  products: Product[];
  cart: Record<string, number>;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (product: Product) => void;
}

interface CategoryOption {
  value: string;
  label: string;
}

export function ProductGrid({
  products,
  cart,
  onAddToCart,
  onRemoveFromCart,
}: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [categories, setCategories] = useState<CategoryOption[]>([
    { value: "ALL", label: "All" },
  ]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: any[]) => {
        setCategories([
          { value: "ALL", label: "All" },
          ...data.map((c) => ({ value: c.slug, label: c.name })),
        ]);
      })
      .catch(() => {});
  }, []);

  const filteredProducts =
    selectedCategory === "ALL"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
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
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={cart[product.id] || 0}
              onAdd={() => onAddToCart(product)}
              onRemove={() => onRemoveFromCart(product)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
