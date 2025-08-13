import React from "react";
import { useUser } from "../contexts/UserContext";

// --- Component Starts Here ---

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userEmail?: string;
}

/**
 * A responsive, dark-themed logout confirmation modal.
 * The main fix was to replace dynamic theme variables in classNames
 * with static hex codes, which is required for Tailwind's JIT compiler to work.
 * For example, `bg-[${theme.cardBackground}]` was changed to `bg-[#1F2937]`.
 */
const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userEmail,
}) => {
  const { profile } = useUser();
  const displayEmail = userEmail || profile?.email || "user@example.com";
  // If the modal is not open, render nothing.
  if (!isOpen) return null;

  // This function handles clicks on the backdrop.
  // It checks if the click was on the backdrop itself (e.target)
  // and not on a child element (like the modal content).
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* This style tag adds a simple fade-in animation for the modal */}
      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
      `}</style>

      {/* Backdrop: Added onClick to close the modal when the user clicks outside the content area. */}
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-sm animate-fade-in p-4"
        onClick={handleBackdropClick}
      >
        {/* Modal content container. */}
        <div className="bg-card text-card-foreground rounded-2xl shadow-xl w-full max-w-sm p-8 text-center border border-border">
          <h2 className="text-2xl font-bold mb-2">
            Are you sure you want to log out?
          </h2>

          <p className="text-muted-foreground mb-6">
            Log out of AIPadhai as{" "}
            <span className="font-semibold text-foreground">{displayEmail}</span>?
          </p>

          {/* Action buttons container */}
          <div className="flex flex-col space-y-3">
            <button
              onClick={onConfirm}
              className="w-full px-4 py-3 font-semibold bg-primary text-primary-foreground rounded-lg transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              Log out
            </button>
            <button
              onClick={onClose}
              className="w-full px-4 py-3 font-semibold text-foreground bg-transparent rounded-lg transition-colors hover:bg-accent/20 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoutModal;
