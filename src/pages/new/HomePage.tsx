import { SuggestedVideo, videoApi } from "@/lib/api-client";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddSourceModal } from "../../components/YouTubeSourceDialog";
import { buildVideoLearningRoute, ROUTES } from "../../routes/constants";
import { useVideoProgress } from "../../hooks/useVideoProgress";
import {
  BookOpen,
  CirclePlay,
  Clipboard,
  ClipboardList,
  FileUp,
  RefreshCcw
} from "lucide-react";

// --- Type Definitions ---
interface IconProps {
  className?: string;
}


interface Topic {
  id: string;
  name: string;
  color: string;
  icon: React.ComponentType<IconProps>;
  description: string;
}

interface AttemptedTest {
  id: string;
  title: string;
  score: number;
  date: string;
  questions: number;
  correct: number;
  wrong: number;
}

interface SuggestedReading {
  id: string;
  title: string;
  topic: string;
}

interface SuggestedTest {
  id: string;
  title: string;
  topic: string;
}

// --- SVG ICONS ---
// Using inline SVGs to keep the component self-contained.

const TrashIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const CheckCircleIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const XCircleIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);



const CodeBracketIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25"
    />
  </svg>
);

const CalculatorIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 9.563a3.375 3.375 0 016.096-.938 3.375 3.375 0 01-1.897 5.865m-4.2-4.927a3.375 3.375 0 01-1.897 5.865 3.375 3.375 0 01-4.2 0"
    />
  </svg>
);

const BeakerIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.25 6.087c0-.66.539-1.198 1.198-1.198s1.198.538 1.198 1.198v9.825a1.198 1.198 0 01-1.198 1.198h-1.198a1.198 1.198 0 01-1.198-1.198V6.087z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5.25 6.087v9.825a2.25 2.25 0 002.25 2.25h8.25a2.25 2.25 0 002.25-2.25V6.087"
    />
  </svg>
);

const PaintBrushIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.433 2.433c-.498 0-.974-.196-1.32-.546a3 3 0 010-4.243 3 3 0 014.242 0l.827.827a3 3 0 004.242 0l.827-.827a3 3 0 014.242 0l.827.827a3 3 0 004.242 0l.827-.827a3 3 0 014.242 0l.827.827a3 3 0 004.242 0l.827-.827a3 3 0 010 4.243 3 3 0 01-4.243 0l-.827-.827a3 3 0 00-4.242 0l-.827.827a3 3 0 01-4.242 0l-.827-.827a3 3 0 00-4.242 0z"
    />
  </svg>
);

const BookOpenIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.042A8.967 8.967 0 003 9c-1.105 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2a8.967 8.967 0 00-9-2.958z"
    />
  </svg>
);

const BrainIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.5 13.5h.008v.008h-.008v-.008z"
    />
  </svg>
);


// --- MOCK DATA ---

const initialTopics: Topic[] = [
  {
    id: "t1",
    name: "Coding",
    color: "bg-red-500/10 text-red-400 border-red-500/20",
    icon: CodeBracketIcon,
    description: "15+ Courses",
  },
  {
    id: "t2",
    name: "Maths",
    color: "bg-green-500/10 text-green-400 border-green-500/20",
    icon: CalculatorIcon,
    description: "20+ Quizzes",
  },
  {
    id: "t3",
    name: "Science",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    icon: BeakerIcon,
    description: "30+ Lessons",
  },
  {
    id: "t4",
    name: "Arts",
    color: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    icon: PaintBrushIcon,
    description: "12+ Projects",
  },
  {
    id: "t5",
    name: "History",
    color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    icon: BookOpenIcon,
    description: "25+ Timelines",
  },
  {
    id: "t6",
    name: "Philosophy",
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    icon: BrainIcon,
    description: "18+ Thinkers",
  },
];

const initialAttemptedTests: AttemptedTest[] = [
  {
    id: "at1",
    title: "Algebra Basics Test",
    score: 85,
    date: "2025-07-26",
    questions: 20,
    correct: 17,
    wrong: 3,
  },
  {
    id: "at2",
    title: "Modern Art Quiz",
    score: 92,
    date: "2025-07-25",
    questions: 25,
    correct: 23,
    wrong: 2,
  },
  {
    id: "at3",
    title: "Data Structures Challenge",
    score: 78,
    date: "2025-07-24",
    questions: 30,
    correct: 23,
    wrong: 7,
  },
];

const suggestedReadings: SuggestedReading[] = [
  { id: "sr1", title: "A Brief History of Time", topic: "Cosmology" },
  { id: "sr2", title: "The Double Helix", topic: "Genetics" },
  { id: "sr3", title: "Introduction to Algorithms", topic: "Computer Science" },
];

const suggestedTests: SuggestedTest[] = [
  { id: "st1", title: "Organic Chemistry Basics", topic: "Science" },
  { id: "st2", title: "Renaissance Art History", topic: "Arts" },
  { id: "st3", title: "Intro to Javascript", topic: "Coding" },
];

// --- MAIN COMPONENT ---
export default function HomePage() {
  const [attemptedTests, setAttemptedTests] = useState(initialAttemptedTests);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);
  const [suggestedVideos, setSuggestedVideos] = useState<SuggestedVideo[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [videosError, setVideosError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Use video progress hook
  const {
    isLoading: isLoadingProgress,
    error: progressError,
    refreshProgress,
    getWatchedVideos,
    formatDuration,
    formatLastUpdated
  } = useVideoProgress();

  // Fetch suggested videos when component mounts
  useEffect(() => {
    const fetchSuggestedVideos = async () => {
      try {
        setIsLoadingVideos(true);
        setVideosError(null);
        const videos = await videoApi.getSuggestedVideos();
        setSuggestedVideos(videos);
      } catch (error: any) {
        console.error("Failed to fetch suggested videos:", error);
        setVideosError(error.message || "Failed to load suggested videos");
        // Fallback to empty array if API fails
        setSuggestedVideos([]);
      } finally {
        setIsLoadingVideos(false);
      }
    };

    fetchSuggestedVideos();
  }, []);

  const handleRemoveRecord = (id: string, type: "test") => {
    if (type === "test") {
      setAttemptedTests((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleSuggestedVideoClick = async (video: SuggestedVideo) => {
    try {
      //setIsLoading(true);

      // If validation passes, fetch video details
      const details = await videoApi.getVideoDetail(video.url);

      navigate(buildVideoLearningRoute(details.external_source_id));
    } catch (err: any) {
      console.error("Failed to fetch video details:", err);
      
      // Check if it's an out-of-syllabus error
      if (err.isOutOfSyllabus || err.status === 204) {
        console.log("Content is out of syllabus, redirecting to dashboard");
        navigate(ROUTES.DASHBOARD);
      }
    } finally {
      //setIsLoading(false);
    }
  };
  return (
    <div className="min-h-full bg-background text-foreground font-sans mt-6 sm:p-6">
      
      <div className="container mx-auto sm:px-6 lg:px-8 py-12 max-w-5xl">
        {/* Header Card */}
        <div className="bg-card rounded-xl p-6 mb-10 shadow-2xl border border-border">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 text-center">
            What do you want to learn today?
          </h1>
          <p className="text-muted-foreground mb-6 text-center">
            Start by uploading a file or pasting a video link.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="group flex items-center space-x-4 p-4 bg-card/80 rounded-lg transition-all duration-300 cursor-not-allowed border border-border">
              <FileUp className="h-8 w-8 text-gray transition-transform text-muted-foreground" />
              <div>
                <h2 className="font-semibold text-muted-foreground">Upload File</h2>
                <p className="text-xs text-muted-foreground">PDF, DOC, TXT</p>
              </div>
            </div>
            <div
              onClick={() => setIsYouTubeModalOpen(true)}
              className="group flex items-center space-x-4 p-4 bg-card/80 rounded-lg hover:bg-accent/20 transition-all duration-300 cursor-pointer border border-border-medium hover:border-primary group-hover:scale-110"
            >
              <Clipboard className="h-8 w-8 text-gray transition-transform" />
              <div>
                <h2 className="font-semibold text-foreground">Paste Link</h2>
                <p className="text-xs text-muted-foreground">
                  Paste Youtube links
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- SEQUENTIAL LAYOUT --- */}

        {/* Recommended Videos Card */}
        <div className="bg-card rounded-xl p-3 sm:p-6 mb-10 shadow-2xl border border-border">
          <div className="flex items-start justify-between mb-5">
            <h2 className="text-2xl font-bold text-foreground">
              Recommended Videos
            </h2>
            <button
              onClick={() => {
                setVideosError(null);
                const fetchSuggestedVideos = async () => {
                  try {
                    setIsLoadingVideos(true);
                    const videos = await videoApi.getSuggestedVideos();
                    setSuggestedVideos(videos);
                  } catch (error: any) {
                    console.error("Failed to fetch suggested videos:", error);
                    setVideosError(
                      error.message || "Failed to load suggested videos"
                    );
                  } finally {
                    setIsLoadingVideos(false);
                  }
                };
                fetchSuggestedVideos();
              }}
              disabled={isLoadingVideos}
              className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <RefreshCcw className="w-4 h-4" />

              Refresh
            </button>
          </div>

          {isLoadingVideos ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-muted-foreground">
                Loading videos...
              </span>
            </div>
          ) : videosError ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>{videosError}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-primary hover:underline"
              >
                Try again
              </button>
            </div>
          ) : suggestedVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedVideos.slice(0, 3).map((video) => (
                <div
                  key={video.id}
                  onClick={() => handleSuggestedVideoClick(video)}
                  className="group relative bg-card/80 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl border border-divider hover:border-primary hover:-translate-y-1 cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                      <CirclePlay className="h-12 w-12 text-white group-hover:scale-110 transition-all duration-300" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-foreground truncate">
                      {video.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {video.topic}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No recommended videos available at the moment.</p>
            </div>
          )}
        </div>

        {/* Recommended Reading Card */}
        <div className="bg-card rounded-xl p-3 sm:p-6 mb-10 shadow-2xl border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-5">
            Recommended Reading
          </h2>
          <div className="space-y-4">
            {suggestedReadings.map((item) => (
              <div
                key={item.id}
                className="group flex items-center space-x-4 bg-card/80 p-3 rounded-lg border border-border-medium hover:border-primary transition-all duration-300 hover:shadow-xl hover:bg-accent/10"
              >
                <div className="flex-shrink-0 bg-muted w-16 h-16 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-gray" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-semibold text-foreground">
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">{item.topic}</p>
                </div>
                <button className="px-3 py-1.5 text-sm font-semibold bg-primary text-white rounded-md hover:bg-primary/90 transition-colors cursor-pointer">
                  Read
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Tests Card */}
        <div className="bg-card rounded-xl p-3 sm:p-6 mb-10 shadow-2xl border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-5">
            Recommended Tests
          </h2>
          <div className="space-y-4">
            {suggestedTests.map((test) => (
              <div
                key={test.id}
                className="group flex items-center space-x-4 bg-card/80 p-3 rounded-lg border border-border-medium hover:border-primary transition-all duration-300   hover:shadow-xl hover:bg-accent/10"
              >
                <div className="flex-shrink-0 bg-muted w-16 h-16 rounded-lg flex items-center justify-center">
                  <ClipboardList className="h-8 w-8 text-gray" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-semibold text-foreground">
                    {test.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">{test.topic}</p>
                </div>
                <button
                  onClick={() => navigate(ROUTES.EXAM_INFO)}
                  className="px-3 py-1.5 text-sm font-semibold bg-primary text-white rounded-md hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Start
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Continue Learning Card */}
        <div className="bg-card rounded-xl p-3 sm:p-6 mb-10 shadow-2xl border border-border">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold text-foreground">
              Continue Learning
            </h2>
            <button
              onClick={refreshProgress}
              disabled={isLoadingProgress}
              className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <RefreshCcw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {isLoadingProgress ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-muted-foreground">
                Loading your progress...
              </span>
            </div>
          ) : progressError ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>{progressError}</p>
              <button
                onClick={refreshProgress}
                className="mt-2 text-primary hover:underline"
              >
                Try again
              </button>
            </div>
          ) : getWatchedVideos().length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {getWatchedVideos().slice(0, 4).map((video) => (
                <div
                  key={video.videoId}
                  onClick={() => navigate(buildVideoLearningRoute(video.videoId))}
                  className="group relative bg-card/80 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl cursor-pointer hover:border-primary border border-border-medium hover:-translate-y-1"
                >
                  <div className="relative">
                    <img
                      src={video.thumbnailUrl}
                      alt={`Thumbnail for ${video.title}`}
                      className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        // Try different YouTube thumbnail formats
                        if (target.src.includes('hqdefault.jpg')) {
                          target.src = `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`;
                        } else if (target.src.includes('mqdefault.jpg')) {
                          target.src = `https://img.youtube.com/vi/${video.videoId}/default.jpg`;
                        } else {
                          target.src = "https://placehold.co/600x400/333/FFF?text=No+Thumbnail";
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                      <CirclePlay className="h-12 w-12 text-white group-hover:scale-110 transition-all duration-300" />
                    </div>
                    <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                      {formatDuration(video.totalDuration)}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-foreground truncate text-lg mb-2">
                      {video.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {video.tags?.[0] || video.subject}
                    </p>
                    {video.topics && video.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {video.topics.slice(0, 2).map((topic, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
                          >
                            {topic}
                          </span>
                        ))}
                        {video.topics.length > 2 && (
                          <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full">
                            +{video.topics.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                    <div className="w-full bg-muted rounded-full h-2.5 mb-2">
                      <div
                        className="bg-primary h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${Math.round(video.watchPercentage)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{Math.round(video.watchPercentage)}% Complete</span>
                      <span>{formatLastUpdated(video.lastUpdated)}</span>
                    </div>
                    {video.watchPercentage >= 100 && (
                      <div className="mt-2 flex items-center text-green-400 text-xs">
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Completed
                      </div>
                    )}
                  </div>
                  <div className="absolute top-3 right-3 p-1.5 bg-black/40 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <CirclePlay className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CirclePlay className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No videos in progress</p>
              <p className="text-sm">Start watching videos to see them here</p>
            </div>
          )}
        </div>

        {/* Attempted Tests Card */}
        <div className="bg-card rounded-xl p-3 sm:p-6 mb-10 shadow-2xl border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-5 flex justify-between items-center">
            <span>Attempted Tests</span>
            <a
              href="#"
              className="text-sm font-medium text-primary hover:opacity-80 transition-colors"
            >
              View all
            </a>
          </h2>
          <div className="space-y-4">
            {attemptedTests.map((test) => (
              <div
                key={test.id}
                className="group relative bg-card/80 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 transition-all duration-300 hover:shadow-xl hover:bg-accent/10 border border-border-medium hover:border-primary"
              >
                <div className="flex-shrink-0 text-center w-24">
                  <p
                    className={`text-4xl font-bold ${test.score >= 80 ? "text-green-400" : "text-yellow-400"
                      }`}
                  >
                    {test.score}%
                  </p>
                  <p className="text-xs text-muted-foreground/80">
                    Overall Score
                  </p>
                </div>
                <div className="flex-grow w-full border-t sm:border-t-0 sm:border-l border-slate-700 pt-3 sm:pt-0 sm:pl-4">
                  <h3 className="font-semibold text-foreground text-lg">
                    {test.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Attempted: {test.date}
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center text-green-400">
                      <CheckCircleIcon className="h-5 w-5 mr-1.5" />
                      <span>{test.correct} Correct</span>
                    </div>
                    <div className="flex items-center text-red-400">
                      <XCircleIcon className="h-5 w-5 mr-1.5" />
                      <span>{test.wrong} Wrong</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate(ROUTES.ANALYSIS)}
                  className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-md hover:bg-primary/90 transition-colors w-full sm:w-auto cursor-pointer"
                >
                  Review Test
                </button>
                <button
                  onClick={() => handleRemoveRecord(test.id, "test")}
                  className="absolute top-3 right-3 p-1.5 bg-black/40 backdrop-blur-sm rounded-full text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent hover:text-accent-foreground"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Explore Topics Card */}
        <div className="bg-card rounded-xl p-3 sm:p-6 shadow-2xl border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-5">
            Explore Topics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {initialTopics.map((topic) => {
              const Icon = topic.icon;
              return (
                <div
                  key={topic.id}
                  className={`group flex flex-col items-center justify-center text-center p-4 rounded-lg cursor-pointer transition-all duration-300 border ${topic.color} hover:bg-accent/10`}
                >
                  <Icon className="h-8 w-8 mb-2 transition-transform duration-300 group-hover:scale-110" />
                  <div>
                    <p className="font-semibold">{topic.name}</p>
                    <p className="text-xs opacity-70">{topic.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* YouTube Source Dialog Modal */}
      <AddSourceModal
        isOpen={isYouTubeModalOpen}
        onClose={() => setIsYouTubeModalOpen(false)}
      />
    </div>
  );
}
