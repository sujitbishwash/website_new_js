import React from 'react';
import LoadingScreen from './ui/LoadingScreen1';

interface VideoPlayerSkeletonProps {
  isLoading: boolean;
  progress: number;
  message: string;
  children?: React.ReactNode;
}

const VideoPlayerSkeleton: React.FC<VideoPlayerSkeletonProps> = ({
  isLoading,
  progress,
  message,
  children
}) => {
  return (
    <LoadingScreen
      isLoading={isLoading}
      progress={progress}
      message={message}
      showSkeleton={true}
      skeletonType="video-player"
    >
      {children}
    </LoadingScreen>
  );
};

export default VideoPlayerSkeleton;
