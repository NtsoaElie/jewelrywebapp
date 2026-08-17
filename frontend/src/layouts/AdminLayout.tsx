import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { AdminMobileNav } from "../components/admin/AdminMobileNav";
import { AdminHeader } from "../components/admin/AdminHeader";

export function AdminLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <AdminMobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
