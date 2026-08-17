import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

export function Spinner({ className, label = "Loading" }: { className?: string; label?: string }) {
  return (
    <span role="status" className="inline-flex items-center gap-2 text-muted-foreground">
      <Loader2 className={cn("h-5 w-5 animate-spin", className)} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function PageSpinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Spinner label={label} className="h-7 w-7" />
    </div>
  );
}
