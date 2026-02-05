import { PrismaClient } from "@prisma/client";
import { PrismaClient as MasterPrismaClient } from "../generated/prisma-master";
import crypto from "crypto";

// ============= MASTER DATABASE =============

// Use globalThis to persist across hot reloads in development
const globalForMasterPrisma = globalThis as unknown as {
  masterPrisma: MasterPrismaClient | undefined;
};

/**
 * Get master database client (for super admin operations)
 * Singleton pattern - one connection for the app lifecycle
 * Persists across Next.js hot reloads in development
 */
export function getMasterPrisma(): MasterPrismaClient {
  if (!globalForMasterPrisma.masterPrisma) {
    // Add connection pooling to master DB URL
    const masterUrl = process.env.MASTER_DATABASE_URL || '';
    const poolParams = 'connection_limit=40&pool_timeout=30&connect_timeout=20';
    const urlWithPooling = masterUrl.includes('?')
      ? `${masterUrl}&${poolParams}`
      : `${masterUrl}?${poolParams}`;

    globalForMasterPrisma.masterPrisma = new MasterPrismaClient({
      datasources: {
        db: {
          url: urlWithPooling,
        },
      },
      log: process.env.NODE_ENV === 'development' ? ['error'] : [],
    });
  }
  return globalForMasterPrisma.masterPrisma;
}

// ============= TENANT DATABASE =============

// Use globalThis to persist cache across hot reloads in development
const globalForTenantClients = globalThis as unknown as {
  tenantPrismaClients: Map<string, PrismaClient> | undefined;
  connectionCount: number | undefined;
};

// Cache for tenant database connections - persists in development
const tenantPrismaClients = globalForTenantClients.tenantPrismaClients ?? new Map<string, PrismaClient>();
if (!globalForTenantClients.tenantPrismaClients) {
  globalForTenantClients.tenantPrismaClients = tenantPrismaClients;
}

// Track connection count for monitoring - persists in development
let connectionCount = globalForTenantClients.connectionCount ?? 0;
const MAX_CONNECTIONS = 100; // Increased for Supabase Pro (500 connections available)

/**
 * Get Prisma client for a specific tenant
 * Manages connection pooling and lazy initialization
 *
 * @param tenantSlug - The tenant identifier (e.g., "cafe-abc")
 * @returns Prisma client connected to the tenant's database
 * @throws Error if tenant not found or inactive
 */
export async function getTenantPrisma(
  tenantSlug: string
): Promise<PrismaClient> {
  // Check cache first
  if (tenantPrismaClients.has(tenantSlug)) {
    return tenantPrismaClients.get(tenantSlug)!;
  }

  // Enforce connection limit
  if (connectionCount >= MAX_CONNECTIONS) {
    throw new Error(
      `Maximum tenant connections (${MAX_CONNECTIONS}) reached. Please try again later.`
    );
  }

  // Fetch tenant connection details from master DB
  const masterPrisma = getMasterPrisma();
  const tenant = await masterPrisma.tenant.findUnique({
    where: { slug: tenantSlug },
    select: {
      id: true,
      databaseUrl: true,
      status: true,
      isActive: true,
      subscriptionStatus: true,
      businessName: true,
      nextPaymentDue: true,
    },
  });

  if (!tenant) {
    throw new Error(`Tenant '${tenantSlug}' not found`);
  }

  if (!tenant.isActive) {
    throw new Error(
      `Your account is inactive. Please contact support.`
    );
  }

  // ============= SUBSCRIPTION STATUS VALIDATION =============
  // Block access if subscription is not active or in trial
  const allowedSubscriptionStatuses = ["ACTIVE", "TRIAL"];
  const allowedTenantStatuses = ["ACTIVE", "PROVISIONING"];

  // Check subscription status
  if (!allowedSubscriptionStatuses.includes(tenant.subscriptionStatus)) {
    let message = "";

    if (tenant.subscriptionStatus === "PAYMENT_DUE") {
      const dueDate = tenant.nextPaymentDue
        ? new Date(tenant.nextPaymentDue).toLocaleDateString()
        : "unknown";
      message = `Payment is overdue. Please contact support or make a payment to reactivate your account. Payment was due: ${dueDate}`;
    } else if (tenant.subscriptionStatus === "EXPIRED") {
      message = "Your subscription has expired. Please contact support to renew your subscription.";
    } else if (tenant.subscriptionStatus === "CANCELLED") {
      message = "Your subscription has been cancelled. Please contact support to reactivate.";
    } else {
      message = "Your subscription is not active. Please contact support.";
    }

    throw new Error(message);
  }

  // Check tenant status
  if (!allowedTenantStatuses.includes(tenant.status)) {
    let message = "";

    if (tenant.status === "SUSPENDED") {
      message = "Your account has been suspended. Please contact support for assistance.";
    } else if (tenant.status === "TRIAL_EXPIRED") {
      message = "Your free trial has expired. Please contact support to activate your subscription.";
    } else if (tenant.status === "CANCELLED") {
      message = "Your account has been cancelled. Please contact support.";
    } else if (tenant.status === "ARCHIVED") {
      message = "Your account has been archived. Please contact support.";
    } else {
      message = `Your account is not accessible (status: ${tenant.status}). Please contact support.`;
    }

    throw new Error(message);
  }

  // Decrypt database URL
  const decryptedUrl = decryptDatabaseUrl(tenant.databaseUrl);

  // Add aggressive connection pooling to prevent exhaustion
  // connection_limit: max connections this client can use
  // pool_timeout: how long to wait for an available connection (seconds)
  const poolParams = 'connection_limit=40&pool_timeout=30&connect_timeout=20';
  const urlWithPooling = decryptedUrl.includes('?')
    ? `${decryptedUrl}&${poolParams}`
    : `${decryptedUrl}?${poolParams}`;

  // Create new Prisma client for this tenant
  const tenantPrisma = new PrismaClient({
    datasources: {
      db: {
        url: urlWithPooling,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['error'] : [],
  });

  // Cache the connection
  tenantPrismaClients.set(tenantSlug, tenantPrisma);
  connectionCount++;
  globalForTenantClients.connectionCount = connectionCount;

  return tenantPrisma;
}

/**
 * Disconnect a specific tenant's database connection
 * Used for cleanup or when a tenant is suspended
 */
export async function disconnectTenant(tenantSlug: string): Promise<void> {
  const client = tenantPrismaClients.get(tenantSlug);
  if (client) {
    await client.$disconnect();
    tenantPrismaClients.delete(tenantSlug);
    connectionCount--;
    globalForTenantClients.connectionCount = connectionCount;
  }
}

/**
 * Disconnect all tenant connections
 * Used during app shutdown or for maintenance
 */
export async function disconnectAllTenants(): Promise<void> {
  const disconnectPromises = Array.from(tenantPrismaClients.entries()).map(
    async ([slug, client]) => {
      await client.$disconnect();
      tenantPrismaClients.delete(slug);
    }
  );

  await Promise.all(disconnectPromises);
  connectionCount = 0;
  globalForTenantClients.connectionCount = 0;
}

/**
 * Get current tenant connection statistics
 * Useful for monitoring and debugging
 */
export function getTenantConnectionStats() {
  return {
    activeConnections: connectionCount,
    maxConnections: MAX_CONNECTIONS,
    cachedTenants: Array.from(tenantPrismaClients.keys()),
  };
}

// ============= ENCRYPTION/DECRYPTION =============

/**
 * Encrypt database URL before storing in master DB
 * Uses AES-256-GCM encryption
 */
export function encryptDatabaseUrl(databaseUrl: string): string {
  const encryptionKey = getEncryptionKey();

  // Generate random IV (Initialization Vector)
  const iv = crypto.randomBytes(16);

  // Create cipher
  const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey, iv);

  // Encrypt the database URL
  let encrypted = cipher.update(databaseUrl, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Get authentication tag
  const authTag = cipher.getAuthTag();

  // Combine IV + authTag + encrypted data
  const result = iv.toString("hex") + ":" + authTag.toString("hex") + ":" + encrypted;

  return result;
}

/**
 * Decrypt database URL retrieved from master DB
 * Uses AES-256-GCM decryption
 */
export function decryptDatabaseUrl(encryptedData: string): string {
  const encryptionKey = getEncryptionKey();

  // Split the encrypted data
  const parts = encryptedData.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted data format");
  }

  const iv = Buffer.from(parts[0], "hex");
  const authTag = Buffer.from(parts[1], "hex");
  const encrypted = parts[2];

  // Create decipher
  const decipher = crypto.createDecipheriv("aes-256-gcm", encryptionKey, iv);
  decipher.setAuthTag(authTag);

  // Decrypt
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/**
 * Get encryption key from environment
 * Key must be exactly 32 bytes for AES-256
 */
function getEncryptionKey(): Buffer {
  const key = process.env.DB_ENCRYPTION_KEY;

  if (!key) {
    throw new Error(
      "DB_ENCRYPTION_KEY environment variable is not set. Generate one with: openssl rand -base64 32"
    );
  }

  // Convert base64 key to buffer
  const keyBuffer = Buffer.from(key, "base64");

  if (keyBuffer.length !== 32) {
    throw new Error(
      "DB_ENCRYPTION_KEY must be exactly 32 bytes (256 bits). Generate with: openssl rand -base64 32"
    );
  }

  return keyBuffer;
}

// ============= GRACEFUL SHUTDOWN =============

// Only register shutdown handlers in Node.js runtime (not Edge Runtime)
if (typeof process !== "undefined" && typeof process.on === "function") {
  // Handle graceful shutdown
  process.on("beforeExit", async () => {
    await disconnectAllTenants();
    if (globalForMasterPrisma.masterPrisma) {
      await globalForMasterPrisma.masterPrisma.$disconnect();
    }
  });

  // Handle unexpected termination
  process.on("SIGINT", async () => {
    await disconnectAllTenants();
    if (globalForMasterPrisma.masterPrisma) {
      await globalForMasterPrisma.masterPrisma.$disconnect();
    }
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    await disconnectAllTenants();
    if (globalForMasterPrisma.masterPrisma) {
      await globalForMasterPrisma.masterPrisma.$disconnect();
    }
    process.exit(0);
  });
}
