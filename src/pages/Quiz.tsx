import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { quizApi, SubmitTestRequest } from '../lib/api-client';
import '../styles/Quiz.css';

type QuestionStatus = 'not-visited' | 'answered' | 'not-answered' | 'marked' | 'marked-answered';
type QuestionType = 'MCQ' | 'LONG_ANSWER';

interface Question {
  id: number; // This will be the sequence (1, 2, 3, ...)
  questionId: number; // This will be the actual question ID from API
  text: string;
  options?: string[];
  type: QuestionType;
  status: QuestionStatus;
  selectedAnswer: string | number | null;
}

// MCQ Question Component
const MCQQuestion: React.FC<{
  question: Question;
  onAnswerSelect: (answer: number) => void;
}> = ({ question, onAnswerSelect }) => {
  return (
    <div className="options-container" id="options-container">
      {question.options?.map((option, i) => (
        <li key={i} className="option-item">
          <input
            type="radio"
            id={`q${question.id}_option${i}`}
            name={`question_${question.id}`}
            value={i}
            checked={question.selectedAnswer === i}
            onChange={(e) => onAnswerSelect(parseInt(e.target.value))}
          />
          <label htmlFor={`q${question.id}_option${i}`}>{option}</label>
        </li>
      ))}
    </div>
  );
};

// Long Answer Question Component
const LongAnswerQuestion: React.FC<{
  question: Question;
  onAnswerChange: (answer: string) => void;
}> = ({ question, onAnswerChange }) => {
  return (
    <div className="long-answer-container">
      <textarea
        className="long-answer-input"
        value={question.selectedAnswer as string || ''}
        onChange={(e) => onAnswerChange(e.target.value)}
        placeholder="Type your answer here..."
        rows={6}
      />
    </div>
  );
};

const initialTime = 10 * 60; // 10 minutes in seconds

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const testId = searchParams.get('testId');

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [questionData, setQuestionData] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  // Fetch questions from API
  const fetchQuestions = async () => {
    if (!testId) {
      setError('No test ID provided');
      setLoading(false);
      return;
    }
    console.log(testId);
    try {
      setLoading(true);
      const response = await quizApi.getQuestions(parseInt(testId));
      
      // Transform API response to our Question format
      const transformedQuestions: Question[] = response.questions.map((q, index) => ({
        id: index + 1, // Sequence number (1, 2, 3, ...)
        questionId: q.questionId, // Actual question ID from API
        text: q.content,
        options: q.questionType === 'MCQ' ? q.option : undefined,
        type: q.questionType === 'MCQ' ? 'MCQ' : 'LONG_ANSWER',
        status: 'not-visited',
        selectedAnswer: null,
      }));

      setQuestionData(transformedQuestions);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch questions');
      setLoading(false);
    }
  };

  // Timer functions
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    timerInterval.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          if (timerInterval.current) {
            clearInterval(timerInterval.current);
          }
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeUp = () => {
    alert('Time is up!');
    submitTest();
  };

  // Question loading and navigation
  const loadQuestion = (index: number) => {
    if (index < 0 || index >= questionData.length) return;
    setCurrentQuestionIndex(index);
  };

  const updateQuestionStatus = (index: number, newStatus: QuestionStatus, selectedAnswer: string | number | null = null) => {
    setQuestionData((prev) => {
      const newData = [...prev];
      newData[index] = {
        ...newData[index],
        status: newStatus,
        selectedAnswer,
      };
      return newData;
    });
  };

  const handleAnswerSelect = (answer: number | string) => {
    const currentQuestion = questionData[currentQuestionIndex];
    if (currentQuestion.status === 'not-answered' || currentQuestion.status === 'not-visited') {
      updateQuestionStatus(currentQuestionIndex, 'answered', answer);
    } else if (currentQuestion.status === 'marked') {
      updateQuestionStatus(currentQuestionIndex, 'marked-answered', answer);
    }
  };

  // Button handlers
  const handleSaveNext = () => {
    const currentQuestion = questionData[currentQuestionIndex];
    
    // Update status based on whether answer is selected
    if (currentQuestion.selectedAnswer === null && currentQuestion.status !== 'marked' && currentQuestion.status !== 'marked-answered') {
      if (currentQuestion.status === 'not-visited') {
        updateQuestionStatus(currentQuestionIndex, 'not-answered');
      }
    } else if (currentQuestion.selectedAnswer !== null) {
      if (currentQuestion.status === 'marked' || currentQuestion.status === 'marked-answered') {
        updateQuestionStatus(currentQuestionIndex, 'marked-answered', currentQuestion.selectedAnswer);
      } else {
        updateQuestionStatus(currentQuestionIndex, 'answered', currentQuestion.selectedAnswer);
      }
    }

    // Move to next question
    if (currentQuestionIndex < questionData.length - 1) {
      loadQuestion(currentQuestionIndex + 1);
    } else {
      alert("You are on the last question.");
    }
  };

  const handleMarkReview = () => {
    const currentQuestion = questionData[currentQuestionIndex];
    if (currentQuestion.selectedAnswer !== null) {
      updateQuestionStatus(currentQuestionIndex, 'marked-answered', currentQuestion.selectedAnswer);
    } else {
      updateQuestionStatus(currentQuestionIndex, 'marked');
    }

    if (currentQuestionIndex < questionData.length - 1) {
      loadQuestion(currentQuestionIndex + 1);
    } else {
      alert("You are on the last question.");
    }
  };

  const handleClearResponse = () => {
    const currentStatus = questionData[currentQuestionIndex].status;
    if (currentStatus === 'marked-answered') {
      updateQuestionStatus(currentQuestionIndex, 'marked', null);
    } else {
      updateQuestionStatus(currentQuestionIndex, 'not-answered', null);
    }
  };

  const handleSubmitTest = () => {
    if (confirm('Are you sure you want to submit the test?')) {
      submitTest();
    }
  };

  const submitTest = async () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
    
    try {
      // Format answers for API submission using questionId
      const formattedAnswers = questionData.map((q) => {
        if (q.type === 'MCQ') {
          // For MCQ, get the selected option text
          const selectedOptionIndex = q.selectedAnswer as number;
          const selectedOptionText = q.options && selectedOptionIndex !== null 
            ? q.options[selectedOptionIndex] 
            : null;
          
          return {
            question_id: q.questionId, // Use actual question ID from API
            selected_option: selectedOptionText,
            answer: null
          };
        } else {
          // For long answer, use the text answer
          return {
            question_id: q.questionId, // Use actual question ID from API
            selected_option: null,
            answer: q.selectedAnswer as string
          };
        }
      });

      const submitData: SubmitTestRequest = {
        session_id: parseInt(testId!),
        answers: formattedAnswers
      };

      console.log('Submitting test with data:', submitData);
      
      const response = await quizApi.submitTest(submitData);
      
      // Handle the new response format
      alert(`Test submitted successfully!\nScore: ${response.score}/${response.total}\nAttempt: ${response.attempt}`);
      navigate('/test-series');
    } catch (error: any) {
      console.error('Error submitting test:', error);
      alert(`Error submitting test: ${error.message}`);
    }
  };

  // Fullscreen handling
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        alert(`Could not enter full screen mode: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Initialize quiz
  useEffect(() => {
    fetchQuestions();
  }, [testId]);

  useEffect(() => {
    if (questionData.length > 0 && !loading) {
      loadQuestion(0);
      startTimer();
    }

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [questionData, loading]);

  if (loading) {
    return (
      <div className="quiz-layout">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div>Loading questions...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-layout">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem' }}>
          <div>Error: {error}</div>
          <button onClick={() => navigate('/test-series')} className="quiz-btn primary">
            Back to Test Series
          </button>
        </div>
      </div>
    );
  }

  if (questionData.length === 0) {
    return (
      <div className="quiz-layout">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div>No questions available.</div>
        </div>
      </div>
    );
  }

  const currentQuestion = questionData[currentQuestionIndex];

  return (
    <div className="quiz-layout">
      <header className="quiz-header">
        <div className="header-left">
          <h3>Test Series - Session {testId}</h3>
        </div>
        <div className="header-right">
          <div className="timer-container">
            <span className="timer-label">Time Left:</span>
            <span id="time">{formatTime(timeLeft)}</span>
          </div>
          <div className="language-select">
            <label htmlFor="lang-toggle" className="sr-only">Language</label>
            <select id="lang-toggle">
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
          <button onClick={toggleFullScreen} className="header-icon-btn" title="Switch Full Screen">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
              <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"/>
            </svg>
            <span className="btn-text">Full Screen</span>
          </button>
        </div>
      </header>

      <main className="quiz-main-content">
        <div className="question-area">
          <div className="question-header">
            <h4>Question No. <span id="question-number">{currentQuestion.id}</span></h4>
          </div>
          <div className="question-text" id="question-text">
            {currentQuestion.text}
          </div>
          {currentQuestion.type === 'MCQ' ? (
            <MCQQuestion
              question={currentQuestion}
              onAnswerSelect={handleAnswerSelect}
            />
          ) : (
            <LongAnswerQuestion
              question={currentQuestion}
              onAnswerChange={handleAnswerSelect}
            />
          )}
        </div>

        <aside className="question-navigation-panel">
          <div className="user-profile-summary">
            <img src="/student.svg" alt="User" className="profile-avatar-small"/>
            <span>Student Name</span>
          </div>
          <div className="legend-container">
            <h5>Legend</h5>
            <ul className="legend-list">
              <li><span className="legend-box answered"></span> Answered</li>
              <li><span className="legend-box not-answered"></span> Not Answered</li>
              <li><span className="legend-box marked"></span> Marked</li>
              <li><span className="legend-box not-visited"></span> Not Visited</li>
              <li><span className="legend-box marked-answered"><span className="check-mark">✔</span></span> Marked & Answered</li>
            </ul>
          </div>
          <div className="question-palette" id="question-palette">
            <h5>Question Palette</h5>
            <div className="palette-buttons">
              {questionData.map((q) => (
                <button
                  key={q.id}
                  className={`palette-button ${q.status} ${currentQuestionIndex === q.id - 1 ? 'active' : ''}`}
                  onClick={() => loadQuestion(q.id - 1)}
                  aria-label={`Go to question ${q.id}`}
                >
                  {q.id}
                  {q.status === 'marked-answered' && <span className="check-mark">✔</span>}
                </button>
              ))}
            </div>
          </div>
          <div className="panel-actions">
            <button className="quiz-btn tertiary panel-action-btn" onClick={() => alert('Question Paper functionality not implemented yet.')}>
              Question Paper
            </button>
            <button className="quiz-btn tertiary panel-action-btn" onClick={() => navigate(`/exam-instructions-second?testId=${testId}`)}>
              Instructions
            </button>
            <button className="quiz-btn danger panel-action-btn" onClick={handleSubmitTest}>
              Submit Test
            </button>
          </div>
        </aside>
      </main>

      <footer className="quiz-footer">
        <div className="footer-buttons-left">
          <button className="quiz-btn secondary" onClick={handleMarkReview}>
            Mark for Review & Next
          </button>
          <button className="quiz-btn secondary" onClick={handleClearResponse}>
            Clear Response
          </button>
        </div>
        <div className="footer-buttons-center">
          <button className="quiz-btn primary" onClick={handleSaveNext}>
            Save & Next
          </button>
        </div>
        <div className="footer-buttons-right">
          {/* Buttons moved to the right panel */}
        </div>
      </footer>
    </div>
  );
};

export default Quiz; 