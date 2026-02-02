"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Package, AlertTriangle, CheckCircle, RefreshCw, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { formatDateTime } from "@/lib/utils";
import { InventoryFormDialog } from "@/components/inventory/inventory-form-dialog";

interface InventoryItem {
  id: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number | null;
  lastRestocked: string | null;
  lowStockAlerted: boolean;
  inventory: {
    id: string;
    name: string;
    unit: string;
  };
  product: {
    id: string;
    name: string;
    category: string;
  } | null;
}

export default function InventoryPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [restockingId, setRestockingId] = useState<string | null>(null);
  const [restockAmounts, setRestockAmounts] = useState<Record<string, string>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>();
  const [cleaningUp, setCleaningUp] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, [session]);

  const fetchInventory = async () => {
    if (!session?.user?.locationId) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/inventory?locationId=${session.user.locationId}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async (itemId: string) => {
    const amount = restockAmounts[itemId];
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid restock amount");
      return;
    }

    setRestockingId(itemId);
    try {
      const res = await fetch(`/api/inventory/${itemId}/restock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: parseFloat(amount) }),
      });

      if (res.ok) {
        setRestockAmounts({ ...restockAmounts, [itemId]: "" });
        await fetchInventory();
      } else {
        alert("Failed to restock inventory");
      }
    } catch (error) {
      console.error("Error restocking:", error);
      alert("An error occurred");
    } finally {
      setRestockingId(null);
    }
  };

  const handleCleanupDuplicates = async () => {
    if (!confirm("This will remove duplicate inventory items. Continue?")) return;

    setCleaningUp(true);
    try {
      const res = await fetch("/api/admin/cleanup-inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationId: session?.user?.locationId }),
      });

      if (res.ok) {
        const result = await res.json();
        alert(`Cleaned up ${result.duplicatesRemoved} duplicates. ${result.itemsKept} items remaining.`);
        await fetchInventory();
      } else {
        alert("Failed to cleanup duplicates");
      }
    } catch (error) {
      console.error("Error cleaning up:", error);
      alert("An error occurred");
    } finally {
      setCleaningUp(false);
    }
  };

  const handleDeleteItem = async (itemId: string, itemName: string) => {
    if (!confirm(`Are you sure you want to delete ${itemName}?`)) return;

    try {
      const res = await fetch(`/api/inventory/${itemId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Inventory item deleted successfully");
        await fetchInventory();
      } else {
        alert("Failed to delete inventory item");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("An error occurred");
    }
  };

  const handleDialogSuccess = () => {
    setDialogOpen(false);
    setEditingItem(undefined);
    fetchInventory();
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= 0) {
      return { label: "Out of Stock", color: "text-red-600", bgColor: "bg-red-50", icon: AlertTriangle };
    } else if (item.currentStock <= item.minimumStock) {
      return { label: "Low Stock", color: "text-orange-600", bgColor: "bg-orange-50", icon: AlertTriangle };
    }
    return { label: "In Stock", color: "text-green-600", bgColor: "bg-green-50", icon: CheckCircle };
  };

  const getStockPercentage = (item: InventoryItem) => {
    if (!item.maximumStock) return 0;
    return Math.min((item.currentStock / item.maximumStock) * 100, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <p>Loading inventory...</p>
      </div>
    );
  }

  const lowStockCount = items.filter(i => i.currentStock <= i.minimumStock && i.currentStock > 0).length;
  const outOfStockCount = items.filter(i => i.currentStock <= 0).length;
  const healthyCount = items.filter(i => i.currentStock > i.minimumStock).length;

  return (
    <div className="min-h-screen bg-cream-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Link href="/admin">
                <Button variant="outline" size="icon" className="shrink-0">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="min-w-0">
                <h1 className="text-2xl md:text-4xl font-bold text-coffee-700">Inventory Management</h1>
                <p className="text-sm md:text-base text-coffee-600 mt-1 md:mt-2">Track and manage your stock levels</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                onClick={handleCleanupDuplicates}
                disabled={cleaningUp}
                className="w-full sm:w-auto shrink-0"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {cleaningUp ? "Cleaning..." : "Clean Duplicates"}
              </Button>
              <Button variant="outline" onClick={fetchInventory} className="w-full sm:w-auto shrink-0">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={() => setDialogOpen(true)} className="w-full sm:w-auto shrink-0">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                  <p className="text-3xl font-bold text-coffee-700">{items.length}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Healthy Stock</p>
                  <p className="text-3xl font-bold text-green-600">{healthyCount}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Low Stock</p>
                  <p className="text-3xl font-bold text-orange-600">{lowStockCount}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Out of Stock</p>
                  <p className="text-3xl font-bold text-red-600">{outOfStockCount}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory List */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item) => {
                const status = getStockStatus(item);
                const StatusIcon = status.icon;
                const percentage = getStockPercentage(item);

                return (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-coffee-700">
                            {item.inventory.name}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color} flex items-center gap-1`}>
                            <StatusIcon className="h-3 w-3" />
                            {status.label}
                          </span>
                        </div>
                        {item.product && (
                          <p className="text-sm text-muted-foreground">
                            Used in: {item.product.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Stock</p>
                        <p className="text-xl font-bold text-coffee-700">
                          {item.currentStock} {item.inventory.unit}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Minimum Stock</p>
                        <p className="text-lg font-medium">
                          {item.minimumStock} {item.inventory.unit}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Maximum Stock</p>
                        <p className="text-lg font-medium">
                          {item.maximumStock ? `${item.maximumStock} ${item.inventory.unit}` : "N/A"}
                        </p>
                      </div>
                    </div>

                    {item.maximumStock && (
                      <div className="mb-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              percentage <= 25 ? "bg-red-500" :
                              percentage <= 50 ? "bg-orange-500" :
                              "bg-green-500"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {item.lastRestocked && (
                      <p className="text-xs text-muted-foreground mb-3">
                        Last restocked: {formatDateTime(item.lastRestocked)}
                      </p>
                    )}

                    <div className="flex items-center gap-2 flex-wrap">
                      <Input
                        type="number"
                        placeholder="Restock amount"
                        value={restockAmounts[item.id] || ""}
                        onChange={(e) =>
                          setRestockAmounts({ ...restockAmounts, [item.id]: e.target.value })
                        }
                        className="w-32"
                      />
                      <span className="text-sm text-muted-foreground">{item.inventory.unit}</span>
                      <Button
                        size="sm"
                        onClick={() => handleRestock(item.id)}
                        disabled={restockingId === item.id}
                      >
                        {restockingId === item.id ? "Restocking..." : "Restock"}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteItem(item.id, item.inventory.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}

              {items.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No inventory items found
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Inventory Dialog */}
      <InventoryFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        inventoryItem={editingItem}
        onSuccess={handleDialogSuccess}
      />
    </div>
  );
}
