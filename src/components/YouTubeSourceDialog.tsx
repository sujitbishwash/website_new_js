import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SuggestedVideo, validateUrl, videoApi } from "../lib/api-client";
import { ROUTES, buildVideoLearningRoute } from "../routes/constants";
import OutOfSyllabus from "./OutOfSyllabus";
import { X } from "lucide-react";

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

      const videos = await videoApi.getSuggestedVideos();
      // Ensure videos is an array before setting state
      if (Array.isArray(videos)) {
        setSuggestedVideos(videos);
      } else {
        console.warn("API returned non-array data:", videos);
        throw new Error("Invalid response format from API");
      }
    } catch (err: any) {
      console.error("Failed to fetch suggested videos:", err.message);
      setSuggestionsError("Failed to load suggested videos");
      setSuggestedVideos([]);
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
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-sm animate-fade-in p-4">
      {/* Modal Panel */}
      <div
        ref={modalRef}
          className="relative w-full max-w-lg rounded-2xl shadow-2xl bg-card flex flex-col md:flex-row overflow-hidden animate-slide-in"
        >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 text-border-high rounded-full hover:bg-foreground/10 hover:text-foreground transition-colors z-10 cursor-pointer"
        >
          <X />
        </button>
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="flex items-center text-lg font-semibold text-foreground">
              <LinkIcon className="mr-3 h-5 w-5 text-muted-foreground" />
              YouTube, Website, Etc.
            </h2>
          </div>
          {/* Body */}

          <div className="mt-6">
            <label
              htmlFor="url-input"
              className="text-sm text-muted-foreground"
            >
              Enter a YouTube Link, Website URL, Doc, ArXiv, Etc.
            </label>
            <input
              id="url-input"
              type="text"
              value={url}
              onChange={handleUrlChange}
              placeholder="https://youtu.be/example"
              className="mt-2 w-full rounded-lg border border-border bg-input px-4 py-2.5 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2"
              disabled={isLoading}
            />

            {/* Error Message */}
            {error && <div className="mt-2 text-sm text-red-400">{error}</div>}

            {/* Separator */}
            <div className="my-6 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-border-high" />
              <div className="px-3 text-sm font-medium text-muted-foreground">
                OR
              </div>
              <div className="w-full border-t border-border-high" />
            </div>

            {/* Video Suggestions */}
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Suggested Videos
                </h3>
                <button
                  onClick={fetchSuggestedVideos}
                  disabled={isLoadingSuggestions}
                  className="text-xs text-primary hover:text-primary/80 disabled:opacity-50"
                >
                  Refresh
                </button>
              </div>

              {isLoadingSuggestions ? (
                <div className="mt-4 flex items-center justify-center py-8">
                  <LoadingIcon className="h-6 w-6 animate-spin text-gray-400" />
                  <span className="ml-2 text-sm text-gray-400">
                    Loading suggestions...
                  </span>
                </div>
              ) : suggestionsError ? (
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
                      className="group cursor-pointer overflow-hidden rounded-lg border border-border bg-none transition-all hover:bg-accent hover:shadow-lg hover:border-primary"
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
                        <p className="truncate font-semibold text-foreground">
                          {video.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {video.topic}
                        </p>
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
              className="rounded-lg bg-border-high px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-border, focus:outline-none focus:ring-2 focus:ring-border-high cursor-pointer"
            >
              Go to Home
            </button>
            <button
              onClick={handleAdd}
              disabled={!url.trim() || isLoading}
              className="rounded-lg bg-border-medium px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-border-medium focus:outline-none focus:ring-2 focus:ring-border-high cursor-pointer disabled:bg-border-border disabled:cursor-not-allowed"
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
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <button
        onClick={() => setIsModalOpen(true)}
        className="rounded-lg bg-primary px-6 py-3 font-semibold text-foreground transition-transform hover:scale-105 active:scale-95"
      >
        Open Source Adder
      </button>

      <AddSourceModal isOpen={isModalOpen} onClose={handleClose} />
    </div>
  );
}
