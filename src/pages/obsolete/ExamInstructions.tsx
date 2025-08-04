import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/ExamInstructions.css';

const ExamInstructions: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const testId = searchParams.get('testId');

  const handleNext = () => {
    console.log(testId);    
    navigate(`/exam-instructions-second?testId=${testId}`);
  };

  const handlePrevious = () => {
    navigate('/test-series');
  };

  return (
    <main className="main-content-area instructions-page">
      <div className="instructions-container">
        <div className="instructions-left">
          <h1>Exam Instructions</h1>

          <section className="instruction-section">
            <h2>General Instructions</h2>
            <ol>
              <li>The clock has been set at the server and the countdown timer at the top right corner of the screen will display the remaining time available for you to complete the examination. When the timer reaches zero, the examination will end by itself. You will not be required to end or submit your examination.</li>
              <li>The Question Palette displayed on the right side of screen will show the status of each question using one of the following symbols:
                <ul className="legend">
                  <li><span className="legend-box grey"></span> You have not visited the question yet.</li>
                  <li><span className="legend-box red"></span> You have not answered the question.</li>
                  <li><span className="legend-box green"></span> You have answered the question.</li>
                  <li><span className="legend-box purple"></span> You have not answered the question, but have marked the question for review.</li>
                  <li><span className="legend-box purple"><span className="check-mark">✔</span></span> You have answered the question, but marked it for review.</li>
                </ul>
                The Marked for Review status for a question simply indicates that you would like to look at that question again. If a question is answered and Marked for Review, your answer for that question will be considered in the evaluation.
              </li>
            </ol>
          </section>

          <section className="instruction-section">
            <h2>Navigating to a Question</h2>
            <ol>
              <li>To answer a question, do the following:
                <ol type="a">
                  <li>Click on the question number in the Question Palette at the right of your screen to go to that numbered question directly. Note that using this option does NOT save your answer to the current question.</li>
                  <li>Click on <strong>Save & Next</strong> to save your answer for the current question and then go to the next question.</li>
                  <li>Click on <strong>Mark for Review & Next</strong> to save your answer for the current question, mark it for review, and then go to the next question.</li>
                </ol>
              </li>
              <li><strong>Caution:</strong> Note that your answer for the current question will not be saved if you navigate to another question directly (without saving) by clicking on its question number.</li>
              <li><strong className="warning-text">You can view all the questions by clicking on the Question Paper button. This feature is provided, so that you can view all the questions in the paper at a glance.</strong></li>
            </ol>
          </section>

          <section className="instruction-section">
            <h2>Answering a Question</h2>
            <p>Procedure for answering a multiple choice type question:</p>
            <ol>
              <li>To select your answer, click on the button of one of the options.</li>
              <li>To deselect your chosen answer, click on the button of the chosen option again or click on the <strong>Clear Response</strong> button.</li>
              <li>To change your chosen answer, click on the button of another option.</li>
              <li>To save your answer, you MUST click on the <strong>Save & Next</strong> button.</li>
              <li>To mark the question for review, click on the <strong>Mark for Review & Next</strong> button. If an answer is selected for a question that is Marked for Review, that answer will be considered in the evaluation.</li>
            </ol>
          </section>
        </div>

        <div className="instructions-right">
          <div className="user-profile">
            <img src="/student.svg" alt="User Avatar" className="profile-avatar" />
            <span className="profile-name">Student Name</span>
          </div>
          <div className="palette-placeholder">
            {/* Question Palette would normally go here during the test */}
          </div>
        </div>
      </div>

      <footer className="instructions-footer">
        <button onClick={handlePrevious} className="btn btn-secondary">Previous</button>
        <button onClick={handleNext} className="btn btn-primary-soft">Next</button>
      </footer>
    </main>
  );
};

export default ExamInstructions; 