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

interface InventoryItem {
  id: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number | null;
  inventory: {
    id: string;
    name: string;
    unit: string;
  };
}

interface InventoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inventoryItem?: InventoryItem;
  onSuccess: () => void;
}

interface InventoryOption {
  id: string;
  name: string;
  unit: string;
}

export function InventoryFormDialog({
  open,
  onOpenChange,
  inventoryItem,
  onSuccess,
}: InventoryFormDialogProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [inventoryOptions, setInventoryOptions] = useState<InventoryOption[]>([]);
  const [newInventoryName, setNewInventoryName] = useState("");
  const [newInventoryUnit, setNewInventoryUnit] = useState("");
  const [showNewInventoryFields, setShowNewInventoryFields] = useState(false);

  const [formData, setFormData] = useState({
    inventoryId: "",
    currentStock: "",
    minimumStock: "",
    maximumStock: "",
  });

  useEffect(() => {
    if (open) {
      fetchInventoryOptions();
      if (inventoryItem) {
        setFormData({
          inventoryId: inventoryItem.inventory.id,
          currentStock: inventoryItem.currentStock.toString(),
          minimumStock: inventoryItem.minimumStock.toString(),
          maximumStock: inventoryItem.maximumStock?.toString() || "",
        });
      } else {
        setFormData({
          inventoryId: "",
          currentStock: "",
          minimumStock: "",
          maximumStock: "",
        });
      }
      setShowNewInventoryFields(false);
      setNewInventoryName("");
      setNewInventoryUnit("");
    }
  }, [open, inventoryItem]);

  const fetchInventoryOptions = async () => {
    if (!session?.user?.locationId) return;

    try {
      // Fetch all unique inventory items (master records)
      const res = await fetch(`/api/inventory?locationId=${session.user.locationId}`);
      if (res.ok) {
        const data = await res.json();
        // Extract unique inventory records
        const uniqueInventory = Array.from(
          new Map(
            data.map((item: any) => [
              item.inventory.id,
              {
                id: item.inventory.id,
                name: item.inventory.name,
                unit: item.inventory.unit,
              },
            ])
          ).values()
        );
        setInventoryOptions(uniqueInventory as InventoryOption[]);
      }
    } catch (error) {
      console.error("Error fetching inventory options:", error);
    }
  };

  const handleCreateNewInventory = async () => {
    if (!newInventoryName || !newInventoryUnit || !session?.user?.locationId) {
      alert("Please enter inventory name and unit");
      return;
    }

    try {
      const res = await fetch("/api/inventory/master", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newInventoryName,
          unit: newInventoryUnit,
          locationId: session.user.locationId,
        }),
      });

      if (res.ok) {
        const newInventory = await res.json();
        setInventoryOptions([...inventoryOptions, newInventory]);
        setFormData({ ...formData, inventoryId: newInventory.id });
        setShowNewInventoryFields(false);
        setNewInventoryName("");
        setNewInventoryUnit("");
      } else {
        alert("Failed to create inventory");
      }
    } catch (error) {
      console.error("Error creating inventory:", error);
      alert("An error occurred");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.inventoryId || !formData.currentStock || !formData.minimumStock) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        inventoryId: formData.inventoryId,
        currentStock: parseFloat(formData.currentStock),
        minimumStock: parseFloat(formData.minimumStock),
        maximumStock: formData.maximumStock ? parseFloat(formData.maximumStock) : null,
      };

      const url = inventoryItem
        ? `/api/inventory/${inventoryItem.id}`
        : "/api/inventory";
      const method = inventoryItem ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onSuccess();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to save inventory item");
      }
    } catch (error) {
      console.error("Error saving inventory item:", error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {inventoryItem ? "Edit Inventory Item" : "Add New Inventory Item"}
          </DialogTitle>
          <DialogDescription>
            {inventoryItem
              ? "Update stock levels for this inventory item"
              : "Create a new inventory item to track"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Inventory Selection */}
          <div className="space-y-2">
            <Label htmlFor="inventoryId">Inventory Item *</Label>
            {!showNewInventoryFields ? (
              <div className="flex gap-2">
                <select
                  id="inventoryId"
                  value={formData.inventoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, inventoryId: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                  disabled={!!inventoryItem}
                >
                  <option value="">Select inventory...</option>
                  {inventoryOptions.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.name} ({inv.unit})
                    </option>
                  ))}
                </select>
                {!inventoryItem && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewInventoryFields(true)}
                  >
                    New
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-2 border rounded-lg p-3">
                <p className="text-sm font-medium">Create New Inventory</p>
                <Input
                  placeholder="Inventory name (e.g., Tea Leaves)"
                  value={newInventoryName}
                  onChange={(e) => setNewInventoryName(e.target.value)}
                />
                <Input
                  placeholder="Unit (e.g., kg, liters)"
                  value={newInventoryUnit}
                  onChange={(e) => setNewInventoryUnit(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewInventoryFields(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCreateNewInventory}
                    className="flex-1"
                  >
                    Create
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Current Stock */}
          <div className="space-y-2">
            <Label htmlFor="currentStock">Current Stock *</Label>
            <Input
              id="currentStock"
              type="number"
              step="0.01"
              placeholder="e.g., 50"
              value={formData.currentStock}
              onChange={(e) =>
                setFormData({ ...formData, currentStock: e.target.value })
              }
              required
            />
          </div>

          {/* Minimum Stock */}
          <div className="space-y-2">
            <Label htmlFor="minimumStock">Minimum Stock (Alert Threshold) *</Label>
            <Input
              id="minimumStock"
              type="number"
              step="0.01"
              placeholder="e.g., 10"
              value={formData.minimumStock}
              onChange={(e) =>
                setFormData({ ...formData, minimumStock: e.target.value })
              }
              required
            />
          </div>

          {/* Maximum Stock */}
          <div className="space-y-2">
            <Label htmlFor="maximumStock">Maximum Stock (Optional)</Label>
            <Input
              id="maximumStock"
              type="number"
              step="0.01"
              placeholder="e.g., 100"
              value={formData.maximumStock}
              onChange={(e) =>
                setFormData({ ...formData, maximumStock: e.target.value })
              }
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : inventoryItem ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
