/**
 * Shared session mock helpers for testing payroll API routes
 */

export const adminSession = {
  user: {
    id: "admin-user-1",
    name: "Test Admin",
    email: "admin@test.com",
    role: "ADMIN" as const,
    tenantSlug: "test-tenant",
    locationId: "location-1",
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

export const staffSession = {
  user: {
    id: "staff-user-1",
    name: "Test Staff",
    email: "staff@test.com",
    role: "STAFF" as const,
    tenantSlug: "test-tenant",
    locationId: "location-1",
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

export const kitchenSession = {
  user: {
    id: "kitchen-user-1",
    name: "Test Kitchen",
    email: "kitchen@test.com",
    role: "KITCHEN_STAFF" as const,
    tenantSlug: "test-tenant",
    locationId: "location-1",
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

export const noTenantSession = {
  user: {
    id: "admin-user-1",
    name: "Test Admin",
    email: "admin@test.com",
    role: "ADMIN" as const,
    tenantSlug: null,
    locationId: "location-1",
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};
