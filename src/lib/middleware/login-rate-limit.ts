/**
 * Login Rate Limiting Middleware
 * Protects against brute force login attempts
 */

import { loginRateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/utils/logger";

export async function checkLoginRateLimit(
  identifier: string
): Promise<{ allowed: boolean; error?: string }> {
  try {
    const { success } = await loginRateLimit.limit(identifier);

    if (!success) {
      logger.warn(`Rate limit exceeded for login attempt: ${identifier}`);
      return {
        allowed: false,
        error: "Too many login attempts. Please try again in 15 minutes.",
      };
    }

    return { allowed: true };
  } catch (error) {
    logger.error("Login rate limit check failed", error instanceof Error ? error : undefined);
    // Fail open - allow request if rate limiting fails
    return { allowed: true };
  }
}
