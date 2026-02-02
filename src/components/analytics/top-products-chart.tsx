"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface TopProductsChartProps {
  data: {
    productName: string;
    quantity: number;
    revenue: number;
  }[];
}

export function TopProductsChart({ data }: TopProductsChartProps) {
  const chartData = data.map((item) => ({
    name: item.productName.length > 15 ? item.productName.substring(0, 15) + "..." : item.productName,
    fullName: item.productName,
    quantity: item.quantity,
    revenue: item.revenue,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#E8D5C4" />
        <XAxis type="number" stroke="#9A6633" style={{ fontSize: "12px" }} />
        <YAxis
          dataKey="name"
          type="category"
          stroke="#9A6633"
          style={{ fontSize: "12px" }}
          width={150}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#FFF8F3",
            border: "1px solid #E8D5C4",
            borderRadius: "8px",
          }}
          formatter={(value: number, name: string) => {
            if (name === "revenue") return [formatCurrency(value), "Revenue"];
            return [value, "Quantity"];
          }}
          labelFormatter={(label: any) => label}
        />
        <Bar dataKey="quantity" fill="#B67B3D" />
      </BarChart>
    </ResponsiveContainer>
  );
}
