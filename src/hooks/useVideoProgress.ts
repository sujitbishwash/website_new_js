import { useState, useEffect, useCallback } from 'react';
import { videoProgressApi } from '@/lib/api-client';

interface VideoProgressData {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  watchPercentage: number;
  totalDuration: number;
  currentPosition: number;
  lastUpdated: string;
  subject?: string;
  description?: string;
  topics?: string[];
  tags?: string[];
  url?: string;
}

export const useVideoProgress = () => {
  const [progressData, setProgressData] = useState<VideoProgressData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate YouTube thumbnail URL
  const getYouTubeThumbnail = useCallback((videoId: string): string => {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }, []);

  // Fetch progress data from API
  const fetchProgressData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await videoProgressApi.getAllProgress();
      const videos = response.videos || [];

      const transformedData: VideoProgressData[] = videos.map((video: any) => {
        const videoData = video.data || video;
        return {
          videoId: videoData.video_id,
          title: videoData.title || `Video ${videoData.video_id}`,
          thumbnailUrl: getYouTubeThumbnail(videoData.video_id),
          watchPercentage: videoData.watch_percentage || 0,
          totalDuration: videoData.total_duration || 0,
          currentPosition: videoData.current_position || 0,
          lastUpdated: videoData.last_updated || new Date().toISOString(),
          subject: videoData.topics?.[0] || 'General',
          description: videoData.title || 'Video content',
          topics: videoData.topics || [],
          tags: videoData.tags || [],
          url: videoData.url
        };
      });

      setProgressData(transformedData);
    } catch (err: any) {
      setError(err.message || "Failed to load video progress");
    } finally {
      setIsLoading(false);
    }
  }, [getYouTubeThumbnail]);

  // Refresh progress data
  const refreshProgress = useCallback(() => {
    fetchProgressData();
  }, [fetchProgressData]);

  // Get progress for a specific video
  const getVideoProgress = useCallback(
    (videoId: string): VideoProgressData | undefined => {
      return progressData.find(item => item.videoId === videoId);
    },
    [progressData]
  );

  // Get recent videos (last 10)
  const getRecentVideos = useCallback(
    (limit: number = 10): VideoProgressData[] => {
      return progressData.slice(0, limit);
    },
    [progressData]
  );

  // Get videos with progress > 0 (started watching)
  const getWatchedVideos = useCallback((): VideoProgressData[] => {
    return progressData.filter(item => item.watchPercentage > 0);
  }, [progressData]);

  const getAllWatchedVideos = useCallback((): VideoProgressData[] => {
    return progressData;
  }, [progressData]);

  // Get videos with progress >= 90% (almost completed)
  const getAlmostCompletedVideos = useCallback((): VideoProgressData[] => {
    return progressData.filter(item => item.watchPercentage >= 90 && item.watchPercentage < 100);
  }, [progressData]);

  // Get completed videos (100%)
  const getCompletedVideos = useCallback((): VideoProgressData[] => {
    return progressData.filter(item => item.watchPercentage >= 100);
  }, [progressData]);

  // Format duration helper
  const formatDuration = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Format last updated helper
  const formatLastUpdated = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  }, []);

  // Load progress data on mount
  useEffect(() => {
    fetchProgressData();
  }, [fetchProgressData]);

  return {
    progressData,
    isLoading,
    error,
    refreshProgress,
    getVideoProgress,
    getRecentVideos,
    getWatchedVideos,
    getAllWatchedVideos,
    getAlmostCompletedVideos,
    getCompletedVideos,
    formatDuration,
    formatLastUpdated,
    getYouTubeThumbnail
  };
};
