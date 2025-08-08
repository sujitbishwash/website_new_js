import React from "react";

// --- Setup ---

// Add Google Font link to the document's head
const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

// TypeScript interfaces for our data structures
interface AnswerOption {
  answerText: string;
  isCorrect: boolean;
}

interface Question {
  questionText: string;
  answerOptions: AnswerOption[];
}

// Centralized theme colors for a polished look
const theme = {
  background: "#0F172A", // Darker slate background
  cardBackground: "#1E293B", // Lighter slate for the card
  inputBackground: "#334155",
  primaryText: "#F1F5F9", // Off-white for main text
  secondaryText: "#94A3B8", // Muted slate for secondary text
  accent: "#38BDF8", // A vibrant sky blue accent
  accentHover: "#7DD3FC",
  buttonGradientFrom: "#0EA5E9",
  buttonGradientTo: "#2563EB",
  divider: "#334155",
  correct: "#22C55E",
  incorrect: "#F43F5E",
};

// --- Data ---
const quizQuestions: Question[] = [
  {
    questionText: "What does CSS stand for?",
    answerOptions: [
      { answerText: "Computer Style Sheets", isCorrect: false },
      { answerText: "Creative Style Sheets", isCorrect: false },
      { answerText: "Cascading Style Sheets", isCorrect: true },
      { answerText: "Colorful Style Sheets", isCorrect: false },
    ],
  },
  {
    questionText: "Which HTML tag is used to define an internal style sheet?",
    answerOptions: [
      { answerText: "<script>", isCorrect: false },
      { answerText: "<style>", isCorrect: true },
      { answerText: "<css>", isCorrect: false },
      { answerText: "<link>", isCorrect: false },
    ],
  },
  {
    questionText:
      'What is the correct syntax for referring to an external script called "xxx.js"?',
    answerOptions: [
      { answerText: '<script src="xxx.js">', isCorrect: true },
      { answerText: '<script href="xxx.js">', isCorrect: false },
      { answerText: '<script name="xxx.js">', isCorrect: false },
      { answerText: '<script file="xxx.js">', isCorrect: false },
    ],
  },
  {
    questionText: "Which company developed JavaScript?",
    answerOptions: [
      { answerText: "Microsoft", isCorrect: false },
      { answerText: "Google", isCorrect: false },
      { answerText: "Sun Microsystems", isCorrect: false },
      { answerText: "Netscape", isCorrect: true },
    ],
  },
];

// --- Reusable Components ---

const ProgressBar: React.FC<{ current: number; total: number }> = ({
  current,
  total,
}) => {
  const progressPercentage = (current / total) * 100;
  const styles = {
    container: {
      width: "100%",
      backgroundColor: theme.inputBackground,
      borderRadius: "10px",
      height: "10px",
      marginBottom: "24px",
      overflow: "hidden",
    },
    filler: {
      height: "100%",
      width: `${progressPercentage}%`,
      backgroundColor: theme.accent,
      borderRadius: "10px",
      transition: "width 0.5s ease-in-out",
    },
  };
  return (
    <div style={styles.container}>
      <div style={styles.filler}></div>
    </div>
  );
};

const ScoreView: React.FC<{
  score: number;
  totalQuestions: number;
  restartQuiz: () => void;
}> = ({ score, totalQuestions, restartQuiz }) => {
  const styles = {
    scoreSection: {
      display: "flex",
      flexDirection: "column" as "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center" as "center",
    },
    scoreText: {
      fontSize: "24px",
      fontWeight: "600" as "600",
      color: theme.secondaryText,
    },
    scoreValue: {
      fontSize: "48px",
      fontWeight: "700" as "700",
      color: theme.primaryText,
      margin: "8px 0 24px 0",
    },
    restartButton: {
      background: `linear-gradient(45deg, ${theme.buttonGradientFrom}, ${theme.buttonGradientTo})`,
      border: "none",
      padding: "12px 24px",
      borderRadius: "12px",
      color: theme.primaryText,
      fontSize: "18px",
      fontWeight: "600" as "600",
      cursor: "pointer",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    },
  };
  return (
    <div style={styles.scoreSection}>
      <div style={styles.scoreText}>Your Score</div>
      <div style={styles.scoreValue}>
        {score} / {totalQuestions}
      </div>
      <button
        style={styles.restartButton}
        onClick={restartQuiz}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.3)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.2)";
        }}
      >
        Try Again
      </button>
    </div>
  );
};

const Navigation: React.FC<{
  handlePrev: () => void;
  handleNext: () => void;
  currentQuestion: number;
  isAnswered: boolean;
}> = ({ handlePrev, handleNext, currentQuestion, isAnswered }) => {
  const styles = {
    navigationContainer: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      marginTop: "24px",
      gap: "12px",
    },
    arrowButton: {
      backgroundColor: theme.inputBackground,
      border: "none",
      color: theme.primaryText,
      width: "44px",
      height: "44px",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "20px",
      fontWeight: "bold" as "bold",
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
    },
  };
  return (
    <div style={styles.navigationContainer}>
      <button
        style={{
          ...styles.arrowButton,
          ...((currentQuestion === 0 || isAnswered) && {
            opacity: 0.4,
            cursor: "not-allowed",
          }),
        }}
        onClick={handlePrev}
        disabled={currentQuestion === 0 || isAnswered}
        onMouseOver={(e) => {
          if (!(currentQuestion === 0 || isAnswered))
            e.currentTarget.style.backgroundColor = theme.divider;
        }}
        onMouseOut={(e) => {
          if (!(currentQuestion === 0 || isAnswered))
            e.currentTarget.style.backgroundColor = theme.inputBackground;
        }}
      >
        {"<"}
      </button>
      <button
        style={{
          ...styles.arrowButton,
          ...(isAnswered && { opacity: 0.4, cursor: "not-allowed" }),
        }}
        onClick={handleNext}
        disabled={isAnswered}
        onMouseOver={(e) => {
          if (!isAnswered)
            e.currentTarget.style.backgroundColor = theme.divider;
        }}
        onMouseOut={(e) => {
          if (!isAnswered)
            e.currentTarget.style.backgroundColor = theme.inputBackground;
        }}
      >
        {">"}
      </button>
    </div>
  );
};

const QuestionView: React.FC<{
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  isAnswered: boolean;
  selectedAnswerIndex: number | null;
  onAnswerClick: (isCorrect: boolean, index: number) => void;
  handlePrev: () => void;
  handleNext: () => void;
}> = ({
  question,
  questionNumber,
  totalQuestions,
  isAnswered,
  selectedAnswerIndex,
  onAnswerClick,
  handlePrev,
  handleNext,
}) => {
  const getButtonStyles = (
    answerOption: AnswerOption,
    index: number
  ): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      width: "100%",
      fontSize: "16px",
      fontWeight: "600",
      color: theme.secondaryText,
      backgroundColor: theme.inputBackground,
      borderRadius: "12px",
      // FIX: Use longhand properties to avoid conflicts
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: "transparent",
      padding: "14px",
      cursor: "pointer",
      textAlign: "left",
      transition: "all 0.2s ease",
    };

    if (isAnswered) {
      const isCorrectAnswer = answerOption.isCorrect;
      const isSelectedAnswer = index === selectedAnswerIndex;

      if (isCorrectAnswer) {
        return {
          ...baseStyle,
          color: theme.primaryText,
          backgroundColor: theme.correct,
          borderColor: theme.correct,
          cursor: "not-allowed",
        };
      }
      if (isSelectedAnswer && !isCorrectAnswer) {
        return {
          ...baseStyle,
          color: theme.primaryText,
          backgroundColor: theme.incorrect,
          borderColor: theme.incorrect,
          cursor: "not-allowed",
        };
      }
      return { ...baseStyle, cursor: "not-allowed", opacity: 0.6 };
    }

    return baseStyle;
  };

  const styles = {
    questionSection: { width: "100%", position: "relative" as "relative" },
    questionCount: {
      marginBottom: "8px",
      fontSize: "16px",
      fontWeight: "600",
      color: theme.accent,
    },
    questionText: {
      marginBottom: "24px",
      fontSize: "22px",
      fontWeight: "600",
      color: theme.primaryText,
    },
    answerSection: {
      width: "100%",
      display: "flex",
      flexDirection: "column" as "column",
      gap: "12px",
    },
  };

  return (
    <>
      <div>
        <ProgressBar current={questionNumber} total={totalQuestions} />
        <div style={styles.questionSection}>
          <div style={styles.questionCount}>
            Question {questionNumber} of {totalQuestions}
          </div>
          <div style={styles.questionText}>{question.questionText}</div>
        </div>
        <div style={styles.answerSection}>
          {question.answerOptions.map((answerOption, index) => (
            <button
              key={index}
              style={getButtonStyles(answerOption, index)}
              onClick={() => onAnswerClick(answerOption.isCorrect, index)}
              disabled={isAnswered}
              onMouseOver={(e) => {
                if (!isAnswered)
                  e.currentTarget.style.borderColor = theme.accent;
              }}
              onMouseOut={(e) => {
                if (!isAnswered)
                  e.currentTarget.style.borderColor = "transparent";
              }}
            >
              {answerOption.answerText}
            </button>
          ))}
        </div>
      </div>
      <Navigation
        handlePrev={handlePrev}
        handleNext={handleNext}
        currentQuestion={questionNumber - 1}
        isAnswered={isAnswered}
      />
    </>
  );
};

// --- Main App Component (Container) ---
const Quiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = React.useState<number>(0);
  const [showScore, setShowScore] = React.useState<boolean>(false);
  const [score, setScore] = React.useState<number>(0);
  const [isAnswered, setIsAnswered] = React.useState<boolean>(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = React.useState<
    number | null
  >(null);

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quizQuestions.length) {
      setCurrentQuestion(nextQuestion);
      setIsAnswered(false);
      setSelectedAnswerIndex(null);
    } else {
      setShowScore(true);
    }
  };

  const handlePrevQuestion = () => {
    const prevQuestion = currentQuestion - 1;
    if (prevQuestion >= 0) {
      setCurrentQuestion(prevQuestion);
      setIsAnswered(false);
      setSelectedAnswerIndex(null);
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showScore || isAnswered) return;
      if (event.key === "ArrowRight") handleNextQuestion();
      else if (event.key === "ArrowLeft") handlePrevQuestion();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentQuestion, showScore, isAnswered]);

  const handleAnswerOptionClick = (isCorrect: boolean, index: number) => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedAnswerIndex(index);
    if (isCorrect) setScore(score + 1);
    setTimeout(() => handleNextQuestion(), 1200);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setIsAnswered(false);
    setSelectedAnswerIndex(null);
  };

  const styles = {
    app: {
      backgroundColor: theme.background,
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column" as "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Poppins', sans-serif",
      padding: "16px",
      color: theme.primaryText,
    },
    quizCard: {
      backgroundColor: theme.cardBackground,
      width: "100%",
      maxWidth: "600px",
      minHeight: "400px",
      borderRadius: "24px",
      padding: "32px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
      textAlign: "left" as "left",
      display: "flex",
      flexDirection: "column" as "column",
      justifyContent: "center",
      transition: "transform 0.3s ease",
    },
  };

  return (
    <div style={styles.app}>
      <div
        style={styles.quizCard}
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {showScore ? (
          <ScoreView
            score={score}
            totalQuestions={quizQuestions.length}
            restartQuiz={restartQuiz}
          />
        ) : (
          <QuestionView
            question={quizQuestions[currentQuestion]}
            questionNumber={currentQuestion + 1}
            totalQuestions={quizQuestions.length}
            isAnswered={isAnswered}
            selectedAnswerIndex={selectedAnswerIndex}
            onAnswerClick={handleAnswerOptionClick}
            handlePrev={handlePrevQuestion}
            handleNext={handleNextQuestion}
          />
        )}
      </div>
    </div>
  );
};

export default Quiz;
