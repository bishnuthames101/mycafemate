"use client";

import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Banknote, Smartphone, Building2, CreditCard, X, UserPlus, Split, Check, AlertCircle } from "lucide-react";
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

interface SplitPayment {
  paymentMethod: string;
  amount: number;
  creditorId: string | null;
}

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

  // Split payment state
  const [isSplitMode, setIsSplitMode] = useState(false);
  const [splitPayments, setSplitPayments] = useState<SplitPayment[]>([
    { paymentMethod: "CASH", amount: 0, creditorId: null },
    { paymentMethod: "ESEWA", amount: 0, creditorId: null },
  ]);
  const [splitCreditor, setSplitCreditor] = useState<any>(null);
  const [showSplitCreditorDialog, setShowSplitCreditorDialog] = useState(false);
  const [activePaymentIndex, setActivePaymentIndex] = useState<number>(0);

  // Calculate split payment total
  const splitTotal = splitPayments.reduce((sum, p) => sum + p.amount, 0);
  const isSplitValid = Math.abs(splitTotal - total) < 0.01 && splitPayments.every(p => p.amount > 0);
  const hasSplitCredit = splitPayments.some(p => p.paymentMethod === "CREDIT");
  const creditCount = splitPayments.filter(p => p.paymentMethod === "CREDIT").length;

  // Reset split amounts when toggling split mode
  useEffect(() => {
    if (isSplitMode) {
      setSplitPayments([
        { paymentMethod: "CASH", amount: Math.floor(total / 2), creditorId: null },
        { paymentMethod: "ESEWA", amount: total - Math.floor(total / 2), creditorId: null },
      ]);
    }
  }, [isSplitMode, total]);

  // Update split payment
  const updateSplitPayment = (index: number, updates: Partial<SplitPayment>) => {
    setSplitPayments(prev => {
      const newPayments = [...prev];
      newPayments[index] = { ...newPayments[index], ...updates };
      // Clear creditor if switching away from CREDIT
      if (updates.paymentMethod && updates.paymentMethod !== "CREDIT") {
        newPayments[index].creditorId = null;
      }
      return newPayments;
    });
  };

  // Fill remaining amount for second payment
  const fillRemaining = (index: number) => {
    const otherIndex = index === 0 ? 1 : 0;
    const remaining = total - splitPayments[otherIndex].amount;
    updateSplitPayment(index, { amount: Math.max(0, remaining) });
  };

  const handlePayment = async () => {
    // Validate split payment
    if (isSplitMode) {
      if (!isSplitValid) {
        alert("Payment amounts must equal order total");
        return;
      }
      if (creditCount > 1) {
        alert("Only one payment can be CREDIT in a split");
        return;
      }
      // Check if credit payment has creditor selected
      const creditPaymentIndex = splitPayments.findIndex(p => p.paymentMethod === "CREDIT");
      if (creditPaymentIndex !== -1 && !splitPayments[creditPaymentIndex].creditorId) {
        alert("Please select a creditor for the credit payment");
        return;
      }
    } else {
      // Validate creditor selection for single CREDIT payment
      if (selectedMethod === "CREDIT" && !selectedCreditor) {
        alert("Please select or create a creditor");
        return;
      }
    }

    setIsProcessing(true);
    try {
      let paymentBody: any;

      if (isSplitMode) {
        // Split payment payload
        paymentBody = {
          isSplitPayment: true,
          payments: splitPayments.map(p => ({
            paymentMethod: p.paymentMethod,
            amount: p.amount,
            creditorId: p.paymentMethod === "CREDIT" ? p.creditorId : undefined,
          })),
        };
      } else {
        // Single payment payload
        paymentBody = {
          paymentMethod: selectedMethod,
          paymentStatus: selectedMethod === "CREDIT" ? "PENDING" : "PAID",
          creditorId: selectedMethod === "CREDIT" ? selectedCreditor.id : undefined,
        };
      }

      // Update payment method and status
      const paymentRes = await fetch(`/api/orders/${orderId}/payment`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentBody),
      });

      if (!paymentRes.ok) {
        const error = await paymentRes.json();
        throw new Error(error.error || "Failed to update payment");
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
      alert(error instanceof Error ? error.message : "Failed to process payment. Please try again.");
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
          {/* Split Payment Toggle */}
          <div className="flex items-center justify-between mb-4 p-3 border rounded-lg bg-cream-50">
            <div className="flex items-center gap-2">
              <Split className="h-5 w-5 text-coffee-600" />
              <div>
                <Label htmlFor="split-mode" className="text-base font-medium cursor-pointer">
                  Split Payment
                </Label>
                <p className="text-sm text-muted-foreground">Pay with two methods</p>
              </div>
            </div>
            <Switch
              id="split-mode"
              checked={isSplitMode}
              onCheckedChange={setIsSplitMode}
            />
          </div>

          {!isSplitMode ? (
            <>
              {/* Single Payment Mode */}
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
            </>
          ) : (
            <>
              {/* Split Payment Mode */}
              <div className="space-y-4">
                {splitPayments.map((payment, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <Label className="text-sm font-semibold text-coffee-700">
                      Payment {index + 1}
                    </Label>

                    {/* Method Selector */}
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Method</Label>
                      <Select
                        value={payment.paymentMethod}
                        onValueChange={(value) => updateSplitPayment(index, { paymentMethod: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethods.map((method) => (
                            <SelectItem key={method.value} value={method.value}>
                              <div className="flex items-center gap-2">
                                <method.icon className="h-4 w-4" />
                                {method.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Amount Input */}
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Amount (NPR)</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="0"
                          max={total}
                          step="1"
                          value={payment.amount || ""}
                          onChange={(e) => updateSplitPayment(index, { amount: parseFloat(e.target.value) || 0 })}
                          placeholder="0"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fillRemaining(index)}
                          className="shrink-0"
                        >
                          Fill
                        </Button>
                      </div>
                    </div>

                    {/* Creditor Selection for CREDIT */}
                    {payment.paymentMethod === "CREDIT" && (
                      <div className="p-3 border rounded-lg bg-blue-50">
                        {payment.creditorId && splitCreditor ? (
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">{splitCreditor.name}</p>
                              <p className="text-xs text-red-600">
                                Balance: NPR {splitCreditor.currentBalance.toLocaleString()}
                                {" → "}
                                {(splitCreditor.currentBalance + payment.amount).toLocaleString()}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setActivePaymentIndex(index);
                                setShowSplitCreditorDialog(true);
                              }}
                            >
                              Change
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              setActivePaymentIndex(index);
                              setShowSplitCreditorDialog(true);
                            }}
                          >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Select Creditor
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Split Total Validation */}
                <div className={`p-3 rounded-lg flex items-center justify-between ${
                  isSplitValid ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                }`}>
                  <span className="font-medium">Total:</span>
                  <div className="flex items-center gap-2">
                    <span className={isSplitValid ? "text-green-700" : "text-red-700"}>
                      {formatCurrency(splitTotal)} / {formatCurrency(total)}
                    </span>
                    {isSplitValid ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </div>

                {/* Credit warning */}
                {creditCount > 1 && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-red-700 text-sm">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    Only one payment can be CREDIT in a split
                  </div>
                )}
              </div>
            </>
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
          <Button
            onClick={handlePayment}
            disabled={isProcessing || (isSplitMode && (!isSplitValid || creditCount > 1))}
            size="lg"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            {isProcessing ? "Processing..." : `Complete Payment - ${formatCurrency(total)}`}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Creditor Select Dialog for single payment */}
      <CreditorSelectDialog
        open={showCreditorDialog}
        onOpenChange={setShowCreditorDialog}
        locationId={locationId}
        onSelect={(creditor) => {
          setSelectedCreditor(creditor);
          setShowCreditorDialog(false);
        }}
      />

      {/* Creditor Select Dialog for split payment */}
      <CreditorSelectDialog
        open={showSplitCreditorDialog}
        onOpenChange={setShowSplitCreditorDialog}
        locationId={locationId}
        onSelect={(creditor) => {
          setSplitCreditor(creditor);
          updateSplitPayment(activePaymentIndex, { creditorId: creditor.id });
          setShowSplitCreditorDialog(false);
        }}
      />
    </Dialog>
  );
}
