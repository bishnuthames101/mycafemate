"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { ArrowLeft, DollarSign, Receipt, User, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { RecordPaymentDialog } from "@/components/creditors/record-payment-dialog";
import { CreditorEditDialog } from "@/components/creditors/creditor-edit-dialog";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { PaymentStatusBadge } from "@/components/orders/payment-status-badge";

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
  orders: Array<{
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
    table?: {
      number: string;
    };
    items: Array<{
      id: string;
      quantity: number;
      price: number;
      subtotal: number;
      product: {
        id: string;
        name: string;
        price: number;
      };
    }>;
  }>;
  payments: Array<{
    id: string;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    paymentMethod: string;
    notes?: string;
    createdAt: string;
    recordedBy: {
      id: string;
      name: string;
    };
  }>;
}

export default function AdminCreditorDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [creditor, setCreditor] = useState<Creditor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<"orders" | "payments">("orders");

  useEffect(() => {
    fetchCreditor();
  }, [params.id]);

  const fetchCreditor = async () => {
    try {
      const res = await fetch(`/api/creditors/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setCreditor(data);
      } else if (res.status === 404) {
        router.push("/admin/creditors");
      }
    } catch (error) {
      console.error("Error fetching creditor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    // Refresh creditor data after payment
    fetchCreditor();
  };

  const handleDelete = async () => {
    if (!creditor) return;

    if (creditor.currentBalance > 0) {
      alert("Cannot delete a creditor with outstanding balance. Please settle the balance first.");
      return;
    }

    if (!confirm(`Are you sure you want to delete "${creditor.name}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/creditors/${creditor.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/admin/creditors");
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to delete creditor");
      }
    } catch (error) {
      console.error("Error deleting creditor:", error);
      alert("Failed to delete creditor");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!creditor) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">Creditor not found</p>
            <Link href="/admin/creditors">
              <Button>Back to Creditors</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate stats
  const totalOrders = creditor.orders.length;
  const totalPaid = creditor.payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalCredit = creditor.orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <>
      <RecordPaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        creditor={{
          id: creditor.id,
          name: creditor.name,
          currentBalance: creditor.currentBalance,
        }}
        onSuccess={handlePaymentSuccess}
      />

      <CreditorEditDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        creditor={{
          id: creditor.id,
          name: creditor.name,
          phone: creditor.phone,
          email: creditor.email,
        }}
        onSuccess={() => fetchCreditor()}
      />

      <div className="min-h-screen bg-cream-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 md:gap-4 flex-wrap">
            <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
              <Link href="/admin/creditors">
                <Button variant="outline" size="icon" className="shrink-0">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl md:text-4xl font-bold text-coffee-700 truncate">
                  {creditor.name}
                </h1>
                <p className="text-sm md:text-base text-coffee-600 mt-1">
                  {creditor.location.name}
                </p>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEditDialog(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting || creditor.currentBalance > 0}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                title={creditor.currentBalance > 0 ? "Cannot delete: outstanding balance exists" : "Delete creditor"}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
              <Button
                onClick={() => setShowPaymentDialog(true)}
                size="sm"
                className="flex-1 sm:flex-none"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Record Payment
              </Button>
            </div>
          </div>

          {/* Outstanding Balance Card */}
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-red-600 mb-2">Outstanding Balance</p>
                <p className="text-4xl font-bold text-red-700">
                  {formatCurrency(creditor.currentBalance)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-coffee-700">{totalOrders}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Credit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-coffee-700">
                  {formatCurrency(totalCredit)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Paid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalPaid)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{creditor.name}</span>
              </div>
              {creditor.phone && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{creditor.phone}</span>
                </div>
              )}
              {creditor.email && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{creditor.email}</span>
                </div>
              )}
              {creditor.lastOrderDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Order:</span>
                  <span className="font-medium">
                    {formatDateTime(new Date(creditor.lastOrderDate))}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tabs */}
          <Card>
            <CardHeader>
              <div className="flex gap-4 border-b">
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`pb-3 px-1 font-medium transition-colors ${
                    activeTab === "orders"
                      ? "border-b-2 border-coffee-600 text-coffee-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Credit Orders ({creditor.orders.length})
                </button>
                <button
                  onClick={() => setActiveTab("payments")}
                  className={`pb-3 px-1 font-medium transition-colors ${
                    activeTab === "payments"
                      ? "border-b-2 border-coffee-600 text-coffee-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Payment History ({creditor.payments.length})
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {activeTab === "orders" ? (
                <div className="space-y-4">
                  {creditor.orders.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No credit orders</p>
                  ) : (
                    creditor.orders.map((order) => (
                      <Link key={order.id} href={`/admin/orders/${order.id}`}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold text-coffee-700">
                                  {order.orderNumber}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {formatDateTime(new Date(order.createdAt))}
                                </p>
                                {order.table && (
                                  <p className="text-sm text-gray-600">
                                    Table: {order.table.number}
                                  </p>
                                )}
                                <div className="flex gap-2 mt-2">
                                  <OrderStatusBadge status={order.status as any} />
                                  <PaymentStatusBadge status={order.paymentStatus as any} />
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-coffee-700">
                                  {formatCurrency(order.total)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {order.items.length} items
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {creditor.payments.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No payment history</p>
                  ) : (
                    creditor.payments.map((payment) => (
                      <Card key={payment.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-green-600">
                                Payment Received
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {formatDateTime(new Date(payment.createdAt))}
                              </p>
                              <p className="text-sm text-gray-600">
                                Method: {payment.paymentMethod}
                              </p>
                              <p className="text-sm text-gray-600">
                                Recorded by: {payment.recordedBy.name}
                              </p>
                              {payment.notes && (
                                <p className="text-sm text-gray-600 mt-2">
                                  Notes: {payment.notes}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-green-600">
                                {formatCurrency(payment.amount)}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Balance: {formatCurrency(payment.balanceBefore)} →{" "}
                                {formatCurrency(payment.balanceAfter)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
