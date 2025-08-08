import React from "react";

// Centralized theme colors for easy customization
const theme = {
  background: "#111827",
  cardBackground: "#1F2937",
  inputBackground: "#374151",
  primaryText: "#FFFFFF",
  secondaryText: "#9CA3AF",
  mutedText: "#6B7280",
  accent: "#60A5FA",
  divider: "#4B5563",
};

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userEmail?: string;
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userEmail = "sagentiriya33@gmail.com",
}) => {
  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
      `}</style>

      {/* Backdrop - positioned at the root level for proper full-screen coverage */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60 animate-fade-in">
        {/* Modal content */}
        <div
          className={`bg-[${theme.cardBackground}] rounded-2xl shadow-xl w-full max-w-sm p-8 text-center`}
        >
          <h2 className={`text-2xl font-bold text-[${theme.primaryText}] mb-2`}>
            Are you sure you want to log out?
          </h2>
          <p className={`text-[${theme.secondaryText}] mb-6`}>
            Log out of ChatGPT as{" "}
            <span className="font-semibold">{userEmail}</span>?
          </p>
          <div className="flex flex-col space-y-3">
            <button
              onClick={onConfirm}
              className={`w-full px-4 py-3 font-semibold text-[${theme.cardBackground}] bg-[${theme.primaryText}] rounded-lg transition-opacity hover:opacity-90`}
            >
              Log out
            </button>
            <button
              onClick={onClose}
              className={`w-full px-4 py-3 font-semibold text-[${theme.primaryText}] bg-transparent rounded-lg transition-colors hover:bg-[${theme.inputBackground}]`}
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
