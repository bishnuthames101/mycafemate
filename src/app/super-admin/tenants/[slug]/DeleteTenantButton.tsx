"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Tenant {
  id: string;
  slug: string;
  businessName: string;
}

export default function DeleteTenantButton({ tenant }: { tenant: Tenant }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmSlug, setConfirmSlug] = useState("");
  const [hardDelete, setHardDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (confirmSlug !== tenant.slug) {
      setError("Slug confirmation does not match");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/super-admin/tenants/${tenant.slug}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmSlug, hardDelete }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete tenant");
      }

      // Redirect to tenants list
      router.push("/super-admin/tenants");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
      >
        Delete Tenant
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div
              className="fixed inset-0 bg-black bg-opacity-30"
              onClick={() => setIsOpen(false)}
            ></div>

            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 z-10">
              <h3 className="text-lg font-semibold text-red-600 mb-4">
                Delete Tenant
              </h3>

              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded p-4">
                  <p className="text-sm text-red-800 font-medium">
                    WARNING: This action cannot be undone!
                  </p>
                  <p className="text-xs text-red-700 mt-2">
                    {hardDelete
                      ? "This will permanently delete the tenant's database and all data."
                      : "This will mark the tenant as CANCELLED (soft delete). Database will be preserved."}
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="confirmSlug"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Type <strong>{tenant.slug}</strong> to confirm:
                  </label>
                  <input
                    id="confirmSlug"
                    type="text"
                    value={confirmSlug}
                    onChange={(e) => setConfirmSlug(e.target.value)}
                    placeholder={tenant.slug}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hardDelete"
                    checked={hardDelete}
                    onChange={(e) => setHardDelete(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="hardDelete" className="text-sm text-gray-700">
                    Permanently delete database (hard delete)
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setConfirmSlug("");
                      setHardDelete(false);
                      setError(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={loading || confirmSlug !== tenant.slug}
                    className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:bg-gray-400"
                  >
                    {loading ? "Deleting..." : "Delete Tenant"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
