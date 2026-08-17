import { Link } from "react-router-dom";
import { X } from "lucide-react";
import type { CartLine } from "../../context/CartContext";
import { QuantitySelector } from "../ui/QuantitySelector";
import { formatPrice } from "../../utils/format";

export function CartLineItem({
  line,
  onUpdateQuantity,
  onRemove,
}: {
  line: CartLine;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex gap-4 py-4">
      <Link to={`/shop/${line.product.slug}`} className="h-20 w-20 shrink-0 overflow-hidden rounded bg-muted">
        <img src={line.product.images[0]} alt="" className="h-full w-full object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link to={`/shop/${line.product.slug}`} className="line-clamp-1 text-small font-medium text-foreground hover:text-primary">
              {line.product.name}
            </Link>
            {line.variantLabel && <p className="text-caption text-muted-foreground">{line.variantLabel}</p>}
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${line.product.name} from cart`}
            className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-error"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <QuantitySelector value={line.quantity} onChange={onUpdateQuantity} className="h-9" />
          <span className="text-small font-semibold text-foreground">{formatPrice(line.lineTotal)}</span>
        </div>
      </div>
    </div>
  );
}
