import { useRef } from "react";
import { createPortal } from "react-dom";
import { NavLink, Link } from "react-router-dom";
import { X, User, Heart } from "lucide-react";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/cn";

export function MobileNav({
  open,
  onClose,
  links,
}: {
  open: boolean;
  onClose: () => void;
  links: { label: string; to: string }[];
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(open, onClose, panelRef);
  const { isAuthenticated } = useAuth();

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[90] flex lg:hidden">
      <div className="fixed inset-0 animate-fade-in bg-primary-dark/40" aria-hidden="true" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        tabIndex={-1}
        className="relative flex h-full w-full max-w-xs animate-slide-in-left flex-col bg-surface shadow-overlay"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <span className="font-display text-h3 font-semibold text-primary">Menu</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Primary" className="flex-1 overflow-y-auto px-5 py-4">
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.label}>
                <NavLink
                  to={link.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      "block rounded px-2 py-3 text-body font-medium text-foreground transition-colors hover:bg-muted",
                      isActive && "text-primary",
                    )
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-border px-5 py-4">
          <Link
            to={isAuthenticated ? "/account" : "/login"}
            onClick={onClose}
            className="flex items-center gap-3 rounded px-2 py-3 text-body font-medium text-foreground transition-colors hover:bg-muted"
          >
            <User className="h-5 w-5" aria-hidden="true" />
            {isAuthenticated ? "Your Account" : "Sign In"}
          </Link>
          <Link
            to="/wishlist"
            onClick={onClose}
            className="flex items-center gap-3 rounded px-2 py-3 text-body font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Heart className="h-5 w-5" aria-hidden="true" />
            Wishlist
          </Link>
        </div>
      </div>
    </div>,
    document.body,
  );
}
