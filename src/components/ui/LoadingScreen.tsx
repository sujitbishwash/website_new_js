import React from "react";

type SkeletonType = 'video-player' | 'header' | 'content-tabs' | 'ai-tutor-panel' | 'generic';

interface LoadingScreenProps {
  isLoading: boolean;
  showSkeleton?: boolean;
  skeletonType?: SkeletonType;
  children?: React.ReactNode;
}

// Base skeleton animation styles
const skeletonBase = "bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse";
const shimmerEffect = "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent";

const SkeletonHeader = () => (
  <div className="flex justify-between items-center pb-4 animate-pulse">
    <div className="flex-1 space-y-2">
      <div className={`h-6 ${skeletonBase} rounded-md w-3/4 ${shimmerEffect}`}></div>
      <div className={`h-4 ${skeletonBase} rounded w-1/2 ${shimmerEffect}`}></div>
    </div>
    <div className="flex space-x-3">
      <div className={`w-8 h-8 ${skeletonBase} rounded-full ${shimmerEffect}`}></div>
      <div className={`w-8 h-8 ${skeletonBase} rounded-full ${shimmerEffect}`}></div>
      <div className={`w-8 h-8 ${skeletonBase} rounded-full ${shimmerEffect}`}></div>
    </div>
  </div>
);

const SkeletonTabs = () => (
  <div className="flex space-x-2 animate-pulse">
    <div className={`h-9 ${skeletonBase} rounded-lg w-20 ${shimmerEffect}`}></div>
    <div className={`h-9 ${skeletonBase} rounded-lg w-24 ${shimmerEffect}`}></div>
    <div className={`h-9 ${skeletonBase} rounded-lg w-20 ${shimmerEffect}`}></div>
    <div className={`h-9 ${skeletonBase} rounded-lg w-28 ${shimmerEffect}`}></div>
  </div>
);

const SkeletonVideoPlayer = () => (
  <div className="relative animate-pulse">
    <div className={`aspect-video ${skeletonBase} rounded-xl ${shimmerEffect}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`w-16 h-16 ${skeletonBase} rounded-full ${shimmerEffect}`}></div>
      </div>
    </div>
    <div className="mt-3 flex justify-between items-center">
      <div className={`h-4 ${skeletonBase} rounded w-24 ${shimmerEffect}`}></div>
      <div className={`h-4 ${skeletonBase} rounded w-16 ${shimmerEffect}`}></div>
    </div>
  </div>
);


const SkeletonContent = () => (
  <div className="space-y-4 animate-pulse">
    <div className="space-y-2">
      <div className={`h-4 ${skeletonBase} rounded w-full ${shimmerEffect}`}></div>
      <div className={`h-4 ${skeletonBase} rounded w-4/5 ${shimmerEffect}`}></div>
      <div className={`h-4 ${skeletonBase} rounded w-3/5 ${shimmerEffect}`}></div>
    </div>
    <div className="space-y-2">
      <div className={`h-4 ${skeletonBase} rounded w-5/6 ${shimmerEffect}`}></div>
      <div className={`h-4 ${skeletonBase} rounded w-2/3 ${shimmerEffect}`}></div>
    </div>
  </div>
);

const AITutorPanelSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex justify-between items-center">
      <div className={`h-6 ${skeletonBase} rounded w-32 ${shimmerEffect}`}></div>
      <div className={`h-8 ${skeletonBase} rounded-full w-8 ${shimmerEffect}`}></div>
    </div>
    <SkeletonTabs />
    <SkeletonContent />
    <div className="space-y-3">
      <div className={`h-12 ${skeletonBase} rounded-lg w-full ${shimmerEffect}`}></div>
      <div className="flex space-x-2">
        <div className={`h-8 ${skeletonBase} rounded w-20 ${shimmerEffect}`}></div>
        <div className={`h-8 ${skeletonBase} rounded w-16 ${shimmerEffect}`}></div>
      </div>
    </div>
  </div>
);

const GenericSkeleton = () => (
  <div className="w-full max-w-4xl mt-8 animate-pulse">
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
      {/* Left Column Skeleton */}
      <div className="xl:col-span-3 space-y-6">
        <div className={`h-8 ${skeletonBase} rounded w-2/3 ${shimmerEffect}`}></div>
        <div className={`aspect-video ${skeletonBase} rounded-xl ${shimmerEffect}`}></div>
        <div className="space-y-4">
          <div className={`h-6 ${skeletonBase} rounded w-1/4 ${shimmerEffect}`}></div>
          <div className="space-y-2">
            <div className={`h-4 ${skeletonBase} rounded w-full ${shimmerEffect}`}></div>
            <div className={`h-4 ${skeletonBase} rounded w-4/5 ${shimmerEffect}`}></div>
            <div className={`h-4 ${skeletonBase} rounded w-3/5 ${shimmerEffect}`}></div>
          </div>
        </div>
      </div>
      
      {/* Right Column Skeleton */}
      <div className="xl:col-span-2 space-y-6">
        <div className={`h-6 ${skeletonBase} rounded w-1/3 ${shimmerEffect}`}></div>
        <div className="space-y-4">
          <div className={`h-12 ${skeletonBase} rounded-lg w-full ${shimmerEffect}`}></div>
          <div className="space-y-2">
            <div className={`h-4 ${skeletonBase} rounded w-full ${shimmerEffect}`}></div>
            <div className={`h-4 ${skeletonBase} rounded w-3/4 ${shimmerEffect}`}></div>
          </div>
        </div>
      </div>
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
