import { useAuth } from "@/contexts/AuthContext";
import { shouldShowSplash } from "@/lib/utils";
import { ROUTES } from "@/routes/constants";
import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const RootLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, checkUserState } = useAuth();

  useEffect(() => {
    const handleRootNavigation = async () => {

      // Only handle navigation if we're on the root path
      if (location.pathname !== "/") {
        return;
      }

      // Show loading while checking authentication
      if (isLoading) {
        return;
      }

      // Check if user should see splash screen (first-time users)
      if (shouldShowSplash() && isAuthenticated) {
        navigate(ROUTES.SPLASH, { replace: true });
        return;
      }

      // If user is authenticated, determine where to send them
      if (isAuthenticated) {
        try {
          const userState = await checkUserState();

          switch (userState.nextStep) {
            case "personal-details":
              {
            console.log("Navigating to personal details in RootLayout");
                navigate(ROUTES.PERSONAL_DETAILS, { replace: true });
              break;}
            case "exam-goal":
              navigate(ROUTES.EXAM_GOAL, { replace: true });
              break;
            case "dashboard":
              navigate(ROUTES.HOME, { replace: true });
              break;
            default:
              navigate(ROUTES.HOME, { replace: true });
          }
        } catch (error) {
          // Fallback to home page
          navigate(ROUTES.HOME, { replace: true });
        }
      } else {
        // User is not authenticated, send to login
        navigate(ROUTES.LANDING, { replace: true });
      }
    };

    handleRootNavigation();
  }, [location.pathname, isAuthenticated, isLoading, navigate, checkUserState]);

  // Show loading spinner while checking authentication
  if (isLoading && location.pathname === "/") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" text="Checking authentication..." />
      </div>
    );
  }

  return <Outlet />;
};

export default RootLayout;
