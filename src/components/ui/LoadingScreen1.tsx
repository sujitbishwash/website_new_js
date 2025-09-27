import React from 'react';

type SkeletonType = 'video-player' | 'header' | 'content-tabs' | 'ai-tutor-panel' | 'generic';

interface LoadingScreenProps {
  isLoading: boolean;
  showSkeleton?: boolean;
  skeletonType?: SkeletonType;
  children?: React.ReactNode;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  isLoading,
  showSkeleton = false,
  skeletonType = 'generic',
  children
}) => {
  if (!isLoading) {
    return <>{children}</>;
  }

  // Header Skeleton
  const HeaderSkeleton = () => (
    <div className="flex justify-between items-center pb-4">
      <div className="h-5 bg-muted rounded w-3/4 animate-pulse"></div>
      <div className="flex space-x-4">
        <div className="w-7 h-7 bg-muted rounded-full animate-pulse"></div>
        <div className="w-7 h-7 bg-muted rounded-full animate-pulse"></div>
      </div>
    </div>
  );

  // Video Player Skeleton
  const VideoPlayerSkeleton = () => (
    <div className="aspect-video bg-muted rounded-xl animate-pulse"></div>
  );

  // Content Tabs Skeleton
  const ContentTabsSkeleton = () => (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex space-x-2 border-b">
        <div className="h-8 bg-muted rounded-t w-20 animate-pulse"></div>
        <div className="h-8 bg-muted rounded-t w-20 animate-pulse"></div>
        <div className="h-8 bg-muted rounded-t w-20 animate-pulse"></div>
      </div>
      
      {/* Content */}
      <div className="space-y-3">
        <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
        <div className="h-4 bg-muted rounded w-4/5 animate-pulse"></div>
        <div className="h-4 bg-muted rounded w-3/5 animate-pulse"></div>
        <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
        <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
      </div>
    </div>
  );

  // AI Tutor Panel Skeleton
  const AITutorPanelSkeleton = () => (
    <div className="h-full bg-muted/10 rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="h-6 bg-muted rounded w-32 animate-pulse"></div>
        <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
      </div>
      
      {/* Tabs */}
      <div className="flex space-x-2">
        <div className="h-8 bg-muted rounded w-16 animate-pulse"></div>
        <div className="h-8 bg-muted rounded w-16 animate-pulse"></div>
        <div className="h-8 bg-muted rounded w-16 animate-pulse"></div>
        <div className="h-8 bg-muted rounded w-16 animate-pulse"></div>
      </div>
      
      {/* Content Area */}
      <div className="space-y-3 flex-1">
        <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
        <div className="h-4 bg-muted rounded w-4/5 animate-pulse"></div>
        <div className="h-4 bg-muted rounded w-3/5 animate-pulse"></div>
        <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
        <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
        <div className="h-4 bg-muted rounded w-4/5 animate-pulse"></div>
        <div className="h-4 bg-muted rounded w-3/5 animate-pulse"></div>
      </div>
      
      {/* Input Area */}
      <div className="flex space-x-2">
        <div className="h-10 bg-muted rounded flex-1 animate-pulse"></div>
        <div className="h-10 w-10 bg-muted rounded animate-pulse"></div>
      </div>
    </div>
  );

  // Full Page Skeleton (existing)
  const FullPageSkeleton = () => (
    <div className="w-full max-w-4xl mt-8">
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Left Column Skeleton */}
        <div className="xl:col-span-3">
          <div className="space-y-4">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center pb-4">
              <div className="h-5 bg-muted rounded w-3/4 animate-pulse"></div>
              <div className="flex space-x-4">
                <div className="w-7 h-7 bg-muted rounded-full animate-pulse"></div>
                <div className="w-7 h-7 bg-muted rounded-full animate-pulse"></div>
              </div>
            </div>
            
            {/* Video Player Skeleton */}
            <div className="aspect-video bg-muted rounded-xl animate-pulse"></div>
            
            {/* Controls Skeleton */}
            <div className="flex space-x-4">
              <div className="h-10 bg-muted rounded w-32 animate-pulse"></div>
              <div className="h-10 bg-muted rounded w-32 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="xl:col-span-2 bg-muted/20 p-4 rounded-lg">
          <div className="space-y-4">
            {/* Content Skeleton */}
            <div className="space-y-3">
              <div className="h-5 bg-muted rounded w-full animate-pulse"></div>
              <div className="h-5 bg-muted rounded w-4/5 animate-pulse"></div>
              <div className="h-5 bg-muted rounded w-3/5 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSkeleton = () => {
    switch (skeletonType) {
      case 'header':
        return <HeaderSkeleton />;
      case 'video-player':
        return <VideoPlayerSkeleton />;
      case 'content-tabs':
        return <ContentTabsSkeleton />;
      case 'ai-tutor-panel':
        return <AITutorPanelSkeleton />;
      case 'generic':
      default:
        return <FullPageSkeleton />;
    }
  };

  return (
    <>
      {showSkeleton && renderSkeleton()}
    </>
  );
};

export default LoadingScreen;
