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

// --- STYLES ---
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    .flashcard-app-container {
      width: 100%;
      max-width: 100%;
      padding: 1rem; /* add some padding for navigation and progress bar */
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    /* --- Flashcard Animation --- */
    @keyframes slideInFromRight {
      from { transform: translateX(100%) rotate(5deg); opacity: 0; }
      to { transform: translateX(0) rotate(0deg); opacity: 1; }
    }
    @keyframes slideInFromLeft {
      from { transform: translateX(-100%) rotate(-5deg); opacity: 0; }
      to { transform: translateX(0) rotate(0deg); opacity: 1; }
    }

    .slide-in-right {
      animation: slideInFromRight 0.5s forwards cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    .slide-in-left {
      animation: slideInFromLeft 0.5s forwards cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    /* --- Flashcard Component --- */
    .flashcard-scene {
      width: 100%;
      height: 420px; /* Increased height for better aspect ratio */
      perspective: 1200px;
    }

    .flashcard {
      width: 100%;
      height: 100%;
      position: relative;
      transform-style: preserve-3d;
      transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      border-radius: 1.5rem; /* More rounded corners */
      box-shadow: 0 0 0 1px ${theme.divider}, 0 25px 50px -12px rgba(0,0,0,0.25);
    }
    
    .flashcard.is-flipped {
      transform: rotateY(180deg);
    }

    .flashcard-face {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 2.5rem;
      box-sizing: border-box;
      background: linear-gradient(145deg, ${theme.cardBackground}, #273449);
      border-radius: 1.5rem;
    }

    .flashcard-face--back {
      transform: rotateY(180deg);
      background: linear-gradient(145deg, #2A3B52, ${theme.cardBackground});
    }
    
    .card-label {
        position: absolute;
        top: 1.5rem;
        left: 2rem;
        font-size: 0.875rem;
        font-weight: 600;
        color: ${theme.accent};
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .card-content {
      /* Dynamic font size using clamp() - adjusted to be smaller */
      /* min: 1.25rem, preferred: 3vw, max: 2.5rem */
      font-size: clamp(1.25rem, 3vw, 2.5rem);
      font-weight: 700;
      text-align: center;
      color: ${theme.primaryText};
      line-height: 1.3;
    }
    
    .card-hint {
        position: absolute;
        bottom: 1.5rem;
        font-size: 0.875rem;
        color: ${theme.secondaryText};
        font-weight: 500;
    }

    /* --- Progress Bar --- */
    .progress-bar-container {
        width: 100%;
        height: 8px;
        background-color: ${theme.progressBarBackground};
        border-radius: 4px;
        overflow: hidden;
    }
    .progress-bar-fill {
        height: 100%;
        background-color: ${theme.accent};
        border-radius: 4px;
        transition: width 0.4s ease-out;
    }

    /* --- Navigation Component --- */
    .navigation-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr); /* Use 3 equal columns for balanced alignment */
      align-items: center;
      gap: 1rem;
    }

    .nav-button {
      background-color: ${theme.cardBackground};
      color: ${theme.secondaryText};
      border: 1px solid ${theme.divider};
      padding: 1rem;
      border-radius: 50%;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 64px;
      height: 64px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
    }
    
    /* Align the first button to the start of its grid cell */
    .navigation-container > .nav-button:first-of-type {
      justify-self: start;
    }

    /* Align the last button to the end of its grid cell */
    .navigation-container > .nav-button:last-of-type {
      justify-self: end;
    }

    .nav-button:hover:not(:disabled) {
      background-color: ${theme.divider};
      color: ${theme.primaryText};
      transform: translateY(-2px);
    }
    
    .nav-button:active:not(:disabled) {
        transform: translateY(0);
    }

    .nav-button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    
    .shuffle-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
        color: ${theme.shuffleIcon};
        transition: color 0.2s, transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .shuffle-button:hover {
        color: ${theme.accent};
        transform: rotate(360deg) scale(1.1);
    }

    .card-counter-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        justify-self: center; /* Center this container in its grid cell */
    }

    .card-counter {
      font-size: 1.125rem;
      font-weight: 600;
      color: ${theme.primaryText};
    }
  `}</style>
);

// --- MODULAR COMPONENTS ---

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const progress = total > 0 ? ((current + 1) / total) * 100 : 0;
  return (
    <div className="progress-bar-container">
      <div
        className="progress-bar-fill"
        style={{ width: `${progress}%` }}
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
      ? "slide-in-right"
      : animationDirection === "left"
      ? "slide-in-left"
      : "";

  return (
    <div className={`flashcard-scene ${animationClass}`} onClick={onFlip}>
      <div className={`flashcard ${isFlipped ? "is-flipped" : ""}`}>
        <div className="flashcard-face flashcard-face--front">
          <span className="card-label">Question</span>
          <p className="card-content">{card.question}</p>
          <span className="card-hint">Click or press Spacebar to flip</span>
        </div>
        <div className="flashcard-face flashcard-face--back">
          <span className="card-label">Answer</span>
          <p className="card-content">{card.answer}</p>
          <span className="card-hint">Click or press Spacebar to flip</span>
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
    <div className="navigation-container">
      <button
        className="nav-button"
        onClick={() => onNavigate("prev")}
        disabled={currentIndex === 0}
        aria-label="Previous card"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>
      <div className="card-counter-container">
        <span className="card-counter">
          {currentIndex + 1} / {totalCards}
        </span>
        <button
          onClick={onShuffle}
          className="shuffle-button"
          aria-label="Shuffle deck"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="16 3 21 3 21 8"></polyline>
            <line x1="4" y1="20" x2="21" y2="3"></line>
            <polyline points="21 16 21 21 16 21"></polyline>
            <line x1="15" y1="15" x2="21" y2="21"></line>
            <line x1="4" y1="4" x2="9" y2="9"></line>
          </svg>
        </button>
      </div>
      <button
        className="nav-button"
        onClick={() => onNavigate("next")}
        disabled={currentIndex === totalCards - 1}
        aria-label="Next card"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

const Flashcards: React.FC = () => {
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
    <>
      <GlobalStyles />
      <div className="flashcard-app-container">
        {cards.length > 0 ? (
          <>
            <Flashcard
              key={cards[currentIndex].id}
              card={cards[currentIndex]}
              isFlipped={isFlipped}
              onFlip={handleFlip}
              animationDirection={animationDirection}
            />
            <ProgressBar current={currentIndex} total={cards.length} />
            <Navigation
              currentIndex={currentIndex}
              totalCards={cards.length}
              onNavigate={handleNavigate}
              onShuffle={handleShuffle}
            />
          </>
        ) : (
          <div className="no-cards-message">
            <p>No flashcards in this deck!</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Flashcards;
