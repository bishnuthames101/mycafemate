/**
 * Subscription Notification Service
 *
 * Checks master database for subscription-related events and creates
 * notifications in tenant databases
 */

import { getMasterPrisma } from "@/lib/prisma-multi-tenant";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { createNotification } from "./notification-service";
import { createLogger } from "@/lib/utils/logger";

const log = createLogger('[Subscriptions]');

/**
 * Check for trials expiring soon and create notifications
 * Should be run daily via cron job
 */
export async function checkTrialExpirations() {
  const masterPrisma = getMasterPrisma();

  try {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Find tenants with trials expiring in 7, 3, or 1 day
    const expiringTrials = await masterPrisma.tenant.findMany({
      where: {
        subscriptionStatus: "TRIAL",
        trialEndsAt: {
          lte: sevenDaysFromNow,
          gt: now,
        },
      },
    });

    for (const tenant of expiringTrials) {
      if (!tenant.trialEndsAt) continue;

      const daysUntilExpiry = Math.ceil(
        (tenant.trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Only notify at 7, 3, and 1 day marks
      if (![7, 3, 1].includes(daysUntilExpiry)) continue;

      try {
        const tenantPrisma = await getTenantPrisma(tenant.slug);

        // Create notification in tenant database
        await createNotification(tenantPrisma, {
          type: "TRIAL_EXPIRING_SOON",
          title: "Trial Expiring Soon",
          message: `Your trial period will expire in ${daysUntilExpiry} day${
            daysUntilExpiry > 1 ? "s" : ""
          }. Please subscribe to continue using My-CafeMate.`,
          priority: daysUntilExpiry === 1 ? "URGENT" : "HIGH",
          metadata: {
            trialEndsAt: tenant.trialEndsAt.toISOString(),
            daysRemaining: daysUntilExpiry,
            subscriptionTier: tenant.subscriptionTier,
            monthlyFee: tenant.monthlyFee,
          },
        });

        log.info(
          `Trial expiration notification created for ${tenant.businessName} (${daysUntilExpiry} days)`
        );
      } catch (error) {
        log.error(
          `Failed to create trial notification for ${tenant.slug}`,
          error instanceof Error ? error : undefined
        );
      }
    }

    // Find expired trials (just expired today)
    const expiredTrials = await masterPrisma.tenant.findMany({
      where: {
        subscriptionStatus: "TRIAL",
        trialEndsAt: {
          lte: now,
          gte: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    });

    for (const tenant of expiredTrials) {
      try {
        const tenantPrisma = await getTenantPrisma(tenant.slug);

        await createNotification(tenantPrisma, {
          type: "TRIAL_EXPIRED",
          title: "Trial Period Expired",
          message:
            "Your trial period has expired. Please subscribe to continue using My-CafeMate and access all features.",
          priority: "URGENT",
          metadata: {
            trialEndedAt: tenant.trialEndsAt?.toISOString(),
            subscriptionTier: tenant.subscriptionTier,
            monthlyFee: tenant.monthlyFee,
          },
        });

        log.info(
          `Trial expired notification created for ${tenant.businessName}`
        );
      } catch (error) {
        log.error(
          `Failed to create trial expired notification for ${tenant.slug}`,
          error instanceof Error ? error : undefined
        );
      }
    }

    return {
      expiringSoon: expiringTrials.length,
      expired: expiredTrials.length,
    };
  } catch (error) {
    log.error("Error checking trial expirations", error instanceof Error ? error : undefined);
    throw error;
  }
}

/**
 * Check for upcoming payments and create notifications
 * Should be run daily via cron job
 */
export async function checkPaymentsDue() {
  const masterPrisma = getMasterPrisma();

  try {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Find tenants with payments due soon
    const paymentsDue = await masterPrisma.tenant.findMany({
      where: {
        subscriptionStatus: "ACTIVE",
        nextPaymentDue: {
          lte: sevenDaysFromNow,
          gt: now,
        },
      },
    });

    for (const tenant of paymentsDue) {
      if (!tenant.nextPaymentDue) continue;

      const daysUntilDue = Math.ceil(
        (tenant.nextPaymentDue.getTime() - now.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      // Only notify at 7, 3, and 1 day marks
      if (![7, 3, 1].includes(daysUntilDue)) continue;

      try {
        const tenantPrisma = await getTenantPrisma(tenant.slug);

        await createNotification(tenantPrisma, {
          type: "PAYMENT_DUE",
          title: "Payment Due Soon",
          message: `Your subscription payment of NPR ${tenant.monthlyFee} is due in ${daysUntilDue} day${
            daysUntilDue > 1 ? "s" : ""
          }. Please ensure timely payment to avoid service interruption.`,
          priority: daysUntilDue === 1 ? "URGENT" : "HIGH",
          metadata: {
            nextPaymentDue: tenant.nextPaymentDue.toISOString(),
            daysUntilDue,
            amount: tenant.monthlyFee,
            subscriptionTier: tenant.subscriptionTier,
          },
        });

        log.info(
          `Payment due notification created for ${tenant.businessName} (${daysUntilDue} days)`
        );
      } catch (error) {
        log.error(
          `Failed to create payment due notification for ${tenant.slug}`,
          error instanceof Error ? error : undefined
        );
      }
    }

    // Find overdue payments
    const overduePayments = await masterPrisma.tenant.findMany({
      where: {
        subscriptionStatus: {
          in: ["ACTIVE", "PAYMENT_DUE"],
        },
        nextPaymentDue: {
          lt: now,
        },
      },
    });

    for (const tenant of overduePayments) {
      if (!tenant.nextPaymentDue) continue;

      const daysOverdue = Math.ceil(
        (now.getTime() - tenant.nextPaymentDue.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      try {
        const tenantPrisma = await getTenantPrisma(tenant.slug);

        await createNotification(tenantPrisma, {
          type: "PAYMENT_OVERDUE",
          title: "Payment Overdue",
          message: `Your subscription payment of NPR ${tenant.monthlyFee} is ${daysOverdue} day${
            daysOverdue > 1 ? "s" : ""
          } overdue. Please make payment immediately to avoid service suspension.`,
          priority: "URGENT",
          metadata: {
            nextPaymentDue: tenant.nextPaymentDue.toISOString(),
            daysOverdue,
            amount: tenant.monthlyFee,
            subscriptionTier: tenant.subscriptionTier,
          },
        });

        log.info(
          `Payment overdue notification created for ${tenant.businessName} (${daysOverdue} days overdue)`
        );
      } catch (error) {
        log.error(
          `Failed to create payment overdue notification for ${tenant.slug}`,
          error instanceof Error ? error : undefined
        );
      }
    }

    return {
      upcomingPayments: paymentsDue.length,
      overduePayments: overduePayments.length,
    };
  } catch (error) {
    log.error("Error checking payments due", error instanceof Error ? error : undefined);
    throw error;
  }
}

/**
 * Check usage limits and create warnings
 * Should be run daily via cron job
 */
export async function checkUsageLimits() {
  const masterPrisma = getMasterPrisma();

  try {
    // Find tenants approaching or exceeding limits
    const tenants = await masterPrisma.tenant.findMany({
      where: {
        status: "ACTIVE",
      },
    });

    let warningsCreated = 0;

    for (const tenant of tenants) {
      const warnings: Array<{
        type: string;
        resourceType: string;
        currentUsage: number;
        limit: number;
        percentage: number;
      }> = [];

      // Check DB size
      const dbUsagePercent = (tenant.currentDbSizeMB / tenant.maxDbSizeMB) * 100;
      if (dbUsagePercent >= 80) {
        warnings.push({
          type: dbUsagePercent >= 100 ? "DB_LIMIT_EXCEEDED" : "USAGE_LIMIT_WARNING",
          resourceType: "Database Size",
          currentUsage: tenant.currentDbSizeMB,
          limit: tenant.maxDbSizeMB,
          percentage: Math.round(dbUsagePercent),
        });
      }

      // Create notifications for warnings
      if (warnings.length > 0) {
        try {
          const tenantPrisma = await getTenantPrisma(tenant.slug);

          for (const warning of warnings) {
            const isExceeded = warning.percentage >= 100;

            await createNotification(tenantPrisma, {
              type: warning.type as any,
              title: isExceeded
                ? `${warning.resourceType} Limit Exceeded`
                : `${warning.resourceType} Limit Warning`,
              message: isExceeded
                ? `You have exceeded your ${warning.resourceType.toLowerCase()} limit (${
                    warning.currentUsage
                  }MB / ${warning.limit}MB). Please upgrade your plan or reduce usage.`
                : `You are using ${warning.percentage}% of your ${warning.resourceType.toLowerCase()} limit (${
                    warning.currentUsage
                  }MB / ${warning.limit}MB).`,
              priority: isExceeded ? "URGENT" : warning.percentage >= 90 ? "HIGH" : "NORMAL",
              metadata: {
                resourceType: warning.resourceType,
                currentUsage: warning.currentUsage,
                limit: warning.limit,
                percentage: warning.percentage,
                subscriptionTier: tenant.subscriptionTier,
              },
            });

            warningsCreated++;
          }

          log.info(
            `${warnings.length} usage warning(s) created for ${tenant.businessName}`
          );
        } catch (error) {
          log.error(
            `Failed to create usage warnings for ${tenant.slug}`,
            error instanceof Error ? error : undefined
          );
        }
      }
    }

    return { warningsCreated };
  } catch (error) {
    log.error("Error checking usage limits", error instanceof Error ? error : undefined);
    throw error;
  }
}

/**
 * Notify about subscription changes (manual trigger from admin panel)
 */
export async function notifySubscriptionChange(
  tenantSlug: string,
  changeType: "SUBSCRIPTION_RENEWED" | "SUBSCRIPTION_UPGRADED" | "SUBSCRIPTION_DOWNGRADED",
  metadata: {
    oldTier?: string;
    newTier?: string;
    amount?: number;
    effectiveDate?: Date;
  }
) {
  try {
    const tenantPrisma = await getTenantPrisma(tenantSlug);

    const messages = {
      SUBSCRIPTION_RENEWED: `Your subscription has been renewed successfully. Thank you for continuing with My-CafeMate!`,
      SUBSCRIPTION_UPGRADED: `Your subscription has been upgraded to ${metadata.newTier}. Enjoy your new features!`,
      SUBSCRIPTION_DOWNGRADED: `Your subscription has been changed to ${metadata.newTier}.`,
    };

    await createNotification(tenantPrisma, {
      type: changeType,
      title:
        changeType === "SUBSCRIPTION_RENEWED"
          ? "Subscription Renewed"
          : changeType === "SUBSCRIPTION_UPGRADED"
          ? "Plan Upgraded"
          : "Plan Changed",
      message: messages[changeType],
      priority: "NORMAL",
      metadata,
    });

    log.info(`Subscription change notification created for ${tenantSlug}`);
  } catch (error) {
    log.error(`Failed to create subscription notification for ${tenantSlug}`, error instanceof Error ? error : undefined);
    throw error;
  }
}

/**
 * Run all subscription checks (for cron job)
 */
export async function runAllSubscriptionChecks() {
  log.info("Running subscription notification checks...");

  try {
    // CRITICAL: Import status-changing functions
    const {
      checkTrialExpiry,
      markOverduePayments,
      suspendOverdueAccounts
    } = await import("@/lib/services/subscription-management");

    // Step 1: Check and suspend expired trials
    log.info("Checking expired trials...");
    const expiredTrials = await checkTrialExpiry();
    log.info(`${expiredTrials.expiredCount} trials expired and suspended`);

    // Step 2: Mark overdue payments (5-day grace period) - BLOCKS ACCESS
    log.info("Marking overdue payments...");
    const overdueCount = await markOverduePayments(5);
    log.info(`${overdueCount} accounts marked as PAYMENT_DUE (access blocked)`);

    // Step 3: Suspend severely overdue accounts (15+ days)
    log.info("Suspending severely overdue accounts...");
    const suspendedCount = await suspendOverdueAccounts(15);
    log.info(`${suspendedCount} accounts suspended`);

    // Step 4: Create notifications for upcoming payments and trials
    log.info("Creating notifications...");
    const [trials, payments, usage] = await Promise.all([
      checkTrialExpirations(),
      checkPaymentsDue(),
      checkUsageLimits(),
    ]);

    log.info("Subscription checks completed", {
      trialsExpired: expiredTrials.expiredCount,
      paymentsMarkedOverdue: overdueCount,
      accountsSuspended: suspendedCount,
      notifications: { trials, payments, usage },
    });

    return {
      trialsExpired: expiredTrials.expiredCount,
      paymentsMarkedOverdue: overdueCount,
      accountsSuspended: suspendedCount,
      trials,
      payments,
      usage
    };
  } catch (error) {
    log.error("Error running subscription checks", error instanceof Error ? error : undefined);
    throw error;
  }
}
