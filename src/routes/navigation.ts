import { getRouteByPath, getRouteNames, routeExists } from './index';

// Navigation categories for better organization
export const navigationCategories = {
  main: [
    { path: '/', name: 'Dashboard' },
    { path: '/history', name: 'Learning History' },
  ],
  test: [
    { path: '/test-config', name: 'Test Configuration' },
    { path: '/exam-info', name: 'Exam Information' },
    { path: '/exam-reconfirmation', name: 'Exam Reconfirmation' },
    { path: '/test-main-page', name: 'Test Interface' },
    { path: '/analysis', name: 'Test Analysis' },
  ],
  auth: [
    { path: '/login', name: 'Login' },
  ],
  user: [
    { path: '/referral', name: 'Referral Program' },
    { path: '/subscription', name: 'Subscription' },
  ],
  tools: [
    { path: '/chat', name: 'Chat' },
    { path: '/flashcards', name: 'Flashcards' },
  ]
};

// Get all routes for sidebar navigation
export const getSidebarRoutes = () => {
  return getRouteNames();
};

// Get routes by category
export const getRoutesByCategory = (category: keyof typeof navigationCategories) => {
  return navigationCategories[category] || [];
};

// Check if a route is protected (for future authentication)
export const isProtectedRoute = (path: string): boolean => {
  const protectedRoutes = ['/subscription', '/analysis'];
  return protectedRoutes.includes(path);
};

// Get route metadata for SEO
export const getRouteMetadata = (path: string) => {
  const route = getRouteByPath(path);
  if (!route) return null;

  return {
    title: route.name,
    description: route.description,
    path: path
  };
};

// Navigation helper for programmatic navigation
export const getNavigationHelpers = () => {
  return {
    getAllRoutes: getSidebarRoutes,
    getRoutesByCategory,
    isProtectedRoute,
    getRouteMetadata,
    routeExists
  };
}; 