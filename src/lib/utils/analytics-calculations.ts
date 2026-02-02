/**
 * Analytics Calculations Utility
 *
 * All business logic for super admin analytics dashboard.
 * Keeps calculations separate from UI components for testability.
 *
 * @module analytics-calculations
 */

// Import types from the generated master Prisma client
import type { Tenant, PaymentRecord, TenantUsage, SubscriptionStatus, TenantStatus } from '@/generated/prisma-master';
import { startOfMonth, endOfMonth, subMonths, format, differenceInDays } from 'date-fns';

// ============= TYPE DEFINITIONS =============

// Minimal types for function parameters (accepts partial data)
export interface TenantMinimal {
  subscriptionStatus: SubscriptionStatus;
  isActive: boolean;
  monthlyFee: number;
}

export interface TenantWithDates extends TenantMinimal {
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantWithPaymentInfo extends TenantWithDates {
  id: string;
  slug: string;
  businessName: string;
  status: TenantStatus;
  lastPaymentDate: Date | null;
  nextPaymentDue: Date | null;
  trialEndsAt: Date | null;
}

export interface PaymentMinimal {
  amount: number;
  paymentDate: Date;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  date: Date;
}

export interface TenantGrowth {
  month: string;
  active: number;
  trial: number;
  total: number;
  date: Date;
}

export interface HealthScore {
  score: number; // 0-100
  status: 'healthy' | 'warning' | 'at-risk' | 'critical';
  reasons: string[];
}

export interface AtRiskTenant {
  tenantId: string;
  slug: string;
  businessName: string;
  riskLevel: 'high' | 'medium' | 'low';
  reasons: string[];
  daysOverdue?: number;
  lastPaymentDate?: Date;
  nextPaymentDue?: Date;
}

// ============= REVENUE METRICS =============

/**
 * Calculate Monthly Recurring Revenue (MRR)
 * Sum of all active tenant monthly fees
 */
export function calculateMRR(tenants: TenantMinimal[]): number {
  return tenants
    .filter(t => t.subscriptionStatus === 'ACTIVE' && t.isActive)
    .reduce((sum, tenant) => sum + tenant.monthlyFee, 0);
}

/**
 * Calculate Annual Recurring Revenue (ARR)
 * MRR × 12
 */
export function calculateARR(mrr: number): number {
  return mrr * 12;
}

/**
 * Calculate growth rate between two periods
 * Returns percentage change
 */
export function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Calculate MRR for a specific month
 * Uses payment records to determine active tenants in that period
 */
export function calculateMRRForMonth(
  tenants: TenantWithPaymentInfo[],
  payments: PaymentMinimal[],
  targetMonth: Date
): number {
  const monthStart = startOfMonth(targetMonth);
  const monthEnd = endOfMonth(targetMonth);

  // Get tenants who paid in this month or had active subscription
  const activeInMonth = tenants.filter(tenant => {
    // Was active during this month
    const wasActive =
      tenant.createdAt <= monthEnd &&
      (tenant.subscriptionStatus === 'ACTIVE' ||
       (tenant.lastPaymentDate && tenant.lastPaymentDate <= monthEnd));

    return wasActive;
  });

  return activeInMonth.reduce((sum, t) => sum + t.monthlyFee, 0);
}

// ============= CHURN METRICS =============

/**
 * Calculate churn rate for current month
 * (Cancelled tenants this month / Total active start of month) × 100
 */
export function calculateChurnRate(tenants: TenantWithDates[]): number {
  const now = new Date();
  const monthStart = startOfMonth(now);

  // Tenants cancelled this month
  const cancelledThisMonth = tenants.filter(t =>
    t.subscriptionStatus === 'CANCELLED' &&
    t.updatedAt >= monthStart &&
    t.updatedAt <= now
  ).length;

  // Total active at start of month (approximate)
  const totalActiveStartMonth = tenants.filter(t =>
    t.createdAt < monthStart &&
    (t.subscriptionStatus === 'ACTIVE' || t.subscriptionStatus === 'TRIAL')
  ).length;

  if (totalActiveStartMonth === 0) return 0;
  return (cancelledThisMonth / totalActiveStartMonth) * 100;
}

// ============= GROWTH METRICS =============

/**
 * Get new tenants count for current month
 */
export function getNewTenantsThisMonth(tenants: { createdAt: Date }[]): number {
  const monthStart = startOfMonth(new Date());
  return tenants.filter(t => t.createdAt >= monthStart).length;
}

/**
 * Get new tenants count for previous month
 */
export function getNewTenantsLastMonth(tenants: { createdAt: Date }[]): number {
  const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
  const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));

  return tenants.filter(t =>
    t.createdAt >= lastMonthStart && t.createdAt <= lastMonthEnd
  ).length;
}

// ============= REVENUE TRENDS =============

/**
 * Calculate revenue by month for last N months
 * Uses payment records grouped by month
 */
export function getRevenueByMonth(
  payments: PaymentMinimal[],
  monthsBack: number = 12
): MonthlyRevenue[] {
  const result: MonthlyRevenue[] = [];
  const now = new Date();

  for (let i = monthsBack - 1; i >= 0; i--) {
    const targetMonth = subMonths(now, i);
    const monthStart = startOfMonth(targetMonth);
    const monthEnd = endOfMonth(targetMonth);

    // Sum all payments in this month
    const monthRevenue = payments
      .filter(p => p.paymentDate >= monthStart && p.paymentDate <= monthEnd)
      .reduce((sum, p) => sum + p.amount, 0);

    result.push({
      month: format(targetMonth, 'MMM yyyy'),
      revenue: monthRevenue,
      date: targetMonth,
    });
  }

  return result;
}

/**
 * Get tenant growth by month for last N months
 * Shows active and trial tenant counts per month
 */
export function getTenantGrowthByMonth(
  tenants: TenantWithDates[],
  monthsBack: number = 12
): TenantGrowth[] {
  const result: TenantGrowth[] = [];
  const now = new Date();

  for (let i = monthsBack - 1; i >= 0; i--) {
    const targetMonth = subMonths(now, i);
    const monthEnd = endOfMonth(targetMonth);

    // Count tenants that existed by end of this month
    const tenantsAtMonth = tenants.filter(t => t.createdAt <= monthEnd);

    const active = tenantsAtMonth.filter(
      t => t.subscriptionStatus === 'ACTIVE' && t.isActive
    ).length;

    const trial = tenantsAtMonth.filter(
      t => t.subscriptionStatus === 'TRIAL'
    ).length;

    result.push({
      month: format(targetMonth, 'MMM yyyy'),
      active,
      trial,
      total: active + trial,
      date: targetMonth,
    });
  }

  return result;
}

/**
 * Get top performing tenants by revenue
 * Sorts by monthly fee and calculates total revenue contribution
 */
export function getTopPerformers(
  tenants: TenantWithPaymentInfo[],
  payments: PaymentMinimal[],
  limit: number = 10
): Array<{
  businessName: string;
  slug: string;
  monthlyFee: number;
  totalRevenue: number;
  subscriptionStatus: SubscriptionStatus;
}> {
  // Calculate total revenue per tenant from payments
  const revenueByTenant = new Map<string, number>();

  payments.forEach(payment => {
    // Note: We'll need tenantId in payments, but for now we'll use monthlyFee as proxy
    // This is a simplified version
  });

  // Get active tenants sorted by monthly fee
  const activeTopTenants = tenants
    .filter(t => t.subscriptionStatus === 'ACTIVE' || t.subscriptionStatus === 'TRIAL')
    .sort((a, b) => b.monthlyFee - a.monthlyFee)
    .slice(0, limit)
    .map(tenant => ({
      businessName: tenant.businessName,
      slug: tenant.slug,
      monthlyFee: tenant.monthlyFee,
      totalRevenue: tenant.monthlyFee * 12, // Simple estimate: monthly fee × 12
      subscriptionStatus: tenant.subscriptionStatus,
    }));

  return activeTopTenants;
}

// ============= HEALTH SCORES =============

/**
 * Calculate health score for a tenant
 * Score based on multiple factors:
 * - Payment status (40 points)
 * - Usage activity (30 points)
 * - Subscription status (30 points)
 */
export function calculateHealthScore(
  tenant: { subscriptionStatus: SubscriptionStatus; status: TenantStatus; isActive: boolean },
  usage?: TenantUsage
): HealthScore {
  let score = 0;
  const reasons: string[] = [];

  // Payment status (40 points max)
  if (tenant.subscriptionStatus === 'ACTIVE') {
    score += 40;
  } else if (tenant.subscriptionStatus === 'TRIAL') {
    score += 30;
    reasons.push('In trial period');
  } else if (tenant.subscriptionStatus === 'PAYMENT_DUE') {
    score += 10;
    reasons.push('Payment overdue');
  } else if (tenant.subscriptionStatus === 'EXPIRED') {
    score += 0;
    reasons.push('Subscription expired');
  }

  // Usage activity (30 points max)
  if (usage) {
    if (usage.apiRequests > 100) {
      score += 30; // Active usage
    } else if (usage.apiRequests > 10) {
      score += 20; // Moderate usage
      reasons.push('Low activity');
    } else {
      score += 5; // Very low usage
      reasons.push('Very low activity');
    }
  } else {
    score += 15; // No usage data, assume moderate
  }

  // Subscription status (30 points max)
  if (tenant.status === 'ACTIVE' && tenant.isActive) {
    score += 30;
  } else if (tenant.status === 'SUSPENDED') {
    score += 0;
    reasons.push('Account suspended');
  } else if (tenant.status === 'TRIAL_EXPIRED') {
    score += 5;
    reasons.push('Trial expired');
  }

  // Determine status
  let status: HealthScore['status'];
  if (score >= 80) status = 'healthy';
  else if (score >= 60) status = 'warning';
  else if (score >= 40) status = 'at-risk';
  else status = 'critical';

  return { score, status, reasons };
}

/**
 * Identify at-risk tenants
 * Criteria: Payment overdue, low usage, or suspended
 */
export function identifyAtRiskTenants(
  tenants: TenantWithPaymentInfo[],
  usageData?: Map<string, TenantUsage>
): AtRiskTenant[] {
  const atRisk: AtRiskTenant[] = [];
  const now = new Date();

  for (const tenant of tenants) {
    const reasons: string[] = [];
    let riskLevel: 'high' | 'medium' | 'low' = 'low';

    // Check payment status
    if (tenant.subscriptionStatus === 'PAYMENT_DUE') {
      reasons.push('Payment overdue');
      riskLevel = 'high';

      if (tenant.nextPaymentDue) {
        const daysOverdue = differenceInDays(now, tenant.nextPaymentDue);
        if (daysOverdue > 0) {
          reasons.push(`${daysOverdue} days overdue`);
        }
      }
    }

    // Check if suspended
    if (tenant.status === 'SUSPENDED') {
      reasons.push('Account suspended');
      riskLevel = 'high';
    }

    // Check trial expiring soon
    if (tenant.subscriptionStatus === 'TRIAL' && tenant.trialEndsAt) {
      const daysUntilExpiry = differenceInDays(tenant.trialEndsAt, now);
      if (daysUntilExpiry <= 7 && daysUntilExpiry >= 0) {
        reasons.push(`Trial ends in ${daysUntilExpiry} days`);
        if (riskLevel === 'low') riskLevel = 'medium';
      }
    }

    // Check usage (if available)
    const usage = usageData?.get(tenant.id);
    if (usage && usage.apiRequests < 10) {
      reasons.push('Very low usage');
      if (riskLevel === 'low') riskLevel = 'medium';
    }

    // Only include if there are risk factors
    if (reasons.length > 0) {
      atRisk.push({
        tenantId: tenant.id,
        slug: tenant.slug,
        businessName: tenant.businessName,
        riskLevel,
        reasons,
        daysOverdue: tenant.nextPaymentDue
          ? Math.max(0, differenceInDays(now, tenant.nextPaymentDue))
          : undefined,
        lastPaymentDate: tenant.lastPaymentDate || undefined,
        nextPaymentDue: tenant.nextPaymentDue || undefined,
      });
    }
  }

  // Sort by risk level (high first)
  return atRisk.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.riskLevel] - order[b.riskLevel];
  });
}

// ============= CONVERSION METRICS =============

/**
 * Calculate trial to paid conversion rate
 * (Tenants converted from trial to active / Total trial tenants) × 100
 */
export function calculateTrialConversionRate(
  tenants: { subscriptionStatus: SubscriptionStatus; trialEndsAt: Date | null }[]
): number {
  // Tenants currently active who started as trial
  const convertedTenants = tenants.filter(t =>
    t.subscriptionStatus === 'ACTIVE' &&
    t.trialEndsAt !== null // Had a trial period
  ).length;

  // All tenants who had trials (including current trials)
  const totalTrialTenants = tenants.filter(t =>
    t.trialEndsAt !== null
  ).length;

  if (totalTrialTenants === 0) return 0;
  return (convertedTenants / totalTrialTenants) * 100;
}

// ============= UTILITY FUNCTIONS =============

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: string = 'NPR'): string {
  return `${currency} ${amount.toLocaleString()}`;
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Calculate percentage of total
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

/**
 * Safe division (returns 0 if divisor is 0)
 */
export function safeDivide(numerator: number, denominator: number): number {
  return denominator === 0 ? 0 : numerator / denominator;
}
