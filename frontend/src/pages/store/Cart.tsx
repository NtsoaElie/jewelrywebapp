import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { CartLineItem } from "../../components/store/CartLineItem";
import { PriceDisplay } from "../../components/ui/PriceDisplay";
import { EmptyState } from "../../components/ui/EmptyState";
import { buttonClasses } from "../../components/ui/Button";
import { formatPrice } from "../../utils/format";

export function Cart() {
  const { lines, subtotal, updateQuantity, removeItem } = useCart();

  if (lines.length === 0) {
    return (
      <div className="container py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your bag is empty"
          description="Looks like you haven't added anything yet. Explore the collection to find your next favorite piece."
          action={
            <Link to="/shop" className={buttonClasses("primary", "md")}>
              Start Shopping
            </Link>
          }
        />
      </div>
    );
  }

  const estimatedShipping = 1500;
  const estimatedTax = Math.round(subtotal * 0.0825);
  const estimatedTotal = subtotal + estimatedShipping + estimatedTax;

  return (
    <div className="container py-8 sm:py-12">
      <h1 className="font-display text-h1 font-semibold text-foreground">Your Bag</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="divide-y divide-border border-y border-border">
          {lines.map((line) => (
            <CartLineItem
              key={`${line.productId}-${line.variantId ?? "base"}`}
              line={line}
              onUpdateQuantity={(q) => updateQuantity(line.productId, line.variantId, q)}
              onRemove={() => removeItem(line.productId, line.variantId)}
            />
          ))}
        </div>

        <div className="h-fit rounded-md border border-border bg-surface p-6">
          <h2 className="text-h3 font-display font-semibold text-foreground">Order Summary</h2>
          <dl className="mt-4 space-y-2.5 text-small">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="text-foreground">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd className="text-foreground">{formatPrice(estimatedShipping)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Estimated Tax</dt>
              <dd className="text-foreground">{formatPrice(estimatedTax)}</dd>
            </div>
          </dl>
          <div className="mt-4 flex justify-between border-t border-border pt-4">
            <span className="text-body font-semibold text-foreground">Total</span>
            <PriceDisplay price={estimatedTotal} size="sm" />
          </div>
          <Link to="/checkout" className={buttonClasses("primary", "lg", "mt-6 w-full")}>
            Proceed to Checkout
          </Link>
          <Link to="/shop" className="mt-3 block text-center text-small text-primary hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
