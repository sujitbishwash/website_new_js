import React, { useCallback, useEffect, useState } from "react";
import { useThemeColors } from "../../contexts/ThemeContext";

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
const GlobalStyles = () => {
  const theme = useThemeColors();

  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

      body {
        background-color: ${theme.background};
        color: ${theme.primaryText};
        font-family: 'Inter', sans-serif;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        overflow: hidden;
      }

      .flashcard-app-container {
        width: 100%;
        max-width: 1600px; /* Further increased width for a wider layout */
        padding: 1.5rem;
        box-sizing: border-box;
      }

      .flashcard-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .flashcard {
        width: 100%;
        max-width: 800px;
        height: 400px;
        perspective: 1000px;
        cursor: pointer;
        position: relative;
      }

      .flashcard-inner {
        position: relative;
        width: 100%;
        height: 100%;
        text-align: center;
        transition: transform 0.6s;
        transform-style: preserve-3d;
        border-radius: 20px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      }

      .flashcard.flipped .flashcard-inner {
        transform: rotateY(180deg);
      }

      .flashcard-front,
      .flashcard-back {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        border-radius: 20px;
        font-size: 1.5rem;
        font-weight: 500;
        line-height: 1.6;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }

      .flashcard-front {
        background: linear-gradient(135deg, ${theme.card} 0%, ${theme.cardSecondary} 100%);
        color: ${theme.primaryText};
        border: 2px solid ${theme.border};
      }

      .flashcard-back {
        background: linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentHover} 100%);
        color: ${theme.primaryText};
        transform: rotateY(180deg);
        border: 2px solid ${theme.accent};
      }

      .navigation {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        max-width: 800px;
        gap: 1rem;
      }

      .nav-button {
        background: ${theme.input};
        border: 2px solid ${theme.border};
        color: ${theme.primaryText};
        padding: 1rem 1.5rem;
        border-radius: 12px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 600;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        min-width: 120px;
        justify-content: center;
      }

      .nav-button:hover:not(:disabled) {
        background: ${theme.cardHover};
        border-color: ${theme.accent};
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      }

      .nav-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }

      .shuffle-button {
        background: ${theme.accent};
        border: 2px solid ${theme.accent};
        color: ${theme.primaryText};
        padding: 1rem 1.5rem;
        border-radius: 12px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 600;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        min-width: 120px;
        justify-content: center;
      }

      .shuffle-button:hover {
        background: ${theme.accentHover};
        border-color: ${theme.accentHover};
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      }

      .progress-bar {
        width: 100%;
        max-width: 800px;
        height: 8px;
        background: ${theme.input};
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 1rem;
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, ${theme.accent} 0%, ${theme.accentHover} 100%);
        border-radius: 4px;
        transition: width 0.3s ease;
      }

      .progress-text {
        text-align: center;
        font-size: 1rem;
        font-weight: 600;
        color: ${theme.secondaryText};
        margin-bottom: 1rem;
      }

      .card-counter {
        text-align: center;
        font-size: 1.2rem;
        font-weight: 600;
        color: ${theme.accent};
        margin-bottom: 1rem;
      }

      .flip-hint {
        text-align: center;
        font-size: 0.9rem;
        color: ${theme.mutedText};
        margin-top: 1rem;
        font-style: italic;
      }

      .keyboard-hint {
        text-align: center;
        font-size: 0.8rem;
        color: ${theme.mutedText};
        margin-top: 0.5rem;
        opacity: 0.7;
      }

      @media (max-width: 768px) {
        .flashcard-app-container {
          padding: 1rem;
        }

        .flashcard {
          height: 300px;
        }

        .flashcard-front,
        .flashcard-back {
          font-size: 1.2rem;
          padding: 1.5rem;
        }

        .navigation {
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-button,
        .shuffle-button {
          width: 100%;
          min-width: auto;
        }
      }
    `}</style>
  );
};

// --- MODULAR COMPONENTS ---

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const progress = total > 0 ? ((current + 1) / total) * 100 : 0;
  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${progress}%` }}></div>
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
    <div className="navigation">
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
