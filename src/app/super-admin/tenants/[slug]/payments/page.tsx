import { getMasterPrisma } from "@/lib/prisma-multi-tenant";
import { notFound } from "next/navigation";
import Link from "next/link";
import PaymentForm from "./PaymentForm";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function TenantPaymentsPage({ params }: PageProps) {
  const masterPrisma = getMasterPrisma();

  const tenant = await masterPrisma.tenant.findUnique({
    where: { slug: params.slug },
    include: {
      paymentRecords: {
        orderBy: { paymentDate: "desc" },
      },
    },
  });

  if (!tenant) {
    notFound();
  }

  // Calculate total revenue
  const totalRevenue = tenant.paymentRecords.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href={`/super-admin/tenants/${tenant.slug}`}
          className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-block"
        >
          ← Back to Tenant Details
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
        <p className="text-gray-600 mt-1">{tenant.businessName} ({tenant.slug})</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            NPR {totalRevenue.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Total Payments</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {tenant.paymentRecords.length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Next Payment Due</h3>
          <p className="text-lg font-bold text-gray-900 mt-2">
            {tenant.nextPaymentDue
              ? tenant.nextPaymentDue.toLocaleDateString()
              : "—"}
          </p>
        </div>
      </div>

      {/* Record Payment Form */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          💰 Record New Payment
        </h2>
        <PaymentForm tenantSlug={tenant.slug} monthlyFee={tenant.monthlyFee} />
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
        </div>

        {tenant.paymentRecords.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            <p>No payments recorded yet</p>
            <p className="text-sm mt-2">Record the first payment using the form above</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Payment Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Reference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Billing Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Received By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Notes
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
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {payment.paymentMethod}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                      {payment.referenceNumber || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {payment.billingPeriodStart.toLocaleDateString()} -{" "}
                      {payment.billingPeriodEnd.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {payment.receivedBy}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {payment.notes || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
