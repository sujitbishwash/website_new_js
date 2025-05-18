import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import ExamGoalPage from './components/ExamGoalPage';
import './App.css'; // Keep App.css for any App-specific global styles if needed

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/exam-goal" element={<ExamGoalPage />} />
        <Route path="/exam-goal.html" element={<Navigate to="/exam-goal" replace />} />
        <Route path="/dashboard" element={<div>Dashboard Page (Coming Soon)</div>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
