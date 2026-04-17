import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RoleProtectedRoute = ({ allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // redirect based on role
    return (
      <Navigate
        to={user.role === "admin" ? "/admin/dashboard" : "/owner/dashboard"}
        replace
      />
    );
  }

  return <Outlet />;
};

export default RoleProtectedRoute;