import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RoleRedirect = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  return user.role === "admin"
    ? <Navigate to="/admin/dashboard" replace />
    : <Navigate to="/owner/dashboard" replace />;
};

export default RoleRedirect;