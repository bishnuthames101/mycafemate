"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RecipeEditor } from "./recipe-editor";

interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  isAvailable: boolean;
}

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSuccess: () => void;
}

interface CategoryOption {
  slug: string;
  name: string;
}

interface RecipeItem {
  id?: string;
  inventoryId: string;
  quantityUsed: number;
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  onSuccess,
}: ProductFormDialogProps) {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "TEA",
    price: "",
    isAvailable: true,
  });
  const [recipeItems, setRecipeItems] = useState<RecipeItem[]>([]);

  useEffect(() => {
    if (open) {
      fetch("/api/categories")
        .then((res) => res.ok ? res.json() : [])
        .then((data: any[]) => setCategories(data.map((c) => ({ slug: c.slug, name: c.name }))))
        .catch(() => setCategories([]));
    }
  }, [open]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        category: product.category,
        price: product.price.toString(),
        isAvailable: product.isAvailable,
      });
      // Fetch recipes for existing product
      fetchRecipes(product.id);
    } else {
      setFormData({
        name: "",
        description: "",
        category: categories[0]?.slug || "",
        price: "",
        isAvailable: true,
      });
      setRecipeItems([]);
    }
  }, [product, open, categories]);

  const fetchRecipes = async (productId: string) => {
    try {
      const res = await fetch(`/api/products/${productId}/recipes`);
      if (res.ok) {
        const recipes = await res.json();
        setRecipeItems(
          recipes.map((r: any) => ({
            id: r.id,
            inventoryId: r.inventoryId,
            quantityUsed: r.quantityUsed,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setRecipeItems([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description || undefined,
        category: formData.category,
        price: parseFloat(formData.price),
        isAvailable: formData.isAvailable,
        recipes: recipeItems
          .filter((item) => item.inventoryId && item.quantityUsed > 0)
          .map((item) => ({
            inventoryId: item.inventoryId,
            quantityUsed: item.quantityUsed,
          })),
      };

      const url = product ? `/api/products/${product.id}` : "/api/products";
      const method = product ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onSuccess();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to save product");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[600px] max-h-[90vh] sm:max-h-[85vh] p-0 gap-0">
        <div className="flex flex-col h-full max-h-[90vh] sm:max-h-[85vh]">
          <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2">
            <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogDescription>
              {product
                ? "Update the product details below."
                : "Fill in the details to create a new product."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            <div className="space-y-3 sm:space-y-4 px-4 sm:px-6 py-3 sm:py-4 overflow-y-auto flex-1">
            {/* Basic Info Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Name */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">
                  Product Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Masala Chai"
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.slug} value={cat.slug}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">
                  Price (Rs.) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description..."
                rows={2}
                className="resize-none"
              />
            </div>

            {/* Availability */}
            <div className="flex items-center justify-between border rounded-lg p-2 sm:p-3">
              <Label htmlFor="isAvailable" className="cursor-pointer">
                Available for sale
              </Label>
              <Switch
                id="isAvailable"
                checked={formData.isAvailable}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isAvailable: checked })
                }
              />
            </div>

            {/* Recipe / Ingredients */}
            {session?.user?.locationId && (
              <RecipeEditor
                locationId={session.user.locationId}
                recipeItems={recipeItems}
                onChange={setRecipeItems}
              />
            )}
            </div>

            <DialogFooter className="border-t px-4 sm:px-6 py-3 sm:py-4 bg-background">
              <div className="flex gap-2 w-full sm:w-auto sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1 sm:flex-none">
                  {isSubmitting ? "Saving..." : product ? "Update Product" : "Create Product"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
