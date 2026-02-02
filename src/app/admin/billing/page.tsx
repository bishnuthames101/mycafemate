"use client";

import { useState, useEffect } from "react";

interface BillingData {
  billing: {
    tenantId: string;
    tenantSlug: string;
    billingPeriod: {
      start: string;
      end: string;
    };
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
      overageCharges: {
        databaseStorage: number;
        bandwidth: number;
        orders: number;
        staff: number;
        prioritySupport: number;
      };
      totalOverage: number;
      totalBill: number;
    };
    usagePercentages: {
      databaseStorage: number;
      bandwidth: number;
      orders: number;
      staff: number;
    };
  };
}

export default function BillingPage() {
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/tenant/billing");
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading billing data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error loading billing data:</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!billingData) {
    return null;
  }

  const { billing } = billingData;
  const hasOverages = billing.charges.totalOverage > 0;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Billing Overview</h1>
        <p className="text-gray-600 mt-2">
          Current month billing period:{" "}
          {new Date(billing.billingPeriod.start).toLocaleDateString()} -{" "}
          {new Date(billing.billingPeriod.end).toLocaleDateString()}
        </p>
      </div>

      {/* Total Bill Summary */}
      <div className="bg-gradient-to-br from-amber-700 to-amber-900 text-white rounded-lg shadow-xl p-8 mb-8">
        <div className="text-center">
          <p className="text-amber-200 text-sm font-medium mb-2">PROJECTED MONTHLY BILL</p>
          <p className="text-5xl font-bold mb-2">NPR {billing.charges.totalBill.toLocaleString()}</p>
          {hasOverages && (
            <p className="text-amber-200 text-sm">
              Base: NPR {billing.charges.baseCharge.toLocaleString()} + Overages: NPR{" "}
              {billing.charges.totalOverage.toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* Billing Breakdown */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing Breakdown</h2>

        <div className="space-y-4">
          {/* Base Charge */}
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <div>
              <p className="font-medium text-gray-900">Base Monthly Fee</p>
              <p className="text-sm text-gray-600">Includes base usage limits</p>
            </div>
            <p className="text-xl font-semibold text-gray-900">
              NPR {billing.charges.baseCharge.toLocaleString()}
            </p>
          </div>

          {/* Overage Charges */}
          {billing.charges.overageCharges.databaseStorage > 0 && (
            <OverageRow
              title="Database Storage Overage"
              description={`${(billing.usage.databaseStorageMB - billing.limits.databaseStorageMB).toFixed(1)} MB over limit`}
              amount={billing.charges.overageCharges.databaseStorage}
            />
          )}

          {billing.charges.overageCharges.bandwidth > 0 && (
            <OverageRow
              title="Bandwidth Overage"
              description={`${(billing.usage.bandwidthGB - billing.limits.bandwidthGB).toFixed(1)} GB over limit`}
              amount={billing.charges.overageCharges.bandwidth}
            />
          )}

          {billing.charges.overageCharges.orders > 0 && (
            <OverageRow
              title="Orders Overage"
              description={`${billing.usage.ordersCount - billing.limits.ordersPerMonth} orders over limit`}
              amount={billing.charges.overageCharges.orders}
            />
          )}

          {billing.charges.overageCharges.staff > 0 && (
            <OverageRow
              title="Extra Staff Accounts"
              description={`${billing.usage.staffCount - billing.limits.staffAccounts} additional users`}
              amount={billing.charges.overageCharges.staff}
            />
          )}

          {billing.charges.overageCharges.prioritySupport > 0 && (
            <OverageRow
              title="Priority Support"
              description="24hr response time"
              amount={billing.charges.overageCharges.prioritySupport}
            />
          )}

          {/* Total */}
          <div className="flex justify-between items-center py-4 border-t-2 border-gray-300 mt-4">
            <p className="text-lg font-bold text-gray-900">Total Bill</p>
            <p className="text-2xl font-bold text-amber-900">
              NPR {billing.charges.totalBill.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Usage Summary */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Usage Summary</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <UsageSummaryRow
            title="Database Storage"
            current={billing.usage.databaseStorageMB}
            limit={billing.limits.databaseStorageMB}
            unit="MB"
            percentage={billing.usagePercentages.databaseStorage}
          />
          <UsageSummaryRow
            title="Bandwidth"
            current={billing.usage.bandwidthGB}
            limit={billing.limits.bandwidthGB}
            unit="GB"
            percentage={billing.usagePercentages.bandwidth}
          />
          <UsageSummaryRow
            title="Orders"
            current={billing.usage.ordersCount}
            limit={billing.limits.ordersPerMonth}
            unit="orders"
            percentage={billing.usagePercentages.orders}
          />
          <UsageSummaryRow
            title="Staff Accounts"
            current={billing.usage.staffCount}
            limit={billing.limits.staffAccounts}
            unit="users"
            percentage={billing.usagePercentages.staff}
          />
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">About Usage-Based Pricing</h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• Base fee of NPR 1,200/month includes generous usage limits</li>
          <li>• Overage charges apply only if you exceed base limits</li>
          <li>• This projected bill is based on current month usage so far</li>
          <li>• Final bill calculated at end of billing cycle</li>
          <li>• Monitor usage dashboard to stay within limits</li>
        </ul>
      </div>
    </div>
  );
}

function OverageRow({
  title,
  description,
  amount,
}: {
  title: string;
  description: string;
  amount: number;
}) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-100">
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <p className="text-lg font-semibold text-red-600">
        +NPR {amount.toLocaleString()}
      </p>
    </div>
  );
}

function UsageSummaryRow({
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
  const isOverLimit = percentage > 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-700">{title}</p>
        <span className={`text-sm font-semibold ${isOverLimit ? "text-red-600" : "text-gray-900"}`}>
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full ${
            isOverLimit ? "bg-red-500" : percentage >= 90 ? "bg-orange-500" : "bg-green-500"
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-600">
        {current.toFixed(1)} / {limit} {unit}
        {isOverLimit && (
          <span className="text-red-600 font-semibold ml-2">({(current - limit).toFixed(1)} over)</span>
        )}
      </p>
    </div>
  );
}
