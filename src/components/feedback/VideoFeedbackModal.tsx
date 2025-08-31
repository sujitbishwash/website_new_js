import { Angry, Frown, Laugh, Meh, Smile, X } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import { feedbackApi, FeedbackRequest } from "@/lib/api-client";

// --- TYPE DEFINITIONS ---

export interface FeedbackChip {
  id: string;
  label: string;
  category: "technical" | "content" | "experience" | "positive";
}

export type FeedbackComponent =
  | "Chat"
  | "Flashcard"
  | "Quiz"
  | "Summary"
  | "Video"
  | "Test";

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

const SmileyIcon: React.FC<{
  rating: number;
  active: boolean;
  className?: string;
}> = ({ rating, active, className = "" }) => {
  const colorClasses = {
    1: "text-red-500",
    2: "text-orange-400",
    3: "text-yellow-400",
    4: "text-lime-400",
    5: "text-green-500",
  };

  const colorClass = active
    ? colorClasses[rating as keyof typeof colorClasses]
    : "text-gray-300 dark:text-gray-600";

  const commonProps = {
    "aria-hidden": "true",
    className: `w-8 h-8 sm:w-10 sm:h-10 transition-colors ${colorClass} ${className}`,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round" as "round",
    strokeLinejoin: "round" as "round",
    viewBox: "0 0 24 24",
  };

  const baseIconClass = `w-9 h-9 sm:w-14 sm:h-14 transition-colors ${colorClass} ${className}`;

  const icons: { [key: number]: JSX.Element } = {
    1: <Angry className={baseIconClass} />, // Terrible
    2: <Frown className={baseIconClass} />, // Not Good
    3: <Meh className={baseIconClass} />, // Okay
    4: <Smile className={baseIconClass} />, // Good
    5: <Laugh className={baseIconClass} />, // Excellent
  };

  return icons[rating] || icons[3]; // Return the specific icon, or neutral as a fallback.
};

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
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Use parent feedback tracker state (no fallback needed since parent always provides state)
  const canSubmitFeedback = parentCanSubmitFeedback ?? true;
  const existingFeedback = parentExistingFeedback ?? null;
  const markAsSubmitted =
    parentMarkAsSubmitted ??
    (() => {
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
      videoId,
    });
  }, [
    parentCanSubmitFeedback,
    canSubmitFeedback,
    existingFeedback,
    hasExistingFeedback,
    videoId,
  ]);

  const isLowRating = useMemo(() => rating !== null && rating <= 3, [rating]);
  const showFeedbackArea = useMemo(
    () => isLowRating || showCommentToggle,
    [isLowRating, showCommentToggle]
  );

  // Filter chips by category
  const filteredChips = useMemo(() => {
    if (activeCategory === "all") return suggestedChips;
    return suggestedChips.filter((chip) => chip.category === activeCategory);
  }, [suggestedChips, activeCategory]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(suggestedChips.map((chip) => chip.category))];
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
      prev.includes(chipId)
        ? prev.filter((c) => c !== chipId)
        : [...prev, chipId]
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

    const description =
      comment.trim() || selectedChips.join(", ") || `Rating: ${rating}/5`;

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
        description:
          comment.trim() || selectedChips.join(", ") || `Rating: ${rating}/5`,
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
            <svg
              className="w-8 h-8 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
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
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-submit/20 backdrop-blur-sm animate-fade-in p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="flex flex-col relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-card rounded-2xl shadow-xl border-1 pointer-events-auto m-4 contrast-more:border-2 motion-reduce:animate-none animate-[fadeIn_0.5s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-border flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">
              How was this {componentName.toLowerCase()}?
            </h2>
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
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300 dark:text-gray-600"
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
            className="absolute top-3 right-3 p-2 text-foreground rounded-full hover:bg-foreground/10 hover:text-foreground transition-colors z-10 cursor-pointer"
          >
            <X />
          </button>
        </div>

        <div
          className="p-6 space-y-6 overflow-y-auto flex-1"
        >
          {/* Already Submitted Warning */}
          {!canSubmitFeedback && existingFeedback && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">Update Your Rating</span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                You previously rated this {componentName?.toLowerCase()} with{" "}
                {existingFeedback.rating} stars. Feel free to update your rating
                and feedback below.
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-300 mt-2">
                Your changes will update the existing feedback
              </p>
            </div>
          )}

          {/* Star Rating */}
          <div className="text-center">
            <p className="text-sm sm:text-lg text-gray-500 dark:text-gray-400 mb-4">
              Rate your experience
            </p>
            <div
              className="flex justify-center space-x-1 sm:space-x-12 feedback-stars"
              onMouseLeave={() => setHoverRating(null)}
              role="radiogroup"
              aria-label="Rate your experience with this video"
            >
              {[1, 2, 3, 4, 5].map((ratingValue) => (
                <button
                  key={ratingValue}
                  type="button"
                  aria-label={`Rate ${ratingValue} out of 5`}
                  aria-pressed={rating === ratingValue}
                  onMouseEnter={() =>
                    (canSubmitFeedback || existingFeedback) &&
                    setHoverRating(ratingValue)
                  }
                  onClick={() =>
                    (canSubmitFeedback || existingFeedback) &&
                    setRating(ratingValue)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      (canSubmitFeedback || existingFeedback) &&
                        setRating(ratingValue);
                    }
                  }}
                  disabled={!(canSubmitFeedback || existingFeedback)}
                  className={`p-1 rounded-full transition-transform duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-offset-gray-800 ${
                    !(canSubmitFeedback || existingFeedback)
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:scale-110"
                  }`}
                >
                  <SmileyIcon
                    rating={ratingValue}
                    active={
                      hoverRating !== null
                        ? ratingValue <= hoverRating
                        : rating !== null
                        ? ratingValue === rating
                        : true
                    }
                  />

                  <span
                    className={`text-xs text-center text-gray-500 dark:text-gray-400 h-4 transition-opacity ${
                      rating === ratingValue || [1, 5].includes(ratingValue)
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    } ${rating === ratingValue ? "font-bold" : ""}`}
                  >
                    {ratingValue === 1 && "Terrible"}
                    {ratingValue === 2 && "Not Good"}
                    {ratingValue === 3 && "Okay"}
                    {ratingValue === 4 && "Good"}
                    {ratingValue === 5 && "Excellent"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Area */}
          {rating !== null && (
            <div className="relative mt-6">
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  showFeedbackArea
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="space-y-4 pt-2">
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block">
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
                        {category === "all"
                          ? "All"
                          : category.charAt(0).toUpperCase() +
                            category.slice(1)}
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
                      placeholder="Tell us more ..."
                      rows={3}
                      maxLength={50}
                      className={`w-full p-2 text-foreground text-2xl bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors resize-none ${
                        comment.length > 45
                          ? "border-orange-300 dark:border-orange-600"
                          : comment.length > 50
                          ? "border-red-300 dark:border-red-600"
                          : "border-1"
                      }`}
                      aria-describedby="description-help description-count"
                    />
                    <div
                      className={`absolute bottom-2 right-2 text-xs ${
                        comment.length > 45
                          ? "text-orange-500"
                          : comment.length > 50
                          ? "text-red-500"
                          : "text-gray-400"
                      }`}
                    >
                      {comment.length}/50
                    </div>
                    <div id="description-help" className="sr-only">
                      {comment.length === 0
                        ? "Required field"
                        : "Optional additional details"}
                    </div>
                    <div id="description-count" className="sr-only">
                      {comment.length} characters out of 50
                    </div>
                  </div>

                  {/* Nudge Message */}
                  {nudgeVisible && (
                    <div
                      aria-live="polite"
                      className="h-4 text-center text-sm text-blue-600 dark:text-blue-400 transition-opacity duration-300"
                    >
                      <span>Any short note helps — optional.</span>
                    </div>
                  )}
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
          {/* Error Message */}
          {submissionStatus === "error" && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg feedback-error">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium text-red-800 dark:text-red-200">
                  Submission Error
                </span>
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
        </div>
        
          {/* Action Buttons */}
          <div className="flex-shrink-0 flex justify-end items-center gap-4 p-5 border-t border-border bg-card rounded-b-2xl">
            <button
              type="button"
              onClick={handleSkip}
              className="px-6 py-2.5 text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 focus-visible:ring-gray-400 feedback-button"
            >
              Maybe Later
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={
                rating === null ||
                submissionStatus === "submitting" ||
                !(canSubmitFeedback || existingFeedback)
              }
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
      </div>
    </div>
  );
};

export default VideoFeedbackModal;
