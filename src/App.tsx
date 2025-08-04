import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Chat from "./components/Chat";
import Flashcards from "./components/Flashcards";
import Sidebar from "./components/Sidebar";

// Import new pages from pages/new
import DetailedAnalysisPage from "./pages/new/DetailedAnalysisPage";
import ExamInformationPage from "./pages/new/ExamInformationPage";
import ExamReconfirmationPage from "./pages/new/ExamReconfirmationPage";
import HistoryPage from "./pages/new/HistoryPage";
import LoginPage from "./pages/new/LoginPage";
import MainDashboardPage from "./pages/new/MainDashboardPage";
import ReferralPage from "./pages/new/ReferralPage";
import SubscriptionPage from "./pages/new/SubscriptionPage";
import TestConfigurationPage from "./pages/new/TestConfigurationPage";
import TestMainPage from "./pages/new/TestMainPage";

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-900 text-white">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            {/* Main Dashboard */}
            <Route path="/" element={<MainDashboardPage />} />
            <Route path="/dashbaord" element={<MainDashboardPage />} />

            {/* User Pages */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/refer-and-earn" element={<ReferralPage />} />
            <Route path="/premium" element={<SubscriptionPage />} />

            {/* Test Related Pages */}
            <Route path="/test-series" element={<TestConfigurationPage />} />
            <Route path="/test-main-page" element={<TestMainPage />} />
            <Route path="/analysis" element={<DetailedAnalysisPage />} />
            <Route path="/exam-info" element={<ExamInformationPage />} />
            <Route
              path="/exam-reconfirm"
              element={<ExamReconfirmationPage />}
            />

            {/* Legacy Components (keeping for backward compatibility) */}
            <Route path="/chat" element={<Chat />} />
            <Route path="/flashcards" element={<Flashcards />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
