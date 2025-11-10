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
import { useApiProgress } from "@/hooks/useApiProgress";
import { useIsMobile } from "@/hooks/use-mobile";
import ProgressBar from "@/components/ui/ProgressBar";
import LoadingScreen from "@/components/ui/LoadingScreen";

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
  const [isLoadingVideoProgress, setIsLoadingVideoProgress] = useState(true);
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

  // ⬇️ Add near your other refs
  const chatMessagesRef = useRef(chatMessages);
  useEffect(() => {
    chatMessagesRef.current = chatMessages;
  }, [chatMessages]);


  // Refs (persisted values across renders)
  const ytPlayerRef = useRef<any>(null);
  const resumeSeekAppliedRef = useRef(false);
  const periodicSaveIntervalRef = useRef<any>(null);

  const isMobile = useIsMobile();

  const [resumePosition, setResumePosition] = useState(0);
  const [resumePercent, setResumePercent] = useState(0);

  // API Progress Tracking
  const {
    // isLoading: isApiLoading,
    progress: apiProgress,
    message: apiMessage,
    registerApi,
    setApiLoading,
    setApiCompleted,
    setApiFailed,
    reset: resetProgress
  } = useApiProgress({
    onComplete: () => {
      console.log('🎉 All APIs loaded successfully!');
    }
  });

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
        resetProgress(); // Reset progress tracking

        // Register video validation API
        registerApi('video-validation', 'Video Validation', 0.3);
        setApiLoading('video-validation', true, 'Validating video content...');

        const details = await videoApi.getVideoDetail(`https://www.youtube.com/watch?v=${currentVideoId}`);

        if (!didCancel) {
        setVideoDetail(details);
          setIsVideoValidated(true);
          setApiCompleted('video-validation', 'Video validated successfully!');
        }
      } catch (err: any) {
        if (!didCancel) {
        if (err.isOutOfSyllabus || err.status === 204) {
            setApiFailed('video-validation', 'Video is out of syllabus');
            navigate(ROUTES.OUT_OF_SYLLABUS, {
              state: {
                videoUrl: `https://www.youtube.com/watch?v=${currentVideoId}`,
                videoTitle: `Video ${currentVideoId}`,
              }
            });
        } else {
            setApiFailed('video-validation', 'Video validation failed');
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
  }, [currentVideoId, navigate, registerApi, setApiLoading, setApiCompleted, setApiFailed, resetProgress]);

  // ------ Fetch progress (for resuming) - only after video validation ------
  useEffect(() => {
    if (!currentVideoId || !isVideoValidated) return;
    let didCancel = false;

    const fetchProgress = async () => {
      try {
        // Register progress API
        setIsLoadingVideoProgress(true);
        registerApi('video-progress', 'Video Progress', 0.2);
        setApiLoading('video-progress', true, 'Loading video progress...');
        
        const resp = await videoProgressApi.getProgress(currentVideoId);
        
        if (!didCancel) {
          const pos = Number(resp.data?.current_position ?? 0);
          const pct = Number(resp.data?.watch_percentage ?? 0);
          if (!isNaN(pos) && pos > 0) {
            setResumePosition(pos);
          }
          if (!isNaN(pct) && pct > 0) {
            setResumePercent(pct);
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
                }
                if (!isNaN(lsPct) && lsPct > 0) {
                  setResumePercent(lsPct);
                }
              } catch {}
            }
          }
          setApiCompleted('video-progress', 'Video progress loaded!');
          setIsLoadingVideoProgress(false);
        }
      } catch (err) {
        if (!didCancel) {
          const raw = localStorage.getItem(`video_progress_${currentVideoId}`);
          if (raw) {
            try {
              const data = JSON.parse(raw);
              const lsPos = Number(data?.currentTime ?? 0);
              const lsPct = Number(data?.watchPercentage ?? 0);
              if (!isNaN(lsPos) && lsPos > 0) {
                setResumePosition(lsPos);
              }
              if (!isNaN(lsPct) && lsPct > 0) {
                setResumePercent(lsPct);
              }
            } catch {}
          }
          setApiCompleted('video-progress', 'Video progress loaded from cache!');
          setIsLoadingVideoProgress(false);
        }
      }
    };

    fetchProgress();
    return () => { didCancel = true; };
  }, [currentVideoId, isVideoValidated, registerApi, setApiLoading, setApiCompleted]);

  // ------ Fetch chapters - only after video validation ------
  useEffect(() => {
    if (!videoDetail?.external_source_id || !isVideoValidated) return;
    let didCancel = false;

    const fetchChapters = async () => {
      try {
        // Register chapters API
        registerApi('video-chapters', 'Video Chapters', 0.2);
        setApiLoading('video-chapters', true, 'Loading video chapters...');
        
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
          setApiCompleted('video-chapters', `Loaded ${transformedChapters.length} chapters!`);
        }
      } catch (err: any) {
        if (!didCancel) {
          setChaptersError("Failed to load chapters. Please try again.");
          setApiFailed('video-chapters', 'Failed to load chapters');
        }
      } finally {
        if (!didCancel) {
          setIsLoadingChapters(false);
        }
      }
    };

    fetchChapters();
    return () => { didCancel = true; };
  }, [videoDetail?.external_source_id, isVideoValidated, registerApi, setApiLoading, setApiCompleted, setApiFailed]);

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
    resumeSeekAppliedRef.current = false;
    // Seek to saved position/percent if available
    // console.log('handleYouTubeReady is called')
    const duration = player.getDuration?.() || 0;
    // console.log('duration', duration);
    // console.log('resumePosition', resumePosition);
    // console.log('resumePercent', resumePercent);
    if (!resumeSeekAppliedRef.current && resumePosition > 0 && duration > 0 && resumePosition < duration) {
      player.seekTo(resumePosition, true);
      // console.log('seeked to resumePosition', resumePosition);
      resumeSeekAppliedRef.current = true;
    } else if (!resumeSeekAppliedRef.current && resumePercent > 0 && duration > 0) {
      const seekTime = Math.min(duration - 1, Math.max(0, (resumePercent / 100) * duration));
      player.seekTo(seekTime, true);
      // console.log('seeked to resumePercent', seekTime);
      resumeSeekAppliedRef.current = true;
    }
    /*
    console.log('case 1: !resumeSeekAppliedRef.current && resumePosition > 0 && duration > 0 && resumePosition < duration', !resumeSeekAppliedRef.current && resumePosition > 0 && duration > 0 && resumePosition < duration)
    console.log('case 2: !resumeSeekAppliedRef.current && resumePercent > 0 && duration > 0', !resumeSeekAppliedRef.current && resumePercent > 0 && duration > 0)
    console.log('resumeSeekAppliedRef.current', resumeSeekAppliedRef.current)
    console.log('resumePosition', resumePosition)
    console.log('resumePercent', resumePercent)
    console.log('duration', duration)
    console.log('did not do anything');
    */
  }, [resumePosition, resumePercent]);


  // ----------------- Save Progress Logic (Throttled) -----------------
  const lastSavedProgressRef = useRef<{ percentage: number; position: number; timestamp: number } | null>(null);
  const isSavingRef = useRef(false);
  
  const saveVideoProgress = useCallback(async (forceSave = false) => {
    if (!currentVideoId || !ytPlayerRef.current || isSavingRef.current) {
      return;
    }

    try {
      const currentTime = ytPlayerRef.current.getCurrentTime();
      const duration = ytPlayerRef.current.getDuration();
      
      if (duration > 0 && duration >= 0.1) {
        const watchPercentage = (currentTime / duration) * 100;
        const now = Date.now();
        
        // Throttling logic - only save if significant change or time elapsed (unless forced)
        const lastSaved = lastSavedProgressRef.current;
        const shouldSave = forceSave || !lastSaved ||
          Math.abs(watchPercentage - lastSaved.percentage) >= 5 ||
          Math.abs(currentTime - lastSaved.position) >= 30 ||
          (now - lastSaved.timestamp) >= 60000;
        
        if (!shouldSave) {
          return;
        }

        const hasUserNotInteracted = chatMessagesRef.current.filter(c => c.isUser).length == 0

        if (watchPercentage == 0 && hasUserNotInteracted) {
          return;
        }

        // if(watchPercentage == 0 && chatMessages.length == 0) {
        //   return;
        // }

        isSavingRef.current = true;

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

        // Mirror to localStorage as backup
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

      } else {
      }
    } catch (error: any) {
      
      // Fallback to localStorage only
      try {
        const currentTime = ytPlayerRef.current?.getCurrentTime() || 0;
        const duration = ytPlayerRef.current?.getDuration() || 0;
        const watchPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
        
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
        
      } catch (localError) {
      }
    } finally {
      isSavingRef.current = false;
    }
  }, [currentVideoId, videoDetail]);

  // Handle YouTube player state changes (play/pause/buffering)
  const handleYouTubeStateChange = useCallback((event: any) => {
    const playerState = event.data;
    
    // Save progress when video is paused or buffering
    if (playerState === 2 || playerState === 3) { // 2 = paused, 3 = buffering
      saveVideoProgress();
    }
  }, [saveVideoProgress]);

  // 2. Save progress every 30 seconds ONLY if playing - only after video validation
  useEffect(() => {
    if (!isVideoValidated) return;
    
    function getPlayerState() {
      try {
        return ytPlayerRef.current?.getPlayerState?.();
      } catch { return undefined; }
    }
    
    const startAutoSave = () => {
      if (!periodicSaveIntervalRef.current) {
        periodicSaveIntervalRef.current = setInterval(() => {
          const playerState = getPlayerState();
          if (playerState === 1) { // 1 = playing
            saveVideoProgress();
          }
        }, 30000); // Reduced to 30 seconds for more frequent saves
      }
    };
    
    const stopAutoSave = () => {
      if (periodicSaveIntervalRef.current) {
        clearInterval(periodicSaveIntervalRef.current);
        periodicSaveIntervalRef.current = null;
      }
    };
    
    // Start auto-save
    startAutoSave();
    
    return () => stopAutoSave();
  }, [currentVideoId, isVideoValidated, saveVideoProgress]);

  // 3. Save progress on navigation, unload or unmount
  useEffect(() => {
    const saveOnLeave = () => { 
      saveVideoProgress(); 
    };
    
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
      const initChat = async () => {
        try {
          // Register chat API
          registerApi('chat-init', 'Chat Initialization', 0.15);
          setApiLoading('chat-init', true, 'Initializing chat...');
          
          await initializeChat();
          setApiCompleted('chat-init', 'Chat initialized!');
        } catch (err) {
          setApiFailed('chat-init', 'Failed to initialize chat');
        }
      };
      
      initChat();
    }
  }, [currentVideoId, chatInitialized, isVideoValidated, initializeChat, registerApi, setApiLoading, setApiCompleted, setApiFailed]);

  // Track feedback loading - only after video validation
  useEffect(() => {
    if (currentVideoId && isVideoValidated) {
      const initFeedback = async () => {
        try {
          // Register feedback API
          registerApi('feedback-init', 'Feedback System', 0.15);
          setApiLoading('feedback-init', true, 'Setting up feedback system...');
          
          // Wait for feedback to load
          await new Promise(resolve => {
            const checkFeedback = () => {
              if (!isFeedbackLoading) {
                setApiCompleted('feedback-init', 'Feedback system ready!');
                resolve(true);
              } else {
                setTimeout(checkFeedback, 100);
              }
            };
            checkFeedback();
          });
        } catch (err) {
          setApiFailed('feedback-init', 'Failed to initialize feedback');
        }
      };
      
      initFeedback();
    }
  }, [currentVideoId, isVideoValidated, isFeedbackLoading, registerApi, setApiLoading, setApiCompleted, setApiFailed]);

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


  // If video is not validated but we've been loading for a while, show fallback
  if (!isVideoValidated && apiProgress > 50) {
    setVideoDetail({ title: `Video ${currentVideoId}`, description: "Loading..." });
    setIsVideoValidated(true);
  }

  return (
    <>
    {/* Progress Section */}
    <div className="w-full">
      {apiProgress >= 0 && apiProgress < 100 &&
        <ProgressBar
          isLoading={true}
          progress={apiProgress}
          message={apiMessage}
          showPercentage={true}
          height={6}
          className="mb-4"
        />}
      </div>
      <div className="bg-background text-foreground min-h-screen font-sans">
      {!isMobile ? <div className="mx-auto hidden w-full h-full sm:block">
        <main className="grid grid-cols-1 xl:grid-cols-5">
          <div
            className={`p-4 xl:col-span-3 overflow-y-auto h-[100vh] ${
              isLeftColumnVisible ? "" : "hidden"
            }`}
          >
            <LoadingScreen
              isLoading={isLoadingVideo}
              showSkeleton={true}
              skeletonType="header"
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
            </LoadingScreen>
            {/* YouTube Video Player with Progress Tracking */}
            <div className="mb-4">
              <LoadingScreen
                  isLoading={isLoadingVideo || isLoadingVideoProgress}
                  showSkeleton={true}
                  skeletonType="video-player"
                >
                  <YouTube
                    videoId={currentVideoId}
                    onReady={handleYouTubeReady}
                    onStateChange={handleYouTubeStateChange}
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
              </LoadingScreen>
            </div>
              <LoadingScreen
                isLoading={isLoadingChapters}
                showSkeleton={true}
                skeletonType="content-tabs"
              >
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
              </LoadingScreen>
          </div>
          <div
            className={`${
              isLeftColumnVisible ? "xl:col-span-2" : "xl:col-span-5"
            } w-full h-[100vh]`}
          >
            <LoadingScreen
              isLoading={!chatInitialized}
              showSkeleton={true}
              skeletonType="ai-tutor-panel"
            >
              <AITutorPanel
                currentMode={currentMode}
                onModeChange={handleModeChange}
                isLeftColumnVisible={isLeftColumnVisible}
                onToggleFullScreen={handleToggleFullScreen}
                onShare={handleShare}
                components={components}
              />
            </LoadingScreen>
          </div>
        </main>
      </div> :
      <div className="sm:hidden">
        <div className="flex flex-col h-[100vh]">
          <header className="flex flex-row gap-3 justify-between p-4 items-center ">
            <LoadingScreen
                isLoading={isLoadingVideo}
                showSkeleton={true}
                skeletonType="header"
              >
                <div className="flex-1 min-w-0 overflow-ellipsis">
                  <h1 className="text-md text-gray-500 truncate px-14 ">
                    {videoDetail?.title || "Video Title Not Available"}
                  </h1>
                </div>
            </LoadingScreen>
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
          <LoadingScreen
            isLoading={isLoadingVideo || isLoadingVideoProgress}
            showSkeleton={true}
            skeletonType="video-player"
          >
            <>
              <div className={`flex-shrink-0 ${isVideoVisible ? "" : "hidden"}`}>
                {/* YouTube Video Player with Progress Tracking - Mobile */}
                <div className="">
                    <YouTube
                      videoId={currentVideoId}
                      onReady={handleYouTubeReady}
                      onStateChange={handleYouTubeStateChange}
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
            </>
          </LoadingScreen>
          <div className="flex-grow overflow-hidden">
          <LoadingScreen
            isLoading={!chatInitialized}
            showSkeleton={true}
            skeletonType="ai-tutor-panel"
            >
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
            </LoadingScreen>
          </div>
        </div>
      </div> }

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
    </>
    
  );
};

export default VideoPage;