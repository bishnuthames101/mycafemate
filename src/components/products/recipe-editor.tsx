"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { RecipeItemRow } from "./recipe-item-row";

interface Inventory {
  id: string;
  name: string;
  unit: string;
}

interface RecipeItem {
  id?: string;
  inventoryId: string;
  quantityUsed: number;
}

interface RecipeEditorProps {
  locationId: string;
  recipeItems: RecipeItem[];
  onChange: (items: RecipeItem[]) => void;
}

export function RecipeEditor({
  locationId,
  recipeItems,
  onChange,
}: RecipeEditorProps) {
  const [inventoryOptions, setInventoryOptions] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventoryOptions();
  }, [locationId]);

  const fetchInventoryOptions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/inventory?locationId=${locationId}`);
      if (res.ok) {
        const data = await res.json();
        // Extract unique inventory items
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
        setInventoryOptions(uniqueInventory as Inventory[]);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    onChange([
      ...recipeItems,
      {
        inventoryId: "",
        quantityUsed: 0,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    onChange(recipeItems.filter((_, i) => i !== index));
  };

  const handleInventoryChange = (index: number, inventoryId: string) => {
    const updated = [...recipeItems];
    updated[index] = { ...updated[index], inventoryId };
    onChange(updated);
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const updated = [...recipeItems];
    updated[index] = { ...updated[index], quantityUsed: quantity };
    onChange(updated);
  };

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading ingredients...</div>;
  }

  return (
    <div className="space-y-2 sm:space-y-3 border rounded-lg p-3 sm:p-4 bg-muted/30">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Label className="text-base font-semibold">Recipe / Ingredients</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddItem}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      {recipeItems.length === 0 ? (
        <div className="text-sm text-muted-foreground py-4 sm:py-6 text-center border-2 border-dashed rounded-lg bg-background">
          <p>No ingredients added yet.</p>
          <p className="text-xs mt-1">Click "Add" to define recipe.</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[150px] sm:max-h-[200px] overflow-y-auto pr-1">
          {recipeItems.map((item, index) => (
            <RecipeItemRow
              key={index}
              inventoryId={item.inventoryId}
              quantityUsed={item.quantityUsed}
              inventoryOptions={inventoryOptions}
              onInventoryChange={(id) => handleInventoryChange(index, id)}
              onQuantityChange={(qty) => handleQuantityChange(index, qty)}
              onRemove={() => handleRemoveItem(index)}
            />
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground italic">
        Specify which inventory items are used to make this product.
      </p>
    </div>
  );
}
