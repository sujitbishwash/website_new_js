import React, { useState, useEffect, useCallback } from 'react';
import styles from './Flashcard.module.css';

interface FlashcardProps {
  videoId: string;
}

interface Card {
  id: number;
  question: string;
  answer: string;
  hint: string;
  starred: boolean;
}

const Flashcard: React.FC<FlashcardProps> = ({ videoId }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cards, setCards] = useState<Card[]>([]);
  const [isHintVisible, setIsHintVisible] = useState(false);
  const [isManageModalVisible, setIsManageModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sample cards - In a real app, these would come from an API
  const sampleCards: Card[] = [
    {
      id: 1,
      question: "What is the powerhouse of the cell?",
      answer: "Mitochondria",
      hint: "It generates most of the cell's supply of ATP.",
      starred: false
    },
    {
      id: 2,
      question: "What is the chemical symbol for water?",
      answer: "H₂O",
      hint: "Two hydrogen atoms and one oxygen atom.",
      starred: false
    },
    {
      id: 3,
      question: "In which year did World War II end?",
      answer: "1945",
      hint: "The war lasted from 1939 to this year.",
      starred: true
    },
    {
      id: 4,
      question: "Who wrote 'Romeo and Juliet'?",
      answer: "William Shakespeare",
      hint: "A famous English playwright.",
      starred: false
    },
    {
      id: 5,
      question: "What is the largest planet in our solar system?",
      answer: "Jupiter",
      hint: "It's a gas giant.",
      starred: false
    }
  ];

  const loadCards = useCallback(async () => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call using the videoId
      // const response = await fetch(`/api/flashcards/${videoId}`);
      // const data = await response.json();
      // setCards(data);

      // For now, we'll use sample cards
      setCards(sampleCards);
    } catch (error) {
      console.error('Error loading cards:', error);
    } finally {
      setIsLoading(false);
    }
  }, [videoId]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const showNextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
    setIsHintVisible(false);
  };

  const showPrevCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
    setIsHintVisible(false);
  };

  const shuffleCards = () => {
    const shuffledCards = [...cards];
    for (let i = shuffledCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
    }
    setCards(shuffledCards);
    setCurrentCardIndex(0);
    setIsHintVisible(false);
  };

  const toggleStarCurrentCard = () => {
    if (cards.length === 0) return;

    const updatedCards = [...cards];
    updatedCards[currentCardIndex] = {
      ...updatedCards[currentCardIndex],
      starred: !updatedCards[currentCardIndex].starred
    };
    setCards(updatedCards);
  };

  const editCurrentCard = () => {
    if (cards.length === 0) return;
    // In a real app, this would open an edit modal or form
  };

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (isManageModalVisible) return;

    if (event.key === 'ArrowRight') {
      showNextCard();
    } else if (event.key === 'ArrowLeft') {
      showPrevCard();
    } else if (event.key === 's' || event.key === 'S') {
      if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        event.preventDefault();
        toggleStarCurrentCard();
      }
    } else if (event.key === 'h' || event.key === 'H') {
      if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        event.preventDefault();
        setIsHintVisible(prev => !prev);
      }
    }
  }, [isManageModalVisible]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  if (isLoading) {
    return (
      <div className={styles.flashcardAppContainer}>
        <div className={styles.flashcardAppHeader}>
          <h1>Loading flashcards...</h1>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className={styles.flashcardAppContainer}>
        <div className={styles.flashcardAppHeader}>
          <h1>No flashcards available</h1>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];

  return (
    <div className={styles.flashcardAppContainer}>
      <div className={styles.flashcardAppHeader}>
        <h1>Flashcard Study Session</h1>
      </div>

      <div className={styles.flashcardComponent}>
        <div className={styles.flashcardMainArea}>
          <button
            className={`${styles.flashcardNavArrow} ${styles.prev}`}
            onClick={showPrevCard}
            aria-label="Previous card"
          >
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>

          <div className={styles.flashcard}>
            <div className={styles.flashcardTopBar}>
              <button
                className={styles.flashcardHintBtn}
                onClick={() => setIsHintVisible(!isHintVisible)}
              >
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path fill="currentColor" d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
                </svg>
                Hint
              </button>
              <div className={styles.flashcardActionsIcons}>
                <button
                  className={styles.flashcardIconBtn}
                  onClick={editCurrentCard}
                  aria-label="Edit card"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                  </svg>
                </button>
                <button
                  className={`${styles.flashcardIconBtn} ${currentCard.starred ? styles.starred : ''}`}
                  onClick={toggleStarCurrentCard}
                  aria-label="Star card"
                >
                  <svg className={styles.starEmpty} viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" />
                  </svg>
                  <svg className={styles.starFilled} viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className={styles.flashcardContent}>
              <p className={styles.flashcardQuestion}>{currentCard.question}</p>
            </div>

            <div className={styles.flashcardBottomBar}>
              <span className={styles.flashcardNavIndicators}>
                {currentCardIndex + 1} / {cards.length}
              </span>
            </div>
          </div>

          <button
            className={`${styles.flashcardNavArrow} ${styles.next}`}
            onClick={showNextCard}
            aria-label="Next card"
          >
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
            </svg>
          </button>
        </div>

        {isHintVisible && (
          <div className={`${styles.flashcardHintPopup} ${styles.visible}`}>
            <p>{currentCard.hint}</p>
            <button
              className={styles.closePopupBtn}
              onClick={() => setIsHintVisible(false)}
            >
              &times;
            </button>
          </div>
        )}

        <div className={styles.flashcardActionButtons}>
          <button
            className={`${styles.actionBtn} ${currentCard.starred ? styles.starred : ''}`}
            onClick={toggleStarCurrentCard}
          >
            <svg className={styles.starEmpty} viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" />
            </svg>
            <svg className={styles.starFilled} viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            Star
          </button>
          <button
            className={styles.actionBtn}
            onClick={() => setIsManageModalVisible(true)}
          >
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
            Manage
          </button>
          <button
            className={styles.actionBtn}
            onClick={shuffleCards}
          >
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
            </svg>
            Shuffle
          </button>
        </div>
      </div>

      {isManageModalVisible && (
        <div
          className={styles.modalOverlay}
          style={{ display: 'flex' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsManageModalVisible(false);
            }
          }}
        >
          <div className={styles.modalContent}>
            <h2>Manage Cards</h2>
            <p>This is a mock modal for managing flashcard sets.</p>
            <p>Future options could include:</p>
            <ul>
              <li>Add new card</li>
              <li>Edit existing card</li>
              <li>Delete card</li>
              <li>Import/Export set</li>
            </ul>
            <button
              className={`${styles.modalCloseBtn} ${styles.actionBtn}`}
              onClick={() => setIsManageModalVisible(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcard;
