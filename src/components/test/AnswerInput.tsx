import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Clock, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { TestTimer, TimerMetadata } from './TestTimer';

export interface Question {
  id: number;
  question: string;
  options: string[];
  type: 'MCQ' | 'FillInTheBlank' | 'MatchTheFollowing' | 'Subjective';
  marks: number;
  negativeMarks?: number;
}

export interface AnswerState {
  question_id: number;
  selected_option?: string | null;
  answer_order: number; // API requires this field
  time_taken?: number; // Time taken in seconds
  is_answered: boolean;
  is_marked_for_review: boolean;
  question_start_time?: Date; // Track when user first visited this question
}

interface AnswerInputProps {
  questions: Question[];
  currentQuestionIndex: number;
  answers: AnswerState[];
  onAnswerChange: (questionIndex: number, answer: AnswerState) => void;
  onQuestionChange: (index: number) => void;
  onMarkForReview: (questionIndex: number) => void;
  onClearAnswer: (questionIndex: number) => void;
  showTimer?: boolean;
  questionTimer?: boolean;
  className?: string;
}

export const AnswerInput: React.FC<AnswerInputProps> = ({
  questions,
  currentQuestionIndex,
  answers,
  onAnswerChange,
  onQuestionChange,
  onMarkForReview,
  onClearAnswer,
  showTimer = true,
  questionTimer = true,
  className = '',
}) => {
  const [questionStartTime, setQuestionStartTime] = useState<Date>(new Date());
  const [questionTimeElapsed, setQuestionTimeElapsed] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];

  // Track time spent on current question
  useEffect(() => {
    const now = new Date();
    setQuestionStartTime(now);
    setQuestionTimeElapsed(0);
    
    // Set question start time if not already set
    if (!currentAnswer.question_start_time) {
      const updatedAnswer = {
        ...currentAnswer,
        question_start_time: now,
      };
      onAnswerChange(currentQuestionIndex, updatedAnswer);
    }
  }, [currentQuestionIndex, currentAnswer, onAnswerChange]);

  useEffect(() => {
    if (!questionTimer) return;

    const interval = setInterval(() => {
      setQuestionTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [questionTimer]);

  // Update answer time when moving to next question
  const handleQuestionChange = useCallback((newIndex: number) => {
    if (newIndex !== currentQuestionIndex) {
      // Calculate time spent on current question
      const now = new Date();
      const timeSpent = currentAnswer.question_start_time 
        ? Math.floor((now.getTime() - currentAnswer.question_start_time.getTime()) / 1000)
        : questionTimeElapsed;
      
      // Save time spent on current question
      const updatedAnswer = {
        ...currentAnswer,
        time_taken: (currentAnswer.time_taken || 0) + timeSpent,
      };
      onAnswerChange(currentQuestionIndex, updatedAnswer);
    }
    onQuestionChange(newIndex);
  }, [currentQuestionIndex, currentAnswer, questionTimeElapsed, onAnswerChange, onQuestionChange]);

  const handleOptionSelect = (optionIndex: number) => {
    const selectedOption = currentQuestion.options[optionIndex];
    const now = new Date();
    const updatedAnswer: AnswerState = {
      ...currentAnswer,
      question_id: currentQuestion.id,
      selected_option: selectedOption,
      answer_order: currentQuestionIndex + 1, // API requires this field
      is_answered: true,
      time_taken: questionTimeElapsed,
      question_start_time: currentAnswer.question_start_time || now,
    };
    onAnswerChange(currentQuestionIndex, updatedAnswer);
  };

  const handleMarkForReview = () => {
    const updatedAnswer: AnswerState = {
      ...currentAnswer,
      is_marked_for_review: !currentAnswer.is_marked_for_review,
    };
    onAnswerChange(currentQuestionIndex, updatedAnswer);
    onMarkForReview(currentQuestionIndex);
  };

  const handleClearAnswer = () => {
    const updatedAnswer: AnswerState = {
      ...currentAnswer,
      selected_option: null,
      is_answered: false,
    };
    onAnswerChange(currentQuestionIndex, updatedAnswer);
    onClearAnswer(currentQuestionIndex);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getAnswerStatus = (questionIndex: number) => {
    const answer = answers[questionIndex];
    if (!answer) return 'not-visited';
    if (answer.is_marked_for_review && answer.is_answered) return 'marked-answered';
    if (answer.is_marked_for_review) return 'marked';
    if (answer.is_answered) return 'answered';
    return 'not-answered';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'answered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'marked':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'marked-answered':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'not-answered':
        return <Circle className="h-4 w-4 text-gray-400" />;
      default:
        return <Circle className="h-4 w-4 text-gray-300" />;
    }
  };

  if (!currentQuestion) {
    return (
      <div className={`p-6 text-center ${className}`}>
        <p className="text-muted-foreground">No question available</p>
      </div>
    );
  }

  return (
    <div className={`bg-card rounded-lg border ${className}`}>
      {/* Question Header */}
      <div className="p-4 border-b bg-background-subtle">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h3>
            {getStatusIcon(getAnswerStatus(currentQuestionIndex))}
          </div>
          
          {questionTimer && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Time: {formatTime(questionTimeElapsed)}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-foreground">
              <strong>Marks:</strong> +{currentQuestion.marks}
            </span>
            {currentQuestion.negativeMarks && (
              <span className="text-red-500">
                <strong>Negative:</strong> -{currentQuestion.negativeMarks}
              </span>
            )}
            <span className="text-muted-foreground">
              <strong>Type:</strong> {currentQuestion.type}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkForReview}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                currentAnswer.is_marked_for_review
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              {currentAnswer.is_marked_for_review ? 'Marked' : 'Mark for Review'}
            </button>
            
            <button
              onClick={handleClearAnswer}
              disabled={!currentAnswer.is_answered}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                currentAnswer.is_answered
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed'
              }`}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="p-6">
        <div className="mb-6">
          <p className="text-foreground text-lg leading-relaxed">
            {currentQuestion.question}
          </p>
        </div>

        {/* Answer Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const optionLabel = String.fromCharCode(65 + index); // A, B, C, D
            const isSelected = currentAnswer.selected_option === option;
            
            return (
              <label
                key={index}
                className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200 border ${
                  isSelected
                    ? 'bg-blue-100 border-blue-500 text-blue-900'
                    : 'bg-background-subtle hover:bg-blue-50 hover:border-blue-300 text-foreground'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  className="sr-only"
                  checked={isSelected}
                  onChange={() => handleOptionSelect(index)}
                />
                <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-400'
                }`}>
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span className="font-medium mr-3">{optionLabel}.</span>
                <span className="flex-1">{option}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="p-4 border-t bg-background-subtle">
        <div className="flex justify-between items-center">
          <button
            onClick={() => handleQuestionChange(currentQuestionIndex - 1)}
            disabled={currentQuestionIndex === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              currentQuestionIndex === 0
                ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {currentQuestionIndex + 1} / {questions.length}
            </span>
          </div>

          <button
            onClick={() => handleQuestionChange(currentQuestionIndex + 1)}
            disabled={currentQuestionIndex === questions.length - 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              currentQuestionIndex === questions.length - 1
                ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnswerInput;
