import { formatPrice } from "../../utils/format";
import { cn } from "../../utils/cn";

export function PriceDisplay({
  price,
  compareAtPrice,
  size = "md",
  className,
}: {
  price: number;
  compareAtPrice?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const onSale = typeof compareAtPrice === "number" && compareAtPrice > price;
  const sizeClass = size === "lg" ? "text-h2" : size === "md" ? "text-h3" : "text-body";

  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span className={cn("font-semibold text-foreground", sizeClass)}>{formatPrice(price)}</span>
      {onSale && (
        <span className="text-small text-muted-foreground line-through">{formatPrice(compareAtPrice!)}</span>
      )}
    </span>
  );
}
