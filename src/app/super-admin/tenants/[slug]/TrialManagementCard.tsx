"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Tenant {
  id: string;
  slug: string;
  trialEndsAt: Date | null;
  subscriptionStatus: string;
}

export default function TrialManagementCard({ tenant }: { tenant: Tenant }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExtendTrial = async (days: number) => {
    if (!confirm(`Extend trial by ${days} days?`)) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/super-admin/tenants/${tenant.slug}/trial`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "extend", days }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to extend trial");
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEndTrial = async () => {
    if (
      !confirm("End trial early? Tenant will need to pay to reactivate.")
    )
      return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/super-admin/tenants/${tenant.slug}/trial`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "end" }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to end trial");
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Trial Management
      </h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">Extend Trial Period:</p>
          <div className="flex gap-2">
            <button
              onClick={() => handleExtendTrial(7)}
              disabled={loading}
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200 disabled:bg-gray-200 text-sm font-medium"
            >
              +7 Days
            </button>
            <button
              onClick={() => handleExtendTrial(14)}
              disabled={loading}
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200 disabled:bg-gray-200 text-sm font-medium"
            >
              +14 Days
            </button>
            <button
              onClick={() => handleExtendTrial(30)}
              disabled={loading}
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200 disabled:bg-gray-200 text-sm font-medium"
            >
              +30 Days
            </button>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm text-gray-600 mb-2">End Trial Early:</p>
          <button
            onClick={handleEndTrial}
            disabled={loading}
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:bg-gray-400 text-sm font-medium"
          >
            Stop Trial & Require Payment
          </button>
          <p className="text-xs text-gray-500 mt-2">
            This will change status to TRIAL_EXPIRED and require payment to
            reactivate.
          </p>
        </div>
      </div>
    </div>
  );
}
