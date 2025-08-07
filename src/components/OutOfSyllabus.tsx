import React, { useEffect, useState } from "react";

// Centralized theme colors for easy customization
const theme = {
  background: "#111827",
  cardBackground: "#1F2937",
  primaryText: "#FFFFFF",
  secondaryText: "#9CA3AF",
  accent: "#60A5FA",
  divider: "#4B5563",
};

// CSS-in-JS using a template literal for styles
const GlobalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  body {
    /* Updated background for animation */
    background: linear-gradient(45deg, #111827, #1e293b, #111827);
    background-size: 400% 400%;
    color: ${theme.primaryText};
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    /* Apply the new background animation */
    animation: subtleGradient 15s ease infinite;
  }

  *, *::before, *::after {
    box-sizing: inherit;
  }

  /* New animation for the background */
  @keyframes subtleGradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  /* Animation for the message box to drop in */
  @keyframes dropIn {
    from {
      opacity: 0;
      transform: translateY(-100px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* Animation for the message box to fade out */
  @keyframes fadeOut {
    from {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    to {
      opacity: 0;
      transform: translateY(-100px) scale(0.9);
    }
  }
  
  /* New animation for the icon */
  @keyframes iconWobble {
    0% { transform: scale(1) rotate(0deg); }
    25% { transform: scale(1.1) rotate(-5deg); }
    50% { transform: scale(1.1) rotate(5deg); }
    75% { transform: scale(1.1) rotate(-2deg); }
    100% { transform: scale(1) rotate(0deg); }
  }
`;

// --- Icon Component ---
const LightbulbIcon: React.FC = () => (
  <div
    style={{ animation: "iconWobble 1s ease-out 0.5s", marginBottom: "1rem" }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke={theme.accent}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 0-5.657 11.343A5 5 0 0 1 12 22a5 5 0 0 1 5.657-8.657A7 7 0 0 0 12 2z" />
    </svg>
  </div>
);

// --- Main App Component ---

interface OutOfSyllabusProps {
  onGoBack: () => void;
}

const OutOfSyllabus: React.FC<OutOfSyllabusProps> = ({ onGoBack }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  // Effect to inject global styles into the document's head
  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = GlobalStyles;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  // Function to handle closing the message box
  const handleClose = () => {
    setIsClosing(true);
    // Wait for the animation to finish before removing the element
    setTimeout(() => {
      setIsVisible(false);
      onGoBack(); // Call the onGoBack function after animation
    }, 500); // This duration should match the fadeOut animation time
  };

  // Style for the main container to center the content
  const appContainerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "1rem",
  };

  // Style for the message box
  const messageBoxStyle: React.CSSProperties = {
    background: theme.cardBackground,
    padding: "2rem",
    borderRadius: "1rem",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
    width: "90%",
    maxWidth: "500px",
    textAlign: "center",
    position: "relative", // Needed for positioning the close button
    // Apply animation based on state
    animation: isClosing
      ? "fadeOut 0.5s ease-in forwards"
      : "dropIn 0.6s ease-out forwards",
  };

  const modalTextStyle: React.CSSProperties = {
    color: theme.secondaryText,
    fontSize: "1.1rem",
    lineHeight: 1.6,
    padding: "0 1rem",
    marginTop: "0.5rem",
  };

  const closeButtonStyle: React.CSSProperties = {
    position: "absolute",
    top: "0.75rem",
    right: "0.75rem",
    background: "transparent",
    border: "none",
    color: theme.secondaryText,
    fontSize: "1.75rem",
    cursor: "pointer",
    lineHeight: 1,
  };

  if (!isVisible) {
    return null; // Don't render anything if the box is closed
  }

  return (
    <div style={appContainerStyle}>
      <div style={messageBoxStyle}>
        <button
          style={closeButtonStyle}
          onClick={handleClose}
          aria-label="Close"
        >
          &times;
        </button>
        <LightbulbIcon />
        <h3 style={{ color: theme.accent, marginTop: 0, fontSize: "1.25rem" }}>
          A Quick Note
        </h3>
        <p style={modalTextStyle}>Please add a video relevant to the topic.</p>
      </div>
    </div>
  );
};

export default OutOfSyllabus;
