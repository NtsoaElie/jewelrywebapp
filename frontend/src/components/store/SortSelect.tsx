import type { ProductFilters } from "../../api/types";
import { Select } from "../ui/Select";

const SORT_OPTIONS: { value: NonNullable<ProductFilters["sort"]>; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export function SortSelect({
  value,
  onChange,
}: {
  value: NonNullable<ProductFilters["sort"]>;
  onChange: (value: NonNullable<ProductFilters["sort"]>) => void;
}) {
  return (
    <Select
      aria-label="Sort products"
      value={value}
      onChange={(e) => onChange(e.target.value as NonNullable<ProductFilters["sort"]>)}
      options={SORT_OPTIONS}
      className="h-10 w-auto min-w-[9rem]"
    />
  );
}
