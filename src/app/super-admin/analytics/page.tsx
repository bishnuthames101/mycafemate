import { getMasterPrisma } from "@/lib/prisma-multi-tenant";
import {
  calculateMRR,
  calculateARR,
  calculateGrowthRate,
  calculateChurnRate,
  getRevenueByMonth,
  getNewTenantsThisMonth,
  getNewTenantsLastMonth,
  identifyAtRiskTenants,
  calculateHealthScore,
  calculateTrialConversionRate,
  getTenantGrowthByMonth,
  getTopPerformers,
} from "@/lib/utils/analytics-calculations";
import MetricCard from "./components/MetricCard";
import RevenueChart from "./components/RevenueChart";
import AtRiskTenantsTable from "./components/AtRiskTenantsTable";
import HealthScoreSummary from "./components/HealthScoreSummary";
import TenantGrowthChart from "./components/TenantGrowthChart";
import TopPerformersTable from "./components/TopPerformersTable";

export default async function AnalyticsPage() {
  const masterPrisma = getMasterPrisma();

  // Fetch analytics data
  const [
    totalTenants,
    tenantsByStatus,
    tenantsBySubscription,
    revenueStats,
    upcomingPayments,
    allTenants,
    allPayments,
  ] = await Promise.all([
    masterPrisma.tenant.count(),
    masterPrisma.tenant.groupBy({
      by: ["status"],
      _count: true,
    }),
    masterPrisma.tenant.groupBy({
      by: ["subscriptionStatus"],
      _count: true,
    }),
    masterPrisma.paymentRecord.aggregate({
      _sum: { amount: true },
      _count: true,
    }),
    masterPrisma.tenant.findMany({
      where: {
        nextPaymentDue: {
          gte: new Date(),
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next 7 days
        },
      },
      select: {
        businessName: true,
        slug: true,
        nextPaymentDue: true,
        monthlyFee: true,
      },
      orderBy: { nextPaymentDue: "asc" },
    }),
    // NEW: Fetch all tenants for MRR and growth calculations
    masterPrisma.tenant.findMany({
      select: {
        id: true,
        slug: true,
        businessName: true,
        subscriptionStatus: true,
        status: true,
        isActive: true,
        monthlyFee: true,
        createdAt: true,
        updatedAt: true,
        lastPaymentDate: true,
        nextPaymentDue: true,
        trialEndsAt: true,
      },
    }),
    // NEW: Fetch all payments for revenue trends
    masterPrisma.paymentRecord.findMany({
      select: {
        amount: true,
        paymentDate: true,
      },
      orderBy: { paymentDate: "desc" },
    }),
  ]);

  const statusCounts = tenantsByStatus.reduce((acc, item) => {
    acc[item.status] = item._count;
    return acc;
  }, {} as Record<string, number>);

  const subscriptionCounts = tenantsBySubscription.reduce((acc, item) => {
    acc[item.subscriptionStatus] = item._count;
    return acc;
  }, {} as Record<string, number>);

  // NEW: Calculate SaaS metrics (Phase 1)
  const mrr = calculateMRR(allTenants);
  const arr = calculateARR(mrr);
  const newTenantsThisMonth = getNewTenantsThisMonth(allTenants);
  const newTenantsLastMonth = getNewTenantsLastMonth(allTenants);
  const growthRate = calculateGrowthRate(newTenantsThisMonth, newTenantsLastMonth);
  const churnRate = calculateChurnRate(allTenants);
  const revenueByMonth = getRevenueByMonth(allPayments, 12);

  // NEW: Phase 2 - Health & Risk Metrics
  const atRiskTenants = identifyAtRiskTenants(allTenants);
  const trialConversionRate = calculateTrialConversionRate(allTenants);

  // Calculate health score distribution
  const healthDistribution = allTenants.reduce(
    (acc, tenant) => {
      const health = calculateHealthScore(tenant);
      acc[health.status]++;
      return acc;
    },
    { healthy: 0, warning: 0, 'at-risk': 0, critical: 0 }
  );

  const healthData = {
    healthy: healthDistribution.healthy,
    warning: healthDistribution.warning,
    atRisk: healthDistribution['at-risk'],
    critical: healthDistribution.critical,
  };

  // NEW: Phase 3 - Advanced Analytics
  const tenantGrowthData = getTenantGrowthByMonth(allTenants, 12);
  const topPerformers = getTopPerformers(allTenants, allPayments, 10);

  // Calculate average revenue per tenant
  const activeTenantsCount = allTenants.filter(
    t => t.subscriptionStatus === 'ACTIVE' && t.isActive
  ).length;
  const avgRevenuePerTenant = activeTenantsCount > 0 ? mrr / activeTenantsCount : 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm sm:text-base text-gray-600">
          Business metrics and tenant insights
        </p>
      </div>

      {/* NEW: Critical SaaS Metrics */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Key Revenue Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            label="Monthly Recurring Revenue"
            value={`NPR ${mrr.toLocaleString()}`}
            description="Active subscriptions only"
            valueColor="text-green-600"
          />
          <MetricCard
            label="Annual Recurring Revenue"
            value={`NPR ${arr.toLocaleString()}`}
            description="MRR × 12 months"
            valueColor="text-blue-600"
          />
          <MetricCard
            label="New Tenants"
            value={newTenantsThisMonth}
            trend={{
              value: growthRate,
              label: "vs last month",
              isPositive: growthRate >= 0,
            }}
            description="This month"
            valueColor="text-indigo-600"
          />
          <MetricCard
            label="Churn Rate"
            value={`${churnRate.toFixed(1)}%`}
            description="Current month"
            valueColor={churnRate > 5 ? "text-red-600" : "text-gray-900"}
          />
        </div>
      </div>

      {/* NEW: Revenue Trend Chart */}
      <RevenueChart data={revenueByMonth} currency="NPR" />

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            NPR {(revenueStats._sum.amount || 0).toLocaleString()}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {revenueStats._count} payments received
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Total Tenants</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {totalTenants}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Registered cafes
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Active Subscriptions</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {subscriptionCounts.ACTIVE || 0}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Paying customers
          </p>
        </div>
      </div>

      {/* Tenant Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Tenants by Status
            </h2>
          </div>
          <div className="p-6 space-y-3">
            <StatusBar
              label="Active"
              count={statusCounts.ACTIVE || 0}
              total={totalTenants}
              color="bg-green-500"
            />
            <StatusBar
              label="Suspended"
              count={statusCounts.SUSPENDED || 0}
              total={totalTenants}
              color="bg-red-500"
            />
            <StatusBar
              label="Provisioning"
              count={statusCounts.PROVISIONING || 0}
              total={totalTenants}
              color="bg-yellow-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Subscription Status
            </h2>
          </div>
          <div className="p-6 space-y-3">
            <StatusBar
              label="Active"
              count={subscriptionCounts.ACTIVE || 0}
              total={totalTenants}
              color="bg-green-500"
            />
            <StatusBar
              label="Trial"
              count={subscriptionCounts.TRIAL || 0}
              total={totalTenants}
              color="bg-blue-500"
            />
            <StatusBar
              label="Expired"
              count={subscriptionCounts.EXPIRED || 0}
              total={totalTenants}
              color="bg-red-500"
            />
            <StatusBar
              label="Payment Due"
              count={subscriptionCounts.PAYMENT_DUE || 0}
              total={totalTenants}
              color="bg-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Upcoming Payments */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            Upcoming Payments (Next 7 Days)
          </h2>
        </div>

        {upcomingPayments.length === 0 ? (
          <div className="px-4 sm:px-6 py-8 text-center text-sm sm:text-base text-gray-500">
            No payments due in the next 7 days
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tenant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {upcomingPayments.map((tenant) => (
                    <tr key={tenant.slug}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {tenant.businessName}
                        </div>
                        <div className="text-sm text-gray-500">{tenant.slug}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {tenant.nextPaymentDue
                          ? new Date(tenant.nextPaymentDue).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        NPR {tenant.monthlyFee.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden divide-y divide-gray-200">
              {upcomingPayments.map((tenant) => (
                <div key={tenant.slug} className="px-4 py-4 space-y-2">
                  <div className="text-sm font-medium text-gray-900">
                    {tenant.businessName}
                  </div>
                  <div className="text-xs text-gray-500">{tenant.slug}</div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="text-xs text-gray-600">
                      Due: {tenant.nextPaymentDue
                        ? new Date(tenant.nextPaymentDue).toLocaleDateString()
                        : "—"}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      NPR {tenant.monthlyFee.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* NEW: Phase 2 - Health & Risk Analytics */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Tenant Health & Risk Metrics
        </h2>

        {/* Trial Conversion & Health Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <MetricCard
            label="Trial Conversion Rate"
            value={`${trialConversionRate.toFixed(1)}%`}
            description="Trials converted to paid"
            valueColor={trialConversionRate > 50 ? "text-green-600" : "text-orange-600"}
          />
          <MetricCard
            label="Tenants at Risk"
            value={atRiskTenants.length}
            description="Require immediate attention"
            valueColor={atRiskTenants.length > 0 ? "text-red-600" : "text-green-600"}
          />
        </div>

        {/* Health Score Distribution */}
        <div className="mb-6">
          <HealthScoreSummary healthData={healthData} />
        </div>

        {/* At-Risk Tenants Table */}
        <AtRiskTenantsTable tenants={atRiskTenants} maxDisplay={10} />
      </div>

      {/* NEW: Phase 3 - Advanced Analytics */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Growth & Performance Analytics
        </h2>

        {/* Advanced Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <MetricCard
            label="Average Revenue per Tenant"
            value={`NPR ${Math.round(avgRevenuePerTenant).toLocaleString()}`}
            description="Monthly average (active tenants)"
            valueColor="text-blue-600"
          />
          <MetricCard
            label="Total Active Tenants"
            value={activeTenantsCount}
            description="Currently paying customers"
            valueColor="text-green-600"
          />
        </div>

        {/* Tenant Growth Chart */}
        <div className="mb-6">
          <TenantGrowthChart data={tenantGrowthData} />
        </div>

        {/* Top Performers Table */}
        <TopPerformersTable performers={topPerformers} maxDisplay={10} currency="NPR" />
      </div>
    </div>
  );
}

function StatusBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-700">{label}</span>
        <span className="text-gray-900 font-medium">{count}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
