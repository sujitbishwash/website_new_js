import React, { createContext, useContext, useEffect, useState } from 'react';
import posthog from 'posthog-js';

interface PostHogContextType {
  posthog: typeof posthog;
  isLoaded: boolean;
  identify: (userId: string, properties?: Record<string, any>) => void;
  capture: (event: string, properties?: Record<string, any>) => void;
  reset: () => void;
}

const PostHogContext = createContext<PostHogContextType | undefined>(undefined);

interface PostHogProviderProps {
  children: React.ReactNode;
}

export const PostHogProvider: React.FC<PostHogProviderProps> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initialize PostHog
    const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
    const posthogHost = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

    if (posthogKey) {
      posthog.init(posthogKey, {
        api_host: posthogHost,
        person_profiles: 'identified_only',
        capture_pageview: false, // We'll handle pageviews manually
        capture_pageleave: true,
        loaded: () => {
          setIsLoaded(true);
          console.log('PostHog loaded successfully');
        },
      });
    } else {
      console.warn('PostHog key not found. Analytics will be disabled.');
      setIsLoaded(true); // Set to true even if disabled to prevent blocking
    }
  }, []);

  const identify = (userId: string, properties?: Record<string, any>) => {
    if (isLoaded && posthog) {
      posthog.identify(userId, properties);
    }
  };

  const capture = (event: string, properties?: Record<string, any>) => {
    if (isLoaded && posthog) {
      posthog.capture(event, properties);
    }
  };

  const reset = () => {
    if (isLoaded && posthog) {
      posthog.reset();
    }
  };

  const value: PostHogContextType = {
    posthog,
    isLoaded,
    identify,
    capture,
    reset,
  };

  return (
    <PostHogContext.Provider value={value}>
      {children}
    </PostHogContext.Provider>
  );
};

export const usePostHog = (): PostHogContextType => {
  const context = useContext(PostHogContext);
  if (context === undefined) {
    throw new Error('usePostHog must be used within a PostHogProvider');
  }
  return context;
};

export default PostHogContext;
