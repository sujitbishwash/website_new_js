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

  // Fetch progress data from API
  const fetchProgressData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Try to fetch from API first
      try {
        const response = await videoProgressApi.getAllProgress();
        const videos = response.videos || [];
        
        // Transform API data to our format
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
        
      } catch (apiError: any) {
        // If API fails (404 or other error), fallback to localStorage
        if (apiError.status === 404) {
          
          await fetchFromLocalStorage();
        } else {
          throw apiError;
        }
      }
    } catch (err: any) {
      
      setError(err.message || "Failed to load video progress");
      // Fallback to localStorage on any error
      await fetchFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch progress data from localStorage as fallback
  const fetchFromLocalStorage = useCallback(async () => {
    try {
      const allKeys = Object.keys(localStorage);
      const progressKeys = allKeys.filter(key => key.startsWith('video_progress_'));
      
      const localProgressData: VideoProgressData[] = progressKeys.map(key => {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          const videoId = key.replace('video_progress_', '');
          
          return {
            videoId,
            title: data.title || `Video ${videoId}`,
            thumbnailUrl: data.thumbnailUrl || getYouTubeThumbnail(videoId),
            watchPercentage: data.watchPercentage || 0,
            totalDuration: data.totalDuration || 0,
            currentPosition: data.currentTime || data.currentPosition || 0,
            lastUpdated: data.lastUpdated || new Date().toISOString(),
            subject: data.subject || 'General',
            description: data.description || 'Video content',
            topics: data.topics || [],
            tags: data.tags || [],
            url: data.url
          };
        } catch {
          
          return null;
        }
      }).filter(Boolean) as VideoProgressData[];

      // Sort by last updated (most recent first)
      localProgressData.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
      
      setProgressData(localProgressData);
      
    } catch (err) {
      
      setError("Failed to load video progress from local storage");
    }
  }, []);

  // Refresh progress data
  const refreshProgress = useCallback(() => {
    fetchProgressData();
  }, [fetchProgressData]);

  // Get progress for a specific video
  const getVideoProgress = useCallback((videoId: string): VideoProgressData | undefined => {
    return progressData.find(item => item.videoId === videoId);
  }, [progressData]);

  // Get recent videos (last 10)
  const getRecentVideos = useCallback((limit: number = 10): VideoProgressData[] => {
    return progressData.slice(0, limit);
  }, [progressData]);

  // Get videos with progress > 0 (started watching)
  const getWatchedVideos = useCallback((): VideoProgressData[] => {
    return progressData.filter(item => item.watchPercentage > 0);
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

  // Generate YouTube thumbnail URL with fallback
  const getYouTubeThumbnail = useCallback((videoId: string): string => {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
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
    getAlmostCompletedVideos,
    getCompletedVideos,
    formatDuration,
    formatLastUpdated,
    getYouTubeThumbnail
  };
};
