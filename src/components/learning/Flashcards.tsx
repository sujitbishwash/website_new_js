import { ArrowLeft, ArrowRight, Shuffle } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

// Centralized theme colors for a more refined design
const theme = {
  background: "#0F172A", // Darker slate background
  cardBackground: "#1E293B", // Slightly lighter slate for cards
  primaryText: "#F1F5F9", // Off-white for better readability
  secondaryText: "#94A3B8", // Softer secondary text
  accent: "#38BDF8", // A vibrant, light blue accent
  accentDark: "#0EA5E9",
  divider: "#334155",
  shuffleIcon: "#94A3B8",
  progressBarBackground: "#334155",
  success: "#22C55E",
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
  // Optional props to prevent duplicate API calls when passed from parent
  canSubmitFeedback?: boolean;
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

const ProgressBar: React.FC<{ current: number; total: number }> = ({
  current,
  total,
}) => {
  const progressPercentage = (current / total) * 100;
  return (
    <div className="w-full bg-border rounded-full h-2 mb-6">
      <div
        className="bg-primary h-2 rounded-full transition-all duration-500 ease-in-out"
        style={{ width: `${progressPercentage}%` }}
      ></div>
    </div>
  );
};

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
          <span className="absolute top-6 left-8 text-sm font-semibold text-primary uppercase tracking-wider">
            Question
          </span>
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
          <span className="absolute top-6 left-8 text-sm font-semibold text-primary uppercase tracking-wider">
            Answer
          </span>
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

const Flashcards: React.FC<FlashcardsProps> = ({
  canSubmitFeedback: _canSubmitFeedback,
  existingFeedback: _existingFeedback,
  markAsSubmitted: _markAsSubmitted,
}) => {
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<
    "left" | "right" | "none"
  >("none");

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

  return (
    <div className="bg-background font-sans text-foreground w-full max-w-full p-4 border-border box-border flex flex-col gap-5 justify-start items-center">
      <div className="w-full max-w-2xl">
        {cards.length > 0 ? (
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
          </div>
        ) : (
          <div className="no-cards-message">
            <p>No flashcards in this deck!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Flashcards;
