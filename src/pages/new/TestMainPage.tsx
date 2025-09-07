import {
  quizApi,
  SubmitTestRequest,
  SubmitTestResponse,
  SubmittedAnswer,
} from "@/lib/api-client";
import React, { useEffect, useRef, useState } from "react";

import { useNavigate, useLocation } from "react-router-dom";
import ExamSubmitDialog from "../../components/ExamSubmitDialog";
import TestResultDialog from "../../components/TestResultDialog";
import { useUser } from "../../contexts/UserContext";
import { ROUTES } from "../../routes/constants";
import {
  Check,
  ChevronDown,
  ChevronDownIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  ChevronUpIcon,
  CircleUser,
  Maximize,
  Minimize,
  X,
} from "lucide-react";
import {
  Button1,
  Button2,
  Button3,
  Button4,
  Button5,
} from "@/components/test/buttons";

// --- Helper Components & Modals ---
const InstructionsModal = ({ onClose }: { onClose: () => void }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 "
    onClick={onClose}
  >
    <div
      className="relative w-full max-w-4xl bg-card text-primary rounded-2xl shadow-2xl border border-border flex flex-col max-h-[80vh]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-5 border-b border-border flex justify-between items-center">
        <h3 className="text-xl font-semibold text-foreground">
          Test Instructions
        </h3>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 text-foreground rounded-full hover:bg-foreground/10 hover:text-foreground transition-colors z-10 cursor-pointer"
        >
          <X />
        </button>
      </div>
      <div className="overflow-y-auto text-muted-foreground space-y-3 text-sm pr-4 p-6">
        <p>
          1. The test consists of multiple-choice questions across different
          sections.
        </p>
        <p>
          2. For each question, you will be awarded <strong>+1 mark</strong> for
          a correct answer and <strong>-0.25 marks</strong> will be deducted for
          an incorrect answer.
        </p>
        <p>
          3. You can navigate between questions using the "Prev" and "Next"
          buttons in the footer.
        </p>
        <p>
          4. Use the question palette on the right (or in the slide-out menu on
          mobile) to jump directly to any question.
        </p>
        <p>5. The color-coded legend for the question palette is as follows:</p>
        <ul className="list-disc list-inside space-y-3 pl-6 pt-2">
          <li className="flex items-center space-x-4">
            <div>
              <Button1 size={24} number={1} />
            </div>
            <span>
              <strong>Not Visited:</strong> You have not seen the question yet.
            </span>
          </li>
          <li className="flex items-center space-x-4">
            <div>
              <Button2 size={24} number={2} />
            </div>
            <span>
              <strong>Not Answered:</strong> You have visited the question but
              not selected an answer.
            </span>
          </li>
          <li className="flex items-center space-x-4">
            <div>
              <Button3 size={24} number={3} />
            </div>
            <span>
              <strong>Answered:</strong> You have answered the question.
            </span>
          </li>
          <li className="flex items-center space-x-4">
            <div>
              <Button4 size={24} number={4} />
            </div>
            <span>
              <strong>Marked for Review:</strong> You have marked the question
              for later review without answering.
            </span>
          </li>
          <li className="flex items-center space-x-4">
            <div>
              <Button5 size={24} number={5} />
            </div>
            <span>
              <strong>Answered & Marked for Review:</strong> You have answered
              the question and also marked it for review.
            </span>
          </li>
        </ul>
        <p>
          6. You can change your answer for any question at any time before
          submitting the test.
        </p>
        <p>
          7. The timer at the top right corner shows the remaining time. The
          test will be submitted automatically when the time runs out.
        </p>
        <p>
          8. Click on the "Submit Test" button to finish and submit your test.
        </p>
      </div>
      <div className="flex justify-end items-center gap-4 p-5 border-t border-border bg-card rounded-b-2xl">
        <button
          onClick={onClose}
          className="w-full transform rounded-lg px-6 py-2.5 font-semibold bg-blue-600 hover:bg-blue-700 text-foreground  hover:text-foreground transition-all duration-200 ease-in-out focus:outline-none sm:w-auto"
        >
          Got it
        </button>
      </div>
    </div>
  </div>
);
// --- Type Definitions ---
type QuestionType =
  | "MCQ"
  | "FillInTheBlank"
  | "MatchTheFollowing"
  | "Subjective";

type SectionName =
  | "english language"
  | "numerical ability"
  | "reasoning ability";

interface Question {
  id: number;
  question: string;
  options: string[];
  status: string;
  answer: number | null;
  questionType: QuestionType;
  timeSpent?: number; // Track time spent on each question in seconds
  questionStartTime?: Date; // Track when user first visited this question
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

// --- Custom Hook for detecting outside clicks ---
const useOutsideClick = (
  ref: React.RefObject<HTMLElement | null>,
  callback: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};

// --- Main Application Component ---

const TestMainPage = () => {
  // --- State Management ---
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [allQuestions] = useState<{
    [key in SectionName]?: Question[];
  }>({});
  const [currentSection, setCurrentSection] =
    useState<SectionName>("english language");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showTestResultDialog, setShowTestResultDialog] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

  const [isTimeLow, setIsTimeLow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [textSize, setTextSize] = useState("text-base");
  const [language, setLanguage] = useState("English");
  const [isFooterCollapsed, setIsFooterCollapsed] = useState(true);
  const [isDesktopAsideCollapsed, setIsDesktopAsideCollapsed] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { profile, examGoal } = useUser();

  const [sessionId, setSessionId] = useState<number | null>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<Date>(new Date());

  const [questions, setQuestions] = useState<Question[]>([]);

  const testConfig = location.state?.testConfig;

  const questionsForCurrentSection = allQuestions[currentSection] || [];

  // --- Refs for outside click detection ---
  const asideRef = useRef<HTMLElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);

  useOutsideClick(asideRef, () => {
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  });

  useOutsideClick(footerRef, () => {
    if (!isFooterCollapsed) setIsFooterCollapsed(true);
  }); // --- Data Fetching and API Integration ---

  const mapApiQuestionToQuestion = (apiQuestion: ApiQuestion): Question => ({
    id: apiQuestion.questionId,
    question: apiQuestion.content,
    options: apiQuestion.option,
    status: "not-visited",
    answer: null,
    questionType: apiQuestion.questionType as QuestionType,
    timeSpent: 0,
    questionStartTime: undefined,
  });

  // Fetch questions from API
  const fetchQuestions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Attempting to fetch questions from API...");
      const response = await quizApi.startTest({
        ...testConfig,
        topics: testConfig.sub_topic,
      });

      if (response && response.questions) {
        const mappedQuestions = response.questions
          .map(mapApiQuestionToQuestion)
          .sort((a, b) => a.id - b.id);

        setQuestions(mappedQuestions);
        setSessionId(response.session_id);
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
    if (!sessionId) {
      throw new Error("Session ID is required to submit test");
    }

    // Calculate final time spent on current question
    const now = new Date();
    const finalTimeSpent = Math.floor((now.getTime() - questionStartTime.getTime()) / 1000);
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].timeSpent = (updatedQuestions[currentQuestionIndex].timeSpent || 0) + finalTimeSpent;

    // Convert questions to the enhanced format with answer_order
    const submittedAnswers = updatedQuestions.map((q, index) => ({
      question_id: q.id,
      selected_option: q.answer !== null ? q.options[q.answer] : null,
      answer_order: index + 1, // API requires this field
      time_taken: q.timeSpent || 0, // Time taken in seconds
    }));

    // Calculate test metadata
    const totalTimeTaken = 600 - timeLeft; // Total time taken in seconds
    const testStartTime = new Date(Date.now() - totalTimeTaken * 1000);
    
    // Log the exact request format for debugging
    const requestData = {
      session_id: sessionId,
      answers: submittedAnswers,
      metadata: {
        total_time: totalTimeTaken,
        start_time: testStartTime.toISOString(),
        end_time: now.toISOString(),
      }
    };
    
    console.log("🚀 Submitting test with data (answer_order format):", JSON.stringify(requestData, null, 2));
    
    const response = await quizApi.submitTestEnhanced(
      sessionId,
      submittedAnswers,
      {
        total_time: totalTimeTaken,
        start_time: testStartTime.toISOString(),
        end_time: now.toISOString(),
      }
    );
    
    console.log("✅ Successfully submitted test to API:", response);
    return response;
  };

  // --- Effects ---

  {
    /*}
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
  */
  }

  // Fetch questions on component mount
  useEffect(() => {
    fetchQuestions();
  }, []);

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

  const navigateToQuestion = (index: number) => {
    if (index < 0 || index >= questions.length) return;
    
    const now = new Date();
    
    // Track time spent on current question before navigating away
    if (index !== currentQuestionIndex) {
      const currentQuestion = questions[currentQuestionIndex];
      if (currentQuestion.questionStartTime) {
        const timeSpent = Math.floor((now.getTime() - currentQuestion.questionStartTime.getTime()) / 1000);
        const newQuestions = [...questions];
        newQuestions[currentQuestionIndex].timeSpent = (newQuestions[currentQuestionIndex].timeSpent || 0) + timeSpent;
        setQuestions(newQuestions);
      }
    }
    
    const currentStatus = questions[currentQuestionIndex].status;
    if (currentStatus === "not-visited") {
      const newQuestions = [...questions];
      newQuestions[currentQuestionIndex].status = "not-answered";
      setQuestions(newQuestions);
    }
    
    setCurrentQuestionIndex(index);
    
    // Set start time for the new question if not already set
    const newQuestions = [...questions];
    if (!newQuestions[index].questionStartTime) {
      newQuestions[index].questionStartTime = now;
      setQuestions(newQuestions);
    }
    setQuestionStartTime(now);
  };

  /**const handleSaveAndNext = () => {
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
  };*/

  const handleSaveAndNext = () => navigateToQuestion(currentQuestionIndex + 1);
  const handlePrevious = () => navigateToQuestion(currentQuestionIndex - 1);

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

  const handleSectionChange = (section: SectionName) => {
    setCurrentSection(section);
    setCurrentQuestionIndex(0); // Reset index when changing section
  };

  const handleSkipSection = () => {
    const sections: SectionName[] = [
      "english language",
      "numerical ability",
      "reasoning ability",
    ];
    const currentSectionIndex = sections.indexOf(currentSection);
    const nextSectionIndex = (currentSectionIndex + 1) % sections.length;
    handleSectionChange(sections[nextSectionIndex]);
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
        navigate(ROUTES.ANALYSIS);
        //setShowTestResultDialog(true);
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
    // Use the same navigation logic with time tracking
    navigateToQuestion(index);
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
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
    } catch (err: any) {
      console.error(
        `Error attempting to enable full-screen mode: ${err.message}. This is often due to security restrictions in iframes.`
      );
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  const handleCloseTestResultDialog = () => {
    setShowTestResultDialog(false);
    navigate(ROUTES.DASHBOARD);
  };

  // --- Loading and Error States ---
  if (isLoading && questions.length === 0) {
    return (
      <div className="bg-background text-muted-foreground font-sans min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div className="bg-background text-muted-foreground font-sans min-h-screen flex items-center justify-center">
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
      <div className="bg-background text-muted-foreground font-sans min-h-screen flex items-center justify-center">
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
    <div className="bg-background text-muted-foreground font-sans h-screen flex flex-col">
      {/* Header */}
      <header className="bg-card p-3 flex justify-between items-center border-b">
        {/**<div className="flex items-center justify-between pl-18 lg:pl-0">
          <Hexagon />
        </div>*/}
        {/* Responsive Title */}
        <div className="flex-1 text-center px-2">
          <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">
            General Knowledge Test
          </h1>
        </div>
        <div className="flex items-center">
          <button
            onClick={toggleFullScreen}
            className="z-30 hidden md:flex items-center bg-background-subtle hover:bg-blue-400/20 px-3 py-2 rounded-md ml-2 text-sm"
          >
            {isFullscreen ? "Exit Full Screen" : "Full Screen"}
            {isFullscreen ? (
              <Minimize className="ml-2" />
            ) : (
              <Maximize className="ml-2" />
            )}
          </button>
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground ml-2 relative z-30"
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
        <main
          className={`flex-grow p-2 sm:p-4 flex flex-col overflow-hidden pb-20 md:pb-4 ${textSize}`}
        >
          <div className="flex-shrink-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              {/* Section Tabs */}
              <div className="w-full sm:w-auto">
                <nav className="flex gap-1 sm:gap-2" aria-label="Tabs">
                  {(
                    [
                      "english language",
                      "numerical ability",
                      "reasoning ability",
                    ] as SectionName[]
                  ).map((section) => (
                    <button
                      key={section}
                      onClick={() => handleSectionChange(section)}
                      className={`flex-1 sm:flex-none whitespace-nowrap py-2 px-3 font-medium text-xs sm:text-sm rounded-t-lg transition-colors capitalize ${
                        currentSection === section
                          ? "bg-card text-foreground"
                          : "bg-background-subtle text-border hover:bg-blue-400/20 hover:text-border-medium"
                      }`}
                    >
                      {section}
                    </button>
                  ))}
                </nav>
              </div>
              {/* Timer and Settings */}
              <div className="flex items-center justify-end gap-2 sm:gap-4 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <span className="text-sm mr-2 hidden sm:inline text-foreground">
                    Time
                    <span className="text-sm mr-2 hidden lg:inline"> Left</span>
                    :
                  </span>

                  <span
                    className={`font-mono text-base sm:text-lg py-1 px-2 sm:px-3 rounded-md select-none ${
                      isTimeLow
                        ? "bg-red-600 text-white animate-pulse"
                        : "bg-background-subtle text-foreground"
                    }`}
                  >
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <select
                  onChange={(e) => setTextSize(e.target.value)}
                  value={textSize}
                  className="bg-background-subtle text-foreground rounded-md px-2 py-1 appearance-none text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="text-sm">A-</option>
                  <option value="text-base">A</option>
                  <option value="text-lg">A+</option>
                </select>
                {/**<select
                onChange={(e) => setLanguage(e.target.value)}
                value={language}
                className="bg-background-subtle text-white rounded-md px-2 py-1 appearance-none text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>EN</option>
                <option>HI</option>
              </select>*/}
                {/* Language Dropdown */}
                <div ref={langDropdownRef} className="relative hidden md:block">
                  <button
                    onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                    className="flex items-center bg-background-subtle hover:bg-blue-400/20 px-2 py-1 rounded-md text-sm"
                  >
                    {language}
                    <ChevronDown className="text-foreground" />
                  </button>
                  {isLangDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-background-subtle rounded-md py-1 z-30 border select-none">
                      <div
                        onClick={() => handleLanguageChange("English")}
                        className="block px-4 py-2 text-sm text-muted-foreground hover:bg-blue-400/20"
                      >
                        English
                      </div>
                      <div
                        onClick={() => handleLanguageChange("Hindi")}
                        className="block px-4 py-2 text-sm text-muted-foreground hover:bg-blue-400/20"
                      >
                        Hindi
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Question Info */}
            <div className="flex justify-between items-center mb-2 text-sm text-foreground px-2">
              <h2 className="text-lg font-semibold text-foreground">
                Question No. {currentQuestion.id}
              </h2>
              <div>
                <span>Marks: </span>
                <span className="text-green-400 font-semibold">+1</span>
                <span>, </span>
                <span className="text-red-400 font-semibold">-0.25</span>
              </div>
            </div>
          </div>
          <div className="bg-card p-4 sm:p-6 rounded-lg flex-grow border-1">
            <p className="mb-6 text-foreground">{currentQuestion.question}</p>
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-200 border text-foreground ${
                    currentQuestion.answer === index
                      ? "bg-blue-400 text-white"
                      : "bg-background-subtle hover:bg-blue-400/20 hover:border-blue-400"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    className="h-5 w-5 mr-4 border-gray-500 bg-card text-blue-500 focus:ring-blue-400"
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
          ref={asideRef}
          className={`w-3/4 bg-card/90 backdrop-blur-sm flex flex-col flex-shrink-0 transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          } lg:translate-x-0 ${isDesktopAsideCollapsed 
                    ? 'lg:w-0 lg:p-0 lg:border-l-0' 
                    : 'lg:w-80 xl:w-96 p-4 sm:p-3'
                } fixed lg:relative top-0 right-0 h-full lg:h-auto z-30 lg:z-0 border-l`}
        >
          <button
            className="lg:hidden text-foreground absolute top-4 right-4 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X />
          </button>
          <button
            onClick={() => setIsDesktopAsideCollapsed(!isDesktopAsideCollapsed)}
            className={`hidden lg:flex items-center justify-center absolute top-1/2 -translate-y-1/2 bg-foreground hover:bg-muted-foreground text-background w-8 h-16 rounded-l-md z-40 transition-all duration-300 ease-in-out
                ${isDesktopAsideCollapsed
                    ? 'right-0'
                    : 'right-[20rem] xl:right-[24rem]'
                }`}
        >
            {isDesktopAsideCollapsed ? <ChevronLeft /> : <ChevronRight />}
          </button>
          {/* User Profile Section */}

          <div className="flex-shrink-0 bg-background-subtle p-4 rounded-lg mb-3 flex items-center gap-4 border text-foreground ">
            <CircleUser className="h-12 w-12 text-border" />
            <div className="text-sm">
              <div className="text-base">{profile?.name || "Student Name"}</div>
              {examGoal && <div className="text-xs">{examGoal.exam}</div>}
            </div>
          </div>

          {/* --- RESPONSIVE LEGEND SECTION --- */}
          <div className="flex-shrink-0 bg-background-subtle p-4 rounded-lg mb-3 border">
            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm text-foreground">
              <div className="flex items-center gap-2">
                <Button3 size={24} number={2} />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <Button2 size={24} number={0} />
                <span>Not Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <Button4 size={24} number={0} />
                <span>Marked</span>
              </div>
              <div className="flex items-center gap-2">
                <Button5 size={24} number={0} />
                <span>Marked & Answered</span>
              </div>

              <div className="flex items-center gap-2">
                <Button1 size={24} number={28} />
                <span>Not Visited</span>
              </div>
            </div>
          </div>

          <div className="flex-grow bg-background-subtle p-4 rounded-lg overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-background-subtle border">
            <h3 className="font-bold mb-4 text-foreground capitalize">
              {currentSection}
            </h3>
            <div className="grid grid-cols-6 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-5 gap-3 justify-items-center">
              {questions.map((q, index) => {
                const buttonProps = {
                  number: index + 1,
                  onClick: () => handlePaletteClick(index),
                  size: 40,
                };

                let ButtonComponent;
                switch (q.status) {
                  case "not-visited":
                    ButtonComponent = <Button1 {...buttonProps} />;
                    break;
                  case "not-answered":
                    ButtonComponent = <Button2 {...buttonProps} />;
                    break;
                  case "answered":
                    ButtonComponent = <Button3 {...buttonProps} />;
                    break;
                  case "marked":
                    ButtonComponent = <Button4 {...buttonProps} />;
                    break;
                  case "marked-answered":
                    ButtonComponent = <Button5 {...buttonProps} />;
                    break;
                  default:
                    ButtonComponent = null;
                }

                return (
                  <div
                    key={q.id}
                    className={`rounded ${
                      index === currentQuestionIndex
                        ? "ring-2 ring-offset-2 ring-offset-background-subtle ring-green-400"
                        : ""
                    }`}
                  >
                    {ButtonComponent}
                  </div>
                );
              })}
            </div>
          </div>
          {/**<div className="bg-background-subtle p-4 rounded-lg mb-6">
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
                      ? "ring-2 ring-offset-2 ring-offset-background-subtle ring-yellow-400"
                      : ""
                  }`}
                >
                  {q.id}
                </button>
              ))}
            </div> */}

          <div className="flex-shrink-0 mt-4 flex gap-2">
            <button className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors">
              Question Paper
            </button>
            <button
              onClick={() => setShowInstructionsModal(true)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
            >
              Instructions
            </button>
          </div>

          {/**<div className="space-y-3 mt-auto">
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
                  ? "bg-gray-500 text-muted-foreground cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {isLoading ? "Submitting..." : "Submit Test"}
            </button>
          </div>*/}
        </aside>
      </div>

      {/* --- RESPONSIVE FOOTER --- */}
      <footer
        ref={footerRef}
        className="bg-card md:p-3 flex-shrink-0 fixed bottom-0 left-0 right-0 md:relative z-10 border-t"
      >
        {/* Mobile Footer */}
        <div className="md:hidden relative">
          <div
            className={`absolute bottom-full left-0 right-0 bg-card p-3 shadow-lg transition-all duration-300 ease-in-out ${
              isFooterCollapsed
                ? "opacity-0 -translate-y-4 pointer-events-none"
                : "opacity-100 translate-y-0"
            }`}
          >
            <div className="flex justify-between gap-2">
              <button
                onClick={handleMarkForReview}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-3 rounded-lg transition-colors duration-200 text-xs"
              >
                Mark & Next
              </button>
              <button
                onClick={handleSkipSection}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-3 rounded-lg transition-colors duration-200 text-xs"
              >
                Skip Section
              </button>
              <button
                onClick={handleSubmitTest}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-lg transition-colors duration-200 text-xs flex items-center justify-center gap-1"
              >
                Submit <Check />
              </button>
            </div>
          </div>

          <div className="w-full flex items-center gap-2 p-3 bg-card">
            <div className="flex-1 grid grid-cols-3 gap-2">
              <button
                onClick={handleClearResponse}
                disabled={!currentQuestion || currentQuestion.answer === null}
                className={`font-bold py-3 px-2 rounded-lg transition-colors duration-200 text-sm ${
                  !currentQuestion || currentQuestion.answer === null
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-yellow-600 hover:bg-yellow-700 text-white"
                }`}
              >
                Clear
              </button>
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className={`bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-2 rounded-lg transition-colors duration-200 text-sm flex items-center justify-center gap-1 ${
                  currentQuestionIndex === 0
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <ChevronLeft /> Prev
              </button>
              <button
                onClick={handleSaveAndNext}
                disabled={
                  currentQuestionIndex === questionsForCurrentSection.length - 1
                }
                className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-2 rounded-lg transition-colors duration-200 text-sm flex items-center justify-center gap-1 ${
                  currentQuestionIndex === questionsForCurrentSection.length - 1
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Next <ChevronRight />
              </button>
            </div>
            <button
              onClick={() => setIsFooterCollapsed(!isFooterCollapsed)}
              className="p-3 bg-background-subtle rounded-lg"
            >
              {isFooterCollapsed ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </button>
          </div>
        </div>
        {/* Desktop Footer */}
        <div className="hidden md:flex justify-between items-center w-full gap-4">
          <div className="flex flex-wrap justify-start gap-2">
            <button
              onClick={handleMarkForReview}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
            >
              Mark & Next
            </button>
            <button
              onClick={handleClearResponse}
              disabled={!currentQuestion || currentQuestion.answer === null}
              className={`font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-sm ${
                !currentQuestion || currentQuestion.answer === null
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-yellow-600 hover:bg-yellow-700 text-white"
              }`}
            >
              Clear Response
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 text-sm flex items-center gap-2 ${
                currentQuestionIndex === 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <ChevronLeft /> Prev
            </button>
            <button
              onClick={handleSaveAndNext}
              disabled={currentQuestionIndex === questions.length - 1}
              className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 text-sm flex items-center gap-2 ${
                currentQuestionIndex === questions.length - 1
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Save & Next <ChevronRight />
            </button>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <button
              onClick={handleSkipSection}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-sm flex items-center justify-center gap-2"
            >
              Skip Section <ChevronsRight />
            </button>
            <button
              onClick={handleSubmitTest}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-sm flex items-center justify-center gap-2"
            >
              Submit <Check />
            </button>
          </div>
        </div>
        {/**<div className="flex flex-wrap justify-center gap-3">
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
                ? "bg-gray-500 text-muted-foreground cursor-not-allowed opacity-50"
                : "bg-yellow-600 hover:bg-yellow-700 text-white"
            }`}
          >
            Clear Response
          </button>
        </div>*/}
        {/**<button
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
        </button>*/}
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
            attemptedQuestions: questions.filter((q) => q.answer !== null)
              .length,
            correctQuestions: questions.filter((q) => q.answer !== null).length, // This should be calculated based on correct answers
            totalQuestions: questions.length,
            positiveMarks: 0, // This should be calculated based on correct answers
            negativeMarks: 0, // This should be calculated based on incorrect answers
            totalMarks: 0, // This should be calculated
            timeTaken: `${Math.floor((600 - timeLeft) / 60)}:${(
              (600 - timeLeft) %
              60
            )
              .toString()
              .padStart(2, "0")}`,
            rank: 1, // This should come from API
            totalStudents: 100, // This should come from API
            sessionId: sessionId || undefined, // Add session ID for feedback tracking
          }}
          onClose={handleCloseTestResultDialog}
          navigate={() => {
            navigate(ROUTES.ANALYSIS2);
          }}
        />
      )}
      {showInstructionsModal && (
        <InstructionsModal onClose={() => setShowInstructionsModal(false)} />
      )}
    </div>
  );
};

export default TestMainPage;
