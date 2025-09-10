import React, { useState, useEffect, useCallback } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Loader2, 
  Send,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  quizApi, 
  SubmitTestResponse, 
  SubmittedAnswer
} from '@/lib/api-client';
import { TimerMetadata } from './TestTimer';
import { AnswerState } from './AnswerInput';
import { TestTimer } from './TestTimer';

interface TestSubmissionFormProps {
  sessionId: number;
  questions: Array<{
    id: number;
    question: string;
    options: string[];
    type: 'MCQ' | 'FillInTheBlank' | 'MatchTheFollowing' | 'Subjective';
    marks: number;
    negativeMarks?: number;
  }>;
  answers: AnswerState[];
  onSubmissionComplete: (results: SubmitTestResponse) => void;
  onSubmissionError: (error: string) => void;
  testDuration?: number; // in seconds
  autoSave?: boolean;
  className?: string;
}

interface ValidationError {
  field: string;
  message: string;
}

export const TestSubmissionForm: React.FC<TestSubmissionFormProps> = ({
  sessionId,
  questions,
  answers,
  onSubmissionComplete,
  onSubmissionError,
  testDuration,
  autoSave = true,
  className = '',
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutoSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [timerMetadata, setTimerMetadata] = useState<TimerMetadata | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave) return;

    const autoSaveInterval = setInterval(() => {
      if (answers.length > 0 && !isSubmitting) {
        saveAnswersLocally();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [answers, autoSave, isSubmitting]);

  // Save answers to localStorage
  const saveAnswersLocally = useCallback(() => {
    try {
      const saveData = {
        sessionId,
        answers,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(`test_answers_${sessionId}`, JSON.stringify(saveData));
      setLastSaved(new Date());
    } catch (error) {
    }
  }, [sessionId, answers]);

  // Load saved answers from localStorage (for future use)
  // const loadSavedAnswers = useCallback(() => {
  //   try {
  //     const savedData = localStorage.getItem(`test_answers_${sessionId}`);
  //     if (savedData) {
  //       const parsed = JSON.parse(savedData);
  //       console.log('📂 Loaded saved answers from localStorage');
  //       return parsed.answers;
  //     }
  //   } catch (error) {
  //     console.error('Failed to load saved answers:', error);
  //   }
  //   return null;
  // }, [sessionId]);

  // Validate form before submission
  const validateForm = useCallback((): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!sessionId) {
      errors.push({ field: 'sessionId', message: 'Session ID is required' });
    }

    if (!answers || answers.length === 0) {
      errors.push({ field: 'answers', message: 'No answers provided' });
    }

    const answeredQuestions = answers.filter(answer => answer.is_answered);
    if (answeredQuestions.length === 0) {
      errors.push({ 
        field: 'answers', 
        message: 'At least one question must be answered before submission' 
      });
    }

    return errors;
  }, [sessionId, answers]);

  // Convert answers to submission format
  const prepareSubmissionData = useCallback((): SubmittedAnswer[] => {
    return answers.map((answer, index) => ({
      question_id: answer.question_id,
      selected_option: answer.selected_option,
      answer_order: index + 1, // API requires this field
      time_taken: answer.time_taken || 0, // Time taken in seconds
    }));
  }, [answers]);

  // Handle form submission
  const handleSubmit = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setValidationErrors([]);

    try {
      const submissionAnswers = prepareSubmissionData();

      const results = await quizApi.submitTestEnhanced(
        sessionId,
        submissionAnswers,
        timerMetadata ? {
          total_time: timerMetadata.total_time,
          start_time: timerMetadata.start_time,
          end_time: timerMetadata.end_time,
        } : undefined
      );

      // Clear saved answers after successful submission
      localStorage.removeItem(`test_answers_${sessionId}`);

      onSubmissionComplete(results);
    } catch (error: any) {
      console.error('❌ Test submission failed:', error);
      const errorMessage = error.message || 'Failed to submit test. Please try again.';
      onSubmissionError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle timer updates
  const handleTimerUpdate = useCallback((_timeElapsed: number, metadata: TimerMetadata) => {
    setTimerMetadata(metadata);
  }, []);

  // Handle timer expiration
  const handleTimerExpired = useCallback((_metadata: TimerMetadata) => {
    handleSubmit();
  }, []);

  // Get submission summary
  const getSubmissionSummary = () => {
    const answered = answers.filter(a => a.is_answered).length;
    const markedForReview = answers.filter(a => a.is_marked_for_review).length;
    const total = questions.length;

    return {
      total,
      answered,
      unanswered: total - answered,
      markedForReview,
      percentage: total > 0 ? Math.round((answered / total) * 100) : 0,
    };
  };

  const summary = getSubmissionSummary();

  return (
    <div className={`bg-card rounded-lg border border-border ${className}`}>
      {/* Header */}
      <div className="p-4 border-b bg-background-subtle">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Test Submission</h3>
            <p className="text-sm text-muted-foreground">
              Session ID: #{sessionId}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {testDuration && (
              <TestTimer
                duration={testDuration}
                onTimeUpdate={handleTimerUpdate}
                onTimeExpired={handleTimerExpired}
                showControls={false}
                className="text-sm"
              />
            )}
            
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm transition-colors"
            >
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showPreview ? 'Hide' : 'Preview'}
            </button>
          </div>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h4 className="text-red-800 font-medium">Please fix the following errors:</h4>
          </div>
          <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>{error.message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Preview Section */}
      {showPreview && (
        <div className="p-4 border-b bg-blue-50">
          <h4 className="font-medium text-blue-900 mb-3">Submission Preview</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{summary.total}</div>
              <div className="text-blue-800">Total Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{summary.answered}</div>
              <div className="text-green-800">Answered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{summary.unanswered}</div>
              <div className="text-gray-800">Unanswered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{summary.markedForReview}</div>
              <div className="text-yellow-800">Marked for Review</div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-foreground">
                <strong>{summary.answered}</strong> answered
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-muted-foreground">
                <strong>{summary.unanswered}</strong> unanswered
              </span>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {summary.percentage}% completed
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${summary.percentage}%` }}
          />
        </div>

        {/* Auto-save Status */}
        {autoSave && lastSaved && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <Save className="h-3 w-3" />
            <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t bg-background-subtle">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {summary.answered > 0 ? (
              <span className="text-green-600">
                Ready to submit ({summary.answered} answers)
              </span>
            ) : (
              <span className="text-red-600">
                Please answer at least one question
              </span>
            )}
          </div>
          
          <div className="flex gap-3">
            {autoSave && (
              <button
                onClick={saveAnswersLocally}
                disabled={isAutoSaving}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {isAutoSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Progress
              </button>
            )}
            
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || summary.answered === 0}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Test
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSubmissionForm;
