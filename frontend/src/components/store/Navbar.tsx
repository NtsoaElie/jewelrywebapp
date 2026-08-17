import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, Search, Heart, ShoppingBag, User, X } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { categories } from "../../data/categories";
import { SearchBar } from "./SearchBar";
import { MobileNav } from "./MobileNav";
import { cn } from "../../utils/cn";

const NAV_LINKS = [
  { label: "Shop All", to: "/shop" },
  ...categories.map((c) => ({ label: c.name, to: `/shop?category=${c.slug}` })),
  { label: "About", to: "/about" },
];

export function Navbar() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { itemCount, openCart } = useCart();
  const { productIds } = useWishlist();
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4 sm:h-20">
        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open menu"
          className="-ml-2 flex h-11 w-11 items-center justify-center rounded text-foreground transition-colors hover:bg-muted lg:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <Link to="/" className="font-display text-h3 font-semibold tracking-wide text-primary sm:text-h2">
          Aurelle
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "text-small font-medium text-foreground transition-colors hover:text-primary",
                  isActive && "text-primary",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            aria-expanded={searchOpen}
            aria-label={searchOpen ? "Close search" : "Search"}
            className="flex h-11 w-11 items-center justify-center rounded text-foreground transition-colors hover:bg-muted"
          >
            {searchOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Search className="h-5 w-5" aria-hidden="true" />}
          </button>

          <Link
            to={isAuthenticated ? "/account" : "/login"}
            aria-label={isAuthenticated ? "Your account" : "Sign in"}
            className="hidden h-11 w-11 items-center justify-center rounded text-foreground transition-colors hover:bg-muted sm:flex"
          >
            <User className="h-5 w-5" aria-hidden="true" />
          </Link>

          <Link
            to="/wishlist"
            aria-label={`Wishlist${productIds.length > 0 ? `, ${productIds.length} items` : ""}`}
            className="relative hidden h-11 w-11 items-center justify-center rounded text-foreground transition-colors hover:bg-muted sm:flex"
          >
            <Heart className="h-5 w-5" aria-hidden="true" />
            {productIds.length > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
                {productIds.length}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={openCart}
            aria-label={`Open cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}
            className="relative flex h-11 w-11 items-center justify-center rounded text-foreground transition-colors hover:bg-muted"
          >
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            {itemCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-border bg-surface px-4 py-3 sm:px-6">
          <div className="container">
            <SearchBar onSubmit={() => setSearchOpen(false)} className="max-w-xl" />
          </div>
        </div>
      )}

      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} links={NAV_LINKS} />
    </header>
  );
}
