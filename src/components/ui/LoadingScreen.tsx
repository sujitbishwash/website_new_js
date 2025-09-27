import React from "react";

type SkeletonType = 'video-player' | 'header' | 'content-tabs' | 'ai-tutor-panel' | 'generic';

interface LoadingScreenProps {
  isLoading: boolean;
  progress: number;
  message: string;
  showSkeleton?: boolean;
  skeletonType?: SkeletonType;
  children?: React.ReactNode;
}
const SkeletonHeader = () => (
  <div className="flex justify-between items-center pb-4">
    <div className="h-5 bg-muted rounded w-3/4"></div>
    <div className="flex space-x-4">
      <div className="w-7 h-7 bg-muted rounded-full"></div>
      <div className="w-7 h-7 bg-muted rounded-full"></div>
    </div>
  </div>
);
const SkeletonTabs = () => (
  <div className="flex space-x-2">
    <div className="h-8 bg-muted rounded w-16"></div>
    <div className="h-8 bg-muted rounded w-16"></div>
    <div className="h-8 bg-muted rounded w-16"></div>
    <div className="h-8 bg-muted rounded w-16"></div>
  </div>
);
const SkeletonVideoPlayer = () => (
  <div className="aspect-video bg-muted rounded-xl"></div>
);
const SkeletonControls = () => (
  <div className="flex space-x-4">
    <div className="h-10 bg-muted rounded w-32"></div>
    <div className="h-10 bg-muted rounded w-32"></div>
  </div>
);
const SkeletonContent = () => (
  <div className="space-y-3">
    <div className="h-5 bg-muted rounded w-full"></div>
    <div className="h-5 bg-muted rounded w-4/5"></div>
    <div className="h-5 bg-muted rounded w-3/5"></div>
  </div>
);

const AITutorPanelSkeleton = () => (<>
<SkeletonContent />
<SkeletonTabs />
<SkeletonControls />
</>);

const GenericSkeleton = () => (
  <div className="w-full max-w-4xl mt-8">
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
      {/* Left Column Skeleton */}
      

      {/* Right Column Skeleton */}
      
    </div>
  </div>
);

const renderSkeleton = (skeletonType: SkeletonType) => {
  switch (skeletonType) {
    case 'header':
      return <SkeletonHeader />;
    case 'video-player':
      return <SkeletonVideoPlayer />;
    case 'content-tabs':
      return <SkeletonTabs />;
    case 'ai-tutor-panel':
      return <AITutorPanelSkeleton />;
    case 'generic':
    default:
      return <GenericSkeleton />;
  }
};
const LoadingScreen: React.FC<LoadingScreenProps> = ({
  isLoading,
  skeletonType = 'generic',
  showSkeleton = false,
  children,
}) => {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <>{showSkeleton && renderSkeleton(skeletonType)}</>
    
  );
};

export default LoadingScreen;
