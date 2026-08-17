import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import type { Customer } from "../../api/types";
import { getCustomers } from "../../api/mock/customers";
import { useAsync } from "../../hooks/useAsync";
import { useDebounce } from "../../hooks/useDebounce";
import { DataTable, type DataTableColumn } from "../../components/admin/DataTable";
import { FilterBar } from "../../components/admin/FilterBar";
import { Card } from "../../components/ui/Card";
import { CustomerStatusBadge } from "../../components/ui/StatusBadge";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { Skeleton } from "../../components/ui/Skeleton";
import { formatDate, formatPrice, initials } from "../../utils/format";

export function Customers() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { data: customers, loading, error, refetch } = useAsync(() => getCustomers(debouncedSearch || undefined), [debouncedSearch]);

  const columns: DataTableColumn<Customer>[] = [
    {
      header: "Customer",
      accessor: (c) => (
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-caption font-semibold text-primary">
            {initials(c.name)}
          </span>
          <div className="min-w-0">
            <p className="line-clamp-1 font-medium text-foreground">{c.name}</p>
            <p className="text-caption text-muted-foreground">{c.email}</p>
          </div>
        </div>
      ),
    },
    { header: "Orders", accessor: (c) => c.orderCount },
    { header: "Total Spent", accessor: (c) => formatPrice(c.totalSpent) },
    { header: "Joined", accessor: (c) => formatDate(c.createdAt) },
    { header: "Status", accessor: (c) => <CustomerStatusBadge status={c.status} /> },
  ];

  return (
    <div>
      <h1 className="font-display text-h1 font-semibold text-foreground">Customers</h1>
      <p className="mt-1 text-small text-muted-foreground">View and manage your customer base.</p>

      <div className="mt-6 space-y-4">
        <FilterBar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search by name or email…" />

        {loading && (
          <div className="space-y-2">
            {Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        )}

        {error && <ErrorState description={error} onRetry={refetch} />}

        {!loading && !error && customers && customers.length === 0 && (
          <EmptyState icon={Users} title="No customers found" description={search ? "Try a different search term." : "Customers will appear here once they create an account."} />
        )}

        {!loading && !error && customers && customers.length > 0 && (
          <DataTable
            columns={columns}
            data={customers}
            keyFor={(c) => c.id}
            onRowClick={(c) => navigate(`/admin/customers/${c.id}`)}
            renderMobileCard={(c) => (
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-small font-semibold text-primary">
                    {initials(c.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 font-medium text-foreground">{c.name}</p>
                    <p className="text-caption text-muted-foreground">{c.email}</p>
                  </div>
                  <CustomerStatusBadge status={c.status} />
                </div>
                <div className="mt-2 flex justify-between text-small text-muted-foreground">
                  <span>{c.orderCount} orders</span>
                  <span>{formatPrice(c.totalSpent)}</span>
                </div>
              </Card>
            )}
          />
        )}
      </div>
    </div>
  );
}
