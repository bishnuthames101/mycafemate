import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock next-auth
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/admin/payroll",
  useParams: () => ({}),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock prisma-multi-tenant
vi.mock("@/lib/prisma-multi-tenant", () => ({
  getTenantPrisma: vi.fn(),
}));

// Mock auth
vi.mock("@/lib/auth", () => ({
  authOptions: {},
}));

// Mock logger
vi.mock("@/lib/utils/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));
