import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { clearTestConfigOnLeave } from '../lib/testConfigStorage';
import { ROUTES } from '../routes/constants';

// Test flow pages where testConfig should be preserved
const TEST_FLOW_PAGES = [
  ROUTES.TEST_SERIES,
  ROUTES.EXAM_INFO,
  ROUTES.EXAM_RECONFIRM,
];

/**
 * Hook to automatically clean up testConfig when user leaves test flow pages
 * This ensures testConfig is cleared when navigating to non-test pages
 */
export const useTestConfigCleanup = () => {
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    
    // Check if current page is not in test flow
    const isInTestFlow = TEST_FLOW_PAGES.some(route => 
      currentPath.includes(route.replace('/', ''))
    );
    
    // If not in test flow, clear testConfig
    if (!isInTestFlow) {
      clearTestConfigOnLeave();
    }
  }, [location.pathname]);
};

export default useTestConfigCleanup;
