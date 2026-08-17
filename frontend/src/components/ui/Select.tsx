import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, id, className, options, placeholder, required, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const hintId = hint ? `${selectId}-hint` : undefined;
    const errorId = error ? `${selectId}-error` : undefined;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-label font-medium text-foreground">
            {label}
            {required && <span className="text-error" aria-hidden="true"> *</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            required={required}
            aria-invalid={!!error || undefined}
            aria-describedby={cn(hintId, errorId) || undefined}
            className={cn(
              "h-11 w-full appearance-none rounded border border-border bg-surface px-3.5 pr-10 text-body text-foreground",
              "transition-colors duration-short focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              error && "border-error",
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        </div>
        {hint && !error && (
          <p id={hintId} className="text-caption text-muted-foreground">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} className="text-caption text-error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);
Select.displayName = "Select";
