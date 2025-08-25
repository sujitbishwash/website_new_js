import { useState, useEffect, useCallback } from 'react';
import { feedbackApi, FeedbackStatus, ComponentName } from '@/lib/api-client';

interface UseFeedbackTrackerOptions {
  component: ComponentName;
  sourceId: string;
  pageUrl: string;
  onFeedbackExists?: (existingFeedback: FeedbackStatus['existing_feedback']) => void;
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

  // Check for existing feedback when component or sourceId changes
  const checkFeedback = useCallback(async () => {
    if (!component || !sourceId || !pageUrl) return;
    
    // Prevent multiple API calls for the same component/sourceId
    if (hasChecked) {
      console.log(`🔄 Skipping feedback check - already checked for ${component}:${sourceId}`);
      return;
    }

    // Debounce: prevent API calls within 2 seconds of each other
    const now = Date.now();
    if (now - lastCheckTime < 2000) {
      console.log(`⏱️ Debouncing feedback check for ${component}:${sourceId} - too soon since last call`);
      return;
    }

    console.log(`🔍 Checking feedback for ${component}:${sourceId} at ${pageUrl}`);
    setLastCheckTime(now);
    setIsLoading(true);
    setError(null);

    try {
      const response = await feedbackApi.canSubmitFeedback(sourceId, component, pageUrl);
      
      setCanSubmitFeedback(response.can_feedback);
      setExistingFeedback(response.existing_feedback);
      setReason(response.reason);
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
  }, [component, sourceId, pageUrl, hasChecked, lastCheckTime]); // Added lastCheckTime to dependencies

  // Mark feedback as submitted (called after successful submission)
  const markAsSubmitted = useCallback(() => {
    setCanSubmitFeedback(false);
    console.log(`✅ Feedback marked as submitted for ${component}:${sourceId}`);
  }, [component, sourceId]);

  // Reset feedback state (useful for testing or admin purposes)
  const resetFeedback = useCallback(() => {
    setCanSubmitFeedback(true);
    setExistingFeedback(null);
    setError(null);
    setReason("");
    setHasChecked(false); // Reset the checked flag
    console.log(`🔄 Feedback state reset for ${component}:${sourceId}`);
  }, [component, sourceId]);

  // Reset hasChecked when component or sourceId changes
  useEffect(() => {
    setHasChecked(false);
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
