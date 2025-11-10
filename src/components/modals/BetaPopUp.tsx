import React, { useState } from 'react';
import { X } from 'lucide-react';

// Define the color palette for consistent usage
const theme = {
  background: "#161320",
  backgroundSubtle: "#1C1926",
  cardBackground: "#1E192B",
  inputBackground: "#2A243A",
  primaryText: "#EDEBFA",
  secondaryText: "#C8C5E2",
  mutedText: "#A09DB9",
  accent: "#857AA3",
  accentLight: "rgba(133, 122, 163, 0.07)",
  buttonGradientFrom: "#A49AC4",
  buttonGradientTo: "#8C82AE",
  divider: "#3B3550",
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BetaModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 px-4 transition-all">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      {/* Modal Dialog */}
      <div 
        className="relative z-10 w-full max-w-[400px] overflow-hidden rounded-[32px] shadow-2xl transition-all transform scale-100 opacity-100"
        style={{ backgroundColor: theme.cardBackground }}
        role="dialog"
        aria-modal="true"
      >
        {/* Gradient Header */}
        <div 
          className="h-40 w-full flex items-center justify-center relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.buttonGradientFrom} 50%, ${theme.buttonGradientTo} 100%)`
          }}
        >
          {/* Subtle overlay texture/noise for depth (optional, kept simple here) */}
          <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-white/10" />
          
          <h2 
            className="text-3xl font-bold tracking-tight relative z-10 drop-shadow-sm"
            style={{ color: theme.primaryText }}
          >
            Important Notice
          </h2>

          {/* Close button positioned absolutely */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/10 hover:bg-black/20 transition-colors text-white/80 hover:text-white"
          >
             <X size={20} />
          </button>
        </div>

        {/* Body Content */}
        <div className="px-8 py-8 text-center flex flex-col items-center">
          <p 
            className="text-[17px] leading-relaxed font-medium mb-8"
            style={{ color: theme.secondaryText }}
          >
            Since we’re in the beta phase, please use YouTube videos related to <span className='text-xl'>English topics</span> for <span className='text-xl'>Banking exams</span> only.
          </p>

          {/* Action Buttons */}
          <div className="flex w-full gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-full text-sm font-semibold transition-colors duration-200 ease-in-out flex-1 max-w-[140px] border-2 hover:bg-white/5"
              style={{ 
                color: theme.secondaryText,
                borderColor: theme.divider
              }}
            >
              Close
            </button>
            
            <button
              onClick={() => {
                // Perform acceptance action here
                onClose();
              }}
              className="px-6 py-3 rounded-full text-sm font-bold transition-transform duration-200 ease-out active:scale-95 hover:brightness-110 flex-1 max-w-[140px] shadow-lg"
              style={{
                 background: `linear-gradient(to right, ${theme.buttonGradientFrom}, ${theme.buttonGradientTo})`,
                 color: theme.background, // Using dark background color for text contrast on bright button
                 boxShadow: `0 4px 20px -5px ${theme.accent}80` // colored shadow
              }}
            >
              Understood
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component to demonstrate the modal
export default function BetaPopUp() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
      <BetaModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
  );
}