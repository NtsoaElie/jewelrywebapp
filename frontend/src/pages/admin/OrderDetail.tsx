import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { OrderStatus } from "../../api/types";
import { getOrder, updateOrderStatus } from "../../api/mock/orders";
import { useAsync } from "../../hooks/useAsync";
import { useToast } from "../../context/ToastContext";
import { Breadcrumbs } from "../../components/ui/Breadcrumbs";
import { OrderStatusBadge, PaymentStatusBadge } from "../../components/ui/StatusBadge";
import { Select } from "../../components/ui/Select";
import { Button, buttonClasses } from "../../components/ui/Button";
import { PageSpinner } from "../../components/ui/Spinner";
import { ErrorState } from "../../components/ui/ErrorState";
import { EmptyState } from "../../components/ui/EmptyState";
import { formatDateTime, formatPrice } from "../../utils/format";

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: order, loading, error, refetch } = useAsync(() => getOrder(orderId!), [orderId]);
  const { showToast } = useToast();
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [saving, setSaving] = useState(false);

  if (loading) return <PageSpinner label="Loading order" />;
  if (error) return <ErrorState description={error} onRetry={refetch} />;
  if (!order) {
    return (
      <EmptyState
        title="Order not found"
        description="This order may not exist."
        action={<Link to="/admin/orders" className={buttonClasses("primary", "md")}>Back to Orders</Link>}
      />
    );
  }

  const currentStatus = status ?? order.status;

  const handleUpdateStatus = async () => {
    setSaving(true);
    try {
      await updateOrderStatus(order.id, currentStatus);
      showToast("Order status updated", { description: `${order.orderNumber} marked as ${currentStatus}.` });
      refetch();
    } catch (err) {
      showToast("Couldn't update status", { description: err instanceof Error ? err.message : undefined, variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Breadcrumbs items={[{ label: "Orders", href: "/admin/orders" }, { label: order.orderNumber }]} />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-h1 font-semibold text-foreground">{order.orderNumber}</h1>
          <p className="mt-1 text-small text-muted-foreground">Placed {formatDateTime(order.createdAt)}</p>
        </div>
        <PaymentStatusBadge status={order.paymentStatus} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="rounded-md border border-border bg-surface p-5">
            <h2 className="text-h3 font-display font-semibold text-foreground">Items</h2>
            <div className="mt-3 divide-y divide-border">
              {order.items.map((item, i) => (
                <div key={`${item.productId}-${i}`} className="flex items-center gap-4 py-3">
                  <img src={item.image} alt="" className="h-14 w-14 shrink-0 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-small font-medium text-foreground">{item.name}</p>
                    {item.variantLabel && <p className="text-caption text-muted-foreground">{item.variantLabel}</p>}
                    <p className="text-caption text-muted-foreground">Qty {item.quantity}</p>
                  </div>
                  <span className="text-small text-foreground">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <dl className="mt-3 space-y-2 border-t border-border pt-4 text-small">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="text-foreground">{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className="text-foreground">{formatPrice(order.shipping)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Tax</dt>
                <dd className="text-foreground">{formatPrice(order.tax)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-body font-semibold text-foreground">
                <dt>Total</dt>
                <dd>{formatPrice(order.total)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-md border border-border bg-surface p-5">
            <h2 className="text-h3 font-display font-semibold text-foreground">Shipping Address</h2>
            <address className="mt-2 text-small not-italic text-muted-foreground">
              {order.shippingAddress.fullName}
              <br />
              {order.shippingAddress.line1}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              <br />
              {order.shippingAddress.country}
            </address>
          </div>
        </div>

        <div className="h-fit space-y-6">
          <div className="rounded-md border border-border bg-surface p-5">
            <h2 className="text-h3 font-display font-semibold text-foreground">Customer</h2>
            <p className="mt-2 text-small font-medium text-foreground">{order.customerName}</p>
            <p className="text-small text-muted-foreground">{order.customerEmail}</p>
          </div>

          <div className="rounded-md border border-border bg-surface p-5">
            <h2 className="text-h3 font-display font-semibold text-foreground">Order Status</h2>
            <div className="mt-1 mb-3">
              <OrderStatusBadge status={order.status} />
            </div>
            <Select label="Update status" value={currentStatus} onChange={(e) => setStatus(e.target.value as OrderStatus)} options={STATUS_OPTIONS} />
            <Button className="mt-3 w-full" onClick={handleUpdateStatus} loading={saving} disabled={currentStatus === order.status}>
              Update Status
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
