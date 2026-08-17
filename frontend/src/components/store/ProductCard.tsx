import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import type { Product } from "../../api/types";
import { useWishlist } from "../../context/WishlistContext";
import { Badge } from "../ui/Badge";
import { Rating } from "../ui/Rating";
import { PriceDisplay } from "../ui/PriceDisplay";
import { cn } from "../../utils/cn";

export function ProductCard({ product }: { product: Product }) {
  const { isWishlisted, toggle } = useWishlist();
  const onSale = typeof product.compareAtPrice === "number" && product.compareAtPrice > product.price;
  const outOfStock = product.stock <= 0;
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="group flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
        <Link to={`/shop/${product.slug}`} className="block h-full w-full">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className={cn(
              "h-full w-full object-cover transition-transform duration-base group-hover:scale-105",
              outOfStock && "opacity-60",
            )}
          />
        </Link>

        <div className="pointer-events-none absolute inset-x-2 top-2 flex flex-wrap items-start justify-between gap-1">
          <div className="flex flex-col gap-1">
            {onSale && <Badge variant="accent">Sale</Badge>}
            {outOfStock && <Badge variant="neutral">Out of Stock</Badge>}
          </div>
        </div>

        <button
          type="button"
          onClick={() => toggle(product)}
          aria-pressed={wishlisted}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-foreground shadow-card backdrop-blur transition-colors hover:bg-surface"
        >
          <Heart className={cn("h-4 w-4", wishlisted && "fill-error text-error")} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-1">
        <Link
          to={`/shop/${product.slug}`}
          className="line-clamp-1 text-body font-medium text-foreground transition-colors hover:text-primary"
        >
          {product.name}
        </Link>
        <Rating value={product.rating} reviewCount={product.reviewCount} />
        <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} size="sm" />
      </div>
    </div>
  );
}
