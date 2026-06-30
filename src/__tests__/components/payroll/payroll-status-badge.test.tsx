import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PayrollStatusBadge } from "@/components/payroll/payroll-status-badge";

describe("PayrollStatusBadge", () => {
  it('renders "Draft" label for DRAFT status', () => {
    render(<PayrollStatusBadge status="DRAFT" />);
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it('renders "Processed" label for PROCESSED status', () => {
    render(<PayrollStatusBadge status="PROCESSED" />);
    expect(screen.getByText("Processed")).toBeInTheDocument();
  });

  it('renders "Paid" label for PAID status', () => {
    render(<PayrollStatusBadge status="PAID" />);
    expect(screen.getByText("Paid")).toBeInTheDocument();
  });

  it("applies amber styles for DRAFT", () => {
    render(<PayrollStatusBadge status="DRAFT" />);
    const badge = screen.getByText("Draft");
    expect(badge.className).toContain("bg-amber-100");
    expect(badge.className).toContain("text-amber-800");
  });

  it("applies blue styles for PROCESSED", () => {
    render(<PayrollStatusBadge status="PROCESSED" />);
    const badge = screen.getByText("Processed");
    expect(badge.className).toContain("bg-blue-100");
    expect(badge.className).toContain("text-blue-800");
  });

  it("applies green styles for PAID", () => {
    render(<PayrollStatusBadge status="PAID" />);
    const badge = screen.getByText("Paid");
    expect(badge.className).toContain("bg-green-100");
    expect(badge.className).toContain("text-green-800");
  });

  it("applies custom className", () => {
    render(<PayrollStatusBadge status="DRAFT" className="ml-2" />);
    const badge = screen.getByText("Draft");
    expect(badge.className).toContain("ml-2");
  });

  it("has rounded-full and font-medium classes", () => {
    render(<PayrollStatusBadge status="PAID" />);
    const badge = screen.getByText("Paid");
    expect(badge.className).toContain("rounded-full");
    expect(badge.className).toContain("font-medium");
  });
});
