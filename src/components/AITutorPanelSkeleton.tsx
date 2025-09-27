import React from 'react';
import LoadingScreen from './ui/LoadingScreen1';

interface AITutorPanelSkeletonProps {
  isLoading: boolean;
  progress: number;
  message: string;
  children?: React.ReactNode;
}

const AITutorPanelSkeleton: React.FC<AITutorPanelSkeletonProps> = ({
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
      skeletonType="ai-tutor-panel"
    >
      {children}
    </LoadingScreen>
  );
};

export default AITutorPanelSkeleton;
