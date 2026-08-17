import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import { cn } from "../../utils/cn";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon = Inbox, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3 rounded-md border border-dashed border-border px-6 py-16 text-center", className)}>
      <Icon className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
      <div className="space-y-1">
        <p className="text-h3 font-display font-semibold text-foreground">{title}</p>
        {description && <p className="mx-auto max-w-sm text-small text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}
