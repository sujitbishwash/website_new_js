import { RouteObject } from 'react-router-dom';

// Route categories
export type RouteCategory = 'public' | 'protected';

// Route metadata for better organization
export interface RouteMetadata {
    title?: string;
    description?: string;
    requiresAuth: boolean;
    category: RouteCategory;
}

// Extended route object with metadata
export interface AppRouteObject extends Omit<RouteObject, 'children'> {
    meta?: RouteMetadata;
    children?: AppRouteObject[];
}

// Route groups for better organization
export interface RouteGroup {
    name: string;
    routes: AppRouteObject[];
    category: RouteCategory;
}

// Navigation item for sidebar/menu
export interface NavigationItem {
    path: string;
    label: string;
    icon?: React.ComponentType;
    children?: NavigationItem[];
    requiresAuth: boolean;
} 