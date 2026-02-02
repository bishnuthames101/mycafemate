"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Edit, Trash2, Tag } from "lucide-react";
import Link from "next/link";
import { CategoryFormDialog } from "@/components/categories/category-form-dialog";

interface Category {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
}

interface CategoryWithCount extends Category {
  productCount: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const [catRes, prodRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/products"),
      ]);

      if (catRes.ok) {
        const cats: Category[] = await catRes.json();
        const products: any[] = prodRes.ok ? await prodRes.json() : [];

        // Count products per category slug
        const countMap: Record<string, number> = {};
        for (const p of products) {
          countMap[p.category] = (countMap[p.category] || 0) + 1;
        }

        setCategories(
          cats.map((c) => ({
            ...c,
            productCount: countMap[c.slug] || 0,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (category: CategoryWithCount) => {
    if (category.productCount > 0) {
      alert(
        `Cannot delete "${category.name}": ${category.productCount} product(s) are using it. Reassign products first.`
      );
      return;
    }

    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/categories/${category.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchCategories();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("An error occurred");
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowDialog(true);
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setShowDialog(true);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setEditingCategory(null);
  };

  const handleSuccess = () => {
    fetchCategories();
    handleDialogClose();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <p>Loading categories...</p>
      </div>
    );
  }

  return (
    <>
      <CategoryFormDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        category={editingCategory}
        onSuccess={handleSuccess}
      />

      <div className="min-h-screen bg-cream-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Link href="/admin">
                <Button variant="outline" size="icon" className="shrink-0">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="min-w-0">
                <h1 className="text-2xl md:text-4xl font-bold text-coffee-700">
                  Product Categories
                </h1>
                <p className="text-sm md:text-base text-coffee-600 mt-1 md:mt-2">
                  Manage your product categories
                </p>
              </div>
            </div>
            <Button onClick={handleCreate} className="w-full sm:w-auto shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>

          {/* Categories Table */}
          <Card>
            <CardContent className="pt-6">
              {categories.length === 0 ? (
                <div className="text-center py-12">
                  <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No categories found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-3 text-sm font-medium text-muted-foreground">Order</th>
                        <th className="pb-3 text-sm font-medium text-muted-foreground">Name</th>
                        <th className="pb-3 text-sm font-medium text-muted-foreground">Slug</th>
                        <th className="pb-3 text-sm font-medium text-muted-foreground">Products</th>
                        <th className="pb-3 text-sm font-medium text-muted-foreground text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((cat) => (
                        <tr key={cat.id} className="border-b last:border-0">
                          <td className="py-3 text-sm">{cat.sortOrder}</td>
                          <td className="py-3">
                            <span className="font-medium">{cat.name}</span>
                          </td>
                          <td className="py-3">
                            <span className="text-xs px-2 py-1 rounded-full bg-coffee-100 text-coffee-700">
                              {cat.slug}
                            </span>
                          </td>
                          <td className="py-3 text-sm">{cat.productCount}</td>
                          <td className="py-3 text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(cat)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(cat)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                disabled={cat.productCount > 0}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
