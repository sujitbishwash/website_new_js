import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SuggestedVideo, videoApi } from "../lib/api-client";
import { ROUTES, buildVideoLearningRoute } from "../routes/constants";
import { useAuth } from "../contexts/AuthContext";
import { Annoyed, X } from "lucide-react";

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



// --- Main App Component ---

interface OutOfSyllabusProps {
  onGoBack: () => void;
  suggestedVideos?: SuggestedVideo[];
}

const OutOfSyllabus: React.FC<OutOfSyllabusProps> = ({ onGoBack, suggestedVideos = [] }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [userExamGoal, setUserExamGoal] = useState<{ exam: string; group: string } | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
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
const navigateToHome = () => {
    handleClose();
    navigate(ROUTES.DASHBOARD);
  };
  if (!isVisible) {
    return null; // Don't render anything if the box is closed
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-sm animate-fade-in p-4">
      <div
        ref={modalRef}
          className={`relative w-full max-w-lg bg-card text-primary rounded-2xl shadow-2xl border border-border flex flex-col max-h-[80vh] ${isClosing ? "animate-fade-out" : "animate-drop-in"}`}
        >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-2 text-border-high rounded-full hover:bg-foreground/10 hover:text-foreground transition-colors z-10 cursor-pointer"
        >
          <X />
        </button>
        {/* Header Section */}
          <div className="text-center p-8 border-b border-border">
            <h2 className="text-2xl font-semibold text-neutral-100 mb-1">
              Content Not Relevant
            </h2>
            <p className="text-neutral-400 max-w-md mx-auto mb-4">
              This video doesn't seem to be relevant for your selected exam.
            </p>
            {/* Exam Goal Section */}
        {userExamGoal && (
            <div className="bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm p-3 rounded-lg">
              <span className="font-semibold">Current Goal:</span> {userExamGoal.exam} ({userExamGoal.group})
            </div>
          )}
          </div>
          
        <div className="p-6 overflow-y-auto">
        

        {/* Suggested Videos Section */}
          <div className="flex items-center mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Suggested Videos for Your Preparation</h3>
          </div>

          {suggestedVideos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-2">No suggested videos available</p>
              <p className="text-gray-500 text-sm">Debug: suggestedVideos length = {suggestedVideos?.length || 0}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestedVideos.slice(0, 3).map((video) => (
                <div
                  key={video.id}
                  onClick={() => handleSuggestedVideoClick(video)}
                      className="group cursor-pointer overflow-hidden rounded-lg border border-border bg-none transition-all hover:bg-accent hover:shadow-lg hover:border-primary"
                >
                  <img
                    src={video.thumbnailUrl}
                    alt={`Thumbnail for ${video.title}`}
                    className="h-24 w-full object-cover transition-transform group-hover:scale-105"
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
        <div className=" flex justify-end items-center gap-4 p-5 border-t border-border bg-card rounded-b-2xl">
          <button
            onClick={navigateToHome}
            className="rounded-lg bg-border-high px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-border, focus:outline-none focus:ring-2 focus:ring-border-high cursor-pointer"
          >
            Go to Home
          </button>
          <button
            onClick={handleClose}
            className="rounded-lg bg-border-medium px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-border-medium  cursor-pointer disabled:bg-border-border disabled:cursor-not-allowed"
          >
            Try Another Video
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutOfSyllabus;