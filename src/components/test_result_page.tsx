 import React, { useState } from 'react';
import { X, FileText } from 'lucide-react';

// --- Reusable Helper Components ---

// Helper component for individual statistic rows
const StatRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-4 border-b border-gray-700 last:border-b-0">
    <p className="text-gray-400 text-sm md:text-base">{label}</p>
    <p className="text-white font-semibold text-sm md:text-base">{value}</p>
  </div>
);

// --- Modular Modal Components ---

// Header for the results modal
const ResultModalHeader = ({ onClose }) => (
  <div className="flex justify-between items-center p-5 border-b border-gray-700">
    <h2 className="text-xl md:text-2xl font-bold flex items-center">
      <FileText className="mr-3 text-blue-400" size={24} />
      Test Result
    </h2>
    <button
      onClick={onClose}
      className="text-gray-400 hover:text-white transition-colors rounded-full p-1"
      aria-label="Close"
    >
      <X size={24} />
    </button>
  </div>
);

// Body/Content for the results modal
const ResultModalBody = ({ results }) => {
  const {
    attemptedQuestions,
    correctQuestions,
    totalQuestions,
    positiveMarks,
    negativeMarks,
    totalMarks,
    timeTaken,
    rank,
    totalStudents,
  } = results;

  return (
    <div className="p-6">
      <StatRow label="Attempted Questions" value={attemptedQuestions} />
      <StatRow label="Correct Questions" value={correctQuestions} />
      <StatRow label="Attempted / Total" value={`${attemptedQuestions} / ${totalQuestions}`} />
      
      {/* Marks Scored Section */}
      <div className="flex justify-between items-start py-4 border-b border-gray-700">
        <p className="text-gray-400 text-sm md:text-base">Marks Scored</p>
        <div className="text-right">
          <p className="text-green-400 font-semibold text-sm md:text-base">Positive: {positiveMarks}</p>
          <p className="text-red-400 font-semibold text-sm md:text-base">Negative: {negativeMarks}</p>
          <p className="text-white font-bold text-base md:text-lg mt-1">Total: {totalMarks}</p>
        </div>
      </div>

      <StatRow label="Time Taken" value={timeTaken} />
      <StatRow label="Rank" value={`${rank} / ${totalStudents}`} />
    </div>
  );
};

// Footer for the results modal
const ResultModalFooter = ({ onClose }) => (
  <div className="flex flex-col sm:flex-row gap-3 p-5 bg-gray-800/50 rounded-b-2xl">
    <button
      onClick={onClose}
      className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
    >
      Close
    </button>
    <button
      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      View Detailed Analysis
    </button>
  </div>
);


// --- Main Component: FinalSubmitPage (Modal) ---
// This component now composes the smaller modular parts.
const FinalSubmitPage = ({ results, onClose }) => {
  if (!results) {
    return null; // Don't render if there are no results
  }

  return (
    <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm fixed inset-0 z-50 flex justify-center items-center p-4">
      <div className="bg-[#1e2124] text-white rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all duration-300 scale-100 animate-fadeIn">
        <ResultModalHeader onClose={onClose} />
        <ResultModalBody results={results} />
        <ResultModalFooter onClose={onClose} />
      </div>
      
      {/* This style block is for the fadeIn animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};


// --- Main App Component ---
// This component renders the page and controls the modal's state.
export default function App() {
  // Demo data based on the screenshot. This can be fetched from an API.
  const testResultData = {
    attemptedQuestions: 18,
    correctQuestions: 15,
    totalQuestions: 20,
    positiveMarks: 15,
    negativeMarks: -3,
    totalMarks: 12,
    timeTaken: "08:35",
    rank: 5,
    totalStudents: 150,
  };

  // State to control the visibility of the results modal
  const [showResults, setShowResults] = useState(true);

  const handleClose = () => {
    setShowResults(false);
    console.log("Closing results.");
  };
  
  const handleShowResults = () => {
      setShowResults(true);
  }

  return (
    <div className="bg-gray-900 w-full min-h-screen flex flex-col justify-center items-center font-sans p-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Your Test is Complete!</h1>
        <button 
            onClick={handleShowResults}
            className="bg-green-500 hover:bg-green-400 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-300 shadow-lg"
        >
            Show My Results
        </button>
      
        {showResults && <FinalSubmitPage results={testResultData} onClose={handleClose} />}
    </div>
  );
}
