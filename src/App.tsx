import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "./App.css"; // Keep App.css for any App-specific global styles if needed
import ComingSoon from "./pages/ComingSoon";
import DashboardPage from "./pages/DashboardPage";
import ExamGoalPage from "./pages/ExamGoalPage";
import ExamInstructions from "./pages/ExamInstructions";
import ExamInstructionsSecond from "./pages/ExamInstructionsSecond";
import LinkInputPage from "./pages/LinkInputPage";
import LoginPage from "./pages/LoginPage";
import Quiz from "./pages/Quiz";
import TestSeries from "./pages/TestSeries";
import Parent from "./pages/parent/ParentRoot";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
    // loader: () => fetch("/api/home"), // data fetching
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <Parent />,
    children: [
      { path: "dashboard", element: <DashboardPage /> },
      { path: "exam-goal", element: <ExamGoalPage /> },
      { path: "link-input", element: <LinkInputPage /> },
      // ...add more children here as needed
    ],
  },
  {
    path: "/test-series",
    element: <TestSeries />,
  },
  {
    path: "/exam-instructions",
    element: <ExamInstructions />,
  },
  {
    path: "/exam-instructions-second",
    element: <ExamInstructionsSecond />,
  },
  {
    path: "/quiz",
    element: <Quiz />,
  },
  {
    path: "*",
    element: <ComingSoon />,
  },
]);
const App: React.FC = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
