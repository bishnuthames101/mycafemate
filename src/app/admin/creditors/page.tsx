"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, UserPlus, Search, DollarSign } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { CreditorFormDialog } from "@/components/creditors/creditor-form-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Creditor {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  currentBalance: number;
  locationId: string;
  location: {
    id: string;
    name: string;
  };
  lastOrderDate?: string;
  _count: {
    orders: number;
  };
}

interface Location {
  id: string;
  name: string;
}

export default function AdminCreditorsPage() {
  const router = useRouter();
  const [creditors, setCreditors] = useState<Creditor[]>([]);
  const [filteredCreditors, setFilteredCreditors] = useState<Creditor[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterCreditors();
  }, [creditors, selectedLocation, searchQuery]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const creditorsRes = await fetch("/api/creditors");
      const locationsRes = await fetch("/api/locations");

      if (creditorsRes.ok && locationsRes.ok) {
        const creditorsData = await creditorsRes.json();
        const locationsData = await locationsRes.json();
        setCreditors(creditorsData);
        setLocations(locationsData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterCreditors = () => {
    let filtered = creditors;

    // Filter by location
    if (selectedLocation !== "ALL") {
      filtered = filtered.filter((creditor) => creditor.locationId === selectedLocation);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((creditor) =>
        creditor.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCreditors(filtered);
  };

  const handleCreditorClick = (creditorId: string) => {
    router.push(`/admin/creditors/${creditorId}`);
  };

  const handleCreateSuccess = () => {
    setShowCreateDialog(false);
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <p>Loading creditors...</p>
      </div>
    );
  }

  // Calculate stats
  const totalCreditors = filteredCreditors.length;
  const totalOutstanding = filteredCreditors.reduce(
    (sum, creditor) => sum + creditor.currentBalance,
    0
  );
  const averageBalance =
    totalCreditors > 0 ? totalOutstanding / totalCreditors : 0;
  const highestBalance = totalCreditors > 0
    ? Math.max(...filteredCreditors.map((c) => c.currentBalance))
    : 0;

  return (
    <>
      <CreditorFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        locationId={selectedLocation !== "ALL" ? selectedLocation : locations[0]?.id || ""}
        onSuccess={handleCreateSuccess}
      />

      <div className="min-h-screen bg-cream-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Link href="/admin">
                <Button variant="outline" size="icon" className="shrink-0">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl md:text-4xl font-bold text-coffee-700">
                  Creditors Management
                </h1>
                <p className="text-sm md:text-base text-coffee-600 mt-1 md:mt-2">
                  Manage customer credit accounts and track outstanding balances
                </p>
              </div>
            </div>
            <Button
              className="w-full sm:w-auto"
              onClick={() => setShowCreateDialog(true)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              New Creditor
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Creditors</p>
                  <p className="text-2xl font-bold text-coffee-700">{totalCreditors}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Outstanding</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(totalOutstanding)}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Average Balance</p>
                  <p className="text-2xl font-bold text-coffee-700">
                    {formatCurrency(averageBalance)}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Highest Balance</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(highestBalance)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {/* Location Filter */}
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="All Locations" />
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
            </CardContent>
          </Card>

          {/* Creditors List */}
          {filteredCreditors.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchQuery || selectedLocation !== "ALL"
                    ? "No creditors found matching your filters"
                    : "No creditors with outstanding balances"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredCreditors.map((creditor) => (
                <Card
                  key={creditor.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleCreditorClick(creditor.id)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-coffee-700">
                          {creditor.name}
                        </h3>
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          {creditor.phone && <p>Phone: {creditor.phone}</p>}
                          {creditor.email && <p>Email: {creditor.email}</p>}
                          <p>Location: {creditor.location.name}</p>
                          <p>Orders: {creditor._count.orders}</p>
                          {creditor.lastOrderDate && (
                            <p>
                              Last Order:{" "}
                              {new Date(creditor.lastOrderDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Outstanding</p>
                        <p className="text-2xl font-bold text-red-600">
                          {formatCurrency(creditor.currentBalance)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
