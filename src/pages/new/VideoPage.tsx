import Chat from "@/components/learning/Chat";
import Flashcards from "@/components/learning/Flashcards";
import Quiz from "@/components/learning/Quiz";
import Summary from "@/components/learning/Summary";
import { theme } from "@/styles/theme";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { chatApi, videoApi, VideoDetail } from "../../lib/api-client";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/constants";
import { Eye, EyeOff, Facebook, Instagram, Link } from "lucide-react";

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

const ShareIcon = () => (
  <Icon
    path="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8 M16 6l-4-4-4 4 M12 2v14"
    className="w-5 h-5"
  />
);
const VideoOnIcon = () => (
  <Icon
    path="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
    className="w-5 h-5"
  />
);
const VideoOffIcon = () => (
  <Icon
    path="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24 M1 1l22 22"
    className="w-5 h-5"
  />
);
const ChaptersIcon = () => (
  <Icon
    path="M2 6s1.5-2 5-2 5 2 5 2v14s-1.5-1-5-1-5 1-5 1V6z M22 6s-1.5-2-5-2-5 2-5 2v14s1.5-1 5-1 5 1 5 1V6z"
    className="w-5 h-5"
  />
);
const TranscriptIcon = () => (
  <Icon
    path="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"
    className="w-5 h-5"
  />
);
const ChatIcon = () => (
  <Icon
    path="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
    className="w-5 h-5"
  />
);
const FlashcardsIcon = () => (
  <Icon
    path="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 17h-6a4 4 0 0 0-4-4V3a3 3 0 0 1 3-3h7z"
    className="w-5 h-5"
  />
);
const QuizIcon = () => (
  <Icon
    path="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
    className="w-5 h-5"
  />
);
const SummaryIcon = () => (
  <Icon
    path="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z M13 2v7h7"
    className="w-5 h-5"
  />
);
const CopyIcon = () => (
  <Icon
    path="M9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3H14C15.6569 3 17 4.34315 17 6V15C17 16.6569 15.6569 18 14 18H7C5.34315 18 4 16.6569 4 15V9C4 8.73478 4.10536 8.48043 4.29289 8.29289L9.29289 3.29289ZM14 5H11V9C11 9.55228 10.5523 10 10 10H6V15C6 15.5523 6.44772 16 7 16H14C14.5523 16 15 15.5523 15 15V6C15 5.44772 14.5523 5 14 5ZM7.41421 8H9V6.41421L7.41421 8ZM19 5C19.5523 5 20 5.44772 20 6V18C20 19.6569 18.6569 21 17 21H7C6.44772 21 6 20.5523 6 20C6 19.4477 6.44772 19 7 19H17C17.5523 19 18 18.5523 18 18V6C18 5.44772 18.4477 5 19 5Z"
    className="w-5 h-5"
  />
);
const XIcon = () => <Icon path="M18 6L6 18 M6 6l12 12" className="w-5 h-5" />;

const MaximizeIcon = () => (
  <Icon
    path="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"
    className="w-5 h-5"
  />
);
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
// --- Sub-Components for Modularity ---

interface HeaderProps {
  videoDetail: VideoDetail | null;
  isLoading: boolean;
  onToggleVideo: () => void;
  isVideoVisible: boolean;
  onShare: () => void;
  onToggleFullScreen: () => void;
  isLeftColumnVisible: boolean;
}

const Header: React.FC<HeaderProps> = ({ videoDetail, isLoading, onShare }) => {
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
          onClick={onShare}
          title="Share"
          className={`p-2 text-gray-300 hover:bg-gray-700 rounded-full transition-colors`}
        >
          <ShareIcon />
        </button>
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
          onClick={() => {
            navigate(ROUTES.PREMIUM);
          }}
          className="flex items-center gap-1.5 rounded-full py-2 ps-2.5 pe-3.5 text-sm font-semibold bg-gray-200 dark:bg-[#373669] text-gray-800 dark:text-gray-100 hover:bg-gradient-to-r from-blue-600 to-purple-700 hover:text-white transition-all transform hover:scale-105 focus:outline-none glow-on-hover"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            {" "}
            <path d="M17.665 10C17.665 10.6877 17.1785 11.2454 16.5488 11.3945L16.4219 11.4189C14.7098 11.6665 13.6129 12.1305 12.877 12.8623C12.1414 13.5938 11.6742 14.6843 11.4238 16.3887C11.3197 17.0973 10.7182 17.665 9.96484 17.665C9.27085 17.665 8.68836 17.1772 8.53613 16.5215C8.12392 14.7459 7.6623 13.619 6.95703 12.8652C6.31314 12.1772 5.39414 11.7268 3.88672 11.4688L3.57715 11.4199C2.88869 11.319 2.33496 10.734 2.33496 10C2.33496 9.26603 2.88869 8.681 3.57715 8.58008L3.88672 8.53125C5.39414 8.27321 6.31314 7.82277 6.95703 7.13477C7.6623 6.38104 8.12392 5.25413 8.53613 3.47852L8.56934 3.35742C8.76133 2.76356 9.31424 2.33496 9.96484 2.33496C10.7182 2.33497 11.3197 2.9027 11.4238 3.61133L11.5283 4.22266C11.7954 5.58295 12.2334 6.49773 12.877 7.1377C13.6129 7.86952 14.7098 8.33351 16.4219 8.58105C17.1119 8.68101 17.665 9.26667 17.665 10Z"></path>{" "}
          </svg>
          <span className="hidden sm:inline">Upgrade plan</span>
          <span className="sm:hidden">Upgrade</span>
        </button>
      </div>
    </header>
  );
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => (
  <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg mb-4">
    <iframe
      src={src}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="w-full h-full"
    ></iframe>
  </div>
);

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
    <div className="bg-background text-foreground rounded-xl border border-gray-700 p-1 hidden sm:block">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-3 sm:px-4 pt-3 pb-2 gap-2">
        <div className="flex items-center border border-gray-700 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("chapters")}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-colors ${
              activeTab === "chapters"
                ? "bg-gray-900 shadow-sm text-gray-100"
                : "text-gray-400 hover:bg-gray-700"
            }`}
          >
            <ChaptersIcon /> Chapters
          </button>
          <button
            onClick={() => setActiveTab("transcripts")}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-colors ${
              activeTab === "transcripts"
                ? "bg-gray-900 shadow-sm text-gray-100"
                : "text-gray-400 hover:bg-gray-700"
            }`}
          >
            <TranscriptIcon /> Transcripts
          </button>
        </div>
        <div className="flex items-center space-x-2 self-end sm:self-center">
          <label
            htmlFor="auto-scroll"
            className="text-xs sm:text-sm font-medium text-gray-400 cursor-pointer"
          >
            Auto Scroll
          </label>
          <div className="relative inline-block w-8 sm:w-10 mr-2 align-middle select-none transition duration-200 ease-in">
            <input
              type="checkbox"
              name="auto-scroll"
              id="auto-scroll"
              className="toggle-checkbox absolute block w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-gray-800 border-4 border-gray-600 appearance-none cursor-pointer"
            />
            <label
              htmlFor="auto-scroll"
              className="toggle-label block overflow-hidden h-5 sm:h-6 rounded-full bg-gray-600 cursor-pointer"
            ></label>
          </div>
        </div>
      </div>
      <div className="p-3 sm:p-4 space-y-4 sm:space-y-5 max-h-[250px] sm:max-h-[100px] overflow-y-auto">
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
                  <h3 className="font-semibold text-gray-200 text-sm sm:text-base">
                    {chapter.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
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
    { key: "chat", label: "Chat", icon: <ChatIcon /> },
    { key: "flashcards", label: "Flashcards", icon: <FlashcardsIcon /> },
    { key: "quiz", label: "Quiz", icon: <QuizIcon /> },
    { key: "summary", label: "Summary", icon: <SummaryIcon /> },
  ];

  const components = {
    chat: (
      <Chat
        videoId={videoId}
        messages={chatMessages}
        isLoading={isChatLoading}
        error={chatError}
        onSendMessage={onSendMessage}
      />
    ),
    flashcards: <Flashcards />,
    quiz: <Quiz />,
    summary: <Summary />,
  };

  return (
    <div
      className={`rounded-xl border border-gray-700 bg-card flex flex-col h-full
    max-h-[calc(100vh-450px)]   // mobile default
    sm:max-h-[93vh]             // for >=640px screens
  `}
    >
      <div className="relative border-b border-gray-700 rounded-t-xl p-2">
        <div
          className={`flex items-center  ${
            isLeftColumnVisible ? "justify-between" : "justify-center"
          } rounded-lg p-2 w-full overflow-x-auto pb-2 custom-scrollbar pr-12`}
        >
          {modes.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => onModeChange(key)}
              className={`flex-shrink-0 flex items-center justify-center gap-2 w-auto px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-colors ${
                currentMode === key
                  ? "bg-background shadow-sm text-gray-100"
                  : "text-gray-400 hover:bg-gray-700"
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-2 hidden sm:block">
          <button
            onClick={onToggleFullScreen}
            title={
              isLeftColumnVisible ? "Full Screen Chat" : "Exit Full Screen"
            }
            className="p-2 text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
          >
            {isLeftColumnVisible ? <MaximizeIcon /> : <MinimizeIcon />}
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden min-h-0 rounded-b-xl">
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
      className="fixed inset-0 z-[9999] flex items-center justify-center text-foreground bg-black/20 backdrop-blur-sm animate-fade-in p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-card rounded-xl shadow-lg p-6 w-full max-w-md m-4 border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Share Public Link</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-700"
          >
            <XIcon />
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-2 bg-background border border-gray-700 rounded-lg p-2">
            <input
              type="text"
              readOnly
              value={url}
              className="flex-1 bg-transparent text-gray-300 focus:outline-none"
            />
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 bg-blue-600 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-blue-700"
            >
              <Link /> {copySuccess || "Copy"}
            </button>
          </div>
          <div className="text-center text-gray-400 text-sm">
            Or share on social media
          </div>
          <div className="flex justify-center gap-4">
            {/* Add your social media icons here */}
            <button className="p-3 bg-gray-700 rounded-full hover:bg-gray-600">
              <Facebook className="w-6 h-6" />
            </button>
            <button className="p-3 bg-gray-700 rounded-full hover:bg-gray-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.223.085c.645 1.956 2.52 3.375 4.738 3.414A9.87 9.87 0 010 17.54a13.94 13.94 0 007.548 2.212c9.142 0 14.307-7.477 14.307-14.055 0-.213-.005-.426-.015-.637.96-.695 1.795-1.56 2.457-2.54z" />
              </svg>
            </button>
            <button className="p-3 bg-gray-700 rounded-full hover:bg-gray-600">
              <Instagram className="w-6 h-6" />
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

  // Get video ID from URL params or location state
  const currentVideoId = videoId || location.state?.videoId;

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

  const handleSendMessage = async (message: string) => {
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
  };

  const handleModeChange = (mode: LearningMode) => {
    setCurrentMode(mode);
  };

  return (
    <div className="bg-background text-foreground min-h-screen font-sans text-gray-200">
      <div className="container mx-auto sm:px-4 lg:px-6 sm:py-6">
        <main className="grid grid-cols-1 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
          <div
            className={`xl:col-span-3 space-y-4 sm:space-y-6 ${
              isLeftColumnVisible ? "" : "hidden"
            }`}
          >
            <Header
              videoDetail={videoDetail}
              isLoading={isLoadingVideo}
              onToggleVideo={() => setIsVideoVisible(!isVideoVisible)}
              isVideoVisible={isVideoVisible}
              onShare={() => setIsShareModalOpen(true)}
              onToggleFullScreen={() =>
                setIsLeftColumnVisible(!isLeftColumnVisible)
              }
              isLeftColumnVisible={isLeftColumnVisible}
            />
            {isVideoVisible && (
              <div>
                <VideoPlayer
                  src={`https://www.youtube.com/embed/${currentVideoId}`}
                />
                <ContentTabs
                  chapters={chapters}
                  transcript={transcript}
                  isLoadingChapters={isLoadingChapters}
                  isLoadingTranscript={isLoadingTranscript}
                  chaptersError={chaptersError}
                  transcriptError={transcriptError}
                />
              </div>
            )}
          </div>
          <div
            className={`${
              isLeftColumnVisible ? "xl:col-span-2" : "xl:col-span-5"
            }`}
          >
            {" "}
            {isLeftColumnVisible ? (
              <div className="sm:hidden mb-4">
                <button
                  onClick={() => setIsVideoVisible(!isVideoVisible)}
                  className="flex w-full items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-800 text-white hover:bg-gray-700 transition-colors shadow-sm"
                >
                  {isVideoVisible ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                  <span>{isVideoVisible ? "Hide" : "Show"} Video Player</span>
                </button>
              </div>
            ) : null}
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
        </main>
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
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
