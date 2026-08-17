import type { ReactNode } from "react";
import { Search, X } from "lucide-react";
import { Button } from "../ui/Button";

export function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search…",
  children,
  onClear,
  activeCount = 0,
}: {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  children?: ReactNode;
  onClear?: () => void;
  activeCount?: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-[220px] flex-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <label htmlFor="admin-filter-search" className="sr-only">
          Search
        </label>
        <input
          id="admin-filter-search"
          type="search"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="h-11 w-full rounded border border-border bg-surface pl-10 pr-4 text-body text-foreground placeholder:text-muted-foreground transition-colors duration-short focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        />
      </div>
      {children}
      {onClear && activeCount > 0 && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="h-4 w-4" aria-hidden="true" />
          Clear ({activeCount})
        </Button>
      )}
    </div>
  );
}
