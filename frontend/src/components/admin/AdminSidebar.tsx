import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, Tags, Boxes, ShoppingCart, Users, Settings, Gem } from "lucide-react";
import { cn } from "../../utils/cn";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Products", to: "/admin/products", icon: Package },
  { label: "Categories", to: "/admin/categories", icon: Tags },
  { label: "Inventory", to: "/admin/inventory", icon: Boxes },
  { label: "Orders", to: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", to: "/admin/customers", icon: Users },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

export function AdminNavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Admin" className="flex flex-1 flex-col gap-1 px-3">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.label}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded px-3 py-2.5 text-small font-medium text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground",
              isActive && "bg-primary-foreground/15 text-primary-foreground",
            )
          }
        >
          <item.icon className="h-4.5 w-4.5" aria-hidden="true" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

export function AdminSidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col bg-primary-dark lg:flex">
      <div className="flex h-16 items-center gap-2 px-5">
        <Gem className="h-5 w-5 text-accent" aria-hidden="true" />
        <span className="font-display text-h3 font-semibold text-primary-foreground">Aurelle Admin</span>
      </div>
      <AdminNavList />
    </aside>
  );
}
