import { Link } from "react-router-dom";
import { Package, Boxes, AlertTriangle, ShoppingCart, Clock, DollarSign } from "lucide-react";
import { getProducts } from "../../api/mock/products";
import { getOrders } from "../../api/mock/orders";
import { useAsync } from "../../hooks/useAsync";
import { StatCard } from "../../components/admin/StatCard";
import { OrderStatusBadge } from "../../components/ui/StatusBadge";
import { PageSpinner } from "../../components/ui/Spinner";
import { ErrorState } from "../../components/ui/ErrorState";
import { formatDate, formatPrice } from "../../utils/format";

async function loadDashboardData() {
  const [productsResult, orders] = await Promise.all([getProducts({ pageSize: 1000 }), getOrders()]);
  return { products: productsResult.items, orders };
}

export function Dashboard() {
  const { data, loading, error, refetch } = useAsync(loadDashboardData, []);

  if (loading) return <PageSpinner label="Loading dashboard" />;
  if (error || !data) return <ErrorState description={error ?? "Unable to load dashboard data."} onRetry={refetch} />;

  const { products, orders } = data;

  const inStock = products.filter((p) => p.stock > 0).length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const revenue = orders.filter((o) => o.paymentStatus === "paid").reduce((sum, o) => sum + o.total, 0);

  const recentOrders = orders.slice(0, 5);
  const recentProducts = [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const soldByProduct = new Map<string, number>();
  orders.forEach((o) => o.items.forEach((item) => soldByProduct.set(item.productId, (soldByProduct.get(item.productId) ?? 0) + item.quantity)));
  const bestSellers = [...soldByProduct.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([productId, sold]) => ({ product: products.find((p) => p.id === productId), sold }))
    .filter((entry): entry is { product: NonNullable<typeof entry.product>; sold: number } => !!entry.product);

  return (
    <div>
      <h1 className="font-display text-h1 font-semibold text-foreground">Dashboard</h1>
      <p className="mt-1 text-small text-muted-foreground">Here's what's happening with your store today.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard icon={Package} label="Total Products" value={String(products.length)} />
        <StatCard icon={Boxes} label="In Stock" value={String(inStock)} />
        <StatCard icon={AlertTriangle} label="Low Stock" value={String(lowStock)} tone="warning" hint={lowStock > 0 ? "Needs attention" : undefined} />
        <StatCard icon={ShoppingCart} label="Total Orders" value={String(orders.length)} />
        <StatCard icon={Clock} label="Pending Orders" value={String(pendingOrders)} tone={pendingOrders > 0 ? "warning" : "primary"} />
        <StatCard icon={DollarSign} label="Revenue" value={formatPrice(revenue)} tone="accent" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-md border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-h3 font-display font-semibold text-foreground">Recent Orders</h2>
            <Link to="/admin/orders" className="text-small font-medium text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="mt-4 divide-y divide-border">
            {recentOrders.map((order) => (
              <Link key={order.id} to={`/admin/orders/${order.id}`} className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-muted/50">
                <div>
                  <p className="text-small font-medium text-foreground">{order.orderNumber}</p>
                  <p className="text-caption text-muted-foreground">{order.customerName} · {formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-small text-foreground">{formatPrice(order.total)}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-md border border-border bg-surface p-5">
            <h2 className="text-h3 font-display font-semibold text-foreground">Recently Added</h2>
            <ul className="mt-3 divide-y divide-border">
              {recentProducts.map((product) => (
                <li key={product.id}>
                  <Link to={`/admin/products/${product.id}/edit`} className="flex items-center gap-3 py-2.5 transition-colors hover:bg-muted/50">
                    <img src={product.images[0]} alt="" className="h-10 w-10 shrink-0 rounded object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-small font-medium text-foreground">{product.name}</p>
                      <p className="text-caption text-muted-foreground">{formatDate(product.createdAt)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-md border border-border bg-surface p-5">
            <h2 className="text-h3 font-display font-semibold text-foreground">Best Sellers</h2>
            {bestSellers.length === 0 ? (
              <p className="mt-3 text-small text-muted-foreground">No sales yet.</p>
            ) : (
              <ul className="mt-3 divide-y divide-border">
                {bestSellers.map(({ product, sold }) => (
                  <li key={product.id}>
                    <Link to={`/admin/products/${product.id}/edit`} className="flex items-center gap-3 py-2.5 transition-colors hover:bg-muted/50">
                      <img src={product.images[0]} alt="" className="h-10 w-10 shrink-0 rounded object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-small font-medium text-foreground">{product.name}</p>
                        <p className="text-caption text-muted-foreground">{sold} sold</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
