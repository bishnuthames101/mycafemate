"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface TenantActionsProps {
  tenantId: string;
  currentStatus: string;
}

export default function TenantActions({ tenantId, currentStatus }: TenantActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuspend = async () => {
    if (!confirm("Are you sure you want to suspend this tenant? They will lose access immediately.")) {
      return;
    }

    const reason = prompt("Reason for suspension:");
    if (!reason) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/super-admin/tenants/${tenantId}/suspend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to suspend tenant");
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReactivate = async () => {
    if (!confirm("Reactivate this tenant? They will regain full access.")) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/super-admin/tenants/${tenantId}/reactivate`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to reactivate tenant");
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isSuspended = currentStatus === "SUSPENDED" || currentStatus === "TRIAL_EXPIRED";

  return (
    <div className="space-y-2">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        {isSuspended ? (
          <button
            onClick={handleReactivate}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium disabled:bg-gray-400"
          >
            {loading ? "Processing..." : "✅ Reactivate"}
          </button>
        ) : (
          <button
            onClick={handleSuspend}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium disabled:bg-gray-400"
          >
            {loading ? "Processing..." : "🚫 Suspend"}
          </button>
        )}
      </div>
    </div>
  );
}
