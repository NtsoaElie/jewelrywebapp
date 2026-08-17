import { useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { wait } from "../../api/mock/delay";
import { Input } from "../../components/ui/Input";
import { Button, buttonClasses } from "../../components/ui/Button";
import { PriceDisplay } from "../../components/ui/PriceDisplay";
import { formatPrice } from "../../utils/format";

interface CheckoutForm {
  email: string;
  fullName: string;
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

const INITIAL_FORM: CheckoutForm = {
  email: "",
  fullName: "",
  line1: "",
  city: "",
  state: "",
  postalCode: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
};

export function Checkout() {
  const { lines, subtotal, clearCart } = useCart();
  const [form, setForm] = useState<CheckoutForm>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const shipping = 1500;
  const tax = Math.round(subtotal * 0.0825);
  const total = subtotal + shipping + tax;

  const update = (field: keyof CheckoutForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await wait(900);
    setOrderNumber(`AUR-${Math.floor(10000 + Math.random() * 89999)}`);
    clearCart();
    setSubmitting(false);
  };

  if (orderNumber) {
    return (
      <div className="container flex flex-col items-center gap-4 py-20 text-center">
        <CheckCircle2 className="h-14 w-14 text-success" aria-hidden="true" />
        <h1 className="font-display text-h1 font-semibold text-foreground">Order Confirmed</h1>
        <p className="max-w-md text-body text-muted-foreground">
          Thank you, {form.fullName || "friend"}. Your order <span className="font-semibold text-foreground">{orderNumber}</span> has
          been placed. A confirmation has been sent to {form.email || "your email"}.
        </p>
        <Link to="/shop" className={buttonClasses("primary", "lg", "mt-2")}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <div className="container py-8 sm:py-12">
      <h1 className="font-display text-h1 font-semibold text-foreground">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <fieldset className="space-y-4">
            <legend className="text-h3 font-display font-semibold text-foreground">Contact</legend>
            <Input label="Email" type="email" required value={form.email} onChange={update("email")} placeholder="you@example.com" />
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="text-h3 font-display font-semibold text-foreground">Shipping Address</legend>
            <Input label="Full Name" required value={form.fullName} onChange={update("fullName")} />
            <Input label="Address" required value={form.line1} onChange={update("line1")} />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Input label="City" required value={form.city} onChange={update("city")} />
              <Input label="State" required value={form.state} onChange={update("state")} />
              <Input label="ZIP Code" required value={form.postalCode} onChange={update("postalCode")} />
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="text-h3 font-display font-semibold text-foreground">Payment</legend>
            <p className="text-caption text-muted-foreground">
              This is a demo checkout — no real payment will be processed.
            </p>
            <Input label="Card Number" required inputMode="numeric" placeholder="4242 4242 4242 4242" value={form.cardNumber} onChange={update("cardNumber")} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Expiry" required placeholder="MM/YY" value={form.expiry} onChange={update("expiry")} />
              <Input label="CVC" required inputMode="numeric" placeholder="123" value={form.cvc} onChange={update("cvc")} />
            </div>
          </fieldset>

          <Button type="submit" size="lg" className="w-full lg:hidden" loading={submitting}>
            {submitting ? "Placing Order…" : `Place Order — ${formatPrice(total)}`}
          </Button>
        </div>

        <div className="h-fit space-y-4 rounded-md border border-border bg-surface p-6">
          <h2 className="text-h3 font-display font-semibold text-foreground">Order Summary</h2>
          <ul className="space-y-3">
            {lines.map((line) => (
              <li key={`${line.productId}-${line.variantId ?? "base"}`} className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded bg-muted">
                  <img src={line.product.images[0]} alt="" className="h-full w-full object-cover" />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                    {line.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-small font-medium text-foreground">{line.product.name}</p>
                  {line.variantLabel && <p className="text-caption text-muted-foreground">{line.variantLabel}</p>}
                </div>
                <span className="text-small text-foreground">{formatPrice(line.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <dl className="space-y-2 border-t border-border pt-4 text-small">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="text-foreground">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd className="text-foreground">{formatPrice(shipping)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Tax</dt>
              <dd className="text-foreground">{formatPrice(tax)}</dd>
            </div>
          </dl>
          <div className="flex justify-between border-t border-border pt-4">
            <span className="text-body font-semibold text-foreground">Total</span>
            <PriceDisplay price={total} size="sm" />
          </div>
          <Button type="submit" size="lg" className="hidden w-full lg:flex" loading={submitting}>
            {submitting ? "Placing Order…" : "Place Order"}
          </Button>
        </div>
      </form>
    </div>
  );
}
