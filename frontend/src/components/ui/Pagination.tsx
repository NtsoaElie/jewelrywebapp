import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../utils/cn";

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function getPageNumbers(current: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages = new Set<number>([1, totalPages, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push("ellipsis");
    result.push(p);
  });
  return result;
}

export function Pagination({ page, pageSize, total, onPageChange, className }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className={cn("flex items-center justify-center gap-1", className)}>
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className="inline-flex h-10 w-10 items-center justify-center rounded text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </button>

      {getPageNumbers(page, totalPages).map((p, i) =>
        p === "ellipsis" ? (
          <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded text-small font-medium transition-colors",
              p === page ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted",
            )}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className="inline-flex h-10 w-10 items-center justify-center rounded text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  );
}
