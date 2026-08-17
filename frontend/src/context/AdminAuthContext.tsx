import { createContext, useContext, useState, type ReactNode } from "react";
import type { AuthUser } from "../api/types";
import { mockAdminLogin } from "../api/mock/auth";
import { loadStore, saveStore } from "../api/mock/store";

const STORE_KEY = "aurelle:admin-session";

interface AdminAuthContextValue {
  admin: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AuthUser | null>(() => loadStore<AuthUser | null>(STORE_KEY, null));

  const persist = (next: AuthUser | null) => {
    setAdmin(next);
    saveStore(STORE_KEY, next);
  };

  const login = async (email: string, password: string) => {
    const authedAdmin = await mockAdminLogin(email, password);
    persist(authedAdmin);
  };

  const logout = () => persist(null);

  const value: AdminAuthContextValue = { admin, isAuthenticated: admin !== null, login, logout };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  return ctx;
}
