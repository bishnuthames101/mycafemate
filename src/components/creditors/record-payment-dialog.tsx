"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
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
import { Textarea } from "@/components/ui/textarea";

interface RecordPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creditor: {
    id: string;
    name: string;
    currentBalance: number;
  };
  onSuccess: () => void;
}

export function RecordPaymentDialog({
  open,
  onOpenChange,
  creditor,
  onSuccess,
}: RecordPaymentDialogProps) {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const amountNum = parseFloat(amount);

    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (amountNum > creditor.currentBalance) {
      setError("Payment amount cannot exceed outstanding balance");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/creditors/${creditor.id}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountNum,
          paymentMethod,
          notes: notes || undefined,
        }),
      });

      if (res.ok) {
        onSuccess();
        onOpenChange(false);
        setAmount("");
        setNotes("");
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to record payment");
      }
    } catch (err) {
      setError("Failed to record payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const willClearBalance = parseFloat(amount) === creditor.currentBalance;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Record Payment - {creditor.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4 flex-1 overflow-y-auto">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Outstanding Balance */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-600">Outstanding Balance:</p>
              <p className="text-2xl font-bold text-blue-700">
                NPR {creditor.currentBalance.toLocaleString()}
              </p>
            </div>

            {/* Payment Amount */}
            <div>
              <Label htmlFor="amount">Payment Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                max={creditor.currentBalance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                placeholder="Enter payment amount"
              />
              <p className="text-xs text-gray-500 mt-1">
                Max: NPR {creditor.currentBalance.toLocaleString()}
              </p>
            </div>

            {/* Payment Method */}
            <div>
              <Label htmlFor="paymentMethod">Payment Method *</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="ESEWA">eSewa</SelectItem>
                  <SelectItem value="FONEPAY">FonePay</SelectItem>
                  <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this payment..."
                rows={3}
              />
            </div>

            {/* Notice for full payment */}
            {willClearBalance && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  This payment will fully clear the outstanding balance.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="shrink-0 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Recording..." : "Record Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
