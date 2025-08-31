import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { ROUTES } from "../../routes/constants";
import { ChevronDown, CircleUser, Hexagon } from "lucide-react";

// --- Type Definitions ---
interface ExamDetails {
  title: string;
  totalQuestions: string;
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
    totalQuestions: "5 Questions",
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
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const [language, setLanguage] = useState("English");
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [textSize, setTextSize] = useState("text-base");
  const location = useLocation();
  const { profile } = useUser();
  const testConfig = location.state?.testConfig;
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setIsLangDropdownOpen(false);
  };
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
  return (
    // The main container now uses h-screen to take the full viewport height

    <div
      className="bg-card text-foreground w-full flex flex-col h-screen overflow-hidden"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      {/* Header Section - This part will not scroll */}
      <header className="bg-card p-3 flex justify-between items-center z-10 border-b">
        {/*<div className="flex items-center justify-between ml-18 lg:ml-0">
          <Hexagon width={48} height={48} className="text-muted-foreground" />
        </div>*/}
        <div className="flex text-center px-2">
          <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">
            {examDetails.title}
          </h1>
        </div>
        <div className=" items-center space-x-4 hidden sm:flex">
          <div className="text-right">
            <p className="font-semibold">{profile?.name || "Student Name"}</p>
          </div>

          <CircleUser
            height={48}
            width={48}
            className="text-muted-foreground"
          />
        </div>
      </header>
      {/* Main Content Area: flex-grow allows this section to fill available space, and overflow-y-auto enables scrolling */}
      <div className="flex-grow overflow-y-auto">
        <main className={`p-6 sm:p-8 ${textSize}`}>
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* Left: Exam Details */}
              <div className="flex flex-row gap-6">
                <p className="text-sm text-foreground">
                  Total Questions: {examDetails.totalQuestions}
                </p>
                <p className="text-sm text-foreground">
                  Maximum Marks: {examDetails.maxMarks}
                </p>
                <p className="text-sm text-foreground">
                  Duration: {examDetails.duration}
                </p>
              </div>

              {/* Right: Controls */}
              <div className="flex items-center justify-end gap-2 sm:gap-4 w-full sm:w-auto">
                <select
                  onChange={(e) => setTextSize(e.target.value)}
                  value={textSize}
                  className="bg-background-subtle text-white rounded-md px-2 py-1 appearance-none text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="text-sm">A-</option>
                  <option value="text-base">A</option>
                  <option value="text-lg">A+</option>
                </select>

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
          </div>

          <h2 className="text-xl font-bold mt-2 text-foreground mb-4">
            Read the following instructions carefully.
          </h2>
          {/* Instructions List */}
          <ul className="space-y-3 text-foreground list-decimal list-inside mb-8">
            {examDetails.instructions.map(
              (instruction: string, index: number) => (
                <li key={index}>{instruction}</li>
              )
            )}
          </ul>
        </main>

        {/* The student info section has been removed as requested. */}
      </div>
      {/* Footer Buttons */}
      <footer className="flex-shrink-0 p-6 border-t border-border space-y-4">
        {/* Language Note */}
        <div className="text-destructive">
          <p>{examDetails.languageNote}</p>
        </div>
        {/* Confirmation Checkbox */}
        <div className="flex items-start space-x-4 mb-8">
          <input
            type="checkbox"
            id="confirmation"
            checked={isConfirmed}
            onChange={() => setIsConfirmed(!isConfirmed)}
            className="mt-1 h-5 w-5 rounded cursor-pointer"
          />
          <label
            htmlFor="confirmation"
            className="text-sm text-foreground cursor-pointer"
          >
            {examDetails.agreementText}
          </label>
        </div>
        <div className=" flex justify-between items-center ">
          <button
            onClick={() => navigate(ROUTES.EXAM_INFO)}
            className="bg-border-high hover:bg-border-medium text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Previous
          </button>
          <button
            disabled={!isConfirmed}
            onClick={() =>
              navigate(ROUTES.TEST_MAIN_PAGE, {
                state: { testConfig: testConfig },
              })
            }
            className={`font-bold py-2 px-6 rounded-lg transition-all ${
              isConfirmed
                ? "bg-primary hover:bg-primary/80 text-white cursor-pointer"
                : "bg-border-medium text-border cursor-not-allowed"
            }`}
          >
            I am ready to begin
          </button>
        </div>
      </footer>
    </div>
  );
};
