"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Order, OrderItem, Product, User, Table, OrderStatus } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { PaymentStatusBadge } from "@/components/orders/payment-status-badge";
import { OrderInvoice } from "@/components/orders/order-invoice";
import { PaymentFlowDialog } from "@/components/orders/payment-flow-dialog";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { ArrowLeft, FileText, Package, CreditCard } from "lucide-react";
import Link from "next/link";

interface OrderWithRelations extends Order {
  items: (OrderItem & { product: Product })[];
  table: Table | null;
  staff: Pick<User, "name" | "email">;
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<OrderWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "invoice">("details");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (newStatus: OrderStatus) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/orders/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updatedOrder = await res.json();
        setOrder(updatedOrder);
        if (newStatus === "COMPLETED") {
          router.push("/staff/orders");
        }
      }
    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <p>Order not found</p>
      </div>
    );
  }

  // Simplified status flow: PENDING -> SERVED -> Payment -> COMPLETED
  const canMarkAsServed = order.status === "PENDING";
  const canProceedToPayment = order.status === "SERVED" && order.paymentStatus !== "PAID";
  const showActions = order.status !== "COMPLETED" && order.status !== "CANCELLED";

  return (
    <>
      <PaymentFlowDialog
        orderId={order.id}
        orderNumber={order.orderNumber}
        total={order.total}
        locationId={order.locationId}
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        onSuccess={fetchOrder}
      />

    <div className="min-h-screen bg-cream-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3 md:gap-4">
          <Link href="/staff/orders">
            <Button variant="outline" size="icon" className="shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="min-w-0">
            <h1 className="text-xl md:text-3xl font-bold text-coffee-700 truncate">{order.orderNumber}</h1>
            <p className="text-xs md:text-base text-coffee-600 mt-1">{formatDateTime(order.createdAt)}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          <Button
            variant={activeTab === "details" ? "default" : "ghost"}
            className="rounded-b-none"
            onClick={() => setActiveTab("details")}
          >
            <Package className="h-4 w-4 mr-2" />
            Order Details
          </Button>
          <Button
            variant={activeTab === "invoice" ? "default" : "ghost"}
            className="rounded-b-none"
            onClick={() => setActiveTab("invoice")}
          >
            <FileText className="h-4 w-4 mr-2" />
            Invoice
          </Button>
        </div>

        {activeTab === "invoice" ? (
          <OrderInvoice order={order} />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Table:</span>
                <span className="font-medium">{order.table?.number || "No table"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Staff:</span>
                <span className="font-medium">{order.staff?.name || 'N/A'}</span>
              </div>
              {order.paymentStatus && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment:</span>
                  <PaymentStatusBadge status={order.paymentStatus} />
                </div>
              )}
              {order.paymentMethod && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Method:</span>
                  <span className="font-medium uppercase">{order.paymentMethod}</span>
                </div>
              )}
              {order.notes && (
                <div>
                  <span className="text-muted-foreground block mb-1">Notes:</span>
                  <p className="text-sm">{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </div>
                  <span className="font-semibold">{formatCurrency(item.subtotal)}</span>
                </div>
              ))}

              <div className="pt-3 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{order.tax > 0 ? "VAT (13%)" : "VAT"}</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-coffee-600">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Update Actions */}
        {showActions && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {canProceedToPayment ? (
                  <>
                    <Button
                      className="flex-1"
                      size="lg"
                      onClick={() => setShowPaymentDialog(true)}
                      disabled={isUpdating}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Proceed to Payment
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => updateStatus("CANCELLED")}
                      disabled={isUpdating}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Cancel Order
                    </Button>
                  </>
                ) : canMarkAsServed ? (
                  <>
                    <Button
                      className="flex-1"
                      size="lg"
                      onClick={() => updateStatus("SERVED")}
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Updating..." : "Mark as Served"}
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => updateStatus("CANCELLED")}
                      disabled={isUpdating}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Cancel Order
                    </Button>
                  </>
                ) : null}
              </div>
            </CardContent>
          </Card>
        )}
          </>
        )}
      </div>
    </div>
    </>
  );
}
