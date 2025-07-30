import React, { useState } from 'react';

// --- Helper Components ---

// Icon for the close button
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// --- Modular UI Components ---

/**
 * A reusable Modal component for the main container and backdrop.
 */
const Modal = ({ children, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm"
    onClick={onClose}
  >
    <div
      className="relative w-full max-w-3xl transform rounded-2xl bg-white p-6 text-left align-middle shadow-2xl transition-all sm:p-8"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  </div>
);

/**
 * The header section of the modal.
 */
const ModalHeader = ({ onClose }) => (
  <>
    <button
      onClick={onClose}
      className="absolute top-4 right-4 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      aria-label="Close"
    >
      <CloseIcon />
    </button>
    <h2 className="mb-6 text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
      Submit your test
    </h2>
  </>
);

/**
 * The table view for desktop screens.
 */
const SummaryTable = ({ summaryData }) => (
  <div className="overflow-hidden rounded-lg border border-gray-200">
    <table className="min-w-full text-sm">
      <thead className="bg-indigo-600">
        <tr className="text-white">
          <th className="border-r border-indigo-500 px-4 py-3 text-left font-semibold">Section</th>
          <th className="border-r border-indigo-500 px-4 py-3 text-center font-semibold">No. of questions</th>
          <th className="border-r border-indigo-500 px-4 py-3 text-center font-semibold">Answered</th>
          <th className="border-r border-indigo-500 px-4 py-3 text-center font-semibold">Not Answered</th>
          <th className="border-r border-indigo-500 px-4 py-3 text-center font-semibold">Marked for Review</th>
          <th className="px-4 py-3 text-center font-semibold">Not Visited</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {summaryData.map((section) => (
          <tr key={section.name} className="transition-colors hover:bg-gray-50/50">
            <td className="whitespace-nowrap border-r border-gray-200 px-4 py-4 font-medium text-gray-900">{section.name}</td>
            <td className="whitespace-nowrap border-r border-gray-200 px-4 py-4 text-center text-gray-700">{section.stats.total}</td>
            <td className="whitespace-nowrap border-r border-gray-200 px-4 py-4 text-center font-semibold text-green-600">{section.stats.answered}</td>
            <td className="whitespace-nowrap border-r border-gray-200 px-4 py-4 text-center font-semibold text-red-600">{section.stats.notAnswered}</td>
            <td className="whitespace-nowrap border-r border-gray-200 px-4 py-4 text-center font-semibold text-blue-600">{section.stats.markedForReview}</td>
            <td className="whitespace-nowrap px-4 py-4 text-center text-gray-700">{section.stats.notVisited}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/**
 * The card-based view for mobile screens.
 */
const SummaryCard = ({ section }) => (
  <div className="rounded-lg border border-gray-200 bg-white p-4">
    <h3 className="mb-3 text-lg font-bold text-indigo-700">{section.name}</h3>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">No. of questions:</span>
        <span className="font-medium text-gray-800">{section.stats.total}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Answered:</span>
        <span className="font-semibold text-green-600">{section.stats.answered}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Not Answered:</span>
        <span className="font-semibold text-red-600">{section.stats.notAnswered}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Marked for Review:</span>
        <span className="font-semibold text-blue-600">{section.stats.markedForReview}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Not Visited:</span>
        <span className="font-medium text-gray-800">{section.stats.notVisited}</span>
      </div>
    </div>
  </div>
);

/**
 * The action buttons at the bottom of the modal.
 */
const ActionButtons = ({ onClose, onSubmit }) => (
  <>
    <div className="my-6 h-px bg-gray-200" />
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <button
        onClick={onClose}
        className="w-full transform rounded-lg bg-gray-200 px-6 py-2.5 font-semibold text-gray-800 transition-all duration-200 ease-in-out hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 sm:w-auto"
      >
        Close
      </button>
      <button
        onClick={onSubmit}
        className="w-full transform rounded-lg bg-indigo-600 px-6 py-2.5 font-semibold text-white shadow-md transition-all duration-200 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
      >
        Submit
      </button>
    </div>
  </>
);


// --- Main Exam Submit Component ---

const ExamSubmitComponent = ({ summaryData, onClose, onSubmit }) => {
  return (
    <Modal onClose={onClose}>
      <ModalHeader onClose={onClose} />

      {/* Responsive Content: Table for desktop, Cards for mobile */}
      <div className="hidden sm:block">
        <SummaryTable summaryData={summaryData} />
      </div>
      <div className="block space-y-4 sm:hidden">
        {summaryData.map((section) => (
          <SummaryCard key={section.name} section={section} />
        ))}
      </div>

      <ActionButtons onClose={onClose} onSubmit={onSubmit} />
    </Modal>
  );
};


// --- Main App Component (to demonstrate the modal) ---

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const examData = [
    { name: 'Quiz', stats: { total: 5, answered: 0, notAnswered: 1, markedForReview: 0, notVisited: 4 } },
    { name: 'Aptitude', stats: { total: 20, answered: 15, notAnswered: 2, markedForReview: 1, notVisited: 2 } },
    { name: 'Technical', stats: { total: 15, answered: 10, notAnswered: 1, markedForReview: 3, notVisited: 1 } },
  ];

  const handleCloseModal = () => setIsModalOpen(false);
  const handleSubmit = () => {
    console.log("Submit button clicked. Submitting test...");
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 font-sans">
      <button
        onClick={() => setIsModalOpen(true)}
        className="transform rounded-lg bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Show Submit Dialog
      </button>

      {isModalOpen && (
        <ExamSubmitComponent
          summaryData={examData}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
