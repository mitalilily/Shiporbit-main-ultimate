// components/auth/RequireOnboard.tsx
import { Navigate } from "react-router-dom";
import FullScreenLoader from "../../UI/loader/FullScreenLoader";
import { useAuth } from "../../../context/auth/AuthContext";

export default function RequireOnboard() {
  const { loading } = useAuth();

  /* 1️⃣  Still loading auth state? show spinner */
  if (loading) return <FullScreenLoader />;
  return <Navigate to="/dashboard" replace />;
}
