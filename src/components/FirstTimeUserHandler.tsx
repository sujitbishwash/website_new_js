import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/routes/constants';
import { shouldShowSplash } from '@/lib/utils';

interface FirstTimeUserHandlerProps {
  children: React.ReactNode;
}

const FirstTimeUserHandler: React.FC<FirstTimeUserHandlerProps> = ({ children }) => {
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
      navigate(ROUTES.SPLASH);
    }
  }, [location.pathname, navigate]);

  return <>{children}</>;
};

export default FirstTimeUserHandler;
