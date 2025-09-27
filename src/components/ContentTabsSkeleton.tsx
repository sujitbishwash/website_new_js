import React from 'react';
import LoadingScreen from './ui/LoadingScreen1';

interface ContentTabsSkeletonProps {
  isLoading: boolean;
  progress: number;
  message: string;
  children?: React.ReactNode;
}

const ContentTabsSkeleton: React.FC<ContentTabsSkeletonProps> = ({
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
      skeletonType="content-tabs"
    >
      {children}
    </LoadingScreen>
  );
};

export default ContentTabsSkeleton;
