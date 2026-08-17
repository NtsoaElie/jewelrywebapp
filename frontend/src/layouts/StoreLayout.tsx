import { Outlet } from "react-router-dom";
import { Navbar } from "../components/store/Navbar";
import { Footer } from "../components/store/Footer";
import { CartDrawer } from "../components/store/CartDrawer";

export function StoreLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
