/**
 * Subscription Management Service
 *
 * Handles subscription lifecycle, payment tracking, and trial management:
 * - Trial expiry checking
 * - Payment recording
 * - Subscription activation/suspension
 * - Upcoming payment tracking
 */

import { getMasterPrisma } from "@/lib/prisma-multi-tenant";
import { logger } from '@/lib/utils/logger';

export interface PaymentInput {
  tenantId: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: string;
  referenceNumber?: string;
  billingPeriodStart: Date;
  billingPeriodEnd: Date;
  notes?: string;
  receivedBy: string; // Super admin email
}

export interface TrialExpiryResult {
  expiredCount: number;
  expiredTenants: string[]; // Tenant slugs
}

/**
 * Check for expired trials and suspend tenants
 * Run this daily via cron job
 *
 * @returns Number of tenants suspended
 */
export async function checkTrialExpiry(): Promise<TrialExpiryResult> {
  const masterPrisma = getMasterPrisma();

  try {
    // Find all tenants with expired trials
    const expiredTrials = await masterPrisma.tenant.findMany({
      where: {
        subscriptionStatus: "TRIAL",
        trialEndsAt: {
          lte: new Date(), // Trial end date is in the past
        },
        status: "ACTIVE", // Only active tenants
      },
    });

    if (expiredTrials.length === 0) {
      logger.info("No expired trials found");
      return { expiredCount: 0, expiredTenants: [] };
    }

    logger.info(`Found ${expiredTrials.length} expired trials`);

    // Suspend each expired tenant
    const expiredSlugs: string[] = [];

    for (const tenant of expiredTrials) {
      await masterPrisma.tenant.update({
        where: { id: tenant.id },
        data: {
          status: "TRIAL_EXPIRED",
          subscriptionStatus: "EXPIRED",
          suspendedAt: new Date(),
        },
      });

      // Log activity
      await masterPrisma.tenantActivityLog.create({
        data: {
          tenantId: tenant.id,
          action: "TRIAL_EXPIRED",
          details: {
            message: "Trial period expired - tenant suspended",
            trialEndsAt: tenant.trialEndsAt,
            daysActive: Math.floor(
              (new Date().getTime() - tenant.createdAt.getTime()) / (1000 * 60 * 60 * 24)
            ),
          },
        },
      });

      expiredSlugs.push(tenant.slug);
      logger.info(`Suspended: ${tenant.slug} (trial expired)`);

      // TODO: Send email notification to contact email
      // await sendTrialExpiryEmail(tenant.contactEmail, tenant.businessName);
    }

    return {
      expiredCount: expiredTrials.length,
      expiredTenants: expiredSlugs,
    };
  } catch (error: any) {
    logger.error("Trial expiry check failed:", error instanceof Error ? error : undefined);
    throw error;
  }
}

/**
 * Record a manual payment and activate subscription
 *
 * @param payment Payment details
 * @returns Payment record ID
 */
export async function recordPayment(payment: PaymentInput): Promise<string> {
  const masterPrisma = getMasterPrisma();

  try {
    // Get tenant
    const tenant = await masterPrisma.tenant.findUnique({
      where: { id: payment.tenantId },
    });

    if (!tenant) {
      throw new Error("Tenant not found");
    }

    // Create payment record
    const paymentRecord = await masterPrisma.paymentRecord.create({
      data: {
        tenantId: payment.tenantId,
        amount: payment.amount,
        paymentDate: payment.paymentDate,
        paymentMethod: payment.paymentMethod,
        referenceNumber: payment.referenceNumber,
        billingPeriodStart: payment.billingPeriodStart,
        billingPeriodEnd: payment.billingPeriodEnd,
        notes: payment.notes,
        receivedBy: payment.receivedBy,
      },
    });

    // Calculate next payment due (day after billing period ends)
    // This ensures payment must be made in advance for the next billing period
    const nextPaymentDue = new Date(payment.billingPeriodEnd);
    nextPaymentDue.setDate(nextPaymentDue.getDate() + 1);

    // Update tenant subscription
    await masterPrisma.tenant.update({
      where: { id: payment.tenantId },
      data: {
        subscriptionStatus: "ACTIVE",
        status: "ACTIVE",
        lastPaymentDate: payment.paymentDate,
        lastPaymentAmount: payment.amount,
        nextPaymentDue: nextPaymentDue,
        billingCycleStart: payment.billingPeriodStart,
        billingCycleEnd: payment.billingPeriodEnd,
        suspendedAt: null, // Clear suspension
        activatedAt: tenant.activatedAt || new Date(), // Set if first payment
      },
    });

    // Log activity
    await masterPrisma.tenantActivityLog.create({
      data: {
        tenantId: payment.tenantId,
        action: "PAYMENT_RECEIVED",
        details: {
          amount: payment.amount,
          paymentMethod: payment.paymentMethod,
          referenceNumber: payment.referenceNumber,
          billingPeriod: {
            start: payment.billingPeriodStart,
            end: payment.billingPeriodEnd,
          },
          nextPaymentDue: nextPaymentDue,
        },
      },
    });

    logger.info(`Payment recorded: ${tenant.slug} - NPR ${payment.amount}`);

    return paymentRecord.id;
  } catch (error: any) {
    logger.error("Payment recording failed:", error instanceof Error ? error : undefined);
    throw error;
  }
}

/**
 * Get tenants with upcoming payments (next N days)
 *
 * @param days Number of days to look ahead (default 7)
 * @returns Tenants with payments due soon
 */
export async function getUpcomingDues(days: number = 7) {
  const masterPrisma = getMasterPrisma();

  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  return await masterPrisma.tenant.findMany({
    where: {
      subscriptionStatus: "ACTIVE",
      status: "ACTIVE",
      nextPaymentDue: {
        gte: new Date(),
        lte: futureDate,
      },
    },
    select: {
      id: true,
      slug: true,
      businessName: true,
      contactEmail: true,
      contactPhone: true,
      nextPaymentDue: true,
      monthlyFee: true,
      subscriptionTier: true,
    },
    orderBy: {
      nextPaymentDue: "asc",
    },
  });
}

/**
 * Get overdue payments (payment due date passed)
 *
 * @returns Tenants with overdue payments
 */
export async function getOverduePayments() {
  const masterPrisma = getMasterPrisma();

  return await masterPrisma.tenant.findMany({
    where: {
      subscriptionStatus: "ACTIVE",
      status: "ACTIVE",
      nextPaymentDue: {
        lt: new Date(), // Payment due date is in the past
      },
    },
    select: {
      id: true,
      slug: true,
      businessName: true,
      contactEmail: true,
      contactPhone: true,
      nextPaymentDue: true,
      monthlyFee: true,
      lastPaymentDate: true,
    },
    orderBy: {
      nextPaymentDue: "asc",
    },
  });
}

/**
 * Mark overdue tenants as PAYMENT_DUE status
 * Run this daily to update tenant statuses
 *
 * @param gracePeriodDays Number of days grace period (default 5)
 * @returns Number of tenants marked as payment due
 */
export async function markOverduePayments(gracePeriodDays: number = 5): Promise<number> {
  const masterPrisma = getMasterPrisma();

  // Find tenants overdue by more than grace period
  const graceDate = new Date();
  graceDate.setDate(graceDate.getDate() - gracePeriodDays);

  const overdueTenants = await masterPrisma.tenant.findMany({
    where: {
      subscriptionStatus: "ACTIVE",
      status: "ACTIVE",
      nextPaymentDue: {
        lt: graceDate,
      },
    },
  });

  if (overdueTenants.length === 0) {
    return 0;
  }

  // Update to PAYMENT_DUE status
  for (const tenant of overdueTenants) {
    await masterPrisma.tenant.update({
      where: { id: tenant.id },
      data: {
        subscriptionStatus: "PAYMENT_DUE",
      },
    });

    await masterPrisma.tenantActivityLog.create({
      data: {
        tenantId: tenant.id,
        action: "PAYMENT_OVERDUE",
        details: {
          message: `Payment overdue by ${gracePeriodDays} days`,
          dueDate: tenant.nextPaymentDue,
          daysOverdue: Math.floor(
            (new Date().getTime() - tenant.nextPaymentDue!.getTime()) / (1000 * 60 * 60 * 24)
          ),
        },
      },
    });

    logger.warn(`Payment overdue: ${tenant.slug}`);
  }

  return overdueTenants.length;
}

/**
 * Suspend tenants with severely overdue payments
 *
 * @param daysOverdue Days overdue before suspension (default 15)
 * @returns Number of tenants suspended
 */
export async function suspendOverdueAccounts(daysOverdue: number = 15): Promise<number> {
  const masterPrisma = getMasterPrisma();

  const suspensionDate = new Date();
  suspensionDate.setDate(suspensionDate.getDate() - daysOverdue);

  const severelyOverdue = await masterPrisma.tenant.findMany({
    where: {
      subscriptionStatus: "PAYMENT_DUE",
      status: "ACTIVE",
      nextPaymentDue: {
        lt: suspensionDate,
      },
    },
  });

  if (severelyOverdue.length === 0) {
    return 0;
  }

  for (const tenant of severelyOverdue) {
    await masterPrisma.tenant.update({
      where: { id: tenant.id },
      data: {
        status: "SUSPENDED",
        suspendedAt: new Date(),
      },
    });

    await masterPrisma.tenantActivityLog.create({
      data: {
        tenantId: tenant.id,
        action: "SUSPENDED_NONPAYMENT",
        details: {
          message: `Account suspended for non-payment (${daysOverdue} days overdue)`,
          dueDate: tenant.nextPaymentDue,
          daysOverdue: Math.floor(
            (new Date().getTime() - tenant.nextPaymentDue!.getTime()) / (1000 * 60 * 60 * 24)
          ),
        },
      },
    });

    logger.info(`Suspended for non-payment: ${tenant.slug}`);
  }

  return severelyOverdue.length;
}

/**
 * Get payment statistics for a tenant
 *
 * @param tenantId Tenant ID
 * @returns Payment statistics
 */
export async function getTenantPaymentStats(tenantId: string) {
  const masterPrisma = getMasterPrisma();

  const [totalPaid, paymentCount, lastPayment] = await Promise.all([
    masterPrisma.paymentRecord.aggregate({
      where: { tenantId },
      _sum: { amount: true },
    }),
    masterPrisma.paymentRecord.count({
      where: { tenantId },
    }),
    masterPrisma.paymentRecord.findFirst({
      where: { tenantId },
      orderBy: { paymentDate: "desc" },
    }),
  ]);

  return {
    totalPaid: totalPaid._sum.amount || 0,
    paymentCount,
    lastPayment: lastPayment
      ? {
          amount: lastPayment.amount,
          date: lastPayment.paymentDate,
          method: lastPayment.paymentMethod,
        }
      : null,
  };
}

/**
 * Get subscription renewal date
 *
 * @param tenantId Tenant ID
 * @returns Renewal date and status
 */
export async function getSubscriptionRenewalInfo(tenantId: string) {
  const masterPrisma = getMasterPrisma();

  const tenant = await masterPrisma.tenant.findUnique({
    where: { id: tenantId },
    select: {
      subscriptionStatus: true,
      subscriptionTier: true,
      trialEndsAt: true,
      nextPaymentDue: true,
      billingCycleEnd: true,
      monthlyFee: true,
    },
  });

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  let renewalDate: Date | null = null;
  let daysUntilRenewal: number | null = null;

  if (tenant.subscriptionStatus === "TRIAL") {
    renewalDate = tenant.trialEndsAt;
  } else if (tenant.subscriptionStatus === "ACTIVE") {
    renewalDate = tenant.nextPaymentDue;
  }

  if (renewalDate) {
    daysUntilRenewal = Math.floor(
      (renewalDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  return {
    renewalDate,
    daysUntilRenewal,
    subscriptionStatus: tenant.subscriptionStatus,
    subscriptionTier: tenant.subscriptionTier,
    monthlyFee: tenant.monthlyFee,
    isOverdue: daysUntilRenewal !== null && daysUntilRenewal < 0,
  };
}
