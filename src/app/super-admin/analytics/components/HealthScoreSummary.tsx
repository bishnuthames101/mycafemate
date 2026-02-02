'use client';

/**
 * HealthScoreSummary Component
 *
 * Displays a visual breakdown of tenant health scores.
 * Shows count and percentage for each health status:
 * - Healthy (80-100)
 * - Warning (60-79)
 * - At Risk (40-59)
 * - Critical (0-39)
 *
 * @component
 */

interface HealthScoreSummaryProps {
  healthData: {
    healthy: number;
    warning: number;
    atRisk: number;
    critical: number;
  };
}

export default function HealthScoreSummary({ healthData }: HealthScoreSummaryProps) {
  const total =
    healthData.healthy + healthData.warning + healthData.atRisk + healthData.critical;

  // Calculate percentages
  const percentages = {
    healthy: total > 0 ? (healthData.healthy / total) * 100 : 0,
    warning: total > 0 ? (healthData.warning / total) * 100 : 0,
    atRisk: total > 0 ? (healthData.atRisk / total) * 100 : 0,
    critical: total > 0 ? (healthData.critical / total) * 100 : 0,
  };

  // Health status configurations
  const statuses = [
    {
      label: 'Healthy',
      count: healthData.healthy,
      percentage: percentages.healthy,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
    },
    {
      label: 'Warning',
      count: healthData.warning,
      percentage: percentages.warning,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-700',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
    {
      label: 'At Risk',
      count: healthData.atRisk,
      percentage: percentages.atRisk,
      color: 'bg-orange-500',
      textColor: 'text-orange-700',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      label: 'Critical',
      count: healthData.critical,
      percentage: percentages.critical,
      color: 'bg-red-500',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Tenant Health Overview</h3>
        <p className="text-sm text-gray-600 mt-1">
          Health score based on payment status, usage, and subscription activity
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Visual Progress Bar */}
        <div className="mb-6">
          <div className="flex h-4 rounded-full overflow-hidden">
            {statuses.map((status, index) => (
              <div
                key={status.label}
                className={`${status.color} ${
                  status.percentage === 0 ? 'hidden' : ''
                }`}
                style={{ width: `${status.percentage}%` }}
                title={`${status.label}: ${status.count} (${status.percentage.toFixed(1)}%)`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Status Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statuses.map((status) => (
            <div
              key={status.label}
              className={`${status.bgColor} ${status.borderColor} border rounded-lg p-4`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600">
                  {status.label}
                </span>
                <div className={`w-3 h-3 rounded-full ${status.color}`} />
              </div>
              <div className={`text-2xl font-bold ${status.textColor}`}>
                {status.count}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {status.percentage.toFixed(1)}% of total
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Total Tenants</span>
            <span className="text-lg font-bold text-gray-900">{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
