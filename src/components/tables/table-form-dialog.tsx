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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Table {
  id: string;
  number: string;
  capacity: number;
  locationId: string;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "CLEANING";
}

interface TableFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  table?: Table | null;
  onSuccess: () => void;
  locationId: string;
}

const statuses = [
  { value: "AVAILABLE", label: "Available" },
  { value: "OCCUPIED", label: "Occupied" },
  { value: "RESERVED", label: "Reserved" },
  { value: "CLEANING", label: "Cleaning" },
];

export function TableFormDialog({
  open,
  onOpenChange,
  table,
  onSuccess,
  locationId,
}: TableFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    number: "",
    capacity: "",
    status: "AVAILABLE",
  });

  useEffect(() => {
    if (table) {
      setFormData({
        number: table.number,
        capacity: table.capacity.toString(),
        status: table.status,
      });
    } else {
      setFormData({
        number: "",
        capacity: "",
        status: "AVAILABLE",
      });
    }
  }, [table, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        number: formData.number,
        capacity: parseInt(formData.capacity),
        locationId,
        status: formData.status,
      };

      const url = table ? `/api/tables/${table.id}` : "/api/tables";
      const method = table ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onSuccess();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to save table");
      }
    } catch (error) {
      console.error("Error saving table:", error);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{table ? "Edit Table" : "Add New Table"}</DialogTitle>
            <DialogDescription>
              {table
                ? "Update the table details below."
                : "Fill in the details to create a new table."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Table Number */}
            <div className="space-y-2">
              <Label htmlFor="number">
                Table Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="number"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                placeholder="e.g., 1, 2, A1, VIP-1"
                required
              />
              <p className="text-xs text-muted-foreground">
                This can be a number or alphanumeric identifier
              </p>
            </div>

            {/* Capacity */}
            <div className="space-y-2">
              <Label htmlFor="capacity">
                Seating Capacity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                max="20"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                placeholder="e.g., 4"
                required
              />
              <p className="text-xs text-muted-foreground">
                Number of people this table can seat
              </p>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">
                Status <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((stat) => (
                    <SelectItem key={stat.value} value={stat.value}>
                      {stat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : table ? "Update Table" : "Create Table"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
