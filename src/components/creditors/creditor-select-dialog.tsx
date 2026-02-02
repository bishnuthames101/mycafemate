"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus } from "lucide-react";
import { CreditorFormDialog } from "./creditor-form-dialog";

interface Creditor {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  currentBalance: number;
}

interface CreditorSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locationId: string;
  onSelect: (creditor: Creditor) => void;
}

export function CreditorSelectDialog({
  open,
  onOpenChange,
  locationId,
  onSelect,
}: CreditorSelectDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Creditor[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Search creditors with debounce
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const delayDebounce = setTimeout(() => {
        searchCreditors();
      }, 300);
      return () => clearTimeout(delayDebounce);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const searchCreditors = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/creditors/search?q=${encodeURIComponent(searchQuery)}&locationId=${locationId}`
      );
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } catch (error) {
      console.error("Error searching creditors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (creditor: Creditor) => {
    onSelect(creditor);
    onOpenChange(false);
  };

  const handleCreateSuccess = (creditor: Creditor) => {
    setShowCreateDialog(false);
    onSelect(creditor);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Select or Create Creditor</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search creditor by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Loading State */}
            {loading && <p className="text-sm text-gray-500">Searching...</p>}

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="border rounded-lg divide-y max-h-60 overflow-y-auto">
                {searchResults.map((creditor) => (
                  <button
                    key={creditor.id}
                    onClick={() => handleSelect(creditor)}
                    className="w-full p-3 hover:bg-gray-50 text-left transition-colors"
                  >
                    <div className="font-medium">{creditor.name}</div>
                    {creditor.phone && (
                      <div className="text-sm text-gray-600">{creditor.phone}</div>
                    )}
                    <div className="text-sm text-red-600 mt-1">
                      Outstanding: NPR {creditor.currentBalance.toLocaleString()}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* No Results */}
            {searchQuery.length >= 2 && !loading && searchResults.length === 0 && (
              <p className="text-sm text-gray-500">No creditors found</p>
            )}

            {/* Create New Button */}
            <Button
              onClick={() => setShowCreateDialog(true)}
              variant="outline"
              className="w-full"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Create New Creditor
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Creditor Dialog */}
      <CreditorFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        locationId={locationId}
        onSuccess={handleCreateSuccess}
      />
    </>
  );
}
