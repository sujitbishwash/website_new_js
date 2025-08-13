import React, { useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { ROUTES } from '@/routes/constants';
import { shouldShowSplash } from '@/lib/utils';

const RootLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect to splash if:
    // 1. User is on the root path (/)
    // 2. Should show splash (first-time user who hasn't seen splash)
    // 3. Not already on splash page
    if (
      location.pathname === '/' && 
      shouldShowSplash()
    ) {
      navigate(ROUTES.SPLASH, { replace: true });
    }
  }, [location.pathname, navigate]);

  return <Outlet />;
};

export default RootLayout;
