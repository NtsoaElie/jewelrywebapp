import { Menu, LogOut } from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { initials } from "../../utils/format";

export function AdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const { admin, logout } = useAdminAuth();

  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-border bg-surface px-4 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open admin menu"
        className="-ml-2 flex h-11 w-11 items-center justify-center rounded text-foreground transition-colors hover:bg-muted lg:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <div className="flex flex-1 items-center justify-end gap-3">
        <div className="hidden items-center gap-2.5 sm:flex">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-caption font-semibold text-primary-foreground">
            {admin ? initials(admin.name) : "A"}
          </span>
          <span className="text-small font-medium text-foreground">{admin?.name}</span>
        </div>
        <button
          type="button"
          onClick={logout}
          aria-label="Sign out"
          className="flex h-11 w-11 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
