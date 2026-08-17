import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";
import { ProductGrid } from "../../components/store/ProductGrid";
import { EmptyState } from "../../components/ui/EmptyState";
import { buttonClasses } from "../../components/ui/Button";

export function Wishlist() {
  const { items } = useWishlist();

  return (
    <div className="container py-8 sm:py-12">
      <h1 className="font-display text-h1 font-semibold text-foreground">Wishlist</h1>
      <p className="mt-1 text-small text-muted-foreground">
        {items.length > 0 ? `${items.length} saved ${items.length === 1 ? "item" : "items"}` : "Pieces you save will appear here."}
      </p>

      <div className="mt-8">
        {items.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            description="Tap the heart on any product to save it here for later."
            action={
              <Link to="/shop" className={buttonClasses("primary", "md")}>
                Explore the Collection
              </Link>
            }
          />
        ) : (
          <ProductGrid products={items} />
        )}
      </div>
    </div>
  );
}
