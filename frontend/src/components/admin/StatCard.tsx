import type { LucideIcon } from "lucide-react";
import { cn } from "../../utils/cn";

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "primary",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  tone?: "primary" | "accent" | "warning";
}) {
  const toneClass = tone === "accent" ? "bg-accent-muted text-accent-foreground" : tone === "warning" ? "bg-warning/10 text-warning" : "bg-primary/10 text-primary";

  return (
    <div className="min-w-0 rounded-md border border-border bg-surface p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-label font-medium text-muted-foreground">{label}</p>
        <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", toneClass)}>
          <Icon className="h-4.5 w-4.5" aria-hidden="true" />
        </span>
      </div>
      <p title={value} className="mt-3 truncate font-display text-h2 font-semibold text-foreground">
        {value}
      </p>
      {hint && <p className="mt-1 text-caption text-muted-foreground">{hint}</p>}
    </div>
  );
}
