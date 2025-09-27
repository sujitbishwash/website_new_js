import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalytics } from '../hooks/useAnalytics';
import { ROUTES } from '../routes/constants';

const PageTracker: React.FC = () => {
  const location = useLocation();
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    // Map route paths to readable page names
    const getPageName = (pathname: string): string => {
      switch (pathname) {
        case ROUTES.HOME:
          return 'Home';
        case ROUTES.LOGIN:
          return 'Login';
        case ROUTES.PERSONAL_DETAILS:
          return 'Personal Details';
        case ROUTES.EXAM_GOAL:
          return 'Exam Goal';
        case ROUTES.EXAM_RECONFIRM:
          return 'Exam Reconfirmation';
        case ROUTES.TEST_MAIN_PAGE:
          return 'Test Main Page';
        case ROUTES.ANALYSIS:
          return 'Test Analysis';
        case ROUTES.VIDEO_LEARNING:
          return 'Video Learning';
        case ROUTES.ATTEMPTED_TESTS:
          return 'Attempted Tests';
        case ROUTES.STATS:
          return 'Stats';
        case ROUTES.OUT_OF_SYLLABUS:
          return 'Out of Syllabus';
        default:
          // Handle dynamic routes
          if (pathname.startsWith('/video/')) {
            return 'Video Learning';
          }
          if (pathname.startsWith('/test/')) {
            return 'Test';
          }
          return pathname.replace('/', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
    };

    const pageName = getPageName(location.pathname);
    
    trackPageView(pageName, {
      path: location.pathname,
      search: location.search,
      hash: location.hash,
    });
  }, [location, trackPageView]);

  return null; // This component doesn't render anything
};

export default PageTracker;
