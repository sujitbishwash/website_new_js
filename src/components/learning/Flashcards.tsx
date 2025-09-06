import { ArrowLeft, ArrowRight, Shuffle } from "lucide-react";
import React, { useCallback, useEffect, useState, useMemo, memo, useRef } from "react";
import VideoFeedbackModal from "@/components/feedback/VideoFeedbackModal";
import { videoApi } from "@/lib/api-client";

// Centralized theme colors for a more refined design

const theme = {
  background: "#111827",
  cardBackground: "#1F2937",
  inputBackground: "#374151",
  primaryText: "#FFFFFF",
  secondaryText: "#9CA3AF",
  mutedText: "#6B7280",
  accent: "#60A5FA",
  divider: "#4B5563",
};

// --- TYPE DEFINITIONS ---
interface Card {
  id: number;
  question: string;
  answer: string;
}

interface FlashcardProps {
  card: Card;
  isFlipped: boolean;
  onFlip: () => void;
  animationDirection: "left" | "right" | "none";
}

interface NavigationProps {
  currentIndex: number;
  totalCards: number;
  onNavigate: (direction: "prev" | "next") => void;
  onShuffle: () => void;
}

interface ProgressBarProps {
  current: number;
  total: number;
}

// Add props interface for feedback state
interface FlashcardsProps {
  // Only videoId is required, feedback props are optional
  videoId: string;
  canSubmitFeedback?: boolean | undefined;
  existingFeedback?: any;
  markAsSubmitted?: () => void;
}

// --- INITIAL DATA ---
const initialCards: Card[] = [
  {
    id: 1,
    question: 'What is a "closure" in JavaScript?',
    answer:
      "A function that remembers the environment in which it was created.",
  },
  {
    id: 2,
    question: "What does the `useEffect` hook do?",
    answer: "It lets you perform side effects in function components.",
  },
  {
    id: 3,
    question: "What is the difference between `let` and `const`?",
    answer:
      "`let` variables can be reassigned, while `const` variables cannot.",
  },
  {
    id: 4,
    question: "What is prop drilling?",
    answer:
      "The process of passing props down through multiple layers of components.",
  },
  {
    id: 5,
    question: "What is the purpose of a `key` in React lists?",
    answer:
      "Keys help React identify which items have changed, are added, or are removed.",
  },
];

// --- MODULAR COMPONENTS ---

const ProgressBar: React.FC<ProgressBarProps> = memo(({
  current,
  total,
}) => {
  const progressPercentage = useMemo(() => (current / total) * 100, [current, total]);
  return (
    <div className="w-full bg-border rounded-full h-2 mb-6">
      <div
        className="bg-primary h-2 rounded-full transition-all duration-500 ease-in-out"
        style={{ width: `${progressPercentage}%` }}
      ></div>
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';

const Flashcard: React.FC<FlashcardProps> = ({
  card,
  isFlipped,
  onFlip,
  animationDirection,
}) => {
  const animationClass =
    animationDirection === "right"
      ? "animate-in slide-in-from-right duration-500"
      : animationDirection === "left"
      ? "animate-in slide-in-from-left duration-500"
      : "";

  const baseFaceClass =
    "absolute w-full h-full flex flex-col justify-center items-center p-10 box-border bg-card rounded-[1.25rem] [backface-visibility:hidden]";

  return (
    <div
      className={`w-full h-[320px] [perspective:1200px] ${animationClass}`}
      onClick={onFlip}
    >
      <div
        className={`w-full h-full relative [transform-style:preserve-3d] transition-transform duration-700 cursor-pointer rounded-[1.25rem] shadow-[0_1px_1px_rgba(0,0,0,0.1),_0_2px_2px_rgba(0,0,0,0.1),_0_4px_4px_rgba(0,0,0,0.1),_0_8px_8px_rgba(0,0,0,0.1),_0_16px_16px_rgba(0,0,0,0.1)] border border-border ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front Face */}
        <div className={baseFaceClass}>
          <div className="absolute top-6 left-8 right-8 flex justify-between items-center">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Question
            </span>
            <span className="text-sm font-semibold text-accent">
              #{card.id}
            </span>
          </div>
          <p
            className="text-[clamp(1.25rem,2.5vw,2rem)]
 font-bold text-center text-foreground leading-tight"
          >
            {card.question}
          </p>
          <span className="absolute bottom-6 text-sm text-muted-foreground font-medium">
            Tap or press Spacebar to flip
          </span>
        </div>

        {/* Back Face */}
        <div className={`${baseFaceClass} [transform:rotateY(180deg)]`}>
          <div className="absolute top-6 left-8 right-8 flex justify-between items-center">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Answer
            </span>
            <span className="text-sm font-semibold text-accent">
              #{card.id}
            </span>
          </div>
          <p
            className="text-[clamp(1.25rem,2.5vw,2rem)]
 font-bold text-center text-foreground leading-tight"
          >
            {card.answer}
          </p>
          <span className="absolute bottom-6 text-sm text-muted-foreground font-medium">
            Tap or press Spacebar to flip
          </span>
        </div>
      </div>
    </div>
  );
};

const Navigation: React.FC<NavigationProps> = ({
  currentIndex,
  totalCards,
  onNavigate,
  onShuffle,
}) => {
  return (
    <div className="items-center mt-6">
      <div className="items-center justify-self-center">
        <span className="text-sm font-semibold text-primary">
          {currentIndex + 1} / {totalCards}
        </span>
      </div>
      <div className="grid grid-cols-3 items-center gap-4 mt-2">
        <button
          className="justify-self-start g-background text-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium transition-colors duration-200 ease-in-out hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed border border-border cursor-pointer"
          onClick={() => onNavigate("prev")}
          disabled={currentIndex === 0}
          aria-label="Previous card"
        >
          <ArrowLeft />
        </button>
        <div className="flex flex-col items-center gap-2 justify-self-center">
          <button
            onClick={onShuffle}
            className="bg-transparent border-none cursor-pointer p-2 text-[#8D8D92] transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:text-[#0A84FF] hover:rotate-180 hover:scale-110"
            aria-label="Shuffle deck"
          >
            <Shuffle />
          </button>
        </div>
        <button
          onClick={() => onNavigate("next")}
          disabled={currentIndex === totalCards - 1}
          aria-label="Next card"
          className="justify-self-end bg-background text-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium transition-colors duration-200 ease-in-out hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed border border-border cursor-pointer"
        >
          <ArrowRight />
        </button>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

const Flashcards: React.FC<FlashcardsProps> = React.memo(({
  videoId,
  canSubmitFeedback,
  existingFeedback,
  markAsSubmitted,
}) => {
  // Debug component mounting (only in development)
  useEffect(() => {
    console.log("🔍 Flashcards Component - Mounted/Re-rendered with props:", {
      videoId,
      canSubmitFeedback,
      existingFeedback: !!existingFeedback,
      hasMarkAsSubmitted: !!markAsSubmitted,
      timestamp: new Date().toISOString()
    });
  }, [videoId]); // Only depend on videoId
  
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [animationDirection, setAnimationDirection] = useState<
    "left" | "right" | "none"
  >("none");

  // Add ref to track if we've already fetched data for this videoId
  const fetchedVideoIdRef = useRef<string | null>(null);
  const isFetchingRef = useRef<boolean>(false);
  const retryCountRef = useRef<number>(0);
  const maxRetries = 2;

  // Fetch flashcards data from API - ULTRA AGGRESSIVE APPROACH
  useEffect(() => {
    const fetchFlashcards = async () => {
      // ULTRA AGGRESSIVE: Only fetch if we haven't fetched this videoId before
      if (!videoId || fetchedVideoIdRef.current === videoId) {
        console.log("🔍 ULTRA AGGRESSIVE: Skipping fetch - already fetched:", { 
          videoId, 
          fetchedVideoId: fetchedVideoIdRef.current
        });
        return;
      }

      // ULTRA AGGRESSIVE: Set fetching flag immediately
      if (isFetchingRef.current) {
        console.log("🔍 ULTRA AGGRESSIVE: Already fetching, skipping");
        return;
      }

      if (!videoId) {
        console.log("🔍 No videoId provided, using demo data");
        setCards(initialCards);
        setIsLoading(false);
        return;
      }

      console.log("🔍 ULTRA AGGRESSIVE: Starting fetch for videoId:", videoId);
      isFetchingRef.current = true;
      fetchedVideoIdRef.current = videoId; // Mark as fetched IMMEDIATELY
      setIsLoading(true);
      setError(null);

      try {
        const response = await videoApi.getVideoFlashcards(videoId);
        
        console.log("📊 Raw flashcards API response:", response);
        
        // Check if response has the expected structure
        if (!response) {
          throw new Error("Empty response from API");
        }

        let transformedCards: Card[] = [];

        // Handle different possible response structures
        if (response.cards && Array.isArray(response.cards)) {
          // Transform API response to our component format (actual API structure)
          transformedCards = response.cards.map((card: any, index: number) => ({
            id: card.id || index + 1,
            question: card.question || "No question available",
            answer: card.answer || "No answer available"
          }));
        } else if ((response as any).flashcards && Array.isArray((response as any).flashcards)) {
          // Transform API response to our component format (expected structure)
          transformedCards = (response as any).flashcards.map((card: any, index: number) => ({
            id: card.id || index + 1,
            question: card.question || "No question available",
            answer: card.answer || "No answer available"
          }));
        } else if (Array.isArray(response)) {
          // If response is directly an array
          transformedCards = response.map((card: any, index: number) => ({
            id: card.id || index + 1,
            question: card.question || "No question available",
            answer: card.answer || "No answer available"
          }));
        } else {
          // Fallback: create cards from available data
          transformedCards = [{
            id: 1,
            question: "No flashcards available",
            answer: "Please try again later or contact support"
          }];
        }

        // If still no data, use demo data
        if (transformedCards.length === 0) {
          console.log("⚠️ No valid flashcards data found, using demo data");
          transformedCards = initialCards;
        }

        setCards(transformedCards);
        setCurrentIndex(0);
        setIsFlipped(false);
        console.log("✅ Flashcards data processed successfully:", transformedCards);
      } catch (err: any) {
        console.error("❌ Error fetching flashcards:", err);
        console.error("❌ Error details:", {
          message: err.message,
          status: err.status,
          response: err.response?.data
        });
        
        setError(err.message || "Failed to load flashcards");
        
        // Fallback to demo data on error
        setCards(initialCards);
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    };

    fetchFlashcards();
  }, [videoId]); // Only fetch when videoId changes

  // Reset refs when component unmounts or videoId changes
  useEffect(() => {
    return () => {
      fetchedVideoIdRef.current = null;
      isFetchingRef.current = false;
      retryCountRef.current = 0;
    };
  }, [videoId]);

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleNavigate = useCallback(
    (direction: "prev" | "next") => {
      setIsFlipped(false);

      // Set animation direction only if there's a card to navigate to
      if (
        (direction === "next" && currentIndex < cards.length - 1) ||
        (direction === "prev" && currentIndex > 0)
      ) {
        setAnimationDirection(direction === "next" ? "right" : "left");
      } else {
        setAnimationDirection("none");
      }

      setCurrentIndex((prevIndex) => {
        if (direction === "next" && prevIndex < cards.length - 1) {
          return prevIndex + 1;
        }
        if (direction === "prev" && prevIndex > 0) {
          return prevIndex - 1;
        }
        return prevIndex;
      });
    },
    [cards.length, currentIndex]
  );

  const handleShuffle = () => {
    const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setAnimationDirection("none");
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        handleNavigate("next");
      } else if (e.key === "ArrowLeft") {
        handleNavigate("prev");
      } else if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        handleFlip();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNavigate]);

  // Feedback tracking for Flashcards - DISABLED to prevent re-renders
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  // Temporarily disable feedback to prevent re-renders
  const feedbackCanSubmitFeedback = false;
  const feedbackExistingFeedback = null;
  const feedbackMarkAsSubmitted = () => {};

  useEffect(() => {
    // Only open feedback modal if:
    // 1. There are cards available
    // 2. User has reached the last card
    // 3. Feedback can be submitted (default to true if undefined)
    // 4. No existing feedback exists
    // 5. Modal is not already open
    if (
      cards.length > 0 &&
      currentIndex === cards.length - 1 &&
      feedbackCanSubmitFeedback && // Must be explicitly true
      !feedbackExistingFeedback &&
      !isFeedbackModalOpen
    ) {
      console.log("🎯 Opening Flashcards feedback modal - user completed all cards");
      setIsFeedbackModalOpen(true);
    } else {
      console.log("🔍 Flashcards feedback modal useEffect - conditions not met:", {
        cardsLength: cards.length,
        currentIndex,
        isLastCard: currentIndex === cards.length - 1,
        canSubmitFeedback: feedbackCanSubmitFeedback,
        existingFeedback: !!feedbackExistingFeedback,
        isFeedbackModalOpen,
        shouldOpen: cards.length > 0 &&
                   currentIndex === cards.length - 1 &&
                   feedbackCanSubmitFeedback &&
                   !feedbackExistingFeedback &&
                   !isFeedbackModalOpen
      });
    }
  }, [cards.length, currentIndex, feedbackCanSubmitFeedback, feedbackExistingFeedback, isFeedbackModalOpen]);

  // Debug logging for feedback state - only log when there are actual changes
  const prevDebugState = useRef({
    cardsLength: 0,
    currentIndex: -1,
    canSubmitFeedback: undefined as boolean | undefined,
    existingFeedback: false,
    isFeedbackModalOpen: false,
    markAsSubmittedExists: false
  });

  useEffect(() => {
    const currentState = {
      cardsLength: cards.length,
      currentIndex,
      canSubmitFeedback: feedbackCanSubmitFeedback,
      existingFeedback: !!feedbackExistingFeedback,
      isFeedbackModalOpen,
      markAsSubmittedExists: !!feedbackMarkAsSubmitted
    };

    // Only log if state actually changed and we have cards
    const hasChanged = JSON.stringify(currentState) !== JSON.stringify(prevDebugState.current);
    
    if (hasChanged && cards.length > 0) {
      console.log("🔍 Flashcards feedback state changed:", {
        ...currentState,
        shouldOpenModal: cards.length > 0 && 
                        currentIndex === cards.length - 1 && 
                        feedbackCanSubmitFeedback && 
                        !feedbackExistingFeedback && 
                        !isFeedbackModalOpen
      });
      prevDebugState.current = currentState;
    }
  }, [cards.length, currentIndex, feedbackCanSubmitFeedback, feedbackExistingFeedback, isFeedbackModalOpen, feedbackMarkAsSubmitted]);

  const handleFeedbackClose = () => {
    console.log("🔍 Flashcards feedback modal closing - setting isFeedbackModalOpen to false");
    setIsFeedbackModalOpen(false);
  };

  const handleFeedbackDismiss = () => {
    console.log("🔍 Flashcards feedback modal dismissed by user");
    setIsFeedbackModalOpen(false);
    // Mark that user has dismissed the feedback request
    if (feedbackMarkAsSubmitted) {
      feedbackMarkAsSubmitted();
    }
  };
  const handleFeedbackSubmit = async (payload: any) => {
    console.log("Flashcards feedback submitted:", payload);
    if (feedbackMarkAsSubmitted) {
      feedbackMarkAsSubmitted();
    }
    setIsFeedbackModalOpen(false);
  };
  const handleFeedbackSkip = () => {
    console.log("Flashcards feedback skipped");
    if (feedbackMarkAsSubmitted) {
      feedbackMarkAsSubmitted();
    }
    setIsFeedbackModalOpen(false);
  };

  // Loading component
  const FlashcardsLoadingSpinner = () => (
    <div className="flex justify-center items-center p-10">
      <div
        className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-accent"
        style={{ borderColor: `${theme.accent} transparent` }}
      ></div>
      <p className="ml-4 text-lg">
        Loading Flashcards...
      </p>
    </div>
  );

  

  return (
    <div className="bg-background font-sans text-foreground w-full max-w-full p-4 border-border box-border flex flex-col gap-5 justify-start items-center">
      <div className="w-full max-w-2xl">
        {isLoading ? (
          <FlashcardsLoadingSpinner />
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-400 mb-4">
              <p className="text-lg font-semibold">Failed to load flashcards</p>
              <p className="text-sm">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : cards.length > 0 ? (
          <div className="flex flex-col ">
            <ProgressBar current={currentIndex} total={cards.length} />
            <Flashcard
              key={cards[currentIndex].id}
              card={cards[currentIndex]}
              isFlipped={isFlipped}
              onFlip={handleFlip}
              animationDirection={animationDirection}
            />

            <Navigation
              currentIndex={currentIndex}
              totalCards={cards.length}
              onNavigate={handleNavigate}
              onShuffle={handleShuffle}
            />
            
            {/* Manual feedback trigger - only show if feedback can be submitted and no existing feedback */}
            {feedbackCanSubmitFeedback && !feedbackExistingFeedback && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => {
                    console.log("🔍 Manual feedback button clicked - opening modal");
                    setIsFeedbackModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                >
                  Rate Flashcards
                </button>
              </div>
            )}
            

            <VideoFeedbackModal
              isOpen={isFeedbackModalOpen}
              onClose={handleFeedbackClose}
              videoId={videoId}
              videoTitle={"Flashcards"}
              playPercentage={100}
              onSubmit={handleFeedbackSubmit}
              onSkip={handleFeedbackSkip}
              onDismiss={handleFeedbackDismiss}
              canSubmitFeedback={feedbackCanSubmitFeedback}
              existingFeedback={feedbackExistingFeedback}
              markAsSubmitted={feedbackMarkAsSubmitted}
              componentName="Flashcard"
            />
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg text-muted-foreground">No flashcards available for this video!</p>
            <p className="text-sm text-muted-foreground mt-2">
              Try watching more of the video or check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

Flashcards.displayName = 'Flashcards';

export default Flashcards;
