"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Banknote, Smartphone, Building2, CreditCard, X, UserPlus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { CreditorSelectDialog } from "@/components/creditors/creditor-select-dialog";

interface PaymentFlowDialogProps {
  orderId: string;
  orderNumber: string;
  total: number;
  locationId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const paymentMethods = [
  { value: "CASH", label: "Cash", icon: Banknote, description: "Pay with cash" },
  { value: "ESEWA", label: "eSewa", icon: Smartphone, description: "Digital wallet payment" },
  { value: "FONEPAY", label: "FonePay", icon: Smartphone, description: "Mobile banking" },
  { value: "BANK_TRANSFER", label: "Bank Transfer", icon: Building2, description: "Direct bank transfer" },
  { value: "CREDIT", label: "Credit", icon: UserPlus, description: "Pay on account (running tab)" },
];

export function PaymentFlowDialog({
  orderId,
  orderNumber,
  total,
  locationId,
  open,
  onOpenChange,
  onSuccess,
}: PaymentFlowDialogProps) {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<string>("CASH");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCreditor, setSelectedCreditor] = useState<any>(null);
  const [showCreditorDialog, setShowCreditorDialog] = useState(false);

  const handlePayment = async () => {
    // Validate creditor selection for CREDIT payment
    if (selectedMethod === "CREDIT" && !selectedCreditor) {
      alert("Please select or create a creditor");
      return;
    }

    setIsProcessing(true);
    try {
      // Update payment method and status
      const paymentRes = await fetch(`/api/orders/${orderId}/payment`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod: selectedMethod,
          paymentStatus: selectedMethod === "CREDIT" ? "PENDING" : "PAID",
          creditorId: selectedMethod === "CREDIT" ? selectedCreditor.id : undefined,
        }),
      });

      if (!paymentRes.ok) {
        throw new Error("Failed to update payment");
      }

      // Mark order as COMPLETED for all payment methods
      // Credit orders are still completed orders — the unpaid balance
      // is tracked separately via paymentStatus and the creditor system
      const statusRes = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "COMPLETED",
        }),
      });

      if (!statusRes.ok) {
        throw new Error("Failed to update order status");
      }

      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/staff/orders");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Failed to process payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "CANCELLED",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to cancel order");
      }

      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/staff/orders");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Process Payment</DialogTitle>
          <DialogDescription>
            Order {orderNumber} - Total: {formatCurrency(total)}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 flex-1 min-h-0 overflow-y-auto">
          <Label className="text-base font-semibold mb-3 block">Select Payment Method</Label>
          <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
            <div className="space-y-2">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <div
                    key={method.value}
                    className={`flex items-center space-x-3 border rounded-lg p-3 cursor-pointer transition-all ${
                      selectedMethod === method.value
                        ? "border-coffee-600 bg-coffee-50"
                        : "border-gray-200 hover:border-coffee-300"
                    }`}
                    onClick={() => setSelectedMethod(method.value)}
                  >
                    <RadioGroupItem value={method.value} id={method.value} />
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${
                        selectedMethod === method.value ? "bg-coffee-100" : "bg-gray-100"
                      }`}>
                        <Icon className={`h-5 w-5 ${
                          selectedMethod === method.value ? "text-coffee-700" : "text-gray-600"
                        }`} />
                      </div>
                      <div>
                        <Label
                          htmlFor={method.value}
                          className="text-base font-medium cursor-pointer"
                        >
                          {method.label}
                        </Label>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </RadioGroup>

          {/* Creditor Selection for CREDIT payment */}
          {selectedMethod === "CREDIT" && (
            <div className="mt-4 p-4 border rounded-lg bg-blue-50">
              {selectedCreditor ? (
                <div>
                  <p className="text-sm font-medium mb-2">Selected Creditor:</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{selectedCreditor.name}</p>
                      {selectedCreditor.phone && (
                        <p className="text-sm text-gray-600">{selectedCreditor.phone}</p>
                      )}
                      <p className="text-sm text-red-600 mt-1">
                        Current Balance: NPR {selectedCreditor.currentBalance.toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCreditorDialog(true)}
                    >
                      Change
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => setShowCreditorDialog(true)}
                  variant="outline"
                  className="w-full"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Select or Create Creditor
                </Button>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0 shrink-0 border-t pt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isProcessing}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel Order
          </Button>
          <Button onClick={handlePayment} disabled={isProcessing} size="lg">
            <CreditCard className="h-4 w-4 mr-2" />
            {isProcessing ? "Processing..." : `Complete Payment - ${formatCurrency(total)}`}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Creditor Select Dialog */}
      <CreditorSelectDialog
        open={showCreditorDialog}
        onOpenChange={setShowCreditorDialog}
        locationId={locationId}
        onSelect={(creditor) => {
          setSelectedCreditor(creditor);
          setShowCreditorDialog(false);
        }}
      />
    </Dialog>
  );
}
