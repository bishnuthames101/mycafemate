import { getMasterPrisma } from "@/lib/prisma-multi-tenant";
import Link from "next/link";

export default async function TenantsPage() {
  const masterPrisma = getMasterPrisma();

  const tenants = await masterPrisma.tenant.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      businessName: true,
      contactEmail: true,
      contactPhone: true,
      subscriptionStatus: true,
      subscriptionTier: true,
      status: true,
      trialEndsAt: true,
      nextPaymentDue: true,
      monthlyFee: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Tenants</h1>
          <p className="mt-1 text-sm sm:text-base text-gray-600">
            Manage all cafe subscriptions and accounts
          </p>
        </div>

        <Link
          href="/super-admin/tenants/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-center whitespace-nowrap"
        >
          + Add New Tenant
        </Link>
      </div>

      {/* Tenants Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trial/Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tenants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <p className="text-lg font-medium">No tenants yet</p>
                      <p className="mt-2 text-sm">
                        Create your first tenant to get started
                      </p>
                      <Link
                        href="/super-admin/tenants/new"
                        className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
                      >
                        Add First Tenant
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                tenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {tenant.businessName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {tenant.slug}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {tenant.contactEmail}
                      </div>
                      {tenant.contactPhone && (
                        <div className="text-sm text-gray-500">
                          {tenant.contactPhone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {tenant.subscriptionTier}
                      </div>
                      <div className="text-xs text-gray-500">
                        NPR {tenant.monthlyFee.toLocaleString()}/mo
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <StatusBadge status={tenant.status} />
                        <SubscriptionBadge status={tenant.subscriptionStatus} />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {tenant.subscriptionStatus === "TRIAL" && tenant.trialEndsAt ? (
                        <div>
                          <div className="text-xs text-gray-500">Trial ends</div>
                          <div>{new Date(tenant.trialEndsAt).toLocaleDateString()}</div>
                        </div>
                      ) : tenant.nextPaymentDue ? (
                        <div>
                          <div className="text-xs text-gray-500">Next payment</div>
                          <div>{new Date(tenant.nextPaymentDue).toLocaleDateString()}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        href={`/super-admin/tenants/${tenant.slug}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile & Tablet Card View */}
        <div className="lg:hidden divide-y divide-gray-200">
          {tenants.length === 0 ? (
            <div className="px-4 py-12 text-center text-gray-500">
              <p className="text-lg font-medium">No tenants yet</p>
              <p className="mt-2 text-sm">
                Create your first tenant to get started
              </p>
              <Link
                href="/super-admin/tenants/new"
                className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
              >
                Add First Tenant
              </Link>
            </div>
          ) : (
            tenants.map((tenant) => (
              <div key={tenant.id} className="px-4 py-4 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {tenant.businessName}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{tenant.slug}</div>
                  </div>
                  <Link
                    href={`/super-admin/tenants/${tenant.slug}`}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap"
                  >
                    Manage
                  </Link>
                </div>

                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={tenant.status} />
                  <SubscriptionBadge status={tenant.subscriptionStatus} />
                </div>

                <div className="text-xs text-gray-600 space-y-1">
                  <div>
                    <span className="font-medium">Plan:</span> {tenant.subscriptionTier} - NPR {tenant.monthlyFee.toLocaleString()}/mo
                  </div>
                  <div>
                    <span className="font-medium">Contact:</span> {tenant.contactEmail}
                  </div>
                  {tenant.contactPhone && (
                    <div>
                      <span className="font-medium">Phone:</span> {tenant.contactPhone}
                    </div>
                  )}
                  {tenant.subscriptionStatus === "TRIAL" && tenant.trialEndsAt ? (
                    <div>
                      <span className="font-medium">Trial ends:</span>{" "}
                      {new Date(tenant.trialEndsAt).toLocaleDateString()}
                    </div>
                  ) : tenant.nextPaymentDue ? (
                    <div>
                      <span className="font-medium">Next payment:</span>{" "}
                      {new Date(tenant.nextPaymentDue).toLocaleDateString()}
                    </div>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    ACTIVE: "bg-green-100 text-green-800",
    SUSPENDED: "bg-red-100 text-red-800",
    PROVISIONING: "bg-yellow-100 text-yellow-800",
    DELETED: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${
        colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
}

function SubscriptionBadge({ status }: { status: string }) {
  const colors = {
    TRIAL: "bg-blue-100 text-blue-800",
    ACTIVE: "bg-green-100 text-green-800",
    EXPIRED: "bg-red-100 text-red-800",
    PAYMENT_DUE: "bg-orange-100 text-orange-800",
    CANCELLED: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${
        colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
}
