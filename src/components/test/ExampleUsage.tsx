import React from 'react';
import { TestSubmissionPage } from '@/pages/new/TestSubmissionPage';

/**
 * Example usage of the Test Submission System
 * 
 * This file demonstrates how to integrate the test submission system
 * into your application. The TestSubmissionPage component handles
 * the entire test lifecycle automatically.
 */

// Example 1: Basic usage with default configuration
export const BasicTestExample: React.FC = () => {
  return (
    <div className="min-h-screen">
      <TestSubmissionPage />
    </div>
  );
};

// Example 2: Usage with custom styling
export const CustomStyledTestExample: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TestSubmissionPage className="custom-test-styles" />
    </div>
  );
};

// Example 3: Integration with routing (React Router)
export const TestRouteExample: React.FC = () => {
  // This would typically be in your router configuration
  // import { Routes, Route } from 'react-router-dom';
  
  return (
    <div>
      {/* 
      <Routes>
        <Route path="/test" element={<TestSubmissionPage />} />
        <Route path="/test/:sessionId" element={<TestSubmissionPage />} />
      </Routes>
      */}
    </div>
  );
};

// Example 4: Programmatic navigation to test
export const NavigateToTestExample: React.FC = () => {
  const navigateToTest = () => {
    // Example of navigating to test with test configuration
    const testConfig = {
      topics: ['mathematics', 'science'],
      level: 'medium',
      language: 'en'
    };
    
    // This would be used with React Router's navigate function
    // navigate('/test', { state: { testConfig } });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Test Navigation Example</h2>
      <button
        onClick={navigateToTest}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Start Test
      </button>
    </div>
  );
};

/**
 * Configuration Options
 * 
 * The TestSubmissionPage component accepts the following props:
 * 
 * @param className - Optional CSS class for custom styling
 * 
 * The component automatically:
 * - Fetches test questions from the API
 * - Manages test state and timer
 * - Handles answer tracking and auto-save
 * - Provides comprehensive error handling
 * - Displays results and analysis
 * 
 * Test Configuration (passed via location.state):
 * {
 *   topics: string[],      // Array of topic names
 *   level: string,         // 'easy', 'medium', 'hard'
 *   language: string       // 'en', 'hn', etc.
 * }
 */

export default TestSubmissionPage;
