import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "../api/types";
import { products } from "../data/products";
import { loadStore, saveStore } from "../api/mock/store";
import { useToast } from "./ToastContext";

const STORE_KEY = "aurelle:wishlist";

interface WishlistContextValue {
  productIds: string[];
  items: Product[];
  isWishlisted: (productId: string) => boolean;
  toggle: (product: Product) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [productIds, setProductIds] = useState<string[]>(() => loadStore(STORE_KEY, []));
  const { showToast } = useToast();

  useEffect(() => {
    saveStore(STORE_KEY, productIds);
  }, [productIds]);

  const toggle = (product: Product) => {
    setProductIds((prev) => {
      const exists = prev.includes(product.id);
      if (exists) {
        showToast("Removed from wishlist", { description: product.name, variant: "info" });
        return prev.filter((id) => id !== product.id);
      }
      showToast("Added to wishlist", { description: product.name, variant: "success" });
      return [...prev, product.id];
    });
  };

  const items = useMemo(() => products.filter((p) => productIds.includes(p.id)), [productIds]);

  const value: WishlistContextValue = {
    productIds,
    items,
    isWishlisted: (productId) => productIds.includes(productId),
    toggle,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
