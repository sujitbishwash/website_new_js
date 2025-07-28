import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  redirectTo = "/login",
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // If authentication is required and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // Redirect to login page, but save the current location
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If user is authenticated but trying to access login page
  if (!requireAuth && isAuthenticated) {
    // Redirect to dashboard or exam-goal
    return <Navigate to="/exam-goal" replace />;
  }

  // User is authenticated and can access the protected route
  return <>{children}</>;
};

export default ProtectedRoute;
