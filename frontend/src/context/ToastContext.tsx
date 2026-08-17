import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { ToastViewport, type ToastData, type ToastVariant } from "../components/ui/Toast";

interface ToastContextValue {
  showToast: (title: string, options?: { description?: string; variant?: ToastVariant }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const AUTO_DISMISS_MS = 4500;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback<ToastContextValue["showToast"]>((title, options) => {
    const id = `toast-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const toast: ToastData = { id, title, description: options?.description, variant: options?.variant ?? "success" };
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
  }, [dismiss]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
