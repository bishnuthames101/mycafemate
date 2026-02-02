"use client";

import { Order, OrderItem, Product, Table, User, PaymentMethod, PaymentStatus } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { PaymentStatusBadge } from "./payment-status-badge";
import { OrderStatusBadge } from "./order-status-badge";

type OrderWithDetails = Order & {
  items: (OrderItem & {
    product: Product;
  })[];
  table: Table | null;
  staff: Pick<User, "name" | "email">;
};

interface OrderInvoiceProps {
  order: OrderWithDetails;
  locationName?: string;
  locationAddress?: string;
  locationPhone?: string;
}

export function OrderInvoice({
  order,
  locationName = "My-CafeMate",
  locationAddress,
  locationPhone,
}: OrderInvoiceProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="w-full">
      <CardHeader className="print:border-b">
        <div className="flex items-center justify-between print:hidden">
          <h2 className="text-2xl font-bold">Invoice</h2>
          <Button onClick={handlePrint} size="sm" variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print Invoice
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Business Header */}
        <div className="text-center border-b pb-4">
          <h1 className="text-3xl font-bold text-coffee-700">{locationName}</h1>
          {locationAddress && (
            <p className="text-sm text-muted-foreground mt-1">{locationAddress}</p>
          )}
          {locationPhone && (
            <p className="text-sm text-muted-foreground">{locationPhone}</p>
          )}
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-semibold text-coffee-700 mb-2">Invoice Details</h3>
            <p className="text-muted-foreground">Invoice #: <span className="text-foreground font-medium">{order.orderNumber}</span></p>
            <p className="text-muted-foreground">Date: <span className="text-foreground font-medium">{formatDateTime(order.createdAt)}</span></p>
            {order.table && (
              <p className="text-muted-foreground">Table: <span className="text-foreground font-medium">#{order.table.number}</span></p>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-coffee-700 mb-2">Staff Details</h3>
            <p className="text-muted-foreground">Served by: <span className="text-foreground font-medium">{order.staff.name}</span></p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-muted-foreground text-xs">Status:</span>
              <OrderStatusBadge status={order.status} />
            </div>
            {order.paymentStatus && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-muted-foreground text-xs">Payment:</span>
                <PaymentStatusBadge status={order.paymentStatus} />
              </div>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-cream-100 border-b">
              <tr>
                <th className="text-left p-3 text-sm font-semibold text-coffee-700">Item</th>
                <th className="text-center p-3 text-sm font-semibold text-coffee-700">Quantity</th>
                <th className="text-right p-3 text-sm font-semibold text-coffee-700">Price</th>
                <th className="text-right p-3 text-sm font-semibold text-coffee-700">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="p-3">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      {item.notes && (
                        <p className="text-xs text-muted-foreground mt-1">Note: {item.notes}</p>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-center">{item.quantity}</td>
                  <td className="p-3 text-right">{formatCurrency(item.price)}</td>
                  <td className="p-3 text-right font-medium">{formatCurrency(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="space-y-2 border-t pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{order.tax > 0 ? "VAT (13%)" : "VAT"}</span>
            <span className="font-medium">{formatCurrency(order.tax)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span className="font-medium">-{formatCurrency(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <span>Total</span>
            <span className="text-coffee-700">{formatCurrency(order.total)}</span>
          </div>
        </div>

        {/* Payment Information */}
        {order.paymentMethod && (
          <div className="border-t pt-4">
            <h3 className="font-semibold text-coffee-700 mb-2">Payment Information</h3>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Payment Method:</span>
              <span className="font-medium uppercase">{order.paymentMethod}</span>
            </div>
            {order.paidAt && (
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-muted-foreground">Paid At:</span>
                <span className="font-medium">{formatDateTime(order.paidAt)}</span>
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        {order.notes && (
          <div className="border-t pt-4">
            <h3 className="font-semibold text-coffee-700 mb-2">Notes</h3>
            <p className="text-sm text-muted-foreground">{order.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground border-t pt-4">
          <p>Thank you for visiting {locationName}!</p>
          <p className="text-xs mt-1">This is a computer-generated invoice</p>
        </div>
      </CardContent>

      {/* Print-specific styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:border-b {
            border-bottom: 1px solid #e5e7eb;
          }
          .order-invoice-print,
          .order-invoice-print * {
            visibility: visible;
          }
          .order-invoice-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            margin: 1cm;
          }
        }
      `}</style>
    </Card>
  );
}
