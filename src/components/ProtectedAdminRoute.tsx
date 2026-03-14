import { Navigate } from "react-router-dom";

export function ProtectedAdminRoute({ children }: any) {

  const isAdminLoggedIn = localStorage.getItem("admin_logged_in");

  if (isAdminLoggedIn !== "true") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;

} 