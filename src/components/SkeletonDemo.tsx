import React, { useState } from 'react';
import LoadingScreen from './ui/LoadingScreen1';

const SkeletonDemo: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [skeletonType, setSkeletonType] = useState<'video-player' | 'content-tabs' | 'ai-tutor-panel' | 'full-page'>('full-page');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Loading...');

  const startLoading = (type: typeof skeletonType) => {
    setSkeletonType(type);
    setIsLoading(true);
    setProgress(0);
    setMessage(`Loading ${type.replace('-', ' ')}...`);
    
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">LoadingScreen Skeleton Demo</h1>
      
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => startLoading('video-player')}
          className="p-4 border rounded-lg hover:bg-gray-50"
        >
          <h3 className="font-semibold">Video Player Skeleton</h3>
          <p className="text-sm text-gray-600">Shows video player and controls</p>
        </button>
        
        <button
          onClick={() => startLoading('content-tabs')}
          className="p-4 border rounded-lg hover:bg-gray-50"
        >
          <h3 className="font-semibold">Content Tabs Skeleton</h3>
          <p className="text-sm text-gray-600">Shows tabs and content area</p>
        </button>
        
        <button
          onClick={() => startLoading('ai-tutor-panel')}
          className="p-4 border rounded-lg hover:bg-gray-50"
        >
          <h3 className="font-semibold">AI Tutor Panel Skeleton</h3>
          <p className="text-sm text-gray-600">Shows AI tutor interface</p>
        </button>
        
        <button
          onClick={() => startLoading('full-page')}
          className="p-4 border rounded-lg hover:bg-gray-50"
        >
          <h3 className="font-semibold">Full Page Skeleton</h3>
          <p className="text-sm text-gray-600">Shows complete page layout</p>
        </button>
      </div>

      <LoadingScreen
        isLoading={isLoading}
        progress={progress}
        message={message}
        showSkeleton={true}
        skeletonType={skeletonType}
      >
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold mb-2">Loading Complete!</h2>
          <p className="text-gray-600">The skeleton has been replaced with actual content.</p>
        </div>
      </LoadingScreen>
    </div>
  );
};

export default SkeletonDemo;
