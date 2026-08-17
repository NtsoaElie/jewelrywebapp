import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

export function ProtectedRoute({
  isAuthenticated,
  redirectTo,
  children,
}: {
  isAuthenticated: boolean;
  redirectTo: string;
  children: ReactNode;
}) {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
