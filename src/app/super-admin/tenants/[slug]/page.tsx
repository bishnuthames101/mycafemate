import { getMasterPrisma } from "@/lib/prisma-multi-tenant";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTenantPaymentStats, getSubscriptionRenewalInfo } from "@/lib/services/subscription-management";
import { suspendTenant, reactivateTenant } from "@/lib/services/tenant-provisioning";
import TenantActions from "./TenantActions";
import UsageBillingCard from "./UsageBillingCard";
import EditTenantButton from "./EditTenantButton";
import TrialManagementCard from "./TrialManagementCard";
import DeleteTenantButton from "./DeleteTenantButton";
import UserManagementCard from "./UserManagementCard";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function TenantDetailPage({ params }: PageProps) {
  const masterPrisma = getMasterPrisma();

  const tenant = await masterPrisma.tenant.findUnique({
    where: { slug: params.slug },
    include: {
      paymentRecords: {
        orderBy: { paymentDate: "desc" },
        take: 5,
      },
      activityLogs: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!tenant) {
    notFound();
  }

  // Get payment stats
  const paymentStats = await getTenantPaymentStats(tenant.id);
  const renewalInfo = await getSubscriptionRenewalInfo(tenant.id);

  // Calculate trial days remaining
  let trialDaysRemaining: number | null = null;
  if (tenant.subscriptionStatus === "TRIAL" && tenant.trialEndsAt) {
    trialDaysRemaining = Math.ceil(
      (tenant.trialEndsAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <Link
            href="/super-admin/tenants"
            className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-block"
          >
            ← Back to Tenants
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{tenant.businessName}</h1>
          <p className="text-gray-600 mt-1">{tenant.slug}</p>
        </div>

        <div className="flex gap-2">
          <EditTenantButton tenant={tenant} />
          <TenantActions tenantId={tenant.id} currentStatus={tenant.status} />
        </div>
      </div>

      {/* Status Banner */}
      {tenant.status === "SUSPENDED" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">
            ⚠️ This tenant is currently suspended
            {tenant.suspendedAt && ` since ${new Date(tenant.suspendedAt).toLocaleDateString()}`}
          </p>
        </div>
      )}

      {tenant.status === "TRIAL_EXPIRED" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 font-medium">
            ⏰ Trial period expired on {tenant.trialEndsAt?.toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Subscription Status */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Subscription Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Status:</span>
              <SubscriptionBadge status={tenant.subscriptionStatus} />
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tier:</span>
              <span className="text-sm font-medium text-gray-900">{tenant.subscriptionTier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Monthly Fee:</span>
              <span className="text-sm font-medium text-gray-900">
                NPR {tenant.monthlyFee.toLocaleString()}
              </span>
            </div>
            {trialDaysRemaining !== null && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Trial Ends:</span>
                <span className={`text-sm font-medium ${trialDaysRemaining < 3 ? 'text-red-600' : 'text-gray-900'}`}>
                  {trialDaysRemaining > 0 ? `${trialDaysRemaining} days` : 'Expired'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Payment Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Paid:</span>
              <span className="text-sm font-medium text-green-600">
                NPR {paymentStats.totalPaid.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Payments:</span>
              <span className="text-sm font-medium text-gray-900">{paymentStats.paymentCount}</span>
            </div>
            {paymentStats.lastPayment && (
              <>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Payment:</span>
                  <span className="text-sm font-medium text-gray-900">
                    NPR {paymentStats.lastPayment.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Payment Date:</span>
                  <span className="text-sm text-gray-600">
                    {paymentStats.lastPayment.date.toLocaleDateString()}
                  </span>
                </div>
              </>
            )}
            {tenant.nextPaymentDue && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Next Due:</span>
                <span className={`text-sm font-medium ${
                  renewalInfo.isOverdue ? 'text-red-600' : 'text-gray-900'
                }`}>
                  {tenant.nextPaymentDue.toLocaleDateString()}
                  {renewalInfo.isOverdue && ' (Overdue)'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Contact Information</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-600">Contact Name:</span>
              <p className="text-sm font-medium text-gray-900">{tenant.contactName}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Email:</span>
              <p className="text-sm font-medium text-gray-900">{tenant.contactEmail}</p>
            </div>
            {tenant.contactPhone && (
              <div>
                <span className="text-sm text-gray-600">Phone:</span>
                <p className="text-sm font-medium text-gray-900">{tenant.contactPhone}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trial Management (only show if in TRIAL status) */}
      {tenant.subscriptionStatus === "TRIAL" && (
        <TrialManagementCard tenant={tenant} />
      )}

      {/* Usage & Billing */}
      <div className="grid grid-cols-1 gap-6">
        <UsageBillingCard tenantSlug={tenant.slug} monthlyFee={tenant.monthlyFee} />
      </div>

      {/* User Management */}
      <UserManagementCard tenantSlug={tenant.slug} />

      {/* Database Info */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-600">Database Name:</span>
            <p className="text-sm font-mono text-gray-900">{tenant.databaseName}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Database Host:</span>
            <p className="text-sm font-mono text-gray-900">{tenant.databaseHost}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Created:</span>
            <p className="text-sm text-gray-900">{tenant.createdAt.toLocaleDateString()}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Account Status:</span>
            <StatusBadge status={tenant.status} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex gap-4 flex-wrap">
          <Link
            href={`/super-admin/tenants/${tenant.slug}/payments`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            💰 Record Payment
          </Link>
          <Link
            href={`/super-admin/tenants/${tenant.slug}/payments`}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 font-medium"
          >
            📋 View Payment History
          </Link>
          <a
            href={getLoginUrl(tenant.slug)}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 font-medium"
          >
            🔗 Open Tenant Dashboard
          </a>
          <DeleteTenantButton tenant={tenant} />
        </div>
      </div>

      {/* Payment History */}
      {tenant.paymentRecords.length > 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Billing Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Received By
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tenant.paymentRecords.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {payment.paymentDate.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-green-600">
                      NPR {payment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{payment.paymentMethod}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {payment.billingPeriodStart.toLocaleDateString()} -{" "}
                      {payment.billingPeriodEnd.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{payment.receivedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-200">
            <Link
              href={`/super-admin/tenants/${tenant.slug}/payments`}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View all payments →
            </Link>
          </div>
        </div>
      )}

      {/* Activity Log */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Activity Log</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {tenant.activityLogs.map((log) => (
            <div key={log.id} className="px-6 py-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-900">{log.action}</span>
                <span className="text-sm text-gray-500">
                  {log.createdAt.toLocaleString()}
                </span>
              </div>
              {log.details && typeof log.details === 'object' && (
                <p className="text-sm text-gray-600 mt-1">
                  {JSON.stringify(log.details, null, 2)}
                </p>
              )}
            </div>
          ))}
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
    TRIAL_EXPIRED: "bg-orange-100 text-orange-800",
    CANCELLED: "bg-gray-100 text-gray-800",
    ARCHIVED: "bg-gray-100 text-gray-600",
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

function getLoginUrl(slug: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002";
  const url = new URL(baseUrl);

  if (process.env.NODE_ENV === "production") {
    const domain = process.env.SUPER_ADMIN_DOMAIN?.replace("admin.", "") || "cafemate.local";
    url.hostname = `${slug}.${domain}`;
  } else {
    url.hostname = `${slug}.localhost`;
  }

  url.pathname = "/login";
  return url.toString();
}
