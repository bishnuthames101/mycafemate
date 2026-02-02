"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface RevenueChartProps {
  data: { date: string; revenue: number; orders: number }[];
  timeframe?: "daily" | "weekly" | "monthly";
}

export function RevenueChart({ data, timeframe = "daily" }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#B67B3D" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#B67B3D" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E8D5C4" />
        <XAxis
          dataKey="date"
          stroke="#9A6633"
          style={{ fontSize: "12px" }}
        />
        <YAxis
          stroke="#9A6633"
          style={{ fontSize: "12px" }}
          tickFormatter={(value) => `Rs.${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#FFF8F3",
            border: "1px solid #E8D5C4",
            borderRadius: "8px",
          }}
          formatter={(value: number, name: string) => {
            if (name === "revenue") return [formatCurrency(value), "Revenue"];
            return [value, "Orders"];
          }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#B67B3D"
          fillOpacity={1}
          fill="url(#colorRevenue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
