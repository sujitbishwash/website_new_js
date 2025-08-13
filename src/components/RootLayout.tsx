import React, { useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { ROUTES } from '@/routes/constants';
import { shouldShowSplash } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const RootLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, checkUserState } = useAuth();

  useEffect(() => {
    const handleRootNavigation = async () => {
      // Only handle navigation if we're on the root path
      if (location.pathname !== '/') {
        return;
      }

      // Show loading while checking authentication
      if (isLoading) {
        return;
      }

      // Check if user should see splash screen (first-time users)
      if (shouldShowSplash()) {
        navigate(ROUTES.SPLASH, { replace: true });
        return;
      }

      // If user is authenticated, determine where to send them
      if (isAuthenticated) {
        try {
          const userState = await checkUserState();
          
          switch (userState.nextStep) {
            case 'personal-details':
              navigate(ROUTES.PERSONAL_DETAILS, { replace: true });
              break;
            case 'exam-goal':
              navigate(ROUTES.EXAM_GOAL, { replace: true });
              break;
            case 'dashboard':
              navigate(ROUTES.HOME, { replace: true });
              break;
            default:
              navigate(ROUTES.HOME, { replace: true });
          }
        } catch (error) {
          console.error('Error checking user state:', error);
          // Fallback to home page
          navigate(ROUTES.HOME, { replace: true });
        }
      } else {
        // User is not authenticated, send to login
        navigate(ROUTES.LOGIN, { replace: true });
      }
    };

    handleRootNavigation();
  }, [location.pathname, isAuthenticated, isLoading, navigate, checkUserState]);

  // Show loading spinner while checking authentication
  if (isLoading && location.pathname === '/') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Checking authentication..." />
      </div>
    );
  }

  return <Outlet />;
};

export default RootLayout;
