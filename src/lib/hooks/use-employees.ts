import useSWR from "swr";
import { getCached, setCache, CACHE_KEYS, CACHE_TTL } from "@/lib/utils/cache";

interface EmployeeProfile {
  id: string;
  userId: string;
  locationId: string;
  department: string;
  designation: string | null;
  payType: "MONTHLY" | "DAILY";
  baseSalary: number;
  bankName: string | null;
  bankAccountNo: string | null;
  bankBranch: string | null;
  joiningDate: string;
  isActive: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  location: {
    id: string;
    name: string;
  };
  _count: {
    payrollRecords: number;
  };
}

interface UseEmployeesOptions {
  locationId?: string;
  department?: string;
  isActive?: boolean;
}

export function useEmployees(options: UseEmployeesOptions = {}) {
  const params = new URLSearchParams();
  if (options.locationId) {
    params.set("locationId", options.locationId);
  }
  if (options.department) {
    params.set("department", options.department);
  }
  if (options.isActive !== undefined) {
    params.set("isActive", String(options.isActive));
  }

  const queryString = params.toString();
  const url = `/api/payroll/employees${queryString ? `?${queryString}` : ""}`;

  // Cache for unfiltered results
  const cachedEmployees =
    !options.locationId && !options.department
      ? getCached<EmployeeProfile[]>(CACHE_KEYS.EMPLOYEES)
      : null;

  const { data, error, isLoading, isValidating, mutate } = useSWR<
    EmployeeProfile[]
  >(
    url,
    async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch employees");
      const employees = await res.json();

      if (!options.locationId && !options.department) {
        setCache(CACHE_KEYS.EMPLOYEES, employees, CACHE_TTL.EMPLOYEES);
      }

      return employees;
    },
    {
      fallbackData: cachedEmployees ?? undefined,
      revalidateIfStale: true,
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    employees: Array.isArray(data) ? data : [],
    isLoading,
    isValidating,
    error,
    mutate,
  };
}
