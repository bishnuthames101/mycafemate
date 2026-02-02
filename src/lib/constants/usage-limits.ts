/**
 * Usage Limits and Overage Pricing Configuration
 *
 * Base Plan: NPR 1,200/month
 * All cafes start with these limits and pay overages if exceeded
 */

export const USAGE_LIMITS = {
  // Base monthly fee
  BASE_MONTHLY_FEE: 1200, // NPR

  // Database Storage
  DATABASE_STORAGE_MB: 100, // 100 MB included
  DATABASE_STORAGE_OVERAGE_RATE: 5, // NPR 5 per GB/month

  // Bandwidth
  BANDWIDTH_GB: 10, // 10 GB/month included
  BANDWIDTH_OVERAGE_RATE: 10, // NPR 10 per GB

  // API Requests
  API_REQUESTS_PER_DAY: 20000, // 20,000 requests/day
  API_REQUESTS_PER_MONTH: 600000, // 600,000 requests/month
  // No overage charge for API requests (unlimited after base)

  // Orders
  ORDERS_PER_MONTH: 1000, // 1,000 orders included
  ORDER_OVERAGE_RATE: 0.5, // NPR 0.50 per order

  // Staff Accounts
  STAFF_ACCOUNTS: 3, // 3 staff accounts included (1 Admin, 1 Waiter, 1 Kitchen)
  STAFF_ACCOUNT_OVERAGE_RATE: 100, // NPR 100 per additional user/month

  // Menu Items (no limit, but tracked)
  MENU_ITEMS: 100, // 100 menu items included
  // No overage charge for menu items (unlimited after base)

  // Tables (no limit, but tracked)
  TABLES: 20, // 20 tables included
  // No overage charge for tables (unlimited after base)

  // Support
  SUPPORT_TYPE: 'EMAIL', // Email support (48hr response)
  PRIORITY_SUPPORT_RATE: 500, // NPR 500/month for 24hr priority support
} as const;

export const USAGE_ALERT_THRESHOLDS = {
  WARNING: 0.8, // 80% - warning alert
  CRITICAL: 0.9, // 90% - critical alert
  EXCEEDED: 1.0, // 100% - limit exceeded
} as const;

export type UsageLimitKey = keyof typeof USAGE_LIMITS;
export type UsageAlertThreshold = keyof typeof USAGE_ALERT_THRESHOLDS;

/**
 * Calculate overage charges based on usage
 */
export function calculateOverageCharges(usage: {
  databaseStorageMB: number;
  bandwidthGB: number;
  ordersCount: number;
  staffCount: number;
  hasPrioritySupport?: boolean;
}): {
  baseCharge: number;
  overageCharges: {
    databaseStorage: number;
    bandwidth: number;
    orders: number;
    staff: number;
    prioritySupport: number;
  };
  totalOverage: number;
  totalBill: number;
} {
  const overageCharges = {
    databaseStorage: 0,
    bandwidth: 0,
    orders: 0,
    staff: 0,
    prioritySupport: 0,
  };

  // Database storage overage (charged per GB)
  const storageOverageMB = Math.max(0, usage.databaseStorageMB - USAGE_LIMITS.DATABASE_STORAGE_MB);
  if (storageOverageMB > 0) {
    const storageOverageGB = storageOverageMB / 1024;
    overageCharges.databaseStorage = Math.ceil(storageOverageGB * USAGE_LIMITS.DATABASE_STORAGE_OVERAGE_RATE);
  }

  // Bandwidth overage
  const bandwidthOverageGB = Math.max(0, usage.bandwidthGB - USAGE_LIMITS.BANDWIDTH_GB);
  if (bandwidthOverageGB > 0) {
    overageCharges.bandwidth = Math.ceil(bandwidthOverageGB * USAGE_LIMITS.BANDWIDTH_OVERAGE_RATE);
  }

  // Orders overage
  const ordersOverage = Math.max(0, usage.ordersCount - USAGE_LIMITS.ORDERS_PER_MONTH);
  if (ordersOverage > 0) {
    overageCharges.orders = Math.ceil(ordersOverage * USAGE_LIMITS.ORDER_OVERAGE_RATE);
  }

  // Staff accounts overage
  const staffOverage = Math.max(0, usage.staffCount - USAGE_LIMITS.STAFF_ACCOUNTS);
  if (staffOverage > 0) {
    overageCharges.staff = staffOverage * USAGE_LIMITS.STAFF_ACCOUNT_OVERAGE_RATE;
  }

  // Priority support
  if (usage.hasPrioritySupport) {
    overageCharges.prioritySupport = USAGE_LIMITS.PRIORITY_SUPPORT_RATE;
  }

  const totalOverage = Object.values(overageCharges).reduce((sum, charge) => sum + charge, 0);
  const totalBill = USAGE_LIMITS.BASE_MONTHLY_FEE + totalOverage;

  return {
    baseCharge: USAGE_LIMITS.BASE_MONTHLY_FEE,
    overageCharges,
    totalOverage,
    totalBill,
  };
}

/**
 * Check if usage is approaching or exceeding limits
 */
export function checkUsageAlerts(usage: {
  databaseStorageMB: number;
  bandwidthGB: number;
  ordersCount: number;
  staffCount: number;
}): {
  alerts: Array<{
    resource: string;
    level: 'warning' | 'critical' | 'exceeded';
    percentage: number;
    current: number;
    limit: number;
    message: string;
  }>;
} {
  const alerts: Array<{
    resource: string;
    level: 'warning' | 'critical' | 'exceeded';
    percentage: number;
    current: number;
    limit: number;
    message: string;
  }> = [];

  // Check database storage
  const storagePercentage = usage.databaseStorageMB / USAGE_LIMITS.DATABASE_STORAGE_MB;
  if (storagePercentage >= USAGE_ALERT_THRESHOLDS.WARNING) {
    alerts.push({
      resource: 'Database Storage',
      level: storagePercentage >= USAGE_ALERT_THRESHOLDS.EXCEEDED ? 'exceeded'
           : storagePercentage >= USAGE_ALERT_THRESHOLDS.CRITICAL ? 'critical'
           : 'warning',
      percentage: Math.round(storagePercentage * 100),
      current: usage.databaseStorageMB,
      limit: USAGE_LIMITS.DATABASE_STORAGE_MB,
      message: `Database storage at ${Math.round(storagePercentage * 100)}% (${usage.databaseStorageMB}MB / ${USAGE_LIMITS.DATABASE_STORAGE_MB}MB)`,
    });
  }

  // Check bandwidth
  const bandwidthPercentage = usage.bandwidthGB / USAGE_LIMITS.BANDWIDTH_GB;
  if (bandwidthPercentage >= USAGE_ALERT_THRESHOLDS.WARNING) {
    alerts.push({
      resource: 'Bandwidth',
      level: bandwidthPercentage >= USAGE_ALERT_THRESHOLDS.EXCEEDED ? 'exceeded'
           : bandwidthPercentage >= USAGE_ALERT_THRESHOLDS.CRITICAL ? 'critical'
           : 'warning',
      percentage: Math.round(bandwidthPercentage * 100),
      current: usage.bandwidthGB,
      limit: USAGE_LIMITS.BANDWIDTH_GB,
      message: `Bandwidth at ${Math.round(bandwidthPercentage * 100)}% (${usage.bandwidthGB}GB / ${USAGE_LIMITS.BANDWIDTH_GB}GB)`,
    });
  }

  // Check orders
  const ordersPercentage = usage.ordersCount / USAGE_LIMITS.ORDERS_PER_MONTH;
  if (ordersPercentage >= USAGE_ALERT_THRESHOLDS.WARNING) {
    alerts.push({
      resource: 'Orders',
      level: ordersPercentage >= USAGE_ALERT_THRESHOLDS.EXCEEDED ? 'exceeded'
           : ordersPercentage >= USAGE_ALERT_THRESHOLDS.CRITICAL ? 'critical'
           : 'warning',
      percentage: Math.round(ordersPercentage * 100),
      current: usage.ordersCount,
      limit: USAGE_LIMITS.ORDERS_PER_MONTH,
      message: `Orders at ${Math.round(ordersPercentage * 100)}% (${usage.ordersCount} / ${USAGE_LIMITS.ORDERS_PER_MONTH})`,
    });
  }

  // Check staff accounts
  const staffPercentage = usage.staffCount / USAGE_LIMITS.STAFF_ACCOUNTS;
  if (staffPercentage >= USAGE_ALERT_THRESHOLDS.WARNING) {
    alerts.push({
      resource: 'Staff Accounts',
      level: staffPercentage >= USAGE_ALERT_THRESHOLDS.EXCEEDED ? 'exceeded'
           : staffPercentage >= USAGE_ALERT_THRESHOLDS.CRITICAL ? 'critical'
           : 'warning',
      percentage: Math.round(staffPercentage * 100),
      current: usage.staffCount,
      limit: USAGE_LIMITS.STAFF_ACCOUNTS,
      message: `Staff accounts at ${Math.round(staffPercentage * 100)}% (${usage.staffCount} / ${USAGE_LIMITS.STAFF_ACCOUNTS})`,
    });
  }

  return { alerts };
}
