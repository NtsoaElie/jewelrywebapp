import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, SearchX } from "lucide-react";
import type { ProductFilters as ProductFiltersType } from "../../api/types";
import { getProducts } from "../../api/mock/products";
import { useAsync } from "../../hooks/useAsync";
import { categories } from "../../data/categories";
import { products as allProducts } from "../../data/products";
import { ProductGrid, ProductGridSkeleton } from "../../components/store/ProductGrid";
import { ProductFilters, type ShopFilterState } from "../../components/store/ProductFilters";
import { SortSelect } from "../../components/store/SortSelect";
import { Breadcrumbs } from "../../components/ui/Breadcrumbs";
import { Pagination } from "../../components/ui/Pagination";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";

const ALL_COLLECTIONS = [...new Set(allProducts.map((p) => p.collection).filter((c): c is string => !!c))];
const PAGE_SIZE = 12;

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? undefined;
  const categorySlug = searchParams.get("category") ?? undefined;
  const sort = (searchParams.get("sort") as ProductFiltersType["sort"]) ?? "featured";

  const [localFilters, setLocalFilters] = useState<ShopFilterState>({ inStockOnly: false });
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>({});
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  const filters: ProductFiltersType = useMemo(
    () => ({
      categoryId: activeCategory?.id,
      collection: localFilters.collection,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      inStockOnly: localFilters.inStockOnly || undefined,
      minRating: localFilters.minRating,
      query,
      sort,
      status: "active",
      page,
      pageSize: PAGE_SIZE,
    }),
    [activeCategory, localFilters, priceRange, query, sort, page],
  );

  const { data, loading, error, refetch } = useAsync(() => getProducts(filters), [JSON.stringify(filters)]);

  const activeFilterCount = [
    activeCategory,
    localFilters.collection,
    localFilters.inStockOnly,
    localFilters.minRating,
    priceRange.min !== undefined || priceRange.max !== undefined,
  ].filter(Boolean).length;

  const updateCategory = (categoryId: string | undefined) => {
    const category = categories.find((c) => c.id === categoryId);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (category) next.set("category", category.slug);
      else next.delete("category");
      return next;
    });
    setPage(1);
  };

  const clearAllFilters = () => {
    setLocalFilters({ inStockOnly: false });
    setPriceRange({});
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("category");
      return next;
    });
    setPage(1);
  };

  const filterPanelProps = {
    categories,
    collections: ALL_COLLECTIONS,
    filters: { ...localFilters, categoryId: activeCategory?.id },
    priceRange,
    onCategoryChange: updateCategory,
    onCollectionChange: (collection: string | undefined) => {
      setLocalFilters((f) => ({ ...f, collection }));
      setPage(1);
    },
    onPriceRangeChange: (range: { min?: number; max?: number }) => {
      setPriceRange(range);
      setPage(1);
    },
    onInStockChange: (value: boolean) => {
      setLocalFilters((f) => ({ ...f, inStockOnly: value }));
      setPage(1);
    },
    onRatingChange: (value: number | undefined) => {
      setLocalFilters((f) => ({ ...f, minRating: value }));
      setPage(1);
    },
    onClear: clearAllFilters,
    activeCount: activeFilterCount,
  };

  const heading = query ? `Search results for "${query}"` : activeCategory ? activeCategory.name : "Shop All";

  return (
    <div className="container py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, ...(activeCategory ? [{ label: activeCategory.name }] : [])]} />

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-h1 font-semibold text-foreground">{heading}</h1>
          {!loading && data && <p className="mt-1 text-small text-muted-foreground">{data.total} {data.total === 1 ? "product" : "products"}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </Button>
          <SortSelect
            value={sort ?? "featured"}
            onChange={(value) =>
              setSearchParams((prev) => {
                const next = new URLSearchParams(prev);
                next.set("sort", value);
                return next;
              })
            }
          />
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <ProductFilters {...filterPanelProps} />
        </aside>

        <div>
          {loading && <ProductGridSkeleton count={PAGE_SIZE} />}

          {error && <ErrorState description={error} onRetry={refetch} />}

          {!loading && !error && data && data.items.length === 0 && (
            <EmptyState
              icon={SearchX}
              title={query ? "No products found" : "No products match your filters"}
              description={
                query
                  ? `We couldn't find anything for "${query}". Try a different search term.`
                  : "Try adjusting or clearing your filters to see more results."
              }
              action={
                activeFilterCount > 0 ? (
                  <Button variant="outline" onClick={clearAllFilters}>
                    Clear Filters
                  </Button>
                ) : undefined
              }
            />
          )}

          {!loading && !error && data && data.items.length > 0 && (
            <>
              <ProductGrid products={data.items} />
              <Pagination page={page} pageSize={PAGE_SIZE} total={data.total} onPageChange={setPage} className="mt-10" />
            </>
          )}
        </div>
      </div>

      <Modal open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} title="Filters" size="lg">
        <ProductFilters {...filterPanelProps} />
        <Button className="mt-4 w-full" onClick={() => setMobileFiltersOpen(false)}>
          Show {data?.total ?? 0} Results
        </Button>
      </Modal>
    </div>
  );
}
