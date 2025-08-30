import { useState, useEffect, useCallback, useRef } from 'react';
import { feedbackApi, FeedbackStatus, ComponentName } from '@/lib/api-client';

interface UseFeedbackTrackerOptions {
  component: ComponentName;
  sourceId: string;
  pageUrl: string;
  onFeedbackExists?: (existingFeedback: FeedbackStatus['existing_feedback']) => void;
}

interface UseMultiFeedbackTrackerOptions {
  components: ComponentName[];
  sourceId: string;
  pageUrl: string;
  onFeedbackExists?: (component: ComponentName, existingFeedback: FeedbackStatus['existing_feedback']) => void;
}

interface UseFeedbackTrackerReturn {
  canSubmitFeedback: boolean;
  existingFeedback: FeedbackStatus['existing_feedback'] | null;
  isLoading: boolean;
  error: string | null;
  reason: string;
  checkFeedback: () => Promise<void>;
  markAsSubmitted: () => void;
  resetFeedback: () => void;
  _debug?: {
    hasChecked: boolean;
    lastCheckTime: number;
    component: ComponentName;
    sourceId: string;
    pageUrl: string;
  };
}

interface UseMultiFeedbackTrackerReturn {
  feedbackStates: {
    [key in ComponentName]?: {
      canSubmitFeedback: boolean;
      existingFeedback: {
        id: string;
        rating: number;
        description: string;
        date_submitted: string;
        page_url: string;
      } | null;
      reason: string;
    };
  };
  isLoading: boolean;
  error: string | null;
  checkFeedback: () => Promise<void>;
  markAsSubmitted: (component: ComponentName) => void;
  resetFeedback: () => void;
  _debug?: {
    hasChecked: boolean;
    lastCheckTime: number;
    components: ComponentName[];
    sourceId: string;
    pageUrl: string;
  };
}

// Hook for single component (legacy support)
export const useFeedbackTracker = ({
  component,
  sourceId,
  pageUrl,
  onFeedbackExists,
}: UseFeedbackTrackerOptions): UseFeedbackTrackerReturn => {
  const [canSubmitFeedback, setCanSubmitFeedback] = useState(true);
  const [existingFeedback, setExistingFeedback] = useState<FeedbackStatus['existing_feedback'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState<string>("");
  const [hasChecked, setHasChecked] = useState(false); // Prevent multiple API calls
  const [lastCheckTime, setLastCheckTime] = useState(0); // Track last API call time

  // Use refs to avoid dependency issues
  const hasCheckedRef = useRef(false);
  const lastCheckTimeRef = useRef(0);

  // Check for existing feedback when component or sourceId changes
  const checkFeedback = useCallback(async () => {
    if (!component || !sourceId || !pageUrl) return;
    
    // Prevent multiple API calls for the same component/sourceId
    if (hasCheckedRef.current) {
      console.log(`🔄 Skipping feedback check - already checked for ${component}:${sourceId}`);
      return;
    }

    // Debounce: prevent API calls within 2 seconds of each other
    const now = Date.now();
    if (now - lastCheckTimeRef.current < 2000) {
      console.log(`⏱️ Debouncing feedback check for ${component}:${sourceId} - too soon since last call`);
      return;
    }

    console.log(`🔍 Checking feedback for ${component}:${sourceId} at ${pageUrl}`);
    lastCheckTimeRef.current = now;
    setLastCheckTime(now);
    setIsLoading(true);
    setError(null);

    try {
      const response = await feedbackApi.canSubmitFeedback(sourceId, component, pageUrl);
      
      setCanSubmitFeedback(response.can_feedback);
      setExistingFeedback(response.existing_feedback);
      setReason(response.reason);
      hasCheckedRef.current = true;
      setHasChecked(true); // Mark as checked
      
      if (response.existing_feedback) {
        onFeedbackExists?.(response.existing_feedback);
        console.log(`✅ Found existing feedback for ${component}:${sourceId}`, response.existing_feedback);
      } else {
        console.log(`ℹ️ No existing feedback found for ${component}:${sourceId}`);
      }
    } catch (err: any) {
      console.error(`❌ Error checking feedback for ${component}:${sourceId}:`, err);
      setError(err.message || 'Failed to check existing feedback');
      // Don't set canSubmitFeedback to false on error - let user try again
    } finally {
      setIsLoading(false);
    }
  }, [component, sourceId, pageUrl, onFeedbackExists]); // Removed hasChecked and lastCheckTime from dependencies

  // Mark feedback as submitted (called after successful submission)
  const markAsSubmitted = useCallback(() => {
    setCanSubmitFeedback(false); // Prevent duplicate submissions
    // Keep existingFeedback as is - don't override API data
    console.log(`✅ Feedback marked as submitted for ${component}:${sourceId} - preventing duplicates`);
  }, [component, sourceId]);

  // Reset feedback state (useful for testing or admin purposes)
  const resetFeedback = useCallback(() => {
    setCanSubmitFeedback(true);
    setExistingFeedback(null);
    setError(null);
    setReason("");
    hasCheckedRef.current = false;
    lastCheckTimeRef.current = 0;
    setHasChecked(false); // Reset the checked flag
    setLastCheckTime(0);
    console.log(`🔄 Feedback state reset for ${component}:${sourceId}`);
  }, [component, sourceId]);

  // Reset hasChecked when component or sourceId changes
  useEffect(() => {
    hasCheckedRef.current = false;
    lastCheckTimeRef.current = 0;
    setHasChecked(false);
    setLastCheckTime(0);
    console.log(`🔄 Resetting feedback check flag for ${component}:${sourceId}`);
  }, [component, sourceId]);

  // Check for existing feedback on mount and when dependencies change
  useEffect(() => {
    checkFeedback();
  }, [checkFeedback]);

  return {
    canSubmitFeedback,
    existingFeedback,
    isLoading,
    error,
    reason,
    checkFeedback,
    markAsSubmitted,
    resetFeedback,
    // Debug info
    _debug: {
      hasChecked,
      lastCheckTime,
      component,
      sourceId,
      pageUrl
    }
  };
};

// Hook for multiple components (new format)
export const useMultiFeedbackTracker = ({
  components,
  sourceId,
  pageUrl,
  onFeedbackExists,
}: UseMultiFeedbackTrackerOptions): UseMultiFeedbackTrackerReturn => {
  const [feedbackStates, setFeedbackStates] = useState<{
    [key in ComponentName]?: {
      canSubmitFeedback: boolean;
      existingFeedback: {
        id: string;
        rating: number;
        description: string;
        date_submitted: string;
        page_url: string;
      } | null;
      reason: string;
    };
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState(0);

  // Use refs to avoid dependency issues
  const hasCheckedRef = useRef(false);
  const lastCheckTimeRef = useRef(0);

  const checkFeedback = useCallback(async () => {
    if (!components.length || !sourceId || !pageUrl) return;
    
    if (hasCheckedRef.current) {
      console.log(`🔄 Skipping multi-feedback check - already checked for ${components.join(',')}:${sourceId}`);
      return;
    }

    const now = Date.now();
    if (now - lastCheckTimeRef.current < 2000) {
      console.log(`⏱️ Debouncing multi-feedback check for ${components.join(',')}:${sourceId} - too soon since last call`);
      return;
    }

    console.log(`🔍 Checking feedback for multiple components ${components.join(',')}:${sourceId} at ${pageUrl}`);
    lastCheckTimeRef.current = now;
    setLastCheckTime(now);
    setIsLoading(true);
    setError(null);

    try {
      const response = await feedbackApi.canSubmitFeedbackMulti(sourceId, components, pageUrl);

      console.log("🔍 Multi-feedback response:", response);
      
      const newStates: {
        [key in ComponentName]?: {
          canSubmitFeedback: boolean;
          existingFeedback: {
            id: string;
            rating: number;
            description: string;
            date_submitted: string;
            page_url: string;
          } | null;
          reason: string;
        };
      } = {};

      response.components.forEach(componentData => {
        const component = componentData.component;
        if (component) {
          newStates[component] = {
            canSubmitFeedback: componentData.can_feedback,
            existingFeedback: componentData.existing_feedback,
            reason: componentData.reason
          };

          if (componentData.existing_feedback) {
            onFeedbackExists?.(component, componentData.existing_feedback);
            console.log(`✅ Found existing feedback for ${component}:${sourceId}`, componentData.existing_feedback);
          } else {
            console.log(`ℹ️ No existing feedback found for ${component}:${sourceId}`);
          }
        }
      });

      setFeedbackStates(newStates);
      hasCheckedRef.current = true;
      setHasChecked(true);
    } catch (err: any) {
      console.error(`❌ Error checking multi-feedback for ${components.join(',')}:${sourceId}:`, err);
      setError(err.message || 'Failed to check existing feedback');
    } finally {
      setIsLoading(false);
    }
  }, [components, sourceId, pageUrl, onFeedbackExists]);

  const markAsSubmitted = useCallback((component: ComponentName) => {
    setFeedbackStates(prev => {
      const currentState = prev[component];
      
      return {
        ...prev,
        [component]: {
          ...currentState,
          canSubmitFeedback: false, // Prevent duplicate submissions
          // Keep existingFeedback as is - don't override API data
        }
      };
    });
    console.log(`✅ Feedback marked as submitted for ${component}:${sourceId} - preventing duplicates`);
  }, [sourceId]);



  const resetFeedback = useCallback(() => {
    setFeedbackStates({});
    setError(null);
    hasCheckedRef.current = false;
    lastCheckTimeRef.current = 0;
    setHasChecked(false);
    setLastCheckTime(0);
    console.log(`🔄 Multi-feedback state reset for ${components.join(',')}:${sourceId}`);
  }, [components, sourceId]);

  useEffect(() => {
    hasCheckedRef.current = false;
    lastCheckTimeRef.current = 0;
    setHasChecked(false);
    setLastCheckTime(0);
    console.log(`🔄 Resetting multi-feedback check flag for ${components.join(',')}:${sourceId}`);
  }, [components, sourceId]);

  useEffect(() => {
    checkFeedback();
  }, [checkFeedback]);

  return {
    feedbackStates,
    isLoading,
    error,
    checkFeedback,
    markAsSubmitted,
    resetFeedback,
    _debug: {
      hasChecked,
      lastCheckTime,
      components,
      sourceId,
      pageUrl
    }
  };
};
