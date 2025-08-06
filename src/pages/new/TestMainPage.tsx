import {
  quizApi,
  SubmitTestRequest,
  SubmitTestResponse,
} from "@/lib/api-client";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExamSubmitDialog from "../../components/ExamSubmitDialog";
import TestResultDialog from "../../components/TestResultDialog";

// --- Type Definitions ---
type QuestionType =
  | "MCQ"
  | "FillInTheBlank"
  | "MatchTheFollowing"
  | "Subjective";

interface Question {
  id: number;
  question: string;
  options: string[];
  status: string;
  answer: number | null;
  questionType: QuestionType;
}

// API Response mapping interface
interface ApiQuestion {
  questionId: number;
  questionType: string;
  content: string;
  option: string[];
  answer: string | null;
}

// --- Helper Components ---

// Icon for the student in the sidebar
const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 mr-3 text-blue-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

// Icon for the fullscreen button (Updated Design)
const FullscreenIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 ml-2"
  >
    <path d="M8 3H5a2 2 0 0 0-2 2v3" />
    <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
    <path d="M3 16v3a2 2 0 0 0 2 2h3" />
    <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
  </svg>
);

// --- Main Application Component ---

const TestMainPage = () => {
  // --- State Management ---
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState("English");
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showTestResultDialog, setShowTestResultDialog] = useState(false);
  const [isTimeLow, setIsTimeLow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<number>(7);
  const navigate = useNavigate();
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([]);

  // --- Data Fetching and API Integration ---

  // Convert API response to internal Question format
  const mapApiQuestionToQuestion = (apiQuestion: ApiQuestion): Question => ({
    id: apiQuestion.questionId,
    question: apiQuestion.content,
    options: apiQuestion.option,
    status: "not-visited",
    answer: null,
    questionType: apiQuestion.questionType as QuestionType,
  });

  // Fetch questions from API
  const fetchQuestions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Attempting to fetch questions from API...");
      const response = await quizApi.getQuestions(sessionId);

      if (response && response.questions) {
        const mappedQuestions = response.questions.map(
          mapApiQuestionToQuestion
        );
        setQuestions(mappedQuestions);
        console.log(
          "Successfully fetched questions from API:",
          mappedQuestions.length
        );
      } else {
        throw new Error("Invalid response format from API");
      }
    } catch (apiError) {
      console.error("Failed to fetch questions:", apiError);
      setError(
        "Failed to fetch questions from server. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Submit test to API
  const submitTestToAPI = async (): Promise<SubmitTestResponse> => {
    console.log("Attempting to submit test to API...");

    const submitData: SubmitTestRequest = {
      session_id: sessionId,
      answers: questions.map((q) => ({
        question_id: q.id,
        selected_option: q.answer !== null ? q.options[q.answer] : null,
        answer: q.answer !== null ? q.options[q.answer] : null,
      })),
    };

    const response = await quizApi.submitTest(submitData);
    console.log("Successfully submitted test to API:", response);
    return response;
  };

  // --- Effects ---

  // Get session ID from URL parameters (optional enhancement)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionIdParam = urlParams.get("sessionId");
    if (sessionIdParam) {
      const parsedSessionId = parseInt(sessionIdParam, 10);
      if (!isNaN(parsedSessionId)) {
        setSessionId(parsedSessionId);
      }
    }
  }, []);

  // Fetch questions on component mount
  useEffect(() => {
    fetchQuestions();
  }, [sessionId]);

  // Timer Logic
  useEffect(() => {
    // Stop timer if test is submitted or auto-submitted
    if (showTestResultDialog || isSubmitting) {
      return;
    }

    if (timeLeft <= 0) {
      // Auto-submit test when time runs out
      handleAutoSubmit();
      return;
    }

    // Set low time warning when less than 2 minutes remaining
    setIsTimeLow(timeLeft <= 120);

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, showTestResultDialog, isSubmitting]);

  // Handle clicking outside the language dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  // --- Event Handlers ---
  const handleOptionSelect = (optionIndex: number) => {
    const newQuestions = [...questions];
    const currentStatus = newQuestions[currentQuestionIndex].status;

    newQuestions[currentQuestionIndex].answer = optionIndex;
    if (currentStatus === "marked") {
      newQuestions[currentQuestionIndex].status = "marked-answered";
    } else {
      newQuestions[currentQuestionIndex].status = "answered";
    }
    setQuestions(newQuestions);
  };

  const handleSaveAndNext = () => {
    if (questions[currentQuestionIndex].status === "not-visited") {
      const newQuestions = [...questions];
      newQuestions[currentQuestionIndex].status = "not-answered";
      setQuestions(newQuestions);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert("You have reached the end of the test!");
    }
  };

  const handleClearResponse = () => {
    const newQuestions = [...questions];
    newQuestions[currentQuestionIndex].answer = null;
    if (newQuestions[currentQuestionIndex].status === "answered") {
      newQuestions[currentQuestionIndex].status = "not-answered";
    } else if (
      newQuestions[currentQuestionIndex].status === "marked-answered"
    ) {
      newQuestions[currentQuestionIndex].status = "marked";
    }
    setQuestions(newQuestions);
  };

  const handleMarkForReview = () => {
    const newQuestions = [...questions];
    const currentStatus = newQuestions[currentQuestionIndex].status;

    if (currentStatus === "answered") {
      newQuestions[currentQuestionIndex].status = "marked-answered";
    } else if (currentStatus === "marked-answered") {
      newQuestions[currentQuestionIndex].status = "answered";
    } else if (currentStatus === "marked") {
      newQuestions[currentQuestionIndex].status = "not-answered";
    } else {
      newQuestions[currentQuestionIndex].status = "marked";
    }
    setQuestions(newQuestions);
    handleSaveAndNext();
  };

  const handleSubmitTest = () => {
    setShowSubmitDialog(true);
  };

  const handleCloseSubmitDialog = () => {
    setShowSubmitDialog(false);
  };

  const handleConfirmSubmit = async () => {
    try {
      setShowSubmitDialog(false);
      setIsSubmitting(true);

      const apiResponse = await submitTestToAPI();

      if (apiResponse) {
        console.log("Test submitted successfully:", apiResponse);
        setShowTestResultDialog(true);
      }
    } catch (error) {
      console.error("Failed to submit test:", error);
      setError("Failed to submit test. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutoSubmit = async () => {
    console.log("Test auto-submitted due to time expiration");
    try {
      setIsSubmitting(true);
      const apiResponse = await submitTestToAPI();

      if (apiResponse) {
        console.log("Test auto-submitted successfully:", apiResponse);
        setShowTestResultDialog(true);
      }
    } catch (error) {
      console.error("Failed to auto-submit test:", error);
      setError("Failed to auto-submit test.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaletteClick = (index: number) => {
    if (questions[currentQuestionIndex].status === "not-visited") {
      const newQuestions = [...questions];
      newQuestions[currentQuestionIndex].status = "not-answered";
      setQuestions(newQuestions);
    }
    setCurrentQuestionIndex(index);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setIsLangDropdownOpen(false);
  };

  const toggleFullScreen = async () => {
    // This function is wrapped in a try-catch block to handle potential
    // errors, such as when the Fullscreen API is blocked by browser permissions
    // policies, which can happen when running inside an iframe.
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err: any) {
      console.error(
        `Error attempting to enable full-screen mode: ${err.message}. This is often due to security restrictions in iframes.`
      );
    }
  };

  // --- Dynamic Styles for Palette ---
  const getPaletteClass = (status: string) => {
    switch (status) {
      case "answered":
        return "bg-green-600 text-white";
      case "not-answered":
        return "bg-red-600 text-white";
      case "marked":
        return "bg-purple-600 text-white";
      case "marked-answered":
        return 'bg-purple-600 text-white relative after:content-["✔"] after:absolute after:text-green-400 after:text-xs after:-top-1 after:-right-1';
      case "not-visited":
      default:
        return "bg-gray-600 text-gray-300";
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  const handleCloseTestResultDialog = () => {
    setShowTestResultDialog(false);
    navigate("/home");
  };

  // --- Loading and Error States ---
  if (isLoading && questions.length === 0) {
    return (
      <div className="bg-gray-900 text-gray-200 font-sans min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div className="bg-gray-900 text-gray-200 font-sans min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={fetchQuestions}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="bg-gray-900 text-gray-200 font-sans min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">No questions available.</p>
        </div>
      </div>
    );
  }

  // Place this check just before the main render return (after error/loading checks, before the main return)
  if (isSubmitting) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-white">Submitting your quiz...</p>
        </div>
      </div>
    );
  }

  // --- Render Method ---
  return (
    <div className="bg-gray-900 text-gray-200 font-sans min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 shadow-md p-3 flex justify-between items-center z-20">
        {/* Responsive Title */}
        <h1 className="text-lg sm:text-xl font-bold text-white">
          General Knowledge Test
        </h1>
        <div className="flex items-center">
          <div className="flex items-center mr-2 sm:mr-4">
            <span className="text-sm mr-2 hidden sm:inline">Time Left:</span>
            <span
              className={`font-mono text-base sm:text-lg py-1 px-2 sm:px-3 rounded-md ${
                isTimeLow
                  ? "bg-red-600 text-white animate-pulse"
                  : "bg-gray-700 text-white"
              }`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>

          {/* Language Dropdown */}
          <div ref={langDropdownRef} className="relative hidden md:block">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md text-sm"
            >
              {language}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-gray-700 rounded-md shadow-lg py-1 z-30">
                <a
                  href="#"
                  onClick={() => handleLanguageChange("English")}
                  className="block px-4 py-2 text-sm text-gray-200 hover:bg-blue-600"
                >
                  English
                </a>
                <a
                  href="#"
                  onClick={() => handleLanguageChange("Hindi")}
                  className="block px-4 py-2 text-sm text-gray-200 hover:bg-blue-600"
                >
                  Hindi
                </a>
              </div>
            )}
          </div>

          <button
            onClick={toggleFullScreen}
            className="hidden md:flex items-center bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md ml-2 text-sm"
          >
            Full Screen
            <FullscreenIcon />
          </button>
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white ml-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
        {/* Question Panel */}
        <main className="flex-grow p-4 sm:p-6 md:p-8 flex flex-col">
          <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg flex-grow">
            <h2 className="text-lg font-semibold mb-4 text-blue-300">
              Question No. {currentQuestion.id}
            </h2>
            <p className="mb-6 text-gray-300">{currentQuestion.question}</p>
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                    currentQuestion.answer === index
                      ? "bg-blue-600 ring-2 ring-blue-400"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    className="h-5 w-5 mr-4 border-gray-500 bg-gray-800 text-blue-500 focus:ring-blue-400"
                    checked={currentQuestion.answer === index}
                    onChange={() => handleOptionSelect(index)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        </main>

        {/* Sidebar */}
        <aside
          className={`w-full md:w-80 lg:w-96 bg-gray-800 p-4 sm:p-6 flex-shrink-0 transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          } md:translate-x-0 fixed md:relative top-0 right-0 h-full md:h-auto z-10 md:z-0 overflow-y-auto`}
        >
          <button
            className="md:hidden text-white absolute top-4 right-4"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="bg-gray-700 p-4 rounded-lg flex items-center mb-6">
            <UserIcon />
            <span className="font-semibold">Student Name</span>
          </div>

          {/* --- RESPONSIVE LEGEND SECTION --- */}
          <div className="bg-gray-700 p-4 rounded-lg mb-6">
            <h3 className="font-bold mb-3 border-b border-gray-600 pb-2">
              Legend
            </h3>
            {/* Stacks to 1 column on mobile, 2 on small screens and up */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="flex items-center">
                <span className="w-4 h-4 rounded bg-green-600 mr-2 shrink-0"></span>
                <span>Answered</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 rounded bg-red-600 mr-2 shrink-0"></span>
                <span>Not Answered</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 rounded bg-purple-600 mr-2 shrink-0"></span>
                <span>Marked</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 rounded bg-gray-600 mr-2 shrink-0"></span>
                <span>Not Visited</span>
              </div>
              <div className="flex items-center sm:col-span-2">
                <div className="w-4 h-4 rounded bg-purple-600 mr-2 flex items-center justify-center shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 text-green-300"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span>Marked & Answered</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg mb-6">
            <h3 className="font-bold mb-4">Question Palette</h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => handlePaletteClick(index)}
                  className={`h-10 w-10 flex items-center justify-center rounded font-bold transition-transform duration-200 transform hover:scale-110 ${getPaletteClass(
                    q.status
                  )} ${
                    index === currentQuestionIndex
                      ? "ring-2 ring-offset-2 ring-offset-gray-700 ring-yellow-400"
                      : ""
                  }`}
                >
                  {q.id}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 mt-auto">
            <button className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">
              Question Paper
            </button>
            <button className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">
              Instructions
            </button>
            <button
              onClick={handleSubmitTest}
              disabled={isLoading}
              className={`w-full font-bold py-3 px-4 rounded-lg transition-colors duration-200 ${
                isLoading
                  ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {isLoading ? "Submitting..." : "Submit Test"}
            </button>
          </div>
        </aside>
      </div>

      {/* --- RESPONSIVE FOOTER --- */}
      <footer className="bg-gray-800 shadow-inner p-3 flex flex-col sm:flex-row sm:justify-between items-center gap-3">
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={handleMarkForReview}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            {currentQuestionIndex === questions.length - 1
              ? "Mark for Review"
              : "Mark for Review & Next"}
          </button>
          <button
            onClick={handleClearResponse}
            disabled={currentQuestion.answer === null}
            className={`font-bold py-2 px-4 rounded-lg transition-colors duration-200 ${
              currentQuestion.answer === null
                ? "bg-gray-500 text-gray-300 cursor-not-allowed opacity-50"
                : "bg-yellow-600 hover:bg-yellow-700 text-white"
            }`}
          >
            Clear Response
          </button>
        </div>
        <button
          onClick={handleSaveAndNext}
          disabled={currentQuestionIndex === questions.length - 1}
          className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 text-lg w-full sm:w-auto ${
            currentQuestionIndex === questions.length - 1
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {currentQuestionIndex === questions.length - 1
            ? "Last Question"
            : "Save & Next"}
        </button>
      </footer>

      {/* Exam Submit Dialog */}
      {showSubmitDialog && (
        <ExamSubmitDialog
          summaryData={[
            {
              name: "Quiz",
              stats: {
                total: questions.length,
                answered: questions.filter((q) => q.status === "answered")
                  .length,
                notAnswered: questions.filter(
                  (q) => q.status === "not-answered"
                ).length,
                markedForReview: questions.filter(
                  (q) => q.status === "marked" || q.status === "marked-answered"
                ).length,
                notVisited: questions.filter((q) => q.status === "not-visited")
                  .length,
              },
            },
          ]}
          onClose={handleCloseSubmitDialog}
          onSubmit={handleConfirmSubmit}
        />
      )}

      {/* Test Result Dialog */}
      {showTestResultDialog && (
        <TestResultDialog
          results={{
            attemptedQuestions: questions.filter(
              (q) => q.status === "answered" || q.status === "marked-answered"
            ).length,
            correctQuestions: questions.filter(
              (q) => q.status === "answered" || q.status === "marked-answered"
            ).length, // Assuming all answered are correct for demo
            totalQuestions: questions.length,
            positiveMarks: questions.filter(
              (q) => q.status === "answered" || q.status === "marked-answered"
            ).length,
            negativeMarks: 0,
            totalMarks: questions.filter(
              (q) => q.status === "answered" || q.status === "marked-answered"
            ).length,
            timeTaken: formatTime(600 - timeLeft),
            rank: 5,
            totalStudents: 150,
          }}
          onClose={handleCloseTestResultDialog}
          navigate={() => navigate("/analysis")}
        />
      )}
    </div>
  );
};

export default TestMainPage;
