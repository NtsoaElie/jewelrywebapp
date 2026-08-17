import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartItem, Product } from "../api/types";
import { products } from "../data/products";
import { loadStore, saveStore } from "../api/mock/store";
import { useToast } from "./ToastContext";

const STORE_KEY = "aurelle:cart";

export interface CartLine extends CartItem {
  product: Product;
  variantLabel?: string;
  unitPrice: number;
  lineTotal: number;
}

interface CartContextValue {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, quantity?: number, variantId?: string) => void;
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function sameLine(a: CartItem, productId: string, variantId?: string) {
  return a.productId === productId && a.variantId === variantId;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadStore(STORE_KEY, []));
  const [isOpen, setIsOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    saveStore(STORE_KEY, items);
  }, [items]);

  const addItem: CartContextValue["addItem"] = (product, quantity = 1, variantId) => {
    setItems((prev) => {
      const existing = prev.find((i) => sameLine(i, product.id, variantId));
      if (existing) {
        return prev.map((i) => (sameLine(i, product.id, variantId) ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [...prev, { productId: product.id, variantId, quantity }];
    });
    showToast("Added to cart", { description: product.name, variant: "success" });
    setIsOpen(true);
  };

  const updateQuantity: CartContextValue["updateQuantity"] = (productId, variantId, quantity) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => !sameLine(i, productId, variantId))
        : prev.map((i) => (sameLine(i, productId, variantId) ? { ...i, quantity } : i)),
    );
  };

  const removeItem: CartContextValue["removeItem"] = (productId, variantId) => {
    setItems((prev) => prev.filter((i) => !sameLine(i, productId, variantId)));
    showToast("Removed from cart", { variant: "info" });
  };

  const clearCart = () => setItems([]);

  const lines = useMemo<CartLine[]>(() => {
    const result: CartLine[] = [];
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) continue;
      const variant = product.variants.find((v) => v.id === item.variantId);
      const unitPrice = product.price + (variant?.priceDelta ?? 0);
      result.push({
        ...item,
        product,
        variantLabel: variant?.label,
        unitPrice,
        lineTotal: unitPrice * item.quantity,
      });
    }
    return result;
  }, [items]);

  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);

  const value: CartContextValue = {
    lines,
    itemCount,
    subtotal,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
