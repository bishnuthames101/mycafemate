import { getMasterPrisma } from "@/lib/prisma-multi-tenant";
import Link from "next/link";

export default async function SuperAdminDashboard() {
  const masterPrisma = getMasterPrisma();

  // Fetch tenant statistics
  const [
    totalTenants,
    activeTenants,
    trialTenants,
    suspendedTenants,
    recentTenants,
    totalRevenue,
  ] = await Promise.all([
    masterPrisma.tenant.count(),
    masterPrisma.tenant.count({ where: { status: "ACTIVE", subscriptionStatus: "ACTIVE" } }),
    masterPrisma.tenant.count({ where: { subscriptionStatus: "TRIAL" } }),
    masterPrisma.tenant.count({ where: { status: "SUSPENDED" } }),
    masterPrisma.tenant.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        businessName: true,
        subscriptionStatus: true,
        status: true,
        createdAt: true,
      },
    }),
    masterPrisma.paymentRecord.aggregate({
      _sum: { amount: true },
    }),
  ]);

  const stats = [
    {
      name: "Total Tenants",
      value: totalTenants,
      description: "All registered cafes",
      color: "bg-blue-500",
    },
    {
      name: "Active Subscriptions",
      value: activeTenants,
      description: "Paying customers",
      color: "bg-green-500",
    },
    {
      name: "On Trial",
      value: trialTenants,
      description: "Free trial period",
      color: "bg-yellow-500",
    },
    {
      name: "Suspended",
      value: suspendedTenants,
      description: "Inactive accounts",
      color: "bg-red-500",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm sm:text-base text-gray-600">
            Overview of all cafe tenants and subscriptions
          </p>
        </div>

        <Link
          href="/super-admin/tenants/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-center whitespace-nowrap"
        >
          + Add New Tenant
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-lg shadow p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-gray-500">{stat.description}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Card */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Total Revenue
        </h2>
        <p className="text-4xl font-bold text-green-600">
          NPR {(totalRevenue._sum.amount || 0).toLocaleString()}
        </p>
        <p className="text-sm text-gray-600 mt-2">
          All-time payments collected
        </p>
      </div>

      {/* Recent Tenants */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            Recent Tenants
          </h2>
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentTenants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No tenants yet. Create your first tenant to get started.
                  </td>
                </tr>
              ) : (
                recentTenants.map((tenant) => (
                  <tr key={tenant.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {tenant.businessName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{tenant.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={tenant.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <SubscriptionBadge status={tenant.subscriptionStatus} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(tenant.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        href={`/super-admin/tenants/${tenant.slug}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden divide-y divide-gray-200">
          {recentTenants.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              No tenants yet. Create your first tenant to get started.
            </div>
          ) : (
            recentTenants.map((tenant) => (
              <div key={tenant.id} className="px-4 py-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {tenant.businessName}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{tenant.slug}</div>
                  </div>
                  <Link
                    href={`/super-admin/tenants/${tenant.slug}`}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View
                  </Link>
                </div>
                <div className="flex gap-2">
                  <StatusBadge status={tenant.status} />
                  <SubscriptionBadge status={tenant.subscriptionStatus} />
                </div>
                <div className="text-xs text-gray-600">
                  Created: {new Date(tenant.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>

        {recentTenants.length > 0 && (
          <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
            <Link
              href="/super-admin/tenants"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View all tenants →
            </Link>
          </div>
        )}
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
