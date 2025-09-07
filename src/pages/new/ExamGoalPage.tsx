import { AddSourceModal } from "@/components/YouTubeSourceDialog";
import { theme } from "@/styles/theme";
import { ChangeEvent, FC, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { examGoalApi, ExamType } from "../../lib/api-client";
import { ROUTES } from "../../routes/constants";

// --- Type Definitions ---
interface ExamData {
  [key: string]: string[];
}

// --- Reusable Components ---

// Props for the Dropdown component
interface DropdownProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  placeholder: string;
  disabled?: boolean;
  id: string;
}

// Custom Dropdown Component
const Dropdown: FC<DropdownProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  id,
}) => {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block text-sm font-medium mb-2"
        style={{ color: theme.secondaryText }}
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full appearance-none rounded-lg border px-4 py-3 pr-10 focus:outline-none focus:ring-2"
          style={{
            backgroundColor: disabled ? theme.inputBackground : theme.mutedText,
            borderColor: theme.divider,
            color: theme.primaryText,
            cursor: disabled ? "not-allowed" : "pointer",
            outlineColor: theme.accent,
          }}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
          <svg
            className="h-5 w-5"
            style={{ color: theme.secondaryText }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

// Main Card Component
const ExamGoalSelector: FC = () => {
  const navigate = useNavigate();
  const { checkExamGoal, refreshUserData } = useAuth();
  
  const [examType, setExamType] = useState<string>("");
  const [specificExam, setSpecificExam] = useState<string>("");
  const [examData, setExamData] = useState<ExamData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormCompleted, setIsFormCompleted] = useState(false);

  // Navigation guard to prevent leaving without completing
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isFormCompleted && (examType || specificExam)) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isFormCompleted, examType, specificExam]);

  // Fetch exam data from API
  useEffect(() => {
    const fetchExamData = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await examGoalApi.getExamTypes();

        if (response.data.success && response.data.data) {
          // Transform API data to match our interface
          const transformedData: ExamData = {};
          response.data.data.forEach((examType: ExamType) => {
            transformedData[examType.value] = examType.group;
          });
          setExamData(transformedData);
        } else {
          throw new Error("Failed to fetch exam data");
        }
      } catch (err: any) {
        console.error("Failed to fetch exam data:", err);
        setError("Failed to load exam data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExamData();
  }, []);

  const examTypes = useMemo(() => Object.keys(examData), [examData]);
  const specificExams = useMemo(
    () => (examType ? examData[examType] : []),
    [examType, examData]
  );

  const handleExamTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setExamType(e.target.value);
    setSpecificExam(""); // Reset specific exam when type changes
  };

  const handleSpecificExamChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSpecificExam(e.target.value);
  };

  const handleSubmit = async () => {
    if (!examType || !specificExam) return;

    console.log("🚀 Starting exam goal submission...", {
      examType,
      specificExam,
    });

    try {
      setIsSubmitting(true);

      // commenting until the API is ready
      const response = await examGoalApi.addExamGoal(specificExam, examType);
      console.log("📡 API Response:", response);

      if (response.data.success) {
        console.log("✅ Exam goal added successfully:", response.data.message);

        

        // Force refresh the user data to get the updated exam goal
        console.log("🔄 Force refreshing user data...");
        await refreshUserData();

        // Update exam goal state
        console.log("🔍 Checking exam goal state...");
        await checkExamGoal();

        // Mark form as completed to allow navigation
        setIsFormCompleted(true);

        // Navigate to dashboard or show success message
        setIsModalOpen(true);

        // Navigate to home page immediately after successful submission
        console.log("🏠 Navigating to home page...");
        navigate(ROUTES.HOME);
      } else {
        console.log("❌ API call failed:", response.data);
      }
    } catch (err: any) {
      console.error("❌ Failed to add exam goal:", err);
      console.error("❌ Error details:", {
        message: err.message,
        status: err.status,
        data: err.data,
      });
      // You can add error handling logic here
    } finally {
      setIsSubmitting(false);
    }
  };

  const isButtonDisabled = !examType || !specificExam || isSubmitting;

  return (
    <div
      className="w-full max-w-2xl rounded-2xl p-6 sm:p-8 md:p-12 shadow-2xl"
      style={{ backgroundColor: theme.cardBackground }}
    >
      <div className="text-center">
        <h1
          className="text-3xl sm:text-4xl font-bold"
          style={{ color: theme.primaryText }}
        >
          Select Your Exam Goal
        </h1>
        <p
          className="mt-3 text-base sm:text-lg"
          style={{ color: theme.secondaryText }}
        >
          Choose the exam you are preparing for to personalize your learning
          experience.
        </p>
      </div>

      <div className="mt-10 space-y-8">
        {error && (
          <div className="text-center p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            <p className="mt-2 text-sm" style={{ color: theme.secondaryText }}>
              Loading exam data...
            </p>
          </div>
        ) : (
          <>
            <Dropdown
              id="exam-type"
              label="Exam Type"
              value={examType}
              onChange={handleExamTypeChange}
              options={examTypes}
              placeholder="Select Exam Type"
            />
            <Dropdown
              id="specific-exam"
              label="Specific Exam / Board"
              value={specificExam}
              onChange={handleSpecificExamChange}
              options={specificExams}
              placeholder="Select Specific Exam"
              disabled={!examType}
            />
          </>
        )}
      </div>

      {!isLoading && (
        <div className="mt-12">
          <button
            onClick={handleSubmit}
            disabled={isButtonDisabled}
            className={`w-full text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${
              isButtonDisabled ? "cursor-not-allowed" : "hover:shadow-lg"
            }`}
            style={{
              backgroundImage: isButtonDisabled
                ? "none"
                : `linear-gradient(to right, ${theme.buttonGradientFrom}, ${theme.buttonGradientTo})`,
              backgroundColor: isButtonDisabled ? theme.mutedText : "",
              outlineColor: theme.accent,
            }}
          >
            {isSubmitting
              ? "Navigating to dashboard..."
              : "Continue to Dashboard"}
          </button>
        </div>
      )}
      {/* YouTube Source Dialog Modal */}
      <AddSourceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          navigate(ROUTES.HOME);
        }}
      />
    </div>
  );
};

// Main App Component
const ExamGoalPage: FC = () => {
  const { isAuthenticated, isLoading, hasExamGoal } = useAuth();
  const navigate = useNavigate();

  // Redirect to home if user is authenticated and has exam goal
  useEffect(() => {
    if (!isLoading && isAuthenticated && hasExamGoal) {
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [isAuthenticated, isLoading, hasExamGoal, navigate]);

  // This hook runs once when the component mounts to load Tailwind CSS.
  useEffect(() => {
    // Check if the script already exists to avoid adding it multiple times
    if (!document.querySelector('script[src="https://cdn.tailwindcss.com"]')) {
      const script = document.createElement("script");
      script.src = "https://cdn.tailwindcss.com";
      script.async = true;
      // Appending to the document head is standard practice
      document.head.appendChild(script);
    }
  }, []); // The empty dependency array ensures this effect runs only once.

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <main
        className="flex min-h-screen w-full items-center justify-center p-4"
        style={{
          backgroundColor: theme.background,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <p className="mt-2 text-sm" style={{ color: theme.secondaryText }}>
            Loading...
          </p>
        </div>
      </main>
    );
  }

  // Don't render exam goal form if user is authenticated and has exam goal
  if (isAuthenticated && hasExamGoal) {
    return null;
  }

  return (
    <main
      className="flex min-h-screen w-full items-center justify-center p-4"
      style={{
        backgroundColor: theme.background,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap');
        `}
      </style>
      <ExamGoalSelector />
    </main>
  );
};

export default ExamGoalPage;
