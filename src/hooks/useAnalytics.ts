import { usePostHog } from '../contexts/PostHogContext';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';

export const useAnalytics = () => {
  const { capture, identify, reset } = usePostHog();
  const { user } = useAuth();
  const { profile } = useUser();

  // User identification
  const identifyUser = () => {
    if (user?.id) {
      identify(user.id, {
        email: user.email,
        name: profile?.name,
      });
    }
  };

  // Page view tracking
  const trackPageView = (pageName: string, properties?: Record<string, any>) => {
    capture('page_viewed', {
      page_name: pageName,
      ...properties,
    });
  };

  // Video analytics
  const trackVideoStart = (videoId: string, videoTitle: string, subject?: string) => {
    capture('video_started', {
      video_id: videoId,
      video_title: videoTitle,
      subject,
    });
  };

  const trackVideoProgress = (videoId: string, progress: number, duration: number) => {
    capture('video_progress', {
      video_id: videoId,
      progress_percentage: progress,
      duration_seconds: duration,
    });
  };

  const trackVideoComplete = (videoId: string, videoTitle: string, watchTime: number) => {
    capture('video_completed', {
      video_id: videoId,
      video_title: videoTitle,
      watch_time_seconds: watchTime,
    });
  };

  // Test analytics
  const trackTestStart = (testId: string, testType: string, difficulty: string) => {
    capture('test_started', {
      test_id: testId,
      test_type: testType,
      difficulty,
    });
  };

  const trackTestComplete = (testId: string, score: number, totalQuestions: number, timeSpent: number) => {
    capture('test_completed', {
      test_id: testId,
      score,
      total_questions: totalQuestions,
      time_spent_seconds: timeSpent,
    });
  };

  const trackTestSubmit = (testId: string, answers: any[]) => {
    capture('test_submitted', {
      test_id: testId,
      answer_count: answers.length,
    });
  };

  // Learning analytics
  const trackFlashcardView = (cardId: string, subject: string) => {
    capture('flashcard_viewed', {
      card_id: cardId,
      subject,
    });
  };

  const trackQuizAttempt = (quizId: string, questionId: string, isCorrect: boolean) => {
    capture('quiz_attempted', {
      quiz_id: quizId,
      question_id: questionId,
      is_correct: isCorrect,
    });
  };

  const trackSummaryView = (summaryId: string, subject: string) => {
    capture('summary_viewed', {
      summary_id: summaryId,
      subject,
    });
  };

  // User actions
  const trackLogin = (method: string = 'email') => {
    capture('user_logged_in', {
      login_method: method,
    });
  };

  const trackLogout = () => {
    capture('user_logged_out', {});
    reset(); // Reset PostHog session
  };

  const trackProfileUpdate = (updatedFields: string[]) => {
    capture('profile_updated', {
      updated_fields: updatedFields,
    });
  };

  // Feature usage
  const trackFeatureUsed = (featureName: string, properties?: Record<string, any>) => {
    capture('feature_used', {
      feature_name: featureName,
      ...properties,
    });
  };

  // Error tracking
  const trackError = (error: string, context?: string, properties?: Record<string, any>) => {
    capture('error_occurred', {
      error_message: error,
      context,
      ...properties,
    });
  };

  // Search analytics
  const trackSearch = (query: string, resultsCount: number, filters?: Record<string, any>) => {
    capture('search_performed', {
      search_query: query,
      results_count: resultsCount,
      filters,
    });
  };

  return {
    // Core functions
    identifyUser,
    trackPageView,
    
    // Video analytics
    trackVideoStart,
    trackVideoProgress,
    trackVideoComplete,
    
    // Test analytics
    trackTestStart,
    trackTestComplete,
    trackTestSubmit,
    
    // Learning analytics
    trackFlashcardView,
    trackQuizAttempt,
    trackSummaryView,
    
    // User actions
    trackLogin,
    trackLogout,
    trackProfileUpdate,
    
    // Feature usage
    trackFeatureUsed,
    
    // Error tracking
    trackError,
    
    // Search analytics
    trackSearch,
  };
};
