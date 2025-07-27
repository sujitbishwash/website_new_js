import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Chat from "./components/Chat";
import Flashcards from "./components/Flashcards";
import Quizzes from "./components/Quizzes";
import History from "./components/History";

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-900 text-white">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/quizzes" element={<Quizzes />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
