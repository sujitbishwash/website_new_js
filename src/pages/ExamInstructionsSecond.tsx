import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/ExamInstructionsSecond.css';

const ExamInstructionsSecond: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const testId = searchParams.get('testId');

  const [isDeclarationChecked, setIsDeclarationChecked] = useState(false);

  const handlePrevious = () => {
    navigate(`/exam-instructions?testId=${testId}`);
  };

  const handleStartQuiz = () => {
    if (isDeclarationChecked) {
      navigate(`/quiz?testId=${testId}`);
    }
  };

  return (
    <div className="page-wrapper">
      <header className="top-header">
        <div className="header-content">
          <div className="header-left">
            <img src={ "../../public/favicon.svg"} alt="Logo" className="header-logo" />
            <span className="header-title">CISF Constable (Fireman): General Awareness - प्रकर्ष - Quiz</span>
          </div>
          <div className="header-right">
            Maximum Marks: 5
          </div>
        </div>
      </header>

      <main className="main-content-area">
        <div className="instructions-content">
          <h1 className="instruction-main-title">CISF Constable (Fireman): General Awareness - प्रकर्ष - Quiz</h1>
          <p className="instruction-subtitle"><strong>Duration: 5 Mins</strong></p>
          <p className="instruction-read"><strong>Read the following instructions carefully.</strong></p>

          <section className="instructions-list-section">
            <ol>
              <li>The Quiz contain 5 questions.</li>
              <li>Each question has 4 options out of which only one is correct.</li>
              <li>You have to finish the quiz in 5 minutes.</li>
              <li>You will be awarded 1 marks for each correct answer and There is No negative marking.</li>
              <li>There is no penalty for the questions that you have not attempted.</li>
              <li>Once you start the quiz, you will not be allowed to reattempt it. Make sure that you complete the quiz before you submit the quiz and/or close the browser.</li>
            </ol>
          </section>

          <div className="warning-message">
            Please note all questions will appear in your default language. This language can be changed for a particular question later on
          </div>

          <section className="declaration-section">
            <label className="declaration-label">
              <input
                type="checkbox"
                checked={isDeclarationChecked}
                onChange={(e) => setIsDeclarationChecked(e.target.checked)}
              />
              I have read all the instructions carefully and have understood them. I agree not to cheat or use unfair means in this examination. I understand that using unfair means of any sort for my own or someone else's advantage will lead to my immediate disqualification. The decision of Testbook.com will be final in these matters and cannot be appealed.
            </label>
          </section>

          <footer className="instructions-footer">
            <button onClick={handlePrevious} className="btn btn-secondary">Previous</button>
            <button
              onClick={handleStartQuiz}
              className="btn btn-primary-soft"
              disabled={!isDeclarationChecked}
            >
              I am ready to begin
            </button>
          </footer>
        </div>

        <aside className="student-sidebar">
          <div className="student-profile">
            <img src={'../../public/student.svg'} alt="User Avatar" className="student-avatar" />
            <span className="student-name">Student Name</span>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default ExamInstructionsSecond; 