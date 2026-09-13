import { useRef } from "react";
import { createPortal } from "react-dom";
import { X, Gem } from "lucide-react";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { AdminNavList } from "./AdminSidebar";

export function AdminMobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(open, onClose, panelRef);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[90] flex lg:hidden">
      <div className="fixed inset-0 animate-fade-in bg-primary-dark/40" aria-hidden="true" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Admin menu"
        tabIndex={-1}
        className="relative flex h-full w-full max-w-xs animate-slide-in-left flex-col bg-primary-dark py-2 shadow-overlay"
      >
        <div className="flex h-16 items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <Gem className="h-5 w-5 text-accent" aria-hidden="true" />
            <span className="font-display text-h3 font-semibold text-primary-foreground">KBC Gold Admin</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded p-1 text-primary-foreground/70 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <AdminNavList onNavigate={onClose} />
      </div>
    </div>,
    document.body,
  );
}
