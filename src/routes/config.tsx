import { createBrowserRouter, Navigate } from "react-router-dom";
import { DEFAULT_REDIRECTS } from "./constants";
import { protectedRoutes, publicRoutes } from "./index";
import { wrapProtectedRoutes, wrapPublicRoutes } from "./routeWrappers";

// Create the complete router configuration
export const createAppRouter = () => {
  return createBrowserRouter([
    // Root redirect
    {
      path: "/",
      element: <Navigate to={DEFAULT_REDIRECTS.UNAUTHENTICATED} replace />,
    },
    // Public routes (wrapped with PublicRoute)
    ...wrapPublicRoutes(publicRoutes),
    // Protected routes (wrapped with ProtectedRoute)
    ...wrapProtectedRoutes(protectedRoutes),
  ]);
};
