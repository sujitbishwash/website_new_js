// To make this component work, you need to have React and Tailwind CSS set up in your project.
// You can use this component by importing it and rendering it in your main App file.

import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { ROUTES } from "../../routes/constants";
import {
  Button1,
  Button2,
  Button3,
  Button4,
  Button5,
} from "../../components/test/buttons";
import { CircleUser } from "lucide-react";
// Icon components for the legend - using inline SVG for simplicity

// Main component for the instructions page
export default function ExamInformationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useUser();
  const testConfig = location.state?.testConfig;

  return (
    <div
      className="bg-card overflow-hidden w-full flex flex-col max-h-[100vh]"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      {/* Header Section - This part will not scroll */}
      <header className="bg-card p-3 flex justify-between items-center z-10 border-b">
        {/*<div className="flex items-center justify-between ml-18 lg:ml-0">
          <Hexagon width={48} height={48} className="text-muted-foreground" />
        </div>*/}
        <div className="flex text-center px-2">
          <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">
            {instructions.title}
          </h1>
        </div>
        <div className=" items-center space-x-4 hidden sm:flex">
          <div className="text-right">
            <p className="font-semibold">{profile?.name || "Student Name"}</p>
          </div>

          <CircleUser height={48} width={48} className="text-muted-foreground" />
        </div>
      </header>

      {/* Main Content - This area will grow and become scrollable if content overflows */}
      <main className="flex-grow overflow-y-auto p-6 sm:p-8 space-y-8">
        {/* General Instructions */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            General Instructions
          </h2>
          <div className="space-y-3 text-foreground">
            <p>{instructions.general[0]}</p>
            <p>{instructions.general[1]}</p>
            <ul className="space-y-3 pl-6 pt-2">
              {instructions.legend.map((item, index) => (
                <li key={index} className="flex items-center space-x-4">
                  <div>{item.icon}</div>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
            <p className="pt-2 italic text-foreground">
              {instructions.markedForReviewNote}
            </p>
          </div>
        </section>

        {/* Navigating to a Question */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Navigating to a Question
          </h2>
          <div className="space-y-3 text-foreground">
            <p>{instructions.navigating[0]}</p>
            <ul className="space-y-3 pl-6">
              <li>{instructions.navigating[1]}</li>
              <li>{instructions.navigating[2]}</li>
              <li>{instructions.navigating[3]}</li>
            </ul>
            <p className="!mt-4 p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg font-semibold text-red-700 dark:text-red-300">
                  {instructions.navigating[4]}
                </p>
                <p className="p-3 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-r-lg font-semibold text-green-700 dark:text-green-300">
                  {instructions.navigating[5]}
                </p>
          </div>
        </section>

        {/* Answering a Question */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Answering a Question
          </h2>
          <div className="space-y-3 text-foreground">
            <p>{instructions.answering[0]}</p>
            <ul className="space-y-3 pl-6">
              <li>{instructions.answering[1]}</li>
              <li>{instructions.answering[2]}</li>
              <li>{instructions.answering[3]}</li>
              <li>{instructions.answering[4]}</li>
              <li>{instructions.answering[5]}</li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer with Navigation Buttons - This part will not scroll */}
      <footer className="flex-shrink-0 flex justify-between items-center p-2 sm:p-6 border-t border-border gap-2">
        <button
          onClick={() =>
            navigate(ROUTES.TEST_SERIES, {
              state: {
                isDemo: false,
              },
            })
          }
          className="w-full sm:w-auto px-6 py-2 font-semibold text-white bg-border-high hover:bg-border-medium rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-border-medium"
        >
          Back
        </button>
        <button
          onClick={() =>
            navigate(ROUTES.EXAM_RECONFIRM, {
              state: { testConfig: testConfig },
            })
          }
          className="w-full sm:w-auto px-6 py-2 font-bold text-white bg-primary hover:bg-primary/80 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Next
        </button>
      </footer>
    </div>
  );
}

const instructions = {
  title:
    "CISF Constable (Fireman): General Awareness - सामान्य जागरूकता - Quiz",
  general: [
    "The clock has been set at the server and the countdown timer at the top right corner of the screen will display the remaining time available for you to complete the examination. When the timer reaches zero, the examination will end by itself. You will not be required to end or submit your examination.",
    "The Question Palette displayed on the right side of screen will show the status of each question using one of the following symbols:",
  ],
  legend: [
    {
      icon: <Button1 size={42} number={1} />,
      text: "You have not visited the question yet.",
    },
    {
      icon: <Button2 size={42} number={2} />,
      text: "You have not answered the question.",
    },
    {
      icon: <Button3 size={42} number={3} />,
      text: "You have answered the question.",
    },
    {
      icon: <Button4 size={42} number={4} />,
      text: "You have NOT answered the question, but have marked the question for review.",
    },
    {
      icon: <Button5 size={42} number={5} />,
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
    "Note: You can shuffle between sections and questions anytime during the examination as per your convenience.",
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
