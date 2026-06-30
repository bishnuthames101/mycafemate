"use client";

import { useState, useEffect, useMemo } from "react";
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
import { formatCurrency } from "@/lib/utils";

interface PayrollRecordEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  record: any;
  runId: string;
}

export function PayrollRecordEditDialog({
  open,
  onOpenChange,
  onSuccess,
  record,
  runId,
}: PayrollRecordEditDialogProps) {
  const [formData, setFormData] = useState({
    daysWorked: "",
    overtime: "0",
    bonus: "0",
    allowance: "0",
    deductionSSF: "0",
    deductionTax: "0",
    deductionAdvance: "0",
    deductionOther: "0",
    deductionNotes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (record) {
      setFormData({
        daysWorked: record.daysWorked != null ? String(record.daysWorked) : "",
        overtime: String(record.overtime || 0),
        bonus: String(record.bonus || 0),
        allowance: String(record.allowance || 0),
        deductionSSF: String(record.deductionSSF || 0),
        deductionTax: String(record.deductionTax || 0),
        deductionAdvance: String(record.deductionAdvance || 0),
        deductionOther: String(record.deductionOther || 0),
        deductionNotes: record.deductionNotes || "",
      });
      setError(null);
    }
  }, [record]);

  const isDailyPay = record?.employeeProfile?.payType === "DAILY";

  // Live preview calculation
  const preview = useMemo(() => {
    if (!record) return { grossPay: 0, totalDeductions: 0, netPay: 0 };

    const baseSalary = record.baseSalary;
    const overtime = parseFloat(formData.overtime) || 0;
    const bonus = parseFloat(formData.bonus) || 0;
    const allowance = parseFloat(formData.allowance) || 0;

    let grossPay: number;
    if (isDailyPay && formData.daysWorked) {
      const dailyRate = baseSalary / 30;
      grossPay =
        dailyRate * (parseInt(formData.daysWorked) || 0) +
        overtime +
        bonus +
        allowance;
    } else {
      grossPay = baseSalary + overtime + bonus + allowance;
    }

    const totalDeductions =
      (parseFloat(formData.deductionSSF) || 0) +
      (parseFloat(formData.deductionTax) || 0) +
      (parseFloat(formData.deductionAdvance) || 0) +
      (parseFloat(formData.deductionOther) || 0);

    return {
      grossPay,
      totalDeductions,
      netPay: grossPay - totalDeductions,
    };
  }, [formData, record, isDailyPay]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const payload: any = {
        overtime: parseFloat(formData.overtime) || 0,
        bonus: parseFloat(formData.bonus) || 0,
        allowance: parseFloat(formData.allowance) || 0,
        deductionSSF: parseFloat(formData.deductionSSF) || 0,
        deductionTax: parseFloat(formData.deductionTax) || 0,
        deductionAdvance: parseFloat(formData.deductionAdvance) || 0,
        deductionOther: parseFloat(formData.deductionOther) || 0,
        deductionNotes: formData.deductionNotes || undefined,
      };

      if (isDailyPay && formData.daysWorked) {
        payload.daysWorked = parseInt(formData.daysWorked);
      }

      const res = await fetch(
        `/api/payroll/runs/${runId}/records/${record.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        onSuccess();
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to update record");
      }
    } catch (err) {
      setError("Failed to update record");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!record) return null;

  const employeeName = record.employeeProfile?.user?.name || "Unknown";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Edit Pay Record — {employeeName}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4 flex-1 overflow-y-auto">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Base salary (read-only) */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Base Salary: <strong>{formatCurrency(record.baseSalary)}</strong>
                {isDailyPay && " (Daily rate)"}
              </p>
            </div>

            {/* Days worked (DAILY only) */}
            {isDailyPay && (
              <div>
                <Label htmlFor="daysWorked">Days Worked</Label>
                <Input
                  id="daysWorked"
                  type="number"
                  min="0"
                  max="31"
                  value={formData.daysWorked}
                  onChange={(e) =>
                    setFormData({ ...formData, daysWorked: e.target.value })
                  }
                  placeholder="Number of days"
                />
              </div>
            )}

            {/* Earnings */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-green-700">Earnings</p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="overtime" className="text-xs">
                    Overtime
                  </Label>
                  <Input
                    id="overtime"
                    type="number"
                    min="0"
                    value={formData.overtime}
                    onChange={(e) =>
                      setFormData({ ...formData, overtime: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="bonus" className="text-xs">
                    Bonus
                  </Label>
                  <Input
                    id="bonus"
                    type="number"
                    min="0"
                    value={formData.bonus}
                    onChange={(e) =>
                      setFormData({ ...formData, bonus: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="allowance" className="text-xs">
                    Allowance
                  </Label>
                  <Input
                    id="allowance"
                    type="number"
                    min="0"
                    value={formData.allowance}
                    onChange={(e) =>
                      setFormData({ ...formData, allowance: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-red-700">Deductions</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="deductionSSF" className="text-xs">
                    SSF
                  </Label>
                  <Input
                    id="deductionSSF"
                    type="number"
                    min="0"
                    value={formData.deductionSSF}
                    onChange={(e) =>
                      setFormData({ ...formData, deductionSSF: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="deductionTax" className="text-xs">
                    Tax (TDS)
                  </Label>
                  <Input
                    id="deductionTax"
                    type="number"
                    min="0"
                    value={formData.deductionTax}
                    onChange={(e) =>
                      setFormData({ ...formData, deductionTax: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="deductionAdvance" className="text-xs">
                    Advance
                  </Label>
                  <Input
                    id="deductionAdvance"
                    type="number"
                    min="0"
                    value={formData.deductionAdvance}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        deductionAdvance: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="deductionOther" className="text-xs">
                    Other
                  </Label>
                  <Input
                    id="deductionOther"
                    type="number"
                    min="0"
                    value={formData.deductionOther}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        deductionOther: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="deductionNotes" className="text-xs">
                  Deduction Notes
                </Label>
                <Input
                  id="deductionNotes"
                  value={formData.deductionNotes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      deductionNotes: e.target.value,
                    })
                  }
                  placeholder="Reason for deductions"
                />
              </div>
            </div>

            {/* Live Preview */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-1">
              <div className="flex justify-between text-sm">
                <span>Gross Pay:</span>
                <span className="font-medium">
                  {formatCurrency(preview.grossPay)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-red-600">
                <span>Deductions:</span>
                <span className="font-medium">
                  -{formatCurrency(preview.totalDeductions)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t border-blue-200 pt-1">
                <span>Net Pay:</span>
                <span className={preview.netPay < 0 ? "text-red-600" : "text-green-700"}>
                  {formatCurrency(preview.netPay)}
                </span>
              </div>
            </div>
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
