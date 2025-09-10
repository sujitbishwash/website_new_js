import Dropdown from "@/components/ui/dropdown";
import { FC, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { examGoalApi, ExamType } from "../../lib/api-client";
import { ROUTES } from "../../routes/constants";
import AiPadhaiLogo from "../../assets/ai_padhai_logo.svg";

// --- Type Definitions ---
interface ExamData {
  [key: string]: string[];
}

// --- Reusable Components ---

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

  const handleExamTypeChange = (value: string) => {
    setExamType(value);
    setSpecificExam(""); // Reset specific exam when type changes
  };

  const handleSpecificExamChange = (value: string) => {
    setSpecificExam(value);
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
      const response = await examGoalApi.addExamGoal(examType, specificExam);
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
    
    <div className="w-full max-w-md space-y-8 rounded-2xl bg-card p-4 sm:p-8 shadow-2xl transition-all duration-500 border border-divider">
      <div className="text-center">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">
          Select Your Exam Goal
        </h2>
        <p className="mt-2 text-center text-sm sm:text-md text-muted-foreground">
          Choose your exam to personalize the experience.
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
            <p className="mt-2 text-sm">
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
            className={`w-full text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50 cursor-pointer ${
              isButtonDisabled ? "bg-muted-foreground cursor-not-allowed" : "bg-primary hover:bg-primary/80 hover:shadow-lg"
            }`}
          >
            {isSubmitting
              ? "Navigating to dashboard..."
              : "Continue to Dashboard"}
          </button>
        </div>
      )}
      {/* YouTube Source Dialog Modal */}
      {/**<AddSourceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          navigate(ROUTES.HOME);
        }}
      />*/}
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

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <main
        className="flex min-h-screen w-full items-center justify-center p-4"
      >
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <p className="mt-2 text-sm">
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
    
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <style>{`
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
                animation: fadeIn 0.5s ease-in-out;
            }
        `}</style>
      
        <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
        <div
          className={`flex items-center gap-2 overflow-hidden transition-all duration-300 lg:w-auto`}
        >
          <img src={AiPadhaiLogo} alt="Logo" width={30} height={30} />
          <h1
            className={`text-xl font-semibold whitespace-nowrap overflow-hidden transition-all duration-300 lg:w-auto`}
          >
            AI Padhai
          </h1>
        </div>
      </header>
      <ExamGoalSelector />
    </main>
  );
};

export default ExamGoalPage;
