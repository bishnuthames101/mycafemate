"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "./product-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCached, setCache, CACHE_KEYS, CACHE_TTL } from "@/lib/utils/cache";

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
    // Load from cache first for instant display
    const cachedCategories = getCached<CategoryOption[]>(CACHE_KEYS.CATEGORIES);
    if (cachedCategories) {
      setCategories(cachedCategories);
    }

    // Fetch fresh data in background
    fetch("/api/categories")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: any[]) => {
        const categoryOptions = [
          { value: "ALL", label: "All" },
          ...data.map((c) => ({ value: c.slug, label: c.name })),
        ];
        setCategories(categoryOptions);
        // Cache for future visits (30 minutes - categories rarely change)
        setCache(CACHE_KEYS.CATEGORIES, categoryOptions, CACHE_TTL.CATEGORIES);
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
