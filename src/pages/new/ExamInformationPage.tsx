// To make this component work, you need to have React and Tailwind CSS set up in your project.
// You can use this component by importing it and rendering it in your main App file.

import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { ROUTES } from "../../routes/constants";

// Icon components for the legend - using inline SVG for simplicity
const NotVisitedIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="14" height="14" rx="2" fill="#6B7280" />
  </svg>
);

const NotAnsweredIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="14" height="14" rx="7" fill="#EF4444" />
  </svg>
);

const AnsweredIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="14" height="14" rx="7" fill="#22C55E" />
  </svg>
);

const MarkedForReviewIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16ZM7.25 11.5L12 8L7.25 4.5V11.5Z"
      fill="#6366F1"
    />
    <path d="M4 12V4H5V12H4Z" fill="white" />
  </svg>
);

const AnsweredAndMarkedIcon = () => (
  <div className="relative">
    <AnsweredIcon />
    <svg
      className="absolute -bottom-1 -right-1"
      width="8"
      height="8"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="6" cy="6" r="6" fill="#6366F1" />
      <path d="M4.5 8.5L7.5 6L4.5 3.5V8.5Z" fill="white" />
    </svg>
  </div>
);

// Main component for the instructions page
export default function ExamInformationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, examGoal } = useUser();
  const testId = location.state?.testId;
  const testConfig = location.state?.testConfig;

  return (
    <div className="bg-gray-900 text-gray-300 min-h-screen font-sans flex items-center justify-center">
      {/* The card is now a flex container with a column direction and a max height */}
      <div className="bg-gray-800 rounded-2xl shadow-2xl shadow-indigo-500/10 overflow-hidden w-full max-w-5xl flex flex-col h-full max-h-[95vh]">
        {/* Header Section - This part will not scroll */}
        <header className="flex-shrink-0 flex justify-between items-center p-6 border-b border-gray-700">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Exam Instructions
          </h1>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="font-semibold text-white">
                {profile?.name || "Student Name"}
              </p>
              <p className="text-xs text-gray-400">
                {profile?.email || "Email not available"}
              </p>
              {examGoal && (
                <p className="text-xs text-blue-400">
                  {examGoal.exam} - {examGoal.groupType}
                </p>
              )}
            </div>
            <img
              src="https://placehold.co/48x48/6366F1/FFFFFF?text=S"
              alt="Student avatar"
              className="w-12 h-12 rounded-full border-2 border-indigo-500"
            />
          </div>
        </header>

       {/* Main Content - This area will grow and become scrollable if content overflows */}
        <main className="flex-grow overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* General Instructions */}
          <section>
            <h2 className="text-xl font-semibold text-indigo-400 mb-4">
              General Instructions
            </h2>
            <div className="space-y-3 text-gray-300">
              <p>{instructions.general[0]}</p>
              <p>{instructions.general[1]}</p>
              <ul className="space-y-3 pl-6 pt-2">
                {instructions.legend.map((item, index) => (
                  <li key={index} className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
              <p className="pt-2 italic text-gray-400">
                {instructions.markedForReviewNote}
              </p>
            </div>
          </section>

          {/* Navigating to a Question */}
          <section>
            <h2 className="text-xl font-semibold text-indigo-400 mb-4">
              Navigating to a Question
            </h2>
            <div className="space-y-3 text-gray-300">
              <p>{instructions.navigating[0]}</p>
              <ul className="space-y-3 pl-6">
                <li>{instructions.navigating[1]}</li>
                <li>{instructions.navigating[2]}</li>
                <li>{instructions.navigating[3]}</li>
              </ul>
              <p className="font-semibold text-amber-400">
                {instructions.navigating[4]}
              </p>
              <div className="p-4 bg-gray-700/50 border border-gray-600 rounded-lg mt-2">
                <p className="text-gray-400">
                  You can shuffle between sections and questions anytime during
                  the examination as per your convenience.
                </p>
              </div>
            </div>
          </section>

          {/* Answering a Question */}
          <section>
            <h2 className="text-xl font-semibold text-indigo-400 mb-4">
              Answering a Question
            </h2>
            <div className="space-y-3 text-gray-300">
              <p>{instructions.answering[0]}</p>
              <ul className="space-y-3 pl-6">
                <li>{instructions.answering[1]}</li>
                <li>{instructions.answering[2]}</li>
                <li>{instructions.answering[3]}</li>
                <li>{instructions.answering[4]}</li>
                <li className="font-semibold">{instructions.answering[5]}</li>
              </ul>
            </div>
          </section>
        </main>

        {/* Footer with Navigation Buttons - This part will not scroll */}
        <footer className="flex-shrink-0 flex justify-between items-center p-6 border-t border-gray-700">
          <button
            onClick={() =>
              navigate(ROUTES.TEST_SERIES, {
                state: {
                  testId: testId,
                  isDemo: false,
                },
              })
            }
            className="px-6 py-2 font-semibold text-white bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Previous
          </button>
          <button
            onClick={() =>
              navigate(ROUTES.EXAM_RECONFIRM, {
                state: { testId: testId, testConfig: testConfig },
              })
            }
            className="px-8 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-lg shadow-indigo-500/30"
          >
            Next
          </button>
        </footer>
      </div>
    </div>
  );
}

const instructions = {
  general: [
    "The clock has been set at the server and the countdown timer at the top right corner of the screen will display the remaining time available for you to complete the examination. When the timer reaches zero, the examination will end by itself. You will not be required to end or submit your examination.",
    "The Question Palette displayed on the right side of screen will show the status of each question using one of the following symbols:",
  ],
  legend: [
    {
      icon: <NotVisitedIcon />,
      text: "You have not visited the question yet.",
    },
    {
      icon: <NotAnsweredIcon />,
      text: "You have not answered the question.",
    },
    { icon: <AnsweredIcon />, text: "You have answered the question." },
    {
      icon: <MarkedForReviewIcon />,
      text: "You have not answered the question, but have marked the question for review.",
    },
    {
      icon: <AnsweredAndMarkedIcon />,
      text: "You have answered the question, but marked it for review.",
    },
  ],
  markedForReviewNote:
    "The Marked for Review status for a question simply indicates that you would like to look at that question again. If a question is answered and Marked for Review, your answer for that question will be considered in the evaluation.",
  navigating: [
    "To answer a question, do the following:",
    "a. Click on the question number in the Question Palette at the right of your screen to go to that numbered question directly. Note that using this option does NOT save your answer to the current question.",
    "b. Click on Save & Next to save your answer for the current question and then go to the next question.",
    "c. Click on Mark for Review & Next to save your answer for the current question, mark it for review, and then go to the next question.",
    "Caution: Note that your answer for the current question will not be saved if you navigate to another question directly (without saving) by clicking on its question number.",
  ],
  answering: [
    "Procedure for answering a multiple choice type question:",
    "a. To select your answer, click on the button of one of the options.",
    "b. To deselect your chosen answer, click on the button of the chosen option again or click on the Clear Response button.",
    "c. To change your chosen answer, click on the button of another option.",
    "d. To save your answer, you MUST click on the Save & Next button.",
    "e. To mark the question for review, click on the Mark for Review & Next button. If an answer is selected for a question that is Marked for Review, that answer will be considered in the evaluation.",
  ],
};
