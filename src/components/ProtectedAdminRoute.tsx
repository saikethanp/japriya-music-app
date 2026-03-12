import { Navigate } from "react-router-dom";

export function ProtectedAdminRoute({ children }: any) {

  const admin = localStorage.getItem("admin_logged_in");

  if (!admin) {
    return <Navigate to="/admin/login" />;
  }

  return children;
}