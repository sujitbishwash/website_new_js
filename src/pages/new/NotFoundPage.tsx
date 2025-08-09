import { theme } from "@/styles/theme";
import React from "react";

// CSS keyframe animations are defined here for more dynamic movement.
const animationStyles = `
  @keyframes hover {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }

  @keyframes sway {
    0%, 100% { transform: rotate(-3deg); }
    50% { transform: rotate(3deg); }
  }

  @keyframes flicker {
    0%, 100% { opacity: 1; }
    25% { opacity: 0.3; }
    50% { opacity: 1; }
    75% { opacity: 0.5; }
  }
`;

/**
 * An animated SVG icon component representing a "cute but dead robot alien".
 * It uses CSS animations for a continuous, dynamic effect.
 */
const NotFoundIcon: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-24 w-24 mb-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke={theme.secondaryText}
      strokeWidth={1}
      style={{ animation: "hover 4s ease-in-out infinite" }}
    >
      <g
        style={{
          animation: "sway 3s ease-in-out infinite alternate",
          transformOrigin: "bottom center",
        }}
      >
        {/* Robot Head */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 14a6 6 0 01-6-6h12a6 6 0 01-6 6z"
        />
        {/* Dead Eyes (X's) */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 10.5l-2-2m2 0l-2 2"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 10.5l-2-2m2 0l-2 2"
        />
        {/* Sad Mouth */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 12.5h3" />
        {/* Bent Antenna */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8V6c0-1.104.896-2 2-2s2 .896 2 2v0c0 .552-.448 1-1 1h-2"
        />
        <circle
          cx="15"
          cy="4.5"
          r="0.5"
          fill={theme.secondaryText}
          style={{ animation: "flicker 1.5s linear infinite" }}
        />
      </g>
      {/* Robot Body */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 14h8v5H8v-5z" />
    </svg>
  );
};

/**
 * A reusable "Page Not Found" component.
 * It can be used in any React application that uses Tailwind CSS.
 * @param {object} props - The component props.
 * @param {string} [props.homePath='/'] - The path to redirect to when the button is clicked.
 * @returns {JSX.Element} The rendered 404 page.
 */
interface NotFoundPageProps {
  homePath?: string;
}

const ContentDesign: React.FC<NotFoundPageProps> = ({ homePath = "/" }) => {
  // Handler to navigate to the home page.
  // In a real app, you would use a router's navigation function here.
  const handleGoHome = () => {
    window.location.href = homePath;
  };

  return (
    <>
      <style>{animationStyles}</style>
      <div
        className="flex flex-col items-center justify-center min-h-screen font-sans"
        style={{ backgroundColor: theme.background }}
      >
        <div
          className="p-8 sm:p-12 rounded-2xl shadow-2xl flex flex-col items-center text-center max-w-md w-full"
          style={{ backgroundColor: theme.cardBackground }}
        >
          <NotFoundIcon />
          <h1
            className="text-5xl md:text-6xl font-extrabold mb-3"
            style={{ color: theme.primaryText }}
          >
            404
          </h1>
          <p
            className="text-lg md:text-xl font-medium mb-6"
            style={{ color: theme.secondaryText }}
          >
            Sorry, the page you are looking for does not exist.
          </p>
          <button
            onClick={handleGoHome}
            className="px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
            style={{
              backgroundImage: `linear-gradient(to right, ${theme.buttonGradientFrom}, ${theme.buttonGradientTo})`,
            }}
          >
            Back to Home
          </button>
        </div>
        <p className="mt-8 text-sm" style={{ color: theme.mutedText }}>
          This page was not found. Please check the URL and try again.
        </p>
      </div>
    </>
  );
};

// Main App component to display the NotFoundPage
export default function NotFoundPage() {
  return <ContentDesign />;
}
