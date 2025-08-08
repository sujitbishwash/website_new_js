import React, { useState} from 'react';

// Centralized theme colors for easy customization, as requested.
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


interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

interface ModalHeaderProps {
  onClose: () => void;
}


interface ActionButtonsProps {
  onClose: () => void;
  onConfirm: () => void;
}

interface LogoutDialogProps {
  onClose: () => void;
  onConfirm: () => void;
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
    className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30 p-4 backdrop-blur-sm"
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
const ModalHeader = ({ onClose }: ModalHeaderProps) => (
  <>
    <button
      onClick={onClose}
      className="absolute top-4 right-4 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      aria-label="Close"
    >
      <CloseIcon />
    </button>
    <h2 className="mb-6 text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
      Are you sure you want to log out?
    </h2>
  </>
);


/**
 * The action buttons at the bottom of the modal.
 */
const ActionButtons = ({ onClose, onConfirm }: ActionButtonsProps) => (
  <>
    <div className="my-6 h-px bg-gray-200" />
    <div className="flex flex-col space-y-3">
          <button
            onClick={onConfirm}
            className="w-full px-4 py-3 font-semibold rounded-lg transition-opacity hover:opacity-90"
            style={{ color: theme.cardBackground, backgroundColor: theme.primaryText }}
          >
            Log out
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 py-3 font-semibold bg-transparent rounded-lg transition-colors"
            style={{
              color: theme.primaryText,
              backgroundColor: theme.inputBackground 
            }}
          >
            Cancel
          </button>
        </div>
  </>
);

// --- Main Exam Submit Dialog Component ---

const LogoutDialog = ({
  onClose,
  onConfirm,
}: LogoutDialogProps) => {
    const [isCancelHovered, setCancelHovered] = useState(false);
  return (
    <Modal onClose={onClose}>
      <ModalHeader onClose={onClose} />


      <ActionButtons onClose={onClose} onConfirm={onConfirm} />
    </Modal>
  );
};

export default LogoutDialog;
