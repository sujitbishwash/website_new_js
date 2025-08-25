import { Star } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import { feedbackApi, FeedbackRequest } from "@/lib/api-client";

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
  createdAt?: string;
  playPercentage?: number;
}

interface VideoFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId?: string;
  videoTitle?: string;
  initialRating?: number | null;
  initialComment?: string;
  suggestedChips?: FeedbackChip[];
  playPercentage?: number;
  onSubmit: (payload: VideoFeedbackPayload) => Promise<void>;
  onSkip?: () => void;
  onDismiss?: () => void;
  // Optional props to prevent duplicate API calls when passed from parent
  canSubmitFeedback?: boolean;
  existingFeedback?: any;
  markAsSubmitted?: () => void;
  // Component info for display
  componentName?: string;
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
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
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
  playPercentage,
  onSubmit,
  onSkip,
  onDismiss,
  // Optional props to prevent duplicate API calls when passed from parent
  canSubmitFeedback: parentCanSubmitFeedback,
  existingFeedback: parentExistingFeedback,
  markAsSubmitted: parentMarkAsSubmitted,
  // Component info for display
  componentName = "Video",
}) => {
  const [rating, setRating] = useState<number | null>(initialRating);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>(initialComment);
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [showCommentToggle, setShowCommentToggle] = useState(false);
  const [nudgeVisible, setNudgeVisible] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Use parent feedback tracker state (no fallback needed since parent always provides state)
  const canSubmitFeedback = parentCanSubmitFeedback ?? true;
  const existingFeedback = parentExistingFeedback ?? null;
  const markAsSubmitted = parentMarkAsSubmitted ?? (() => {
    console.warn("markAsSubmitted not provided by parent component");
  });

  // Show existing rating if available
  const displayRating = existingFeedback?.rating || rating;
  const hasExistingFeedback = !!existingFeedback;

  // Debug logging for feedback state
  useEffect(() => {
    console.log("🔍 VideoFeedbackModal Debug:", {
      parentCanSubmitFeedback,
      canSubmitFeedback,
      existingFeedback,
      hasExistingFeedback,
      videoId
    });
  }, [parentCanSubmitFeedback, canSubmitFeedback, existingFeedback, hasExistingFeedback, videoId]);

  const isLowRating = useMemo(() => rating !== null && rating <= 3, [rating]);
  const showFeedbackArea = useMemo(
    () => isLowRating || showCommentToggle,
    [isLowRating, showCommentToggle]
  );



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

    // Prevent duplicate submissions
    if (!canSubmitFeedback) {
      console.log("⚠️ User has already submitted feedback for this video");
      setSubmissionStatus("error");
      return;
    }

    // Enhanced validation
    const validationErrors: string[] = [];
    
    if (rating === null) {
      validationErrors.push("Please select a rating");
    }
    
    const description = comment.trim() || selectedChips.join(", ") || `Rating: ${rating}/5`;
    
    if (description.length < 1) {
      validationErrors.push("Please provide a description");
    } else if (description.length > 4000) {
      validationErrors.push("Description must be 4000 characters or less");
    }

    if (validationErrors.length > 0) {
      console.error("Validation errors:", validationErrors);
      setSubmissionStatus("error");
      return;
    }

    const isCommentEmpty = comment.trim().length === 0;
    const areChipsEmpty = selectedChips.length === 0;

    if (isLowRating && isCommentEmpty && areChipsEmpty && !nudgeVisible) {
      setNudgeVisible(true);
      return;
    }

    setSubmissionStatus("submitting");

    try {
      // Transform data for backend API
      const backendPayload: FeedbackRequest = {
        component: "Video",
        description: comment.trim() || selectedChips.join(", ") || `Rating: ${rating}/5`,
        rating,
        source_id: videoId || "unknown",
        page_url: window.location.href,
      };

      // Send to backend API
      console.log("🚀 Sending feedback to backend:", backendPayload);
      await feedbackApi.submitFeedback(backendPayload);
      console.log("✅ Feedback sent to backend successfully");

      // Also call the local onSubmit for any local handling
      const localPayload: VideoFeedbackPayload = {
        rating,
        comment: comment.trim() || undefined,
        chips: selectedChips.length > 0 ? selectedChips : undefined,
        videoId,
        createdAt: new Date().toISOString(),
        playPercentage,
      };

      await onSubmit(localPayload);
      setSubmissionStatus("success");
      
      // Mark feedback as submitted to prevent duplicates
      markAsSubmitted();
      
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
      <div className="fixed inset-0 z-[40] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 pointer-events-none feedback-modal-backdrop">
        <div className="w-full max-w-lg p-8 text-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 animate-fade-in pointer-events-auto feedback-modal feedback-success">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
            Feedback Sent!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Your feedback has been submitted to our servers.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Thank you for helping us improve!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[40] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 pointer-events-none feedback-modal-backdrop">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 animate-fade-in pointer-events-auto feedback-modal">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">
              How was this {componentName.toLowerCase()}?
            </h2>
            {videoTitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                {videoTitle}
              </p>
            )}
            {/* Show existing rating if available */}
            {hasExistingFeedback && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  Previously rated: {displayRating} stars
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${
                        star <= displayRating 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleDismiss}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 feedback-form">
          
          {/* Already Submitted Warning */}
          {!canSubmitFeedback && existingFeedback && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Feedback Already Submitted</span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                You've already rated this video with {existingFeedback.rating} stars. 
                Your previous feedback: "{existingFeedback.description}"
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-300 mt-2">
                Previous feedback submitted
              </p>
            </div>
          )}
          
          {/* Star Rating */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Rate your experience with this video
            </p>
            <div
              className="flex justify-center space-x-1 sm:space-x-2 feedback-stars"
              onMouseLeave={() => setHoverRating(null)}
              role="radiogroup"
              aria-label="Rate your experience with this video"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  aria-label={`Rate ${star} out of 5`}
                  aria-pressed={rating === star}
                  onMouseEnter={() => canSubmitFeedback && setHoverRating(star)}
                  onClick={() => canSubmitFeedback && setRating(star)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      canSubmitFeedback && setRating(star);
                    }
                  }}
                  disabled={!canSubmitFeedback}
                  className={`p-1 rounded-full transition-transform duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-offset-gray-800 ${
                    !canSubmitFeedback 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:scale-110'
                  }`}
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
                        className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors feedback-category ${
                          activeCategory === category
                            ? "bg-blue-600 text-white active"
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
                        className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 focus-visible:ring-blue-500 feedback-chip ${
                          selectedChips.includes(chip.id)
                            ? "bg-blue-600 text-white selected"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>

                  {/* Comment Textarea */}
                  <div className="relative">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tell us more (optional)..."
                      rows={3}
                      maxLength={4000}
                      className={`w-full p-3 bg-gray-50 dark:bg-gray-900/50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none ${
                        comment.length > 3800 ? 'border-orange-300 dark:border-orange-600' : 
                        comment.length > 4000 ? 'border-red-300 dark:border-red-600' : 
                        'border-gray-300 dark:border-gray-600'
                      }`}
                      aria-describedby="description-help description-count"
                    />
                    <div className={`absolute bottom-2 right-2 text-xs ${
                      comment.length > 3800 ? 'text-orange-500' : 
                      comment.length > 4000 ? 'text-red-500' : 
                      'text-gray-400'
                    }`}>
                      {comment.length}/4000
                    </div>
                    <div id="description-help" className="sr-only">
                      {comment.length === 0 ? 'Required field' : 'Optional additional details'}
                    </div>
                    <div id="description-count" className="sr-only">
                      {comment.length} characters out of 4000
                    </div>
                  </div>

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
              className="px-6 py-2.5 text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 focus-visible:ring-gray-400 feedback-button"
            >
              Maybe Later
            </button>
            <button
              type="submit"
              disabled={rating === null || submissionStatus === "submitting" || !canSubmitFeedback}
              className="flex-1 px-8 py-2.5 text-sm sm:text-base font-bold text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 focus-visible:ring-blue-500 disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed feedback-button"
            >
              {submissionStatus === "submitting" ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 feedback-spinner"></div>
                  Sending to Server...
                </div>
              ) : !canSubmitFeedback ? (
                "Feedback Already Submitted"
              ) : (
                "Submit Feedback"
              )}
            </button>
          </div>

          {/* Error Message */}
          {submissionStatus === "error" && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg feedback-error">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-red-800 dark:text-red-200">Submission Error</span>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400 mb-2">
                Failed to submit feedback. Please check the following:
              </p>
              <ul className="text-xs text-red-500 dark:text-red-400 space-y-1">
                <li>• Rating is required</li>
                <li>• Description must be between 1-4000 characters</li>
                <li>• Check your internet connection</li>
                <li>• Ensure you haven't already submitted feedback</li>
              </ul>
            </div>
          )}
        </form>

        {/* Screen-reader only announcements */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {rating !== null && `Rated ${rating} out of 5 stars.`}
        </div>
        
        {/* Inject enhanced styles */}
        <style dangerouslySetInnerHTML={{ __html: enhancedStyles }} />
      </div>
    </div>
  );
};

// --- CONDENSED FEEDBACK COMPONENT ---
export interface CondensedFeedbackProps {
  videoId?: string;
  videoTitle?: string;
  playPercentage?: number;
  onFeedbackSubmit: (payload: VideoFeedbackPayload) => void;
  onFeedbackSkip?: () => void;
  onOpenModal?: () => void;
  className?: string;
  // Optional props to prevent duplicate API calls
  canSubmitFeedback?: boolean;
  existingFeedback?: any;
  markAsSubmitted?: () => void;
}

export const CondensedFeedback: React.FC<CondensedFeedbackProps> = ({
  videoId,
  videoTitle,
  playPercentage,
  onFeedbackSubmit,
  onFeedbackSkip,
  onOpenModal,
  className = "",
  // Optional props to prevent duplicate API calls
  canSubmitFeedback: parentCanSubmitFeedback,
  existingFeedback: parentExistingFeedback,
  markAsSubmitted: parentMarkAsSubmitted,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  // Use parent feedback tracker state (no fallback needed since parent always provides state)
  const canSubmitFeedback = parentCanSubmitFeedback ?? true;
  const existingFeedback = parentExistingFeedback ?? null;
  const markAsSubmitted = parentMarkAsSubmitted ?? (() => {
    console.warn("markAsSubmitted not provided by parent component");
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === null) return;

    // Prevent duplicate submissions
    if (!canSubmitFeedback) {
      console.log("⚠️ User has already submitted feedback for this video");
      setSubmissionStatus("error");
      return;
    }

    // Enhanced validation
    const validationErrors: string[] = [];
    
    if (rating === null) {
      validationErrors.push("Please select a rating");
    }
    
    const description = comment.trim() || selectedChips.join(", ") || `Rating: ${rating}/5`;
    
    if (description.length < 1) {
      validationErrors.push("Please provide a description");
    } else if (description.length > 4000) {
      validationErrors.push("Description must be 4000 characters or less");
    }

    if (validationErrors.length > 0) {
      console.error("Validation errors:", validationErrors);
      setSubmissionStatus("error");
      return;
    }

    setSubmissionStatus("submitting");
    try {
      // Transform data for backend API
      const backendPayload: FeedbackRequest = {
        component: "Video",
        description: comment.trim() || selectedChips.join(", ") || `Rating: ${rating}/5`,
        rating,
        source_id: videoId || "unknown",
        page_url: window.location.href,
      };

      // Send to backend API
      console.log("🚀 Sending feedback to backend:", backendPayload);
      await feedbackApi.submitFeedback(backendPayload);
      console.log("✅ Feedback sent to backend successfully");

      // Also call the local onFeedbackSubmit for any local handling
      const localPayload: VideoFeedbackPayload = {
        rating,
        comment: comment.trim() || undefined,
        chips: selectedChips.length > 0 ? selectedChips : undefined,
        videoId,
        createdAt: new Date().toISOString(),
        playPercentage,
      };

      await onFeedbackSubmit(localPayload);
      setSubmissionStatus("success");
      setIsOpen(false);
      
      // Mark feedback as submitted to prevent duplicates
      markAsSubmitted();
      
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
        onClick={() => {
          if (onOpenModal) {
            onOpenModal();
          } else {
            setIsOpen(!isOpen);
          }
        }}
        disabled={!canSubmitFeedback}
        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
          !canSubmitFeedback
            ? 'text-green-400 bg-green-900/20 cursor-not-allowed'
            : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
        }`}
        title={!canSubmitFeedback ? "Already rated" : "Rate this video"}
      >
        <Star className="w-6 h-6" />
        {!canSubmitFeedback ? "Rated" : "Rate"}
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

            {/* Play Progress Info */}
            {playPercentage && (
              <div className="mb-3 p-2 bg-gray-800 rounded text-xs text-gray-400">
                <span>Play Progress: {Math.round(playPercentage)}%</span>
              </div>
            )}

            {/* Already Submitted Warning */}
            {!canSubmitFeedback && existingFeedback && (
              <div className="mb-3 p-2 bg-green-900/20 border border-green-700 rounded text-xs text-green-400">
                <div className="flex items-center gap-1 mb-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Already Rated</span>
                </div>
                <span>You rated this video {existingFeedback.rating}/5 stars</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Star Rating */}
              <div className="text-center mb-3">
                <div 
                  className="flex justify-center space-x-1 feedback-stars"
                  role="radiogroup"
                  aria-label="Rate this video"
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      aria-label={`Rate ${star} out of 5`}
                      aria-pressed={rating === star}
                      onClick={() => canSubmitFeedback && setRating(star)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          canSubmitFeedback && setRating(star);
                        }
                      }}
                      disabled={!canSubmitFeedback}
                      className={`p-1 transition-transform duration-200 ${
                        !canSubmitFeedback ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
                      }`}
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
                        className={`px-2 py-1 text-xs rounded-full transition-colors feedback-chip ${
                          selectedChips.includes(chip.id)
                            ? "bg-blue-600 text-white selected"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>

                  {/* Comment */}
                  <div className="relative">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Optional comment..."
                      rows={2}
                      maxLength={4000}
                      className={`w-full p-2 text-xs bg-gray-800 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none ${
                        comment.length > 3800 ? 'border-orange-500' : 
                        comment.length > 4000 ? 'border-red-500' : 
                        'border-gray-600'
                      }`}
                      aria-describedby="condensed-description-count"
                    />
                    <div className={`absolute bottom-1 right-1 text-xs ${
                      comment.length > 3800 ? 'text-orange-400' : 
                      comment.length > 4000 ? 'text-red-400' : 
                      'text-gray-500'
                    }`}>
                      {comment.length}/4000
                    </div>
                    <div id="condensed-description-count" className="sr-only">
                      {comment.length} characters out of 4000
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2 border-t border-gray-700">
                    <button
                      type="button"
                      onClick={handleSkip}
                      className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded transition-colors feedback-button"
                    >
                      Skip
                    </button>
                    <button
                      type="submit"
                      disabled={rating === null || submissionStatus === "submitting" || !canSubmitFeedback}
                      className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors feedback-button"
                    >
                      {submissionStatus === "submitting" ? "Sending..." : !canSubmitFeedback ? "Already Rated" : "Submit"}
                    </button>
                  </div>

                  {/* Status Messages */}
                  {submissionStatus === "success" && (
                    <div className="text-xs text-green-400 text-center">✓ Thank you!</div>
                  )}
                  {submissionStatus === "error" && (
                    <div className="text-xs text-red-400 text-center">
                      <div className="mb-1">❌ Failed to submit</div>
                      <div className="text-xs opacity-80">
                        Check rating and description
                      </div>
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
      
      {/* Inject enhanced styles for condensed feedback */}
      <style dangerouslySetInnerHTML={{ __html: enhancedStyles }} />
    </div>
  );
};

// Add enhanced CSS styles for better visual feedback
const enhancedStyles = `
  /* Enhanced feedback form styles */
  .feedback-form textarea:focus {
    border-color: #3b82f6 !important;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
  }
  
  .feedback-form textarea.border-orange-300:focus {
    border-color: #f59e0b !important;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1) !important;
  }
  
  .feedback-form textarea.border-red-300:focus {
    border-color: #ef4444 !important;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
  }
  
  /* Star rating hover effects */
  .feedback-stars button:hover:not(:disabled) {
    transform: scale(1.1);
    transition: transform 0.2s ease-in-out;
  }
  
  /* Character count animations */
  .feedback-char-count {
    transition: color 0.2s ease-in-out;
  }
  
  /* Error message animations */
  .feedback-error {
    animation: slideIn 0.3s ease-out;
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Success message animations */
  .feedback-success {
    animation: fadeIn 0.5s ease-out;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  /* Loading spinner enhancements */
  .feedback-spinner {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  /* Chip selection animations */
  .feedback-chip {
    transition: all 0.2s ease-in-out;
  }
  
  .feedback-chip:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .feedback-chip.selected {
    transform: scale(1.05);
  }
  
  /* Category filter animations */
  .feedback-category {
    transition: all 0.2s ease-in-out;
  }
  
  .feedback-category.active {
    transform: scale(1.05);
  }
  
  /* Button hover effects */
  .feedback-button {
    transition: all 0.2s ease-in-out;
  }
  
  .feedback-button:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  /* Modal backdrop blur */
  .feedback-modal-backdrop {
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
  
  /* Responsive improvements */
  @media (max-width: 640px) {
    .feedback-modal {
      margin: 1rem;
      max-height: calc(100vh - 2rem);
    }
    
    .feedback-stars {
      gap: 0.25rem;
    }
    
    .feedback-stars button {
      padding: 0.25rem;
    }
  }
  
  /* Dark mode enhancements */
  @media (prefers-color-scheme: dark) {
    .feedback-modal {
      background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
      border: 1px solid #374151;
    }
    
    .feedback-form textarea {
      background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
      border-color: #4b5563;
    }
    
    .feedback-form textarea:focus {
      background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
      border-color: #3b82f6;
    }
  }
  
  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .feedback-modal {
      border-width: 2px;
    }
    
    .feedback-button {
      border: 2px solid currentColor;
    }
    
    .feedback-form textarea {
      border-width: 2px;
    }
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .feedback-modal,
    .feedback-button,
    .feedback-stars button,
    .feedback-chip,
    .feedback-category {
      transition: none;
      animation: none;
    }
    
    .feedback-stars button:hover:not(:disabled) {
      transform: none;
    }
    
    .feedback-chip:hover {
      transform: none;
      box-shadow: none;
    }
    
    .feedback-button:hover:not(:disabled) {
      transform: none;
      box-shadow: none;
    }
  }
`;

export default VideoFeedbackModal;
