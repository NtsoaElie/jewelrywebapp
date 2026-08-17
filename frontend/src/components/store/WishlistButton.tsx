import { Heart } from "lucide-react";
import type { Product } from "../../api/types";
import { useWishlist } from "../../context/WishlistContext";
import { Button } from "../ui/Button";
import { cn } from "../../utils/cn";

export function WishlistButton({ product }: { product: Product }) {
  const { isWishlisted, toggle } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      onClick={() => toggle(product)}
      aria-pressed={wishlisted}
      className={cn(wishlisted && "border-error/40 text-error hover:bg-error/5")}
    >
      <Heart className={cn("h-4 w-4", wishlisted && "fill-error")} aria-hidden="true" />
      {wishlisted ? "Wishlisted" : "Add to Wishlist"}
    </Button>
  );
}
