import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SuggestedVideo, videoApi } from "../lib/api-client";
import { ROUTES, buildVideoLearningRoute } from "../routes/constants";
import { useAuth } from "../contexts/AuthContext";

// Centralized theme colors for easy customization
const theme = {
  background: "#111827",
  cardBackground: "#1F2937",
  primaryText: "#FFFFFF",
  secondaryText: "#9CA3AF",
  accent: "#60A5FA",
  divider: "#4B5563",
};

// Custom CSS for animations that Tailwind doesn't support
const CustomStyles = `
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

  /* Custom animation classes for Tailwind */
  .animate-drop-in {
    animation: dropIn 0.6s ease-out forwards;
  }

  .animate-fade-out {
    animation: fadeOut 0.5s ease-in forwards;
  }

  .animate-icon-wobble {
    animation: iconWobble 1s ease-out 0.5s;
  }
`;

// --- Icon Components ---
const LightbulbIcon: React.FC = () => (
  <div className="animate-icon-wobble mb-4">
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


const BookIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

// --- Main App Component ---

interface OutOfSyllabusProps {
  onGoBack: () => void;
  suggestedVideos?: SuggestedVideo[];
}

const OutOfSyllabus: React.FC<OutOfSyllabusProps> = ({ onGoBack, suggestedVideos = [] }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [userExamGoal, setUserExamGoal] = useState<{ exam: string; group: string } | null>(null);
  
  const navigate = useNavigate();
  const { getUserData } = useAuth();

  // Debug logging
  console.log("🎬 OutOfSyllabus - suggestedVideos received:", suggestedVideos);
  console.log("🎬 OutOfSyllabus - suggestedVideos length:", suggestedVideos?.length);

  // Effect to inject custom styles into the document's head
  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = CustomStyles;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  // Fetch user exam goal when component mounts
  useEffect(() => {
    const fetchExamGoal = async () => {
      try {
        const response = await getUserData();
        if (response?.data?.exam_goal) {
          setUserExamGoal({
            exam: response.data.exam_goal.exam || "",
            group: response.data.exam_goal.group || ""
          });
        }
      } catch (error) {
        console.error("Failed to fetch exam goal:", error);
      }
    };

    fetchExamGoal();
  }, [getUserData]);

  const handleSuggestedVideoClick = async (video: SuggestedVideo) => {
    try {
      const details = await videoApi.getVideoDetail(video.url);
      onGoBack();
      navigate(buildVideoLearningRoute(details.external_source_id));
    } catch (err: any) {
      console.error("Failed to load suggested video:", err);
      // If it's also out of syllabus, just close the modal
      onGoBack();
    }
  };

  // Function to handle closing the message box
  const handleClose = () => {
    setIsClosing(true);
    // Wait for the animation to finish before removing the element
    setTimeout(() => {
      setIsVisible(false);
      onGoBack(); // Call the onGoBack function after animation
    }, 500); // This duration should match the fadeOut animation time
  };

  // Main container classes
  const appContainerClasses = `flex justify-center items-center min-h-screen p-4 bg-cover bg-center ${
    isClosing ? "animate-fade-out" : "animate-drop-in"
  }`;

  // Message box classes
  const messageBoxClasses = `bg-gray-800 p-8 rounded-2xl shadow-2xl w-[90%] max-w-[500px] text-center relative backdrop-blur-3xl ${
    isClosing ? "animate-fade-out" : "animate-drop-in"
  }`;


  const closeButtonClasses = "absolute top-3 right-3 bg-transparent border-none text-gray-400 text-3xl cursor-pointer leading-none";

  if (!isVisible) {
    return null; // Don't render anything if the box is closed
  }

  return (
    <div 
      className={appContainerClasses}
      style={{
        backgroundImage: "url('https://source.unsplash.com/1600x900/?abstract,dark')",
      }}
    >
      <div className={`${messageBoxClasses} max-w-4xl w-[95%] max-h-[90vh] overflow-y-auto`}>
        <button
          className={closeButtonClasses}
          onClick={handleClose}
          aria-label="Close"
        >
          &times;
        </button>
        
        {/* Header Section */}
        <div className="text-center mb-6">
          <LightbulbIcon />
          <h3 className="text-blue-400 mt-0 text-2xl font-bold mb-2">
            Content Not Relevant
          </h3>
          <p className="text-gray-300 text-lg">
            The video you entered is not relevant to your exam preparation.
          </p>
        </div>

        {/* Exam Goal Section */}
        {userExamGoal && (
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-6 mb-6 border border-blue-500/30 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="bg-blue-500/20 p-2 rounded-lg mr-3">
                <BookIcon className="text-blue-400" />
              </div>
              <h4 className="text-blue-300 font-bold text-xl">Your Exam Goal</h4>
            </div>
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="bg-blue-600/20 px-4 py-2 rounded-lg border border-blue-400/30">
                  <p className="text-blue-200 text-xs font-medium uppercase tracking-wide mb-1">Exam</p>
                  <p className="text-white font-bold text-lg">{userExamGoal.exam}</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-purple-600/20 px-4 py-2 rounded-lg border border-purple-400/30">
                  <p className="text-purple-200 text-xs font-medium uppercase tracking-wide mb-1">Group</p>
                  <p className="text-white font-bold text-lg">{userExamGoal.group}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Suggested Videos Section */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="bg-purple-500/20 p-2 rounded-lg mr-3">
              <BookIcon className="text-purple-400" />
            </div>
            <h4 className="text-gray-200 font-bold text-xl">Suggested Videos for Your Preparation</h4>
          </div>

          {suggestedVideos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-2">No suggested videos available</p>
              <p className="text-gray-500 text-sm">Debug: suggestedVideos length = {suggestedVideos?.length || 0}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestedVideos.slice(0, 6).map((video) => (
                <div
                  key={video.id}
                  onClick={() => handleSuggestedVideoClick(video)}
                  className="group cursor-pointer overflow-hidden rounded-lg border border-gray-600 bg-gray-700/30 transition-all hover:bg-gray-600/50 hover:shadow-lg hover:border-purple-400 hover:scale-105"
                >
                  <img
                    src={video.thumbnailUrl}
                    alt={`Thumbnail for ${video.title}`}
                    className="h-32 w-full object-cover transition-transform group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "https://placehold.co/400x225/333/FFF?text=Error";
                    }}
                  />
                  <div className="p-3">
                    <p className="truncate font-semibold text-gray-200 text-sm mb-1">
                      {video.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {video.topic}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 pt-4 border-t border-gray-600">
          <button
            onClick={() => navigate(ROUTES.DASHBOARD)}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
          >
            Go to Dashboard
          </button>
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            Try Another Video
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutOfSyllabus;
