import { Routes, Route } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AdminAuthProvider, useAdminAuth } from "./context/AdminAuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { StoreLayout } from "./layouts/StoreLayout";
import { AdminLayout } from "./layouts/AdminLayout";

import { Home } from "./pages/store/Home";
import { Shop } from "./pages/store/Shop";
import { ProductDetail } from "./pages/store/ProductDetail";
import { Cart } from "./pages/store/Cart";
import { Checkout } from "./pages/store/Checkout";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Account } from "./pages/store/Account";
import { AccountOrders } from "./pages/store/AccountOrders";
import { AccountOrderDetail } from "./pages/store/AccountOrderDetail";
import { Wishlist } from "./pages/store/Wishlist";
import { About } from "./pages/store/About";
import { Contact } from "./pages/store/Contact";
import { NotFound } from "./pages/store/NotFound";

import { AdminLogin } from "./pages/admin/AdminLogin";
import { Dashboard } from "./pages/admin/Dashboard";
import { Products } from "./pages/admin/Products";
import { ProductNew } from "./pages/admin/ProductNew";
import { ProductEdit } from "./pages/admin/ProductEdit";
import { Categories } from "./pages/admin/Categories";
import { Inventory } from "./pages/admin/Inventory";
import { Orders } from "./pages/admin/Orders";
import { OrderDetail } from "./pages/admin/OrderDetail";
import { Customers } from "./pages/admin/Customers";
import { CustomerDetail } from "./pages/admin/CustomerDetail";
import { Settings } from "./pages/admin/Settings";

function RequireCustomerAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return (
    <ProtectedRoute isAuthenticated={isAuthenticated} redirectTo="/login">
      {children}
    </ProtectedRoute>
  );
}

function RequireAdminAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAdminAuth();
  return (
    <ProtectedRoute isAuthenticated={isAuthenticated} redirectTo="/admin/login">
      {children}
    </ProtectedRoute>
  );
}

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <AdminAuthProvider>
          <CartProvider>
            <WishlistProvider>{children}</WishlistProvider>
          </CartProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default function App() {
  return (
    <AppProviders>
      <Routes>
        <Route element={<StoreLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/account" element={<RequireCustomerAuth><Account /></RequireCustomerAuth>} />
          <Route path="/account/orders" element={<RequireCustomerAuth><AccountOrders /></RequireCustomerAuth>} />
          <Route path="/account/orders/:orderId" element={<RequireCustomerAuth><AccountOrderDetail /></RequireCustomerAuth>} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<RequireAdminAuth><AdminLayout /></RequireAdminAuth>}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/new" element={<ProductNew />} />
          <Route path="products/:productId/edit" element={<ProductEdit />} />
          <Route path="categories" element={<Categories />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:orderId" element={<OrderDetail />} />
          <Route path="customers" element={<Customers />} />
          <Route path="customers/:customerId" element={<CustomerDetail />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound homeHref="/admin" homeLabel="Back to Dashboard" />} />
        </Route>
      </Routes>
    </AppProviders>
  );
}
