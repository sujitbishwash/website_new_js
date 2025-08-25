import VideoFeedbackModal, {
  CondensedFeedback,
  VideoFeedbackPayload,
} from "@/components/feedback/VideoFeedbackModal";
import Chat from "@/components/learning/Chat";
import Flashcards from "@/components/learning/Flashcards";
import Quiz from "@/components/learning/Quiz";
import Summary from "@/components/learning/Summary";
// import { useVideoFeedback } from "@/hooks/useVideoFeedback";
import { ROUTES } from "@/routes/constants";
import { theme } from "@/styles/theme";
import { useFeedbackTracker } from "@/hooks/useFeedbackTracker";
import {
  BookOpen,
  Clipboard,
  Ellipsis,
  Eye,
  EyeOff,
  Facebook,
  FileStack,
  Highlighter,
  Instagram,
  Link,
  Linkedin,
  MessageCircle,
  MessageCircleQuestion,
  MessageSquareText,
  StickyNote,
  Text,
  Type,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { chatApi, videoApi, VideoDetail, ComponentName } from "../../lib/api-client";

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

interface VideoPlayerProps {
  src: string;
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
  videoId?: string;
  videoTitle?: string;
  playPercentage?: number;
  onFeedbackSubmit: (payload: any) => void;
  onFeedbackSkip: () => void;
  onOpenModal: () => void;
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

const XIcon = () => <Icon path="M18 6L6 18 M6 6l12 12" className="w-5 h-5" />;

const MinimizeIcon = () => (
  <Icon
    path="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"
    className="w-5 h-5"
  />
);
const SparklesIcon: React.FC<IconProps> = ({}) => (
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
// --- Video Stats Component ---
interface VideoStatsProps {
  playPercentage: number;
  videoDuration: number;
  currentTime: number;
}

const VideoStats: React.FC<VideoStatsProps> = ({
  playPercentage,
  videoDuration,
  currentTime,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const timeRemaining = videoDuration > 0 ? videoDuration - currentTime : 0;

  return (
    <div className="bg-gray-800 rounded-lg p-3 mb-4">
      <h3 className="text-sm font-semibold text-gray-200 mb-2">Video Progress</h3>
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div>
          <div className="text-gray-400">Play Progress</div>
          <div className="text-white font-medium">{Math.round(playPercentage)}%</div>
        </div>
        <div>
          <div className="text-gray-400">Current Time</div>
          <div className="text-white font-medium">{formatTime(currentTime)}</div>
        </div>
        <div>
          <div className="text-gray-400">Current Time</div>
          <div className="text-white font-medium">{formatTime(currentTime)}</div>
        </div>
        <div>
          <div className="text-gray-400">Time Remaining</div>
          <div className="text-white font-medium">{formatTime(timeRemaining)}</div>
        </div>
        <div>
          <div className="text-gray-400">Total Duration</div>
          <div className="text-white font-medium">{formatTime(videoDuration)}</div>
        </div>
        <div>
          <div className="text-gray-400">Time Remaining</div>
          <div className="text-white font-medium">{formatTime(timeRemaining)}</div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-3">
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Play Progress</span>
            <span>{Math.round(playPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${playPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components for Modularity ---

interface HeaderProps {
  videoDetail: VideoDetail | null;
  isLoading: boolean;
  onToggleVideo: () => void;
  isVideoVisible: boolean;
  onShare: () => void;
  onToggleFullScreen: () => void;
  isLeftColumnVisible: boolean;
  playPercentage: number;
  currentTime: number;
  videoDuration: number;
}

const Header: React.FC<HeaderProps> = ({
  videoDetail,
  isLoading,
  onShare,
  onToggleFullScreen,
  playPercentage,
  currentTime,
  videoDuration,
}) => {
  const navigate = useNavigate();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
        
        {/* Quick Stats */}
        {!isLoading && videoDuration > 0 && (
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
            <span>Progress: {Math.round(playPercentage)}%</span>
            <span>Time: {formatTime(currentTime)} / {formatTime(videoDuration)}</span>
            <span>Remaining: {formatTime(Math.max(0, videoDuration - currentTime))}</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 self-start sm:self-center">
        <button
          onClick={() => {
            navigate(ROUTES.PREMIUM);
          }}
          className="flex items-center gap-1 rounded-full py-2 ps-2.5 pe-3 text-sm font-semibold bg-gray-200 hover:bg-[#E4E4F6] dark:bg-[#373669] text-gray hover:text-white dark:hover:bg-[#414071] hover:bg-gradient-to-r from-blue-600 to-purple-700 cursor-pointer transition-colors glow-purple transition-transform transform hover:scale-105 focus:outline-none"
        >
          <SparklesIcon path="" className="h-5 w-5" />
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

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => (
  <div className="aspect-video bg-black sm:rounded-xl overflow-hidden shadow-lg relative">
    <iframe
      id="yt-player-iframe"
      src={src}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      className="w-full h-full relative z-10"
      loading="lazy"
      style={{
        isolation: 'isolate',
        contain: 'layout style paint'
      }}
    />
  </div>
);

const ContentTabs: React.FC<ContentTabsProps> = ({
  chapters,
  transcript,
  isLoadingChapters,
  isLoadingTranscript,
  chaptersError,
  transcriptError,
  videoId,
  videoTitle,
  playPercentage,
  onFeedbackSubmit,
  onFeedbackSkip,
  onOpenModal,
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
          {/* Condensed Feedback Component */}
          <CondensedFeedback
            videoId={videoId}
            videoTitle={videoTitle}
            playPercentage={playPercentage}
            onFeedbackSubmit={onFeedbackSubmit}
            onFeedbackSkip={onFeedbackSkip}
            onOpenModal={onOpenModal}
          />
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
  videoId: string;
  chatMessages: Array<{ text: string; isUser: boolean }>;
  isChatLoading: boolean;
  chatError: string | null;
  onSendMessage: (message: string) => void;

  onToggleFullScreen: () => void;
  isLeftColumnVisible: boolean;

  onToggleVideo: () => void;
  isVideoVisible: boolean;
  onShare: () => void;
}> = ({
  currentMode,
  onModeChange,
  videoId,
  chatMessages,
  isChatLoading,
  chatError,
  onSendMessage,
  onToggleFullScreen,
  isLeftColumnVisible,
  onToggleVideo,
  isVideoVisible,
  onShare,
}) => {
  const modes: { key: LearningMode; label: string; icon: any }[] = [
    { key: "chat", label: "Chat", icon: <MessageCircle /> },
    { key: "flashcards", label: "Flashcards", icon: <StickyNote /> },
    { key: "quiz", label: "Quiz", icon: <MessageCircleQuestion /> },
    { key: "summary", label: "Summary", icon: <Text /> },
  ];

  const components = {
    chat: (
      <Chat
        videoId={videoId}
        messages={chatMessages}
        isLoading={isChatLoading}
        error={chatError}
        onSendMessage={onSendMessage}
        isLeftColumnVisible={isLeftColumnVisible}
      />
    ),
    flashcards: <Flashcards />,
    quiz: <Quiz />,
    summary: <Summary />,
  };

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
  const [copySuccess, setCopySuccess] = useState("");

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(
      () => {
        setCopySuccess("Copied!");
        setTimeout(() => setCopySuccess(""), 2000);
      },
      () => {
        setCopySuccess("Failed to copy");
        setTimeout(() => setCopySuccess(""), 2000);
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

  // Chat state management
  const [chatMessages, setChatMessages] = useState<
    Array<{ text: string; isUser: boolean }>
  >([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [chatInitialized, setChatInitialized] = useState(false);
  const [showFeedback, setShowFeedback] = useState(true);

  const handleFeedbackSubmit = (payload: VideoFeedbackPayload) => {
    console.log("Feedback Submitted:", payload);
    // In a real app, you might hide the component after a delay
    // setTimeout(() => setShowFeedback(false), 2000);
  };

  const handleFeedbackSkip = () => {
    console.log("Feedback Skipped");
    setShowFeedback(false);
  };

  // Simple feedback state
  const [hasShownFeedback, setHasShownFeedback] = useState(false);

  // Simple feedback state update
  const updateFeedbackState = useCallback(() => {
    setHasShownFeedback(true);
  }, []);
  // Video player ref for tracking progress
  const videoPlayerRef = useRef<HTMLIFrameElement>(null);
  const videoDurationRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);
  const ytPlayerRef = useRef<any>(null);
  const progressIntervalRef = useRef<number | null>(null);

  // Get video ID from URL params or location state
  const currentVideoId = videoId || location.state?.videoId;

  // Local feedback and progress state management
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [playPercentage, setPlayPercentage] = useState(0);

  // Track feedback submissions to prevent duplicates
  const {
    canSubmitFeedback,
    existingFeedback,
    markAsSubmitted,
    _debug,
  } = useFeedbackTracker({
    component: ComponentName.Video,
    sourceId: currentVideoId || "unknown",
    pageUrl: window.location.href,
  });

  // Debug logging for feedback tracker
  useEffect(() => {
    if (_debug) {
      console.log("🔍 Feedback Tracker Debug:", _debug);
    }
  }, [_debug]);

  // Feedback modal functions
  const openFeedbackModal = useCallback(() => {
    // Check if feedback has already been submitted
    if (!canSubmitFeedback) {
      console.log("⚠️ Cannot open feedback modal - feedback already submitted");
      return;
    }

    // Preserve video state before opening modal
    const iframe = document.getElementById("yt-player-iframe") as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      // Store current video state
      localStorage.setItem('video_state_preserved', 'true');
      localStorage.setItem('video_src', iframe.src);
      console.log("💾 Video state preserved before modal open");
    }
    
    setIsFeedbackModalOpen(true);
  }, [canSubmitFeedback]);

  const closeFeedbackModal = useCallback(() => {
    setIsFeedbackModalOpen(false);
    
    // Force video restoration with multiple fallback methods
    setTimeout(() => {
      const iframe = document.getElementById("yt-player-iframe") as HTMLIFrameElement;
      if (iframe) {
        console.log("🔄 Restoring video after modal close...");
        
        // Method 1: Refresh iframe src
        const currentSrc = iframe.src;
        iframe.src = "";
        setTimeout(() => {
          iframe.src = currentSrc;
          console.log("✅ Video iframe refreshed");
        }, 100);
        
        // Method 2: Force iframe reload if Method 1 fails
        setTimeout(() => {
          if (iframe.contentWindow) {
            try {
              iframe.contentWindow.location.reload();
              console.log("✅ Video iframe force reloaded");
            } catch (e) {
              console.log("⚠️ Force reload failed, trying src refresh again");
              iframe.src = currentSrc;
            }
          }
        }, 500);
        
        // Method 3: Recreate iframe if all else fails
        setTimeout(() => {
          if (!iframe.contentWindow || iframe.contentWindow.location.href === 'about:blank') {
            console.log("🔄 Recreating video iframe...");
            const newIframe = iframe.cloneNode(true) as HTMLIFrameElement;
            newIframe.src = currentSrc;
            iframe.parentNode?.replaceChild(newIframe, iframe);
            console.log("✅ Video iframe recreated");
          }
        }, 1000);
      }
    }, 300);
  }, []);

  const submitFeedback = useCallback(async (payload: VideoFeedbackPayload) => {
    console.log("Feedback submitted:", payload);
    
    // Log the feedback data for debugging
    console.log("📊 Feedback Data:", {
      rating: payload.rating,
      video_id: payload.videoId,
      play_percentage: payload.playPercentage,
      comment: payload.comment,
      chips: payload.chips
    });
    
    // Mark feedback as submitted to prevent duplicates
    markAsSubmitted();
    
    // You can add analytics tracking here
    closeFeedbackModal();
  }, [closeFeedbackModal, markAsSubmitted]);

  const skipFeedback = useCallback(() => {
    console.log("Feedback skipped");
    closeFeedbackModal();
  }, [closeFeedbackModal]);



  const updatePlayPercentage = useCallback((percentage: number) => {
    setPlayPercentage(Math.min(100, Math.max(0, percentage)));
  }, []);

  // Reset feedback state when video changes
  useEffect(() => {
    if (currentVideoId) {
      console.log("🎬 Video ID changed:", currentVideoId);
      
      // Reset feedback state for new video
      setHasShownFeedback(false);
      
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

        













  // Start YouTube progress tracking when video loads
  useEffect(() => {
    if (currentVideoId) {
      console.log("🎯 Setting up YouTube progress tracking");
      
      // Load YouTube Iframe API to get precise duration and currentTime
      const setup = async () => {
        try {
          // Inject API if not already loaded
          if (!(window.YT && window.YT.Player)) {
            console.log("📡 Loading YouTube Iframe API...");
            const existing = document.getElementById("youtube-iframe-api");
            if (!existing) {
              const s = document.createElement("script");
              s.id = "youtube-iframe-api";
              s.src = "https://www.youtube.com/iframe_api";
              document.body.appendChild(s);
            }
            
            // Wait for API to load
            await new Promise<void>((resolve) => {
              if (window.YT && window.YT.Player) {
                resolve();
              } else {
                window.onYouTubeIframeAPIReady = () => resolve();
              }
            });
            console.log("✅ YouTube Iframe API loaded");
          }
          
          // Check if iframe exists and is ready
          const iframe = document.getElementById("yt-player-iframe") as HTMLIFrameElement;
          if (!iframe) {
            console.warn("❌ YouTube iframe not found");
            return;
          }
          
          // Wait for iframe to be ready
          if (!iframe.contentWindow) {
            console.log("⏳ Waiting for iframe to be ready...");
            setTimeout(() => setup(), 1000);
            return;
          }
          
          console.log("🎮 Setting up YouTube player...");
          
          // Create a separate player instance that doesn't interfere with the iframe
          const player = new window.YT.Player("yt-player-iframe", {
            events: {
              onReady: (e: any) => {
                console.log("🎯 YouTube player ready");
                const dur = e.target.getDuration?.() || 0;
                if (dur > 0) {
                  videoDurationRef.current = dur;
                  console.log(`⏱️ Video duration: ${dur}s`);
                }
                // Start progress tracking interval
                if (progressIntervalRef.current == null) {
                  console.log("🔄 Starting progress tracking interval");
                  progressIntervalRef.current = window.setInterval(() => {
                    try {
                      const cur = player.getCurrentTime?.() || 0;
                      const d =
                        player.getDuration?.() || videoDurationRef.current || 0;

                      if (d > 0) {
                        videoDurationRef.current = d;
                        currentTimeRef.current = cur;
                        const pct = Math.min(100, (cur / d) * 100);
                        
                        console.log(`📊 Play Progress: ${cur}s/${d}s = ${pct.toFixed(1)}%`);
                        updatePlayPercentage(pct);
                        
                        // Auto-show feedback when video reaches 90%
                        if (pct >= 90 && !hasShownFeedback && canSubmitFeedback) {
                          console.log("🎉 Video reached 90% - showing feedback modal");
                          openFeedbackModal();
                          updateFeedbackState();
                        }
                      }
                    } catch (error) {
                      console.warn("❌ Error getting video progress:", error);
                    }
                  }, 1000);
                }
              },
              onStateChange: (e: any) => {
                if (e?.data === window.YT.PlayerState.ENDED) {
                  console.log("🎬 Video ended - triggering feedback modal");
                  updatePlayPercentage(100);
                  currentTimeRef.current = videoDurationRef.current;
                  
                  if (!hasShownFeedback && canSubmitFeedback) {
                    openFeedbackModal();
                    updateFeedbackState();
                  }
                } else if (e?.data === window.YT.PlayerState.PLAYING) {
                  console.log("▶️ Video started playing");
                } else if (e?.data === window.YT.PlayerState.PAUSED) {
                  console.log("⏸️ Video paused");
                } else if (e?.data === window.YT.PlayerState.BUFFERING) {
                  console.log("🔄 Video buffering");
                } else if (e?.data === window.YT.PlayerState.CUED) {
                  console.log("🎯 Video cued and ready");
                }
              },
            },
          });
          
          ytPlayerRef.current = player;
          console.log("✅ YouTube player initialized successfully");
          
        } catch (error) {
          console.error("❌ Failed to initialize YouTube player:", error);
        }
      };
      
      // Delay setup to ensure iframe is fully loaded
      const setupTimeout = setTimeout(() => {
        setup();
      }, 2000); // Wait 2 seconds for iframe to be ready
      return () => {
        clearTimeout(setupTimeout);
        console.log("🧹 Cleaning up YouTube player");
        if (progressIntervalRef.current != null) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        try {
          ytPlayerRef.current?.destroy?.();
        } catch {}
        ytPlayerRef.current = null;
      };
    }
  }, [
    currentVideoId,
    updatePlayPercentage,
    openFeedbackModal,
    updateFeedbackState,
    hasShownFeedback,
    videoDetail?.title,
  ]);

  // Simple page leave detection
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (playPercentage >= 90 && !isFeedbackModalOpen && canSubmitFeedback) {
        event.preventDefault();
        event.returnValue = "You have watched most of this video. Would you like to provide feedback before leaving?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [playPercentage, isFeedbackModalOpen, canSubmitFeedback]);

  // Auto-restore video when modal closes
  useEffect(() => {
    if (!isFeedbackModalOpen && localStorage.getItem('video_state_preserved') === 'true') {
      console.log("🔄 Auto-restoring video after modal close...");
      
      setTimeout(() => {
        const iframe = document.getElementById("yt-player-iframe") as HTMLIFrameElement;
        if (iframe) {
          const preservedSrc = localStorage.getItem('video_src');
          if (preservedSrc && iframe.src !== preservedSrc) {
            iframe.src = preservedSrc;
            console.log("✅ Video restored from preserved state");
          }
          
          // Clear preserved state
          localStorage.removeItem('video_state_preserved');
          localStorage.removeItem('video_src');
        }
      }, 500);
    }
  }, [isFeedbackModalOpen]);

  // Handle feedback completion
  const handleFeedbackComplete = useCallback(
    (action: "submit" | "skip" | "dismiss") => {
      closeFeedbackModal();
      console.log(`Feedback ${action} for video:`, currentVideoId);
    },
    [closeFeedbackModal, currentVideoId]
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
    setHasShownFeedback(false);
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

  const handleShare = useCallback(() => {
    setIsShareModalOpen(true);
  }, []);

  const handleToggleFullScreen = useCallback(() => {
    setIsLeftColumnVisible(!isLeftColumnVisible);
  }, [isLeftColumnVisible]);

  const handleToggleVideo = useCallback(() => {
    setIsVideoVisible(!isVideoVisible);
  }, [isVideoVisible]);

  const handleCloseShareModal = useCallback(() => {
    setIsShareModalOpen(false);
  }, []);

  const handleModeChange = useCallback((mode: LearningMode) => {
    setCurrentMode(mode);
  }, []);

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
              onToggleVideo={handleToggleVideo}
              isVideoVisible={isVideoVisible}
              onShare={handleShare}
              onToggleFullScreen={handleToggleFullScreen}
              isLeftColumnVisible={isLeftColumnVisible}
              playPercentage={playPercentage}
              currentTime={currentTimeRef.current}
              videoDuration={videoDurationRef.current}
            />
            <div className="video-container">
              <VideoPlayer
                src={`https://www.youtube.com/embed/${currentVideoId}?enablejsapi=1&origin=${window.location.origin}`}
              />
            </div>
            
            {/* Video Progress Stats */}
            <VideoStats
              playPercentage={playPercentage}
              videoDuration={videoDurationRef.current}
              currentTime={currentTimeRef.current}
            />
            
            {/* Feedback Status & Debug Buttons */}
            <div className="mb-4 space-y-3">
              {/* Feedback Status */}
              {!canSubmitFeedback && existingFeedback && (
                <div className="p-3 bg-green-900/20 border border-green-700 rounded-lg">
                  <div className="flex items-center gap-2 text-green-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Feedback Submitted</span>
                  </div>
                  <p className="text-sm text-green-300 mt-1">
                    You rated this video {existingFeedback.rating}/5 stars
                  </p>
                </div>
              )}

              {/* Debug Video Restore Button */}
              {process.env.NODE_ENV === "development" && (
                <div className="p-3 bg-gray-800 rounded-lg space-y-2">
                  <button
                    onClick={() => {
                      const iframe = document.getElementById("yt-player-iframe") as HTMLIFrameElement;
                      if (iframe) {
                        const currentSrc = iframe.src;
                        iframe.src = "";
                        setTimeout(() => {
                          iframe.src = currentSrc;
                          console.log("🔧 Manual video restore triggered");
                        }, 100);
                      }
                    }}
                    className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 w-full"
                  >
                    🔧 Restore Video (Debug)
                  </button>
                  
                  <button
                    onClick={() => {
                      console.log("🔄 Manual feedback check triggered");
                      // Force a feedback check by resetting the hook
                      window.location.reload();
                    }}
                    className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 w-full"
                  >
                    🔄 Refresh Feedback Check (Debug)
                  </button>
                </div>
              )}
            </div>
            
            <ContentTabs
              chapters={chapters}
              transcript={transcript}
              isLoadingChapters={isLoadingChapters}
              isLoadingTranscript={isLoadingTranscript}
              chaptersError={chaptersError}
              transcriptError={transcriptError}
              videoId={currentVideoId}
              videoTitle={videoDetail?.title}
              playPercentage={playPercentage}
              onFeedbackSubmit={submitFeedback}
              onFeedbackSkip={skipFeedback}
              onOpenModal={openFeedbackModal}
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
              videoId={currentVideoId}
              chatMessages={chatMessages}
              isChatLoading={isChatLoading}
              chatError={chatError}
              onSendMessage={handleSendMessage}
              isLeftColumnVisible={isLeftColumnVisible}
              onToggleFullScreen={handleToggleFullScreen}
              onToggleVideo={handleToggleVideo}
              isVideoVisible={isVideoVisible}
              onShare={handleShare}
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
                  <SparklesIcon path="" className="h-5 w-5" />
                  Upgrade plan
                </button>
              ) : (
                <button
                  onClick={() => {
                    navigate(ROUTES.PREMIUM);
                  }}
                  className="flex items-center gap-1 rounded-full p-2 text-sm font-semibold bg-gray-200 hover:bg-[#E4E4F6] dark:bg-[#373669] text-gray hover:text-white dark:hover:bg-[#414071] hover:bg-gradient-to-r from-blue-600 to-purple-700 cursor-pointer glow-purple transition-transform transform hover:scale-105 focus:outline-none"
                >
                  <SparklesIcon path="" className="h-5 w-5" />
                </button>
              )}
            </div>
          </header>
                    <div className="flex-shrink-0">
            <div className="video-container">
              <VideoPlayer
                src={`https://www.youtube.com/embed/${currentVideoId}?enablejsapi=1&origin=${window.location.origin}`}
              />
            </div>
            
            {/* Video Progress Stats - Mobile */}
            <VideoStats
              playPercentage={playPercentage}
              videoDuration={videoDurationRef.current}
              currentTime={currentTimeRef.current}
            />
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
              videoId={currentVideoId}
              chatMessages={chatMessages}
              isChatLoading={isChatLoading}
              chatError={chatError}
              onSendMessage={handleSendMessage}
              isLeftColumnVisible={isLeftColumnVisible}
              onToggleFullScreen={() =>
                setIsLeftColumnVisible(!isLeftColumnVisible)
              }
              onToggleVideo={() => setIsVideoVisible(!isVideoVisible)}
              isVideoVisible={isVideoVisible}
              onShare={() => setIsShareModalOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <VideoFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => handleFeedbackComplete("dismiss")}
        videoId={currentVideoId}
        videoTitle={videoDetail?.title}
        suggestedChips={[]}
        playPercentage={playPercentage}
        onSubmit={async (payload) => {
          try {
            await submitFeedback(payload);
            updateFeedbackState();
            handleFeedbackComplete("submit");
          } catch (error) {
            console.error("Failed to submit feedback:", error);
            // The modal will handle the error display
          }
        }}
        onSkip={() => {
          skipFeedback();
          updateFeedbackState();
          handleFeedbackComplete("skip");
        }}
        onDismiss={() => handleFeedbackComplete("dismiss")}
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
                
                /* Video iframe isolation - prevent modal interference */
                #yt-player-iframe {
                    isolation: isolate !important;
                    contain: layout style paint !important;
                    transform: translateZ(0) !important;
                    backface-visibility: hidden !important;
                    perspective: 1000px !important;
                    will-change: transform !important;
                    position: relative !important;
                    z-index: 1 !important;
                }
                
                /* Ensure video container is completely isolated */
                .video-container {
                    position: relative !important;
                    z-index: 50 !important;
                    isolation: isolate !important;
                    contain: layout style paint !important;
                    transform: translateZ(0) !important;
                    backface-visibility: hidden !important;
                }
                
                /* Prevent modal backdrop from affecting video */
                .modal-backdrop {
                    pointer-events: none !important;
                }
                
                .modal-content {
                    pointer-events: auto !important;
                }
                
                /* Additional video protection with !important */
                .video-container iframe {
                    position: relative !important;
                    z-index: 1 !important;
                    isolation: isolate !important;
                    contain: layout style paint !important;
                    transform: translateZ(0) !important;
                }
                
                /* Force video visibility */
                .video-container {
                    background: black !important;
                    min-height: 400px !important;
                }
                
                /* Ensure iframe is always visible */
                #yt-player-iframe {
                    opacity: 1 !important;
                    visibility: visible !important;
                    display: block !important;
                }
            `}</style>
    </div>
  );
};

export default VideoPage;
