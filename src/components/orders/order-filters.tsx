"use client";

import { Location } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Calendar } from "lucide-react";

export type DateRange = "today" | "week" | "month" | "all";

interface OrderFiltersProps {
  locations: Location[];
  selectedLocation: string;
  selectedStatus: string;
  searchQuery: string;
  onLocationChange: (locationId: string) => void;
  onStatusChange: (status: string) => void;
  onSearchChange: (query: string) => void;
  selectedDateRange?: DateRange;
  onDateRangeChange?: (range: DateRange) => void;
}

const statuses = [
  { value: "ALL", label: "All Orders" },
  { value: "PENDING", label: "Pending" },
  { value: "SERVED", label: "Served" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

const dateRanges: { value: DateRange; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "all", label: "All Time" },
];

export function OrderFilters({
  locations,
  selectedLocation,
  selectedStatus,
  searchQuery,
  onLocationChange,
  onStatusChange,
  onSearchChange,
  selectedDateRange = "today",
  onDateRangeChange,
}: OrderFiltersProps) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order number..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedLocation} onValueChange={onLocationChange}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          {onDateRangeChange && (
            <div className="flex gap-2 flex-wrap items-center">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {dateRanges.map((range) => (
                <Button
                  key={range.value}
                  variant={selectedDateRange === range.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => onDateRangeChange(range.value)}
                >
                  {range.label}
                </Button>
              ))}
            </div>
          )}
          <div className="flex gap-2 flex-wrap">
            {statuses.map((status) => (
              <Button
                key={status.value}
                variant={selectedStatus === status.value ? "default" : "outline"}
                size="sm"
                onClick={() => onStatusChange(status.value)}
              >
                {status.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
