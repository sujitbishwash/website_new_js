import React, { useState, useEffect, useMemo } from "react";
import { feedbackApi, FeedbackRequest } from "@/lib/api-client";
import { X } from "lucide-react";

// --- TYPE DEFINITIONS ---

export interface FeedbackChip {
  id: string;
  label: string;
  category: 'technical' | 'content' | 'experience' | 'positive';
}

export type FeedbackComponent = "Chat" | "Flashcard" | "Quiz" | "Summary" | "Video" | "Test";

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
  componentName?: FeedbackComponent;
}

// --- HELPER COMPONENTS & CONSTANTS ---

const SmileyIcon: React.FC<{ rating: number; active: boolean; className?: string }> = ({
  rating,
  active,
  className = "",
}) => {
  const faceData = {
    1: { path: 'M 8 15 Q 12 12 16 15', color: 'text-red-500' },
    2: { path: 'M 8 15 Q 12 13.5 16 15', color: 'text-orange-400' },
    3: { path: 'M 8 15 L 16 15', color: 'text-yellow-400' },
    4: { path: 'M 8 15 Q 12 16.5 16 15', color: 'text-lime-400' },
    5: { path: 'M 8 15 Q 12 18 16 15', color: 'text-green-500' },
  };

  const currentFace = faceData[rating as keyof typeof faceData];
  const colorClass = active ? currentFace.color : 'text-gray-300 dark:text-gray-600';

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors ${colorClass} ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9 10h.01" />
      <path d="M15 10h.01" />
      <path d={currentFace.path} />
    </svg>
  );
};
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
        component: componentName,
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

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onDismiss?.();
      onClose();
    }
  };

  if (submissionStatus === "success") {
    return (
      <div 
        className="fixed inset-0 z-[40] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 pointer-events-auto feedback-modal-backdrop"
        onClick={handleBackdropClick}
      >
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 pointer-events-auto" onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 pointer-events-auto m-4 contrast-more:border-2 motion-reduce:animate-none animate-[fadeIn_0.5s_ease-out]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">
              How was this {componentName.toLowerCase()}?
            </h2>
            {/**videoTitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                {videoTitle}
              </p>
            )*/}
            {/* Show existing rating if available */}
            {hasExistingFeedback && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  Previously rated: {displayRating} stars
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((ratingValue) => (
                           <SmileyIcon
                              key={ratingValue}
                              rating={ratingValue}
                              active={ratingValue <= displayRating}
                              className="w-5 h-5 sm:w-5 sm:h-5"
                            />
                        ))}
                </div>
              </div>
            )}
          </div>
          <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-2 text-foreground rounded-full hover:bg-foreground/10 hover:text-foreground transition-colors z-10 cursor-pointer"
        >
          <X />
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
                <span className="font-medium">Update Your Rating</span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                You previously rated this {componentName?.toLowerCase()} with {existingFeedback.rating} stars. 
                Feel free to update your rating and feedback below.
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-300 mt-2">
                Your changes will update the existing feedback
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
              {[1, 2, 3, 4, 5].map(ratingValue => (
                <div key={ratingValue} className="flex flex-col items-center gap-1 w-12">
                    <button type="button" onMouseEnter={() => setHoverRating(ratingValue)} onClick={() => setRating(ratingValue)} className="p-1 rounded-full transition-transform duration-200 ease-in-out enabled:hover:scale-110 motion-reduce:transition-none motion-reduce:hover:transform-none">
                        <SmileyIcon rating={ratingValue} active={(hoverRating ?? rating ?? 0) >= ratingValue} />
                    </button>
                    <span className="text-xs text-gray-500 dark:text-gray-400 h-4">
                        {ratingValue === 1 && 'Terrible'}
                        {ratingValue === 5 && 'Excellent'}
                    </span>
                </div>
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

      
        </form>
    {/* Action Buttons */}
          
      <div className="flex justify-end items-center gap-4 p-5 border-t border-border bg-card rounded-b-2xl">
            <button
              type="button"
              onClick={handleSkip}
              
              className="px-6 py-2.5 text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 focus-visible:ring-gray-400 feedback-button"
            >
              Maybe Later
            </button>
            <button
              type="submit"
                                disabled={rating === null || submissionStatus === "submitting" || !(canSubmitFeedback || existingFeedback)}
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
        {/* Screen-reader only announcements */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {rating !== null && `Rated ${rating} out of 5 stars.`}
        </div>
        
        {/* Inject enhanced styles */}
      </div>
    </div>
  );
};

export default VideoFeedbackModal;
