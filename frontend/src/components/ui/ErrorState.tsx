import { AlertCircle, RotateCw } from "lucide-react";
import { Button } from "./Button";
import { cn } from "../../utils/cn";

export interface ErrorStateProps {
  title?: string;
  description: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ title = "Something went wrong", description, onRetry, className }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn("flex flex-col items-center gap-3 rounded-md border border-error/20 bg-error/5 px-6 py-16 text-center", className)}
    >
      <AlertCircle className="h-10 w-10 text-error" aria-hidden="true" />
      <div className="space-y-1">
        <p className="text-h3 font-display font-semibold text-foreground">{title}</p>
        <p className="mx-auto max-w-sm text-small text-muted-foreground">{description}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RotateCw className="h-4 w-4" aria-hidden="true" />
          Try again
        </Button>
      )}
    </div>
  );
}
