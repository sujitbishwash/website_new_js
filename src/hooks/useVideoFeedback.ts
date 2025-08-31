import { useState, useEffect, useCallback } from 'react';
import { VideoFeedbackPayload } from '@/components/feedback/VideoFeedbackModal';

// Mock API functions - replace with actual API calls
const feedbackApi = {
  // Get feedback suggestions from backend
  getFeedbackSuggestions: async (): Promise<string[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return dynamic suggestions based on video type/category
    // In real implementation, this would come from your backend
    return [
      // Technical issues
      "Audio issues",
      "Poor video quality", 
      "Buffering problems",
      
      // Content issues
      "Too fast",
      "Too slow",
      "Confusing explanation",
      "Missing steps",
      "Wrong example",
      "Slides missing",
      "Too basic",
      "Too advanced",
      
      // Experience issues
      "Boring",
      "Repetitive",
      "Too long",
      
      // Positive feedback
      "Great pace",
      "Clear explanation",
      "Helpful examples",
      "Engaging",
      "Well structured",
    ];
  },

  // Submit feedback to backend
  submitFeedback: async (payload: VideoFeedbackPayload): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In real implementation, send to your backend
    console.log('Submitting feedback:', payload);
    
    // Simulate occasional error
    if (Math.random() < 0.1) {
      throw new Error('Network error');
    }
  },

  // Get user's previous feedback for this video
  getPreviousFeedback: async (): Promise<VideoFeedbackPayload | null> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In real implementation, fetch from backend
    // For now, return null (no previous feedback)
    return null;
  },
};

interface UseVideoFeedbackOptions {
  videoId: string;
  videoTitle?: string;
  onFeedbackSubmitted?: (payload: VideoFeedbackPayload) => void;
  onFeedbackSkipped?: () => void;
}

interface UseVideoFeedbackReturn {
  // State
  isFeedbackModalOpen: boolean;
  feedbackSuggestions: string[];
  isLoadingSuggestions: boolean;
  sessionStartTime: Date | null;
  watchPercentage: number;
  
  // Actions
  openFeedbackModal: () => void;
  closeFeedbackModal: () => void;
  submitFeedback: (payload: VideoFeedbackPayload) => Promise<void>;
  skipFeedback: () => void;
  
  // Session tracking
  startSession: () => void;
  updateWatchPercentage: (percentage: number) => void;
  
  // Page leave detection
  shouldShowFeedbackOnLeave: boolean;
  setShouldShowFeedbackOnLeave: (show: boolean) => void;
}

export const useVideoFeedback = ({
  videoId,
  onFeedbackSubmitted,
  onFeedbackSkipped,
}: UseVideoFeedbackOptions): UseVideoFeedbackReturn => {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackSuggestions, setFeedbackSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [watchPercentage, setWatchPercentage] = useState(0);
  const [shouldShowFeedbackOnLeave, setShouldShowFeedbackOnLeave] = useState(false);
  const [hasShownFeedback, setHasShownFeedback] = useState(false);

  // Load feedback suggestions
  const loadFeedbackSuggestions = useCallback(async () => {
    if (!videoId) return;
    
    setIsLoadingSuggestions(true);
    try {
      const suggestions = await feedbackApi.getFeedbackSuggestions();
      setFeedbackSuggestions(suggestions);
    } catch (error) {
      console.error('Failed to load feedback suggestions:', error);
      // Fallback to default suggestions
      setFeedbackSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, [videoId]);

  // Start session tracking
  const startSession = useCallback(() => {
    setSessionStartTime(new Date());
    setWatchPercentage(0);
    setHasShownFeedback(false);
  }, []);

  // Update watch percentage
  const updateWatchPercentage = useCallback((percentage: number) => {
    setWatchPercentage(Math.min(100, Math.max(0, percentage)));
  }, []);

  // Open feedback modal
  const openFeedbackModal = useCallback(() => {
    if (hasShownFeedback) return; // Prevent showing multiple times
    
    setIsFeedbackModalOpen(true);
    setHasShownFeedback(true);
    loadFeedbackSuggestions();
  }, [hasShownFeedback, loadFeedbackSuggestions]);

  // Close feedback modal
  const closeFeedbackModal = useCallback(() => {
    setIsFeedbackModalOpen(false);
  }, []);

  // Submit feedback
  const submitFeedback = useCallback(async (payload: VideoFeedbackPayload) => {
    try {
      await feedbackApi.submitFeedback(payload);
      onFeedbackSubmitted?.(payload);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      throw error;
    }
  }, [onFeedbackSubmitted]);

  // Skip feedback
  const skipFeedback = useCallback(() => {
    onFeedbackSkipped?.();
    setHasShownFeedback(true);
  }, [onFeedbackSkipped]);

  // Auto-show feedback when video ends (watchPercentage >= 90%)
  useEffect(() => {
    if (watchPercentage >= 90 && !hasShownFeedback && shouldShowFeedbackOnLeave) {
      openFeedbackModal();
    }
  }, [watchPercentage, hasShownFeedback, shouldShowFeedbackOnLeave, openFeedbackModal]);

  // Page leave detection with enhanced guard
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (shouldShowFeedbackOnLeave && !hasShownFeedback && watchPercentage > 30) {
        // Show browser's default leave warning
        event.preventDefault();
        event.returnValue = 'You have unsaved feedback. Are you sure you want to leave?';
        
        // Store state to show feedback on next visit
        localStorage.setItem(`feedback_pending_${videoId}`, JSON.stringify({
          timestamp: Date.now(),
          watchPercentage,
          sessionStartTime: sessionStartTime?.toISOString(),
        }));
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && shouldShowFeedbackOnLeave && !hasShownFeedback && watchPercentage > 30) {
        // Store state for when user returns
        localStorage.setItem(`feedback_pending_${videoId}`, JSON.stringify({
          timestamp: Date.now(),
          watchPercentage,
          sessionStartTime: sessionStartTime?.toISOString(),
        }));
      }
    };

    // Enhanced navigation guard
    const handlePopState = (event: PopStateEvent) => {
      if (shouldShowFeedbackOnLeave && !hasShownFeedback && watchPercentage > 30) {
        // Prevent navigation and show feedback modal
        event.preventDefault();
        openFeedbackModal();
        
        // Store navigation intent
        localStorage.setItem(`navigation_pending_${videoId}`, JSON.stringify({
          timestamp: Date.now(),
          intendedPath: window.location.pathname,
        }));
      }
    };

    // Listen for navigation attempts
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [shouldShowFeedbackOnLeave, hasShownFeedback, watchPercentage, videoId, sessionStartTime, openFeedbackModal]);

  // Check for pending feedback on mount
  useEffect(() => {
    const pendingFeedback = localStorage.getItem(`feedback_pending_${videoId}`);
    if (pendingFeedback) {
      try {
        const data = JSON.parse(pendingFeedback);
        const timeSinceLastVisit = Date.now() - data.timestamp;
        
        // Show feedback if user returns within 24 hours
        if (timeSinceLastVisit < 24 * 60 * 60 * 1000) {
          setWatchPercentage(data.watchPercentage);
          if (data.sessionStartTime) {
            setSessionStartTime(new Date(data.sessionStartTime));
          }
          setShouldShowFeedbackOnLeave(true);
          openFeedbackModal();
        }
        
        // Clear pending feedback
        localStorage.removeItem(`feedback_pending_${videoId}`);
      } catch (error) {
        console.error('Failed to parse pending feedback:', error);
        localStorage.removeItem(`feedback_pending_${videoId}`);
      }
    }
  }, [videoId, openFeedbackModal]);

  return {
    // State
    isFeedbackModalOpen,
    feedbackSuggestions,
    isLoadingSuggestions,
    sessionStartTime,
    watchPercentage,
    
    // Actions
    openFeedbackModal,
    closeFeedbackModal,
    submitFeedback,
    skipFeedback,
    
    // Session tracking
    startSession,
    updateWatchPercentage,
    
    // Page leave detection
    shouldShowFeedbackOnLeave,
    setShouldShowFeedbackOnLeave,
  };
};
