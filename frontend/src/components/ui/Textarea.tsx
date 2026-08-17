import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, id, className, required, rows = 4, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-label font-medium text-foreground">
            {label}
            {required && <span className="text-error" aria-hidden="true"> *</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          required={required}
          aria-invalid={!!error || undefined}
          aria-describedby={cn(hintId, errorId) || undefined}
          className={cn(
            "w-full resize-y rounded border border-border bg-surface px-3.5 py-2.5 text-body text-foreground placeholder:text-muted-foreground",
            "transition-colors duration-short focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
            error && "border-error",
            className,
          )}
          {...props}
        />
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
Textarea.displayName = "Textarea";
