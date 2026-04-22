// components/auth/RequireAuth.tsx
import type { ReactNode } from "react";
import FullScreenLoader from "../../UI/loader/FullScreenLoader";
import { useAuth } from "../../../context/auth/AuthContext";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { loading } = useAuth();

  if (loading) return <FullScreenLoader />; // or global spinner
  return children;
}
