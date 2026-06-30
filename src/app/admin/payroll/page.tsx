"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  UserPlus,
  Search,
  Play,
  Users,
  Wallet,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { useEmployees } from "@/lib/hooks/use-employees";
import { usePayrollRuns } from "@/lib/hooks/use-payroll-runs";
import { PayrollStatusBadge } from "@/components/payroll/payroll-status-badge";
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
const PayrollRunDialog = dynamic(
  () =>
    import("@/components/payroll/payroll-run-dialog").then(
      (m) => m.PayrollRunDialog
    ),
  { ssr: false }
);

interface Location {
  id: string;
  name: string;
}

export default function AdminPayrollPage() {
  const router = useRouter();

  const { employees, isLoading: empLoading, mutate: mutateEmp } = useEmployees();
  const { runs, isLoading: runsLoading, mutate: mutateRuns } = usePayrollRuns();
  const { data: locations, isLoading: locLoading } =
    useSWR<Location[]>("/api/locations");

  const [selectedLocation, setSelectedLocation] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmployeeDialog, setShowEmployeeDialog] = useState(false);
  const [showRunDialog, setShowRunDialog] = useState(false);

  const filteredEmployees = useMemo(() => {
    let filtered = employees;
    if (selectedLocation !== "ALL") {
      filtered = filtered.filter((e) => e.locationId === selectedLocation);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.user.name.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q) ||
          (e.designation && e.designation.toLowerCase().includes(q))
      );
    }
    return filtered;
  }, [employees, selectedLocation, searchQuery]);

  if (empLoading || runsLoading || locLoading) {
    return <AdminListSkeleton />;
  }

  const locationsList = locations ?? [];
  const recentRuns = runs.slice(0, 5);

  // Stats
  const totalEmployees = filteredEmployees.length;
  const totalMonthlyCost = filteredEmployees.reduce(
    (sum, e) => sum + e.baseSalary,
    0
  );
  const avgSalary = totalEmployees > 0 ? totalMonthlyCost / totalEmployees : 0;
  const lastRun = runs[0];

  return (
    <>
      <EmployeeFormDialog
        open={showEmployeeDialog}
        onOpenChange={setShowEmployeeDialog}
        onSuccess={() => {
          setShowEmployeeDialog(false);
          mutateEmp();
        }}
      />
      <PayrollRunDialog
        open={showRunDialog}
        onOpenChange={setShowRunDialog}
        onSuccess={() => {
          setShowRunDialog(false);
          mutateRuns();
        }}
      />

      <div className="min-h-screen bg-cream-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Link href="/admin">
                <Button variant="outline" size="icon" className="shrink-0">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl md:text-4xl font-bold text-coffee-700">
                  Payroll Management
                </h1>
                <p className="text-sm md:text-base text-coffee-600 mt-1 md:mt-2">
                  Manage employee salaries, process payroll, and track payment
                  history
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={() => setShowEmployeeDialog(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowRunDialog(true)}
              >
                <Play className="h-4 w-4 mr-2" />
                New Payroll Run
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Total Employees
                  </p>
                  <p className="text-2xl font-bold text-coffee-700">
                    {totalEmployees}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Monthly Payroll
                  </p>
                  <p className="text-2xl font-bold text-coffee-700">
                    {formatCurrency(totalMonthlyCost)}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Avg Salary</p>
                  <p className="text-2xl font-bold text-coffee-700">
                    {formatCurrency(avgSalary)}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Last Run</p>
                  {lastRun ? (
                    <div className="flex flex-col items-center gap-1">
                      <p className="text-lg font-bold text-coffee-700">
                        {lastRun.periodLabel}
                      </p>
                      <PayrollStatusBadge status={lastRun.status} />
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">No runs yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, department, designation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select
                  value={selectedLocation}
                  onValueChange={setSelectedLocation}
                >
                  <SelectTrigger className="w-full md:w-[200px]">
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
              </div>
            </CardContent>
          </Card>

          {/* Employees List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-coffee-700 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Employees ({filteredEmployees.length})
              </h2>
              <Link href="/admin/payroll/employees">
                <Button variant="link" size="sm">
                  View All
                </Button>
              </Link>
            </div>

            {filteredEmployees.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {searchQuery || selectedLocation !== "ALL"
                      ? "No employees match your filters"
                      : "No employee profiles yet. Add your first employee to get started."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredEmployees.slice(0, 6).map((emp) => (
                  <Card
                    key={emp.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() =>
                      router.push(`/admin/payroll/employees?highlight=${emp.id}`)
                    }
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-coffee-700 truncate">
                            {emp.user.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {emp.department}
                            {emp.designation && ` — ${emp.designation}`}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {emp.location.name} | {emp.payType}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-lg font-bold text-coffee-700">
                            {formatCurrency(emp.baseSalary)}
                          </p>
                          <p className="text-xs text-gray-400">
                            /{emp.payType === "MONTHLY" ? "mo" : "day"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Recent Payroll Runs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-coffee-700 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Payroll Runs
              </h2>
              <Link href="/admin/payroll/runs">
                <Button variant="link" size="sm">
                  View All
                </Button>
              </Link>
            </div>

            {recentRuns.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No payroll runs yet. Create your first payroll run.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {recentRuns.map((run) => (
                  <Card
                    key={run.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() =>
                      router.push(`/admin/payroll/runs/${run.id}`)
                    }
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-coffee-700">
                              {run.periodLabel}
                            </h3>
                            <PayrollStatusBadge status={run.status} />
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {run.location?.name || "All Locations"} |{" "}
                            {run._count.records} employees | By{" "}
                            {run.processedBy.name}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-lg font-bold text-green-700">
                            {formatCurrency(run.totalNet)}
                          </p>
                          <p className="text-xs text-gray-400">Net Pay</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
