"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table } from "@prisma/client";
import { ArrowRight } from "lucide-react";

interface ChangeTableDialogProps {
  orderId: string;
  orderNumber: string;
  currentTableId: string | null;
  currentTableNumber: string | null;
  locationId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ChangeTableDialog({
  orderId,
  orderNumber,
  currentTableId,
  currentTableNumber,
  locationId,
  open,
  onOpenChange,
  onSuccess,
}: ChangeTableDialogProps) {
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchTables();
      setSelectedTableId("");
      setError(null);
    }
  }, [open, locationId]);

  const fetchTables = async () => {
    try {
      const res = await fetch(`/api/tables?locationId=${locationId}`);
      if (res.ok) {
        const data = await res.json();
        // Filter to only available tables (exclude current table from "occupied" check)
        const availableTables = data.filter(
          (t: Table & { hasActiveOrder?: boolean }) =>
            t.status === "AVAILABLE" || t.id === currentTableId
        );
        setTables(availableTables);
      }
    } catch (err) {
      console.error("Failed to fetch tables");
    }
  };

  const handleChangeTable = async () => {
    if (!selectedTableId) {
      setError("Please select a table");
      return;
    }

    if (selectedTableId === currentTableId) {
      setError("Order is already at this table");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/orders/${orderId}/table`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newTableId: selectedTableId }),
      });

      if (res.ok) {
        onOpenChange(false);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        const data = await res.json();
        setError(data.message || data.error || "Failed to change table");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedTable = tables.find((t) => t.id === selectedTableId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Table</DialogTitle>
          <DialogDescription>
            Order: {orderNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Current Table Info */}
          <div className="p-3 bg-cream-50 rounded-lg">
            <Label className="text-sm text-muted-foreground">Current Table</Label>
            <p className="font-medium text-coffee-700">
              {currentTableNumber ? `Table ${currentTableNumber}` : "No table assigned"}
            </p>
          </div>

          {/* Table Selection */}
          <div className="space-y-2">
            <Label htmlFor="new-table">Select New Table</Label>
            <Select value={selectedTableId} onValueChange={setSelectedTableId}>
              <SelectTrigger id="new-table">
                <SelectValue placeholder="Choose a table" />
              </SelectTrigger>
              <SelectContent>
                {tables
                  .filter((t) => t.id !== currentTableId)
                  .map((table) => (
                    <SelectItem key={table.id} value={table.id}>
                      Table {table.number} ({table.capacity} seats)
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selected Table Preview */}
          {selectedTable && selectedTableId !== currentTableId && (
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Moving to</p>
                <p className="font-medium text-green-700">
                  Table {selectedTable.number} ({selectedTable.capacity} seats)
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-green-600" />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleChangeTable}
            disabled={isLoading || !selectedTableId || selectedTableId === currentTableId}
          >
            {isLoading ? "Changing..." : "Change Table"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
