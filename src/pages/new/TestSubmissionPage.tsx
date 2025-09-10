import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Home, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  BookOpen
} from 'lucide-react';
import { 
  quizApi, 
  SubmitTestResponse 
} from '@/lib/api-client';
import { ROUTES } from '@/routes/constants';
import { useUser } from '@/contexts/UserContext';

// Import our custom components
import { AnswerInput, AnswerState, Question } from '@/components/test/AnswerInput';
import { TestSubmissionForm } from '@/components/test/TestSubmissionForm';
import { TestResults } from '@/components/test/TestResults';
import { TestTimer, TimerMetadata } from '@/components/test/TestTimer';

interface TestSubmissionPageProps {
  className?: string;
}

type PageState = 'loading' | 'test' | 'submitting' | 'results' | 'error';

export const TestSubmissionPage: React.FC<TestSubmissionPageProps> = ({
  className = '',
}) => {
  // Navigation and location
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useUser();

  // Page state
  const [pageState, setPageState] = useState<PageState>('loading');
  const [error, setError] = useState<string | null>(null);

  // Test data
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<AnswerState[]>([]);
  const [testResults, setTestResults] = useState<SubmitTestResponse | null>(null);

  // Timer state
  // const testStartTime = new Date();
  const [testDuration] = useState(3600); // 1 hour default
  const [timerMetadata, setTimerMetadata] = useState<TimerMetadata | null>(null);

  // UI state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  // Get test config from location state or URL params
  const testConfig = location.state?.testConfig || {
    topics: ['general-knowledge'],
    level: 'medium',
    language: 'en'
  };

  // Initialize test data
  useEffect(() => {
    initializeTest();
  }, []);

  const initializeTest = async () => {
    try {
      setPageState('loading');
      setError(null);

      

      // Start test session
      const response = await quizApi.startTest({
        subject: 'general-knowledge',
        topics: testConfig.topics || ['general-knowledge'],
        level: testConfig.level || 'medium',
        language: testConfig.language || 'en'
      });

      if (!response || !(response as any).questions) {
        throw new Error('Invalid response from server');
      }

      // Convert API questions to our format
      const convertedQuestions: Question[] = (response as any).questions.map((q: any) => ({
        id: q.questionId,
        question: q.content,
        options: q.option,
        type: q.questionType as 'MCQ' | 'FillInTheBlank' | 'MatchTheFollowing' | 'Subjective',
        marks: 1,
        negativeMarks: 0.25,
      }));

      // Initialize answers array
      const initialAnswers: AnswerState[] = convertedQuestions.map((q, index) => ({
        question_id: q.id,
        selected_option: null,
        answer_order: index + 1,
        time_taken: 0,
        is_answered: false,
        is_marked_for_review: false,
      }));

      setSessionId((response as any).session_id);
      setQuestions(convertedQuestions);
      setAnswers(initialAnswers);
      // setTestStartTime(new Date());
      setPageState('test');

    } catch (error: any) {
      
      setError(error.message || 'Failed to load test. Please try again.');
      setPageState('error');
    }
  };

  // Handle answer changes
  const handleAnswerChange = useCallback((questionIndex: number, answer: AnswerState) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = answer;
      return newAnswers;
    });
  }, []);

  // Handle question navigation
  const handleQuestionChange = useCallback((newIndex: number) => {
    if (newIndex >= 0 && newIndex < questions.length) {
      setCurrentQuestionIndex(newIndex);
    }
  }, [questions.length]);

  // Handle mark for review
  const handleMarkForReview = useCallback((questionIndex: number) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = {
        ...newAnswers[questionIndex],
        is_marked_for_review: !newAnswers[questionIndex].is_marked_for_review,
      };
      return newAnswers;
    });
  }, []);

  // Handle clear answer
  const handleClearAnswer = useCallback((questionIndex: number) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = {
        ...newAnswers[questionIndex],
        selected_option: null,
        is_answered: false,
      };
      return newAnswers;
    });
  }, []);

  // Handle timer updates
  const handleTimerUpdate = useCallback((_timeElapsed: number, metadata: TimerMetadata) => {
    setTimerMetadata(metadata);
  }, []);

  // Handle timer expiration
  const handleTimerExpired = useCallback((_metadata: TimerMetadata) => {
    
    setShowSubmissionForm(true);
  }, []);

  // Handle test submission
  const handleSubmissionComplete = useCallback((results: SubmitTestResponse) => {
    
    setTestResults(results);
    setPageState('results');
  }, []);

  // Handle submission error
  const handleSubmissionError = useCallback((error: string) => {
    
    setError(error);
    setPageState('error');
  }, []);

  // Handle retake test
  const handleRetakeTest = useCallback(() => {
    setPageState('loading');
    setTestResults(null);
    setError(null);
    setCurrentQuestionIndex(0);
    setShowSubmissionForm(false);
    initializeTest();
  }, []);

  // Handle go to dashboard
  const handleGoToDashboard = useCallback(() => {
    navigate(ROUTES.HOME);
  }, [navigate]);

  // Handle view analysis
  const handleViewAnalysis = useCallback(() => {
    navigate(ROUTES.ANALYSIS, { 
      state: { 
        testResults,
        sessionId,
        questions,
        answers 
      } 
    });
  }, [navigate, testResults, sessionId, questions, answers]);

  // Calculate test statistics
  const getTestStats = () => {
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

  const stats = getTestStats();

  // Render loading state
  if (pageState === 'loading') {
    return (
      <div className={`min-h-screen bg-background flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Loading Test...</h2>
          <p className="text-muted-foreground">Please wait while we prepare your test</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (pageState === 'error') {
    return (
      <div className={`min-h-screen bg-background flex items-center justify-center ${className}`}>
        <div className="max-w-md mx-auto text-center p-6">
          <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Test Loading Failed</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRetakeTest}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
            <button
              onClick={handleGoToDashboard}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              <Home className="h-4 w-4" />
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render results state
  if (pageState === 'results' && testResults) {
    const timeTaken = timerMetadata 
      ? `${Math.floor(timerMetadata.total_time / 60)}:${(timerMetadata.total_time % 60).toString().padStart(2, '0')}`
      : undefined;

    return (
      <div className={`min-h-screen bg-background ${className}`}>
        <div className="container mx-auto px-4 py-8">
          <TestResults
            results={testResults}
            totalQuestions={questions.length}
            timeTaken={timeTaken}
            onRetake={handleRetakeTest}
            onViewAnalysis={handleViewAnalysis}
            onGoHome={handleGoToDashboard}
          />
        </div>
      </div>
    );
  }

  // Render main test interface
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                Back
              </button>
              <div>
                <h1 className="text-xl font-bold text-foreground">Test Session</h1>
                <p className="text-sm text-muted-foreground">
                  Session #{sessionId} • {questions.length} Questions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Test Timer */}
              <TestTimer
                duration={testDuration}
                onTimeUpdate={handleTimerUpdate}
                onTimeExpired={handleTimerExpired}
                showControls={true}
                warningThreshold={300} // 5 minutes warning
              />

              {/* Test Stats */}
              <div className="hidden md:flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-foreground">{stats.answered} answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-muted-foreground">{stats.unanswered} remaining</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={() => setShowSubmissionForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
                Submit Test
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Panel */}
          <div className="lg:col-span-3">
            <AnswerInput
              questions={questions}
              currentQuestionIndex={currentQuestionIndex}
              answers={answers}
              onAnswerChange={handleAnswerChange}
              onQuestionChange={handleQuestionChange}
              onMarkForReview={handleMarkForReview}
              onClearAnswer={handleClearAnswer}
              questionTimer={true}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* User Info */}
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{profile?.name || 'Student'}</p>
                  <p className="text-sm text-muted-foreground">Test Taker</p>
                </div>
              </div>
            </div>

            {/* Progress Summary */}
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Progress
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Completed</span>
                  <span className="text-sm font-medium text-foreground">
                    {stats.answered}/{stats.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stats.percentage}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  {stats.percentage}% Complete
                </div>
              </div>
            </div>

            {/* Question Navigation */}
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="font-semibold text-foreground mb-3">Questions</h3>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((_, index) => {
                  const answer = answers[index];
                  const isCurrent = index === currentQuestionIndex;
                  const isAnswered = answer?.is_answered;
                  const isMarked = answer?.is_marked_for_review;

                  return (
                    <button
                      key={index}
                      onClick={() => handleQuestionChange(index)}
                      className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                        isCurrent
                          ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                          : isAnswered && isMarked
                          ? 'bg-blue-500 text-white'
                          : isAnswered
                          ? 'bg-green-500 text-white'
                          : isMarked
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Submission Form Modal */}
      {showSubmissionForm && sessionId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <TestSubmissionForm
              sessionId={sessionId}
              questions={questions}
              answers={answers}
              onSubmissionComplete={handleSubmissionComplete}
              onSubmissionError={handleSubmissionError}
              testDuration={testDuration}
              autoSave={true}
            />
            <div className="p-4 border-t bg-background-subtle">
              <button
                onClick={() => setShowSubmissionForm(false)}
                className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Continue Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestSubmissionPage;
