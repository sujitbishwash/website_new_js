import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import VideoFeedbackModal from "@/components/feedback/VideoFeedbackModal";
import Chat from "@/components/learning/Chat";
import Flashcards from "@/components/learning/Flashcards";
import Quiz from "@/components/learning/Quiz";
import Summary from "@/components/learning/Summary";
import { ComponentName } from "@/lib/api-client";
import { ROUTES } from "@/routes/constants";
import { theme } from "@/styles/theme";
import { Eye, EyeOff } from "lucide-react";
import { useLocation, useNavigate, useParams, useBlocker } from "react-router-dom";
import { chatApi, videoApi, videoProgressApi } from "../../lib/api-client";
import YouTube from "react-youtube";
import { useMultiFeedbackTracker } from "../../hooks/useFeedbackTracker";
import ShareModal from "@/components/modals/ShareModal";
import ContentTabs from "@/components/learning/ContentTabs";
import AITutorPanel from "@/components/learning/AITutorPanel";
import Header from "@/components/learning/Header";
import SparklesIcon from "@/components/icons/SparklesIcon";
import { Box, Skeleton, Stack } from "@mui/material";

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

type LearningMode = "chat" | "flashcards" | "quiz" | "summary";
interface Chapter { time: string; title: string; content: string; }

const SkeletonLoaderVideoPage: React.FC = () => {
  return (
    <div className="bg-background text-white min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      {/* Main content grid */}
      <main className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Left Column */}
        <div className="xl:col-span-3">
          <Stack spacing={4}>
            {/* Header Skeleton */}
            <header className="flex justify-between items-center pb-4">
              <Skeleton
                variant="text"
                width="70%"
                height={20}
                sx={{ bgcolor: theme.divider }}
              />
              <div className="flex items-center space-x-4">
                <Skeleton
                  variant="circular"
                  width={28}
                  height={28}
                  sx={{ bgcolor: theme.divider }}
                />
                <Skeleton
                  variant="circular"
                  width={28}
                  height={28}
                  sx={{ bgcolor: theme.divider }}
                />
              </div>
            </header>
            {/* Video Player Skeleton */}
            <Skeleton
              variant="rectangular"
              sx={{ borderRadius: 3, bgcolor: theme.divider }}
              width="100%"
              height="60%"
              className="aspect-video"
            />

            {/* Controls Skeleton */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <Stack direction="row" spacing={2}>
                <Skeleton
                  variant="rectangular"
                  sx={{ borderRadius: 1, bgcolor: theme.divider }}
                  width={120}
                  height={40}
                />
                <Skeleton
                  variant="rectangular"
                  sx={{ borderRadius: 1, bgcolor: theme.divider }}
                  width={120}
                  height={40}
                />
              </Stack>
            </div>

            {/* Transcript/Content Skeleton */}
            <Box className="mt-4">
              <Skeleton
                variant="text"
                width={80}
                height={30}
                className="mb-2"
                sx={{ borderRadius: 1, bgcolor: theme.divider }}
              />
              <Skeleton
                variant="text"
                width="70%"
                height={20}
                sx={{ borderRadius: 1, bgcolor: theme.divider }}
              />
              <Skeleton
                variant="text"
                width="50%"
                height={20}
                sx={{ borderRadius: 1, bgcolor: theme.divider }}
              />
            </Box>
          </Stack>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="xl:col-span-2 bg-background p-4 rounded-lg flex flex-col h-[95vh]">
          {/* Tabs Skeleton */}
          <div className="flex items-center pb-3 mb-4 overflow-x-auto">
            <Stack direction="row" spacing={1}>
              <Skeleton
                variant="rectangular"
                sx={{ borderRadius: 1, bgcolor: theme.divider }}
                width={60}
                height={30}
              />
              <Skeleton
                variant="rectangular"
                sx={{ borderRadius: 1, bgcolor: theme.divider }}
                width={60}
                height={30}
              />
              <Skeleton
                variant="rectangular"
                sx={{ borderRadius: 1, bgcolor: theme.divider }}
                width={60}
                height={30}
              />
              <Skeleton
                variant="rectangular"
                sx={{ borderRadius: 1, bgcolor: theme.divider }}
                width={60}
                height={30}
              />
            </Stack>
          </div>

          {/* Chat Messages Skeleton */}
          <Stack spacing={3} className="flex-grow">
            <Skeleton
              variant="text"
              width="full"
              height={20}
              sx={{ bgcolor: theme.divider }}
            />
            <Skeleton
              variant="text"
              width="full"
              height={20}
              sx={{ bgcolor: theme.divider }}
            />
            <Skeleton
              variant="text"
              width="full"
              height={20}
              sx={{ bgcolor: theme.divider }}
            />
            <Skeleton
              variant="text"
              width="full"
              height={20}
              sx={{ bgcolor: theme.divider }}
            />
            <Skeleton
              variant="text"
              width="60%"
              height={20}
              sx={{ bgcolor: theme.divider }}
            />
          </Stack>

          {/* Input Skeleton */}
          <div className="mt-auto pt-4">
            <Skeleton
              variant="rectangular"
              sx={{ borderRadius: 3, bgcolor: theme.divider }}
              width="100%"
              height={100}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

const VideoPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const currentVideoId = videoId || location.state?.videoId;

  // Video state
  const [videoDetail, setVideoDetail] = useState<any>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [transcript, setTranscript] = useState("");
  const [isLoadingVideo, setIsLoadingVideo] = useState(true);
  const [isLoadingChapters, setIsLoadingChapters] = useState(false);
  const [isLoadingTranscript, setIsLoadingTranscript] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [chaptersError, setChaptersError] = useState<string | null>(null);
  const [transcriptError, setTranscriptError] = useState<string | null>(null);
  const [isLeftColumnVisible, setIsLeftColumnVisible] = useState(true);
  const [isVideoValidated, setIsVideoValidated] = useState(false);

  // Learning mode
  const [currentMode, setCurrentMode] = useState<LearningMode>("chat");
  const [videoProgress] = useState(0);

  // Chat
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [chatInitialized, setChatInitialized] = useState(false);

  // Refs (persisted values across renders)
  const ytPlayerRef = useRef<any>(null);
  const resumeSeekAppliedRef = useRef(false);
  const periodicSaveIntervalRef = useRef<any>(null);

  const [resumePosition, setResumePosition] = useState(0);
  const [resumePercent, setResumePercent] = useState(0);

  // Feedback - only after video validation
  const {
    feedbackStates, isLoading: isFeedbackLoading, markAsSubmitted
  } = useMultiFeedbackTracker({
    components: [
      ComponentName.Video,
      ComponentName.Chat,
      ComponentName.Quiz,
      ComponentName.Summary,
      ComponentName.Flashcard,
    ],
    sourceId: isVideoValidated ? (currentVideoId || "") : "",
    pageUrl: window.location.href,
    onFeedbackExists: () => {},
  });

  const videoFeedbackState = feedbackStates[ComponentName.Video];
  const videoCanSubmitFeedback = videoFeedbackState ? videoFeedbackState.canSubmitFeedback : isFeedbackLoading ? false : true;
  const videoExistingFeedback = videoFeedbackState?.existingFeedback ?? null;

  // ------ Video Validation (MUST complete first) ------
  useEffect(() => {
    if (!currentVideoId) return;
    let didCancel = false;

    const validateVideo = async () => {
      try {
        setIsLoadingVideo(true);
        setIsVideoValidated(false);
        
        console.log('🔍 Validating video...');
        const details = await videoApi.getVideoDetail(`https://www.youtube.com/watch?v=${currentVideoId}`);
        
        if (!didCancel) {
          setVideoDetail(details);
          setIsVideoValidated(true);
          console.log('✅ Video validated successfully, other APIs can now run');
        }
      } catch (err: any) {
        if (!didCancel) {
          console.log('❌ Video validation failed:', err);
          if (err.isOutOfSyllabus || err.status === 204) {
            console.log('🚫 Video is out of syllabus, redirecting...');
            navigate(ROUTES.OUT_OF_SYLLABUS, {
              state: {
                videoUrl: `https://www.youtube.com/watch?v=${currentVideoId}`,
                videoTitle: `Video ${currentVideoId}`,
              }
            });
          } else {
            console.log('⚠️ Video validation error, setting fallback');
            setVideoDetail({});
            setIsVideoValidated(false);
          }
        }
      } finally {
        if (!didCancel) {
          setIsLoadingVideo(false);
        }
      }
    };

    validateVideo();
    return () => { didCancel = true; };
  }, [currentVideoId, navigate]);

  // ------ Fetch progress (for resuming) - only after video validation ------
  useEffect(() => {
    if (!currentVideoId || !isVideoValidated) return;
    let didCancel = false;

    console.log('📊 Fetching video progress after validation...');
    videoProgressApi.getProgress(currentVideoId)
      .then(resp => {
        if (!didCancel) {
          const pos = Number(resp.data?.current_position ?? 0);
          const pct = Number(resp.data?.watch_percentage ?? 0);
          if (!isNaN(pos) && pos > 0) {
            setResumePosition(pos);
            console.log(`📊 Loaded resume position: ${pos}s`);
          }
          if (!isNaN(pct) && pct > 0) {
            setResumePercent(pct);
            console.log(`📊 Loaded resume percentage: ${pct}%`);
          }
          if ((isNaN(pos) || pos <= 0) && (isNaN(pct) || pct <= 0)) {
            const raw = localStorage.getItem(`video_progress_${currentVideoId}`);
            if (raw) {
              try {
                const data = JSON.parse(raw);
                const lsPos = Number(data?.currentTime ?? 0);
                const lsPct = Number(data?.watchPercentage ?? 0);
                if (!isNaN(lsPos) && lsPos > 0) {
                  setResumePosition(lsPos);
                  console.log(`📊 Loaded resume position from localStorage: ${lsPos}s`);
                }
                if (!isNaN(lsPct) && lsPct > 0) {
                  setResumePercent(lsPct);
                  console.log(`📊 Loaded resume percentage from localStorage: ${lsPct}%`);
                }
              } catch {}
            }
          }
        }
      })
      .catch(() => {
        if (!didCancel) {
          console.log('⚠️ Progress API failed, trying localStorage...');
          const raw = localStorage.getItem(`video_progress_${currentVideoId}`);
          if (raw) {
            try {
              const data = JSON.parse(raw);
              const lsPos = Number(data?.currentTime ?? 0);
              const lsPct = Number(data?.watchPercentage ?? 0);
              if (!isNaN(lsPos) && lsPos > 0) {
                setResumePosition(lsPos);
                console.log(`📊 Loaded resume position from localStorage: ${lsPos}s`);
              }
              if (!isNaN(lsPct) && lsPct > 0) {
                setResumePercent(lsPct);
                console.log(`📊 Loaded resume percentage from localStorage: ${lsPct}%`);
              }
            } catch {}
          }
        }
      });

    return () => { didCancel = true; };
  }, [currentVideoId, isVideoValidated]);

  // ------ Fetch chapters - only after video validation ------
  useEffect(() => {
    if (!videoDetail?.external_source_id || !isVideoValidated) return;
    let didCancel = false;

    const fetchChapters = async () => {
      try {
        console.log('📚 Fetching video chapters after validation...');
        setIsLoadingChapters(true);
        setChaptersError(null);

        const response = await videoApi.getVideoChapters(videoDetail.external_source_id);
        if (!didCancel) {
          const transformedChapters: Chapter[] = response.chapters.map(
            (chapter: any) => ({
              time: chapter.timestamp,
              title: chapter.title,
              content: chapter.description,
            })
          );
          setChapters(transformedChapters);
          console.log(`📚 Loaded ${transformedChapters.length} chapters`);
        }
      } catch (err: any) {
        if (!didCancel) {
          console.log('❌ Failed to load chapters:', err);
          setChaptersError("Failed to load chapters. Please try again.");
        }
      } finally {
        if (!didCancel) {
          setIsLoadingChapters(false);
        }
      }
    };

    fetchChapters();
    return () => { didCancel = true; };
  }, [videoDetail?.external_source_id, isVideoValidated]);

  // Fetch transcript when requested
  const fetchTranscript = useCallback(async () => {
    if (!videoDetail?.external_source_id) return;
    try {
      setIsLoadingTranscript(true);
      setTranscriptError(null);
      const response = await videoApi.getVideoTranscript(videoDetail.external_source_id);
      setTranscript(response.transcript);
    } catch {
      setTranscriptError("Failed to load transcript. Please try again.");
    } finally {
      setIsLoadingTranscript(false);
    }
  }, [videoDetail?.external_source_id]);

  // --------------------- Video Player Logic ---------------------
  // 1. Seek on initial load
  const handleYouTubeReady = useCallback((event: any) => {
    const player = event.target;
    ytPlayerRef.current = player;
    // Seek to saved position/percent if available
    const duration = player.getDuration?.() || 0;
    if (!resumeSeekAppliedRef.current && resumePosition > 0 && duration > 0 && resumePosition < duration) {
      player.seekTo(resumePosition, true);
      resumeSeekAppliedRef.current = true;
    } else if (!resumeSeekAppliedRef.current && resumePercent > 0 && duration > 0) {
      const seekTime = Math.min(duration - 1, Math.max(0, (resumePercent / 100) * duration));
      player.seekTo(seekTime, true);
      resumeSeekAppliedRef.current = true;
    }
  }, [resumePosition, resumePercent]);

  // ----------------- Save Progress Logic (Throttled) -----------------
  const lastSavedProgressRef = useRef<{ percentage: number; position: number; timestamp: number } | null>(null);
  const saveVideoProgress = useCallback(async () => {
    if (!currentVideoId || !ytPlayerRef.current) return;
    try {
      const currentTime = ytPlayerRef.current.getCurrentTime();
      const duration = ytPlayerRef.current.getDuration();
      if (duration > 0 && currentTime >= 0.1) {
        const watchPercentage = (currentTime / duration) * 100;
        const now = Date.now();
        /*
        const lastSaved = lastSavedProgressRef.current;
        const shouldSave = !lastSaved ||
          Math.abs(watchPercentage - lastSaved.percentage) >= 5 ||
          Math.abs(currentTime - lastSaved.position) >= 30 ||
          (now - lastSaved.timestamp) >= 60000;
        if (!shouldSave) return;
        */
        await videoProgressApi.trackProgress({
          video_id: currentVideoId,
          watch_percentage: Math.round(watchPercentage * 100) / 100,
          total_duration: Math.round(duration),
          current_position: Math.round(currentTime),
          page_url: window.location.href,
        });
        lastSavedProgressRef.current = {
          percentage: watchPercentage,
          position: currentTime,
          timestamp: now
        };
        // mirror to localStorage
        localStorage.setItem(
          `video_progress_${currentVideoId}`,
          JSON.stringify({
            videoId: currentVideoId,
            title: videoDetail?.title || `Video ${currentVideoId}`,
            thumbnailUrl: `https://img.youtube.com/vi/${currentVideoId}/maxresdefault.jpg`,
            watchPercentage: Math.round(watchPercentage * 100) / 100,
            currentTime: Math.round(currentTime),
            totalDuration: Math.round(duration),
            lastUpdated: new Date().toISOString(),
            subject: videoDetail?.topics?.[0] || "General",
            description: videoDetail?.description || "Video content",
          })
        );
      }
    } catch (error: any) {
      // fallback to localStorage
      const progressData = {
        videoId: currentVideoId,
        title: videoDetail?.title || `Video ${currentVideoId}`,
        thumbnailUrl: `https://img.youtube.com/vi/${currentVideoId}/maxresdefault.jpg`,
        watchPercentage: 0,
        currentTime: 0,
        totalDuration: 0,
        lastUpdated: new Date().toISOString(),
        subject: videoDetail?.topics?.[0] || "General",
        description: videoDetail?.description || "Video content",
      };
      localStorage.setItem(
        `video_progress_${currentVideoId}`,
        JSON.stringify(progressData)
      );
    }
  }, [currentVideoId, videoDetail]);

  // 2. Save progress every 60 seconds ONLY if playing - only after video validation
  useEffect(() => {
    if (!isVideoValidated) return;
    
    function getPlayerState() {
      try {
        return ytPlayerRef.current?.getPlayerState?.();
      } catch { return undefined; }
    }
    const startAutoSave = () => {
      if (!periodicSaveIntervalRef.current) {
        console.log('💾 Starting periodic progress saving after video validation...');
        periodicSaveIntervalRef.current = setInterval(() => {
          if (getPlayerState() === 1) saveVideoProgress();
        }, 60000);
      }
    };
    const stopAutoSave = () => {
      if (periodicSaveIntervalRef.current) {
        clearInterval(periodicSaveIntervalRef.current);
        periodicSaveIntervalRef.current = null;
      }
    };
    // Listen for play/pause from player, fallback: always start and rely on IF, else always clear
    startAutoSave();
    return () => stopAutoSave();
  }, [currentVideoId, isVideoValidated, saveVideoProgress]);

  // 3. Save progress on navigation, unload or unmount
  useEffect(() => {
    const saveOnLeave = () => { saveVideoProgress(); };
    window.addEventListener("beforeunload", saveOnLeave);
    window.addEventListener("pagehide", saveOnLeave);
    return () => {
      window.removeEventListener("beforeunload", saveOnLeave);
      window.removeEventListener("pagehide", saveOnLeave);
      saveVideoProgress();
    };
  }, [currentVideoId, saveVideoProgress]);

  // React Router navigation block
  useBlocker(() => {
    saveVideoProgress();
    return false;
  });

  // --------------------- UI & Component Trees ---------------------
  const handleSeekTo = useCallback((seconds: number) => {
    if (ytPlayerRef.current && typeof seconds === 'number' && seconds >= 0) {
      try { ytPlayerRef.current.seekTo(seconds, true); } catch {}
    }
  }, []);

  // Chat initialization
  const initializeChat = useCallback(async () => {
    if (!currentVideoId || chatInitialized) return;

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
        try {
          const startResponse = await chatApi.startChat(currentVideoId);
          setChatMessages([{ text: startResponse.content, isUser: false }]);
        } catch (startErr) {
          setChatError("Failed to start new chat.");
        }
      }
    } catch (err) {
      setChatError("Failed to load chat history. Starting new chat.");
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
  }, [currentVideoId, chatInitialized]);

  // Initialize chat when video loads - only after video validation
  useEffect(() => {
    if (currentVideoId && !chatInitialized && isVideoValidated) {
      console.log('💬 Initializing chat after video validation...');
      initializeChat();
    }
  }, [currentVideoId, chatInitialized, isVideoValidated, initializeChat]);

  const handleSendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || !currentVideoId) return;

      const userMessage = { text: message, isUser: true };
      setChatMessages((prev) => [...prev, userMessage]);
      setIsChatLoading(true);
      setChatError(null);

      try {
        const response = await chatApi.sendMessage(currentVideoId, message);
        const assistantMessage = { text: response.content, isUser: false };
        setChatMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        setChatError("Failed to send message. Please try again.");
        setChatMessages((prev) => prev.slice(0, -1));
      } finally {
        setIsChatLoading(false);
      }
    },
    [currentVideoId]
  );

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
          canSubmitFeedback={feedbackStates[ComponentName.Chat]?.canSubmitFeedback}
          existingFeedback={feedbackStates[ComponentName.Chat]?.existingFeedback}
          markAsSubmitted={() => markAsSubmitted(ComponentName.Chat)}
        />
      ),
      flashcards: (
        <FlashcardsWrapper
          key={`flashcards-${currentVideoId}`}
          videoId={currentVideoId || ""}
        />
      ),
      quiz: (
        <Quiz
          key={`quiz-${currentVideoId}`}
          videoId={currentVideoId || ""}
          canSubmitFeedback={feedbackStates[ComponentName.Quiz]?.canSubmitFeedback}
          existingFeedback={feedbackStates[ComponentName.Quiz]?.existingFeedback}
          markAsSubmitted={() => markAsSubmitted(ComponentName.Quiz)}
          topics={videoDetail?.topics}
        />
      ),
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
    feedbackStates,
    markAsSubmitted,
    handleSendMessage,
  ]);

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

  // Show loading screen while video details are being fetched
  if (isLoadingVideo) {
    return (<SkeletonLoaderVideoPage />);
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
              onNavigate={(to: string, options?: any) => {
                saveVideoProgress();
                navigate(to, options);
              }}
            />
            {/* YouTube Video Player with Progress Tracking */}
            <div className="mb-4">
              <YouTube
                videoId={currentVideoId}
                onReady={handleYouTubeReady}
                className="aspect-video bg-black sm:rounded-xl overflow-hidden shadow-lg w-full h-full"
                style={{ borderRadius: "12px" }}
                opts={{
                  height: "100%",
                  width: "100%",
                  playerVars: {
                    autoplay: 0,
                    controls: 1,
                    modestbranding: 1,
                    rel: 0,
                    showinfo: 0,
                    playsinline: 1,
                    enablejsapi: 1,
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
              onFeedbackSubmit={() => {}}
              onFeedbackSkip={() => {}}
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
              <style>{`.glow-purple:hover {
                box-shadow: 0 0 10px rgba(168, 85, 247, 0.8), 
                0 0 20px rgba(168, 85, 247, 0.6), 
                0 0 30px rgba(168, 85, 247, 0.4);
              `}</style>
              {window.innerWidth > 640 ? (
                <button
                  onClick={() => {
                    saveVideoProgress();
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
                    saveVideoProgress();
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
            <div className="">
              <YouTube
                videoId={currentVideoId}
                onReady={handleYouTubeReady}
                className="aspect-video bg-black overflow-hidden w-full h-full"
                style={{ borderRadius: "12px" }}
                opts={{
                  height: "100%",
                  width: "100%",
                  playerVars: {
                    autoplay: 0,
                    controls: 1,
                    modestbranding: 1,
                    rel: 0,
                    showinfo: 0,
                    playsinline: 1,
                    enablejsapi: 1,
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
        isOpen={false}
        onClose={() => {}}
        videoId={currentVideoId}
        videoTitle={videoDetail?.title}
        playPercentage={videoProgress}
        onSubmit={async () => {}}
        onSkip={() => {}}
        onDismiss={() => {}}
        canSubmitFeedback={videoCanSubmitFeedback}
        existingFeedback={videoExistingFeedback}
        markAsSubmitted={() => {}}
        componentName="Video"
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={handleCloseShareModal}
        url={`https://www.youtube.com/watch?v=${currentVideoId}`}
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