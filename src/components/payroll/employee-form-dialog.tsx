"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
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

interface EmployeeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  employee?: any;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Location {
  id: string;
  name: string;
}

const initialFormData = {
  userId: "",
  locationId: "",
  department: "General",
  designation: "",
  payType: "MONTHLY" as "MONTHLY" | "DAILY",
  baseSalary: "",
  bankName: "",
  bankAccountNo: "",
  bankBranch: "",
  joiningDate: "",
  notes: "",
};

export function EmployeeFormDialog({
  open,
  onOpenChange,
  onSuccess,
  employee,
}: EmployeeFormDialogProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: usersData } = useSWR<{ users: User[] }>(open ? "/api/admin/users" : null);
  const users = usersData?.users;
  const { data: locations } = useSWR<Location[]>(open ? "/api/locations" : null);
  const { data: existingEmployees } = useSWR<any[]>(
    open && !employee ? "/api/payroll/employees?isActive=" : null
  );

  // Pre-fill form for edit mode
  useEffect(() => {
    if (employee) {
      setFormData({
        userId: employee.userId,
        locationId: employee.locationId,
        department: employee.department || "General",
        designation: employee.designation || "",
        payType: employee.payType,
        baseSalary: String(employee.baseSalary),
        bankName: employee.bankName || "",
        bankAccountNo: employee.bankAccountNo || "",
        bankBranch: employee.bankBranch || "",
        joiningDate: employee.joiningDate
          ? new Date(employee.joiningDate).toISOString().split("T")[0]
          : "",
        notes: employee.notes || "",
      });
    } else {
      setFormData(initialFormData);
    }
    setError(null);
  }, [employee, open]);

  // Filter out users who already have an employee profile
  const availableUsers = users?.filter((u) => {
    if (employee) return true;
    const existingUserIds = new Set(
      existingEmployees?.map((e: any) => e.userId) ?? []
    );
    return !existingUserIds.has(u.id);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const url = employee
        ? `/api/payroll/employees/${employee.id}`
        : "/api/payroll/employees";
      const method = employee ? "PATCH" : "POST";

      const payload: any = {
        ...formData,
        baseSalary: parseFloat(formData.baseSalary),
      };

      // Don't send userId on update
      if (employee) {
        delete payload.userId;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onSuccess();
        if (!employee) setFormData(initialFormData);
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to save employee profile");
      }
    } catch (err) {
      setError("Failed to save employee profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              {employee ? "Edit Employee Profile" : "Add Employee Profile"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4 flex-1 overflow-y-auto">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            {/* User Select */}
            {!employee && (
              <div>
                <Label htmlFor="userId">Staff Member *</Label>
                <Select
                  value={formData.userId}
                  onValueChange={(val) =>
                    setFormData({ ...formData, userId: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers?.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.email}) - {user.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Location */}
            <div>
              <Label htmlFor="locationId">Location *</Label>
              <Select
                value={formData.locationId}
                onValueChange={(val) =>
                  setFormData({ ...formData, locationId: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations?.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id}>
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Department & Designation */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  placeholder="e.g., Kitchen, Service"
                  required
                />
              </div>
              <div>
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  value={formData.designation}
                  onChange={(e) =>
                    setFormData({ ...formData, designation: e.target.value })
                  }
                  placeholder="e.g., Head Barista"
                />
              </div>
            </div>

            {/* Pay Type & Salary */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="payType">Pay Type *</Label>
                <Select
                  value={formData.payType}
                  onValueChange={(val: "MONTHLY" | "DAILY") =>
                    setFormData({ ...formData, payType: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                    <SelectItem value="DAILY">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="baseSalary">
                  Base Salary (Rs.) *
                </Label>
                <Input
                  id="baseSalary"
                  type="number"
                  min="0"
                  step="100"
                  value={formData.baseSalary}
                  onChange={(e) =>
                    setFormData({ ...formData, baseSalary: e.target.value })
                  }
                  placeholder="e.g., 15000"
                  required
                />
              </div>
            </div>

            {/* Joining Date */}
            <div>
              <Label htmlFor="joiningDate">Joining Date *</Label>
              <Input
                id="joiningDate"
                type="date"
                value={formData.joiningDate}
                onChange={(e) =>
                  setFormData({ ...formData, joiningDate: e.target.value })
                }
                required
              />
            </div>

            {/* Bank Details */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Bank Details (Optional)
              </p>
              <div className="grid grid-cols-1 gap-3">
                <Input
                  placeholder="Bank Name"
                  value={formData.bankName}
                  onChange={(e) =>
                    setFormData({ ...formData, bankName: e.target.value })
                  }
                />
                <Input
                  placeholder="Account Number"
                  value={formData.bankAccountNo}
                  onChange={(e) =>
                    setFormData({ ...formData, bankAccountNo: e.target.value })
                  }
                />
                <Input
                  placeholder="Branch"
                  value={formData.bankBranch}
                  onChange={(e) =>
                    setFormData({ ...formData, bankBranch: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Any additional notes"
              />
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
              {isSubmitting
                ? employee
                  ? "Saving..."
                  : "Creating..."
                : employee
                  ? "Save Changes"
                  : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
