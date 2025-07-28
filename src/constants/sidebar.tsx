import {
  Award,
  Book,
  Clock,
  FileCheck,
  FileQuestion,
  FileText,
  Gift,
  Home,
  Star,
} from "lucide-react";
import React from "react";

export interface SidebarMenuItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
}

export const SIDEBAR_MENU_ITEMS: SidebarMenuItem[] = [
  {
    id: "home",
    label: "Home",
    path: "/dashboard",
    icon: <Home size={20} />,
  },
  {
    id: "history",
    label: "History",
    path: "/history",
    icon: <Clock size={20} />,
  },
  {
    id: "books",
    label: "Books",
    path: "/books",
    icon: <Book size={20} />,
  },
  {
    id: "test-series",
    label: "Test Series",
    path: "/test-series",
    icon: <FileCheck size={20} />,
  },
  {
    id: "previous-year",
    label: "Previous Year Paper",
    path: "/previous-year",
    icon: <FileQuestion size={20} />,
  },
  {
    id: "attempted-test",
    label: "Attempted Test",
    path: "/attempted-test",
    icon: <FileText size={20} />,
  },
  {
    id: "premium",
    label: "Premium",
    path: "/premium",
    icon: <Star size={20} />,
  },
  {
    id: "exams",
    label: "Exams",
    path: "/exams",
    icon: <Award size={20} />,
  },
  {
    id: "refer-earn",
    label: "Refer and Earn",
    path: "/refer-earn",
    icon: <Gift size={20} />,
  },
];

export const SIDEBAR_USER_INFO = {
  plan: "Free Plan",
  email: "learner@aipadhai.com",
};

export const SIDEBAR_BREAKPOINTS = {
  MOBILE: 768,
} as const;
