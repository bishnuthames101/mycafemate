import useSWR from "swr";

interface PayrollRun {
  id: string;
  periodLabel: string;
  periodStart: string;
  periodEnd: string;
  locationId: string | null;
  status: "DRAFT" | "PROCESSED" | "PAID";
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  employeeCount: number;
  notes: string | null;
  processedById: string;
  createdAt: string;
  updatedAt: string;
  processedBy: {
    id: string;
    name: string;
  };
  location: {
    id: string;
    name: string;
  } | null;
  _count: {
    records: number;
  };
}

interface UsePayrollRunsOptions {
  locationId?: string;
  status?: string;
  year?: string;
}

export function usePayrollRuns(options: UsePayrollRunsOptions = {}) {
  const params = new URLSearchParams();
  if (options.locationId) {
    params.set("locationId", options.locationId);
  }
  if (options.status) {
    params.set("status", options.status);
  }
  if (options.year) {
    params.set("year", options.year);
  }

  const queryString = params.toString();
  const url = `/api/payroll/runs${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, isValidating, mutate } = useSWR<
    PayrollRun[]
  >(url, {
    revalidateOnFocus: false,
    dedupingInterval: 30000,
  });

  return {
    runs: Array.isArray(data) ? data : [],
    isLoading,
    isValidating,
    error,
    mutate,
  };
}
