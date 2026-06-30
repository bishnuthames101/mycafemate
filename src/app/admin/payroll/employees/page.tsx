"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, UserPlus, Search, Edit, UserX } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { useEmployees } from "@/lib/hooks/use-employees";
import { AdminListSkeleton } from "@/components/skeletons/page-skeletons";
import dynamic from "next/dynamic";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EmployeeFormDialog = dynamic(
  () =>
    import("@/components/payroll/employee-form-dialog").then(
      (m) => m.EmployeeFormDialog
    ),
  { ssr: false }
);

interface Location {
  id: string;
  name: string;
}

export default function AdminPayrollEmployeesPage() {
  const { employees, isLoading: empLoading, mutate } = useEmployees();
  const { data: locations, isLoading: locLoading } =
    useSWR<Location[]>("/api/locations");

  const [selectedLocation, setSelectedLocation] = useState("ALL");
  const [selectedDepartment, setSelectedDepartment] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editEmployee, setEditEmployee] = useState<any>(null);
  const [deactivatingId, setDeactivatingId] = useState<string | null>(null);

  const departments = useMemo(() => {
    const depts = new Set(employees.map((e) => e.department));
    return Array.from(depts).sort();
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    let filtered = employees;
    if (selectedLocation !== "ALL") {
      filtered = filtered.filter((e) => e.locationId === selectedLocation);
    }
    if (selectedDepartment !== "ALL") {
      filtered = filtered.filter((e) => e.department === selectedDepartment);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.user.name.toLowerCase().includes(q) ||
          e.user.email.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q) ||
          (e.designation && e.designation.toLowerCase().includes(q))
      );
    }
    return filtered;
  }, [employees, selectedLocation, selectedDepartment, searchQuery]);

  const handleDeactivate = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this employee profile?"))
      return;

    setDeactivatingId(id);
    try {
      const res = await fetch(`/api/payroll/employees/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        mutate();
      } else {
        alert("Failed to deactivate employee");
      }
    } catch {
      alert("An error occurred");
    } finally {
      setDeactivatingId(null);
    }
  };

  const handleEdit = (emp: any) => {
    setEditEmployee(emp);
    setShowDialog(true);
  };

  const handleDialogSuccess = () => {
    setShowDialog(false);
    setEditEmployee(null);
    mutate();
  };

  if (empLoading || locLoading) {
    return <AdminListSkeleton />;
  }

  const locationsList = locations ?? [];

  return (
    <>
      <EmployeeFormDialog
        open={showDialog}
        onOpenChange={(open) => {
          setShowDialog(open);
          if (!open) setEditEmployee(null);
        }}
        onSuccess={handleDialogSuccess}
        employee={editEmployee}
      />

      <div className="min-h-screen bg-cream-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Link href="/admin/payroll">
                <Button variant="outline" size="icon" className="shrink-0">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl md:text-4xl font-bold text-coffee-700">
                  Employee Profiles
                </h1>
                <p className="text-sm md:text-base text-coffee-600 mt-1">
                  Manage employee payroll profiles and compensation
                </p>
              </div>
            </div>
            <Button onClick={() => setShowDialog(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, email, department..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select
                  value={selectedLocation}
                  onValueChange={setSelectedLocation}
                >
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Locations</SelectItem>
                    {locationsList.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id}>
                        {loc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedDepartment}
                  onValueChange={setSelectedDepartment}
                >
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Employee List */}
          {filteredEmployees.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchQuery ||
                  selectedLocation !== "ALL" ||
                  selectedDepartment !== "ALL"
                    ? "No employees match your filters"
                    : "No employee profiles yet"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredEmployees.map((emp) => (
                <Card key={emp.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-coffee-700">
                          {emp.user.name}
                        </h3>
                        <p className="text-sm text-gray-500">{emp.user.email}</p>
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          <p>
                            Department: {emp.department}
                            {emp.designation && ` | ${emp.designation}`}
                          </p>
                          <p>
                            Location: {emp.location.name} | Role:{" "}
                            {emp.user.role}
                          </p>
                          <p>
                            Pay Type: {emp.payType} | Joined:{" "}
                            {new Date(emp.joiningDate).toLocaleDateString()}
                          </p>
                          {emp.bankName && (
                            <p>
                              Bank: {emp.bankName}
                              {emp.bankBranch && ` (${emp.bankBranch})`}
                            </p>
                          )}
                          <p className="text-xs text-gray-400">
                            Payroll records: {emp._count.payrollRecords}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-2xl font-bold text-coffee-700">
                          {formatCurrency(emp.baseSalary)}
                        </p>
                        <p className="text-xs text-gray-400 mb-3">
                          /{emp.payType === "MONTHLY" ? "month" : "day"}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(emp)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => handleDeactivate(emp.id)}
                            disabled={deactivatingId === emp.id}
                          >
                            <UserX className="h-3 w-3 mr-1" />
                            {deactivatingId === emp.id
                              ? "..."
                              : "Deactivate"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
