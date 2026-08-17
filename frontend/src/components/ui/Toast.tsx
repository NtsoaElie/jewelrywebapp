import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "../../utils/cn";

export type ToastVariant = "success" | "error" | "info";

export interface ToastData {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

const VARIANT_STYLES: Record<ToastVariant, { icon: typeof CheckCircle2; iconClass: string }> = {
  success: { icon: CheckCircle2, iconClass: "text-success" },
  error: { icon: AlertCircle, iconClass: "text-error" },
  info: { icon: Info, iconClass: "text-primary" },
};

export function Toast({ toast, onDismiss }: { toast: ToastData; onDismiss: (id: string) => void }) {
  const { icon: Icon, iconClass } = VARIANT_STYLES[toast.variant];

  return (
    <div
      role={toast.variant === "error" ? "alert" : "status"}
      className="animate-slide-up pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-md border border-border bg-surface p-4 shadow-overlay"
    >
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", iconClass)} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-small font-medium text-foreground">{toast.title}</p>
        {toast.description && <p className="mt-0.5 text-small text-muted-foreground">{toast.description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export function ToastViewport({ toasts, onDismiss }: { toasts: ToastData[]; onDismiss: (id: string) => void }) {
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-0 sm:items-end"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
