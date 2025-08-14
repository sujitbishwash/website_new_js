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
      console.log("🔄 RootLayout navigation check:", {
        pathname: location.pathname,
        isLoading,
        isAuthenticated,
        shouldShowSplash: shouldShowSplash(),
      });

      // Only handle navigation if we're on the root path
      if (location.pathname !== "/") {
        console.log("📍 Not on root path, skipping navigation");
        return;
      }

      // Show loading while checking authentication
      if (isLoading) {
        console.log("⏳ Still loading, waiting...");
        return;
      }

      // Check if user should see splash screen (first-time users)
      if (shouldShowSplash()) {
        console.log("🎬 Showing splash screen for first-time user");
        navigate(ROUTES.SPLASH, { replace: true });
        return;
      }

      // If user is authenticated, determine where to send them
      if (isAuthenticated) {
        console.log("✅ User is authenticated, checking user state...");
        try {
          const userState = await checkUserState();
          console.log("👤 User state:", userState);
          console.log("🎯 Next step:", userState.nextStep);

          switch (userState.nextStep) {
            case "personal-details":
              console.log("📝 Navigating to personal details");
              navigate(ROUTES.PERSONAL_DETAILS, { replace: true });
              break;
            case "exam-goal":
              console.log("🎯 Navigating to exam goal");
              navigate(ROUTES.EXAM_GOAL, { replace: true });
              break;
            case "dashboard":
              console.log("🏠 Navigating to dashboard");
              navigate(ROUTES.HOME, { replace: true });
              break;
            default:
              console.log("🏠 Navigating to home (default)");
              navigate(ROUTES.HOME, { replace: true });
          }
        } catch (error) {
          console.error("❌ Error checking user state:", error);
          // Fallback to home page
          navigate(ROUTES.HOME, { replace: true });
        }
      } else {
        // User is not authenticated, send to login
        console.log("🔐 User not authenticated, navigating to login");
        navigate(ROUTES.LOGIN, { replace: true });
      }
    };

    handleRootNavigation();
  }, [location.pathname, isAuthenticated, isLoading, navigate, checkUserState]);

  // Show loading spinner while checking authentication
  if (isLoading && location.pathname === "/") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Checking authentication..." />
      </div>
    );
  }

  return <Outlet />;
};

export default RootLayout;
