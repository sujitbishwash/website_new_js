import Chat from "@/components/Chat";
import Flashcards from "@/components/Flashcards";
import History from "@/components/History";
import Quizzes from "@/components/Quizzes";
import ComingSoon from "@/pages/ComingSoon";
import DashboardPage from "@/pages/DashboardPage";
import ExamGoalPage from "@/pages/ExamGoalPage";
import ExamInstructions from "@/pages/ExamInstructions";
import ExamInstructionsSecond from "@/pages/ExamInstructionsSecond";
import LinkInputPage from "@/pages/LinkInputPage";
import LoginPage from "@/pages/LoginPage";
import Quiz from "@/pages/Quiz";
import TestSeries from "@/pages/TestSeries";
import Parent from "@/pages/parent/ParentRoot";
import { RouteObject } from "react-router-dom";
import { ROUTES } from "./constants";

// Public routes (accessible without authentication)
export const publicRoutes: RouteObject[] = [
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.NOT_FOUND,
    element: <ComingSoon />,
  },
];

// Protected routes (require authentication)
export const protectedRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Parent />,
    children: [
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "exam-goal",
        element: <ExamGoalPage />,
      },
      {
        path: "link-input",
        element: <LinkInputPage />,
      },
    ],
  },
  {
    path: ROUTES.TEST_SERIES,
    element: <TestSeries />,
  },
  {
    path: ROUTES.EXAM_INSTRUCTIONS,
    element: <ExamInstructions />,
  },
  {
    path: ROUTES.EXAM_INSTRUCTIONS_SECOND,
    element: <ExamInstructionsSecond />,
  },
  {
    path: ROUTES.QUIZ,
    element: <Quiz />,
  },
  {
    path: ROUTES.HISTORY,
    element: <History />,
  },
  {
    path: ROUTES.CHAT,
    element: <Chat />,
  },
  {
    path: ROUTES.FLASHCARDS,
    element: <Flashcards />,
  },
  {
    path: ROUTES.QUIZZES,
    element: <Quizzes />,
  },
];

// Export route constants for use in other parts of the app
export { ROUTES } from "./constants";
