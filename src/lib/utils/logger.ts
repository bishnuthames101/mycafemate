/**
 * Production-Safe Logging Utility
 *
 * Environment-aware logging that:
 * - Provides detailed logs in development
 * - Minimizes sensitive information in production
 * - Structures log output for better parsing
 * - Sanitizes potentially sensitive data
 *
 * Usage:
 *   import { logger } from '@/lib/utils/logger';
 *   logger.info('User logged in', { userId: '123' });
 *   logger.error('Database error', error);
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isProduction: boolean;
  private isDevelopment: boolean;

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  /**
   * Sanitize sensitive data from objects before logging
   */
  private sanitize(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const sensitiveKeys = [
      'password',
      'token',
      'secret',
      'apiKey',
      'api_key',
      'authorization',
      'cookie',
      'session',
    ];

    if (Array.isArray(data)) {
      return data.map(item => this.sanitize(item));
    }

    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();

      if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitize(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Format log message with timestamp and level
   */
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const levelUpper = level.toUpperCase().padEnd(5);

    if (this.isDevelopment) {
      // Verbose format for development
      let formatted = `[${timestamp}] ${levelUpper} ${message}`;
      if (context && Object.keys(context).length > 0) {
        formatted += `\n   Context: ${JSON.stringify(this.sanitize(context), null, 2)}`;
      }
      return formatted;
    } else {
      // Compact JSON format for production (easier to parse by log aggregators)
      const logObject = {
        timestamp,
        level,
        message,
        ...(context && Object.keys(context).length > 0 ? { context: this.sanitize(context) } : {}),
      };
      return JSON.stringify(logObject);
    }
  }

  /**
   * Format error objects safely
   */
  private formatError(error: any): LogContext {
    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        // Include stack trace in development, exclude in production
        ...(this.isDevelopment && error.stack ? { stack: error.stack } : {}),
      };
    }
    return { error: String(error) };
  }

  /**
   * Debug level logging (only in development)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.log(this.formatMessage('debug', message, context));
    }
  }

  /**
   * Info level logging
   */
  info(message: string, context?: LogContext): void {
    console.log(this.formatMessage('info', message, context));
  }

  /**
   * Warning level logging
   */
  warn(message: string, context?: LogContext | Error): void {
    const ctx = context instanceof Error ? this.formatError(context) : context;
    console.warn(this.formatMessage('warn', message, ctx));
  }

  /**
   * Error level logging
   */
  error(message: string, error?: Error | LogContext, additionalContext?: LogContext): void {
    let context: LogContext = {};

    if (error instanceof Error) {
      context = {
        ...this.formatError(error),
        ...additionalContext,
      };
    } else if (error) {
      context = { ...error, ...additionalContext };
    } else if (additionalContext) {
      context = additionalContext;
    }

    console.error(this.formatMessage('error', message, context));
  }

  /**
   * Log HTTP request information (useful for API routes)
   */
  request(method: string, path: string, context?: LogContext): void {
    this.debug(`${method} ${path}`, context);
  }

  /**
   * Log HTTP response information (useful for API routes)
   */
  response(method: string, path: string, status: number, duration?: number): void {
    const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info';
    const message = `${method} ${path} ${status}`;
    const context = duration ? { durationMs: duration } : undefined;

    if (level === 'error') {
      this.error(message, context);
    } else if (level === 'warn') {
      this.warn(message, context);
    } else {
      this.debug(message, context);
    }
  }
}

// Export singleton instance
export const logger = new Logger();

/**
 * Helper function to create a logger with a specific prefix
 * Useful for module-specific logging
 *
 * Example:
 *   const log = createLogger('[TenantProvisioning]');
 *   log.info('Creating tenant', { slug: 'cafe-abc' });
 */
export function createLogger(prefix: string) {
  return {
    debug: (message: string, context?: LogContext) =>
      logger.debug(`${prefix} ${message}`, context),
    info: (message: string, context?: LogContext) =>
      logger.info(`${prefix} ${message}`, context),
    warn: (message: string, context?: LogContext | Error) =>
      logger.warn(`${prefix} ${message}`, context),
    error: (message: string, error?: Error | LogContext, additionalContext?: LogContext) =>
      logger.error(`${prefix} ${message}`, error, additionalContext),
    request: (method: string, path: string, context?: LogContext) =>
      logger.request(method, `${prefix} ${path}`, context),
    response: (method: string, path: string, status: number, duration?: number) =>
      logger.response(method, `${prefix} ${path}`, status, duration),
  };
}
