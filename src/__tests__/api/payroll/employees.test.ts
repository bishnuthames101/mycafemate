import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import {
  adminSession,
  staffSession,
  kitchenSession,
  noTenantSession,
} from "../../helpers/mock-session";
import { createMockPrisma, sampleEmployee } from "../../helpers/mock-prisma";

// Import route handlers
import { GET, POST } from "@/app/api/payroll/employees/route";
import {
  GET as GET_ONE,
  PATCH,
  DELETE,
} from "@/app/api/payroll/employees/[id]/route";

const mockGetServerSession = vi.mocked(getServerSession);
const mockGetTenantPrisma = vi.mocked(getTenantPrisma);

describe("GET /api/payroll/employees", () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma = createMockPrisma();
    mockGetTenantPrisma.mockResolvedValue(mockPrisma as any);
  });

  it("returns 401 when not authenticated", async () => {
    mockGetServerSession.mockResolvedValue(null);
    const req = new NextRequest("http://localhost/api/payroll/employees");
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("returns 403 for STAFF role", async () => {
    mockGetServerSession.mockResolvedValue(staffSession as any);
    const req = new NextRequest("http://localhost/api/payroll/employees");
    const res = await GET(req);
    expect(res.status).toBe(403);
  });

  it("returns 403 for KITCHEN_STAFF role", async () => {
    mockGetServerSession.mockResolvedValue(kitchenSession as any);
    const req = new NextRequest("http://localhost/api/payroll/employees");
    const res = await GET(req);
    expect(res.status).toBe(403);
  });

  it("returns 400 when tenantSlug is missing", async () => {
    mockGetServerSession.mockResolvedValue(noTenantSession as any);
    const req = new NextRequest("http://localhost/api/payroll/employees");
    const res = await GET(req);
    expect(res.status).toBe(400);
  });

  it("returns employees for ADMIN", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    mockPrisma.employeeProfile.findMany.mockResolvedValue([sampleEmployee]);

    const req = new NextRequest("http://localhost/api/payroll/employees");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0].user.name).toBe("Ram Sharma");
  });

  it("filters by locationId query param", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    mockPrisma.employeeProfile.findMany.mockResolvedValue([]);

    const req = new NextRequest(
      "http://localhost/api/payroll/employees?locationId=loc-2"
    );
    await GET(req);

    expect(mockPrisma.employeeProfile.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ locationId: "loc-2" }),
      })
    );
  });

  it("filters by department query param", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    mockPrisma.employeeProfile.findMany.mockResolvedValue([]);

    const req = new NextRequest(
      "http://localhost/api/payroll/employees?department=Kitchen"
    );
    await GET(req);

    expect(mockPrisma.employeeProfile.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ department: "Kitchen" }),
      })
    );
  });

  it("defaults isActive to true", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    mockPrisma.employeeProfile.findMany.mockResolvedValue([]);

    const req = new NextRequest("http://localhost/api/payroll/employees");
    await GET(req);

    expect(mockPrisma.employeeProfile.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ isActive: true }),
      })
    );
  });
});

describe("POST /api/payroll/employees", () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma = createMockPrisma();
    mockGetTenantPrisma.mockResolvedValue(mockPrisma as any);
  });

  const validBody = {
    userId: "user-1",
    locationId: "location-1",
    department: "Service",
    payType: "MONTHLY",
    baseSalary: 20000,
    joiningDate: "2025-01-15",
  };

  it("returns 401 when not authenticated", async () => {
    mockGetServerSession.mockResolvedValue(null);
    const req = new NextRequest("http://localhost/api/payroll/employees", {
      method: "POST",
      body: JSON.stringify(validBody),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 403 for non-ADMIN", async () => {
    mockGetServerSession.mockResolvedValue(staffSession as any);
    const req = new NextRequest("http://localhost/api/payroll/employees", {
      method: "POST",
      body: JSON.stringify(validBody),
    });
    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it("returns 400 for invalid data", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    const req = new NextRequest("http://localhost/api/payroll/employees", {
      method: "POST",
      body: JSON.stringify({ baseSalary: -100 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 404 when user not found", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    mockPrisma.user.findUnique.mockResolvedValue(null);

    const req = new NextRequest("http://localhost/api/payroll/employees", {
      method: "POST",
      body: JSON.stringify(validBody),
    });
    const res = await POST(req);
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toBe("User not found");
  });

  it("returns 409 when user already has a profile", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    mockPrisma.user.findUnique.mockResolvedValue({ id: "user-1" } as any);
    mockPrisma.employeeProfile.findUnique.mockResolvedValue(
      sampleEmployee as any
    );

    const req = new NextRequest("http://localhost/api/payroll/employees", {
      method: "POST",
      body: JSON.stringify(validBody),
    });
    const res = await POST(req);
    expect(res.status).toBe(409);
  });

  it("returns 404 when location not found", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    mockPrisma.user.findUnique.mockResolvedValue({ id: "user-1" } as any);
    mockPrisma.employeeProfile.findUnique.mockResolvedValue(null);
    mockPrisma.location.findUnique.mockResolvedValue(null);

    const req = new NextRequest("http://localhost/api/payroll/employees", {
      method: "POST",
      body: JSON.stringify(validBody),
    });
    const res = await POST(req);
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toBe("Location not found");
  });

  it("creates employee profile successfully", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    mockPrisma.user.findUnique.mockResolvedValue({ id: "user-1" } as any);
    mockPrisma.employeeProfile.findUnique.mockResolvedValue(null);
    mockPrisma.location.findUnique.mockResolvedValue({
      id: "location-1",
    } as any);
    mockPrisma.employeeProfile.create.mockResolvedValue(sampleEmployee as any);

    const req = new NextRequest("http://localhost/api/payroll/employees", {
      method: "POST",
      body: JSON.stringify(validBody),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);

    expect(mockPrisma.employeeProfile.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: "user-1",
          baseSalary: 20000,
          payType: "MONTHLY",
        }),
      })
    );
  });
});

describe("GET /api/payroll/employees/[id]", () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma = createMockPrisma();
    mockGetTenantPrisma.mockResolvedValue(mockPrisma as any);
  });

  it("returns 404 when not found", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    mockPrisma.employeeProfile.findUnique.mockResolvedValue(null);

    const req = new NextRequest(
      "http://localhost/api/payroll/employees/nonexistent"
    );
    const res = await GET_ONE(req, { params: { id: "nonexistent" } });
    expect(res.status).toBe(404);
  });

  it("returns employee with payroll records", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    mockPrisma.employeeProfile.findUnique.mockResolvedValue({
      ...sampleEmployee,
      payrollRecords: [],
    } as any);

    const req = new NextRequest(
      "http://localhost/api/payroll/employees/emp-1"
    );
    const res = await GET_ONE(req, { params: { id: "emp-1" } });
    expect(res.status).toBe(200);
  });
});

describe("PATCH /api/payroll/employees/[id]", () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma = createMockPrisma();
    mockGetTenantPrisma.mockResolvedValue(mockPrisma as any);
  });

  it("updates employee salary", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    mockPrisma.employeeProfile.findUnique.mockResolvedValue(
      sampleEmployee as any
    );
    mockPrisma.employeeProfile.update.mockResolvedValue({
      ...sampleEmployee,
      baseSalary: 25000,
    } as any);

    const req = new NextRequest(
      "http://localhost/api/payroll/employees/emp-1",
      {
        method: "PATCH",
        body: JSON.stringify({ baseSalary: 25000 }),
      }
    );
    const res = await PATCH(req, { params: { id: "emp-1" } });
    expect(res.status).toBe(200);
  });

  it("returns 404 when not found", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    mockPrisma.employeeProfile.findUnique.mockResolvedValue(null);

    const req = new NextRequest(
      "http://localhost/api/payroll/employees/nonexistent",
      {
        method: "PATCH",
        body: JSON.stringify({ baseSalary: 25000 }),
      }
    );
    const res = await PATCH(req, { params: { id: "nonexistent" } });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/payroll/employees/[id]", () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma = createMockPrisma();
    mockGetTenantPrisma.mockResolvedValue(mockPrisma as any);
  });

  it("soft-deletes employee (sets isActive=false)", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    mockPrisma.employeeProfile.findUnique.mockResolvedValue(
      sampleEmployee as any
    );
    mockPrisma.employeeProfile.update.mockResolvedValue({
      ...sampleEmployee,
      isActive: false,
    } as any);

    const req = new NextRequest(
      "http://localhost/api/payroll/employees/emp-1",
      { method: "DELETE" }
    );
    const res = await DELETE(req, { params: { id: "emp-1" } });
    expect(res.status).toBe(200);

    expect(mockPrisma.employeeProfile.update).toHaveBeenCalledWith({
      where: { id: "emp-1" },
      data: { isActive: false },
    });
  });

  it("returns 404 when not found", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    mockPrisma.employeeProfile.findUnique.mockResolvedValue(null);

    const req = new NextRequest(
      "http://localhost/api/payroll/employees/nonexistent",
      { method: "DELETE" }
    );
    const res = await DELETE(req, { params: { id: "nonexistent" } });
    expect(res.status).toBe(404);
  });
});
