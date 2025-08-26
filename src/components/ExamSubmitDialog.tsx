import { X } from "lucide-react";
import React from "react";

// --- Type Definitions ---
interface SummaryStats {
  total: number;
  answered: number;
  notAnswered: number;
  markedForReview: number;
  notVisited: number;
}

interface SummarySection {
  name: string;
  stats: SummaryStats;
}

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

interface ModalHeaderProps {
  onClose: () => void;
}

interface SummaryTableProps {
  summaryData: SummarySection[];
}

interface SummaryCardProps {
  section: SummarySection;
}

interface ActionButtonsProps {
  onClose: () => void;
  onSubmit: () => void;
}

interface ExamSubmitDialogProps {
  summaryData: SummarySection[];
  onClose: () => void;
  onSubmit: () => void;
}

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
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

// --- Modular UI Components ---

/**
 * A reusable Modal component for the main container and backdrop.
 */
const Modal = ({ children, onClose }: ModalProps) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 "
    onClick={onClose}
  >
    <div
        className="relative w-full max-w-2xl bg-card text-primary rounded-2xl shadow-2xl border border-border flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
      
      {children}
    </div>
  </div>
);

/**
 * The header section of the modal.
 */
const ModalHeader = ({ onClose }: ModalHeaderProps) => (
  <>
    <button
      onClick={onClose}
      className="absolute top-4 right-4 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      aria-label="Close"
    >
      <CloseIcon />
    </button>
    <h2 className="mb-6 text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
      Submit your test
    </h2>
  </>
);

/**
 * The table view for desktop screens.
 */
const SummaryTable = ({ summaryData }: SummaryTableProps) => (
  <div className="overflow-hidden rounded-lg border border-border-high">
    <table className="min-w-full text-sm">
      <thead className="bg-primary">
        <tr className="text-white">
          <th className="border-r border-border px-4 py-3 text-left font-semibold">
            Section
          </th>
          <th className="border-r border-border px-4 py-3 text-center font-semibold">
            No. of questions
          </th>
          <th className="border-r border-border px-4 py-3 text-center font-semibold">
            Answered
          </th>
          <th className="border-r border-border px-4 py-3 text-center font-semibold">
            Not Answered
          </th>
          <th className="border-r border-border px-4 py-3 text-center font-semibold">
            Marked for Review
          </th>
          <th className="px-4 py-3 text-center font-semibold">Not Visited</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border-high text-2xl">
        {summaryData.map((section: SummarySection) => (
          <tr key={section.name} className="transition-colors">
            <td className="whitespace-nowrap border-r text-sm border-border-high px-4 py-4 font-medium text-foreground">
              {section.name}
            </td>
            <td className="whitespace-nowrap border-r border-border-high px-4 py-4 text-center text-foreground">
              {section.stats.total}
            </td>
            <td className="whitespace-nowrap border-r border-border-high px-4 py-4 text-center font-semibold text-green-600">
              {section.stats.answered}
            </td>
            <td className="whitespace-nowrap border-r border-border-high px-4 py-4 text-center font-semibold text-red-600">
              {section.stats.notAnswered}
            </td>
            <td className="whitespace-nowrap border-r border-border-high px-4 py-4 text-center font-semibold text-blue-600">
              {section.stats.markedForReview}
            </td>
            <td className="whitespace-nowrap px-4 py-4 text-center text-muted-foreground">
              {section.stats.notVisited}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/**
 * The card-based view for mobile screens.
 */
const SummaryCard = ({ section }: SummaryCardProps) => (
  <div className="rounded-lg border border-border-high bg-white p-4">
    <h3 className="mb-3 text-lg font-bold text-primary">{section.name}</h3>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">No. of questions:</span>
        <span className="font-medium text-gray-800">{section.stats.total}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Answered:</span>
        <span className="font-semibold text-green-600">
          {section.stats.answered}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Not Answered:</span>
        <span className="font-semibold text-red-600">
          {section.stats.notAnswered}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Marked for Review:</span>
        <span className="font-semibold text-blue-600">
          {section.stats.markedForReview}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Not Visited:</span>
        <span className="font-medium text-gray-800">
          {section.stats.notVisited}
        </span>
      </div>
    </div>
  </div>
);

/**
 * The action buttons at the bottom of the modal.
 */
const ActionButtons = ({ onClose, onSubmit }: ActionButtonsProps) => (
  <>
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <button
        onClick={onClose}
        className="w-full transform rounded-lg bg-border-high px-6 py-2.5 font-semibold text-muted-foreground hover:text-foreground transition-all duration-200 ease-in-out hover:bg-border focus:outline-none sm:w-auto"
      >
        Close
      </button>
      <button
        onClick={onSubmit}
        className="w-full transform rounded-lg bg-primary px-6 py-2.5 font-semibold text-white shadow-md transition-all duration-200 ease-in-out hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto"
      >
        Submit
      </button>
    </div>
  </>
);

// --- Main Exam Submit Dialog Component ---

const ExamSubmitDialog = ({
  summaryData,
  onClose,
  onSubmit,
}: ExamSubmitDialogProps) => {
  return (
    <Modal onClose={onClose}>
      {/* Modal Header */}
      <div className="p-5 border-b border-border flex justify-between items-center">
        <h3 className="text-xl font-semibold text-foreground">
          Submit your test
        </h3>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 text-foreground rounded-full hover:bg-foreground/10 hover:text-foreground transition-colors z-10 cursor-pointer"
        >
          <X />
        </button>
      </div>

      {/* Responsive Content: Table for desktop, Cards for mobile */}
      
        <div className="p-6 space-y-6 overflow-y-auto">
      <div className="hidden sm:block mb-4">
        <SummaryTable summaryData={summaryData} />
      </div>
      <div className="block space-y-4 sm:hidden">
        {summaryData.map((section: SummarySection) => (
          <SummaryCard key={section.name} section={section} />
        ))}
      </div>
      </div>

      {/* Modal Footer */}
      <div className="flex justify-end items-center gap-4 p-5 border-t border-border bg-card rounded-b-2xl">
        <button
          onClick={onClose}
          className="cursor-pointer px-5 py-2 text-sm font-semibold text-muted-foreground bg-foreground/10 rounded-lg hover:bg-foreground/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="cursor-pointer px-5 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1d1d1f] transition-all disabled:bg-blue-600/50 disabled:cursor-not-allowed flex items-center"
        >Submit</button>
      </div>
    </Modal>
  );
};

export default ExamSubmitDialog;
