# Test Submission System

A comprehensive React frontend for a test submission system with advanced features including timer management, answer tracking, auto-save functionality, and detailed result analysis.

## Components Overview

### 1. TestTimer Component
**Location**: `src/components/test/TestTimer.tsx`

A sophisticated timer component that tracks test duration with pause/resume functionality.

**Features**:
- Configurable duration with auto-expiration
- Pause/resume controls
- Time warning thresholds
- Real-time metadata updates
- Visual status indicators

**Props**:
```typescript
interface TestTimerProps {
  duration?: number; // Duration in seconds
  onTimeUpdate?: (timeElapsed: number, metadata: TimerMetadata) => void;
  onTimeExpired?: (metadata: TimerMetadata) => void;
  autoStart?: boolean;
  className?: string;
  showControls?: boolean;
  warningThreshold?: number; // Show warning when this many seconds remain
}
```

**Usage**:
```tsx
<TestTimer
  duration={3600} // 1 hour
  onTimeUpdate={handleTimerUpdate}
  onTimeExpired={handleTimerExpired}
  warningThreshold={300} // 5 minutes warning
/>
```

### 2. AnswerInput Component
**Location**: `src/components/test/AnswerInput.tsx`

A comprehensive question interface with answer tracking and navigation.

**Features**:
- Question navigation (previous/next)
- Answer selection with visual feedback
- Mark for review functionality
- Clear answer option
- Per-question timer
- Answer status tracking

**Props**:
```typescript
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
```

**Usage**:
```tsx
<AnswerInput
  questions={questions}
  currentQuestionIndex={currentIndex}
  answers={answers}
  onAnswerChange={handleAnswerChange}
  onQuestionChange={handleQuestionChange}
  onMarkForReview={handleMarkForReview}
  onClearAnswer={handleClearAnswer}
  showTimer={true}
  questionTimer={true}
/>
```

### 3. TestResults Component
**Location**: `src/components/test/TestResults.tsx`

A detailed results display component with performance analysis.

**Features**:
- Score breakdown with visual indicators
- Performance level assessment
- Progress bars for different metrics
- Action buttons for next steps
- Responsive design

**Props**:
```typescript
interface TestResultsProps {
  results: SubmitTestResponse;
  totalQuestions: number;
  timeTaken?: string;
  onRetake?: () => void;
  onViewAnalysis?: () => void;
  onGoHome?: () => void;
  className?: string;
}
```

**Usage**:
```tsx
<TestResults
  results={testResults}
  totalQuestions={questions.length}
  timeTaken="45:30"
  onRetake={handleRetake}
  onViewAnalysis={handleViewAnalysis}
  onGoHome={handleGoHome}
/>
```

### 4. TestSubmissionForm Component
**Location**: `src/components/test/TestSubmissionForm.tsx`

A comprehensive form component for test submission with validation and auto-save.

**Features**:
- Form validation with error display
- Auto-save functionality (every 30 seconds)
- Submission preview
- Loading states
- Error handling
- Progress tracking

**Props**:
```typescript
interface TestSubmissionFormProps {
  sessionId: number;
  questions: Question[];
  answers: AnswerState[];
  onSubmissionComplete: (results: SubmitTestResponse) => void;
  onSubmissionError: (error: string) => void;
  testDuration?: number;
  autoSave?: boolean;
  className?: string;
}
```

**Usage**:
```tsx
<TestSubmissionForm
  sessionId={sessionId}
  questions={questions}
  answers={answers}
  onSubmissionComplete={handleSubmissionComplete}
  onSubmissionError={handleSubmissionError}
  testDuration={3600}
  autoSave={true}
/>
```

### 5. TestSubmissionPage Component
**Location**: `src/pages/new/TestSubmissionPage.tsx`

The main page component that orchestrates the entire test experience.

**Features**:
- Complete test lifecycle management
- State management for all test components
- Error handling and loading states
- Responsive layout
- Integration with all sub-components

## API Integration

### Enhanced API Client
**Location**: `src/lib/api-client.ts`

The API client has been enhanced with comprehensive test submission functionality:

```typescript
// Enhanced interfaces
export interface SubmittedAnswer {
  question_id: number;
  selected_option?: string | null;
  answer_order: number; // Answer order in the test
  time_taken?: number;
}

export interface SubmitTestRequest {
  session_id: number;
  answers: SubmittedAnswer[];
  metadata?: {
    total_time?: number;
    start_time?: string;
    end_time?: string;
  };
}

export interface SubmitTestResponse {
  session_id: number;
  score: number;
  total: number;
  total_marks_scored: number;
  attempt: number;
  message: string;
}
```

### API Methods

```typescript
// Enhanced submit test with comprehensive metadata
quizApi.submitTestEnhanced(
  sessionId: number, 
  answers: SubmittedAnswer[], 
  metadata?: { total_time?: number; start_time?: string; end_time?: string }
): Promise<SubmitTestResponse>
```

## State Management

The system uses React hooks for state management:

### Answer State
```typescript
interface AnswerState {
  question_id: number;
  selected_option?: string | null;
  answer_order: number;
  time_taken?: number;
  is_answered: boolean;
  is_marked_for_review: boolean;
}
```

### Timer Metadata
```typescript
interface TimerMetadata {
  total_time: number;
  start_time: string;
  end_time?: string;
  is_paused: boolean;
  pause_duration: number;
}
```

## Features Implemented

### ✅ Core Features
- [x] Question navigation (previous/next)
- [x] Answer tracking with radio buttons
- [x] Timer integration (per-question and total test)
- [x] Auto-save functionality
- [x] Form validation
- [x] Error handling with user-friendly messages
- [x] Loading states with spinners
- [x] Responsive design

### ✅ Advanced Features
- [x] Mark for review functionality
- [x] Clear answer option
- [x] Answer status tracking (answered, not answered, marked, etc.)
- [x] Progress visualization
- [x] Auto-submission on timer expiration
- [x] Local storage for answer persistence
- [x] Comprehensive result analysis
- [x] Performance level assessment

### ✅ UI/UX Features
- [x] Clean, modern interface with Tailwind CSS
- [x] Proper spacing and typography
- [x] Hover effects and transitions
- [x] Accessibility compliance
- [x] Mobile-friendly responsive design
- [x] Visual feedback for all interactions

## Usage Example

```tsx
import TestSubmissionPage from '@/pages/new/TestSubmissionPage';

// In your router or main app
<Route path="/test" element={<TestSubmissionPage />} />
```

## Environment Configuration

Make sure to set the API base URL in your environment variables:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Authentication

The system automatically includes the Bearer token from localStorage in API requests. Make sure the user is authenticated before accessing the test submission page.

## Error Handling

The system includes comprehensive error handling:
- Network errors with retry mechanisms
- Validation errors with user-friendly messages
- Loading states for all async operations
- Fallback UI for error states

## Performance Optimizations

- Auto-save every 30 seconds to prevent data loss
- Efficient state management with useCallback
- Lazy loading of components
- Optimized re-renders with proper dependency arrays

## Browser Compatibility

The system is compatible with all modern browsers and includes:
- ES6+ features
- CSS Grid and Flexbox
- Local Storage API
- Fetch API with proper error handling

## Testing

The components are designed to be easily testable with:
- Clear prop interfaces
- Separated concerns
- Mockable dependencies
- Predictable state management
