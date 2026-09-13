import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Eye, Pencil, Trash2, PackageX } from "lucide-react";
import type { ProductFilters, ProductStatus } from "../../api/types";
import { getProducts, deleteProduct } from "../../api/products";
import { useAsync } from "../../hooks/useAsync";
import { useDebounce } from "../../hooks/useDebounce";
import { useToast } from "../../context/ToastContext";
import { useCategories } from "../../hooks/useCategories";
import { DataTable, type DataTableColumn } from "../../components/admin/DataTable";
import { FilterBar } from "../../components/admin/FilterBar";
import { Select } from "../../components/ui/Select";
import { Button, buttonClasses } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { StockStatusBadge, ProductStatusBadge } from "../../components/ui/StatusBadge";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { Pagination } from "../../components/ui/Pagination";
import { Skeleton } from "../../components/ui/Skeleton";
import { formatDate, formatPrice } from "../../utils/format";
import type { Product } from "../../api/types";

const PAGE_SIZE = 10;

const STATUS_FILTER_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Date Added" },
  { value: "name", label: "Name" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "stock", label: "Stock" },
];

export function Products() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { byId, options: categoryOptions } = useCategories();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<ProductStatus | "">("");
  const [sort, setSort] = useState<NonNullable<ProductFilters["sort"]>>("newest");
  const [page, setPage] = useState(1);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filters: ProductFilters = useMemo(
    () => ({
      query: debouncedSearch || undefined,
      categoryId: categoryId || undefined,
      status: status || undefined,
      sort,
      page,
      pageSize: PAGE_SIZE,
    }),
    [debouncedSearch, categoryId, status, sort, page],
  );

  const { data, loading, error, refetch } = useAsync(() => getProducts(filters), [JSON.stringify(filters)]);

  const activeCount = [debouncedSearch, categoryId, status].filter(Boolean).length;

  const clearFilters = () => {
    setSearch("");
    setCategoryId("");
    setStatus("");
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deletingProduct.id);
      showToast("Product deleted", { description: deletingProduct.name, variant: "success" });
      setDeletingProduct(null);
      refetch();
    } catch (err) {
      showToast("Couldn't delete product", { description: err instanceof Error ? err.message : undefined, variant: "error" });
    } finally {
      setIsDeleting(false);
    }
  };

  const categoryName = (id: string) => byId(id)?.name ?? "—";

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
    { header: "Stock", accessor: (p) => <StockStatusBadge stock={p.stock} lowStockThreshold={p.lowStockThreshold} /> },
    { header: "Status", accessor: (p) => <ProductStatusBadge status={p.status} /> },
    { header: "Added", accessor: (p) => formatDate(p.createdAt) },
    {
      header: "Actions",
      className: "text-right",
      accessor: (p) => (
        <div className="flex justify-end gap-1">
          <Link
            to={`/shop/${p.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label={`View ${p.name} on storefront`}
            className="flex h-9 w-9 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            to={`/admin/products/${p.id}/edit`}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Edit ${p.name}`}
            className="flex h-9 w-9 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setDeletingProduct(p);
            }}
            aria-label={`Delete ${p.name}`}
            className="flex h-9 w-9 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-error"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-h1 font-semibold text-foreground">Products</h1>
          <p className="mt-1 text-small text-muted-foreground">Manage your product catalog.</p>
        </div>
        <Link to="/admin/products/new" className={buttonClasses("primary", "md")}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Product
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        <FilterBar searchValue={search} onSearchChange={(v) => { setSearch(v); setPage(1); }} searchPlaceholder="Search products or SKU…" onClear={clearFilters} activeCount={activeCount}>
          <Select
            aria-label="Filter by category"
            value={categoryId}
            onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
            options={[{ value: "", label: "All Categories" }, ...categoryOptions]}
            className="h-11 w-auto min-w-[10rem]"
          />
          <Select
            aria-label="Filter by status"
            value={status}
            onChange={(e) => { setStatus(e.target.value as ProductStatus | ""); setPage(1); }}
            options={STATUS_FILTER_OPTIONS}
            className="h-11 w-auto min-w-[9rem]"
          />
          <Select aria-label="Sort by" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} options={SORT_OPTIONS} className="h-11 w-auto min-w-[10rem]" />
        </FilterBar>

        {loading && (
          <div className="space-y-2">
            {Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        )}

        {error && <ErrorState description={error} onRetry={refetch} />}

        {!loading && !error && data && data.items.length === 0 && (
          <EmptyState
            icon={PackageX}
            title="No products found"
            description={activeCount > 0 ? "Try adjusting your filters or search terms." : "Get started by adding your first product."}
            action={
              activeCount > 0 ? (
                <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
              ) : (
                <Link to="/admin/products/new" className={buttonClasses("primary", "md")}>Add Product</Link>
              )
            }
          />
        )}

        {!loading && !error && data && data.items.length > 0 && (
          <>
            <DataTable
              columns={columns}
              data={data.items}
              keyFor={(p) => p.id}
              onRowClick={(p) => navigate(`/admin/products/${p.id}/edit`)}
              renderMobileCard={(p) => (
                <Card className="p-4">
                  <div className="flex gap-3">
                    <img src={p.images[0]} alt="" className="h-14 w-14 shrink-0 rounded object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 font-medium text-foreground">{p.name}</p>
                      <p className="text-caption text-muted-foreground">{categoryName(p.categoryId)} · {p.sku}</p>
                      <p className="mt-1 text-small font-medium text-foreground">{formatPrice(p.price)}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <StockStatusBadge stock={p.stock} lowStockThreshold={p.lowStockThreshold} />
                        <ProductStatusBadge status={p.status} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2 border-t border-border pt-3">
                    <Link to={`/admin/products/${p.id}/edit`} className={buttonClasses("outline", "sm", "flex-1")}>
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      Edit
                    </Link>
                    <Button variant="outline" size="sm" className="flex-1 text-error hover:bg-error/5" onClick={() => setDeletingProduct(p)}>
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      Delete
                    </Button>
                  </div>
                </Card>
              )}
            />
            <Pagination page={page} pageSize={PAGE_SIZE} total={data.total} onPageChange={setPage} className="mt-6" />
          </>
        )}
      </div>

      <ConfirmDialog
        open={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDelete}
        title="Delete this product?"
        description={deletingProduct ? `"${deletingProduct.name}" will be permanently removed from your catalog. This can't be undone.` : undefined}
        confirmLabel="Delete Product"
        loading={isDeleting}
      />
    </div>
  );
}
