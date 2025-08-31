import VideoFeedbackModal from "@/components/feedback/VideoFeedbackModal";
  import Chat from "@/components/learning/Chat";
  import Flashcards from "@/components/learning/Flashcards";
  import Quiz from "@/components/learning/Quiz";
  import Summary from "@/components/learning/Summary";
  
  import { ComponentName } from "@/lib/api-client";
  import { ROUTES } from "@/routes/constants";
  import { theme } from "@/styles/theme";
  import {
    BookOpen,
    Clipboard,
    Ellipsis,
    Eye,
    EyeOff,
    Facebook,
    Instagram,
    Linkedin,
    MessageCircle,
    MessageCircleQuestion,
    StickyNote,
    Text,
    Type,
    X,
  } from "lucide-react";
  import { useCallback, useEffect, useRef, useState } from "react";
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { chatApi, videoApi, VideoDetail } from "../../lib/api-client";
import YouTube from "react-youtube";
import { useMultiFeedbackTracker } from "../../hooks/useFeedbackTracker";
  
  declare global {
    interface Window {
      YT: any;
      onYouTubeIframeAPIReady?: () => void;
    }
  }
  
  // Type definitions
  interface IconProps {
    path: string;
    className?: string;
  }
  

  
  interface Chapter {
    time: string;
    title: string;
    content: string;
  }
  
  interface ContentTabsProps {
    chapters: Chapter[];
    transcript: string;
    isLoadingChapters: boolean;
    isLoadingTranscript: boolean;
    chaptersError: string | null;
    transcriptError: string | null;
    onFeedbackSubmit: () => void;
    onFeedbackSkip: () => void;
  }
  
  // Learning mode types
  type LearningMode = "chat" | "flashcards" | "quiz" | "summary";
  
  // --- Icon Components (using inline SVG for portability) ---
  // Note: In a real project, it's better to use a library like lucide-react
  const Icon: React.FC<IconProps> = ({ path, className = "w-6 h-6" }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={path} />
    </svg>
  );
  
  const MinimizeIcon = () => (
    <Icon
      path="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"
      className="w-5 h-5"
    />
  );
  const SparklesIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.665 10C17.665 10.6877 17.1785 11.2454 16.5488 11.3945L16.4219 11.4189C14.7098 11.6665 13.6129 12.1305 12.877 12.8623C12.1414 13.5938 11.6742 14.6843 11.4238 16.3887C11.3197 17.0973 10.7182 17.665 9.96484 17.665C9.27085 17.665 8.68836 17.1772 8.53613 16.5215C8.12392 14.7459 7.6623 13.619 6.95703 12.8652C6.31314 12.1772 5.39414 11.7268 3.88672 11.4688L3.57715 11.4199C2.88869 11.319 2.33496 10.734 2.33496 10C2.33496 9.26603 2.88869 8.681 3.57715 8.58008L3.88672 8.53125C5.39414 8.27321 6.31314 7.82277 6.95703 7.13477C7.6623 6.38104 8.12392 5.25413 8.53613 3.47852L8.56934 3.35742C8.76133 2.76356 9.31424 2.33496 9.96484 2.33496C10.7182 2.33497 11.3197 2.9027 11.4238 3.61133L11.5283 4.22266C11.7954 5.58295 12.2334 6.49773 12.877 7.1377C13.6129 7.86952 14.7098 8.33351 16.4219 8.58105C17.1119 8.68101 17.665 9.26667 17.665 10Z"></path>
    </svg>
  );
  // --- Sub-Components for Modularity ---
  
  interface HeaderProps {
    videoDetail: VideoDetail | null;
    isLoading: boolean;
    onToggleFullScreen: () => void;
  }
  
  const Header: React.FC<HeaderProps> = ({
    videoDetail,
    isLoading,
    onToggleFullScreen,
  }) => {
    const navigate = useNavigate();
  
    return (
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-md text-gray-500 truncate">
            {isLoading ? (
              <div className="h-8 bg-gray-700 rounded w-3/4 animate-pulse"></div>
            ) : (
              videoDetail?.title || "Video Title Not Available"
            )}
          </h1>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => {
              navigate(ROUTES.PREMIUM);
            }}
            className="flex items-center gap-1 rounded-full py-2 ps-2.5 pe-3 text-sm font-semibold bg-gray-200 hover:bg-[#E4E4F6] dark:bg-[#373669] text-gray hover:text-white dark:hover:bg-[#414071] hover:bg-gradient-to-r from-blue-600 to-purple-700 cursor-pointer transition-colors glow-purple transition-transform transform hover:scale-105 focus:outline-none"
          >
            <SparklesIcon />
            <span className="hidden sm:inline">Upgrade plan</span>
            <span className="sm:hidden">Upgrade</span>
          </button>
          <button
            className="p-2 text-muted-foreground hover:bg-foreground/10 rounded-full cursor-pointer"
            onClick={onToggleFullScreen}
          >
            <X />
          </button>
        </div>
      </header>
    );
  };
  

  
  // Memoize the VideoPlayer component to prevent re-renders from feedback state changes

  

  
  const ContentTabs: React.FC<ContentTabsProps> = ({
    chapters,
    transcript,
    isLoadingChapters,
    isLoadingTranscript,
    chaptersError,
    transcriptError,
  }) => {
    const [activeTab, setActiveTab] = useState("chapters");
    return (
      <div className="bg-background text-foreground hidden sm:block">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3">
          <div className="flex items-center border border-border rounded-xl p-1 gap-2">
            <button
              onClick={() => setActiveTab("chapters")}
              className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors  cursor-pointer ${
                activeTab === "chapters"
                  ? "bg-foreground/20 shadow-sm text-foreground"
                  : "text-muted-foreground hover:bg-foreground/10"
              }`}
            >
              <BookOpen /> Chapters
            </button>
            <button
              onClick={() => setActiveTab("transcripts")}
              className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === "transcripts"
                  ? "bg-foreground/20 shadow-sm text-foreground"
                  : "text-muted-foreground hover:bg-foreground/10"
              }`}
            >
              <Type /> Transcripts
            </button>
          </div>
          <div className="flex items-center space-x-2 self-end sm:self-center">
            <label
              htmlFor="auto-scroll"
              className="text-xs sm:text-sm font-medium text-muted-foreground cursor-pointer"
            >
              Auto Scroll
            </label>
            <div className="relative inline-block w-8 sm:w-10 mr-2 align-middle select-none transition duration-200 ease-in">
              <input
                type="checkbox"
                name="auto-scroll"
                id="auto-scroll"
                className="toggle-checkbox absolute block w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-card border-4 border-border appearance-none cursor-pointer"
              />
              <label
                htmlFor="auto-scroll"
                className="toggle-label block overflow-hidden h-5 sm:h-6 rounded-full bg-border-medium cursor-pointer"
              ></label>
            </div>
          </div>
        </div>
        <div className="p-3 sm:p-4 space-y-4 sm:space-y-5 rounded-xl border border-border ">
          {activeTab === "chapters" ? (
            isLoadingChapters ? (
              <div className="text-center py-6 sm:py-8">
                <div className="inline-block animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-blue-400"></div>
                <p className="mt-2 text-xs sm:text-sm text-gray-400">
                  Loading chapters...
                </p>
              </div>
            ) : chaptersError ? (
              <div className="text-center py-6 sm:py-8">
                <p className="text-xs sm:text-sm text-red-400">{chaptersError}</p>
              </div>
            ) : chapters.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <p className="text-xs sm:text-sm text-gray-500">
                  No chapters available
                </p>
              </div>
            ) : (
              chapters.map((chapter, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[auto,1fr] gap-x-2 sm:gap-x-4 group cursor-pointer"
                >
                  <div className="text-xs sm:text-sm font-mono text-gray-500 pt-1">
                    {chapter.time}
                  </div>
                  <div className="border-l-2 border-gray-600 pl-2 sm:pl-4 group-hover:border-blue-500 transition-colors">
                    <h3 className="font-semibold text-foreground text-sm sm:text-base">
                      {chapter.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {chapter.content}
                    </p>
                  </div>
                </div>
              ))
            )
          ) : isLoadingTranscript ? (
            <div className="text-center py-6 sm:py-8">
              <div className="inline-block animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-blue-400"></div>
              <p className="mt-2 text-xs sm:text-sm text-gray-400">
                Loading transcript...
              </p>
            </div>
          ) : transcriptError ? (
            <div className="text-center py-6 sm:py-8">
              <p className="text-xs sm:text-sm text-red-400">{transcriptError}</p>
            </div>
          ) : transcript ? (
            <div className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
              {transcript}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-6 sm:py-8">
              <p className="text-xs sm:text-sm">
                Transcript content would appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };
  
    const AITutorPanel: React.FC<{
    currentMode: LearningMode;
    onModeChange: (mode: LearningMode) => void;
    onToggleFullScreen: () => void;
    isLeftColumnVisible: boolean;
    onShare: () => void;
    // Components to render
    components: {
      chat: React.ReactNode;
      flashcards: React.ReactNode;
      quiz: React.ReactNode;
      summary: React.ReactNode;
    };
  }> = ({
    currentMode,
    onModeChange,
    onToggleFullScreen,
    isLeftColumnVisible,
    onShare,
    components,
  }) => {
    const modes: { key: LearningMode; label: string; icon: any }[] = [
      { key: "chat", label: "Chat", icon: <MessageCircle /> },
      { key: "flashcards", label: "Flashcards", icon: <StickyNote /> },
      { key: "quiz", label: "Quiz", icon: <MessageCircleQuestion /> },
      { key: "summary", label: "Summary", icon: <Text /> },
    ];

    return (
      <div className={`bg-card flex flex-col h-full sm:max-h-[100vh]`}>
        <div className="relative bg-background">
          <div
            className={`flex items-center ${
              isLeftColumnVisible ? "justify-start" : "justify-center gap-2"
            } rounded-lg p-4 w-full overflow-x-auto`}
          >
            {modes.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => onModeChange(key)}
                className={`flex-shrink-0 flex items-center justify-center gap-2 w-auto px-2 ${
                  isLeftColumnVisible ? "sm:px-2" : "sm:px-4"
                } py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                  currentMode === key
                    ? "bg-card text-foreground"
                    : "text-muted-foreground hover:bg-foreground/10"
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </div>
          <div className="flex flex-row items-center absolute top-1/2 -translate-y-1/2 right-2 space-x-2">
            <button
              onClick={onShare}
              title="Share"
              className="p-2 text-foreground hover:bg-foreground/10 rounded-full transition-colors"
            >
              <Ellipsis />
            </button>
  
            <button
              onClick={onToggleFullScreen}
              title={
                isLeftColumnVisible ? "Full Screen Chat" : "Exit Full Screen"
              }
              className={`p-2 text-foreground hover:bg-foreground/10 rounded-full transition-colors ${
                isLeftColumnVisible ? "hidden" : "sm:block"
              }`}
            >
              <MinimizeIcon />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto bg-background">
          {components[currentMode]}
        </div>
      </div>
    );
  };
  
  const ShareModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    url: string;
  }> = ({ isOpen, onClose, url }) => {
  
    if (!isOpen) return null;
  
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };
  
    const copyToClipboard = () => {
      navigator.clipboard.writeText(url).then(
        () => {
          // Copy successful
        },
        () => {
          // Copy failed
        }
      );
    };
  
    return (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-sm animate-fade-in p-4"
        onClick={handleBackdropClick}
      >
        <div className="relative bg-card rounded-xl shadow-lg p-6 w-full max-w-md m-4 border border-border">
          <div className=" flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Share Public Link</h2>
  
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-2 text-foreground rounded-full hover:bg-foreground/10 hover:text-foreground transition-colors z-10 cursor-pointer"
            >
              <X />
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2 bg-background border border-border rounded-lg p-2">
              <input
                type="text"
                readOnly
                value={url}
                className="flex-1 bg-transparent text-muted-foreground focus:outline-none"
              />
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 bg-primary p-2 rounded-md text-sm font-semibold hover:bg-primary/70"
              >
                <Clipboard className="text-white" />
              </button>
            </div>
            <div className="text-center text-muted-foreground text-sm">
              Or share on social media
            </div>
            <div className="flex justify-center gap-4">
              {/* Add your social media icons here */}
              <button className="p-3 border border-border rounded-full hover:bg-blue-300 cursor-pointer">
                <Facebook className="w-6 h-6 text-foreground" />
              </button>
              <button className="p-3 border border-border rounded-full hover:bg-blue-200 cursor-pointer">
                <Linkedin className="w-6 h-6 text-foreground" />
              </button>
              <button className="p-3 border border-border rounded-full hover:bg-pink-200 cursor-pointer">
                <Instagram className="w-6 h-6 text-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
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
    


    // Get video ID from URL params or location state
    const currentVideoId = videoId || location.state?.videoId;



    // Simple feedback state management
      // Use the feedback tracker hook for all components
  const {
    feedbackStates,
    isLoading: isFeedbackLoading,
    error: feedbackError,
    markAsSubmitted
  } = useMultiFeedbackTracker({
    components: [ComponentName.Video, ComponentName.Chat, ComponentName.Quiz, ComponentName.Summary, ComponentName.Flashcard],
    sourceId: currentVideoId || '',
    pageUrl: window.location.href,
    onFeedbackExists: (component, existingFeedback) => {
      console.log(`✅ Found existing feedback for ${component}:`, existingFeedback);
    }
  });
    
    // Create wrapper functions for markAsSubmitted for each component
    const chatMarkAsSubmitted = useCallback(() => {
      markAsSubmitted(ComponentName.Chat);
    }, [markAsSubmitted]);

    const quizMarkAsSubmitted = useCallback(() => {
      markAsSubmitted(ComponentName.Quiz);
    }, [markAsSubmitted]);

    const summaryMarkAsSubmitted = useCallback(() => {
      markAsSubmitted(ComponentName.Summary);
    }, [markAsSubmitted]);

    const flashcardMarkAsSubmitted = useCallback(() => {
      markAsSubmitted(ComponentName.Flashcard);
    }, [markAsSubmitted]);

    // Create wrapper function for markAsSubmitted to maintain backward compatibility
    const videoMarkAsSubmitted = useCallback(() => {
      // Note: Video component is not tracked by the hook, so we'll handle it separately
      console.log("Video feedback submitted");
    }, []);


    // Extract video feedback state
    const videoFeedbackState = feedbackStates[ComponentName.Video];
    const videoCanSubmitFeedback = videoFeedbackState ? videoFeedbackState.canSubmitFeedback : (isFeedbackLoading ? false : true);
    const videoExistingFeedback = videoFeedbackState?.existingFeedback ?? null;

    // Extract feedback states for all components - provide sensible defaults
    const chatFeedbackState = feedbackStates[ComponentName.Chat] || { canSubmitFeedback: true, existingFeedback: null, reason: "" };
    const quizFeedbackState = feedbackStates[ComponentName.Quiz] || { canSubmitFeedback: true, existingFeedback: null, reason: "" };
    const summaryFeedbackState = feedbackStates[ComponentName.Summary] || { canSubmitFeedback: true, existingFeedback: null, reason: "" };
    const flashcardFeedbackState = feedbackStates[ComponentName.Flashcard] || { canSubmitFeedback: true, existingFeedback: null, reason: "" };

    // Debug feedback states (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log("🔍 Feedback States:", {
        chat: chatFeedbackState,
        quiz: quizFeedbackState,
        summary: summaryFeedbackState,
        flashcard: flashcardFeedbackState,
        isLoading: isFeedbackLoading,
        error: feedbackError
      });
    }





    // Components object will be defined after all functions are available

    // Local modal state for feedback
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const openFeedbackModal = useCallback(() => setIsFeedbackModalOpen(true), []);
    const closeFeedbackModal = useCallback(() => setIsFeedbackModalOpen(false), []);
    
    // YouTube player event handlers
    const onYouTubeReady = useCallback((event: any) => {
      const player = event.target;
      console.log("🎯 YouTube player ready!");
      
      // Start progress tracking interval
      const interval = setInterval(() => {
        try {
          const currentTime = player.getCurrentTime();
          const duration = player.getDuration();
          
          if (duration > 0) {
            const progress = (currentTime / duration) * 100;
            setVideoProgress(progress);
            
            // Auto-show feedback when video reaches 90%
            if (progress >= 90 && !hasShownFeedbackRef.current && videoCanSubmitFeedbackRef.current && videoCanSubmitFeedback) {
              openFeedbackModal();
              hasShownFeedbackRef.current = true;
            }
          }
        } catch (error) {
          console.warn("⚠️ Error tracking video progress:", error);
        }
      }, 500); // Update every 500ms for smooth progress
      
      // Store interval reference for cleanup
      progressIntervalRef.current = interval;
    }, [openFeedbackModal]);
    
    const onYouTubeEnd = useCallback(() => {
      setVideoProgress(100);
      
      // Show feedback modal when video ends
      if (!hasShownFeedbackRef.current && videoCanSubmitFeedbackRef.current) {
        openFeedbackModal();
        hasShownFeedbackRef.current = true;
      }
    }, [openFeedbackModal]);
    
    const onYouTubeStateChange = useCallback((event: any) => {
      const playerState = event.data;
      console.log("🔄 YouTube player state changed:", playerState);
      
      // Update playing state
      
      // Handle video end
      if (playerState === 0) { // 0 = ended
        onYouTubeEnd();
      }
    }, [onYouTubeEnd]);

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
          } catch {}
          ytPlayerRef.current = null;
        }
      }
    }, [currentVideoId]);

    // The useMultiFeedbackTracker hook automatically fetches feedback states
    // when currentVideoId changes, so we don't need manual fetching here
  
    // Cleanup progress tracking on unmount
    useEffect(() => {
      return () => {
        if (progressIntervalRef.current != null) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
      };
    }, []);
  
    // Page leaving guard - only trigger when user has watched more than 90%
    useEffect(() => {
      const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        if (
          videoCanSubmitFeedbackRef.current &&
          !videoExistingFeedback &&
          !isFeedbackModalOpen &&
          videoProgress >= 90 // Only prompt if user has watched 90% or more
        ) {
          event.preventDefault();
          event.returnValue =
            "You have watched most of this video. Would you like to provide feedback before leaving?";
  
          // Store state for next visit
          localStorage.setItem(
            `feedback_pending_${currentVideoId}`,
            JSON.stringify({
              timestamp: Date.now(),
              watchPercentage: videoProgress, // Use actual video progress
              videoTitle: videoDetail?.title,
            })
          );
        }
      };
  
      const handlePopState = (event: PopStateEvent) => {
        if (
          videoCanSubmitFeedbackRef.current &&
          !videoExistingFeedback &&
          !isFeedbackModalOpen &&
          videoProgress >= 90 // Only prompt if user has watched 90% or more
        ) {
          // Show feedback modal before navigation
          openFeedbackModal();
  
          // Prevent immediate navigation
          event.preventDefault();
  
          // Store navigation intent
          localStorage.setItem(
            `navigation_pending_${currentVideoId}`,
            JSON.stringify({
              timestamp: Date.now(),
              intendedPath: window.location.pathname,
              intendedHref: window.location.href,
            })
          );
        }
      };
  
      // Listen for navigation attempts
      window.addEventListener("beforeunload", handleBeforeUnload);
      window.addEventListener("popstate", handlePopState);
  
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        window.removeEventListener("popstate", handlePopState);
      };
    }, [
      videoCanSubmitFeedbackRef.current,
      videoExistingFeedback,
      isFeedbackModalOpen,
      currentVideoId,
      videoDetail?.title,
      openFeedbackModal,
    ]);
  
    // Handle feedback completion and navigation
    const handleFeedbackComplete = useCallback(
      (action: "submit" | "skip" | "dismiss") => {
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
              navigate(data.intendedPath);
            }
          } catch (error) {
            console.error("Failed to parse pending navigation:", error);
          }
        }
  
        // Clear any pending feedback state
        localStorage.removeItem(`feedback_pending_${currentVideoId}`);
  
        // Log feedback action for analytics
        console.log(`Feedback ${action} for video:`, currentVideoId);
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
          console.error("Failed to fetch video details:", err);
        } finally {
          setIsLoadingVideo(false);
        }
      };
  
      fetchVideoDetails();
    }, [currentVideoId]);
  
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
          console.error("Failed to fetch chapters:", err);
          setChaptersError("Failed to load chapters. Please try again.");
        } finally {
          setIsLoadingChapters(false);
        }
      };
  
      fetchChapters();
    }, [videoDetail?.external_source_id]);
  
    // Fetch transcript
    useEffect(() => {
      const fetchTranscript = async () => {
        if (!videoDetail?.external_source_id) return;
  
        try {
          setIsLoadingTranscript(true);
          setTranscriptError(null);
  
          const response = await videoApi.getVideoTranscript(
            videoDetail.external_source_id
          );
          setTranscript(response.transcript);
        } catch (err: any) {
          console.error("Failed to fetch transcript:", err);
          setTranscriptError("Failed to load transcript. Please try again.");
        } finally {
          setIsLoadingTranscript(false);
        }
      };
  
      fetchTranscript();
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
  
      // Reset feedback state when video changes
      // setFeedbackState({ // This line was removed as per the edit hint
      //   hasShownFeedback: false,
      //   lastFeedbackTime: null,
      //   feedbackCount: 0,
      // });
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
            console.error("Failed to start chat:", startErr);
            setChatError("Failed to start new chat.");
          }
        }
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
        setChatError("Failed to load chat history. Starting new chat.");
  
        // Try to start a new chat if history fails
        try {
          const startResponse = await chatApi.startChat(currentVideoId);
          setChatMessages([{ text: startResponse.content, isUser: false }]);
        } catch (startErr) {
          console.error("Failed to start chat:", startErr);
          setChatError("Failed to start new chat.");
        }
      } finally {
        setIsChatLoading(false);
        setChatInitialized(true);
      }
    };
  
    const handleSendMessage = useCallback(
      async (message: string) => {
        if (!message.trim() || !currentVideoId) return;
  
        // Add user message immediately
        const userMessage = { text: message, isUser: true };
        setChatMessages((prev) => [...prev, userMessage]);
  
        setIsChatLoading(true);
        setChatError(null);
  
        try {
          const response = await chatApi.sendMessage(currentVideoId, message);
          const assistantMessage = { text: response.content, isUser: false };
          setChatMessages((prev) => [...prev, assistantMessage]);
        } catch (err) {
          console.error("Failed to send message:", err);
          setChatError("Failed to send message. Please try again.");
          // Remove the user message if sending failed
          setChatMessages((prev) => prev.slice(0, -1));
        } finally {
          setIsChatLoading(false);
        }
      },
      [currentVideoId]
    );

    // Components object - defined after all functions are available
    const components = {
      chat: (
        <Chat
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
        <Flashcards 
          videoId={currentVideoId || ""}
          canSubmitFeedback={flashcardFeedbackState?.canSubmitFeedback}
          existingFeedback={flashcardFeedbackState?.existingFeedback}
          markAsSubmitted={flashcardMarkAsSubmitted}
        />
      ),
      quiz: (
        <Quiz 
          videoId={currentVideoId || ""}
          canSubmitFeedback={quizFeedbackState?.canSubmitFeedback}
          existingFeedback={quizFeedbackState?.existingFeedback}
          markAsSubmitted={quizMarkAsSubmitted}
        />
      ),
      summary: (
        <Summary 
          videoId={currentVideoId || ""}
          canSubmitFeedback={summaryFeedbackState?.canSubmitFeedback}
          existingFeedback={summaryFeedbackState?.existingFeedback}
          markAsSubmitted={summaryMarkAsSubmitted}
        />
      ),
    };
  
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
        } catch (error) {
          console.warn("Error getting video progress on interaction:", error);
        }
      }
    }, [
      // updateWatchPercentage, // This function is no longer available
      // shouldShowFeedbackOnLeave, // This variable is no longer available
      openFeedbackModal,
      // updateFeedbackState, // This function is no longer available
      // feedbackState.hasShownFeedback, // This variable is no longer available
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
                    height: '100%',
                    width: '100%',
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
            <header className="flex flex-row mb-2 gap-3 justify-between p-4 items-center ">
              <div className="flex-1 min-w-0 overflow-ellipsis">
                <h1 className="text-md text-gray-500 truncate px-14 ">
                  ( videoDetail?.title || "Video Title Not Available" )
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
                      navigate(ROUTES.PREMIUM);
                    }}
                    className="flex items-center gap-1 rounded-full py-2 ps-2.5 pe-3 text-sm font-semibold bg-gray-200 hover:bg-[#E4E4F6] dark:bg-[#373669] text-gray hover:text-white dark:hover:bg-[#414071] hover:bg-gradient-to-r from-blue-600 to-purple-700 cursor-pointer glow-purple transition-transform transform hover:scale-105 focus:outline-none"
                  >
                    <SparklesIcon />
                    Upgrade plan
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      navigate(ROUTES.PREMIUM);
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
              <div className="mb-4">
                <YouTube
                  videoId={currentVideoId}
                  onReady={onYouTubeReady}
                  onEnd={onYouTubeEnd}
                  onStateChange={onYouTubeStateChange}
                  className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg w-full h-full"
                  opts={{
                    height: '100%',
                    width: '100%',
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
  
            {isLeftColumnVisible ? (
              <div className="sm:hidden mb-3">
                <button
                  onClick={() => setIsVideoVisible(!isVideoVisible)}
                  className="flex w-full items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-800 text-white hover:bg-gray-700 transition-colors shadow-sm"
                >
                  {isVideoVisible ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                  <span>{isVideoVisible ? "Hide" : "Show"} Video</span>
                </button>
              </div>
            ) : null}
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
            suggestedChips={[]}
            playPercentage={videoProgress}
            onSubmit={async () => {
            try {
              videoMarkAsSubmitted();
              setIsFeedbackModalOpen(false);
            } catch {}
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
  
        {/* Debug/Test Controls - Remove in production */}
        {/**process.env.NODE_ENV === "development" && (
          <div className="fixed bottom-4 right-4 z-50 space-y-2">
            <button
              onClick={handleManualFeedbackTrigger}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              Test Feedback
            </button>
            <div className="px-4 py-2 bg-gray-800 text-white rounded-lg text-xs">
              Watch: {Math.round(watchPercentage)}%
            </div>
            <div className="px-4 py-2 bg-gray-800 text-white rounded-lg text-xs">
              Duration: {videoDurationRef.current}s
            </div>
            <div className="px-4 py-2 bg-gray-800 text-white rounded-lg text-xs">
              Session: {sessionStartTime ? Math.floor((Date.now() - sessionStartTime.getTime()) / 1000) : 0}s
            </div>
            <div className="px-4 py-2 bg-gray-800 text-white rounded-lg text-xs">
              Feedback: {feedbackState.hasShownFeedback ? 'Shown' : 'Not shown'}
            </div>
            <button
              onClick={() => handleSetVideoDuration(300)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
            >
              Set Duration (300s)
            </button>
            <button
              onClick={() => handleSetProgress(95)}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700"
            >
              Set Progress (95%)
            </button>
          </div>
        )*/}
  
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
  