import { ArrowLeft, ArrowRight } from "lucide-react";
import React from "react";
import VideoFeedbackModal from "@/components/feedback/VideoFeedbackModal";
import { quizApi } from "@/lib/api-client";
import { Question, AnswerOption } from "@/lib/types/learning";

// --- Setup ---

// Add Google Font link to the document's head
const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

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
          {question.answerOptions.map((answerOption: AnswerOption, index: number) => (
            <button
              key={index}
              className={getButtonClasses(answerOption, index)}
              onClick={() => onAnswerClick(answerOption.isCorrect, index)}
              disabled={isAnswered}
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

// Add props interface for feedback state
interface QuizProps {
  // Optional props to prevent duplicate API calls when passed from parent
  videoId: string;
  canSubmitFeedback?: boolean | undefined;
  existingFeedback?: any;
  markAsSubmitted?: () => void;
  // Add test configuration props
  testConfig?: {
    subject: string;
    topics: string[];
    level: "easy" | "medium" | "hard";
    language: "en" | "hn";
  };
}

const Quiz: React.FC<QuizProps> = ({
  videoId,
  canSubmitFeedback,
  existingFeedback,
  markAsSubmitted,
  testConfig,
}) => {
  // Debug feedback props
  console.log("🔍 Quiz Component Props:", {
    videoId,
    canSubmitFeedback,
    existingFeedback: !!existingFeedback,
    hasMarkAsSubmitted: !!markAsSubmitted,
    testConfig
  });

  // State for quiz data
  const [quizQuestions, setQuizQuestions] = React.useState<Question[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  // Quiz state
  const [currentQuestion, setCurrentQuestion] = React.useState<number>(0);
  const [showScore, setShowScore] = React.useState<boolean>(false);
  const [score, setScore] = React.useState<number>(0);
  const [isAnswered, setIsAnswered] = React.useState<boolean>(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = React.useState<
    number | null
  >(null);

  // Fetch quiz data when component mounts or testConfig changes
  React.useEffect(() => {
    const fetchQuizData = async () => {
      if (!testConfig) {
        setError("No test configuration provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        console.log("📚 Fetching quiz data with config:", testConfig);
        const response = await quizApi.getQuiz(testConfig);
        
        // Transform API response to match our Question interface
        const transformedQuestions: Question[] = response.questions.map((apiQuestion: any) => ({
          questionText: apiQuestion.content,
          answerOptions: apiQuestion.option.map((option: string, index: number) => ({
            answerText: option,
            isCorrect: apiQuestion.answer === option
          }))
        }));

        console.log("📚 Transformed questions:", transformedQuestions);
        setQuizQuestions(transformedQuestions);
      } catch (err: any) {
        console.error("❌ Error fetching quiz data:", err);
        setError(err.message || "Failed to fetch quiz questions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizData();
  }, [testConfig]);

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

  // Feedback handling for quiz completion
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = React.useState(false);

  React.useEffect(() => {
    console.log("🔍 Quiz Feedback useEffect:", {
      showScore,
      canSubmitFeedback,
      existingFeedback: !!existingFeedback,
      shouldOpen: showScore && canSubmitFeedback && !existingFeedback
    });
    
    if (showScore && canSubmitFeedback && !existingFeedback) {
      console.log("🎯 Opening Quiz feedback modal");
      setIsFeedbackModalOpen(true);
    }
  }, [showScore, canSubmitFeedback, existingFeedback]);

  const handleCloseFeedback = () => {
    console.log("🔍 Quiz feedback modal closing");
    setIsFeedbackModalOpen(false);
  };

  const handleDismissFeedback = () => {
    console.log("🔍 Quiz feedback modal dismissed by user");
    setIsFeedbackModalOpen(false);
    // Mark that user has dismissed the feedback request
    if (markAsSubmitted) {
      markAsSubmitted();
    }
  };

  const handleSubmitFeedback = async (payload: any) => {
    console.log("Quiz feedback submitted:", payload);
    if (markAsSubmitted) {
      markAsSubmitted();
    }
    setIsFeedbackModalOpen(false);
  };

  const handleSkipFeedback = () => {
    console.log("🔍 Quiz feedback skipped");
    if (markAsSubmitted) {
      markAsSubmitted();
    }
    setIsFeedbackModalOpen(false);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-background flex flex-col items-center justify-center p-4 text-neutral-100 min-h-[400px]">
        <div className="text-xl font-semibold text-neutral-400 mb-4">Loading Quiz...</div>
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-background flex flex-col items-center justify-center p-4 text-neutral-100 min-h-[400px]">
        <div className="text-xl font-semibold text-red-400 mb-4">Error Loading Quiz</div>
        <div className="text-neutral-400 text-center mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-500"
        >
          Retry
        </button>
      </div>
    );
  }

  // Show no questions state
  if (quizQuestions.length === 0) {
    return (
      <div className="bg-background flex flex-col items-center justify-center p-4 text-neutral-100 min-h-[400px]">
        <div className="text-xl font-semibold text-neutral-400 mb-4">No Questions Available</div>
        <div className="text-neutral-400 text-center">No quiz questions were found for the selected configuration.</div>
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
