import VideoFeedbackModal, {
  VideoFeedbackPayload,
} from "@/components/feedback/VideoFeedbackModal";
import Chat from "@/components/learning/Chat";
import Flashcards from "@/components/learning/Flashcards";
import Quiz from "@/components/learning/Quiz";
import Summary from "@/components/learning/Summary";
// import { useVideoFeedback } from "@/hooks/useVideoFeedback";
import { ROUTES } from "@/routes/constants";
import { theme } from "@/styles/theme";

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
import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
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
  iframeId: string;
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
  // Optional props to prevent duplicate API calls
  canSubmitFeedback?: boolean;
  existingFeedback?: any;
  markAsSubmitted?: () => void;
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


const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, iframeId }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [iframeCreated, setIframeCreated] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframePreservedRef = useRef<HTMLIFrameElement | null>(null);


  // Debug logging for iframe lifecycle

  // Continuous monitoring of iframe presence

  const handleLoad = () => {
    console.log("✅ Video iframe loaded successfully");
    setIsLoading(false);
    setHasError(false);
    console.log("✅ Video iframe loaded successfully");
    // setIframeCreated(true);
  };

  const handleError = () => {
    console.error("❌ Video iframe failed to load");
    setHasError(true);
    setIsLoading(false);
  };

  return (
    <div className="aspect-video bg-black sm:rounded-xl overflow-hidden shadow-lg relative video-container">
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-20">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p className="text-sm">Loading video...</p>
          </div>
        </div>
      )}   
      
      <iframe
        ref={iframeRef}
        id={iframeId}
        src={src}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full relative z-100"
        loading="eager"
        onLoad={handleLoad}
        // onError={handleError}
      />

    </div>
  );
};

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
  canSubmitFeedback,
  existingFeedback,
  markAsSubmitted,
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
  // Feedback state for each component
  chatFeedbackState?: {
    canSubmitFeedback: boolean;
    existingFeedback: any;
    markAsSubmitted: () => void;
  };
  quizFeedbackState?: {
    canSubmitFeedback: boolean;
    existingFeedback: any;
    markAsSubmitted: () => void;
  };
  summaryFeedbackState?: {
    canSubmitFeedback: boolean;
    existingFeedback: any;
    markAsSubmitted: () => void;
  };
  flashcardFeedbackState?: {
    canSubmitFeedback: boolean;
    existingFeedback: any;
    markAsSubmitted: () => void;
  };
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
  chatFeedbackState,
  quizFeedbackState,
  summaryFeedbackState,
  flashcardFeedbackState,
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
        // Pass feedback state for Chat component
        canSubmitFeedback={chatFeedbackState?.canSubmitFeedback}
        existingFeedback={chatFeedbackState?.existingFeedback}
        markAsSubmitted={chatFeedbackState?.markAsSubmitted}
      />
    ),
    flashcards: (
      <Flashcards 
        // Pass feedback state for Flashcard component
        videoId={videoId}
        canSubmitFeedback={flashcardFeedbackState?.canSubmitFeedback}
        existingFeedback={flashcardFeedbackState?.existingFeedback}
        markAsSubmitted={flashcardFeedbackState?.markAsSubmitted}
      />
    ),
    quiz: (
      <Quiz 
        // Pass feedback state for Quiz component
        videoId={videoId}
        canSubmitFeedback={quizFeedbackState?.canSubmitFeedback}
        existingFeedback={quizFeedbackState?.existingFeedback}
        markAsSubmitted={quizFeedbackState?.markAsSubmitted}
      />
    ),
    summary: (
      <Summary 
        // Pass feedback state for Summary component
        videoId={videoId}
        canSubmitFeedback={summaryFeedbackState?.canSubmitFeedback}
        existingFeedback={summaryFeedbackState?.existingFeedback}
        markAsSubmitted={summaryFeedbackState?.markAsSubmitted}
      />
    ),
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

// Memoize the VideoPlayer component to prevent re-renders from feedback state changes
const MemoizedVideoPlayer = React.memo(VideoPlayer, (prevProps, nextProps) => {
  // Only re-render if the src actually changes
  return prevProps.src === nextProps.src && prevProps.iframeId === nextProps.iframeId;
});

// Stable isolated video that mounts once per videoId
const StableVideo: React.FC<{ videoId: string | null }> = React.memo(
  ({ videoId }) => {
    if (!videoId) {
      return (
        <div className="aspect-video bg-gray-800 flex items-center justify-center">
          <p className="text-white">No video ID available</p>
        </div>
      );
    }
    return (
      <div className="video-container relative">
        <MemoizedVideoPlayer
          key={videoId}
          iframeId={`yt-player-iframe-${videoId}`}
          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`}
        />
      </div>
    );
  },
  (prev, next) => prev.videoId === next.videoId
);

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

  // Track iframe visibility to prevent feedback operations that cause black screen
  const [isIframeVisible, setIsIframeVisible] = useState(true);
  
  // Monitor iframe visibility
  {/*
  useEffect(() => {
    const checkIframeVisibility = () => {
      const iframe = document.getElementById("yt-player-iframe");
      const isVisible = !!iframe && iframe.style.display !== 'none' && iframe.style.visibility !== 'hidden';
      setIsIframeVisible(isVisible);
      
      if (!isVisible) {
        console.log("🚨 Iframe not visible, preventing feedback operations");
      }
    };
    
    // Check every 500ms
    const interval = setInterval(checkIframeVisibility, 500);
    
    return () => clearInterval(interval);
  }, []);

  */}

  // Get video ID from URL params or location state
  const currentVideoId = videoId || location.state?.videoId;

  // Memoize components array to prevent hook recreation
  const feedbackComponents = useMemo(() => [
    ComponentName.Video,
    ComponentName.Chat,
    ComponentName.Quiz,
    ComponentName.Summary,
    ComponentName.Flashcard
  ], []);

  // Get feedback states for all components
  // Simple feedback state management
  const [feedbackStates, setFeedbackStates] = useState<{[key: string]: any}>({});
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  
  const markFeedbackAsSubmitted = useCallback((component: string) => {
    setFeedbackStates(prev => ({
      ...prev,
      [component]: { ...prev[component], canSubmitFeedback: false }
    }));
  }, []);
  
  const resetFeedback = useCallback(() => {
    setFeedbackStates({});
    setFeedbackError(null);
  }, []);

  // Debounce feedback state changes to prevent excessive re-renders
  const [debouncedFeedbackStates, setDebouncedFeedbackStates] = useState(feedbackStates);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFeedbackStates(feedbackStates);
    }, 100); // 100ms debounce
    
    return () => clearTimeout(timer);
  }, [feedbackStates]);

  // Use debounced states to prevent excessive re-renders
  const stableFeedbackStates = useMemo(() => debouncedFeedbackStates, [debouncedFeedbackStates]);

  // Debug video ID
  useEffect(() => {
    console.log("🎬 Video ID Debug:", {
      videoId,
      locationStateVideoId: location.state?.videoId,
      currentVideoId,
      url: window.location.href
    });
  }, [videoId, location.state?.videoId, currentVideoId]);

  // Local feedback and progress state management
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [playPercentage, setPlayPercentage] = useState(0);

  // Use refs for feedback gates to avoid effect dependencies causing teardown
  const videoCanSubmitFeedbackRef = useRef<boolean>(false);
  const hasShownFeedbackRef = useRef<boolean>(false);
  // early ref updates removed; updated later after values are derived

  // Completely disable feedback state updates when video is playing to prevent black screen
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  // Track video play state
  useEffect(() => {
    const iframe = document.getElementById(`yt-player-iframe-${currentVideoId}`) as HTMLIFrameElement;
    if (iframe) {
      const handlePlay = () => setIsVideoPlaying(true);
      const handlePause = () => setIsVideoPlaying(false);
      const handleEnded = () => setIsVideoPlaying(false);
      
      // Listen for YouTube player events
      iframe.addEventListener('load', () => {
        try { /* access check intentionally silent */ } catch {}
      });
      
      return () => {
        iframe.removeEventListener('load', handlePlay);
        iframe.removeEventListener('pause', handlePause);
        iframe.removeEventListener('ended', handleEnded);
      };
    }
  }, [currentVideoId]);

  // Use stable feedback states only when video is not playing
  const finalFeedbackStates = useMemo(() => {
    if (isVideoPlaying) {
      return stableFeedbackStates;
    }
    return feedbackStates;
  }, [isVideoPlaying, stableFeedbackStates, feedbackStates]);

  // Extract individual component states for backward compatibility
  const videoFeedbackState = finalFeedbackStates[ComponentName.Video];
  const chatFeedbackState = finalFeedbackStates[ComponentName.Chat];
  const quizFeedbackState = finalFeedbackStates[ComponentName.Quiz];
  const summaryFeedbackState = finalFeedbackStates[ComponentName.Summary];
  const flashcardFeedbackState = finalFeedbackStates[ComponentName.Flashcard];

  // Improved fallback logic - allow feedback if state is loaded and no existing feedback
  const videoCanSubmitFeedback = videoFeedbackState ? videoFeedbackState.canSubmitFeedback : (isFeedbackLoading ? false : true);
  const videoExistingFeedback = videoFeedbackState?.existingFeedback ?? null;
  const chatCanSubmitFeedback = chatFeedbackState ? chatFeedbackState.canSubmitFeedback : (isFeedbackLoading ? false : true);
  const chatExistingFeedback = chatFeedbackState?.existingFeedback ?? null;
  const quizCanSubmitFeedback = quizFeedbackState ? quizFeedbackState.canSubmitFeedback : (isFeedbackLoading ? false : true);
  const quizExistingFeedback = quizFeedbackState?.existingFeedback ?? null;
  const summaryCanSubmitFeedback = summaryFeedbackState ? summaryFeedbackState.canSubmitFeedback : (isFeedbackLoading ? false : true);
  const summaryExistingFeedback = summaryFeedbackState?.existingFeedback ?? null;
  const flashcardCanSubmitFeedback = flashcardFeedbackState ? flashcardFeedbackState.canSubmitFeedback : (isFeedbackLoading ? false : true);
  const flashcardExistingFeedback = flashcardFeedbackState?.existingFeedback ?? null;

  // Create wrapper functions for markAsSubmitted to maintain backward compatibility
  const videoMarkAsSubmitted = useCallback(() => {
    markFeedbackAsSubmitted(ComponentName.Video);
  }, [markFeedbackAsSubmitted]);

  const chatMarkAsSubmitted = useCallback(() => {
    markFeedbackAsSubmitted(ComponentName.Chat);
  }, [markFeedbackAsSubmitted]);

  const quizMarkAsSubmitted = useCallback(() => {
    markFeedbackAsSubmitted(ComponentName.Quiz);
  }, [markFeedbackAsSubmitted]);

  const summaryMarkAsSubmitted = useCallback(() => {
    markFeedbackAsSubmitted(ComponentName.Summary);
  }, [markFeedbackAsSubmitted]);

  const flashcardMarkAsSubmitted = useCallback(() => {
    markFeedbackAsSubmitted(ComponentName.Flashcard);
  }, [markFeedbackAsSubmitted]);



  // Debug logging for video feedback state
  useEffect(() => {
    console.log("🎬 Video Feedback State Debug:", {
      videoFeedbackState,
      videoCanSubmitFeedback,
      videoExistingFeedback,
      isFeedbackLoading,
      currentVideoId
    });
  }, [videoFeedbackState, videoCanSubmitFeedback, videoExistingFeedback, isFeedbackLoading, currentVideoId]);

  // Feedback modal functions
  const openFeedbackModal = useCallback(() => {
    // Don't open if feedback is still loading
    if (isFeedbackLoading) {
      console.log("⏳ Cannot open feedback modal - feedback still loading");
      return;
    }

    // Don't open if iframe is not visible (prevents black screen)
    if (!isIframeVisible) {
      console.log("🚨 Cannot open feedback modal - iframe not visible, would cause black screen");
      return;
    }

    // Check if feedback has already been submitted
    if (!videoCanSubmitFeedback) {
      console.log("⚠️ Cannot open feedback modal - feedback already submitted");
      return;
    }

    // Check if there's existing feedback
    if (videoExistingFeedback) {
      console.log("⚠️ Cannot open feedback modal - existing feedback found:", videoExistingFeedback);
      return;
    }

    // Don't open if already shown
    if (hasShownFeedback) {
      console.log("🔄 Cannot open feedback modal - already shown");
      return;
    }
    
    console.log("✅ Opening feedback modal");
    setIsFeedbackModalOpen(true);
  }, [videoCanSubmitFeedback, videoExistingFeedback, hasShownFeedback, isFeedbackLoading, isIframeVisible]);

  const closeFeedbackModal = useCallback(() => {
    setIsFeedbackModalOpen(false);
    console.log("🔄 Modal closed - video should be visible");
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
    
    try {
      // Mark feedback as submitted to prevent duplicates
      markFeedbackAsSubmitted(ComponentName.Video);
      
      // You can add analytics tracking here
      console.log("✅ Feedback marked as submitted successfully");
      closeFeedbackModal();
    } catch (error) {
      console.error("❌ Failed to submit feedback:", error);
      // Don't close modal on error, let the modal handle the error display
      throw error;
    }
  }, [closeFeedbackModal, markFeedbackAsSubmitted]);

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
      
      // Reset the feedback tracker to prevent continuous API calls
      resetFeedback();
      
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
  }, [currentVideoId, resetFeedback]);

        













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
          const iframe = document.getElementById(`yt-player-iframe-${currentVideoId}`) as HTMLIFrameElement;
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
          const player = new window.YT.Player(`yt-player-iframe-${currentVideoId}`, {
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
                        
                        // Auto-show feedback when video reaches threshold; use refs to avoid effect rerun
                        if (pct >= 90 && !hasShownFeedbackRef.current && videoCanSubmitFeedbackRef.current) {
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
                  
                  if (!hasShownFeedbackRef.current && videoCanSubmitFeedbackRef.current) {
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
    hasShownFeedbackRef,
    videoDetail?.title,
    videoCanSubmitFeedbackRef,
  ]);

  // Auto-open feedback modal based on conditions
  useEffect(() => {
    // Don't auto-open if feedback is still loading
    if (isFeedbackLoading) {
      return;
    }

    // Don't auto-open if feedback was already submitted
    if (!videoCanSubmitFeedback) {
      return;
    }

    // Don't auto-open if already shown
    if (hasShownFeedback) {
      return;
    }

    // Don't auto-open if there's existing feedback
    if (videoExistingFeedback) {
      return;
    }

    // Auto-open if video is at 90%
    if (playPercentage >= 90) {
      openFeedbackModal();
      updateFeedbackState();
    }
    
    // Auto-open if video ended and feedback can be submitted
    if (playPercentage >= 100) {
      console.log("🎬 Auto-opening feedback modal - video ended");
      openFeedbackModal();
      updateFeedbackState();
    }
  }, [playPercentage, videoCanSubmitFeedback, videoExistingFeedback, hasShownFeedback, isFeedbackLoading, openFeedbackModal, updateFeedbackState]);

  // Auto-open feedback modal when page loads if conditions are met
  useEffect(() => {
    // Don't auto-open if feedback is still loading
    if (isFeedbackLoading) {
      console.log("⏳ Feedback still loading, skipping page load auto-open");
      return;
    }

    // Check if we should auto-open feedback modal on page load
    const shouldAutoOpen = () => {
      // Don't auto-open if feedback already submitted
      if (!videoCanSubmitFeedback) {
        console.log("❌ Feedback already submitted, skipping page load auto-open");
        return false;
      }
      
      // Don't auto-open if already shown
      if (hasShownFeedback) {
        console.log("🔄 Feedback already shown, skipping page load auto-open");
        return false;
      }
      
      // Don't auto-open if there's existing feedback
      if (videoExistingFeedback) {
        console.log("⚠️ Existing feedback found, skipping page load auto-open");
        return false;
      }
      
      // Auto-open if video is at 90% or more
      if (playPercentage >= 90) return true;
      
      // Auto-open if video ended
      if (playPercentage >= 100) return true;
      
      return false;
    };

    if (shouldAutoOpen()) {
      console.log("🚀 Auto-opening feedback modal on page load");
      setTimeout(() => {
        openFeedbackModal();
        updateFeedbackState();
      }, 2000); // Delay to let page load
    }
  }, [videoCanSubmitFeedback, hasShownFeedback, playPercentage, isFeedbackLoading, openFeedbackModal, updateFeedbackState]);

  // Simple page leave detection
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (playPercentage >= 90 && !isFeedbackModalOpen && videoCanSubmitFeedback) {
        event.preventDefault();
        event.returnValue = "You have watched most of this video. Would you like to provide feedback before leaving?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [playPercentage, isFeedbackModalOpen, videoCanSubmitFeedback]);

  // Auto-restore video when modal closes
  useEffect(() => {
    if (!isFeedbackModalOpen) {
      console.log("🔄 Modal closed - video should be visible");
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
        console.log("🎬 Fetching video details for ID:", currentVideoId);

        // Try to get video details from API
        const videoUrl = `https://www.youtube.com/watch?v=${currentVideoId}`;
        console.log("🔗 Video URL:", videoUrl);
        
        const details = await videoApi.getVideoDetail(videoUrl);
        console.log("✅ Video details fetched:", details);
        setVideoDetail(details);
      } catch (err: any) {
        console.error("❌ Failed to fetch video details:", err);
        // Set a fallback video detail to prevent complete failure
        setVideoDetail({
          external_source_id: currentVideoId,
          title: "Video Title Not Available",
          description: "Video description not available",
          tags: [],
          url: `https://www.youtube.com/watch?v=${currentVideoId}`,
          type: "youtube",
          user_code: "",
          topics: [],
          created_at: new Date().toISOString()
        });
      } finally {
        setIsLoadingVideo(false);
      }
    };

    if (currentVideoId) {
      fetchVideoDetails();
    }
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

  // Removed force-visibility loop; rely on proper z-index and isolation
  // Force iframe to be visible and prevent hiding
  {/*}
  useEffect(() => {
    const forceIframeVisibility = () => {
      const iframe = document.getElementById(`yt-player-iframe-${currentVideoId}`) as HTMLIFrameElement;
      if (iframe) {
        // Force iframe to be visible
        iframe.style.display = 'block !important';
        iframe.style.visibility = 'visible !important';
        iframe.style.opacity = '1 !important';
        iframe.style.zIndex = '100 !important';
        iframe.style.position = 'relative !important';
        iframe.style.width = '100% !important';
        iframe.style.height = '100% !important';
        
        // Also force the container to be visible
        const container = iframe.closest('.video-container');
        if (container) {
          (container as HTMLElement).style.display = 'block !important';
          (container as HTMLElement).style.visibility = 'visible !important';
          (container as HTMLElement).style.opacity = '1 !important';
          (container as HTMLElement).style.zIndex = '100 !important';
        }
        
        console.log("🔧 Forcing iframe visibility to prevent black screen");
      }
    };
    
    // Force visibility immediately
    // forceIframeVisibility();
    
    // Also force visibility every 2 seconds as a backup
    // const interval = setInterval(forceIframeVisibility, 2000);
    
    return () => clearInterval(interval);
  }, [currentVideoId]);

  */}

  // Memoize video player to avoid remounts on unrelated state updates
  const videoPlayerElement = useMemo(() => {
    if (!currentVideoId) {
      return (
        <div className="aspect-video bg-gray-800 flex items-center justify-center">
          <p className="text-white">No video ID available</p>
        </div>
      );
    }
    return (
      <MemoizedVideoPlayer
        key={videoId}
        iframeId={`yt-player-iframe-${videoId}`}
        src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`}
      />
    );
  }, [currentVideoId]);

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
            <div className="video-container relative">
              <StableVideo videoId={currentVideoId} />
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
              {!videoCanSubmitFeedback && videoExistingFeedback && (
                <div className="p-3 bg-green-900/20 border border-green-700 rounded-lg">
                  <div className="flex items-center gap-2 text-green-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Feedback Submitted</span>
                  </div>
                  <p className="text-sm text-green-300 mt-1">
                    You rated this video {videoExistingFeedback.rating}/5 stars
                  </p>
                </div>
              )}

              {/* Debug Video Restore Button */}
              {process.env.NODE_ENV === "development" && (
                <div className="p-3 bg-gray-800 rounded-lg space-y-2">
                  <button
                    onClick={() => {
                      const iframe = document.getElementById(`yt-player-iframe-${currentVideoId}`) as HTMLIFrameElement;
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
              canSubmitFeedback={videoCanSubmitFeedback}
              existingFeedback={videoExistingFeedback}
              markAsSubmitted={videoMarkAsSubmitted}
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
              // Pass feedback state for each component
              chatFeedbackState={{
                canSubmitFeedback: chatCanSubmitFeedback,
                existingFeedback: chatExistingFeedback,
                markAsSubmitted: chatMarkAsSubmitted,
              }}
              quizFeedbackState={{
                canSubmitFeedback: quizCanSubmitFeedback,
                existingFeedback: quizExistingFeedback,
                markAsSubmitted: quizMarkAsSubmitted,
              }}
              summaryFeedbackState={{
                canSubmitFeedback: summaryCanSubmitFeedback,
                existingFeedback: summaryExistingFeedback,
                markAsSubmitted: summaryMarkAsSubmitted,
              }}
              flashcardFeedbackState={{
                canSubmitFeedback: flashcardCanSubmitFeedback,
                existingFeedback: flashcardExistingFeedback,
                markAsSubmitted: flashcardMarkAsSubmitted,
              }}
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
              <StableVideo videoId={currentVideoId} />
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
              // Pass feedback state for each component
              chatFeedbackState={{
                canSubmitFeedback: chatCanSubmitFeedback,
                existingFeedback: chatExistingFeedback,
                markAsSubmitted: chatMarkAsSubmitted,
              }}
              quizFeedbackState={{
                canSubmitFeedback: quizCanSubmitFeedback,
                existingFeedback: quizExistingFeedback,
                markAsSubmitted: quizMarkAsSubmitted,
              }}
              summaryFeedbackState={{
                canSubmitFeedback: summaryCanSubmitFeedback,
                existingFeedback: summaryExistingFeedback,
                markAsSubmitted: summaryMarkAsSubmitted,
              }}
              flashcardFeedbackState={{
                canSubmitFeedback: flashcardCanSubmitFeedback,
                existingFeedback: flashcardExistingFeedback,
                markAsSubmitted: flashcardMarkAsSubmitted,
              }}
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
        // Pass feedback tracker state to prevent duplicate API calls
        canSubmitFeedback={videoCanSubmitFeedback}
        existingFeedback={videoExistingFeedback}
        markAsSubmitted={videoMarkAsSubmitted}
        // Pass component name for display
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
                
                /* Video iframe isolation - prevent modal interference */
                #yt-player-iframe {
                    isolation: isolate !important;
                    contain: layout style paint !important;
                    transform: translateZ(0) !important;
                    backface-visibility: hidden !important;
                    perspective: 1000px !important;
                    will-change: transform !important;
                    position: relative !important;
                    z-index: 10 !important;
                    pointer-events: auto !important;
                }
                
                /* Ensure video container is completely isolated */
                .video-container {
                    position: relative !important;
                    z-index: 10 !important;
                    isolation: isolate !important;
                    contain: layout style paint !important;
                    transform: translateZ(0) !important;
                    backface-visibility: hidden !important;
                    pointer-events: auto !important;
                }
                
                /* Prevent modal backdrop from affecting video */
                .feedback-modal-backdrop {
                    pointer-events: none !important;
                    z-index: 5 !important;
                }
                
                .feedback-modal {
                    pointer-events: auto !important;
                    z-index: 50 !important;
                }
                
                /* Ensure video stays above modal */
                .aspect-video {
                    position: relative !important;
                    z-index: 10 !important;
                    isolation: isolate !important;
                    pointer-events: auto !important;
                }
                
                /* Force iframe to stay visible */
                iframe#yt-player-iframe {
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    z-index: 10 !important;
                    position: relative !important;
                    pointer-events: auto !important;
                }
                
                /* Additional video protection with !important */
                .video-container iframe {
                    position: relative !important;
                    z-index: 10 !important;
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
