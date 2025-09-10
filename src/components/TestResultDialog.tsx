import { FileText, X } from "lucide-react";
import VideoFeedbackModal from "./feedback/VideoFeedbackModal";
import { useState, useCallback, useEffect } from "react";

// --- Type Definitions ---
interface TestResults {
  attemptedQuestions: number;
  correctQuestions: number;
  totalQuestions: number;
  positiveMarks: number;
  negativeMarks: number;
  totalMarks: number;
  timeTaken: string;
  rank: number;
  totalStudents: number;
  sessionId?: number; // Add session ID for feedback tracking
}

interface StatRowProps {
  label: string;
  value: string | number;
}

interface ResultModalHeaderProps {
  onClose: () => void;
}

interface ResultModalBodyProps {
  results: TestResults;
  existingRating?: number;
}

interface ResultModalFooterProps {
  onClose: () => void;
  navigate: () => void;
}

interface TestResultDialogProps {
  results: TestResults;
  onClose: () => void;
  navigate: () => void;
}

// --- Reusable Helper Components ---

// Helper component for individual statistic rows
const StatRow = ({ label, value }: StatRowProps) => (
  <div className="flex justify-between items-center py-4 border-b border-gray-700 last:border-b-0">
    <p className="text-gray-400 text-sm md:text-base">{label}</p>
    <p className="text-white font-semibold text-sm md:text-base">{value}</p>
  </div>
);

// --- Modular Modal Components ---

// Header for the results modal
const ResultModalHeader = ({ onClose }: ResultModalHeaderProps) => (
  <div className="flex justify-between items-center p-5 border-b border-gray-700">
    <h2 className="text-xl md:text-2xl font-bold flex items-center">
      <FileText className="mr-3 text-blue-400" size={24} />
      Test Result
    </h2>
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      className="text-gray-400 hover:text-white transition-colors rounded-full p-1"
      aria-label="Close"
    >
      <X size={24} />
    </button>
  </div>
);

// Body/Content for the results modal
const ResultModalBody = ({ 
  results, 
  existingRating 
}: ResultModalBodyProps) => {
  const {
    attemptedQuestions,
    correctQuestions,
    totalQuestions,
    positiveMarks,
    negativeMarks,
    totalMarks,
    timeTaken,
    rank,
    totalStudents,
  } = results;

  return (
    <div className="p-6">
      <StatRow label="Attempted Questions" value={attemptedQuestions} />
      <StatRow label="Correct Questions" value={correctQuestions} />
      <StatRow
        label="Attempted / Total"
        value={`${attemptedQuestions} / ${totalQuestions}`}
      />

      {/* Marks Scored Section */}
      <div className="flex justify-between items-start py-4 border-b border-gray-700">
        <p className="text-gray-400 text-sm md:text-base">Marks Scored</p>
        <div className="text-right">
          <p className="text-green-400 font-semibold text-sm md:text-base">
            Positive: {positiveMarks}
          </p>
          <p className="text-red-400 font-semibold text-sm md:text-base">
            Negative: {negativeMarks}
          </p>
          <p className="text-white font-bold text-base md:text-lg mt-1">
            Total: {totalMarks}
          </p>
        </div>
      </div>

      <StatRow label="Time Taken" value={timeTaken} />
      <StatRow label="Rank" value={`${rank} / ${totalStudents}`} />

      {/* Feedback Section */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-semibold text-sm md:text-base">
              Test Experience
            </h4>
            {existingRating && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-green-400">
                  Rated: {existingRating} stars
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-3 h-3 ${
                        star <= existingRating 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-600'
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Feedback button functionality removed as it's not used
            }}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-blue-600 hover:bg-blue-500 text-white"
          >
            Rate Experience
          </button>
        </div>
      </div>
    </div>
  );
};

// Footer for the results modal
const ResultModalFooter = ({ 
  onClose, 
  navigate
}: ResultModalFooterProps) => (
  <div className="flex flex-col sm:flex-row gap-3 p-5 bg-gray-800/50 rounded-b-2xl">
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
    >
      Close
    </button>
    <button
      onClick={(e) => {
        e.stopPropagation();
        navigate();
      }}
      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      View Detailed Analysis
    </button>
  </div>
 );

// --- Main Component: TestResultDialog ---
// This component now composes the smaller modular parts.
const TestResultDialog = ({
  results,
  onClose,
  navigate,
}: TestResultDialogProps) => {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [canSubmitFeedback, setCanSubmitFeedback] = useState(true);
  const [existingFeedback] = useState<any>(null);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
  
  // Simple feedback state management
  const markAsSubmitted = useCallback(() => {
    setCanSubmitFeedback(false);
  }, []);



  const handleCloseFeedback = useCallback(() => {
    setIsFeedbackModalOpen(false);
  }, []);

  const handleFeedbackSubmit = useCallback(async (payload: any) => {
    markAsSubmitted();
    handleCloseFeedback();
    
    // Always execute pending navigation after feedback submission
    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    } else {
      onClose();
    }
  }, [markAsSubmitted, handleCloseFeedback, pendingNavigation, onClose]);

  const handleFeedbackSkip = useCallback(() => {
    handleCloseFeedback();
    
    // Always execute pending navigation after feedback skip
    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    } else {
      onClose();
    }
  }, [handleCloseFeedback, pendingNavigation, onClose]);

  // Auto-open feedback modal after test completion
  const shouldAutoOpenFeedback = canSubmitFeedback;

  
  // Open feedback immediately when results are shown if allowed
  useEffect(() => {
    if (shouldAutoOpenFeedback) {
      setIsFeedbackModalOpen(true);
    }
  }, [shouldAutoOpenFeedback]);

  // Intercept navigation and open feedback first
  const handleNavigation = useCallback(() => {
    if (canSubmitFeedback) {
      // Always store the navigation action and open feedback
      setPendingNavigation(() => navigate);
      setIsFeedbackModalOpen(true);
    } else {
      // No feedback needed, navigate directly
      navigate();
    }
  }, [canSubmitFeedback, navigate]);

  // Intercept close and open feedback first
  const handleClose = useCallback(() => {
    if (canSubmitFeedback) {
      // Always store the close action and open feedback
      setPendingNavigation(() => onClose);
      setIsFeedbackModalOpen(true);
    } else {
      // No feedback needed, close directly
      onClose();
    }
  }, [canSubmitFeedback, onClose]);
  
  if (!results) {
    return null; // Don't render if there are no results
  }

  return (
    <>
      <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm fixed inset-0 z-50 flex justify-center items-center p-4">
        <div 
          className="bg-[#1e2124] text-white rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all duration-300 scale-100 animate-fadeIn cursor-pointer"
          onClick={() => {
            // Always open feedback modal if user can submit feedback
            if (canSubmitFeedback) {
              setIsFeedbackModalOpen(true);
            }
          }}
        >
          <ResultModalHeader onClose={handleClose} />
          <ResultModalBody 
            results={results} 
            existingRating={existingFeedback?.rating}
          />
          <ResultModalFooter 
            onClose={handleClose} 
            navigate={handleNavigation}
          />
        </div>

        {/* This style block is for the fadeIn animation */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out forwards;
          }
        `}</style>
      </div>

      {/* Feedback Modal */}
      <VideoFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={handleCloseFeedback}
        videoId={results.sessionId?.toString() || "unknown"}
        videoTitle={`Test Session ${results.sessionId}`}
        playPercentage={100} // Test is completed
        onSubmit={handleFeedbackSubmit}
        onSkip={handleFeedbackSkip}
        onDismiss={handleCloseFeedback}
        canSubmitFeedback={canSubmitFeedback}
        existingFeedback={existingFeedback}
        markAsSubmitted={markAsSubmitted}
        componentName="Test"
      />

      {/* Auto-open overlay removed; we now directly open the modal via effect */}
    </>
  );
};

export default TestResultDialog;
