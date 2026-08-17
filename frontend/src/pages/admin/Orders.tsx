import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import type { Order, OrderStatus } from "../../api/types";
import { getOrders } from "../../api/mock/orders";
import { useAsync } from "../../hooks/useAsync";
import { useDebounce } from "../../hooks/useDebounce";
import { DataTable, type DataTableColumn } from "../../components/admin/DataTable";
import { FilterBar } from "../../components/admin/FilterBar";
import { Select } from "../../components/ui/Select";
import { Card } from "../../components/ui/Card";
import { OrderStatusBadge, PaymentStatusBadge } from "../../components/ui/StatusBadge";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { Skeleton } from "../../components/ui/Skeleton";
import { formatDate, formatPrice } from "../../utils/format";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export function Orders() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [status, setStatus] = useState<OrderStatus | "">("");

  const filters = useMemo(() => ({ query: debouncedSearch || undefined, status: status || undefined }), [debouncedSearch, status]);
  const { data: orders, loading, error, refetch } = useAsync(() => getOrders(filters), [JSON.stringify(filters)]);

  const activeCount = [debouncedSearch, status].filter(Boolean).length;

  const columns: DataTableColumn<Order>[] = [
    { header: "Order", accessor: (o) => <span className="font-medium text-foreground">{o.orderNumber}</span> },
    { header: "Customer", accessor: (o) => o.customerName },
    { header: "Date", accessor: (o) => formatDate(o.createdAt) },
    { header: "Total", accessor: (o) => formatPrice(o.total) },
    { header: "Payment", accessor: (o) => <PaymentStatusBadge status={o.paymentStatus} /> },
    { header: "Status", accessor: (o) => <OrderStatusBadge status={o.status} /> },
  ];

  return (
    <div>
      <h1 className="font-display text-h1 font-semibold text-foreground">Orders</h1>
      <p className="mt-1 text-small text-muted-foreground">Review and manage customer orders.</p>

      <div className="mt-6 space-y-4">
        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search order # or customer…"
          onClear={() => { setSearch(""); setStatus(""); }}
          activeCount={activeCount}
        >
          <Select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value as OrderStatus | "")} options={STATUS_OPTIONS} className="h-11 w-auto min-w-[10rem]" />
        </FilterBar>

        {loading && (
          <div className="space-y-2">
            {Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        )}

        {error && <ErrorState description={error} onRetry={refetch} />}

        {!loading && !error && orders && orders.length === 0 && (
          <EmptyState icon={ShoppingCart} title="No orders found" description={activeCount > 0 ? "Try adjusting your filters or search terms." : "Orders will appear here once customers start purchasing."} />
        )}

        {!loading && !error && orders && orders.length > 0 && (
          <DataTable
            columns={columns}
            data={orders}
            keyFor={(o) => o.id}
            onRowClick={(o) => navigate(`/admin/orders/${o.id}`)}
            renderMobileCard={(o) => (
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground">{o.orderNumber}</p>
                  <span className="text-small text-foreground">{formatPrice(o.total)}</span>
                </div>
                <p className="mt-1 text-caption text-muted-foreground">{o.customerName} · {formatDate(o.createdAt)}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <OrderStatusBadge status={o.status} />
                  <PaymentStatusBadge status={o.paymentStatus} />
                </div>
              </Card>
            )}
          />
        )}
      </div>
    </div>
  );
}
