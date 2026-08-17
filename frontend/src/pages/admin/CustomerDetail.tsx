import { useParams, Link } from "react-router-dom";
import { getCustomer } from "../../api/mock/customers";
import { getOrdersByCustomer } from "../../api/mock/orders";
import { useAsync } from "../../hooks/useAsync";
import { Breadcrumbs } from "../../components/ui/Breadcrumbs";
import { OrderStatusBadge, CustomerStatusBadge } from "../../components/ui/StatusBadge";
import { PageSpinner } from "../../components/ui/Spinner";
import { ErrorState } from "../../components/ui/ErrorState";
import { EmptyState } from "../../components/ui/EmptyState";
import { buttonClasses } from "../../components/ui/Button";
import { formatDate, formatPrice, initials } from "../../utils/format";

async function loadCustomerData(id: string) {
  const [customer, orders] = await Promise.all([getCustomer(id), getOrdersByCustomer(id)]);
  return { customer, orders };
}

export function CustomerDetail() {
  const { customerId } = useParams<{ customerId: string }>();
  const { data, loading, error, refetch } = useAsync(() => loadCustomerData(customerId!), [customerId]);

  if (loading) return <PageSpinner label="Loading customer" />;
  if (error) return <ErrorState description={error} onRetry={refetch} />;
  if (!data?.customer) {
    return (
      <EmptyState
        title="Customer not found"
        description="This customer record may not exist."
        action={<Link to="/admin/customers" className={buttonClasses("primary", "md")}>Back to Customers</Link>}
      />
    );
  }

  const { customer, orders } = data;

  return (
    <div>
      <Breadcrumbs items={[{ label: "Customers", href: "/admin/customers" }, { label: customer.name }]} />

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-h3 font-semibold text-primary">
          {initials(customer.name)}
        </span>
        <div>
          <h1 className="font-display text-h1 font-semibold text-foreground">{customer.name}</h1>
          <p className="text-small text-muted-foreground">{customer.email}</p>
        </div>
        <CustomerStatusBadge status={customer.status} />
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 sm:max-w-md">
        <div className="rounded-md border border-border bg-surface p-4">
          <p className="text-caption text-muted-foreground">Orders</p>
          <p className="mt-1 text-h3 font-display font-semibold text-foreground">{customer.orderCount}</p>
        </div>
        <div className="rounded-md border border-border bg-surface p-4">
          <p className="text-caption text-muted-foreground">Total Spent</p>
          <p className="mt-1 text-h3 font-display font-semibold text-foreground">{formatPrice(customer.totalSpent)}</p>
        </div>
        <div className="rounded-md border border-border bg-surface p-4">
          <p className="text-caption text-muted-foreground">Joined</p>
          <p className="mt-1 text-h3 font-display font-semibold text-foreground">{formatDate(customer.createdAt)}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-h3 font-display font-semibold text-foreground">Order History</h2>
        {orders.length === 0 ? (
          <p className="mt-3 text-small text-muted-foreground">This customer hasn't placed any orders yet.</p>
        ) : (
          <div className="mt-3 divide-y divide-border border-y border-border">
            {orders.map((order) => (
              <Link key={order.id} to={`/admin/orders/${order.id}`} className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-muted/50">
                <div>
                  <p className="text-small font-medium text-foreground">{order.orderNumber}</p>
                  <p className="text-caption text-muted-foreground">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-small text-foreground">{formatPrice(order.total)}</span>
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
