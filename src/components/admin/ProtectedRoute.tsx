import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const { user, loading } = useAuth();

  // Show nothing while checking auth (prevents flash of login screen)
  if (loading) {
    return null;
  }

  if (!user) {
    // Redirect to login page, saving the attempted location
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
