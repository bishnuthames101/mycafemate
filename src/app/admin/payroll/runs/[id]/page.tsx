"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import useSWR from "swr";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Trash2, CreditCard, Edit } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { PayrollStatusBadge } from "@/components/payroll/payroll-status-badge";
import { AdminListSkeleton } from "@/components/skeletons/page-skeletons";
import dynamic from "next/dynamic";

const PayrollRecordEditDialog = dynamic(
  () =>
    import("@/components/payroll/payroll-record-edit-dialog").then(
      (m) => m.PayrollRecordEditDialog
    ),
  { ssr: false }
);

export default function AdminPayrollRunDetailPage() {
  const router = useRouter();
  const params = useParams();
  const runId = params.id as string;

  const { data: run, isLoading, mutate } = useSWR(
    `/api/payroll/runs/${runId}`
  );

  const [editRecord, setEditRecord] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const handleStatusTransition = async (newStatus: "PROCESSED" | "PAID") => {
    const confirmMsg =
      newStatus === "PROCESSED"
        ? "Process this payroll run? Records will be locked for editing."
        : "Mark this payroll as paid?";

    if (!confirm(confirmMsg)) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/payroll/runs/${runId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        mutate();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to update status");
      }
    } catch {
      alert("An error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Delete this draft payroll run? All records will be permanently removed."
      )
    )
      return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/payroll/runs/${runId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/admin/payroll/runs");
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to delete run");
      }
    } catch {
      alert("An error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return <AdminListSkeleton />;
  }

  if (!run) {
    return (
      <div className="min-h-screen bg-cream-50 p-8 flex items-center justify-center">
        <p className="text-gray-500">Payroll run not found</p>
      </div>
    );
  }

  const records = run.records || [];

  return (
    <>
      <PayrollRecordEditDialog
        open={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open);
          if (!open) setEditRecord(null);
        }}
        onSuccess={() => {
          setShowEditDialog(false);
          setEditRecord(null);
          mutate();
        }}
        record={editRecord}
        runId={runId}
      />

      <div className="min-h-screen bg-cream-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Link href="/admin/payroll/runs">
                <Button variant="outline" size="icon" className="shrink-0">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl md:text-4xl font-bold text-coffee-700">
                    Payroll — {run.periodLabel}
                  </h1>
                  <PayrollStatusBadge status={run.status} />
                </div>
                <p className="text-sm text-coffee-600 mt-1">
                  {run.location?.name || "All Locations"} | Processed by{" "}
                  {run.processedBy?.name} |{" "}
                  {new Date(run.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {run.status === "DRAFT" && (
                <>
                  <Button
                    onClick={() => handleStatusTransition("PROCESSED")}
                    disabled={actionLoading}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {actionLoading ? "Processing..." : "Process Payroll"}
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 hover:bg-red-50"
                    onClick={handleDelete}
                    disabled={actionLoading}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Draft
                  </Button>
                </>
              )}
              {run.status === "PROCESSED" && (
                <Button
                  onClick={() => handleStatusTransition("PAID")}
                  disabled={actionLoading}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {actionLoading ? "Updating..." : "Mark as Paid"}
                </Button>
              )}
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Employees</p>
                  <p className="text-2xl font-bold text-coffee-700">
                    {records.length}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Gross</p>
                  <p className="text-2xl font-bold text-coffee-700">
                    {formatCurrency(run.totalGross)}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Deductions</p>
                  <p className="text-2xl font-bold text-red-600">
                    -{formatCurrency(run.totalDeductions)}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Net Pay</p>
                  <p className="text-2xl font-bold text-green-700">
                    {formatCurrency(run.totalNet)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {run.notes && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600">
                  <strong>Notes:</strong> {run.notes}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Records Table */}
          <div>
            <h2 className="text-lg font-semibold text-coffee-700 mb-4">
              Pay Records
            </h2>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-coffee-50">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium text-coffee-700">
                      Employee
                    </th>
                    <th className="text-right p-3 text-sm font-medium text-coffee-700">
                      Base
                    </th>
                    <th className="text-right p-3 text-sm font-medium text-coffee-700">
                      Earnings
                    </th>
                    <th className="text-right p-3 text-sm font-medium text-coffee-700">
                      Gross
                    </th>
                    <th className="text-right p-3 text-sm font-medium text-coffee-700">
                      Deductions
                    </th>
                    <th className="text-right p-3 text-sm font-medium text-coffee-700">
                      Net Pay
                    </th>
                    {run.status === "DRAFT" && (
                      <th className="text-center p-3 text-sm font-medium text-coffee-700">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {records.map((rec: any) => {
                    const extras = rec.overtime + rec.bonus + rec.allowance;
                    return (
                      <tr
                        key={rec.id}
                        className="border-t border-gray-100 hover:bg-gray-50"
                      >
                        <td className="p-3">
                          <p className="font-medium text-coffee-700">
                            {rec.employeeProfile?.user?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {rec.employeeProfile?.department}
                            {rec.employeeProfile?.designation &&
                              ` — ${rec.employeeProfile.designation}`}
                          </p>
                        </td>
                        <td className="p-3 text-right text-sm">
                          {formatCurrency(rec.baseSalary)}
                          {rec.daysWorked != null && (
                            <span className="text-xs text-gray-400 block">
                              {rec.daysWorked} days
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right text-sm text-green-700">
                          {extras > 0 ? `+${formatCurrency(extras)}` : "—"}
                        </td>
                        <td className="p-3 text-right text-sm font-medium">
                          {formatCurrency(rec.grossPay)}
                        </td>
                        <td className="p-3 text-right text-sm text-red-600">
                          {rec.totalDeductions > 0
                            ? `-${formatCurrency(rec.totalDeductions)}`
                            : "—"}
                        </td>
                        <td className="p-3 text-right text-sm font-bold text-green-700">
                          {formatCurrency(rec.netPay)}
                        </td>
                        {run.status === "DRAFT" && (
                          <td className="p-3 text-center">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditRecord(rec);
                                setShowEditDialog(true);
                              }}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden grid gap-3">
              {records.map((rec: any) => {
                const extras = rec.overtime + rec.bonus + rec.allowance;
                return (
                  <Card key={rec.id}>
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-coffee-700">
                            {rec.employeeProfile?.user?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {rec.employeeProfile?.department}
                          </p>
                        </div>
                        <p className="text-lg font-bold text-green-700">
                          {formatCurrency(rec.netPay)}
                        </p>
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-600">
                        <div>
                          Base: {formatCurrency(rec.baseSalary)}
                        </div>
                        <div className="text-green-700">
                          +{formatCurrency(extras)}
                        </div>
                        <div className="text-red-600">
                          -{formatCurrency(rec.totalDeductions)}
                        </div>
                      </div>
                      {run.status === "DRAFT" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2 w-full"
                          onClick={() => {
                            setEditRecord(rec);
                            setShowEditDialog(true);
                          }}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit Record
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
