import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../../routes/constants";
import { ArrowLeft, BookOpen, AlertTriangle } from "lucide-react";

const OutOfSyllabusPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the video URL from location state if available
  const videoUrl = location.state?.videoUrl || "";
  const videoTitle = location.state?.videoTitle || "This video";

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate(ROUTES.HOME);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-card border border-border rounded-2xl shadow-2xl p-8 text-center">
          {/* Icon */}
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-10 h-10 text-orange-600 dark:text-orange-400" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Content Out of Syllabus
            </h1>
            <p className="text-muted-foreground text-lg">
              The content you're trying to access is not part of your current syllabus.
            </p>
          </div>

          {/* Video Info */}
          {videoUrl && (
            <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Video Details
              </h3>
              <p className="text-sm text-muted-foreground mb-1">
                <span className="font-medium">Title:</span> {videoTitle}
              </p>
              <p className="text-sm text-muted-foreground break-all">
                <span className="font-medium">URL:</span> {videoUrl}
              </p>
            </div>
          )}

          {/* Message */}
          <div className="mb-8">
            <p className="text-foreground mb-4">
              We apologize, but the content you're trying to access is not included in your current 
              exam syllabus. This helps us ensure you focus on the most relevant material for your preparation.
            </p>
            <p className="text-muted-foreground text-sm">
              Please select content that aligns with your exam goals and syllabus requirements.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGoBack}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
            <button
              onClick={handleGoHome}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/80 text-white rounded-lg transition-colors font-medium"
            >
              <BookOpen className="w-4 h-4" />
              Browse Syllabus Content
            </button>
          </div>

          {/* Additional Help */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Need help finding relevant content? Check our{" "}
              <button
                onClick={() => navigate(ROUTES.HOME)}
                className="text-primary hover:underline font-medium"
              >
                recommended videos
              </button>{" "}
              or{" "}
              <button
                onClick={() => navigate(ROUTES.TEST_SERIES)}
                className="text-primary hover:underline font-medium"
              >
                practice tests
              </button>{" "}
              that match your syllabus.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutOfSyllabusPage;
