import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcryptjs";
import { getTenantPrisma, getMasterPrisma } from "@/lib/prisma-multi-tenant";
import { getTenantSlug, isSuperAdminContext } from "@/lib/utils/tenant-resolver";
import type { ExtendedRole } from "@/types";
import { checkLoginRateLimit } from "@/lib/middleware/login-rate-limit";
import { logger } from "@/lib/utils/logger";

// Account lockout configuration
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 30;

// Helper functions for account lockout
async function checkAccountLockout(prisma: any, model: string, email: string) {
  const account = await prisma[model].findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      name: true,
      role: true,
      isActive: model === "superAdmin" ? true : undefined,
      isTenantOwner: model === "user" ? true : undefined,
      locationId: model === "user" ? true : undefined,
      failedLoginAttempts: true,
      lockedUntil: true,
    },
  });

  if (!account) return null;

  // Check if account is currently locked
  if (account.lockedUntil && account.lockedUntil > new Date()) {
    const minutesLeft = Math.ceil(
      (account.lockedUntil.getTime() - Date.now()) / (1000 * 60)
    );
    throw new Error(
      `Account is locked due to too many failed login attempts. Please try again in ${minutesLeft} minute(s).`
    );
  }

  // Clear expired lockout
  if (account.lockedUntil && account.lockedUntil <= new Date()) {
    await prisma[model].update({
      where: { email },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });
    account.failedLoginAttempts = 0;
    account.lockedUntil = null;
  }

  return account;
}

async function handleFailedLogin(prisma: any, model: string, email: string) {
  const account = await prisma[model].findUnique({
    where: { email },
    select: { failedLoginAttempts: true },
  });

  if (!account) return;

  const newAttempts = (account.failedLoginAttempts || 0) + 1;
  const updateData: any = {
    failedLoginAttempts: newAttempts,
    lastFailedLogin: new Date(),
  };

  // Lock account if max attempts reached
  if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
    updateData.lockedUntil = new Date(
      Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000
    );
    logger.warn(
      `Account locked: ${email} (${newAttempts} failed attempts)`
    );
  }

  await prisma[model].update({
    where: { email },
    data: updateData,
  });
}

async function handleSuccessfulLogin(prisma: any, model: string, email: string) {
  await prisma[model].update({
    where: { email },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date(),
    },
  });
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // Rate limiting check - prevent brute force attacks
        const rateLimitCheck = await checkLoginRateLimit(credentials.email);
        if (!rateLimitCheck.allowed) {
          throw new Error(rateLimitCheck.error || "Too many login attempts");
        }

        // Determine context: super admin vs tenant user
        const isSuperAdmin = isSuperAdminContext();

        if (isSuperAdmin) {
          // ============= SUPER ADMIN AUTHENTICATION =============
          // Authenticate against master database
          const masterPrisma = getMasterPrisma();

          // Check account lockout status
          const superAdmin = await checkAccountLockout(
            masterPrisma,
            "superAdmin",
            credentials.email
          );

          if (!superAdmin || !superAdmin.isActive) {
            await handleFailedLogin(masterPrisma, "superAdmin", credentials.email);
            throw new Error("Invalid credentials");
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            superAdmin.password
          );

          if (!isValid) {
            await handleFailedLogin(masterPrisma, "superAdmin", credentials.email);
            throw new Error("Invalid credentials");
          }

          // Successful login - clear failed attempts and update last login
          await handleSuccessfulLogin(masterPrisma, "superAdmin", credentials.email);

          return {
            id: superAdmin.id,
            email: superAdmin.email,
            name: superAdmin.name,
            role: "SUPER_ADMIN" as ExtendedRole,
            locationId: undefined,
            tenantSlug: null,
          };
        } else {
          // ============= TENANT USER AUTHENTICATION =============
          // Authenticate against tenant database
          const tenantSlug = getTenantSlug();

          if (!tenantSlug) {
            throw new Error("Tenant not found. Please access via your cafe subdomain (e.g., your-cafe.mycafemate.com)");
          }

          let tenantPrisma;
          try {
            tenantPrisma = await getTenantPrisma(tenantSlug);
          } catch (error: any) {
            // Handle tenant-specific errors (suspended, expired trial, etc.)
            throw new Error(error.message || "Unable to access tenant");
          }

          // Check account lockout status
          const user = await checkAccountLockout(
            tenantPrisma,
            "user",
            credentials.email
          );

          if (!user || !user.password) {
            await handleFailedLogin(tenantPrisma, "user", credentials.email);
            throw new Error("Invalid credentials");
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValid) {
            await handleFailedLogin(tenantPrisma, "user", credentials.email);
            throw new Error("Invalid credentials");
          }

          // Successful login - clear failed attempts and update last login
          await handleSuccessfulLogin(tenantPrisma, "user", credentials.email);

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role as ExtendedRole,
            locationId: user.locationId ?? undefined,
            tenantSlug,
          };
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.locationId = user.locationId;
        token.tenantSlug = user.tenantSlug;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub!;
        session.user.role = token.role;
        session.user.locationId = token.locationId;
        session.user.tenantSlug = token.tenantSlug;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login", // Redirect errors to login page
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // Don't set domain in development - let browser handle it
        // In production, use env var or default to .mycafemate.com
        domain: process.env.NODE_ENV === "production"
          ? (process.env.COOKIE_DOMAIN || ".mycafemate.com")
          : undefined,
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
