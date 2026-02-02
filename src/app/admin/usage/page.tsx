"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface UsageData {
  usage: {
    databaseStorageMB: number;
    bandwidthGB: number;
    ordersCount: number;
    staffCount: number;
    menuItemsCount: number;
    tablesCount: number;
  };
  limits: {
    databaseStorageMB: number;
    bandwidthGB: number;
    ordersPerMonth: number;
    staffAccounts: number;
  };
  usagePercentages: {
    databaseStorage: number;
    bandwidth: number;
    orders: number;
    staff: number;
  };
}

interface Alert {
  id: string;
  resource: string;
  level: "WARNING" | "CRITICAL" | "EXCEEDED";
  percentage: number;
  current: number;
  limit: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function UsageDashboardPage() {
  const params = useParams();
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsageData();
    fetchAlerts();
  }, []);

  const fetchUsageData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/tenant/usage");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch usage data");
      }

      setUsageData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await fetch("/api/tenant/usage-alerts");
      const data = await response.json();

      if (response.ok) {
        setAlerts(data.alerts || []);
      }
    } catch (err: any) {
      console.error("Failed to fetch alerts:", err);
    }
  };

  const markAlertAsRead = async (alertId?: string) => {
    try {
      await fetch("/api/tenant/usage-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "mark-read",
          alertId,
        }),
      });

      fetchAlerts();
    } catch (err: any) {
      console.error("Failed to mark alert as read:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading usage data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error loading usage data:</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!usageData) {
    return null;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Usage Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Monitor your resource usage and stay within limits to avoid overage charges
        </p>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Active Alerts</h2>
            <button
              onClick={() => markAlertAsRead()}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Mark all as read
            </button>
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${
                  alert.level === "EXCEEDED"
                    ? "bg-red-50 border-red-200"
                    : alert.level === "CRITICAL"
                    ? "bg-orange-50 border-orange-200"
                    : "bg-yellow-50 border-yellow-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded mr-3 ${
                          alert.level === "EXCEEDED"
                            ? "bg-red-200 text-red-800"
                            : alert.level === "CRITICAL"
                            ? "bg-orange-200 text-orange-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}
                      >
                        {alert.level}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {alert.resource.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">{alert.message}</p>
                  </div>
                  {!alert.isRead && (
                    <button
                      onClick={() => markAlertAsRead(alert.id)}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Usage Meters */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <UsageMeter
          title="Database Storage"
          current={usageData.usage.databaseStorageMB}
          limit={usageData.limits.databaseStorageMB}
          unit="MB"
          percentage={usageData.usagePercentages.databaseStorage}
        />
        <UsageMeter
          title="Bandwidth"
          current={usageData.usage.bandwidthGB}
          limit={usageData.limits.bandwidthGB}
          unit="GB"
          percentage={usageData.usagePercentages.bandwidth}
        />
        <UsageMeter
          title="Orders This Month"
          current={usageData.usage.ordersCount}
          limit={usageData.limits.ordersPerMonth}
          unit="orders"
          percentage={usageData.usagePercentages.orders}
        />
        <UsageMeter
          title="Staff Accounts"
          current={usageData.usage.staffCount}
          limit={usageData.limits.staffAccounts}
          unit="users"
          percentage={usageData.usagePercentages.staff}
        />
      </div>

      {/* Additional Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Resources</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Menu Items:</span>
              <span className="font-semibold text-gray-900">{usageData.usage.menuItemsCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tables:</span>
              <span className="font-semibold text-gray-900">{usageData.usage.tablesCount}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            These resources have no limits - use as many as you need!
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-white rounded-lg shadow p-6 border border-amber-200">
          <h3 className="text-lg font-semibold text-amber-900 mb-2">Need More Resources?</h3>
          <p className="text-sm text-gray-700 mb-4">
            If you consistently exceed base limits, your bill will include overage charges. This is normal for growing cafes!
          </p>
          <a
            href="/admin/billing"
            className="inline-block bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 text-sm font-medium"
          >
            View Billing Details
          </a>
        </div>
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

  const bgColorClasses = {
    green: "bg-green-50",
    yellow: "bg-yellow-50",
    orange: "bg-orange-50",
    red: "bg-red-50",
  };

  const borderColorClasses = {
    green: "border-green-200",
    yellow: "border-yellow-200",
    orange: "border-orange-200",
    red: "border-red-200",
  };

  return (
    <div className={`bg-white rounded-lg shadow p-6 border ${borderColorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <span className="text-2xl font-bold text-gray-900">
          {Math.round(percentage)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
        <div
          className={`h-4 rounded-full transition-all ${colorClasses[color]}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">
          {current.toFixed(1)} / {limit} {unit}
        </span>
        {percentage >= 80 && (
          <span className={`text-xs font-semibold ${
            color === "red" ? "text-red-600" :
            color === "orange" ? "text-orange-600" :
            "text-yellow-600"
          }`}>
            {percentage >= 100 ? "Limit exceeded!" : "Approaching limit"}
          </span>
        )}
      </div>
    </div>
  );
}
