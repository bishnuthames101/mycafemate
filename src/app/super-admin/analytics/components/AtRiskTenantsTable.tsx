'use client';

/**
 * AtRiskTenantsTable Component
 *
 * Displays tenants that are at risk based on:
 * - Payment overdue
 * - Account suspended
 * - Trial expiring soon
 * - Low usage
 *
 * @component
 */

import type { AtRiskTenant } from '@/lib/utils/analytics-calculations';

interface AtRiskTenantsTableProps {
  tenants: AtRiskTenant[];
  maxDisplay?: number;
}

export default function AtRiskTenantsTable({
  tenants,
  maxDisplay = 10,
}: AtRiskTenantsTableProps) {
  // Limit display to maxDisplay items
  const displayTenants = tenants.slice(0, maxDisplay);

  // Handle empty state
  if (tenants.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          At-Risk Tenants
        </h3>
        <div className="flex items-center justify-center h-32 text-gray-500">
          <div className="text-center">
            <p className="text-sm">No at-risk tenants found</p>
            <p className="text-xs text-gray-400 mt-1">All tenants are healthy</p>
          </div>
        </div>
      </div>
    );
  }

  // Get risk level styling
  const getRiskBadge = (level: 'high' | 'medium' | 'low') => {
    const styles = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-blue-100 text-blue-800 border-blue-200',
    };

    const labels = {
      high: 'High Risk',
      medium: 'Medium Risk',
      low: 'Low Risk',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[level]}`}
      >
        {labels[level]}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            At-Risk Tenants
          </h3>
          <span className="text-sm text-gray-500">
            {tenants.length} tenant{tenants.length !== 1 ? 's' : ''} need attention
          </span>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tenant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Risk Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Issues
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayTenants.map((tenant) => (
              <tr key={tenant.tenantId} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {tenant.businessName}
                  </div>
                  <div className="text-sm text-gray-500">{tenant.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getRiskBadge(tenant.riskLevel)}
                </td>
                <td className="px-6 py-4">
                  <ul className="text-sm text-gray-600 space-y-1">
                    {tenant.reasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-gray-400 mr-2">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden divide-y divide-gray-200">
        {displayTenants.map((tenant) => (
          <div key={tenant.tenantId} className="px-4 py-4 space-y-3">
            {/* Tenant Name */}
            <div>
              <div className="text-sm font-medium text-gray-900">
                {tenant.businessName}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{tenant.slug}</div>
            </div>

            {/* Risk Badge */}
            <div>{getRiskBadge(tenant.riskLevel)}</div>

            {/* Issues */}
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Issues:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                {tenant.reasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Show more indicator */}
      {tenants.length > maxDisplay && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Showing {maxDisplay} of {tenants.length} at-risk tenants
          </p>
        </div>
      )}
    </div>
  );
}
