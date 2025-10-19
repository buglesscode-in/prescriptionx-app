// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "@/context/authContextDefinition";

// You might want a spinner component for the loading state later
const LoadingSpinner = () => (
  <div className="flex h-screen items-center justify-center">
    <p>Loading user session...</p>
  </div>
);

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { currentUser, loading } = useAuth();

  // 1. Show spinner while checking auth status
  if (loading) {
    return <LoadingSpinner />;
  }

  // 2. If user is logged in, render the child component (the desired page)
  if (currentUser) {
    return children;
  }

  // 3. If user is NOT logged in, redirect them to the /login page
  return <Navigate to="/login" replace />;
};
