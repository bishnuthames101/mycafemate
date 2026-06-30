"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Wallet } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
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

export default function AdminPayrollRunsPage() {
  const router = useRouter();
  const { runs, isLoading: runsLoading, mutate } = usePayrollRuns();
  const { data: locations, isLoading: locLoading } =
    useSWR<Location[]>("/api/locations");

  const currentYear = String(new Date().getFullYear());
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [selectedLocation, setSelectedLocation] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [showRunDialog, setShowRunDialog] = useState(false);

  const years = useMemo(() => {
    const yrs = new Set(runs.map((r) => r.periodLabel.split("-")[0]));
    return Array.from(yrs).sort().reverse();
  }, [runs]);

  const filteredRuns = useMemo(() => {
    let filtered = runs;
    if (selectedYear !== "ALL") {
      filtered = filtered.filter((r) =>
        r.periodLabel.startsWith(selectedYear)
      );
    }
    if (selectedLocation !== "ALL") {
      filtered = filtered.filter((r) => r.locationId === selectedLocation);
    }
    if (selectedStatus !== "ALL") {
      filtered = filtered.filter((r) => r.status === selectedStatus);
    }
    return filtered;
  }, [runs, selectedYear, selectedLocation, selectedStatus]);

  if (runsLoading || locLoading) {
    return <AdminListSkeleton />;
  }

  const locationsList = locations ?? [];

  // Stats
  const totalPaid = filteredRuns
    .filter((r) => r.status === "PAID")
    .reduce((sum, r) => sum + r.totalNet, 0);
  const draftCount = filteredRuns.filter((r) => r.status === "DRAFT").length;
  const processedCount = filteredRuns.filter(
    (r) => r.status === "PROCESSED"
  ).length;

  return (
    <>
      <PayrollRunDialog
        open={showRunDialog}
        onOpenChange={setShowRunDialog}
        onSuccess={() => {
          setShowRunDialog(false);
          mutate();
        }}
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
                  Payroll Runs
                </h1>
                <p className="text-sm md:text-base text-coffee-600 mt-1">
                  View and manage monthly payroll processing
                </p>
              </div>
            </div>
            <Button onClick={() => setShowRunDialog(true)}>
              <Play className="h-4 w-4 mr-2" />
              New Payroll Run
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Runs</p>
                  <p className="text-2xl font-bold text-coffee-700">
                    {filteredRuns.length}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Paid</p>
                  <p className="text-2xl font-bold text-green-700">
                    {formatCurrency(totalPaid)}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Drafts</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {draftCount}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Pending Payment
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {processedCount}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-full md:w-[150px]">
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Years</SelectItem>
                    {years.map((yr) => (
                      <SelectItem key={yr} value={yr}>
                        {yr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-full md:w-[150px]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PROCESSED">Processed</SelectItem>
                    <SelectItem value="PAID">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Runs List */}
          {filteredRuns.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No payroll runs found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredRuns.map((run) => (
                <Card
                  key={run.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => router.push(`/admin/payroll/runs/${run.id}`)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-lg text-coffee-700">
                            {run.periodLabel}
                          </h3>
                          <PayrollStatusBadge status={run.status} />
                        </div>
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          <p>
                            Location:{" "}
                            {run.location?.name || "All Locations"}
                          </p>
                          <p>
                            Employees: {run._count.records} | Processed by:{" "}
                            {run.processedBy.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            Created:{" "}
                            {new Date(run.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm text-gray-500">
                          Gross: {formatCurrency(run.totalGross)}
                        </p>
                        <p className="text-sm text-red-500">
                          Deductions: -{formatCurrency(run.totalDeductions)}
                        </p>
                        <p className="text-xl font-bold text-green-700 mt-1">
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
    </>
  );
}
