import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { Check } from "lucide-react";
import { cn } from "../../utils/cn";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ label, id, className, ...props }, ref) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <label htmlFor={inputId} className="inline-flex cursor-pointer items-center gap-2.5 select-none">
      <span className="relative inline-flex h-5 w-5 shrink-0 items-center justify-center">
        <input ref={ref} id={inputId} type="checkbox" className="peer absolute inset-0 h-5 w-5 cursor-pointer appearance-none rounded border border-border bg-surface checked:border-primary checked:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" {...props} />
        <Check className={cn("pointer-events-none h-3.5 w-3.5 text-primary-foreground opacity-0 peer-checked:opacity-100", className)} aria-hidden="true" />
      </span>
      <span className="text-body text-foreground">{label}</span>
    </label>
  );
});
Checkbox.displayName = "Checkbox";
