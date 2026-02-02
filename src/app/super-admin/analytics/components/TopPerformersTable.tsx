'use client';

/**
 * TopPerformersTable Component
 *
 * Displays the top-performing tenants based on:
 * - Monthly revenue contribution
 * - Subscription tier
 * - Active status
 *
 * @component
 */

export interface TopPerformer {
  businessName: string;
  slug: string;
  monthlyFee: number;
  totalRevenue: number;
  subscriptionStatus: string;
}

interface TopPerformersTableProps {
  performers: TopPerformer[];
  maxDisplay?: number;
  currency?: string;
}

export default function TopPerformersTable({
  performers,
  maxDisplay = 10,
  currency = 'NPR',
}: TopPerformersTableProps) {
  // Limit display to maxDisplay items
  const displayPerformers = performers.slice(0, maxDisplay);

  // Handle empty state
  if (performers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top Performers
        </h3>
        <div className="flex items-center justify-center h-32 text-gray-500">
          <div className="text-center">
            <p className="text-sm">No data available</p>
            <p className="text-xs text-gray-400 mt-1">No active tenants found</p>
          </div>
        </div>
      </div>
    );
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      ACTIVE: 'bg-green-100 text-green-800 border-green-200',
      TRIAL: 'bg-blue-100 text-blue-800 border-blue-200',
      PAYMENT_DUE: 'bg-orange-100 text-orange-800 border-orange-200',
      EXPIRED: 'bg-red-100 text-red-800 border-red-200',
    };

    const labels: Record<string, string> = {
      ACTIVE: 'Active',
      TRIAL: 'Trial',
      PAYMENT_DUE: 'Payment Due',
      EXPIRED: 'Expired',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          styles[status] || 'bg-gray-100 text-gray-800 border-gray-200'
        }`}
      >
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Top Performers
          </h3>
          <span className="text-sm text-gray-500">
            By monthly revenue
          </span>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tenant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monthly Fee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Revenue
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayPerformers.map((performer, index) => (
              <tr key={performer.slug} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-sm">
                    {index + 1}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {performer.businessName}
                  </div>
                  <div className="text-sm text-gray-500">{performer.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(performer.subscriptionStatus)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {currency} {performer.monthlyFee.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-green-600">
                    {currency} {performer.totalRevenue.toLocaleString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden divide-y divide-gray-200">
        {displayPerformers.map((performer, index) => (
          <div key={performer.slug} className="px-4 py-4 space-y-3">
            {/* Rank & Name */}
            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  {performer.businessName}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{performer.slug}</div>
              </div>
            </div>

            {/* Status Badge */}
            <div>{getStatusBadge(performer.subscriptionStatus)}</div>

            {/* Revenue Info */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-xs text-gray-500 mb-1">Monthly Fee</p>
                <p className="text-sm font-semibold text-gray-900">
                  {currency} {performer.monthlyFee.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Revenue</p>
                <p className="text-sm font-semibold text-green-600">
                  {currency} {performer.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show more indicator */}
      {performers.length > maxDisplay && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Showing top {maxDisplay} of {performers.length} performers
          </p>
        </div>
      )}
    </div>
  );
}
