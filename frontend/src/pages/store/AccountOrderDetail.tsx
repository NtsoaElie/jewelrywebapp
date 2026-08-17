import { useParams, Link } from "react-router-dom";
import { getOrder } from "../../api/mock/orders";
import { useAsync } from "../../hooks/useAsync";
import { Breadcrumbs } from "../../components/ui/Breadcrumbs";
import { OrderStatusBadge, PaymentStatusBadge } from "../../components/ui/StatusBadge";
import { PageSpinner } from "../../components/ui/Spinner";
import { ErrorState } from "../../components/ui/ErrorState";
import { EmptyState } from "../../components/ui/EmptyState";
import { buttonClasses } from "../../components/ui/Button";
import { formatDateTime, formatPrice } from "../../utils/format";

export function AccountOrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: order, loading, error, refetch } = useAsync(() => getOrder(orderId!), [orderId]);

  if (loading) return <PageSpinner label="Loading order" />;
  if (error) return <div className="container py-16"><ErrorState description={error} onRetry={refetch} /></div>;
  if (!order) {
    return (
      <div className="container py-16">
        <EmptyState
          title="Order not found"
          description="We couldn't find that order."
          action={<Link to="/account/orders" className={buttonClasses("primary", "md")}>Back to Orders</Link>}
        />
      </div>
    );
  }

  return (
    <div className="container py-8 sm:py-12">
      <Breadcrumbs
        items={[{ label: "Account", href: "/account" }, { label: "Orders", href: "/account/orders" }, { label: order.orderNumber }]}
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-h1 font-semibold text-foreground">{order.orderNumber}</h1>
          <p className="mt-1 text-small text-muted-foreground">Placed {formatDateTime(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="divide-y divide-border border-y border-border">
          {order.items.map((item, i) => (
            <div key={`${item.productId}-${i}`} className="flex items-center gap-4 py-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded bg-muted">
                <img src={item.image} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-small font-medium text-foreground">{item.name}</p>
                {item.variantLabel && <p className="text-caption text-muted-foreground">{item.variantLabel}</p>}
                <p className="text-caption text-muted-foreground">Qty {item.quantity}</p>
              </div>
              <span className="text-small text-foreground">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="h-fit space-y-6">
          <div className="rounded-md border border-border bg-surface p-6">
            <h2 className="text-h3 font-display font-semibold text-foreground">Summary</h2>
            <dl className="mt-3 space-y-2 text-small">
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

          <div className="rounded-md border border-border bg-surface p-6">
            <h2 className="text-h3 font-display font-semibold text-foreground">Shipping Address</h2>
            <address className="mt-3 text-small not-italic text-muted-foreground">
              {order.shippingAddress.fullName}
              <br />
              {order.shippingAddress.line1}
              {order.shippingAddress.line2 && (
                <>
                  <br />
                  {order.shippingAddress.line2}
                </>
              )}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              <br />
              {order.shippingAddress.country}
            </address>
          </div>
        </div>
      </div>
    </div>
  );
}
