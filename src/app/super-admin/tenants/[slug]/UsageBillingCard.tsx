"use client";

import { useState, useEffect } from "react";
import { USAGE_LIMITS } from "@/lib/constants/usage-limits";

interface UsageBillingProps {
  tenantSlug: string;
  monthlyFee: number;
}

interface BillingData {
  billing: {
    usage: {
      databaseStorageMB: number;
      bandwidthGB: number;
      ordersCount: number;
      staffCount: number;
    };
    limits: {
      databaseStorageMB: number;
      bandwidthGB: number;
      ordersPerMonth: number;
      staffAccounts: number;
    };
    charges: {
      baseCharge: number;
      totalOverage: number;
      totalBill: number;
      overageCharges: {
        databaseStorage: number;
        bandwidth: number;
        orders: number;
        staff: number;
        prioritySupport: number;
      };
    };
    usagePercentages: {
      databaseStorage: number;
      bandwidth: number;
      orders: number;
      staff: number;
    };
  };
}

export default function UsageBillingCard({ tenantSlug, monthlyFee }: UsageBillingProps) {
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBillingData();
  }, [tenantSlug]);

  const fetchBillingData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/super-admin/tenants/${tenantSlug}/billing`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch billing data");
      }

      setBillingData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h3 className="text-sm font-medium text-gray-600 mb-3">Usage & Billing</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-900"></div>
        </div>
      </div>
    );
  }

  if (error || !billingData) {
    return (
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h3 className="text-sm font-medium text-gray-600 mb-3">Usage & Billing</h3>
        <p className="text-sm text-red-600">Unable to load billing data</p>
      </div>
    );
  }

  const { billing } = billingData;
  const hasOverages = billing.charges.totalOverage > 0;

  return (
    <div className="col-span-full bg-white rounded-lg shadow border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Usage & Billing (Current Month)</h3>
          <div className="text-right">
            <p className="text-sm text-gray-600">Projected Bill</p>
            <p className="text-2xl font-bold text-amber-900">
              NPR {billing.charges.totalBill.toLocaleString()}
            </p>
            {hasOverages && (
              <p className="text-xs text-red-600">
                +NPR {billing.charges.totalOverage.toLocaleString()} overage
              </p>
            )}
          </div>
        </div>

        {/* Usage Meters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <UsageMeter
            title="Storage"
            current={billing.usage.databaseStorageMB}
            limit={billing.limits.databaseStorageMB}
            unit="MB"
            percentage={billing.usagePercentages.databaseStorage}
          />
          <UsageMeter
            title="Bandwidth"
            current={billing.usage.bandwidthGB}
            limit={billing.limits.bandwidthGB}
            unit="GB"
            percentage={billing.usagePercentages.bandwidth}
          />
          <UsageMeter
            title="Orders"
            current={billing.usage.ordersCount}
            limit={billing.limits.ordersPerMonth}
            unit=""
            percentage={billing.usagePercentages.orders}
          />
          <UsageMeter
            title="Staff"
            current={billing.usage.staffCount}
            limit={billing.limits.staffAccounts}
            unit=""
            percentage={billing.usagePercentages.staff}
          />
        </div>

        {/* Billing Breakdown */}
        {hasOverages && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-amber-900 mb-3">Overage Charges</h4>
            <div className="space-y-2">
              {billing.charges.overageCharges.databaseStorage > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Database Storage</span>
                  <span className="font-semibold text-red-600">
                    +NPR {billing.charges.overageCharges.databaseStorage}
                  </span>
                </div>
              )}
              {billing.charges.overageCharges.bandwidth > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Bandwidth</span>
                  <span className="font-semibold text-red-600">
                    +NPR {billing.charges.overageCharges.bandwidth}
                  </span>
                </div>
              )}
              {billing.charges.overageCharges.orders > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Orders</span>
                  <span className="font-semibold text-red-600">
                    +NPR {billing.charges.overageCharges.orders}
                  </span>
                </div>
              )}
              {billing.charges.overageCharges.staff > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Extra Staff</span>
                  <span className="font-semibold text-red-600">
                    +NPR {billing.charges.overageCharges.staff}
                  </span>
                </div>
              )}
              {billing.charges.overageCharges.prioritySupport > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Priority Support</span>
                  <span className="font-semibold text-red-600">
                    +NPR {billing.charges.overageCharges.prioritySupport}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {!hasOverages && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800 font-medium">
              ✓ Within base limits - No overage charges
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function UsageMeter({
  title,
  current,
  limit,
  unit,
  percentage,
}: {
  title: string;
  current: number;
  limit: number;
  unit: string;
  percentage: number;
}) {
  const getColor = () => {
    if (percentage >= 100) return "red";
    if (percentage >= 90) return "orange";
    if (percentage >= 80) return "yellow";
    return "green";
  };

  const color = getColor();
  const colorClasses = {
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    orange: "bg-orange-500",
    red: "bg-red-500",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-medium text-gray-700">{title}</p>
        <span className="text-xs font-semibold text-gray-900">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
        <div
          className={`h-2 rounded-full transition-all ${colorClasses[color]}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-600">
        {current.toFixed(0)} / {limit} {unit}
      </p>
    </div>
  );
}
