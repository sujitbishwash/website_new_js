// App.tsx
import React, { useEffect, useRef, useState } from "react";

// Demo component placeholder (Test2Page was migrated to VideoFeedbackModal)
const Demo = () => (
  <div className="p-8 text-center">
    <h2 className="text-2xl font-bold mb-4">Feedback Component Migrated</h2>
    <p className="text-gray-600">
      The feedback component has been migrated to VideoFeedbackModal and is now
      integrated into VideoPage.
    </p>
  </div>
);

// --- Helper Components & Icons (Shared) ---

const VerifiedBadge = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-4 h-4 text-blue-500 dark:text-blue-400 ml-1"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

// --- Component 1: VideoLearningCard.tsx ---

type VideoLearningCardProps = {
  id: string;
  title: string;
  channel: string;
  duration: string;
  thumbnailUrl?: string;
  progressPct?: number;
  tags?: string[];
  onFeedback?: (
    videoId: string,
    feedback: { type: "thumbs" | "tag"; value: string; timestamp?: number }
  ) => void;
};

const ThumbsUpIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M1 8.25a1.25 1.25 0 112.5 0v7.5a1.25 1.25 0 11-2.5 0v-7.5zM11 3V1.7c0-.268.14-.516.379-.645a.75.75 0 01.87.123l.828.829A.75.75 0 0014 2.5h1.25a.75.75 0 01.75.75v6.518l-4.28 4.28a.75.75 0 01-1.06 0L8 11.487v-1.94l1.82-1.821a.75.75 0 00.24-.672v-.255c0-.268.14-.516.379-.645a.75.75 0 01.87.123l.828.829A.75.75 0 0014 6.5h.25a.75.75 0 01.75.75v.218a.75.75 0 00.24.53l1.82 1.821v4.301l-4.28 4.28a.75.75 0 01-1.06 0L6 14.487v-1.94l1.82-1.821a.75.75 0 00.24-.672V9.8c0-.268.14-.516.379-.645a.75.75 0 01.87.123l.828.829A.75.75 0 0011 10h.25a.75.75 0 01.75.75v.218a.75.75 0 00.24.53l1.82 1.821V16L11 11.717V3z" />
  </svg>
);
const ThumbsDownIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M19 11.75a1.25 1.25 0 00-2.5 0v7.5a1.25 1.25 0 002.5 0v-7.5zM9 17v1.3c0 .268-.14.516-.379.645a.75.75 0 00-.87-.123l-.828-.829A.75.75 0 016 17.5H4.75a.75.75 0 00-.75.75v-6.518l4.28-4.28a.75.75 0 001.06 0L12 10.513v1.94l-1.82 1.821a.75.75 0 01-.24.672v.255c0 .268-.14.516-.379.645a.75.75 0 00-.87-.123l-.828-.829A.75.75 0 016 13.5H5.75a.75.75 0 00-.75-.75v-.218a.75.75 0 01-.24-.53L3 10.178V5.877l4.28-4.28a.75.75 0 001.06 0L14 4.513v1.94l-1.82 1.821a.75.75 0 01-.24.672V9.2c0 .268-.14.516-.379.645a.75.75 0 00-.87-.123l-.828-.829A.75.75 0 019 10H8.75a.75.75 0 00-.75.75v-.218a.75.75 0 01-.24-.53L6 8.178V3L9 8.283V17z" />
  </svg>
);
const TagIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M3.25 4.25a.75.75 0 01.75-.75h8.5a.75.75 0 01.75.75v1.25h.75a.75.75 0 010 1.5h-.75v1.25h.75a.75.75 0 010 1.5h-.75V11h3.25a.75.75 0 01.75.75v3a.75.75 0 01-.75.75h-3.25V17a.75.75 0 01-1.5 0v-1.5H8.75a.75.75 0 010-1.5h1.25v-1.25h-1.25a.75.75 0 010-1.5h1.25V8.25H4a.75.75 0 01-.75-.75V4.25z" />
  </svg>
);

const VideoLearningCard: React.FC<VideoLearningCardProps> = ({
  id,
  title,
  channel,
  duration,
  thumbnailUrl,
  progressPct = 0,
  tags = [],
  onFeedback = () => {},
}) => {
  // ... component logic from previous step
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [isTagMenuOpen, setIsTagMenuOpen] = useState(false);
  const tagMenuRef = useRef<HTMLDivElement>(null);
  const feedbackTags = ["Too fast", "Good example", "Wrong concept", "Unclear"];

  const handleThumbsFeedback = (value: "up" | "down") => {
    const newFeedback = feedback === value ? null : value;
    setFeedback(newFeedback);
    onFeedback(id, { type: "thumbs", value: newFeedback || "none" });
  };

  const handleTagFeedback = (tag: string) => {
    onFeedback(id, { type: "tag", value: tag });
    setIsTagMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tagMenuRef.current &&
        !tagMenuRef.current.contains(event.target as Node)
      ) {
        setIsTagMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl w-full">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-1/3 flex-shrink-0">
          <div className="relative aspect-w-16 aspect-h-9">
            <img
              className="w-full h-full object-cover"
              src={
                thumbnailUrl ||
                `https://placehold.co/400x225/1e293b/ffffff?text=Video`
              }
              alt={`Thumbnail for video: ${title}`}
            />
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded">
              {duration}
            </div>
            {progressPct > 0 && progressPct < 100 && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-1 bg-red-600"
                  style={{ width: `${progressPct}%` }}
                  role="progressbar"
                  aria-valuenow={progressPct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${progressPct}% watched`}
                ></div>
              </div>
            )}
          </div>
        </div>
        <div className="p-4 flex flex-col justify-between flex-grow">
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 leading-tight">
              {title}
            </h3>
            <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
              <span>{channel}</span>
              <VerifiedBadge />
            </div>
            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between gap-4">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Feedback:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleThumbsFeedback("up")}
                aria-pressed={feedback === "up"}
                className={`p-1.5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 ${
                  feedback === "up"
                    ? "bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300"
                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                aria-label="Thumbs up"
              >
                <span className="sr-only">Helpful</span>
                <ThumbsUpIcon />
              </button>
              <button
                onClick={() => handleThumbsFeedback("down")}
                aria-pressed={feedback === "down"}
                className={`p-1.5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 ${
                  feedback === "down"
                    ? "bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300"
                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                aria-label="Thumbs down"
              >
                <span className="sr-only">Not helpful</span>
                <ThumbsDownIcon />
              </button>
              <div className="relative" ref={tagMenuRef}>
                <button
                  onClick={() => setIsTagMenuOpen(!isTagMenuOpen)}
                  className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                  aria-label="Give tag feedback"
                  aria-haspopup="true"
                  aria-expanded={isTagMenuOpen}
                >
                  <span className="sr-only">Add tag</span>
                  <TagIcon />
                </button>
                {isTagMenuOpen && (
                  <div className="absolute bottom-full mb-2 right-0 w-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                    <ul role="menu">
                      {feedbackTags.map((tag) => (
                        <li key={tag}>
                          <button
                            onClick={() => handleTagFeedback(tag)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            role="menuitem"
                          >
                            {tag}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Component 2: VideoPlayerWithFeedback.tsx ---

type VideoPlayerWithFeedbackProps = {
  videoUrl: string;
  transcriptSegments: {
    startSec: number;
    endSec: number;
    text: string;
    id: string;
  }[];
  onSubmitFeedback: (payload: {
    videoUrl: string;
    timestamp: number;
    type: "thumbs" | "tag" | "report";
    value: string;
  }) => void;
};

const ThumbsUpIconPlayer = ({
  className = "w-6 h-6",
}: {
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M7.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h6a3 3 0 003-3V6.75a3 3 0 00-3-3h-6z" />
    <path d="M16.5 2.25a3 3 0 013 3v13.5a3 3 0 01-3 3h-1.5a.75.75 0 010-1.5h1.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5h-1.5a.75.75 0 010-1.5h1.5z" />
  </svg>
);
const ThumbsDownIconPlayer = ({
  className = "w-6 h-6",
}: {
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M16.5 20.25a3 3 0 003-3V6.75a3 3 0 00-3-3h-6a3 3 0 00-3 3v10.5a3 3 0 003 3h6z" />
    <path d="M7.5 21.75a3 3 0 01-3-3V5.25a3 3 0 013-3h1.5a.75.75 0 010 1.5H7.5a1.5 1.5 0 00-1.5 1.5v13.5a1.5 1.5 0 001.5 1.5h1.5a.75.75 0 010 1.5H7.5z" />
  </svg>
);
const ReportIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M3 2.25a.75.75 0 01.75.75v.54l1.838-.46a9.75 9.75 0 016.824 0l1.838.46v-.54a.75.75 0 011.5 0v.54l1.838-.46a9.75 9.75 0 016.824 0l1.838.46a.75.75 0 01.541.822l-2.135 8.54a.75.75 0 01-.723.59h-2.133a10.43 10.43 0 00-1.33-1.017.75.75 0 00-1.06 1.06 11.93 11.93 0 011.61 1.207h-5.072a.75.75 0 010-1.5h3.34a9.01 9.01 0 00-1.49-1.025.75.75 0 10-.928-1.162 10.51 10.51 0 012.08 1.437h-3.04a.75.75 0 010-1.5h1.263a8.94 8.94 0 00-1.07-1.041.75.75 0 10-.938 1.173 10.44 10.44 0 011.23 1.118H9.75a.75.75 0 010-1.5h.063a8.94 8.94 0 00-1.07-1.041.75.75 0 10-.938 1.173 10.44 10.44 0 011.23 1.118H3.75a.75.75 0 01-.723-.59L.892 3.822a.75.75 0 01.542-.822l1.838-.46a9.75 9.75 0 016.824 0l1.838.46v-.54a.75.75 0 01.75-.75h.001z"
      clipRule="evenodd"
    />
  </svg>
);
const FeedbackIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
    />
  </svg>
);

const VideoPlayerWithFeedback: React.FC<VideoPlayerWithFeedbackProps> = ({
  videoUrl,
  transcriptSegments,
  onSubmitFeedback,
}) => {
  // ... component logic from previous step
  const videoRef = useRef<HTMLIFrameElement | HTMLVideoElement>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [reportText, setReportText] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const feedbackMenuRef = useRef<HTMLDivElement>(null);
  const isYoutube =
    videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
  const feedbackTags = ["Too fast", "Good example", "Unclear explanation"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime((prev) => (prev + 1) % 500);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSeek = (time: number) => {
    console.log(`Simulating seek to: ${time}s`);
    setCurrentTime(time);
  };

  const submitFeedback = (type: "thumbs" | "tag" | "report", value: string) => {
    onSubmitFeedback({
      videoUrl,
      timestamp: Math.round(currentTime),
      type,
      value,
    });
    if (type !== "report") {
      setIsFeedbackOpen(false);
    }
  };

  const handleReportSubmit = () => {
    if (reportText.trim()) {
      submitFeedback("report", reportText);
      setReportText("");
      setIsReporting(false);
      setIsFeedbackOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        feedbackMenuRef.current &&
        !feedbackMenuRef.current.contains(event.target as Node)
      ) {
        setIsFeedbackOpen(false);
        setIsReporting(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-6 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
      <div className="flex-grow md:w-2/3 relative">
        <div className="aspect-w-16 aspect-h-9 w-full bg-black rounded-lg overflow-hidden shadow-lg">
          {isYoutube ? (
            <iframe
              ref={videoRef as React.Ref<HTMLIFrameElement>}
              src={videoUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          ) : (
            <video
              ref={videoRef as React.Ref<HTMLVideoElement>}
              controls
              src={videoUrl}
              className="w-full h-full"
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>
        <div ref={feedbackMenuRef} className="absolute bottom-4 right-4">
          <button
            onClick={() => setIsFeedbackOpen(!isFeedbackOpen)}
            className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-4 focus:ring-offset-gray-900 transition-transform hover:scale-110"
            aria-label="Open feedback menu"
            aria-haspopup="true"
            aria-expanded={isFeedbackOpen}
          >
            <FeedbackIcon />
          </button>
          {isFeedbackOpen && (
            <div className="absolute bottom-full right-0 mb-3 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-4 z-20">
              {!isReporting ? (
                <>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Feedback at{" "}
                    {new Date(currentTime * 1000).toISOString().substr(14, 5)}
                  </p>
                  <div className="flex justify-around mb-3">
                    <button
                      onClick={() => submitFeedback("thumbs", "up")}
                      className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-800 hover:text-green-600 dark:hover:text-green-300 transition-colors"
                      aria-label="Helpful"
                    >
                      <ThumbsUpIconPlayer />
                    </button>
                    <button
                      onClick={() => submitFeedback("thumbs", "down")}
                      className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-800 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                      aria-label="Not helpful"
                    >
                      <ThumbsDownIconPlayer />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {feedbackTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => submitFeedback("tag", tag)}
                        className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setIsReporting(true)}
                    className="w-full flex items-center justify-center gap-2 text-sm px-3 py-2 bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-md hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                  >
                    <ReportIcon className="w-5 h-5" /> Report Issue
                  </button>
                </>
              ) : (
                <div>
                  <label
                    htmlFor="report-text"
                    className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 block"
                  >
                    Report an issue
                  </label>
                  <textarea
                    id="report-text"
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    className="w-full h-24 p-2 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., The audio is out of sync..."
                  ></textarea>
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => setIsReporting(false)}
                      className="px-3 py-1 text-sm rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReportSubmit}
                      className="px-3 py-1 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                      disabled={!reportText.trim()}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex-grow md:w-1/3">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-inner h-[60vh] md:h-full flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex-shrink-0">
            Transcript
          </h3>
          <div className="overflow-y-auto space-y-2 flex-grow">
            {transcriptSegments.map((segment) => {
              const isActive =
                currentTime >= segment.startSec && currentTime < segment.endSec;
              return (
                <button
                  key={segment.id}
                  onClick={() => handleSeek(segment.startSec)}
                  className={`w-full text-left p-3 rounded-md transition-colors duration-200 ${
                    isActive
                      ? "bg-blue-100 dark:bg-blue-900/50"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">
                    {new Date(segment.startSec * 1000)
                      .toISOString()
                      .substr(14, 5)}
                  </span>
                  <p
                    className={`mt-1 text-sm ${
                      isActive
                        ? "text-gray-800 dark:text-gray-100"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {segment.text}
                  </p>
                </button>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <p className="font-semibold text-sm mb-2 text-gray-800 dark:text-gray-200">
              Quick Check:
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              If a principal of ₹5000 earns ₹1000 simple interest in 2 years,
              what is the annual rate?
            </p>
            <div className="space-y-2">
              <button className="w-full text-left text-sm p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                A) 5%
              </button>
              <button className="w-full text-left text-sm p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                B) 10%
              </button>
              <button className="w-full text-left text-sm p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                C) 20%
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Component 3: DashboardLayout.tsx ---

const Logo = () => (
  <div className="flex items-center gap-2">
    <svg
      className="w-8 h-8 text-blue-600 dark:text-blue-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
      />
    </svg>
    <span className="font-bold text-xl text-gray-900 dark:text-white">
      BankPrep
    </span>
  </div>
);
const HomeIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5"
    />
  </svg>
);
const PlayIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
    />
  </svg>
);
const ChartIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
    />
  </svg>
);
const UserIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);
const MenuIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);
const CloseIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
const DemoVideoLearningCard: React.FC<any> = ({
  title,
  channel,
  duration,
  progressPct,
  tags,
  thumbnailUrl,
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
    <div className="relative aspect-w-16 aspect-h-9">
      <img
        className="w-full h-full object-cover"
        src={thumbnailUrl}
        alt={`Thumbnail for ${title}`}
      />
      <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded">
        {duration}
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700">
        <div
          className="h-1 bg-red-600"
          style={{ width: `${progressPct}%` }}
        ></div>
      </div>
    </div>
    <div className="p-4">
      <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{channel}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {tags.map((tag: string) => (
          <span
            key={tag}
            className="text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const DashboardLayout: React.FC = () => {
  // ... component logic from previous step
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const navItems = [
    { name: "Dashboard", icon: HomeIcon },
    { name: "My Learning", icon: PlayIcon },
    { name: "Mock Tests", icon: ChartIcon },
    { name: "Profile", icon: UserIcon },
  ];
  const mockVideos = [
    {
      id: 1,
      title: "Data Interpretation Masterclass",
      channel: "Exam Wizards",
      duration: "45:10",
      progressPct: 30,
      tags: ["DI", "Mains"],
      thumbnailUrl: "https://placehold.co/400x225/ec4899/ffffff?text=DI",
    },
    {
      id: 2,
      title: "Puzzles & Seating Arrangement",
      channel: "Reasoning Gurus",
      duration: "55:30",
      progressPct: 80,
      tags: ["Reasoning", "Puzzles"],
      thumbnailUrl: "https://placehold.co/400x225/8b5cf6/ffffff?text=Puzzles",
    },
    {
      id: 3,
      title: "English Grammar Rules",
      channel: "Verbal Edge",
      duration: "32:05",
      progressPct: 100,
      tags: ["English", "Grammar"],
      thumbnailUrl: "https://placehold.co/400x225/f59e0b/ffffff?text=English",
    },
    {
      id: 4,
      title: "Banking Awareness: RBI Functions",
      channel: "GA Pro",
      duration: "28:40",
      progressPct: 10,
      tags: ["GA", "Banking"],
      thumbnailUrl: "https://placehold.co/400x225/10b981/ffffff?text=Banking",
    },
    {
      id: 5,
      title: "Simplification & Approximation Tricks",
      channel: "BankPro Academy",
      duration: "18:55",
      progressPct: 0,
      tags: ["Quant", "Speed Math"],
      thumbnailUrl: "https://placehold.co/400x225/3b82f6/ffffff?text=Tricks",
    },
    {
      id: 6,
      title: "Critical Reasoning Deep Dive",
      channel: "Reasoning Gurus",
      duration: "48:22",
      progressPct: 55,
      tags: ["Reasoning", "Mains"],
      thumbnailUrl: "https://placehold.co/400x225/ef4444/ffffff?text=Reasoning",
    },
  ];
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Logo />
      </div>
      <nav className="flex-grow p-4 space-y-2">
        {navItems.map((item) => (
          <a
            href="#"
            key={item.name}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors"
          >
            <item.icon />
            <span>{item.name}</span>
          </a>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          © 2024 BankPrep
        </div>
      </div>
    </div>
  );
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <aside className="hidden lg:block fixed top-0 left-0 w-64 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-30">
        <SidebarContent />
      </aside>
      <div className="lg:pl-64">
        <header className="lg:hidden sticky top-0 bg-white dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center z-20">
          <Logo />
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            aria-label="Open navigation menu"
          >
            <MenuIcon />
          </button>
        </header>
        {isMobileNavOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileNavOpen(false)}
            aria-hidden="true"
          ></div>
        )}
        <div
          className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 z-50 transition-transform duration-300 ease-in-out ${
            isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-end p-4">
            <button
              onClick={() => setIsMobileNavOpen(false)}
              aria-label="Close navigation menu"
            >
              <CloseIcon />
            </button>
          </div>
          <SidebarContent />
        </div>
        <div className="flex">
          <main className="flex-grow p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6">
              Continue Learning
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockVideos.map((video) => (
                <DemoVideoLearningCard key={video.id} {...video} />
              ))}
            </div>
          </main>
          <aside className="hidden md:block w-80 flex-shrink-0 p-6 border-l border-gray-200 dark:border-gray-700">
            <h2 className="font-bold text-xl mb-4">Recommendations</h2>
            <div className="space-y-4">
              {mockVideos
                .slice(0, 3)
                .reverse()
                .map((video) => (
                  <div key={video.id} className="flex gap-4">
                    <img
                      src={video.thumbnailUrl}
                      alt=""
                      className="w-24 h-14 object-cover rounded-md flex-shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-semibold line-clamp-2">
                        {video.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {video.channel}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </aside>
        </div>
      </div>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-2 flex justify-around z-20">
        {navItems.map((item) => (
          <a
            href="#"
            key={item.name}
            className="flex flex-col items-center justify-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors w-full py-1"
          >
            <item.icon />
            <span className="text-xs mt-1">{item.name}</span>
          </a>
        ))}
      </nav>
    </div>
  );
};

// --- Demo Wrapper and Main App Component ---

const VideoLearningCardDemo = () => {
  const handleFeedback = (videoId: string, feedback: any) => {
    console.log(`Feedback for video ${videoId}:`, feedback);
  };
  const demoProps = {
    id: "vid-001",
    title: "Mastering Quantitative Aptitude: Ratios and Proportions Explained",
    channel: "BankPro Academy",
    duration: "28:15",
    thumbnailUrl: "https://placehold.co/400x225/3b82f6/ffffff?text=Quant+Prep",
    progressPct: 75,
    tags: ["Quant", "Ratios", "Beginner"],
    onFeedback: handleFeedback,
  };
  return (
    <div className="p-4 sm:p-8 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto">
        <VideoLearningCard {...demoProps} />
      </div>
    </div>
  );
};

const VideoPlayerWithFeedbackDemo = () => {
  const demoTranscript = [
    {
      id: "t1",
      startSec: 0,
      endSec: 10,
      text: "Hello and welcome. In this video, we'll cover the basics of Simple Interest.",
    },
    {
      id: "t2",
      startSec: 10,
      endSec: 25,
      text: "The formula is I = P * R * T, where I is interest, P is principal, R is rate, and T is time.",
    },
    {
      id: "t3",
      startSec: 25,
      endSec: 45,
      text: "Let's take an example. If you invest ₹5000 at a 10% annual rate for 2 years, the interest is 5000 times 0.10 times 2, which equals ₹1000.",
    },
    {
      id: "t4",
      startSec: 45,
      endSec: 60,
      text: "The total amount you'll have after two years is the principal plus the interest, so ₹6000.",
    },
  ];
  const handleSubmit = (payload: any) => {
    console.log("Feedback Submitted:", payload);
  };
  return (
    <div className="p-4 bg-gray-200 dark:bg-black">
      <VideoPlayerWithFeedback
        videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
        transcriptSegments={demoTranscript}
        onSubmitFeedback={handleSubmit}
      />
    </div>
  );
};

type View = "card" | "player" | "dashboard";

const TestPage = () => {
  const [view, setView] = useState<View>("dashboard");

  const renderView = () => {
    switch (view) {
      case "card":
        return <VideoLearningCardDemo />;
      case "player":
        return <VideoPlayerWithFeedbackDemo />;
      case "dashboard":
      default:
        return <DashboardLayout />;
    }
  };

  return (
    <div>
      <div className="p-4 bg-gray-200 dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
          <h2 className="font-bold text-lg text-gray-800 dark:text-white">
            View Component:
          </h2>
          <button
            onClick={() => setView("dashboard")}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              view === "dashboard"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-700"
            }`}
          >
            Dashboard Layout
          </button>
          <button
            onClick={() => setView("card")}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              view === "card"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-700"
            }`}
          >
            Video Card
          </button>
          <button
            onClick={() => setView("player")}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              view === "player"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-700"
            }`}
          >
            Video Player
          </button>
        </div>
      </div>
      <div>
        <Demo />
      </div>
      {renderView()}
    </div>
  );
};

export default TestPage;
