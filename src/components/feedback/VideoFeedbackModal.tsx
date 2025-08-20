import React, { useEffect, useMemo, useState } from "react";

// --- TYPE DEFINITIONS ---

export interface FeedbackChip {
  id: string;
  label: string;
  category: 'technical' | 'content' | 'experience' | 'positive';
}

export interface VideoFeedbackPayload {
  rating: number;
  comment?: string;
  chips?: string[];
  videoId?: string;
  createdAt: string;
  sessionDuration?: number;
  watchPercentage?: number;
}

export interface VideoFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId?: string;
  videoTitle?: string;
  initialRating?: number | null;
  initialComment?: string;
  suggestedChips?: FeedbackChip[];
  sessionStartTime?: Date;
  watchPercentage?: number;
  onSubmit: (payload: VideoFeedbackPayload) => void;
  onSkip?: () => void;
  onDismiss?: () => void;
}

// --- HELPER COMPONENTS & CONSTANTS ---

const StarIcon: React.FC<{ filled: boolean; className?: string }> = ({
  filled,
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={`w-8 h-8 sm:w-10 sm:h-10 ${
      filled ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
    } ${className}`}
  >
    <path
      fill="currentColor"
      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"
    />
  </svg>
);

const CloseIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

// Default chips with categories for better organization
const DEFAULT_CHIPS: FeedbackChip[] = [
  // Technical issues
  { id: "audio-issues", label: "Audio issues", category: "technical" },
  { id: "video-quality", label: "Poor video quality", category: "technical" },
  { id: "buffering", label: "Buffering problems", category: "technical" },
  
  // Content issues
  { id: "too-fast", label: "Too fast", category: "content" },
  { id: "too-slow", label: "Too slow", category: "content" },
  { id: "confusing", label: "Confusing explanation", category: "content" },
  { id: "missing-steps", label: "Missing steps", category: "content" },
  { id: "wrong-example", label: "Wrong example", category: "content" },
  { id: "slides-missing", label: "Slides missing", category: "content" },
  { id: "too-basic", label: "Too basic", category: "content" },
  { id: "too-advanced", label: "Too advanced", category: "content" },
  
  // Experience issues
  { id: "boring", label: "Boring", category: "experience" },
  { id: "repetitive", label: "Repetitive", category: "experience" },
  { id: "too-long", label: "Too long", category: "experience" },
  
  // Positive feedback
  { id: "great-pace", label: "Great pace", category: "positive" },
  { id: "clear-explanation", label: "Clear explanation", category: "positive" },
  { id: "helpful-examples", label: "Helpful examples", category: "positive" },
  { id: "engaging", label: "Engaging", category: "positive" },
  { id: "well-structured", label: "Well structured", category: "positive" },
];

// --- MAIN COMPONENT ---

const VideoFeedbackModal: React.FC<VideoFeedbackModalProps> = ({
  isOpen,
  onClose,
  videoId,
  videoTitle,
  initialRating = null,
  initialComment = "",
  suggestedChips = DEFAULT_CHIPS,
  sessionStartTime,
  watchPercentage,
  onSubmit,
  onSkip,
  onDismiss,
}) => {
  const [rating, setRating] = useState<number | null>(initialRating);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>(initialComment);
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [showCommentToggle, setShowCommentToggle] = useState(false);
  const [nudgeVisible, setNudgeVisible] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const isLowRating = useMemo(() => rating !== null && rating <= 3, [rating]);
  const showFeedbackArea = useMemo(
    () => isLowRating || showCommentToggle,
    [isLowRating, showCommentToggle]
  );

  // Calculate session duration
  const sessionDuration = useMemo(() => {
    if (!sessionStartTime) return undefined;
    return Math.floor((Date.now() - sessionStartTime.getTime()) / 1000);
  }, [sessionStartTime]);

  // Filter chips by category
  const filteredChips = useMemo(() => {
    if (activeCategory === "all") return suggestedChips;
    return suggestedChips.filter(chip => chip.category === activeCategory);
  }, [suggestedChips, activeCategory]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(suggestedChips.map(chip => chip.category))];
    return ["all", ...cats];
  }, [suggestedChips]);

  useEffect(() => {
    if (nudgeVisible) {
      const timer = setTimeout(() => setNudgeVisible(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [nudgeVisible]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setRating(initialRating);
      setComment(initialComment);
      setSelectedChips([]);
      setShowCommentToggle(false);
      setNudgeVisible(false);
      setSubmissionStatus("idle");
      setActiveCategory("all");
    }
  }, [isOpen, initialRating, initialComment]);

  const handleChipToggle = (chipId: string) => {
    setSelectedChips((prev) =>
      prev.includes(chipId) ? prev.filter((c) => c !== chipId) : [...prev, chipId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === null) return;

    const isCommentEmpty = comment.trim().length === 0;
    const areChipsEmpty = selectedChips.length === 0;

    if (isLowRating && isCommentEmpty && areChipsEmpty && !nudgeVisible) {
      setNudgeVisible(true);
      return;
    }

    setSubmissionStatus("submitting");

    try {
      const payload: VideoFeedbackPayload = {
        rating,
        comment: comment.trim() || undefined,
        chips: selectedChips.length > 0 ? selectedChips : undefined,
        videoId,
        createdAt: new Date().toISOString(),
        sessionDuration,
        watchPercentage,
      };

      await onSubmit(payload);
      setSubmissionStatus("success");
      
      // Auto-close after success
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      setSubmissionStatus("error");
    }
  };

  const handleSkip = () => {
    onSkip?.();
    onClose();
  };

  const handleDismiss = () => {
    onDismiss?.();
    onClose();
  };

  if (!isOpen) return null;

  if (submissionStatus === "success") {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="w-full max-w-lg p-8 text-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
            Thank you!
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Your feedback helps us improve our content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">
              How was this video?
            </h2>
            {videoTitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                {videoTitle}
              </p>
            )}
          </div>
          <button
            onClick={handleDismiss}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Session Info */}
          {(sessionDuration || watchPercentage) && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                {sessionDuration && (
                  <span>Watch time: {Math.floor(sessionDuration / 60)}m {sessionDuration % 60}s</span>
                )}
                {watchPercentage && (
                  <span>Watched: {Math.round(watchPercentage)}%</span>
                )}
              </div>
            </div>
          )}

          {/* Star Rating */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Rate your experience with this video
            </p>
            <div
              className="flex justify-center space-x-1 sm:space-x-2"
              onMouseLeave={() => setHoverRating(null)}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  aria-label={`Rate ${star} out of 5`}
                  onMouseEnter={() => setHoverRating(star)}
                  onClick={() => setRating(star)}
                  className="p-1 rounded-full transition-transform duration-200 ease-in-out hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-offset-gray-800"
                >
                  <StarIcon filled={(hoverRating ?? rating ?? 0) >= star} />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Area */}
          {rating !== null && (
            <div className="relative">
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  showFeedbackArea ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="space-y-4 pt-2">
                  <label className="font-semibold text-gray-700 dark:text-gray-300">
                    {isLowRating
                      ? "What could be improved?"
                      : "Any additional thoughts?"}
                  </label>

                  {/* Category Filter */}
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setActiveCategory(category)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                          activeCategory === category
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {category === "all" ? "All" : category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* Chips */}
                  <div className="flex flex-wrap gap-2">
                    {filteredChips.map((chip) => (
                      <button
                        key={chip.id}
                        type="button"
                        onClick={() => handleChipToggle(chip.id)}
                        aria-pressed={selectedChips.includes(chip.id)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 focus-visible:ring-blue-500 ${
                          selectedChips.includes(chip.id)
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>

                  {/* Comment Textarea */}
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us more (optional)..."
                    rows={3}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                  />

                  {/* Nudge Message */}
                  <div
                    aria-live="polite"
                    className="h-4 text-center text-sm text-blue-600 dark:text-blue-400 transition-opacity duration-300"
                  >
                    {nudgeVisible && (
                      <span>Any short note helps — optional.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Optional Comment Toggle for High Ratings */}
              {!isLowRating && !showCommentToggle && (
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => setShowCommentToggle(true)}
                    className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus-visible:ring-2 rounded focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 focus-visible:ring-blue-500"
                  >
                    Add optional comment
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleSkip}
              className="px-6 py-2.5 text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 focus-visible:ring-gray-400"
            >
              Maybe Later
            </button>
            <button
              type="submit"
              disabled={rating === null || submissionStatus === "submitting"}
              className="flex-1 px-8 py-2.5 text-sm sm:text-base font-bold text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 focus-visible:ring-blue-500 disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {submissionStatus === "submitting" ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Submitting...
                </div>
              ) : (
                "Submit Feedback"
              )}
            </button>
          </div>

          {/* Error Message */}
          {submissionStatus === "error" && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">
                Failed to submit feedback. Please try again.
              </p>
            </div>
          )}
        </form>

        {/* Screen-reader only announcements */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {rating !== null && `Rated ${rating} out of 5 stars.`}
        </div>
      </div>
    </div>
  );
};

// --- CONDENSED FEEDBACK COMPONENT ---
export interface CondensedFeedbackProps {
  videoId?: string;
  videoTitle?: string;
  watchPercentage?: number;
  sessionDuration?: number;
  onFeedbackSubmit: (payload: VideoFeedbackPayload) => void;
  onFeedbackSkip?: () => void;
  className?: string;
}

export const CondensedFeedback: React.FC<CondensedFeedbackProps> = ({
  videoId,
  videoTitle,
  watchPercentage,
  sessionDuration,
  onFeedbackSubmit,
  onFeedbackSkip,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === null) return;

    setSubmissionStatus("submitting");
    try {
      const payload: VideoFeedbackPayload = {
        rating,
        comment: comment.trim() || undefined,
        chips: selectedChips.length > 0 ? selectedChips : undefined,
        videoId,
        createdAt: new Date().toISOString(),
        sessionDuration,
        watchPercentage,
      };

      await onFeedbackSubmit(payload);
      setSubmissionStatus("success");
      setIsOpen(false);
      
      // Reset form
      setTimeout(() => {
        setRating(null);
        setSelectedChips([]);
        setComment("");
        setSubmissionStatus("idle");
      }, 1000);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      setSubmissionStatus("error");
    }
  };

  const handleSkip = () => {
    onFeedbackSkip?.();
    setIsOpen(false);
  };

  const handleChipToggle = (chipId: string) => {
    setSelectedChips(prev => 
      prev.includes(chipId) 
        ? prev.filter(id => id !== chipId)
        : [...prev, chipId]
    );
  };

  const isLowRating = rating !== null && rating <= 3;
  const showFeedbackArea = rating !== null && (isLowRating || selectedChips.length > 0 || comment.trim());

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
        title="Rate this video"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        Rate
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-card border border-gray-700 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-200">Rate this video</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Session Info */}
            {(sessionDuration || watchPercentage) && (
              <div className="mb-3 p-2 bg-gray-800 rounded text-xs text-gray-400">
                {sessionDuration && <span>Watch: {Math.floor(sessionDuration / 60)}m {sessionDuration % 60}s</span>}
                {watchPercentage && <span className="ml-2">• {Math.round(watchPercentage)}%</span>}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Star Rating */}
              <div className="text-center mb-3">
                <div className="flex justify-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      <StarIcon filled={(rating ?? 0) >= star} className="w-6 h-6" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Area */}
              {rating !== null && (
                <div className="space-y-3">
                  <label className="text-xs font-medium text-gray-300">
                    {isLowRating ? "What could be improved?" : "Any thoughts?"}
                  </label>

                  {/* Quick Chips */}
                  <div className="flex flex-wrap gap-1">
                    {DEFAULT_CHIPS.slice(0, 8).map((chip) => (
                      <button
                        key={chip.id}
                        type="button"
                        onClick={() => handleChipToggle(chip.id)}
                        className={`px-2 py-1 text-xs rounded-full transition-colors ${
                          selectedChips.includes(chip.id)
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>

                  {/* Comment */}
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Optional comment..."
                    rows={2}
                    className="w-full p-2 text-xs bg-gray-800 border border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  />

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2 border-t border-gray-700">
                    <button
                      type="button"
                      onClick={handleSkip}
                      className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded transition-colors"
                    >
                      Skip
                    </button>
                    <button
                      type="submit"
                      disabled={rating === null || submissionStatus === "submitting"}
                      className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                    >
                      {submissionStatus === "submitting" ? "Sending..." : "Submit"}
                    </button>
                  </div>

                  {/* Status Messages */}
                  {submissionStatus === "success" && (
                    <div className="text-xs text-green-400 text-center">✓ Thank you!</div>
                  )}
                  {submissionStatus === "error" && (
                    <div className="text-xs text-red-400 text-center">Failed to submit</div>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoFeedbackModal;
