import React from 'react';
import ProgressBar from './ProgressBar';

interface LoadingScreenProps {
  isLoading: boolean;
  progress: number;
  message: string;
  showSkeleton?: boolean;
  children?: React.ReactNode;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  isLoading,
  progress,
  message,
  showSkeleton = false,
  children
}) => {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className="bg-background min-h-screen font-sans flex flex-col justify-center items-center p-4 gap-6">
      {/* Logo or Icon */}

      {/* Progress Section */}
      <div className="w-full max-w-md">
        <ProgressBar
          isLoading={true}
          progress={progress}
          message={message}
          showPercentage={true}
          height={6}
          className="mb-4"
        />
      </div>

      {/* Skeleton content if needed */}
      {showSkeleton && (
        <div className="w-full max-w-4xl mt-8">
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
            {/* Left Column Skeleton */}
            <div className="xl:col-span-3">
              <div className="space-y-4">
                {/* Header Skeleton */}
                <div className="flex justify-between items-center pb-4">
                  <div className="h-5 bg-muted rounded w-3/4"></div>
                  <div className="flex space-x-4">
                    <div className="w-7 h-7 bg-muted rounded-full"></div>
                    <div className="w-7 h-7 bg-muted rounded-full"></div>
                  </div>
                </div>
                
                {/* Video Player Skeleton */}
                <div className="aspect-video bg-muted rounded-xl"></div>
                
                {/* Controls Skeleton */}
                <div className="flex space-x-4">
                  <div className="h-10 bg-muted rounded w-32"></div>
                  <div className="h-10 bg-muted rounded w-32"></div>
                </div>
              </div>
            </div>

            {/* Right Column Skeleton */}
            <div className="xl:col-span-2 bg-muted/20 p-4 rounded-lg">
              <div className="space-y-4">
                {/* Tabs Skeleton */}
                <div className="flex space-x-2">
                  <div className="h-8 bg-muted rounded w-16"></div>
                  <div className="h-8 bg-muted rounded w-16"></div>
                  <div className="h-8 bg-muted rounded w-16"></div>
                  <div className="h-8 bg-muted rounded w-16"></div>
                </div>
                
                {/* Content Skeleton */}
                <div className="space-y-3">
                  <div className="h-5 bg-muted rounded w-full"></div>
                  <div className="h-5 bg-muted rounded w-4/5"></div>
                  <div className="h-5 bg-muted rounded w-3/5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingScreen;
