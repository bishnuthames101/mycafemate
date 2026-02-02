"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface Inventory {
  id: string;
  name: string;
  unit: string;
}

interface RecipeItemRowProps {
  inventoryId: string;
  quantityUsed: number;
  inventoryOptions: Inventory[];
  onInventoryChange: (inventoryId: string) => void;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

export function RecipeItemRow({
  inventoryId,
  quantityUsed,
  inventoryOptions,
  onInventoryChange,
  onQuantityChange,
  onRemove,
}: RecipeItemRowProps) {
  // Use local state for display value to allow clearing the input
  const [displayValue, setDisplayValue] = useState(quantityUsed.toString());

  // Sync display value when quantityUsed changes from parent
  useEffect(() => {
    setDisplayValue(quantityUsed.toString());
  }, [quantityUsed]);

  const selectedInventory = inventoryOptions.find(
    (inv) => inv.id === inventoryId
  );

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-2 bg-background rounded-md border">
      <div className="flex-1 w-full sm:w-auto">
        <Select value={inventoryId} onValueChange={onInventoryChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select ingredient" />
          </SelectTrigger>
          <SelectContent>
            {inventoryOptions.map((inv) => (
              <SelectItem key={inv.id} value={inv.id}>
                {inv.name} ({inv.unit})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="flex-1 sm:w-24">
          <Input
            type="number"
            step="0.001"
            min="0"
            value={displayValue}
            onChange={(e) => {
              const value = e.target.value;
              setDisplayValue(value);

              // Convert to number and notify parent
              if (value === "" || value === "-") {
                onQuantityChange(0);
              } else {
                const parsed = parseFloat(value);
                onQuantityChange(isNaN(parsed) ? 0 : parsed);
              }
            }}
            onBlur={() => {
              // On blur, ensure we have a valid display value
              const parsed = parseFloat(displayValue);
              if (isNaN(parsed) || displayValue === "") {
                setDisplayValue("0");
                onQuantityChange(0);
              }
            }}
            placeholder="Qty"
          />
        </div>
        <span className="text-sm text-muted-foreground min-w-[3rem]">
          {selectedInventory?.unit || "-"}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
