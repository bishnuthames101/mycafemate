import { Role } from "@prisma/client";

// Extended role type to include SUPER_ADMIN (not in Prisma schema)
export type ExtendedRole = Role | "SUPER_ADMIN";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: ExtendedRole;
  locationId?: string;
  tenantSlug?: string | null; // null for super admin, slug for tenant users
}

declare module "next-auth" {
  interface Session {
    user: SessionUser;
  }

  interface User extends SessionUser {}
}

declare module "next-auth/jwt" {
  interface JWT {
    role: ExtendedRole;
    locationId?: string;
    tenantSlug?: string | null;
  }
}
