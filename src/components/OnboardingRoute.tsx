import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ROUTES } from "../routes/constants";
import LoadingSpinner from "./LoadingSpinner";

interface OnboardingRouteProps {
  requiredStep: "personal-details" | "exam-goal";
  children: React.ReactNode;
}

const OnboardingRoute: React.FC<OnboardingRouteProps> = ({
  requiredStep,
  children,
}) => {
  const { checkUserState, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();
  const [validating, setValidating] = React.useState(true);
  const [nextStep, setNextStep] = React.useState<
    "personal-details" | "exam-goal" | "dashboard" | null
  >(null);

  React.useEffect(() => {
    let isMounted = true;
    const validate = async () => {
      if (!isAuthenticated) {
        // If not authenticated, let parent guards handle redirect
        setValidating(false);
        return;
      }
      setValidating(true);
      try {
        const state = await checkUserState();
        if (isMounted) {
          setNextStep(state.nextStep);
        }
      } finally {
        if (isMounted) setValidating(false);
      }
    };
    validate();
    return () => {
      isMounted = false;
    };
  }, [checkUserState, isAuthenticated, location.pathname]);

  if (isLoading || validating) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Preparing your experience..." />
      </div>
    );
  }

  // If user's next step is not this page, redirect accordingly without rendering children
  if (nextStep && nextStep !== requiredStep) {
    if (nextStep === "dashboard") {
      return <Navigate to={ROUTES.DASHBOARD} replace />;
    }
    if (nextStep === "exam-goal") {
      return <Navigate to={ROUTES.EXAM_GOAL} replace />;
    }
    // default to personal details
    return <Navigate to={ROUTES.PERSONAL_DETAILS} replace />;
  }

  return <>{children}</>;
};

export default OnboardingRoute;


