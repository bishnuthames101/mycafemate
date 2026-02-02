"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Search, Edit, Trash2, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { TableFormDialog } from "@/components/tables/table-form-dialog";

interface Table {
  id: string;
  number: string;
  capacity: number;
  locationId: string;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "CLEANING";
}

export default function TablesPage() {
  const { data: session } = useSession();
  const [tables, setTables] = useState<Table[]>([]);
  const [filteredTables, setFilteredTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);

  const statuses = ["ALL", "AVAILABLE", "OCCUPIED", "RESERVED", "CLEANING"];

  useEffect(() => {
    if (session?.user?.locationId) {
      fetchTables();
    }
  }, [session]);

  useEffect(() => {
    filterTables();
  }, [tables, searchQuery, selectedStatus]);

  const fetchTables = async () => {
    if (!session?.user?.locationId) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/tables?locationId=${session.user.locationId}`);
      if (res.ok) {
        const data = await res.json();
        setTables(data);
      }
    } catch (error) {
      console.error("Error fetching tables:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterTables = () => {
    let filtered = tables;

    if (selectedStatus !== "ALL") {
      filtered = filtered.filter((t) => t.status === selectedStatus);
    }

    if (searchQuery) {
      filtered = filtered.filter((t) =>
        t.number.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTables(filtered);
  };

  const handleDelete = async (tableId: string) => {
    if (!confirm("Are you sure you want to delete this table?")) {
      return;
    }

    try {
      const res = await fetch(`/api/tables/${tableId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchTables();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to delete table");
      }
    } catch (error) {
      console.error("Error deleting table:", error);
      alert("An error occurred");
    }
  };

  const handleEdit = (table: Table) => {
    setEditingTable(table);
    setShowTableDialog(true);
  };

  const handleCreate = () => {
    setEditingTable(null);
    setShowTableDialog(true);
  };

  const handleDialogClose = () => {
    setShowTableDialog(false);
    setEditingTable(null);
  };

  const handleSuccess = () => {
    fetchTables();
    handleDialogClose();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <p>Loading tables...</p>
      </div>
    );
  }

  const statusStats = statuses.slice(1).map((stat) => ({
    status: stat,
    count: tables.filter((t) => t.status === stat).length,
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-700 border-green-200";
      case "OCCUPIED":
        return "bg-red-100 text-red-700 border-red-200";
      case "RESERVED":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "CLEANING":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <>
      <TableFormDialog
        open={showTableDialog}
        onOpenChange={setShowTableDialog}
        table={editingTable}
        onSuccess={handleSuccess}
        locationId={session?.user?.locationId || ""}
      />

      <div className="min-h-screen bg-cream-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Link href="/admin">
                  <Button variant="outline" size="icon" className="shrink-0">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <div className="min-w-0">
                  <h1 className="text-2xl md:text-4xl font-bold text-coffee-700">Table Management</h1>
                  <p className="text-sm md:text-base text-coffee-600 mt-1 md:mt-2">
                    Manage your restaurant tables and seating
                  </p>
                </div>
              </div>
              <Button onClick={handleCreate} className="w-full sm:w-auto shrink-0">
                <Plus className="h-4 w-4 mr-2" />
                Add Table
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold text-coffee-700">{tables.length}</p>
                </div>
              </CardContent>
            </Card>
            {statusStats.map((stat) => (
              <Card key={stat.status}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">{stat.status}</p>
                    <p className="text-2xl font-bold text-coffee-700">{stat.count}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tables by number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {statuses.map((status) => (
                    <Button
                      key={status}
                      variant={selectedStatus === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedStatus(status)}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tables Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTables.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <UtensilsCrossed className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No tables found</p>
              </div>
            ) : (
              filteredTables.map((table) => (
                <Card key={table.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl">Table {table.number}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Capacity: {table.capacity} {table.capacity === 1 ? 'person' : 'people'}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className={`text-center py-2 px-3 rounded-lg border ${getStatusColor(table.status)}`}>
                      <span className="text-sm font-semibold">{table.status}</span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(table)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(table.id)}
                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
