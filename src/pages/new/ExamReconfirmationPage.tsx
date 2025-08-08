import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/constants";

// --- Type Definitions ---
interface ExamDetails {
  title: string;
  duration: string;
  maxMarks: string;
  instructions: string[];
  languageNote: string;
  agreementText: string;
}

// Main App Component
export default function ExamReconfirmationPage() {
  // Demo data for the exam confirmation page
  // The studentName property has been removed as it's no longer displayed.
  const examData = {
    title:
      "CISF Constable (Fireman): General Awareness - सामान्य जागरूकता - Quiz",
    duration: "5 Mins",
    maxMarks: "5",
    instructions: [
      "The Quiz contains 5 questions.",
      "Each question has 4 options out of which only one is correct.",
      "You have to finish the quiz in 5 minutes.",
      "You will be awarded 1 marks for each correct answer and There is No negative marking.",
      "There is no penalty for the questions that you have not attempted.",
      "Once you start the quiz, you will not be allowed to reattempt it. Make sure that you complete the quiz before you submit the quiz and/or close the browser.",
    ],
    languageNote:
      "Please note all questions will appear in your default language. This language can be changed for a particular question later on.",
    agreementText:
      "I have read all the instructions carefully and have understood them. I agree not to cheat or use unfair means in this examination. I understand that using unfair means of any sort for my own or someone else's advantage will lead to my immediate disqualification. The decision of Testbook.com will be final in these matters and cannot be appealed.",
  };

  return <ExamConfirmationPage examDetails={examData} />;
}

// Main Exam Confirmation Page Component
const ExamConfirmationPage: React.FC<{ examDetails: ExamDetails }> = ({
  examDetails,
}) => {
  const navigate = useNavigate();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const location = useLocation();
  const testId = location.state?.testId;
  const testConfig = location.state?.testConfig;

  return (
    <div className="bg-gray-900 min-h-screen font-sans text-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {" "}
        {/* Adjusted max-width for a more centered, single-column layout */}
        {/* Top Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-lg md:text-xl font-semibold text-gray-100">
            {examDetails.title}
          </h1>
          <span className="bg-gray-700 text-sm px-3 py-1 rounded-md">
            Maximum Marks: {examDetails.maxMarks}
          </span>
        </header>
        {/* Main Content Area */}
        <div className="grid grid-cols-1 gap-8">
          {/* Main Instruction Panel */}
          <main className="bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg">
            <div className="mb-6">
              <p className="text-sm text-gray-400">
                Duration: {examDetails.duration}
              </p>
              <h2 className="text-xl font-bold mt-2 text-white">
                Read the following instructions carefully.
              </h2>
            </div>

            {/* Instructions List */}
            <ul className="space-y-3 text-gray-300 list-decimal list-inside mb-8">
              {examDetails.instructions.map(
                (instruction: string, index: number) => (
                  <li key={index}>{instruction}</li>
                )
              )}
            </ul>

            {/* Language Note */}
            <div className="bg-pink-900/40 border border-pink-700 text-pink-300 p-4 rounded-lg mb-8">
              <p>{examDetails.languageNote}</p>
            </div>

            {/* Confirmation Checkbox */}
            <div className="flex items-start space-x-4">
              <input
                type="checkbox"
                id="confirmation"
                checked={isConfirmed}
                onChange={() => setIsConfirmed(!isConfirmed)}
                className="mt-1 h-5 w-5 bg-gray-700 border-gray-600 rounded text-blue-500 focus:ring-blue-600 cursor-pointer"
              />
              <label
                htmlFor="confirmation"
                className="text-sm text-gray-400 cursor-pointer"
              >
                {examDetails.agreementText}
              </label>
            </div>
          </main>

          {/* The student info section has been removed as requested. */}
        </div>
        {/* Footer Buttons */}
        <footer className="mt-8 pt-6 border-t border-gray-700 flex justify-between items-center">
          <button
            onClick={() => navigate(ROUTES.EXAM_INFO)}
            className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Previous
          </button>
          <button
            disabled={!isConfirmed}
            onClick={() =>
              navigate(ROUTES.TEST_MAIN_PAGE, {
                state: { testId: testId, testConfig: testConfig },
              })
            }
            className={`font-bold py-2 px-6 rounded-lg transition-all ${
              isConfirmed
                ? "bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            I am ready to begin
          </button>
        </footer>
      </div>
    </div>
  );
};
