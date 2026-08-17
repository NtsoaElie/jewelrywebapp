import { Star } from "lucide-react";
import { cn } from "../../utils/cn";

export function Rating({ value, reviewCount, size = "sm" }: { value: number; reviewCount?: number; size?: "sm" | "md" }) {
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <div className="flex items-center gap-1.5">
      <span className="flex items-center" role="img" aria-label={`Rated ${value.toFixed(1)} out of 5 stars`}>
        {Array.from({ length: 5 }, (_, i) => {
          const filled = i + 1 <= Math.round(value);
          return <Star key={i} className={cn(iconSize, filled ? "fill-accent text-accent" : "text-border")} aria-hidden="true" />;
        })}
      </span>
      {typeof reviewCount === "number" && (
        <span className="text-caption text-muted-foreground">
          {value.toFixed(1)} ({reviewCount})
        </span>
      )}
    </div>
  );
}
