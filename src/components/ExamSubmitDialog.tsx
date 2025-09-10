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

interface SummaryTableProps {
  summaryData: SummarySection[];
}

interface ExamSubmitDialogProps {
  summaryData: SummarySection[];
  onClose: () => void;
  onSubmit: () => void;
}

// --- Helper Components ---

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
 * The table view for desktop screens.
 */
const SummaryTable = ({ summaryData }: SummaryTableProps) => (
  <div className="overflow-hidden rounded-lg border border-border-high">
    <table className="min-w-full text-sm hidden sm:block">
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
    <table className="min-w-full text-sm sm:hidden">
      <thead className="bg-primary">
        <tr className="text-white">
          <th className="border-r border-border px-4 py-3 text-left font-semibold">
            Metric
          </th>
          {summaryData.map((section: SummarySection) => (
            <th
              key={section.name}
              className="border-r border-border px-4 py-3 text-center font-semibold"
            >
              {section.name}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="divide-y divide-border-high text-2xl">
        <tr>
          <td className="whitespace-nowrap border-r text-sm border-border-high px-4 py-2 font-medium text-foreground">
            Total Questions
          </td>
          {summaryData.map((section) => (
            <td
              key={section.name}
              className="whitespace-nowrap border-r border-border-high p-2 text-center text-foreground"
            >
              {section.stats.total}
            </td>
          ))}
        </tr>

        <tr>
          <td className="whitespace-nowrap border-r text-sm border-border-high px-4 py-2 font-medium text-foreground">
            Answered
          </td>
          {summaryData.map((section) => (
            <td
              key={section.name}
              className="whitespace-nowrap border-r border-border-high p-2 text-center font-semibold text-green-600"
            >
              {section.stats.answered}
            </td>
          ))}
        </tr>

        <tr>
          <td className="whitespace-nowrap border-r text-sm border-border-high px-4 py-2 font-medium text-foreground">
            Not Answered
          </td>
          {summaryData.map((section) => (
            <td
              key={section.name}
              className="whitespace-nowrap border-r border-border-high p-2 text-center font-semibold text-red-600"
            >
              {section.stats.notAnswered}
            </td>
          ))}
        </tr>

        <tr>
          <td className="whitespace-nowrap border-r text-sm border-border-high px-4 py-2 font-medium text-foreground">
            Marked for Review
          </td>
          {summaryData.map((section) => (
            <td
              key={section.name}
              className="whitespace-nowrap border-r border-border-high p-2 text-center font-semibold text-blue-600"
            >
              {section.stats.markedForReview}
            </td>
          ))}
        </tr>

        <tr>
          <td className="whitespace-nowrap border-r text-sm border-border-high px-4 py-2 font-medium text-foreground">
            Not Visited
          </td>
          {summaryData.map((section) => (
            <td
              key={section.name}
              className="whitespace-nowrap border-r border-border-high p-2 text-center text-muted-foreground"
            >
              {section.stats.notVisited}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  </div>
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

      <div className="mx-4 sm:m-6 space-y-6 overflow-y-auto">
          <SummaryTable summaryData={summaryData} />
      </div>

      {/* Modal Footer */}
      <div className="flex justify-end items-center gap-4 p-5 border-t border-border bg-card rounded-b-2xl">
        <button
          onClick={onClose}
          className="w-full sm:w-auto cursor-pointer px-5 py-2 text-sm font-semibold text-muted-foreground bg-foreground/10 rounded-lg hover:bg-foreground/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="w-full sm:w-auto cursor-pointer px-5 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1d1d1f] transition-all disabled:bg-blue-600/50 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </div>
    </Modal>
  );
};

export default ExamSubmitDialog;
