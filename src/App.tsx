import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ExamGoalPage from './pages/ExamGoalPage';
import DashboardPage from './pages/DashboardPage';
import LinkInputPage from './pages/LinkInputPage';
import TestSeries from './pages/TestSeries';
import ExamInstructions from './pages/ExamInstructions';
import ExamInstructionsSecond from './pages/ExamInstructionsSecond';
import Quiz from './pages/Quiz';
import ComingSoon from './pages/ComingSoon';
import './App.css'; // Keep App.css for any App-specific global styles if needed

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/exam-goal" element={<ExamGoalPage />} />
        <Route path="/link-input" element={<LinkInputPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/test-series" element={<TestSeries />} />
        <Route path="/exam-instructions" element={<ExamInstructions />} />
        <Route path="/exam-instructions-second" element={<ExamInstructionsSecond />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="*" element={<ComingSoon />} />
      </Routes>
    </Router>
  );
};

export default App;
