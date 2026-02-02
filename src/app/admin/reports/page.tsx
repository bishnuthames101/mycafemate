"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RevenueChart } from "@/components/analytics/revenue-chart";
import { CategoryChart } from "@/components/analytics/category-chart";
import { TopProductsChart } from "@/components/analytics/top-products-chart";
import { MetricCard } from "@/components/analytics/metric-card";
import { DollarSign, ShoppingCart, TrendingUp, Calendar, ArrowLeft, UserPlus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { subDays, format } from "date-fns";
import Link from "next/link";

export default function ReportsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState<string>("1month");
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [creditSummary, setCreditSummary] = useState<any>(null);

  const locationId = session?.user?.locationId || "";

  // Calculate date range based on selection
  const getDateRange = () => {
    const now = new Date();
    let startDate;
    let endDate;

    switch (dateRange) {
      case "today":
        // Start of today (00:00:00)
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        // End of today (23:59:59)
        endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999);
        break;
      case "1week":
        startDate = subDays(now, 7);
        endDate = now;
        break;
      case "1month":
        startDate = subDays(now, 30);
        endDate = now;
        break;
      case "alltime":
        startDate = new Date(2020, 0, 1);
        endDate = now;
        break;
      default:
        startDate = subDays(now, 30);
        endDate = now;
    }

    return { startDate, endDate };
  };

  const { startDate, endDate } = getDateRange();

  useEffect(() => {
    if (locationId) {
      fetchData();
    }
  }, [locationId, dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { startDate, endDate } = getDateRange();

      const [weekly, products, categories, metricsData, creditData] = await Promise.all([
        fetch(`/api/analytics/weekly?locationId=${locationId}&weekOffset=0`).then((r) => r.json()),
        fetch(
          `/api/analytics/top-products?locationId=${locationId}&startDate=${format(
            startDate,
            "yyyy-MM-dd"
          )}&endDate=${format(endDate, "yyyy-MM-dd")}&limit=10`
        ).then((r) => r.json()),
        fetch(
          `/api/analytics/category-breakdown?locationId=${locationId}&startDate=${format(
            startDate,
            "yyyy-MM-dd"
          )}&endDate=${format(endDate, "yyyy-MM-dd")}`
        ).then((r) => r.json()),
        fetch(
          `/api/analytics/revenue-metrics?locationId=${locationId}&startDate=${format(
            startDate,
            "yyyy-MM-dd"
          )}&endDate=${format(endDate, "yyyy-MM-dd")}`
        ).then((r) => r.json()),
        fetch(
          `/api/analytics/credit-summary?locationId=${locationId}&startDate=${format(
            startDate,
            "yyyy-MM-dd"
          )}&endDate=${format(endDate, "yyyy-MM-dd")}`
        ).then((r) => r.json()),
      ]);

      setWeeklyData(weekly);
      setTopProducts(products);
      setCategoryData(categories);
      setMetrics(metricsData);
      setCreditSummary(creditData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <Button variant="outline" size="icon" className="shrink-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-4xl font-bold text-coffee-700">Reports & Analytics</h1>
              <p className="text-sm md:text-base text-coffee-600 mt-1 md:mt-2">Insights and trends for your business</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={fetchData} className="w-full sm:w-auto">
              <Calendar className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="1week">Last 7 Days</SelectItem>
                <SelectItem value="1month">Last 30 Days</SelectItem>
                <SelectItem value="alltime">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Metrics Cards */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Revenue"
              value={formatCurrency(metrics.totalRevenue)}
              change={metrics.growth}
              icon={DollarSign}
              trend={metrics.growth >= 0 ? "up" : "down"}
            />
            <MetricCard
              title="Total Orders"
              value={metrics.totalOrders}
              icon={ShoppingCart}
            />
            <MetricCard
              title="Avg Order Value"
              value={formatCurrency(metrics.averageOrderValue)}
              icon={TrendingUp}
            />
            <MetricCard
              title="Revenue/Day"
              value={formatCurrency(metrics.revenuePerDay)}
              icon={Calendar}
            />
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend (Last 7 Days)</CardTitle>
              <CardDescription>Daily revenue performance</CardDescription>
            </CardHeader>
            <CardContent>
              {weeklyData.length > 0 ? (
                <RevenueChart data={weeklyData} timeframe="daily" />
              ) : (
                <p className="text-center text-muted-foreground py-8">No data available</p>
              )}
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
              <CardDescription>Revenue distribution across categories</CardDescription>
            </CardHeader>
            <CardContent>
              {categoryData.length > 0 ? (
                <CategoryChart data={categoryData} />
              ) : (
                <p className="text-center text-muted-foreground py-8">No data available</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>
              Top Selling Products (
              {dateRange === "today" && "Today"}
              {dateRange === "1week" && "Last 7 Days"}
              {dateRange === "1month" && "Last 30 Days"}
              {dateRange === "alltime" && "All Time"}
              )
            </CardTitle>
            <CardDescription>Best performing menu items by quantity sold</CardDescription>
          </CardHeader>
          <CardContent>
            {topProducts.length > 0 ? (
              <TopProductsChart data={topProducts} />
            ) : (
              <p className="text-center text-muted-foreground py-8">No data available</p>
            )}
          </CardContent>
        </Card>

        {/* Payment Method Breakdown */}
        {metrics && metrics.paymentMethodBreakdown && metrics.paymentMethodBreakdown.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>
                Payment Methods (
                {dateRange === "today" && "Today"}
                {dateRange === "1week" && "Last 7 Days"}
                {dateRange === "1month" && "Last 30 Days"}
                {dateRange === "alltime" && "All Time"}
                )
              </CardTitle>
              <CardDescription>Revenue breakdown by payment method</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.paymentMethodBreakdown.map((method: any) => (
                  <div key={method.method} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-coffee-700">{method.method.replace('_', ' ')}</span>
                        <span className="text-sm text-muted-foreground">
                          {method.count} {method.count === 1 ? 'order' : 'orders'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-coffee-600 h-2 rounded-full transition-all"
                            style={{ width: `${method.percentage}%` }}
                          />
                        </div>
                        <div className="text-right min-w-[120px]">
                          <p className="font-semibold text-coffee-700">{formatCurrency(method.revenue)}</p>
                          <p className="text-xs text-muted-foreground">{method.percentage.toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Credit & Receivables Summary */}
        {creditSummary && (creditSummary.creditOrderCount > 0 || creditSummary.totalOutstanding > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-red-600" />
                Credit & Receivables (
                {dateRange === "today" && "Today"}
                {dateRange === "1week" && "Last 7 Days"}
                {dateRange === "1month" && "Last 30 Days"}
                {dateRange === "alltime" && "All Time"}
                )
              </CardTitle>
              <CardDescription>
                Credit orders are included in total sales above. This section tracks outstanding receivables.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-sm text-blue-600">Credit Sales</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {formatCurrency(creditSummary.creditSalesTotal)}
                  </p>
                  <p className="text-xs text-blue-500 mt-1">
                    {creditSummary.creditOrderCount} {creditSummary.creditOrderCount === 1 ? "order" : "orders"}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <p className="text-sm text-green-600">Payments Received</p>
                  <p className="text-2xl font-bold text-green-700">
                    {formatCurrency(creditSummary.paymentsReceived)}
                  </p>
                  <p className="text-xs text-green-500 mt-1">
                    {creditSummary.paymentCount} {creditSummary.paymentCount === 1 ? "payment" : "payments"}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600">Total Outstanding</p>
                  <p className="text-2xl font-bold text-red-700">
                    {formatCurrency(creditSummary.totalOutstanding)}
                  </p>
                  <p className="text-xs text-red-500 mt-1">
                    {creditSummary.totalCreditors} {creditSummary.totalCreditors === 1 ? "creditor" : "creditors"}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                  <p className="text-sm text-gray-600">Cash Collected</p>
                  <p className="text-2xl font-bold text-gray-700">
                    {formatCurrency(
                      (metrics?.totalRevenue || 0) - creditSummary.creditSalesTotal + creditSummary.paymentsReceived
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Total revenue minus unpaid credit
                  </p>
                </div>
              </div>

              {/* Top Creditors */}
              {creditSummary.topCreditors && creditSummary.topCreditors.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Top Outstanding Balances
                  </h4>
                  <div className="space-y-2">
                    {creditSummary.topCreditors.map((creditor: any) => (
                      <div
                        key={creditor.id}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <Link
                          href={`/admin/creditors/${creditor.id}`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {creditor.name}
                        </Link>
                        <span className="font-semibold text-red-600">
                          {formatCurrency(creditor.currentBalance)}
                        </span>
                      </div>
                    ))}
                  </div>
                  {creditSummary.totalCreditors > 5 && (
                    <div className="mt-3 text-center">
                      <Link
                        href="/admin/creditors"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View all {creditSummary.totalCreditors} creditors
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Category Details Table */}
        <Card>
          <CardHeader>
            <CardTitle>Category Performance Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-cream-100 border-b">
                  <tr>
                    <th className="text-left p-3 text-sm font-semibold text-coffee-700">
                      Category
                    </th>
                    <th className="text-right p-3 text-sm font-semibold text-coffee-700">
                      Revenue
                    </th>
                    <th className="text-right p-3 text-sm font-semibold text-coffee-700">
                      Quantity
                    </th>
                    <th className="text-right p-3 text-sm font-semibold text-coffee-700">
                      Orders
                    </th>
                    <th className="text-right p-3 text-sm font-semibold text-coffee-700">
                      % of Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {categoryData.map((cat) => (
                    <tr key={cat.category}>
                      <td className="p-3 font-medium">{cat.category}</td>
                      <td className="p-3 text-right">{formatCurrency(cat.revenue)}</td>
                      <td className="p-3 text-right">{cat.quantity}</td>
                      <td className="p-3 text-right">{cat.orderCount}</td>
                      <td className="p-3 text-right font-medium text-coffee-600">
                        {cat.percentage.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
