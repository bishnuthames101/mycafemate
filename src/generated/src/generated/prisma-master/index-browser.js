
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.15.0
 * Query Engine version: 12e25d8d06f6ea5a0252864dd9a03b1bb51f3022
 */
Prisma.prismaVersion = {
  client: "5.15.0",
  engine: "12e25d8d06f6ea5a0252864dd9a03b1bb51f3022"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.TenantScalarFieldEnum = {
  id: 'id',
  slug: 'slug',
  businessName: 'businessName',
  contactName: 'contactName',
  contactEmail: 'contactEmail',
  contactPhone: 'contactPhone',
  databaseUrl: 'databaseUrl',
  databaseHost: 'databaseHost',
  databaseName: 'databaseName',
  subscriptionTier: 'subscriptionTier',
  subscriptionStatus: 'subscriptionStatus',
  trialEndsAt: 'trialEndsAt',
  billingCycleStart: 'billingCycleStart',
  billingCycleEnd: 'billingCycleEnd',
  monthlyFee: 'monthlyFee',
  lastPaymentDate: 'lastPaymentDate',
  lastPaymentAmount: 'lastPaymentAmount',
  nextPaymentDue: 'nextPaymentDue',
  paymentNotes: 'paymentNotes',
  customStorageLimitMB: 'customStorageLimitMB',
  customBandwidthLimitGB: 'customBandwidthLimitGB',
  customOrdersLimit: 'customOrdersLimit',
  customStaffLimit: 'customStaffLimit',
  hasPrioritySupport: 'hasPrioritySupport',
  currentStorageUsageMB: 'currentStorageUsageMB',
  currentBandwidthGB: 'currentBandwidthGB',
  currentMonthOrders: 'currentMonthOrders',
  currentStaffCount: 'currentStaffCount',
  lastBillingCalculation: 'lastBillingCalculation',
  lastMonthOverageCharges: 'lastMonthOverageCharges',
  lastMonthTotalBill: 'lastMonthTotalBill',
  status: 'status',
  isActive: 'isActive',
  maxLocations: 'maxLocations',
  maxUsers: 'maxUsers',
  maxDbSizeMB: 'maxDbSizeMB',
  maxApiRequests: 'maxApiRequests',
  maxStorageMB: 'maxStorageMB',
  currentDbSizeMB: 'currentDbSizeMB',
  currentStorageMB: 'currentStorageMB',
  dbLimitExceeded: 'dbLimitExceeded',
  apiLimitExceeded: 'apiLimitExceeded',
  limitExceededAt: 'limitExceededAt',
  features: 'features',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  activatedAt: 'activatedAt',
  suspendedAt: 'suspendedAt'
};

exports.Prisma.PaymentRecordScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  amount: 'amount',
  paymentDate: 'paymentDate',
  paymentMethod: 'paymentMethod',
  referenceNumber: 'referenceNumber',
  billingPeriodStart: 'billingPeriodStart',
  billingPeriodEnd: 'billingPeriodEnd',
  notes: 'notes',
  receivedBy: 'receivedBy',
  createdAt: 'createdAt'
};

exports.Prisma.SuperAdminScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  password: 'password',
  role: 'role',
  isActive: 'isActive',
  failedLoginAttempts: 'failedLoginAttempts',
  lockedUntil: 'lockedUntil',
  lastFailedLogin: 'lastFailedLogin',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  lastLoginAt: 'lastLoginAt'
};

exports.Prisma.TenantActivityLogScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  action: 'action',
  performedBy: 'performedBy',
  details: 'details',
  ipAddress: 'ipAddress',
  createdAt: 'createdAt'
};

exports.Prisma.TenantMetricsScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  date: 'date',
  totalRevenue: 'totalRevenue',
  totalOrders: 'totalOrders',
  activeUsers: 'activeUsers',
  activeLocations: 'activeLocations',
  createdAt: 'createdAt'
};

exports.Prisma.TenantUsageScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  date: 'date',
  dbSizeMB: 'dbSizeMB',
  dbSizeBytes: 'dbSizeBytes',
  apiRequests: 'apiRequests',
  apiRequestsByEndpoint: 'apiRequestsByEndpoint',
  storageSizeMB: 'storageSizeMB',
  dbOverage: 'dbOverage',
  apiOverage: 'apiOverage',
  overageAmount: 'overageAmount',
  recordedAt: 'recordedAt',
  createdAt: 'createdAt'
};

exports.Prisma.UsageAlertScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  resource: 'resource',
  level: 'level',
  percentage: 'percentage',
  current: 'current',
  limit: 'limit',
  message: 'message',
  isRead: 'isRead',
  isSent: 'isSent',
  sentAt: 'sentAt',
  createdAt: 'createdAt',
  resolvedAt: 'resolvedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.SubscriptionTier = exports.$Enums.SubscriptionTier = {
  FREE_TRIAL: 'FREE_TRIAL',
  BASIC: 'BASIC',
  STANDARD: 'STANDARD',
  PREMIUM: 'PREMIUM'
};

exports.SubscriptionStatus = exports.$Enums.SubscriptionStatus = {
  TRIAL: 'TRIAL',
  ACTIVE: 'ACTIVE',
  PAYMENT_DUE: 'PAYMENT_DUE',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED'
};

exports.TenantStatus = exports.$Enums.TenantStatus = {
  PROVISIONING: 'PROVISIONING',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  TRIAL_EXPIRED: 'TRIAL_EXPIRED',
  CANCELLED: 'CANCELLED',
  ARCHIVED: 'ARCHIVED'
};

exports.SuperAdminRole = exports.$Enums.SuperAdminRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  OPERATOR: 'OPERATOR',
  SUPPORT: 'SUPPORT'
};

exports.Prisma.ModelName = {
  Tenant: 'Tenant',
  PaymentRecord: 'PaymentRecord',
  SuperAdmin: 'SuperAdmin',
  TenantActivityLog: 'TenantActivityLog',
  TenantMetrics: 'TenantMetrics',
  TenantUsage: 'TenantUsage',
  UsageAlert: 'UsageAlert'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
