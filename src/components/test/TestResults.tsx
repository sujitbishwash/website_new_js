import React from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Trophy, 
  Target, 
  TrendingUp,
  Award,
  Users,
  Calendar,
  FileText
} from 'lucide-react';
import { SubmitTestResponse } from '@/lib/api-client';

interface TestResultsProps {
  results: SubmitTestResponse;
  totalQuestions: number;
  timeTaken?: string;
  onRetake?: () => void;
  onViewAnalysis?: () => void;
  onGoHome?: () => void;
  className?: string;
}

export const TestResults: React.FC<TestResultsProps> = ({
  results,
  totalQuestions,
  timeTaken,
  onRetake,
  onViewAnalysis,
  onGoHome,
  className = '',
}) => {
  const {
    session_id,
    score,
    total,
    total_marks_scored,
    attempt,
    message
  } = results;

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const incorrectAnswers = total - score;
  const unansweredQuestions = totalQuestions - total;

  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90) return { level: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (percentage >= 80) return { level: 'Very Good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (percentage >= 70) return { level: 'Good', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    if (percentage >= 60) return { level: 'Average', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    return { level: 'Needs Improvement', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const performance = getPerformanceLevel(percentage);

  const StatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string | number;
    subtitle?: string;
    color?: string;
  }> = ({ icon, title, value, subtitle, color = 'text-blue-600' }) => (
    <div className="bg-card p-4 rounded-lg border border-border">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <div className={color}>
            {icon}
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`max-w-4xl mx-auto p-6 ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className={`p-4 rounded-full ${performance.bgColor}`}>
            <Trophy className={`h-12 w-12 ${performance.color}`} />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Test Completed!</h1>
        <p className={`text-lg font-medium ${performance.color}`}>
          {performance.level} Performance
        </p>
        {message && (
          <p className="text-muted-foreground mt-2">{message}</p>
        )}
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<CheckCircle className="h-6 w-6" />}
          title="Correct Answers"
          value={score}
          subtitle={`out of ${total} attempted`}
          color="text-green-600"
        />
        
        <StatCard
          icon={<XCircle className="h-6 w-6" />}
          title="Incorrect Answers"
          value={incorrectAnswers}
          subtitle="negative marking applied"
          color="text-red-600"
        />
        
        <StatCard
          icon={<Target className="h-6 w-6" />}
          title="Total Marks"
          value={total_marks_scored.toFixed(2)}
          subtitle="with negative marking"
          color="text-blue-600"
        />
        
        <StatCard
          icon={<TrendingUp className="h-6 w-6" />}
          title="Percentage"
          value={`${percentage}%`}
          subtitle={performance.level}
          color={performance.color}
        />
      </div>

      {/* Detailed Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Test Summary */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Test Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Session ID:</span>
              <span className="font-medium text-foreground">#{session_id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Questions:</span>
              <span className="font-medium text-foreground">{totalQuestions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Attempted:</span>
              <span className="font-medium text-foreground">{total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Unanswered:</span>
              <span className="font-medium text-foreground">{unansweredQuestions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Attempt Number:</span>
              <span className="font-medium text-foreground">{attempt}</span>
            </div>
            {timeTaken && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Time Taken:</span>
                <span className="font-medium text-foreground">{timeTaken}</span>
              </div>
            )}
          </div>
        </div>

        {/* Performance Breakdown */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Award className="h-5 w-5" />
            Performance Breakdown
          </h3>
          <div className="space-y-4">
            {/* Correct Answers Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Correct Answers</span>
                <span className="text-sm font-medium text-green-600">{score}/{total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${total > 0 ? (score / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Incorrect Answers Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Incorrect Answers</span>
                <span className="text-sm font-medium text-red-600">{incorrectAnswers}/{total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${total > 0 ? (incorrectAnswers / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Overall Performance */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Overall Performance</span>
                <span className="text-sm font-medium text-blue-600">{percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    percentage >= 80 ? 'bg-green-500' : 
                    percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {onViewAnalysis && (
          <button
            onClick={onViewAnalysis}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <TrendingUp className="h-5 w-5" />
            View Detailed Analysis
          </button>
        )}
        
        {onRetake && (
          <button
            onClick={onRetake}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            <Target className="h-5 w-5" />
            Retake Test
          </button>
        )}
        
        {onGoHome && (
          <button
            onClick={onGoHome}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
          >
            <Users className="h-5 w-5" />
            Go to Dashboard
          </button>
        )}
      </div>

      {/* Additional Info */}
      <div className="mt-8 p-4 bg-background-subtle rounded-lg border border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Test completed on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default TestResults;
