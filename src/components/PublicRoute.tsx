import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectTo = "/exam-goal",
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // If user is authenticated, redirect to the specified route
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // User is not authenticated and can access the public route
  return <>{children}</>;
};

export default PublicRoute;
