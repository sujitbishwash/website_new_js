import VideoFeedbackModal from "@/components/feedback/VideoFeedbackModal";
import Chat from "@/components/learning/Chat";
import Flashcards from "@/components/learning/Flashcards";
import Quiz from "@/components/learning/Quiz";
import Summary from "@/components/learning/Summary";

import { ComponentName } from "@/lib/api-client";
import { ROUTES } from "@/routes/constants";
import { theme } from "@/styles/theme";
import { Eye, EyeOff} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import React from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useBlocker,
} from "react-router-dom";
import {
  chatApi,
  videoApi,
  VideoDetail,
  videoProgressApi,
} from "../../lib/api-client";
import YouTube from "react-youtube";
import { useMultiFeedbackTracker } from "../../hooks/useFeedbackTracker";
import ShareModal from "@/components/modals/ShareModal";
import ContentTabs from "@/components/learning/ContentTabs";
import AITutorPanel from "@/components/learning/AITutorPanel";
import Header from "@/components/learning/Header";
import SparklesIcon from "@/components/icons/SparklesIcon";
import CustomLoader from "@/components/icons/customloader";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

// Wrapper components to prevent unnecessary re-renders
const FlashcardsWrapper = React.memo(({ videoId }: { videoId: string }) => {
  return <Flashcards videoId={videoId} />;
});

const SummaryWrapper = React.memo(({ videoId }: { videoId: string }) => {
  return <Summary videoId={videoId} />;
});

// Type definitions
// --- TYPE DEFINITIONS ---
interface IconProps {
  path: string;
  className?: string;
}

interface Chapter {
  time: string;
  title: string;
  content: string;
}

// Learning mode types
type LearningMode = "chat" | "flashcards" | "quiz" | "summary";

// --- Main App Component ---
const VideoPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // State for video data
  const [videoDetail, setVideoDetail] = useState<VideoDetail | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [transcript, setTranscript] = useState<string>("");
  const [isLoadingVideo, setIsLoadingVideo] = useState(true);
  const [isLoadingChapters, setIsLoadingChapters] = useState(false);
  const [isLoadingTranscript, setIsLoadingTranscript] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [chaptersError, setChaptersError] = useState<string | null>(null);
  const [transcriptError, setTranscriptError] = useState<string | null>(null);
  const [isLeftColumnVisible, setIsLeftColumnVisible] = useState(true);
  const [_showOutOfSyllabus, setShowOutOfSyllabus] = useState(false);

  // State for learning mode
  const [currentMode, setCurrentMode] = useState<LearningMode>("chat");

  // Video progress state
  const [videoProgress, setVideoProgress] = useState(0);

  // Chat state management
  const [chatMessages, setChatMessages] = useState<
    Array<{ text: string; isUser: boolean }>
  >([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [chatInitialized, setChatInitialized] = useState(false);

  // Video player ref for tracking progress
  const videoDurationRef = useRef<number>(0);
  const ytPlayerRef = useRef<any>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const periodicSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const isPlayerActivelyPlaying = useCallback((): boolean => {
    try {
      const state = ytPlayerRef.current?.getPlayerState?.();
      // 1 = playing
      if (state === 1) return true;
    } catch {}
    return isPlayingRef.current;
  }, []);
  const [resumePosition, setResumePosition] = useState<number>(0);
  const [resumePercent, setResumePercent] = useState<number>(0);
  const resumeSeekAppliedRef = useRef<boolean>(false);

  // Get video ID from URL params or location state
  const currentVideoId = videoId || location.state?.videoId;

  // Track last saved progress to avoid duplicate saves
  const lastSavedProgressRef = useRef<{
    percentage: number;
    position: number;
    timestamp: number;
  } | null>(null);

  // Function to save video progress with throttling and deduplication
  const saveVideoProgress = useCallback(async () => {
    if (!currentVideoId || !ytPlayerRef.current) {
      return;
    }

    try {
      const currentTime = ytPlayerRef.current.getCurrentTime();
      const duration = ytPlayerRef.current.getDuration();

      // Only save progress if video has been played (currentTime >= 0.1) and duration is available
      if (duration > 0 && currentTime >= 0.1) {
        const watchPercentage = (currentTime / duration) * 100;
        const now = Date.now();
        
        // Throttle saves: only save if progress changed significantly or enough time passed
        const lastSaved = lastSavedProgressRef.current;
        const shouldSave = !lastSaved || 
          Math.abs(watchPercentage - lastSaved.percentage) >= 5 || // 5% change
          Math.abs(currentTime - lastSaved.position) >= 30 || // 30 seconds change
          (now - lastSaved.timestamp) >= 60000; // 1 minute passed

        if (!shouldSave) {
          return;
        }

        try {
          await videoProgressApi.trackProgress({
            video_id: currentVideoId,
            watch_percentage: Math.round(watchPercentage * 100) / 100,
            total_duration: Math.round(duration),
            current_position: Math.round(currentTime),
            page_url: window.location.href,
          });
          
          // Update last saved progress
          lastSavedProgressRef.current = {
            percentage: watchPercentage,
            position: currentTime,
            timestamp: now
          };
          
          // Mirror to localStorage on successful save
          const progressData = {
            videoId: currentVideoId,
            title: videoDetail?.title || `Video ${currentVideoId}`,
            thumbnailUrl: `https://img.youtube.com/vi/${currentVideoId}/maxresdefault.jpg`,
            watchPercentage: Math.round(watchPercentage * 100) / 100,
            currentTime: Math.round(currentTime),
            totalDuration: Math.round(duration),
            lastUpdated: new Date().toISOString(),
            subject: videoDetail?.topics?.[0] || "General",
            description: videoDetail?.description || "Video content",
          };
          localStorage.setItem(
            `video_progress_${currentVideoId}`,
            JSON.stringify(progressData)
          );
        } catch (apiError: any) {
          // If API endpoint doesn't exist (404), try alternative approach
          if (apiError.status === 404) {
            // Store progress in localStorage as fallback
            const progressData = {
              videoId: currentVideoId,
              title: videoDetail?.title || `Video ${currentVideoId}`,
              thumbnailUrl: `https://img.youtube.com/vi/${currentVideoId}/maxresdefault.jpg`,
              watchPercentage: Math.round(watchPercentage * 100) / 100,
              currentTime: Math.round(currentTime),
              totalDuration: Math.round(duration),
              lastUpdated: new Date().toISOString(),
              subject: videoDetail?.topics?.[0] || "General",
              description: videoDetail?.description || "Video content",
            };
            localStorage.setItem(
              `video_progress_${currentVideoId}`,
              JSON.stringify(progressData)
            );
          } else {
            throw apiError;
          }
        }
      }
    } catch (error) {}
  }, [currentVideoId, videoDetail]);

  // Create a wrapped navigate function that shows alert before navigating
  const navigateWithProgress = useCallback(
    (to: string, options?: any) => {
      saveVideoProgress();
      navigate(to, options);
    },
    [navigate]
  );

  // React Router navigation blocker
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    const isNavigatingAway = currentLocation.pathname !== nextLocation.pathname;

    return isNavigatingAway;
  });

  // Handle React Router navigation blocking
  useEffect(() => {
    if (blocker.state === "blocked") {
      saveVideoProgress();
      blocker.proceed();
    }
  }, [blocker]);

  // Track previous location to detect navigation
  const prevLocationRef = useRef(location.pathname);

  useEffect(() => {
    // Check if location has changed
    if (prevLocationRef.current !== location.pathname) {
      saveVideoProgress();
      prevLocationRef.current = location.pathname;
    }
  }, [location.pathname]);

  // Simple feedback state management
  // Use the feedback tracker hook for all components
  const {
    feedbackStates,
    isLoading: isFeedbackLoading,
    markAsSubmitted,
  } = useMultiFeedbackTracker({
    components: [
      ComponentName.Video,
      ComponentName.Chat,
      ComponentName.Quiz,
      ComponentName.Summary,
      ComponentName.Flashcard,
    ],
    sourceId: currentVideoId || "",
    pageUrl: window.location.href,
    onFeedbackExists: () => {},
  });

  // Create wrapper functions for markAsSubmitted for each component
  const chatMarkAsSubmitted = useCallback(() => {
    markAsSubmitted(ComponentName.Chat);
  }, [markAsSubmitted]);

  const quizMarkAsSubmitted = useCallback(() => {
    markAsSubmitted(ComponentName.Quiz);
  }, [markAsSubmitted]);

  // Removed unused callback functions

  // Create wrapper function for markAsSubmitted to maintain backward compatibility
  const videoMarkAsSubmitted = useCallback(() => {}, []);

  // Extract video feedback state
  const videoFeedbackState = feedbackStates[ComponentName.Video];
  const videoCanSubmitFeedback = videoFeedbackState
    ? videoFeedbackState.canSubmitFeedback
    : isFeedbackLoading
    ? false
    : true;
  const videoExistingFeedback = videoFeedbackState?.existingFeedback ?? null;

  // Extract feedback states for all components - provide sensible defaults
  const chatFeedbackState = feedbackStates[ComponentName.Chat] || {
    canSubmitFeedback: true,
    existingFeedback: null,
    reason: "",
  };
  const quizFeedbackState = feedbackStates[ComponentName.Quiz] || {
    canSubmitFeedback: true,
    existingFeedback: null,
    reason: "",
  };
  const summaryFeedbackState = feedbackStates[ComponentName.Summary] || {
    canSubmitFeedback: true,
    existingFeedback: null,
    reason: "",
  };
  const flashcardFeedbackState = feedbackStates[ComponentName.Flashcard] || {
    canSubmitFeedback: true,
    existingFeedback: null,
    reason: "",
  };

  // Components object will be defined after all functions are available

  // Local modal state for feedback
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const openFeedbackModal = useCallback(() => setIsFeedbackModalOpen(true), []);
  const closeFeedbackModal = useCallback(
    () => setIsFeedbackModalOpen(false),
    []
  );

  // YouTube player event handlers
  const onYouTubeReady = useCallback(
    (event: any) => {
      const player = event.target;

      // Store player reference for progress tracking
      ytPlayerRef.current = player;

      // Seek to saved position if available
      const attemptSeek = () => {
        try {
          if (!resumeSeekAppliedRef.current && resumePosition > 0) {
            const duration = player.getDuration?.() || 0;
            // Ensure the player is ready with a valid duration
            if (duration > 0 && resumePosition < duration) {
              player.seekTo(resumePosition, true);
              resumeSeekAppliedRef.current = true;
            }
          } else if (!resumeSeekAppliedRef.current && resumePercent > 0) {
            const duration = player.getDuration?.() || 0;
            if (duration > 0) {
              const target = Math.min(duration - 1, Math.max(0, (resumePercent / 100) * duration));
              player.seekTo(target, true);
              resumeSeekAppliedRef.current = true;
            }
          }
        } catch {}
      };
      // Try immediately and again shortly after; some embeds need a delay
      attemptSeek();
      setTimeout(attemptSeek, 500);

      // Start progress tracking interval - only track progress, don't save
      const interval = setInterval(() => {
        try {
          const currentTime = player.getCurrentTime();
          const duration = player.getDuration();

          if (duration > 0) {
            const progress = (currentTime / duration) * 100;
            setVideoProgress(progress);

            // Store duration for progress tracking
            videoDurationRef.current = duration;

            // Auto-show feedback when video reaches 90%
            if (
              progress >= 90 &&
              !hasShownFeedbackRef.current &&
              videoCanSubmitFeedbackRef.current &&
              videoCanSubmitFeedback &&
              !videoExistingFeedback
            ) {
              openFeedbackModal();
              hasShownFeedbackRef.current = true;
            }

            // Note: Progress saving is now handled by the periodic interval below
          }
        } catch (error) {}
      }, 2000); // Update every 2 seconds

      // Store interval reference for cleanup
      progressIntervalRef.current = interval;

      // Note: Periodic saving is handled by the useEffect below to avoid duplicates

      // Return cleanup function
      return () => {
        if (interval) {
          clearInterval(interval);
        }
        // Note: Periodic interval cleanup is handled by useEffect
      };
    },
    [openFeedbackModal, saveVideoProgress]
  );

  const onYouTubeEnd = useCallback(async () => {
    setVideoProgress(100);

    // Save final progress when video ends
    await saveVideoProgress();

    // Show feedback modal when video ends
    if (
      !hasShownFeedbackRef.current &&
      videoCanSubmitFeedbackRef.current &&
      !videoExistingFeedback
    ) {
      openFeedbackModal();
      hasShownFeedbackRef.current = true;
    }
  }, [openFeedbackModal, saveVideoProgress]);

  const onYouTubeStateChange = useCallback(
    (event: any) => {
      const playerState = event.data;

      // Update playing state
      console.debug("[Video] onYouTubeStateChange: playerState", playerState);
      // 1 = playing, 2 = paused, 3 = buffering, 0 = ended, 5 = video cued
      if (playerState === 1) {
        isPlayingRef.current = true;
      } else if (playerState === 2 || playerState === 0 || playerState === 5) {
        isPlayingRef.current = false;
      }

      // Persist progress when user pauses or buffers
      // 2 = paused, 3 = buffering per YT IFrame API
      if (playerState === 2 || playerState === 3) {
        saveVideoProgress();
      }

      // Handle video end
      if (playerState === 0) {
        // 0 = ended
        onYouTubeEnd();
        // Note: Periodic interval cleanup is handled by useEffect
      }
    },
    [onYouTubeEnd, saveVideoProgress]
  );

  // Use refs for feedback gates to avoid effect dependencies causing teardown
  const videoCanSubmitFeedbackRef = useRef<boolean>(false);
  const hasShownFeedbackRef = useRef<boolean>(false);

  // Update refs when feedback state changes
  useEffect(() => {
    videoCanSubmitFeedbackRef.current = videoCanSubmitFeedback;
  }, [videoCanSubmitFeedback]);

  // Reset feedback state when video changes
  useEffect(() => {
    if (currentVideoId) {
      // Reset feedback state for new video
      hasShownFeedbackRef.current = false;
      resumeSeekAppliedRef.current = false;

      // The useMultiFeedbackTracker hook automatically resets when sourceId changes

      // Reset video progress tracking
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }

      // Reset YouTube player reference
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy?.();
        } catch {
          // Ignore destroy errors
        }
        ytPlayerRef.current = null;
      }

      // Note: Periodic interval cleanup is handled by main useEffect
    }
  }, [currentVideoId]);


  // Cleanup progress tracking on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current != null) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      // Note: Periodic interval cleanup is handled by main useEffect

      // Save final progress before unmounting
      saveVideoProgress();
    };
  }, [saveVideoProgress]);

  // Navigation guard - show alert on any navigation attempt
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Show alert before leaving the page

      const message = "Are you sure you want to leave this video?";
      event.returnValue = message;
      return message;
    };

    const handlePopState = () => {
      saveVideoProgress();
    };

    // Handle React Router navigation
    const handleRouteChange = () => {
      saveVideoProgress();
      return true;
    };

    // Listen for navigation attempts
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    // Store the route change handler for cleanup
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    // Override history methods to catch programmatic navigation
    window.history.pushState = function (...args) {
      if (handleRouteChange()) {
        originalPushState.apply(this, args);
      }
    };

    window.history.replaceState = function (...args) {
      if (handleRouteChange()) {
        originalReplaceState.apply(this, args);
      }
    };

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);

      // Restore original history methods
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  // Handle feedback completion and navigation
  const handleFeedbackComplete = useCallback(
    (_action: "submit" | "skip" | "dismiss") => {
      closeFeedbackModal();

      // Check if there was a pending navigation
      const pendingNavigation = localStorage.getItem(
        `navigation_pending_${currentVideoId}`
      );
      if (pendingNavigation) {
        try {
          const data = JSON.parse(pendingNavigation);
          localStorage.removeItem(`navigation_pending_${currentVideoId}`);

          // Allow navigation to proceed
          if (
            data.intendedPath &&
            data.intendedPath !== window.location.pathname
          ) {
            navigateWithProgress(data.intendedPath);
          }
        } catch (error) {}
      }

      // Clear any pending feedback state
      localStorage.removeItem(`feedback_pending_${currentVideoId}`);

      // Log feedback action for analytics
    },
    [closeFeedbackModal, currentVideoId, navigate]
  );

  // Fetch video details
  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        setIsLoadingVideo(true);

        // Try to get video details from API
        const videoUrl = `https://www.youtube.com/watch?v=${currentVideoId}`;

        const details = await videoApi.getVideoDetail(videoUrl);

        setVideoDetail(details);
      } catch (err: any) {
        // Check if it's an out-of-syllabus error
        if (err.isOutOfSyllabus || err.status === 204) {
          setShowOutOfSyllabus(true);
        } else {
          // For other errors, set a fallback video detail with default topics
        }
      } finally {
        setIsLoadingVideo(false);
      }
    };

    if (currentVideoId) {
      fetchVideoDetails();
    } else {
      setIsLoadingVideo(false);
    }
  }, [currentVideoId]);

  // Fetch saved progress and set resume position
  useEffect(() => {
    const fetchProgress = async () => {
      if (!currentVideoId) return;
      try {
        const resp = await videoProgressApi.getProgress(currentVideoId);
        const pos = Number(resp.data?.current_position ?? 0);
        const pct = Number(resp.data?.watch_percentage ?? 0);
        if (!isNaN(pos) && pos > 0) setResumePosition(pos);
        if (!isNaN(pct) && pct > 0) setResumePercent(pct);
        if ((isNaN(pos) || pos <= 0) && (isNaN(pct) || pct <= 0)) {
          const raw = localStorage.getItem(`video_progress_${currentVideoId}`);
          if (raw) {
            try {
              const data = JSON.parse(raw);
              const lsPos = Number(data?.currentTime ?? 0);
              const lsPct = Number(data?.watchPercentage ?? 0);
              if (!isNaN(lsPos) && lsPos > 0) setResumePosition(lsPos);
              if (!isNaN(lsPct) && lsPct > 0) setResumePercent(lsPct);
            } catch {}
          }
        }
      } catch {
        // ignore if no progress
        const raw = localStorage.getItem(`video_progress_${currentVideoId}`);
        if (raw) {
          try {
            const data = JSON.parse(raw);
            const lsPos = Number(data?.currentTime ?? 0);
            const lsPct = Number(data?.watchPercentage ?? 0);
            if (!isNaN(lsPos) && lsPos > 0) setResumePosition(lsPos);
            if (!isNaN(lsPct) && lsPct > 0) setResumePercent(lsPct);
          } catch {}
        }
      }
    };
    fetchProgress();
  }, [currentVideoId]);

  // If resume position arrives after player is ready, attempt seek once
  useEffect(() => {
    if (ytPlayerRef.current && resumePosition > 0 && !resumeSeekAppliedRef.current) {
      try {
        const duration = ytPlayerRef.current.getDuration?.() || 0;
        if (duration > 0 && resumePosition < duration) {
          ytPlayerRef.current.seekTo(resumePosition, true);
          resumeSeekAppliedRef.current = true;
        }
      } catch {}
    }
  }, [resumePosition]);

  // Fallback: if only percent is available later, seek by percent
  useEffect(() => {
    if (ytPlayerRef.current && resumePercent > 0 && !resumeSeekAppliedRef.current) {
      try {
        const duration = ytPlayerRef.current.getDuration?.() || 0;
        if (duration > 0) {
          const target = Math.min(duration - 1, Math.max(0, (resumePercent / 100) * duration));
          ytPlayerRef.current.seekTo(target, true);
          resumeSeekAppliedRef.current = true;
        }
      } catch {}
    }
  }, [resumePercent]);

  // Fetch chapters
  useEffect(() => {
    const fetchChapters = async () => {
      if (!videoDetail?.external_source_id) return;

      try {
        setIsLoadingChapters(true);
        setChaptersError(null);

        const response = await videoApi.getVideoChapters(
          videoDetail.external_source_id
        );
        const transformedChapters: Chapter[] = response.chapters.map(
          (chapter) => ({
            time: chapter.timestamp,
            title: chapter.title,
            content: chapter.description,
          })
        );
        setChapters(transformedChapters);
      } catch (err: any) {
        setChaptersError("Failed to load chapters. Please try again.");
      } finally {
        setIsLoadingChapters(false);
      }
    };

    fetchChapters();
  }, [videoDetail?.external_source_id]);

  // Manual transcript fetching function
  const fetchTranscript = useCallback(async () => {
    if (!videoDetail?.external_source_id) return;

    try {
      setIsLoadingTranscript(true);
      setTranscriptError(null);

      const response = await videoApi.getVideoTranscript(
        videoDetail.external_source_id
      );
      setTranscript(response.transcript);
    } catch (err: any) {
      setTranscriptError("Failed to load transcript. Please try again.");
    } finally {
      setIsLoadingTranscript(false);
    }
  }, [videoDetail?.external_source_id]);

  // Initialize chat when videoId changes
  useEffect(() => {
    if (currentVideoId && !chatInitialized) {
      initializeChat();
    }
  }, [currentVideoId, chatInitialized]);

  // Reset chat state when videoId changes
  useEffect(() => {
    setChatInitialized(false);
    setChatMessages([]);
    setChatError(null);

    // Reset transcript state when video changes
    setTranscript("");
    setTranscriptError(null);
    setIsLoadingTranscript(false);

  }, [currentVideoId]);

  const initializeChat = async () => {
    if (!currentVideoId) return;

    setIsChatLoading(true);
    setChatError(null);
    try {
      const history = await chatApi.getChatHistory(currentVideoId);
      if (history.memory && history.memory.length > 0) {
        const convertedMessages = history.memory.map((msg) => ({
          text: msg.content,
          isUser: msg.role === "user",
        }));
        setChatMessages(convertedMessages);
      } else {
        // If no history, start a new chat
        try {
          const startResponse = await chatApi.startChat(currentVideoId);
          setChatMessages([{ text: startResponse.content, isUser: false }]);
        } catch (startErr) {
          setChatError("Failed to start new chat.");
        }
      }
    } catch (err) {
      setChatError("Failed to load chat history. Starting new chat.");

      // Try to start a new chat if history fails
      try {
        const startResponse = await chatApi.startChat(currentVideoId);
        setChatMessages([{ text: startResponse.content, isUser: false }]);
      } catch (startErr) {
        setChatError("Failed to start new chat.");
      }
    } finally {
      setIsChatLoading(false);
      setChatInitialized(true);
    }
  };

  const handleSendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || !currentVideoId) {
        return;
      }

      // Add user message immediately
      const userMessage = { text: message, isUser: true };

      setChatMessages((prev) => {
        const newMessages = [...prev, userMessage];

        return newMessages;
      });

      setIsChatLoading(true);
      setChatError(null);

      try {
        const response = await chatApi.sendMessage(currentVideoId, message);

        const assistantMessage = { text: response.content, isUser: false };

        setChatMessages((prev) => {
          const newMessages = [...prev, assistantMessage];

          return newMessages;
        });
      } catch (err) {
        setChatError("Failed to send message. Please try again.");
        // Remove the user message if sending failed
        setChatMessages((prev) => {
          const newMessages = prev.slice(0, -1);

          return newMessages;
        });
      } finally {
        setIsChatLoading(false);
      }
    },
    [currentVideoId]
  );

  // Create refs to track the latest feedback states without causing re-renders
  const feedbackStatesRef = useRef({
    chat: chatFeedbackState,
    flashcards: flashcardFeedbackState,
    quiz: quizFeedbackState,
    summary: summaryFeedbackState,
  });

  // Update refs when feedback states change
  useEffect(() => {
    feedbackStatesRef.current = {
      chat: chatFeedbackState,
      flashcards: flashcardFeedbackState,
      quiz: quizFeedbackState,
      summary: summaryFeedbackState,
    };
  }, [
    chatFeedbackState,
    flashcardFeedbackState,
    quizFeedbackState,
    summaryFeedbackState,
  ]);

  // Start a resilient 60s periodic saver tied to the current video id
  useEffect(() => {
    if (periodicSaveIntervalRef.current) {
      clearInterval(periodicSaveIntervalRef.current);
      periodicSaveIntervalRef.current = null;
    }
    if (currentVideoId) {
      // Kick off an immediate save once the video id is set, only if actively playing
      if (isPlayerActivelyPlaying()) {
        saveVideoProgress();
      }
      // Then continue saving every 60 seconds while playing
      periodicSaveIntervalRef.current = setInterval(() => {
        if (isPlayerActivelyPlaying()) {
          saveVideoProgress();
        }
      }, 60000);
    }
    return () => {
      if (periodicSaveIntervalRef.current) {
        clearInterval(periodicSaveIntervalRef.current);
        periodicSaveIntervalRef.current = null;
      }
    };
  }, [currentVideoId, saveVideoProgress, isPlayerActivelyPlaying]);

  // Save on tab backgrounding or page lifecycle transitions
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        saveVideoProgress();
      }
    };
    const handlePageHide = () => {
      saveVideoProgress();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [saveVideoProgress]);

  // Create components that update when videoDetail changes
  const components = useMemo(() => {
    return {
      chat: (
        <Chat
          key={`chat-${currentVideoId}`}
          videoId={currentVideoId || ""}
          messages={chatMessages}
          isLoading={isChatLoading}
          error={chatError}
          onSendMessage={handleSendMessage}
          isLeftColumnVisible={isLeftColumnVisible}
          canSubmitFeedback={chatFeedbackState?.canSubmitFeedback}
          existingFeedback={chatFeedbackState?.existingFeedback}
          markAsSubmitted={chatMarkAsSubmitted}
        />
      ),
      flashcards: (
        <FlashcardsWrapper
          key={`flashcards-${currentVideoId}`}
          videoId={currentVideoId || ""}
        />
      ),
      quiz: (() => {
        return (
          <Quiz
            key={`quiz-${currentVideoId}`}
            videoId={currentVideoId || ""}
            canSubmitFeedback={quizFeedbackState?.canSubmitFeedback}
            existingFeedback={quizFeedbackState?.existingFeedback}
            markAsSubmitted={quizMarkAsSubmitted}
            topics={videoDetail?.topics}
          />
        );
      })(),
      summary: (
        <SummaryWrapper
          key={`summary-${currentVideoId}`}
          videoId={currentVideoId || ""}
        />
      ),
    };
  }, [
    currentVideoId,
    videoDetail,
    chatMessages,
    isChatLoading,
    chatError,
    isLeftColumnVisible,
    chatFeedbackState,
    chatMarkAsSubmitted,
    quizFeedbackState,
    quizMarkAsSubmitted,
  ]); // Include all dependencies that affect component rendering

  // Public seek handler for chapters/transcript
  const handleSeekTo = useCallback((seconds: number) => {
    if (ytPlayerRef.current && typeof seconds === 'number' && seconds >= 0) {
      try {
        ytPlayerRef.current.seekTo(seconds, true);
      } catch {}
    }
  }, []);

  const handleShare = useCallback(() => {
    setIsShareModalOpen(true);
  }, []);

  const handleToggleFullScreen = useCallback(() => {
    setIsLeftColumnVisible(!isLeftColumnVisible);
  }, [isLeftColumnVisible]);

  const handleCloseShareModal = useCallback(() => {
    setIsShareModalOpen(false);
  }, []);

  const handleModeChange = useCallback((mode: LearningMode) => {
    setCurrentMode(mode);
  }, []);

  // Enhanced video progress tracking with user interaction detection
  const handleVideoInteraction = useCallback(() => {
    // This function can be called when user interacts with video controls
    // to ensure accurate progress tracking
    if (ytPlayerRef.current && videoDurationRef.current > 0) {
      try {
        // Video interaction detected
      } catch (error) {}
    }
  }, [
    openFeedbackModal,
  ]);

  // Listen for video player events to catch user interactions
  useEffect(() => {
    const handleVideoEvents = () => {
      // This will be called when user interacts with video
      handleVideoInteraction();
    };

    // Add event listeners to video iframe
    const videoIframe = document.querySelector('iframe[src*="youtube.com"]');
    if (videoIframe) {
      videoIframe.addEventListener("load", handleVideoEvents);
      videoIframe.addEventListener("click", handleVideoEvents);

      return () => {
        videoIframe.removeEventListener("load", handleVideoEvents);
        videoIframe.removeEventListener("click", handleVideoEvents);
      };
    }
  }, [handleVideoInteraction]);

  // Effect to inject CSS for custom animations
  useEffect(() => {
    const styleId = "engaging-loading-screen-styles";
    if (document.getElementById(styleId)) return;

    const styleSheet = document.createElement("style");
    styleSheet.id = styleId;
    styleSheet.innerHTML = `
      @keyframes fadeInScaleUp {
        from { opacity: 0; transform: scale(0.95) translateY(10px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
      }
      .animate-fadeInScaleUp { animation: fadeInScaleUp 0.3s ease-out forwards; }
    `;
    document.head.appendChild(styleSheet);

    return () => {
      const style = document.getElementById(styleId);
      if (style) style.remove();
    };
  }, []);

  // Show loading screen while video details are being fetched
  if (isLoadingVideo) {
    return (
        <div className="bg-background min-h-screen font-sans flex flex-col justify-center items-center p-4 gap-4">
        

        <CustomLoader className="h-15 w-15" />
        <span className="text-muted-foreground text-lg">Preparing lessons...</span>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen font-sans">
      <div className="mx-auto hidden w-full h-full sm:block">
        <main className="grid grid-cols-1 xl:grid-cols-5">
          <div
            className={`p-4 xl:col-span-3 overflow-y-auto h-[100vh] ${
              isLeftColumnVisible ? "" : "hidden"
            }`}
          >
            <Header
              videoDetail={videoDetail}
              isLoading={isLoadingVideo}
              onToggleFullScreen={handleToggleFullScreen}
              onNavigate={navigateWithProgress}
            />
            {/* YouTube Video Player with Progress Tracking */}
            <div className="mb-4">
              <YouTube
                videoId={currentVideoId}
                onReady={onYouTubeReady}
                onEnd={onYouTubeEnd}
                onStateChange={onYouTubeStateChange}
                className="aspect-video bg-black sm:rounded-xl overflow-hidden shadow-lg w-full h-full"
                opts={{
                  height: "100%",
                  width: "100%",
                  playerVars: {
                    autoplay: 0,
                    controls: 1,
                    modestbranding: 1,
                    rel: 0,
                    showinfo: 0,
                  },
                }}
              />
            </div>
            <ContentTabs
              chapters={chapters}
              transcript={transcript}
              isLoadingChapters={isLoadingChapters}
              isLoadingTranscript={isLoadingTranscript}
              chaptersError={chaptersError}
              transcriptError={transcriptError}
              onFeedbackSubmit={() => handleFeedbackComplete("submit")}
              onFeedbackSkip={() => handleFeedbackComplete("skip")}
              onFetchTranscript={fetchTranscript}
              onSeekTo={handleSeekTo}
            />
          </div>
          <div
            className={`${
              isLeftColumnVisible ? "xl:col-span-2" : "xl:col-span-5"
            } w-full h-[100vh]`}
          >
            <AITutorPanel
              currentMode={currentMode}
              onModeChange={handleModeChange}
              isLeftColumnVisible={isLeftColumnVisible}
              onToggleFullScreen={handleToggleFullScreen}
              onShare={handleShare}
              components={components}
            />
          </div>
        </main>
      </div>
      <div className="sm:hidden">
        <div className="flex flex-col h-[100vh]">
          <header className="flex flex-row gap-3 justify-between p-4 items-center ">
            <div className="flex-1 min-w-0 overflow-ellipsis">
              <h1 className="text-md text-gray-500 truncate px-14 ">
                {videoDetail?.title || "Video Title Not Available"}
              </h1>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-center">
              {/* Upgrade Button */}

              <style>{`.glow-purple:hover {
                box-shadow: 0 0 10px rgba(168, 85, 247, 0.8), 
                0 0 20px rgba(168, 85, 247, 0.6), 
                0 0 30px rgba(168, 85, 247, 0.4);
              `}</style>
              {window.innerWidth > 640 ? (
                <button
                  onClick={() => {
                    navigateWithProgress(ROUTES.PREMIUM);
                  }}
                  className="flex items-center gap-1 rounded-full py-2 ps-2.5 pe-3 text-sm font-semibold bg-gray-200 hover:bg-[#E4E4F6] dark:bg-[#373669] text-gray hover:text-white dark:hover:bg-[#414071] hover:bg-gradient-to-r from-blue-600 to-purple-700 cursor-pointer glow-purple transition-transform transform hover:scale-105 focus:outline-none"
                >
                  <SparklesIcon />
                  Upgrade plan
                </button>
              ) : (
                <button
                  onClick={() => {
                    navigateWithProgress(ROUTES.PREMIUM);
                  }}
                  className="flex items-center gap-1 rounded-full p-2 text-sm font-semibold bg-gray-200 hover:bg-[#E4E4F6] dark:bg-[#373669] text-gray hover:text-white dark:hover:bg-[#414071] hover:bg-gradient-to-r from-blue-600 to-purple-700 cursor-pointer glow-purple transition-transform transform hover:scale-105 focus:outline-none"
                >
                  <SparklesIcon />
                </button>
              )}
            </div>
          </header>
          <div className={`flex-shrink-0 ${isVideoVisible ? "" : "hidden"}`}>
            {/* YouTube Video Player with Progress Tracking - Mobile */}
            <div className="">
              <YouTube
                videoId={currentVideoId}
                onReady={onYouTubeReady}
                onEnd={onYouTubeEnd}
                onStateChange={onYouTubeStateChange}
                className="aspect-video bg-black overflow-hidden w-full h-full"
                opts={{
                  height: "100%",
                  width: "100%",
                  playerVars: {
                    autoplay: 0,
                    controls: 1,
                    modestbranding: 1,
                    rel: 0,
                    showinfo: 0,
                  },
                }}
              />
            </div>
          </div>
          <div className="p-1">
            <button
              onClick={() => setIsVideoVisible(!isVideoVisible)}
              className="flex w-full items-center justify-center gap-2 px-4 py-2 rounded-lg border-1 text-sm font-medium text-foreground transition-colors"
            >
              {isVideoVisible ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              <span>{isVideoVisible ? "Hide" : "Show"} Video</span>
            </button>
          </div>
          <div className="flex-grow overflow-hidden">
            <AITutorPanel
              currentMode={currentMode}
              onModeChange={handleModeChange}
              isLeftColumnVisible={isLeftColumnVisible}
              onToggleFullScreen={() =>
                setIsLeftColumnVisible(!isLeftColumnVisible)
              }
              onShare={() => setIsShareModalOpen(true)}
              components={components}
            />
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <VideoFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        videoId={currentVideoId}
        videoTitle={videoDetail?.title}
        playPercentage={videoProgress}
        onSubmit={async () => {
          try {
            videoMarkAsSubmitted();
            setIsFeedbackModalOpen(false);
          } catch {
            // Ignore feedback submission errors
          }
        }}
        onSkip={() => setIsFeedbackModalOpen(false)}
        onDismiss={() => setIsFeedbackModalOpen(false)}
        canSubmitFeedback={videoCanSubmitFeedback}
        existingFeedback={videoExistingFeedback}
        markAsSubmitted={videoMarkAsSubmitted}
        componentName="Video"
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={handleCloseShareModal}
        url={`https://www.youtube.com`}
      />

      <style>{`
                  /* Simple toggle switch styles */
                  .toggle-checkbox:checked {
                      right: 0;
                      border-color: ${theme.accent};
                  }
                  .toggle-checkbox:checked + .toggle-label {
                      background-color: ${theme.accent};
                  }
                  /* Custom scrollbar for webkit browsers */
                  ::-webkit-scrollbar {
                      width: 8px;
                      height: 4px;
                  }
                  ::-webkit-scrollbar-track {
                      background: transparent;
                  }
                  ::-webkit-scrollbar-thumb {
                      background: ${theme.divider};
                      border-radius: 10px;
                  }
                  ::-webkit-scrollbar-thumb:hover {
                      background: ${theme.mutedText};
                  }
                  /* For aspect ratio plugin fallback */
                  .aspect-w-16 { position: relative; padding-bottom: 56.25%; }
                  .aspect-h-9 { }
                  .aspect-w-16 > *, .aspect-h-9 > * { position: absolute; height: 100%; width: 100%; top: 0; right: 0; bottom: 0; left: 0; }
              `}</style>
    </div>
  );
};

export default VideoPage;
