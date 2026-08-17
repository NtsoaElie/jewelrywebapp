import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Boxes } from "lucide-react";
import type { Product } from "../../api/types";
import { getProducts } from "../../api/mock/products";
import { useAsync } from "../../hooks/useAsync";
import { useDebounce } from "../../hooks/useDebounce";
import { categories } from "../../data/categories";
import { DataTable, type DataTableColumn } from "../../components/admin/DataTable";
import { FilterBar } from "../../components/admin/FilterBar";
import { Select } from "../../components/ui/Select";
import { Card } from "../../components/ui/Card";
import { StockStatusBadge } from "../../components/ui/StatusBadge";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { Skeleton } from "../../components/ui/Skeleton";
import { formatPrice } from "../../utils/format";

type StockFilter = "" | "in-stock" | "low-stock" | "out-of-stock";

const STOCK_FILTER_OPTIONS = [
  { value: "", label: "All Stock Levels" },
  { value: "in-stock", label: "In Stock" },
  { value: "low-stock", label: "Low Stock" },
  { value: "out-of-stock", label: "Out of Stock" },
];

function matchesStockFilter(product: Product, filter: StockFilter): boolean {
  if (filter === "in-stock") return product.stock > product.lowStockThreshold;
  if (filter === "low-stock") return product.stock > 0 && product.stock <= product.lowStockThreshold;
  if (filter === "out-of-stock") return product.stock <= 0;
  return true;
}

export function Inventory() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [categoryId, setCategoryId] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("");

  const { data, loading, error, refetch } = useAsync(
    () => getProducts({ query: debouncedSearch || undefined, categoryId: categoryId || undefined, pageSize: 1000, sort: "stock" }),
    [debouncedSearch, categoryId],
  );

  const filtered = useMemo(() => (data ? data.items.filter((p) => matchesStockFilter(p, stockFilter)) : []), [data, stockFilter]);
  const activeCount = [debouncedSearch, categoryId, stockFilter].filter(Boolean).length;
  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? "—";

  const columns: DataTableColumn<Product>[] = [
    {
      header: "Product",
      accessor: (p) => (
        <div className="flex items-center gap-3">
          <img src={p.images[0]} alt="" className="h-10 w-10 shrink-0 rounded object-cover" />
          <div className="min-w-0">
            <p className="line-clamp-1 font-medium text-foreground">{p.name}</p>
            <p className="text-caption text-muted-foreground">{p.sku}</p>
          </div>
        </div>
      ),
    },
    { header: "Category", accessor: (p) => categoryName(p.categoryId) },
    { header: "Price", accessor: (p) => formatPrice(p.price) },
    { header: "Current Stock", accessor: (p) => p.stock },
    { header: "Threshold", accessor: (p) => p.lowStockThreshold },
    { header: "Status", accessor: (p) => <StockStatusBadge stock={p.stock} lowStockThreshold={p.lowStockThreshold} /> },
  ];

  return (
    <div>
      <h1 className="font-display text-h1 font-semibold text-foreground">Inventory</h1>
      <p className="mt-1 text-small text-muted-foreground">Monitor stock levels across your catalog.</p>

      <div className="mt-6 space-y-4">
        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search products or SKU…"
          onClear={() => { setSearch(""); setCategoryId(""); setStockFilter(""); }}
          activeCount={activeCount}
        >
          <Select aria-label="Filter by category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} options={[{ value: "", label: "All Categories" }, ...categories.map((c) => ({ value: c.id, label: c.name }))]} className="h-11 w-auto min-w-[10rem]" />
          <Select aria-label="Filter by stock level" value={stockFilter} onChange={(e) => setStockFilter(e.target.value as StockFilter)} options={STOCK_FILTER_OPTIONS} className="h-11 w-auto min-w-[10rem]" />
        </FilterBar>

        {loading && (
          <div className="space-y-2">
            {Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        )}

        {error && <ErrorState description={error} onRetry={refetch} />}

        {!loading && !error && filtered.length === 0 && (
          <EmptyState icon={Boxes} title="No products match these filters" description="Try adjusting your search or filters." />
        )}

        {!loading && !error && filtered.length > 0 && (
          <DataTable
            columns={columns}
            data={filtered}
            keyFor={(p) => p.id}
            onRowClick={(p) => navigate(`/admin/products/${p.id}/edit`)}
            renderMobileCard={(p) => (
              <Card className="p-4">
                <div className="flex gap-3">
                  <img src={p.images[0]} alt="" className="h-14 w-14 shrink-0 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 font-medium text-foreground">{p.name}</p>
                    <p className="text-caption text-muted-foreground">{categoryName(p.categoryId)} · Stock: {p.stock}</p>
                    <div className="mt-2">
                      <StockStatusBadge stock={p.stock} lowStockThreshold={p.lowStockThreshold} />
                    </div>
                  </div>
                </div>
              </Card>
            )}
          />
        )}
      </div>
    </div>
  );
}
