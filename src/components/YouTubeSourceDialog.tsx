import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SuggestedVideo, validateUrl, videoApi } from "../lib/api-client";
import { ROUTES, buildVideoLearningRoute } from "../routes/constants";
import OutOfSyllabus from "./OutOfSyllabus";

// --- Type Definitions ---
interface IconProps {
  className?: string;
}

interface AddSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// To make this a self-contained component, we'll use inline SVGs for icons
// instead of an external library like lucide-react.

const LinkIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" />
  </svg>
);

const XIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const LoadingIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 12a9 9 0 11-6.219-8.56" />
  </svg>
);

// The Modal Component
export const AddSourceModal: React.FC<AddSourceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestedVideos, setSuggestedVideos] = useState<SuggestedVideo[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState("");
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const [showOutOfSyllabus, setShowOutOfSyllabus] = useState(false);

  // Effect to handle clicks outside the modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close if OutOfSyllabus modal is open
      if (showOutOfSyllabus) {
        return;
      }

      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, showOutOfSyllabus]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setUrl("");
      setError("");
      setIsLoading(false);
    }
  }, [isOpen]);

  // Fetch suggested videos when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchSuggestedVideos();
    }
  }, [isOpen]);

  const fetchSuggestedVideos = async () => {
    try {
      setIsLoadingSuggestions(true);
      setSuggestionsError("");
      setUsingFallbackData(false);

      const videos = await videoApi.getSuggestedVideos();
      // setSuggestedVideos(videos);
      // Ensure videos is an array before setting state
      if (Array.isArray(videos)) {
        setSuggestedVideos(videos);
      } else {
        console.warn("API returned non-array data:", videos);
        throw new Error("Invalid response format from API");
      }
    } catch (err: any) {
      console.warn("API failed, using fallback data:", err.message);
      setSuggestionsError("Using sample videos (API unavailable)");
      // Fallback to dummy data if API fails
      setSuggestedVideos(getRandomItems(fallbackSuggestedVideos, 3));
      setUsingFallbackData(true);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const validateUrlFormat = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setError("");
  };

  const handleAdd = async () => {
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      // First validate the URL
      const validationResult = await validateUrl(url);
      console.log("Validation result:", validationResult); // Debug log

      if (!validationResult.isValid) {
        if (validationResult.isOutOfSyllabus) {
          console.log("Setting showOutOfSyllabus to true"); // Debug log
          // Show OutOfSyllabus modal
          setShowOutOfSyllabus(true);
          setIsLoading(false);
          return;
        } else {
          setError(validationResult.message || "Invalid URL");
          setIsLoading(false);
          return;
        }
      }

      // If validation passes, fetch video details
      const details = await videoApi.getVideoDetail(url);

      onClose();
      navigate(buildVideoLearningRoute(details.external_source_id));
    } catch (err: any) {
      setError(
        err.message ||
          "Failed to add video. Please check the URL and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToHome = () => {
    onClose();
    navigate(ROUTES.DASHBOARD);
  };

  const handleSuggestedVideoClick = async (video: SuggestedVideo) => {
    try {
      setIsLoading(true);
      setError("");

      // First validate the URL
      const validationResult = await validateUrl(video.url);

      if (!validationResult.isValid) {
        if (validationResult.isOutOfSyllabus) {
          // Show OutOfSyllabus modal
          setShowOutOfSyllabus(true);
          setIsLoading(false);
          return;
        } else {
          setError(validationResult.message || "Invalid URL");
          setIsLoading(false);
          return;
        }
      }

      // If validation passes, fetch video details
      const details = await videoApi.getVideoDetail(video.url);

      onClose();
      navigate(buildVideoLearningRoute(details.external_source_id));
    } catch (err: any) {
      setError(
        err.message || "Failed to add suggested video. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  console.log(
    "YouTubeSourceDialog render - showOutOfSyllabus:",
    showOutOfSyllabus
  ); // Debug log

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30 backdrop-blur-sm p-4 font-sans">
      {/* Modal Panel */}
      <div
        ref={modalRef}
        className="w-full max-w-lg transform rounded-xl bg-[#202123] text-gray-200 shadow-2xl transition-all"
      >
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="flex items-center text-lg font-semibold text-white">
              <LinkIcon className="mr-3 h-5 w-5 text-gray-400" />
              YouTube, Website, Etc.
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>
          {/* Body */}

          <div className="mt-6">
            <label htmlFor="url-input" className="text-sm text-gray-400">
              Enter a YouTube Link, Website URL, Doc, ArXiv, Etc.
            </label>
            <input
              id="url-input"
              type="text"
              value={url}
              onChange={handleUrlChange}
              placeholder="https://youtu.be/example"
              className="mt-2 w-full rounded-lg border border-gray-600 bg-[#2f3032] px-4 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />

            {/* Error Message */}
            {error && <div className="mt-2 text-sm text-red-400">{error}</div>}

            {/* Separator */}
            <div className="my-6 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-700" />
              <div className="px-3 text-sm font-medium text-gray-500">or</div>
              <div className="w-full border-t border-gray-700" />
            </div>

            {/* Video Suggestions */}
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-400">
                  Suggested Videos
                </h3>
                {usingFallbackData && (
                  <span className="text-xs text-yellow-400 bg-yellow-900/20 px-2 py-1 rounded">
                    Sample Data
                  </span>
                )}
              </div>

              {isLoadingSuggestions ? (
                <div className="mt-4 flex items-center justify-center py-8">
                  <LoadingIcon className="h-6 w-6 animate-spin text-gray-400" />
                  <span className="ml-2 text-sm text-gray-400">
                    Loading suggestions...
                  </span>
                </div>
              ) : suggestionsError && !usingFallbackData ? (
                <div className="mt-4 text-center py-8">
                  <p className="text-sm text-red-400">{suggestionsError}</p>
                  <button
                    onClick={fetchSuggestedVideos}
                    className="mt-2 text-sm text-blue-400 hover:text-blue-300"
                  >
                    Try again
                  </button>
                </div>
              ) : suggestedVideos.length === 0 ? (
                <div className="mt-4 text-center py-8">
                  <p className="text-sm text-gray-400">
                    No suggested videos available
                  </p>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {suggestedVideos.map((video) => (
                    <div
                      key={video.id}
                      onClick={() => handleSuggestedVideoClick(video)}
                      className="group cursor-pointer overflow-hidden rounded-lg bg-gray-700/50 transition-all hover:bg-gray-700 hover:shadow-lg"
                    >
                      <img
                        src={video.thumbnailUrl}
                        alt={`Thumbnail for ${video.title}`}
                        className="h-24 w-full object-cover transition-transform group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src =
                            "https://placehold.co/400x225/333/FFF?text=Error";
                        }}
                      />
                      <div className="p-3">
                        <p className="truncate font-semibold text-white">
                          {video.title}
                        </p>
                        <p className="text-xs text-gray-400">{video.topic}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={navigateToHome}
              className="rounded-lg bg-gray-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Go to Home
            </button>
            <button
              onClick={handleAdd}
              disabled={!url.trim() || isLoading}
              className="rounded-lg bg-[#343541] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {isLoading ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
      </div>

      {/* OutOfSyllabus Modal Overlay */}
      {showOutOfSyllabus && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50"
          onClick={(e) => {
            // Only close if clicking on the backdrop, not on the modal content
            if (e.target === e.currentTarget) {
              setShowOutOfSyllabus(false);
            }
          }}
        >
          <OutOfSyllabus
            onGoBack={() => {
              console.log("Closing OutOfSyllabus modal"); // Debug log
              setShowOutOfSyllabus(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

// Main App Component to demonstrate the modal
export default function YouTubeSourceDialog() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const navigate = useNavigate();
  const handleClose = () => {
    navigate(ROUTES.DASHBOARD);
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-900">
      <button
        onClick={() => setIsModalOpen(true)}
        className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-transform hover:scale-105 active:scale-95"
      >
        Open Source Adder
      </button>

      <AddSourceModal isOpen={isModalOpen} onClose={handleClose} />
    </div>
  );
}

const getRandomItems = (
  array: SuggestedVideo[],
  count: number
): SuggestedVideo[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Fallback dummy data for suggested videos when API fails
const fallbackSuggestedVideos: SuggestedVideo[] = [
  {
    id: 1,
    title: "React Hooks in 10 Minutes",
    topic: "Web Development",
    thumbnailUrl: "https://placehold.co/400x225/E84343/FFFFFF?text=React",
    url: "https://www.youtube.com/watch?v=TNhaISOUy6Q",
    description: "Learn React Hooks quickly with practical examples",
    tags: ["react", "javascript", "web-development"],
  },
  {
    id: 2,
    title: "A Brief History of the Cosmos",
    topic: "Science",
    thumbnailUrl: "https://placehold.co/400x225/4361E8/FFFFFF?text=Cosmos",
    url: "https://www.youtube.com/watch?v=OUnYkixy3ug",
    description: "Explore the fascinating history of our universe",
    tags: ["science", "cosmos", "astronomy"],
  },
  {
    id: 3,
    title: "Perfect Sourdough for Beginners",
    topic: "Cooking",
    thumbnailUrl: "https://placehold.co/400x225/E8A243/FFFFFF?text=Cooking",
    url: "https://www.youtube.com/watch?v=-9Osn7JsP1Y",
    description: "Master the art of sourdough bread making",
    tags: ["cooking", "baking", "sourdough"],
  },
  {
    id: 4,
    title: "Machine Learning Fundamentals",
    topic: "Technology",
    thumbnailUrl: "https://placehold.co/400x225/10B981/FFFFFF?text=ML",
    url: "https://www.youtube.com/watch?v=bLHqHRWUUWg&list=PLwdnzlV3ogoVDlDwuB9SLJzhaZT0tTil3",
    description: "Essential concepts in machine learning",
    tags: ["machine-learning", "ai", "technology"],
  },
  {
    id: 5,
    title: "Photography Composition Tips",
    topic: "Art",
    thumbnailUrl: "https://placehold.co/400x225/8B5CF6/FFFFFF?text=Photo",
    url: "https://www.youtube.com/watch?v=8XBYt-_U4WE",
    description: "Improve your photography with composition techniques",
    tags: ["photography", "art", "composition"],
  },
  {
    id: 6,
    title: "Financial Planning Basics",
    topic: "Finance",
    thumbnailUrl: "https://placehold.co/400x225/F59E0B/FFFFFF?text=Finance",
    url: "https://www.youtube.com/watch?v=MabD5R8kRak",
    description: "Essential financial planning for beginners",
    tags: ["finance", "planning", "money"],
  },
];
