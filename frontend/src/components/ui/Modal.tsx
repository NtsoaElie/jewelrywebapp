import { useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";
import { useFocusTrap } from "../../hooks/useFocusTrap";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  size?: "sm" | "md" | "lg";
}

export function Modal({ open, onClose, title, description, children, size = "md" }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(open, onClose, dialogRef);

  if (!open) return null;

  const sizeClass = size === "sm" ? "max-w-sm" : size === "lg" ? "max-w-2xl" : "max-w-md";

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-4">
      <div className="fixed inset-0 animate-fade-in bg-primary-dark/40" aria-hidden="true" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={description ? "modal-description" : undefined}
        tabIndex={-1}
        className={cn(
          "relative w-full animate-slide-up rounded-t-lg border border-border bg-surface p-6 shadow-overlay sm:rounded-lg",
          sizeClass,
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
        <h2 id="modal-title" className="pr-8 text-h3 font-display font-semibold text-foreground">
          {title}
        </h2>
        {description && (
          <p id="modal-description" className="mt-1.5 text-small text-muted-foreground">
            {description}
          </p>
        )}
        {children && <div className="mt-5">{children}</div>}
      </div>
    </div>,
    document.body,
  );
}
