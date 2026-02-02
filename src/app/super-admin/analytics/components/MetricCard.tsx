/**
 * MetricCard Component
 *
 * Reusable card for displaying key metrics (KPIs).
 * Shows value, label, optional trend, and optional description.
 *
 * @component
 */

import { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  description?: string;
  valueColor?: string;
  className?: string;
}

export default function MetricCard({
  label,
  value,
  icon,
  trend,
  description,
  valueColor = 'text-gray-900',
  className = '',
}: MetricCardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow border border-gray-200 p-6 ${className}`}
    >
      {/* Label with optional icon */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-600">{label}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>

      {/* Main value */}
      <p className={`mt-2 text-3xl font-bold ${valueColor}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>

      {/* Trend indicator */}
      {trend && (
        <div className="mt-1 flex items-center text-sm">
          <span
            className={`font-medium ${
              trend.isPositive !== false
                ? 'text-emerald-600'
                : 'text-red-600'
            }`}
          >
            {trend.value >= 0 ? '↗' : '↘'} {Math.abs(trend.value).toFixed(1)}%
          </span>
          <span className="ml-2 text-gray-500">{trend.label}</span>
        </div>
      )}

      {/* Description */}
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
}
