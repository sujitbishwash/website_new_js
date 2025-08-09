import Chat from "@/components/learning/Chat";
import Flashcards from "@/components/learning/Flashcards";
import Quiz from "@/components/learning/Quiz";
import Summary from "@/components/learning/Summary";
import { theme } from "@/styles/theme";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { chatApi, videoApi, VideoDetail } from "../../lib/api-client";

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

const ShareIcon: React.FC = () => (
  <Icon
    path="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8 M16 6l-4-4-4 4 M12 2v14"
    className="w-5 h-5"
  />
);

// --- Sub-Components for Modularity ---

interface HeaderProps {
  videoDetail: VideoDetail | null;
  isLoading: boolean;
}

const Header: React.FC<HeaderProps> = ({ videoDetail, isLoading }) => (
  <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
    <div className="flex-1 min-w-0">
      <p className="text-sm text-gray-500 truncate">
        {isLoading
          ? "Loading..."
          : videoDetail?.title || "Video Title Not Available"}
      </p>
    </div>
    <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto flex-shrink-0">
      <button className="flex-grow sm:flex-grow-0 bg-green-100 text-green-700 font-semibold px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm hover:bg-green-200 transition-colors">
        Upgrade
      </button>
      <div className="hidden md:flex items-center space-x-2">
        <span className="text-sm font-medium whitespace-nowrap">
          Complete Profile 60%
        </span>
        <div className="w-24 bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full"
            style={{ width: "60%" }}
          ></div>
        </div>
      </div>
      <button className="flex items-center space-x-2 text-gray-600 font-medium px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm hover:bg-gray-100 transition-colors">
        <ShareIcon />
        <span className="hidden sm:inline">Share</span>
      </button>
    </div>
  </header>
);

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => (
  <div className="aspect-w-16 aspect-h-9 bg-black rounded-xl overflow-hidden shadow-lg mb-4">
    <iframe
      src={src}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="w-full h-full rounded-xl"
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
    <div className="bg-white rounded-xl border border-gray-200 p-1">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-3 sm:px-4 pt-3 pb-2 gap-2">
        <div className="flex items-center border border-gray-200 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("chapters")}
            className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-colors ${
              activeTab === "chapters"
                ? "bg-white shadow-sm text-gray-800"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            Chapters
          </button>
          <button
            onClick={() => setActiveTab("transcripts")}
            className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-colors ${
              activeTab === "transcripts"
                ? "bg-white shadow-sm text-gray-800"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            Transcripts
          </button>
        </div>
        <div className="flex items-center space-x-2 self-end sm:self-center">
          <label
            htmlFor="auto-scroll"
            className="text-xs sm:text-sm font-medium text-gray-600 cursor-pointer"
          >
            Auto Scroll
          </label>
          <div className="relative inline-block w-8 sm:w-10 mr-2 align-middle select-none transition duration-200 ease-in">
            <input
              type="checkbox"
              name="auto-scroll"
              id="auto-scroll"
              className="toggle-checkbox absolute block w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
            />
            <label
              htmlFor="auto-scroll"
              className="toggle-label block overflow-hidden h-5 sm:h-6 rounded-full bg-gray-300 cursor-pointer"
            ></label>
          </div>
        </div>
      </div>
      <div className="p-3 sm:p-4 space-y-4 sm:space-y-5 max-h-[250px] sm:max-h-[300px] overflow-y-auto">
        {activeTab === "chapters" ? (
          isLoadingChapters ? (
            <div className="text-center py-6 sm:py-8">
              <div className="inline-block animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-xs sm:text-sm text-gray-500">
                Loading chapters...
              </p>
            </div>
          ) : chaptersError ? (
            <div className="text-center py-6 sm:py-8">
              <p className="text-xs sm:text-sm text-red-500">{chaptersError}</p>
            </div>
          ) : chapters.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <p className="text-xs sm:text-sm text-gray-500">
                No chapters available
              </p>
            </div>
          ) : (
            chapters.map((chapter: Chapter, index: number) => (
              <div
                key={index}
                className="grid grid-cols-[auto,1fr] gap-x-2 sm:gap-x-4 group cursor-pointer"
              >
                <div className="text-xs sm:text-sm font-mono text-gray-500 pt-1">
                  {chapter.time}
                </div>
                <div className="border-l-2 border-gray-200 pl-2 sm:pl-4 group-hover:border-blue-500 transition-colors">
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                    {chapter.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {chapter.content}
                  </p>
                </div>
              </div>
            ))
          )
        ) : isLoadingTranscript ? (
          <div className="text-center py-6 sm:py-8">
            <div className="inline-block animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-xs sm:text-sm text-gray-500">
              Loading transcript...
            </p>
          </div>
        ) : transcriptError ? (
          <div className="text-center py-6 sm:py-8">
            <p className="text-xs sm:text-sm text-red-500">{transcriptError}</p>
          </div>
        ) : transcript ? (
          <div className="text-xs sm:text-sm text-gray-700 leading-relaxed">
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
}> = ({
  currentMode,
  onModeChange,
  videoId,
  chatMessages,
  isChatLoading,
  chatError,
  onSendMessage,
}) => {
  const modes: { key: LearningMode; label: string }[] = [
    { key: "chat", label: "Chat" },
    { key: "flashcards", label: "Flashcards" },
    { key: "quiz", label: "Quiz" },
    { key: "summary", label: "Summary" },
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
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col h-full max-h-[90vh]">
      {/* Mode Selector */}
      <div className="flex justify-center mb-4 space-x-2 flex-shrink-0">
        {modes.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onModeChange(key)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentMode === key
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Component Container */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {components[currentMode]}
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

  const [chaptersError, setChaptersError] = useState<string | null>(null);
  const [transcriptError, setTranscriptError] = useState<string | null>(null);

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
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
        <Header videoDetail={videoDetail} isLoading={isLoadingVideo} />
        <main className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
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
          <div className="xl:col-span-1">
            <AITutorPanel
              currentMode={currentMode}
              onModeChange={handleModeChange}
              videoId={currentVideoId}
              chatMessages={chatMessages}
              isChatLoading={isChatLoading}
              chatError={chatError}
              onSendMessage={handleSendMessage}
            />
          </div>
        </main>
      </div>
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
