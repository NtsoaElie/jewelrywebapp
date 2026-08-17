import type { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded bg-muted", className)} aria-hidden="true" {...props} />;
}
