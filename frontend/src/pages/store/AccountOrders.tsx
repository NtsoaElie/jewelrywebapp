import { Link } from "react-router-dom";
import { PackageSearch } from "lucide-react";
import { getOrdersByCustomer } from "../../api/mock/orders";
import { useAsync } from "../../hooks/useAsync";
import { Breadcrumbs } from "../../components/ui/Breadcrumbs";
import { OrderStatusBadge } from "../../components/ui/StatusBadge";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { Skeleton } from "../../components/ui/Skeleton";
import { buttonClasses } from "../../components/ui/Button";
import { formatDate, formatPrice } from "../../utils/format";

// Demo simplification: mock auth doesn't map to a seeded customer record, so the
// signed-in shopper's order history is represented by this fixed demo customer.
const DEMO_CUSTOMER_ID = "cust-1";

export function AccountOrders() {
  const { data: orders, loading, error, refetch } = useAsync(() => getOrdersByCustomer(DEMO_CUSTOMER_ID), []);

  return (
    <div className="container py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Account", href: "/account" }, { label: "Orders" }]} />
      <h1 className="mt-4 font-display text-h1 font-semibold text-foreground">Order History</h1>

      <div className="mt-8">
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        )}

        {error && <ErrorState description={error} onRetry={refetch} />}

        {!loading && !error && orders && orders.length === 0 && (
          <EmptyState
            icon={PackageSearch}
            title="No orders yet"
            description="When you place an order, it will show up here."
            action={
              <Link to="/shop" className={buttonClasses("primary", "md")}>
                Start Shopping
              </Link>
            }
          />
        )}

        {!loading && !error && orders && orders.length > 0 && (
          <div className="divide-y divide-border border-y border-border">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/account/orders/${order.id}`}
                className="flex flex-wrap items-center justify-between gap-3 py-4 transition-colors hover:bg-muted/50"
              >
                <div>
                  <p className="text-body font-medium text-foreground">{order.orderNumber}</p>
                  <p className="text-caption text-muted-foreground">
                    Placed {formatDate(order.createdAt)} · {order.items.length} {order.items.length === 1 ? "item" : "items"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-small font-medium text-foreground">{formatPrice(order.total)}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
