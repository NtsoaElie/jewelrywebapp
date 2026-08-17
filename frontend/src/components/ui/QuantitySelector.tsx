import { Minus, Plus } from "lucide-react";
import { cn } from "../../utils/cn";

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex h-11 items-center rounded border border-border", className)}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="flex h-full w-10 items-center justify-center text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
      >
        <Minus className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <span className="w-10 text-center text-body font-medium text-foreground" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="flex h-full w-10 items-center justify-center text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
