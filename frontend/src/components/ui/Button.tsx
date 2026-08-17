import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive" | "link";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-dark",
  secondary: "bg-accent text-accent-foreground hover:bg-accent/90",
  outline: "border border-border bg-transparent text-foreground hover:bg-muted",
  ghost: "bg-transparent text-foreground hover:bg-muted",
  destructive: "bg-error text-error-foreground hover:bg-error/90",
  link: "bg-transparent text-primary underline-offset-4 hover:underline p-0 h-auto",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-small gap-1.5",
  md: "h-11 px-5 text-body gap-2",
  lg: "h-12 px-7 text-body gap-2",
  icon: "h-11 w-11 shrink-0",
};

export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) {
  return cn(
    "inline-flex items-center justify-center rounded font-medium transition-colors duration-short",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
    "disabled:pointer-events-none disabled:opacity-50",
    variant !== "link" && SIZE_CLASSES[size],
    VARIANT_CLASSES[variant],
    className,
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading = false, disabled, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={buttonClasses(variant, size, className)}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
