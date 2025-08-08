import AuthCallbackPage from "@/pages/new/AuthCallbackPage";
import BookPage from "@/pages/new/BookPage";
import ComingSoonPage from "@/pages/new/ComingSoonPage";
import ExamGoalPage from "@/pages/new/ExamGoalPage";
import LoginPage from "@/pages/new/LoginPage";
import VideoPage from "@/pages/new/VideoPage";
import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import Chat from "../components/to-be-deleted/Chat";
import Flashcards from "../components/to-be-deleted/Flashcards";
import DetailedAnalysisPage from "../pages/new/DetailedAnalysisPage";
import ExamInformationPage from "../pages/new/ExamInformationPage";
import ExamReconfirmationPage from "../pages/new/ExamReconfirmationPage";
import HistoryPage from "../pages/new/HistoryPage";
import HomePage from "../pages/new/HomePage";
import NotFoundPage from "../pages/new/NotFoundPage";
import ReferralPage from "../pages/new/ReferralPage";
import SubscriptionPage from "../pages/new/SubscriptionPage";
import TestConfigurationPage from "../pages/new/TestConfigurationPage";
import TestMainPage from "../pages/new/TestMainPage";
import { ROUTES } from "./constants";

// Route configuration object for easy maintenance
export const routes = [
  {
    path: ROUTES.HOME,
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
        name: "Home",
        description: "Main dashboard page",
      },
      {
        path: "home",
        element: <HomePage />,
        name: "Home",
        description: "Main dashboard page",
      },
      {
        path: "test-series",
        element: <TestConfigurationPage />,
        name: "Test Configuration",
        description: "Configure test settings",
      },
      {
        path: "exam-info",
        element: <ExamInformationPage />,
        name: "Exam Information",
        description: "View exam details and instructions",
      },
      {
        path: "exam-reconfirm",
        element: <ExamReconfirmationPage />,
        name: "Exam Reconfirmation",
        description: "Confirm exam details before starting",
      },
      {
        path: "test-main-page",
        element: <TestMainPage />,
        name: "Test Main Page",
        description: "Main test taking interface",
      },
      {
        path: "analysis",
        element: <DetailedAnalysisPage />,
        name: "Detailed Analysis",
        description: "View detailed test analysis and results",
      },
      {
        path: "history",
        element: <HistoryPage />,
        name: "Learning History",
        description: "View learning history and progress",
      },
      {
        path: "refer-and-earn",
        element: <ReferralPage />,
        name: "Referral",
        description: "Referral program page",
      },
      {
        path: "premium",
        element: <SubscriptionPage />,
        name: "Subscription",
        description: "Subscription management page",
      },
      {
        path: "chat",
        element: <Chat />,
        name: "Chat",
        description: "Chat interface",
      },
      {
        path: "flashcards",
        element: <Flashcards />,
        name: "Flashcards",
        description: "Flashcard learning interface",
      },
      {
        path: "books",
        element: <BookPage />,
        name: "Books",
        description: "Book Page",
      },
      {
        path: "video-learning/:videoId",
        element: <VideoPage />,
        name: "Video Learning",
        description: "Video Learning Page",
      },
      // Coming Soon Routes - Pages not yet implemented
      {
        path: "previous-year-papers",
        element: <ComingSoonPage />,
        name: "Previous Year Papers",
        description: "Previous year question papers",
      },
      {
        path: "attempted-tests",
        element: <ComingSoonPage />,
        name: "Attempted Tests",
        description: "Attempted Tests",
      },
      {
        path: "exams",
        element: <ComingSoonPage />,
        name: "Exams Page",
        description: "Exams Page",
      },
    ],
  },
  {
    path: "login",
    element: <LoginPage />,
    name: "Login",
    description: "User authentication page",
  },
  {
    path: "auth/callback",
    element: <AuthCallbackPage />,
    name: "Auth Callback",
    description: "OAuth callback handler",
  },
  {
    path: "exam-goal",
    element: <ExamGoalPage />,
    name: "Exam Goal",
    description: "Select Exam Goal",
  },
  // Catch-all route for 404 - must be last
  {
    path: "*",
    element: <NotFoundPage />,
    name: "Not Found",
    description: "Page not found",
  },
];

// Create router instance
export const router = createBrowserRouter(routes);

// Helper function to get route by path
export const getRouteByPath = (path: string) => {
  const mainRoute = routes[0]; // Get the main route with children
  return mainRoute.children?.find(
    (route) => route.path === path || (route.index && path === "/")
  );
};

// Helper function to get all route names for navigation
export const getRouteNames = () => {
  const mainRoute = routes[0]; // Get the main route with children
  return (
    mainRoute.children?.map((route) => ({
      path: route.index ? "/" : `/${route.path}`,
      name: route.name,
    })) || []
  );
};

// Helper function to check if route exists
export const routeExists = (path: string) => {
  const mainRoute = routes[0]; // Get the main route with children
  return (
    mainRoute.children?.some(
      (route) => route.path === path || (route.index && path === "/")
    ) || false
  );
};
