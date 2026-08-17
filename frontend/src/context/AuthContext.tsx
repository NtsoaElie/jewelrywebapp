import { createContext, useContext, useState, type ReactNode } from "react";
import type { AuthUser } from "../api/types";
import { mockLogin, mockRegister } from "../api/mock/auth";
import { loadStore, saveStore } from "../api/mock/store";

const STORE_KEY = "aurelle:customer-session";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => loadStore<AuthUser | null>(STORE_KEY, null));

  const persist = (next: AuthUser | null) => {
    setUser(next);
    saveStore(STORE_KEY, next);
  };

  const login = async (email: string, password: string) => {
    const authedUser = await mockLogin(email, password);
    persist(authedUser);
  };

  const register = async (name: string, email: string, password: string) => {
    const authedUser = await mockRegister(name, email, password);
    persist(authedUser);
  };

  const logout = () => persist(null);

  const value: AuthContextValue = { user, isAuthenticated: user !== null, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
