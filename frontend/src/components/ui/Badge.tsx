import type { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export type BadgeVariant = "neutral" | "primary" | "accent" | "success" | "warning" | "error";

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  neutral: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent-muted text-accent-foreground",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  error: "bg-error/10 text-error",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ variant = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-caption font-medium",
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    />
  );
}
