import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import { RouteObject } from "react-router-dom";
import { DEFAULT_REDIRECTS } from "./constants";

// Wrapper for protected routes
export const wrapProtectedRoute = (route: RouteObject): RouteObject => {
  const wrappedRoute: RouteObject = {
    ...route,
    element: route.element ? (
      <ProtectedRoute redirectTo={DEFAULT_REDIRECTS.UNAUTHENTICATED}>
        {route.element}
      </ProtectedRoute>
    ) : undefined,
  };

  if (route.children) {
    wrappedRoute.children = route.children.map(wrapProtectedRoute);
  }

  return wrappedRoute;
};

// Wrapper for public routes
export const wrapPublicRoute = (route: RouteObject): RouteObject => {
  const wrappedRoute: RouteObject = {
    ...route,
    element: route.element ? (
      <PublicRoute redirectTo={DEFAULT_REDIRECTS.AUTHENTICATED}>
        {route.element}
      </PublicRoute>
    ) : undefined,
  };

  if (route.children) {
    wrappedRoute.children = route.children.map(wrapPublicRoute);
  }

  return wrappedRoute;
};

// Wrapper for multiple protected routes
export const wrapProtectedRoutes = (routes: RouteObject[]): RouteObject[] => {
  return routes.map(wrapProtectedRoute);
};

// Wrapper for multiple public routes
export const wrapPublicRoutes = (routes: RouteObject[]): RouteObject[] => {
  return routes.map(wrapPublicRoute);
};
