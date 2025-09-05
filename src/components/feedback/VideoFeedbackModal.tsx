import { Angry, Frown, Laugh, Meh, Smile, X } from "lucide-react";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { feedbackApi, FeedbackRequest, FeedbackChipsResponse } from "@/lib/api-client";

// --- TYPE DEFINITIONS ---

export type FeedbackComponent =
  | "Chat"
  | "Flashcard"
  | "Quiz"
  | "Summary"
  | "Video"
  | "Test"
  | "TestAnalysis"
  | "VideoRecommendation"
  | "TestRecommentation"
  | "SnippetRecommendation";

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
  const colorClasses: Record<number, string> = {
    1: "text-red-500",
    2: "text-orange-400",
    3: "text-yellow-400",
    4: "text-lime-400",
    5: "text-green-500",
  };

  const colorClass = active
    ? colorClasses[rating] || colorClasses[3]
    : "text-gray-300 dark:text-gray-600";

  const baseIconClass = `w-9 h-9 sm:w-14 sm:h-14 transition-colors ${colorClass} ${className}`;

  const icons: Record<number, React.ReactElement> = {
    1: <Angry className={baseIconClass} />, // Terrible
    2: <Frown className={baseIconClass} />, // Not Good
    3: <Meh className={baseIconClass} />, // Okay
    4: <Smile className={baseIconClass} />, // Good
    5: <Laugh className={baseIconClass} />, // Excellent
  };

  // Ensure rating is a valid key, fallback to neutral (3) if not
  const validRating = (rating >= 1 && rating <= 5) ? rating : 3;
  return icons[validRating];
};


// --- MAIN COMPONENT ---

const VideoFeedbackModal: React.FC<VideoFeedbackModalProps> = ({
  isOpen,
  onClose,
  videoId,
  initialRating = null,
  initialComment = "",
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
  const [allChips, setAllChips] = useState<FeedbackChipsResponse>({});
  const [chipsLoading, setChipsLoading] = useState(false);
  const [chipsError, setChipsError] = useState<string>("");

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
      componentName,
      componentNameType: typeof componentName,
    });
  }, [
    parentCanSubmitFeedback,
    canSubmitFeedback,
    existingFeedback,
    hasExistingFeedback,
    videoId,
    componentName,
  ]);

  const isLowRating = useMemo(() => rating !== null && rating <= 3, [rating]);
  const showFeedbackArea = useMemo(
    () => isLowRating || showCommentToggle,
    [isLowRating, showCommentToggle]
  );

  // Fetch all feedback chips from API when modal opens
  const fetchAllFeedbackChips = useCallback(async () => {
    try {
      setChipsLoading(true);
      setChipsError("");
      
      // Validate component name
      const validComponents = ["Chat", "Flashcard", "Quiz", "Summary", "Video", "Test", "TestAnalysis", "VideoRecommendation", "TestRecommentation", "SnippetRecommendation"];
      const validComponentName = validComponents.includes(componentName) ? componentName : "Video";
      
      console.log("🎯 Fetching all feedback chips for component:", validComponentName);
      
      const response = await feedbackApi.getFeedbackChips(validComponentName);
      setAllChips(response);
      
      console.log("✅ All feedback chips loaded successfully:", response);
    } catch (error: any) {
      console.error("❌ Failed to fetch feedback chips:", error);
      setChipsError("Failed to load feedback suggestions");
      setAllChips({});
    } finally {
      setChipsLoading(false);
    }
  }, [componentName]);

  // Get dynamic chips by filtering all chips based on current rating
  const dynamicChips = useMemo(() => {
    if (!rating) return [];
    
    // Get chips for the current rating from allChips
    const chipsForRating = allChips[rating.toString()] || [];
    // Extract just the labels from the chip objects
    return chipsForRating.map(chip => chip.label);
  }, [rating, allChips]);

  useEffect(() => {
    if (nudgeVisible) {
      const timer = setTimeout(() => setNudgeVisible(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [nudgeVisible]);

  // Reset form and fetch chips when modal opens
  useEffect(() => {
    if (isOpen) {
      setRating(initialRating);
      setComment(initialComment);
      setSelectedChips([]);
      setShowCommentToggle(false);
      setNudgeVisible(false);
      setSubmissionStatus("idle");
      setAllChips({});
      setChipsError("");
      
      // Fetch all feedback chips for this component
      fetchAllFeedbackChips();
    }
  }, [isOpen, initialRating, initialComment, fetchAllFeedbackChips]);

  const handleChipToggle = (chipLabel: string) => {
    setSelectedChips((prev) =>
      prev.includes(chipLabel)
        ? prev.filter((c) => c !== chipLabel)
        : [...prev, chipLabel]
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
      // Validate component name for API submission
      const validComponents = ["Chat", "Flashcard", "Quiz", "Summary", "Video", "Test", "TestAnalysis", "VideoRecommendation", "TestRecommentation", "SnippetRecommendation"];
      const validComponentName = validComponents.includes(componentName) ? componentName : "Video";
      
      // Transform data for backend API
      const backendPayload: FeedbackRequest = {
        component: validComponentName,
        description:
          comment.trim() || selectedChips.join(", ") || `Rating: ${rating}/5`,
        rating,
        source_id: videoId || "unknown",
        page_url: window.location.href,
      };

      // Send to backend API
      console.log("🚀 Sending feedback to backend:", backendPayload);
      console.log("🔍 Component validation:", { 
        original: componentName, 
        validated: validComponentName,
        isValid: validComponents.includes(componentName)
      });
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

        <form
          onSubmit={handleSubmit}
          
        ><div className="p-6 space-y-6 overflow-y-auto flex-1">
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

                  {/* Dynamic Feedback Chips based on rating */}
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Select up to 3 suggestions:
                    </div>
                    
                    {/* Loading state for chips */}
                    {chipsLoading && (
                      <div className="flex items-center justify-center py-4">
                        <div className="flex items-center space-x-2">
                          <svg
                            className="animate-spin h-4 w-4 text-blue-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Loading suggestions...
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Error state for chips */}
                    {chipsError && (
                      <div className="text-sm text-orange-500 dark:text-orange-400">
                        {chipsError}
                      </div>
                    )}

                    {/* Chips display */}
                    {!chipsLoading && !chipsError && dynamicChips.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {dynamicChips.map((chipLabel, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleChipToggle(chipLabel)}
                            aria-pressed={selectedChips.includes(chipLabel)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 focus-visible:ring-blue-500 feedback-chip ${
                              selectedChips.includes(chipLabel)
                                ? "bg-blue-600 text-white selected"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                            }`}
                          >
                            {chipLabel}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* No chips available message */}
                    {!chipsLoading && !chipsError && dynamicChips.length === 0 && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                        No suggestions available for this rating
                      </div>
                    )}

                    {selectedChips.length > 0 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Selected: {selectedChips.join(', ')}
                      </div>
                    )}
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
        </form>
      </div>
    </div>
  );
};

export default VideoFeedbackModal;
