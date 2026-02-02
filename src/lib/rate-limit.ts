/**
 * Rate Limiting Utility
 *
 * Uses Upstash Redis for production, in-memory store for development
 * This prevents brute force attacks and API abuse
 */

import { Ratelimit, type Duration } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { logger } from "@/lib/utils/logger";

// In-memory store for development (when Redis is not configured)
class InMemoryStore {
  private store = new Map<string, { count: number; resetAt: number }>();

  async limit(key: string, maxRequests: number, windowMs: number) {
    const now = Date.now();
    const record = this.store.get(key);

    // Clean up expired entries periodically
    if (this.store.size > 10000) {
      this.cleanup();
    }

    if (!record || now > record.resetAt) {
      // New window
      this.store.set(key, { count: 1, resetAt: now + windowMs });
      return { success: true, remaining: maxRequests - 1 };
    }

    if (record.count >= maxRequests) {
      // Rate limit exceeded
      return { success: false, remaining: 0 };
    }

    // Increment count
    record.count++;
    this.store.set(key, record);
    return { success: true, remaining: maxRequests - record.count };
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, record] of this.store.entries()) {
      if (now > record.resetAt) {
        this.store.delete(key);
      }
    }
  }
}

const inMemoryStore = new InMemoryStore();

// Check if Upstash Redis is configured
const hasRedis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

// Initialize Redis if available
let redis: Redis | null = null;
if (hasRedis) {
  try {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
    logger.info("Rate limiting using Upstash Redis");
  } catch (error) {
    logger.warn("Failed to connect to Redis, using in-memory rate limiting");
  }
}

// Create rate limiters
function createRateLimiter(requests: number, window: Duration, prefix: string) {
  if (redis) {
    // Production: Use Redis
    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(requests, window),
      analytics: true,
      prefix: `ratelimit:${prefix}`,
    });
  } else {
    // Development: Use in-memory store
    const windowMs = parseWindow(window);
    return {
      limit: (identifier: string) =>
        inMemoryStore.limit(`${prefix}:${identifier}`, requests, windowMs),
    };
  }
}

// Parse window string (e.g., "15 m" -> 900000ms)
function parseWindow(window: Duration): number {
  const match = window.match(/(\d+)\s*([smh])/);
  if (!match) return 60000; // Default 1 minute

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    default:
      return 60000;
  }
}

// Login rate limit: 5 attempts per 15 minutes
export const loginRateLimit = createRateLimiter(5, "15 m", "login");

// API rate limit: 100 requests per minute
export const apiRateLimit = createRateLimiter(100, "1 m", "api");

// Super admin actions: 20 per minute
export const adminRateLimit = createRateLimiter(20, "1 m", "admin");

// Payment/sensitive operations: 10 per minute
export const sensitiveRateLimit = createRateLimiter(10, "1 m", "sensitive");

/**
 * Helper function to check rate limit and return response
 */
export async function checkRateLimit(
  limiter: any,
  identifier: string
): Promise<{ allowed: boolean; response?: Response }> {
  try {
    const { success, remaining } = await limiter.limit(identifier);

    if (!success) {
      return {
        allowed: false,
        response: new Response(
          JSON.stringify({
            error: "Too many requests. Please try again later.",
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "X-RateLimit-Remaining": "0",
            },
          }
        ),
      };
    }

    return { allowed: true };
  } catch (error) {
    logger.error("Rate limit check failed", error instanceof Error ? error : undefined);
    // Fail open - allow request if rate limiting fails
    return { allowed: true };
  }
}

// Log configuration on startup
if (!hasRedis) {
  logger.warn(
    "PRODUCTION WARNING: Using in-memory rate limiting. Set up Upstash Redis for production: " +
      "1. Create free account at https://upstash.com " +
      "2. Create Redis database " +
      "3. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to .env"
  );
}
