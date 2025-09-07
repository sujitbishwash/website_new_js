import { buildVideoLearningRoute } from "@/routes/constants";
import { useNavigate } from "react-router-dom";
import { useVideoProgress } from "../../hooks/useVideoProgress";
import { useState } from "react";

// --- Type Definitions ---

// --- Main Page Component ---
const HistoryPage = () => {
  const navigate = useNavigate();
  const [loadingVideoId, setLoadingVideoId] = useState<string | null>(null);
  
  // Use video progress hook
  const {
    isLoading,
    error,
    refreshProgress,
    getWatchedVideos,
    formatDuration,
    formatLastUpdated
  } = useVideoProgress();

  // Get all watched videos (including completed ones)
  const allWatchedVideos = getWatchedVideos();

  const handleVideoClick = async (videoId: string) => {
    try {
      setLoadingVideoId(videoId);
      // Navigate directly since we already have the videoId
      navigate(buildVideoLearningRoute(videoId));
    } catch (err: any) {
      console.error("Failed to navigate to video:", err);
    } finally {
      setLoadingVideoId(null);
    }
  };

  return (
    <div className="min-h-screen p-10 font-sans text-foreground bg-background mt-10 sm:mt-4">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-center sm:text-left text-3xl">
          Your Learning History
        </h1>
        <button
          onClick={refreshProgress}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 text-sm text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-card rounded-lg border border-border"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground text-lg">
            Loading your learning history...
          </span>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg mb-4">{error}</p>
          <button
            onClick={refreshProgress}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try again
          </button>
        </div>
      ) : allWatchedVideos.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8 mx-auto">
          {allWatchedVideos.map((video) => (
            <div
              key={video.videoId}
              onClick={() => handleVideoClick(video.videoId)}
              className={`group relative bg-card/80 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl cursor-pointer hover:border-primary border border-border-medium hover:-translate-y-1 ${
                loadingVideoId === video.videoId ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <div className="relative">
                <img
                  src={video.thumbnailUrl}
                  alt={`Thumbnail for ${video.title}`}
                  className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    // Try different YouTube thumbnail formats
                    if (target.src.includes('hqdefault.jpg')) {
                      target.src = `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`;
                    } else if (target.src.includes('mqdefault.jpg')) {
                      target.src = `https://img.youtube.com/vi/${video.videoId}/default.jpg`;
                    } else {
                      target.src = "https://placehold.co/600x400/333/FFF?text=No+Thumbnail";
                    }
                  }}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <svg className="h-12 w-12 text-white group-hover:scale-110 transition-all duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                  {formatDuration(video.totalDuration)}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-foreground truncate text-lg mb-2">
                  {video.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {video.tags?.[0] || video.subject}
                </p>
                {video.topics && video.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {video.topics.slice(0, 3).map((topic, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                    {video.topics.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full">
                        +{video.topics.length - 3} more
                      </span>
                    )}
                  </div>
                )}
                <div className="w-full bg-muted rounded-full h-2 mb-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.round(video.watchPercentage)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>{Math.round(video.watchPercentage)}% Complete</span>
                  <span>{formatLastUpdated(video.lastUpdated)}</span>
                </div>
                {video.watchPercentage >= 100 && (
                  <div className="mt-2 flex items-center text-green-400 text-xs">
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Completed
                  </div>
                )}
              </div>
              <div className="absolute top-3 right-3 p-1.5 bg-black/40 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              {loadingVideoId === video.videoId && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <svg className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xl font-medium mb-2">No learning history yet</p>
          <p className="text-sm mb-6">Start watching videos to build your learning history</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Start Learning
          </button>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;