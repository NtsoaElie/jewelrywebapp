import type { Category } from "../../api/types";
import { Checkbox } from "../ui/Checkbox";
import { Button } from "../ui/Button";
import { formatPrice } from "../../utils/format";
import { cn } from "../../utils/cn";

export interface ShopFilterState {
  categoryId?: string;
  collection?: string;
  inStockOnly: boolean;
  minRating?: number;
}

const PRICE_PRESETS = [
  { label: "Under $500", min: 0, max: 50000 },
  { label: "$500 – $1,000", min: 50000, max: 100000 },
  { label: "$1,000 – $2,000", min: 100000, max: 200000 },
  { label: "Over $2,000", min: 200000, max: undefined },
];

interface ProductFiltersProps {
  categories: Category[];
  collections: string[];
  filters: ShopFilterState;
  priceRange: { min?: number; max?: number };
  onCategoryChange: (categoryId: string | undefined) => void;
  onCollectionChange: (collection: string | undefined) => void;
  onPriceRangeChange: (range: { min?: number; max?: number }) => void;
  onInStockChange: (value: boolean) => void;
  onRatingChange: (value: number | undefined) => void;
  onClear: () => void;
  activeCount: number;
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border py-5 first:pt-0 last:border-b-0">
      <h3 className="mb-3 text-label font-semibold uppercase tracking-wide text-foreground">{title}</h3>
      {children}
    </div>
  );
}

export function ProductFilters({
  categories,
  collections,
  filters,
  priceRange,
  onCategoryChange,
  onCollectionChange,
  onPriceRangeChange,
  onInStockChange,
  onRatingChange,
  onClear,
  activeCount,
}: ProductFiltersProps) {
  return (
    <div>
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-h3 font-display font-semibold text-foreground">Filters</h2>
        {activeCount > 0 && (
          <Button variant="link" size="sm" onClick={onClear}>
            Clear all ({activeCount})
          </Button>
        )}
      </div>

      <FilterSection title="Category">
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => onCategoryChange(undefined)}
            className={cn(
              "text-left text-small transition-colors",
              !filters.categoryId ? "font-semibold text-primary" : "text-foreground hover:text-primary",
            )}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange(cat.id)}
              className={cn(
                "text-left text-small transition-colors",
                filters.categoryId === cat.id ? "font-semibold text-primary" : "text-foreground hover:text-primary",
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price">
        <div className="flex flex-col gap-2.5">
          {PRICE_PRESETS.map((preset) => {
            const active = priceRange.min === preset.min && priceRange.max === preset.max;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => onPriceRangeChange(active ? {} : { min: preset.min, max: preset.max })}
                className={cn(
                  "text-left text-small transition-colors",
                  active ? "font-semibold text-primary" : "text-foreground hover:text-primary",
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </FilterSection>

      <FilterSection title="Collection">
        <div className="flex flex-col gap-2.5">
          {collections.map((collection) => (
            <button
              key={collection}
              type="button"
              onClick={() => onCollectionChange(filters.collection === collection ? undefined : collection)}
              className={cn(
                "text-left text-small transition-colors",
                filters.collection === collection ? "font-semibold text-primary" : "text-foreground hover:text-primary",
              )}
            >
              {collection}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Rating">
        <div className="flex flex-col gap-2.5">
          {[4, 3].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => onRatingChange(filters.minRating === rating ? undefined : rating)}
              className={cn(
                "text-left text-small transition-colors",
                filters.minRating === rating ? "font-semibold text-primary" : "text-foreground hover:text-primary",
              )}
            >
              {rating}+ stars
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Availability">
        <Checkbox label="In stock only" checked={filters.inStockOnly} onChange={(e) => onInStockChange(e.target.checked)} />
      </FilterSection>
    </div>
  );
}

export function summarizePriceRange(range: { min?: number; max?: number }): string | null {
  if (range.min === undefined && range.max === undefined) return null;
  if (range.max === undefined) return `Over ${formatPrice(range.min ?? 0)}`;
  return `${formatPrice(range.min ?? 0)} – ${formatPrice(range.max)}`;
}
