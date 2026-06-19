import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import LoadingScreen from "@/components/LoadingScreen";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen message="Verifying access" />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (requireAdmin && !user.is_admin) return <Navigate to="/login" replace />;
  return children;
}
