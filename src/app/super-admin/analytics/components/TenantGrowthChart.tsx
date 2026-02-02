'use client';

/**
 * TenantGrowthChart Component
 *
 * Displays tenant growth trend over 12 months.
 * Shows active and trial tenants as separate lines.
 * Uses recharts library for visualization.
 *
 * @component
 */

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export interface TenantGrowthData {
  month: string;
  active: number;
  trial: number;
  total: number;
}

interface TenantGrowthChartProps {
  data: TenantGrowthData[];
}

export default function TenantGrowthChart({ data }: TenantGrowthChartProps) {
  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Tenant Growth Trend
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No growth data available
        </div>
      </div>
    );
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-gray-900 mb-2">
            {payload[0].payload.month}
          </p>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              Active: <span className="font-semibold text-blue-600">{payload[0].value}</span>
            </p>
            <p className="text-sm text-gray-600">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Trial: <span className="font-semibold text-green-600">{payload[1].value}</span>
            </p>
            <p className="text-sm text-gray-600 pt-1 border-t border-gray-200">
              Total: <span className="font-semibold text-gray-900">{payload[0].payload.total}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Tenant Growth Trend
        </h3>
        <p className="text-sm text-gray-600">
          Active and trial tenants over the last {data.length} months
        </p>
      </div>

      {/* Chart */}
      <div className="w-full h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickLine={{ stroke: '#d1d5db' }}
            />
            <YAxis
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickLine={{ stroke: '#d1d5db' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Line
              type="monotone"
              dataKey="active"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
              name="Active Tenants"
            />
            <Line
              type="monotone"
              dataKey="trial"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 4 }}
              activeDot={{ r: 6 }}
              name="Trial Tenants"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
