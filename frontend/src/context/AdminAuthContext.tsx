import { createContext, useContext, useState, type ReactNode } from "react";
import type { AuthUser } from "../api/types";
import { supabase } from "../supabaseClient";
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
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error("Incorrect email or password. Please try again.");

    const role = data.user.app_metadata.role;
    if (role !== "admin") {
      await supabase.auth.signOut();
      throw new Error("This account does not have admin access.");
    }

    const authedAdmin: AuthUser = {
      id: data.user.id,
      name: data.user.email!.split("@")[0],
      email: data.user.email!,
    };
    persist(authedAdmin);
  };

  const logout = () => {
    supabase.auth.signOut();
    persist(null);
  };

  const value: AdminAuthContextValue = { admin, isAuthenticated: admin !== null, login, logout };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  return ctx;
}
