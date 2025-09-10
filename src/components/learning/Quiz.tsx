import { ArrowLeft, ArrowRight } from "lucide-react";
import React from "react";
import VideoFeedbackModal from "@/components/feedback/VideoFeedbackModal";
import { quizApi } from "@/lib/api-client";

// --- Setup ---

// Add Google Font link to the document's head
const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

// TypeScript interfaces for our data structures (using API format)
interface AnswerOption {
  text: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  questionText: string;
  questionType: "MCQ";
  options: AnswerOption[];
}

// Centralized theme colors for a polished look
// theme constants removed (unused)

// --- Data ---
// Quiz questions will be loaded dynamically from API

// --- Reusable Components ---

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

const ScoreView: React.FC<{
  score: number;
  totalQuestions: number;
  restartQuiz: () => void;
}> = ({ score, totalQuestions, restartQuiz }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="text-2xl font-semibold text-neutral-400">Your Score</div>
      <div className="text-5xl font-bold text-neutral-100 my-4">
        {score} / {totalQuestions}
      </div>
      <button
        onClick={restartQuiz}
        className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 ease-in-out transform hover:scale-105 hover:bg-blue-500"
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
  return (
    <div className="grid grid-cols-2 mt-6">
      <button
        onClick={handlePrev}
        disabled={currentQuestion === 0 || isAnswered}
        className="justify-self-start bg-background text-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium transition-colors duration-200 ease-in-out hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed border border-border cursor-pointer"
      >
        <ArrowLeft/>
      </button>
      <button
        onClick={handleNext}
        disabled={isAnswered}
        className="justify-self-end bg-background text-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium transition-colors duration-200 ease-in-out hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed border border-border cursor-pointer"
      >
        <ArrowRight/>
      </button>
    </div>
  );
};

const QuestionView: React.FC<{
  question: QuizQuestion;
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
  const getButtonClasses = (
    answerOption: AnswerOption,
    index: number
  ): string => {
    const baseClasses =
      "w-full text-left p-4 rounded-xl transition-all duration-200 ease-in-out font-semibold border-2";

    if (isAnswered) {
      const isCorrectAnswer = answerOption.isCorrect;
      const isSelectedAnswer = index === selectedAnswerIndex;

      if (isCorrectAnswer) {
        return `${baseClasses} bg-green-500/90 border-green-500 text-neutral-100 cursor-not-allowed`;
      }
      if (isSelectedAnswer && !isCorrectAnswer) {
        return `${baseClasses} bg-destructive/90 border-destructive text-white cursor-not-allowed`;
      }
      return `${baseClasses} bg-card border-border text-foreground cursor-not-allowed opacity-60`;
    }

    return `${baseClasses} bg-card border-border text-foreground hover:border-primary hover:bg-accent cursor-pointer`;
  };

  return (
    <>
      <div>
        <ProgressBar current={questionNumber} total={totalQuestions} />
        <div className="w-full relative">
          <div className="mb-2 text-base font-semibold text-primary">
            Question {questionNumber} of {totalQuestions}
          </div>
          <div className="mb-6 text-2xl font-semibold text-foreground">
            {question.questionText}
          </div>
        </div>
        <div className="w-full flex flex-col gap-3">
          {question.options.map((answerOption, index) => (
            <button
              key={index}
              className={getButtonClasses(answerOption, index)}
              onClick={() => onAnswerClick(answerOption.isCorrect, index)}
              disabled={isAnswered}
            >
              {answerOption.text}
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

// Add props interface for feedback state
interface FeedbackData {
  id: string;
  rating: number;
  description: string;
  date_submitted: string;
  page_url: string;
}

interface QuizProps {
  // Optional props to prevent duplicate API calls when passed from parent
  videoId: string;
  canSubmitFeedback?: boolean | undefined;
  existingFeedback?: FeedbackData | null;
  markAsSubmitted?: () => void;
  topics?: string[]; // Topics for quiz generation (optional to handle API failures)
}

const Quiz: React.FC<QuizProps> = ({
  videoId,
  canSubmitFeedback,
  existingFeedback,
  markAsSubmitted,
  topics,
}) => {
  // Generate unique component instance ID for debugging (stable across renders)
  const componentId = React.useRef(Math.random().toString(36).substr(2, 9)).current;
  
  // Memoize topics to prevent infinite re-renders
  const topicsToUse = React.useMemo(() => {
    return topics && topics.length > 0 ? topics : null;
  }, [topics, componentId]);
  
  // Quiz state
  const [quizQuestions, setQuizQuestions] = React.useState<QuizQuestion[]>([]);
  const [isLoadingQuiz, setIsLoadingQuiz] = React.useState<boolean>(true); // Start as true to show loading initially
  const [quizError, setQuizError] = React.useState<string | null>(null);
  const hasAttemptedFetchRef = React.useRef<boolean>(false);
  const lastTopicsRef = React.useRef<string>("");
  
  const [currentQuestion, setCurrentQuestion] = React.useState<number>(0);
  const [showScore, setShowScore] = React.useState<boolean>(false);
  const [score, setScore] = React.useState<number>(0);
  const [isAnswered, setIsAnswered] = React.useState<boolean>(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = React.useState<
    number | null
  >(null);

  // Fetch quiz questions from API when topics change
  React.useEffect(() => {
    // Don't fetch if no topics available
    if (!topicsToUse) {
      setIsLoadingQuiz(false);
      setQuizError("No topics available for quiz generation.");
      return;
    }

    const topicsKey = JSON.stringify(topicsToUse);
    
    // Prevent infinite calls by checking if topics actually changed
    if (lastTopicsRef.current === topicsKey) {
      return;
    }
    
    // Update the last topics ref
    lastTopicsRef.current = topicsKey;
    
    // Reset state when topics change
    setQuizQuestions([]);
    setCurrentQuestion(0);
    setShowScore(false);
    setScore(0);
    setIsAnswered(false);
    setSelectedAnswerIndex(null);
    setQuizError(null);
    hasAttemptedFetchRef.current = false;
    setIsLoadingQuiz(true);

    const fetchQuizQuestions = async () => {
      try {
        hasAttemptedFetchRef.current = true;
        setQuizError(null);
        
        const response = await quizApi.generateQuiz(topicsToUse);
        
        setQuizQuestions(response.questions);
      } catch (error: unknown) {
        
        // Check if it's an authentication error
        const errorStatus = (error as any)?.status;
        if (errorStatus === 401 || errorStatus === 403) {
          setQuizError("Please log in to access quiz questions.");
        } else {
          setQuizError("Failed to load quiz questions. Please try again.");
        }
      } finally {
        setIsLoadingQuiz(false);
      }
    };

    fetchQuizQuestions();
  }, [topicsToUse, componentId]); // Depend on topicsToUse and componentId

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

  const retryQuiz = () => {
    if (!topicsToUse) {
      setQuizError("No topics available for quiz generation.");
      return;
    }
    
    setQuizError(null);
    setQuizQuestions([]); // Clear existing questions
    hasAttemptedFetchRef.current = false; // Reset attempt flag
    setIsLoadingQuiz(true);
    // The useEffect will trigger again when topics change or we can manually refetch
    const fetchQuizQuestions = async () => {
      try {
        hasAttemptedFetchRef.current = true;
        const response = await quizApi.generateQuiz(topicsToUse);
        setQuizQuestions(response.questions);
        setQuizError(null);
      } catch (error: unknown) {
        console.error("❌ Failed to retry quiz questions:", error);
        setQuizError("Failed to load quiz questions. Please try again.");
      } finally {
        setIsLoadingQuiz(false);
      }
    };
    fetchQuizQuestions();
  };

  // Feedback handling for quiz completion
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = React.useState(false);

  React.useEffect(() => {
    
    if (showScore && canSubmitFeedback && !existingFeedback) {
      setIsFeedbackModalOpen(true);
    }
  }, [showScore, canSubmitFeedback, existingFeedback]);

  const handleCloseFeedback = () => {
    setIsFeedbackModalOpen(false);
  };

  const handleDismissFeedback = () => {
    setIsFeedbackModalOpen(false);
    // Mark that user has dismissed the feedback request
    if (markAsSubmitted) {
      markAsSubmitted();
    }
  };

  const handleSubmitFeedback = async (_payload: unknown) => {
    if (markAsSubmitted) {
      markAsSubmitted();
    }
    setIsFeedbackModalOpen(false);
  };

  const handleSkipFeedback = () => {
    if (markAsSubmitted) {
      markAsSubmitted();
    }
    setIsFeedbackModalOpen(false);
  };

  // inline styles removed (unused)

  // Loading state
  if (isLoadingQuiz) {
    return (
      <div className="bg-background flex flex-col items-center justify-center p-4 text-neutral-100 min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mb-4"></div>
          <p className="text-lg font-semibold text-foreground">Loading Quiz...</p>
          <p className="text-sm text-muted-foreground mt-2">
            {topicsToUse ? `Generating questions for: ${topicsToUse.join(", ")}` : "Waiting for topics..."}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (quizError) {
    return (
      <div className="bg-background flex flex-col items-center justify-center p-4 text-neutral-100 min-h-[400px]">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <p className="text-lg font-semibold text-foreground mb-2">Failed to Load Quiz</p>
          <p className="text-sm text-muted-foreground mb-4">{quizError}</p>
          <button
            onClick={retryQuiz}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No questions state
  if (quizQuestions.length === 0) {
    return (
      <div className="bg-background flex flex-col items-center justify-center p-4 text-neutral-100 min-h-[400px]">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <p className="text-lg font-semibold text-foreground mb-2">No Questions Available</p>
          <p className="text-sm text-muted-foreground mb-4">
            No quiz questions were generated for the selected topics.
          </p>
          <button
            onClick={retryQuiz}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-background flex flex-col items-center justify-start p-4 text-neutral-100"
    >
      <div className="w-full max-w-2xl min-h-[400px] text-left flex flex-col justify-center transition-transform duration-300 ease-in-out ">
        {showScore ? (
          <div>
            <ScoreView
              score={score}
              totalQuestions={quizQuestions.length}
              restartQuiz={restartQuiz}
            />

          </div>
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
        <VideoFeedbackModal
          isOpen={isFeedbackModalOpen}
          onClose={handleCloseFeedback}
          videoId={videoId}
          videoTitle={"Quiz"}
          playPercentage={100}
          onSubmit={handleSubmitFeedback}
          onSkip={handleSkipFeedback}
          onDismiss={handleDismissFeedback}
          canSubmitFeedback={canSubmitFeedback}
          existingFeedback={existingFeedback}
          markAsSubmitted={markAsSubmitted}
          componentName="Quiz"
        />
      </div>
    </div>
  );
};

export default Quiz;
