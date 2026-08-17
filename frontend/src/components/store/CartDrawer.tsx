import { useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { ShoppingBag, X } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { CartLineItem } from "./CartLineItem";
import { buttonClasses } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { PriceDisplay } from "../ui/PriceDisplay";

export function CartDrawer() {
  const { isOpen, closeCart, lines, subtotal, updateQuantity, removeItem } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(isOpen, closeCart, panelRef);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[90] flex justify-end">
      <div className="fixed inset-0 animate-fade-in bg-primary-dark/40" aria-hidden="true" onClick={closeCart} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        tabIndex={-1}
        className="relative flex h-full w-full max-w-sm animate-slide-in-right flex-col bg-surface shadow-overlay"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 id="cart-drawer-title" className="font-display text-h3 font-semibold text-foreground">
            Your Bag {lines.length > 0 && `(${lines.length})`}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          {lines.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="Your bag is empty"
              description="Explore the collection and add a piece you love."
              className="mt-8 border-none"
              action={
                <Link to="/shop" onClick={closeCart} className={buttonClasses("primary", "md")}>
                  Continue Shopping
                </Link>
              }
            />
          ) : (
            <div className="divide-y divide-border">
              {lines.map((line) => (
                <CartLineItem
                  key={`${line.productId}-${line.variantId ?? "base"}`}
                  line={line}
                  onUpdateQuantity={(q) => updateQuantity(line.productId, line.variantId, q)}
                  onRemove={() => removeItem(line.productId, line.variantId)}
                />
              ))}
            </div>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-border px-5 py-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-body font-medium text-foreground">Subtotal</span>
              <PriceDisplay price={subtotal} size="sm" />
            </div>
            <Link to="/checkout" onClick={closeCart} className={buttonClasses("primary", "lg", "w-full")}>
              Checkout
            </Link>
            <p className="mt-2 text-center text-caption text-muted-foreground">Shipping and taxes calculated at checkout.</p>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
