import AttemptedTestsArchive from "@/pages/archive/AttemptedTestsArchive";
import AuthCallbackPage from "@/pages/new/AuthCallbackPage";
import BookPage from "@/pages/new/BookPage";
import ComingSoonPage from "@/pages/new/ComingSoonPage";
import ExamGoalPage from "@/pages/new/ExamGoalPage";
import LoginPage from "@/pages/new/LoginPage";
import PaymentPage from "@/pages/new/PaymentPage";
import PaymentSuccessPage from "@/pages/new/PaymentSuccessPage";
import PersonalDetails from "@/pages/new/PersonalDetails";
import PrivacyPolicy from "@/pages/new/PrivacyPolicy";
import Splash from "@/pages/new/Splash";
import TermsAndConditions from "@/pages/new/TermsAndConditions";
// import VideoPage from "@/pages/new/VideoPage";
import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import OnboardingRoute from "../components/OnboardingRoute";
import RootLayout from "../components/RootLayout";

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
import Stats  from "../pages/new/Stats";
import VideoPage from "@/pages/new/VideoPage";
import TestAnalysis2 from "@/pages/new/TestAnalysisPage";
import AttemptedTests from "@/pages/new/AttemptedTestsPage";
import OutOfSyllabusPage from "@/pages/new/OutOfSyllabusPage";
import TestAnalysisPage from "@/pages/new/TestAnalysisPage";
import TestAnalysisPageArchive from "@/pages/archive/TestAnalysisPageArchive";

// Route configuration object for easy maintenance
export const routes = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // Public splash page - accessible without authentication
      {
        path: ROUTES.SPLASH,
        element: <Splash />,
        name: "Welcome",
        description: "Welcome and onboarding page",
      },
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
            path: "test-main-page/:id",
            element: <TestMainPage />,
            name: "Test Main Page",
            description: "Main test taking interface",
          },
          
          {
            path: "test-main-page/:id/solutions",
            element: <TestMainPage />,
            name: "Test Main Page",
            description: "Main test taking interface",
          },
          {
            path: "analysis_archive",
            element: <TestAnalysisPageArchive />,
            name: "Detailed Analysis Archive",
            description: "View detailed test analysis and results",
          },
          
          {
            path: "analysis",
            element: <TestAnalysisPage />,
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
            element: <ComingSoonPage />,
            name: "Chat",
            description: "Chat interface",
          },
          {
            path: "flashcards",
            element: <ComingSoonPage />,
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
          {
            path: "out-of-syllabus",
            element: <OutOfSyllabusPage />,
            name: "Out of Syllabus",
            description: "Content not part of current syllabus",
          },
          // Coming Soon Routes - Pages not yet implemented
          {
            path: "previous-year-papers",
            element: <ComingSoonPage />,
            name: "Previous Year Papers",
            description: "Previous year question papers",
          },
          {
            path: "attempted-tests_archive",
            element: <AttemptedTestsArchive />,
            name: "Attempted Tests Archive",
            description: "Attempted Tests",
          },
          
          {
            path: "attempted-tests",
            element: <AttemptedTests />,
            name: "Attempted Tests",
            description: "Attempted Tests",
          },
          {
            path: "stats",
            element: <Stats />,
            name: "Stats",
            description: "Stats",
          },
        ],
      },
      // Public onboarding pages (accessible without full authentication)
      {
        path: "personal-details",
        element: (
          <OnboardingRoute requiredStep="personal-details">
            <PersonalDetails />
          </OnboardingRoute>
        ),
        name: "Personal Details",
        description: "User personal details page",
      },
      {
        path: "exam-goal",
        element: (
          <OnboardingRoute requiredStep="exam-goal">
            <ExamGoalPage />
          </OnboardingRoute>
        ),
        name: "Exam Goal",
        description: "Select Exam Goal",
      },
      // Public informational pages
      {
        path: "privacy-policy",
        element: <PrivacyPolicy />,
        name: "Privacy Policy",
        description: "Privacy Policy",
      },
      {
        path: "terms-and-conditions",
        element: <TermsAndConditions />,
        name: "Terms and Conditions",
        description: "Terms and Conditions",
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
        description: "OAuth callback handler with token parameter",
      },
      // Payment pages - accessible without authentication
      {
        path: "payment",
        element: <PaymentPage />,
        name: "Payment",
        description: "Payment processing page",
      },
      {
        path: "payment-success",
        element: <PaymentSuccessPage />,
        name: "Payment Success",
        description: "Payment success confirmation page",
      },
      // Catch-all route for 404 - must be last
      {
        path: "*",
        element: <NotFoundPage />,
        name: "Not Found",
        description: "Page not found",
      },
    ],
  },
];

// Create router instance
export const router = createBrowserRouter(routes);

// Helper function to get route by path
export const getRouteByPath = (path: string) => {
  const mainRoute = routes[0]; // Get the main route with children
  const homeRoute = mainRoute.children?.find(
    (route) => route.path === ROUTES.HOME
  );
  return homeRoute?.children?.find(
    (route) => route.path === path || (route.index && path === "/")
  );
};

// Helper function to get all route names for navigation
export const getRouteNames = () => {
  const mainRoute = routes[0]; // Get the main route with children
  const homeRoute = mainRoute.children?.find(
    (route) => route.path === ROUTES.HOME
  );
  return (
    homeRoute?.children?.map((route) => ({
      path: route.index ? "/" : `/${route.path}`,
      name: route.name,
    })) || []
  );
};

// Helper function to check if route exists
export const routeExists = (path: string) => {
  const mainRoute = routes[0]; // Get the main route with children
  const homeRoute = mainRoute.children?.find(
    (route) => route.path === ROUTES.HOME
  );
  return (
    homeRoute?.children?.some(
      (route) => route.path === path || (route.index && path === "/")
    ) || false
  );
};
