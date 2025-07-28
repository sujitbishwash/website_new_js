import React from 'react';

const Quizzes: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-8">Quizzes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-2">Mathematics Quiz</h3>
          <p className="text-gray-400 mb-4">20 questions • 30 minutes</p>
          <div className="flex justify-between items-center">
            <span className="text-green-400">Completed</span>
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">
              Review
            </button>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-2">Physics Quiz</h3>
          <p className="text-gray-400 mb-4">15 questions • 25 minutes</p>
          <div className="flex justify-between items-center">
            <span className="text-yellow-400">In Progress</span>
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">
              Continue
            </button>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-2">Chemistry Quiz</h3>
          <p className="text-gray-400 mb-4">25 questions • 40 minutes</p>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Not Started</span>
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">
              Start
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quizzes;
