import LoginPage from "@/pages/new/LoginPage";
import ExamGoalPage from "@/pages/obsolete/ExamGoalPage";
import { createBrowserRouter } from "react-router-dom";
import Chat from "../components/Chat";
import Flashcards from "../components/Flashcards";
import Layout from "../components/Layout";
import DetailedAnalysisPage from "../pages/new/DetailedAnalysisPage";
import ExamInformationPage from "../pages/new/ExamInformationPage";
import ExamReconfirmationPage from "../pages/new/ExamReconfirmationPage";
import HistoryPage from "../pages/new/HistoryPage";
import MainDashboardPage from "../pages/new/MainDashboardPage";
import ReferralPage from "../pages/new/ReferralPage";
import SubscriptionPage from "../pages/new/SubscriptionPage";
import TestConfigurationPage from "../pages/new/TestConfigurationPage";
import TestMainPage from "../pages/new/TestMainPage";

// Route configuration object for easy maintenance
export const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <MainDashboardPage />,
        name: "Dashboard",
        description: "Main dashboard page",
      },
      {
        path: "dashboard",
        element: <MainDashboardPage />,
        name: "Dashboard",
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
        path: "exam-goal",
        element: <ExamGoalPage />,
        name: "Exam Goal",
        description: "Select Exam Goal",
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
    ],
  },
  {
    path: "login",
    element: <LoginPage />,
    name: "Login",
    description: "User authentication page",
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
