import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeColors } from "../contexts/ThemeContext";
import { SuggestedVideo, validateUrl, videoApi } from "../lib/api-client";
import { ROUTES, buildVideoLearningRoute } from "../routes/constants";
import OutOfSyllabus from "./OutOfSyllabus";

// --- Type Definitions ---
interface IconProps {
  className?: string;
  style?: React.CSSProperties;
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
  const theme = useThemeColors();
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setError] = useState("");
  const [suggestedVideos, setSuggestedVideos] = useState<SuggestedVideo[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState("");
  const [, setUsingFallbackData] = useState(false);
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
      setSuggestedVideos(videos);
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

  // kept for future use
  // const validateUrlFormat = (url: string): boolean => {
  //   try {
  //     new URL(url);
  //     return true;
  //   } catch {
  //     return false;
  //   }
  // };

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

  // kept for future use
  // const navigateToHome = () => {
  //   onClose();
  //   navigate(ROUTES.DASHBOARD);
  // };

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
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: `${theme.overlay}CC` }}
        >
          <div
            ref={modalRef}
            className="w-full max-w-lg transform rounded-xl shadow-2xl transition-all"
            style={{ backgroundColor: theme.card }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-6"
              style={{ borderBottom: `1px solid ${theme.border}` }}
            >
              <div className="flex items-center">
                <LinkIcon
                  className="mr-3 h-5 w-5"
                  style={{ color: theme.accent }}
                />
                <h2
                  className="text-xl font-semibold"
                  style={{ color: theme.primaryText }}
                >
                  Add Video Source
                </h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                style={{
                  color: theme.secondaryText,
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.cardHover;
                  e.currentTarget.style.color = theme.primaryText;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = theme.secondaryText;
                }}
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* URL Input */}
              <div className="mb-6">
                <label
                  htmlFor="url-input"
                  className="text-sm"
                  style={{ color: theme.secondaryText }}
                >
                  YouTube URL
                </label>
                <div className="mt-2 relative">
                  <input
                    id="url-input"
                    type="text"
                    value={url}
                    onChange={handleUrlChange}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="mt-2 w-full rounded-lg border px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      backgroundColor: theme.input,
                      borderColor: theme.border,
                      color: theme.primaryText,
                    }}
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center my-6">
                <div
                  className="flex-1"
                  style={{ borderTop: `1px solid ${theme.border}` }}
                ></div>
                <div
                  className="px-3 text-sm font-medium"
                  style={{ color: theme.mutedText }}
                >
                  or
                </div>
                <div
                  className="flex-1"
                  style={{ borderTop: `1px solid ${theme.border}` }}
                ></div>
              </div>

              {/* Suggested Videos */}
              <div className="mb-6">
                <h3
                  className="text-sm font-medium mb-4"
                  style={{ color: theme.secondaryText }}
                >
                  Suggested Videos
                </h3>
                {isLoadingSuggestions ? (
                  <div className="flex items-center justify-center py-8">
                    <LoadingIcon
                      className="h-6 w-6 animate-spin"
                      style={{ color: theme.secondaryText }}
                    />
                    <span
                      className="ml-2 text-sm"
                      style={{ color: theme.secondaryText }}
                    >
                      Loading suggestions...
                    </span>
                  </div>
                ) : suggestionsError ? (
                  <p className="text-sm" style={{ color: theme.error }}>
                    {suggestionsError}
                  </p>
                ) : suggestedVideos.length > 0 ? (
                  <div className="space-y-3">
                    {suggestedVideos.map((video, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedVideoClick(video)}
                        className="w-full text-left p-3 rounded-lg border transition-colors hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        style={{
                          backgroundColor: theme.cardSecondary,
                          borderColor: theme.border,
                          color: theme.primaryText,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            theme.cardHover;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            theme.cardSecondary;
                        }}
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className="flex-shrink-0 w-16 h-12 rounded bg-gray-600 flex items-center justify-center"
                            style={{ backgroundColor: theme.input }}
                          >
                            <span
                              className="text-xs"
                              style={{ color: theme.secondaryText }}
                            >
                              {video.topic.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-sm font-medium truncate"
                              style={{ color: theme.primaryText }}
                            >
                              {video.title}
                            </p>
                            <p
                              className="text-xs"
                              style={{ color: theme.secondaryText }}
                            >
                              {video.topic}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm" style={{ color: theme.secondaryText }}>
                    No suggestions available at the moment.
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-sm font-medium rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                  style={{
                    backgroundColor: "transparent",
                    borderColor: theme.border,
                    color: theme.secondaryText,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.cardHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!url.trim() || isLoading}
                  className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor:
                      url.trim() && !isLoading ? theme.accent : theme.input,
                    color: theme.primaryText,
                  }}
                  onMouseEnter={(e) => {
                    if (url.trim() && !isLoading) {
                      e.currentTarget.style.backgroundColor = theme.accentHover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (url.trim() && !isLoading) {
                      e.currentTarget.style.backgroundColor = theme.accent;
                    }
                  }}
                >
                  {isLoading ? "Adding..." : "Add Video"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OutOfSyllabus Modal */}
      {showOutOfSyllabus && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center"
          style={{ backgroundColor: `${theme.overlay}CC` }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowOutOfSyllabus(false);
            }
          }}
        >
          <OutOfSyllabus
            onGoBack={() => {
              console.log("Closing OutOfSyllabus modal");
              setShowOutOfSyllabus(false);
            }}
          />
        </div>
      )}
    </>
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
