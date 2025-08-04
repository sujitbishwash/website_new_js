import { ReactElement } from "react";

// Route configuration interface
export interface RouteConfig {
    path: string;
    element: ReactElement;
    name: string;
    description: string;
    protected?: boolean; // Optional: for future authentication
    layout?: string; // Optional: for different layouts
}

// Navigation item interface
export interface NavigationItem {
    path: string;
    name: string;
    icon?: string; // Optional: for sidebar navigation
    children?: NavigationItem[]; // Optional: for nested navigation
}

// Route metadata interface
export interface RouteMetadata {
    title: string;
    description: string;
    keywords?: string[];
    ogImage?: string;
} 