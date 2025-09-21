import { useState, useCallback, useRef, useEffect } from 'react';

interface ApiProgressItem {
  id: string;
  name: string;
  isLoading: boolean;
  weight: number; // Weight for calculating overall progress (0-1)
}

interface UseApiProgressOptions {
  onComplete?: () => void;
  minProgress?: number; // Minimum progress to show (0-100)
  maxProgress?: number; // Maximum progress to show (0-100)
}

export const useApiProgress = (options: UseApiProgressOptions = {}) => {
  const { onComplete, minProgress = 0, maxProgress = 100 } = options;
  const [apis, setApis] = useState<Map<string, ApiProgressItem>>(new Map());
  const [overallProgress, setOverallProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('Initializing...');
  const completedApis = useRef<Set<string>>(new Set());

  // Calculate overall progress
  const calculateProgress = useCallback((apiMap: Map<string, ApiProgressItem>) => {
    if (apiMap.size === 0) return 0;

    let totalWeight = 0;
    let completedWeight = 0;

    apiMap.forEach((api) => {
      totalWeight += api.weight;
      if (!api.isLoading) {
        completedWeight += api.weight;
      }
    });

    const progress = totalWeight > 0 ? (completedWeight / totalWeight) * 100 : 0;
    return Math.min(maxProgress, Math.max(minProgress, progress));
  }, [minProgress, maxProgress]);

  // Register a new API
  const registerApi = useCallback((id: string, name: string, weight: number = 1) => {
    setApis(prev => {
      const newMap = new Map(prev);
      newMap.set(id, { id, name, isLoading: true, weight });
      return newMap;
    });
    setIsLoading(true);
  }, []);

  // Mark API as loading
  const setApiLoading = useCallback((id: string, loading: boolean, message?: string) => {
    setApis(prev => {
      const newMap = new Map(prev);
      const api = newMap.get(id);
      if (api) {
        newMap.set(id, { ...api, isLoading: loading });
      }
      return newMap;
    });

    if (message) {
      setCurrentMessage(message);
    }
  }, []);

  // Mark API as completed
  const setApiCompleted = useCallback((id: string, message?: string) => {
    setApis(prev => {
      const newMap = new Map(prev);
      const api = newMap.get(id);
      if (api) {
        newMap.set(id, { ...api, isLoading: false });
      }
      return newMap;
    });

    completedApis.current.add(id);
    
    if (message) {
      setCurrentMessage(message);
    }
  }, []);

  // Mark API as failed
  const setApiFailed = useCallback((id: string, message?: string) => {
    setApis(prev => {
      const newMap = new Map(prev);
      const api = newMap.get(id);
      if (api) {
        newMap.set(id, { ...api, isLoading: false });
      }
      return newMap;
    });

    completedApis.current.add(id);
    
    if (message) {
      setCurrentMessage(message);
    }
  }, []);

  // Update progress when APIs change
  useEffect(() => {
    const progress = calculateProgress(apis);
    setOverallProgress(progress);

    // Check if all APIs are completed
    const allCompleted = Array.from(apis.values()).every(api => !api.isLoading);
    if (allCompleted && apis.size > 0) {
      setIsLoading(false);
      setCurrentMessage('Loading complete!');
      onComplete?.();
    }
  }, [apis, calculateProgress, onComplete]);

  // Progress simulation - gradually increase progress even if APIs are slow
  useEffect(() => {
    if (isLoading && apis.size > 0) {
      const startTime = Date.now();
      const maxDuration = 25000; // 25 seconds max
      
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const simulatedProgress = Math.min(90, (elapsed / maxDuration) * 100);
        
        // Always update progress to ensure it moves
        setOverallProgress(prev => {
          const newProgress = Math.max(prev, simulatedProgress);
          return newProgress;
        });
        
        if (elapsed >= maxDuration) {
          clearInterval(progressInterval);
        }
      }, 1000); // Update every 1 second

      return () => clearInterval(progressInterval);
    }
  }, [isLoading, apis.size]);

  // Immediate progress start - ensure progress starts moving right away
  useEffect(() => {
    if (isLoading && apis.size > 0) {
      // Start with a small progress to show something is happening
      setOverallProgress(prev => Math.max(prev, 5));
      
      // Force progress to move every 500ms for the first 10 seconds
      const immediateInterval = setInterval(() => {
        setOverallProgress(prev => {
          const newProgress = Math.min(50, prev + 1);
          return newProgress;
        });
      }, 500);
      
      // Clear after 10 seconds
      setTimeout(() => clearInterval(immediateInterval), 10000);
      
      return () => clearInterval(immediateInterval);
    }
  }, [isLoading, apis.size]);

  // Force progress to move every 2 seconds if it's stuck
  useEffect(() => {
    if (isLoading && apis.size > 0) {
      const forceUpdateInterval = setInterval(() => {
        setOverallProgress(prev => {
          // Force progress to increase by at least 2% every 2 seconds
          const newProgress = Math.min(100, prev + 2);
          return newProgress;
        });
      }, 2000);

      return () => clearInterval(forceUpdateInterval);
    }
  }, [isLoading, apis.size]);

  // Timeout mechanism - force completion after 30 seconds
  useEffect(() => {
    if (isLoading && apis.size > 0) {
      const timeout = setTimeout(() => {
        // Mark all loading APIs as completed
        setApis(prev => {
          const newMap = new Map(prev);
          newMap.forEach((api, id) => {
            if (api.isLoading) {
              newMap.set(id, { ...api, isLoading: false });
            }
          });
          return newMap;
        });
        setIsLoading(false);
        setCurrentMessage('Loading complete!');
        onComplete?.();
      }, 30000); // 30 second timeout

      return () => clearTimeout(timeout);
    }
  }, [isLoading, apis.size, onComplete]);

  // Reset all progress
  const reset = useCallback(() => {
    setApis(new Map());
    setOverallProgress(0);
    setIsLoading(false);
    setCurrentMessage('Initializing...');
    completedApis.current.clear();
  }, []);

  // Get loading status for specific API
  const getApiStatus = useCallback((id: string) => {
    return apis.get(id);
  }, [apis]);

  // Get all loading APIs
  const getLoadingApis = useCallback(() => {
    return Array.from(apis.values()).filter(api => api.isLoading);
  }, [apis]);

  return {
    // State
    isLoading,
    progress: overallProgress,
    message: currentMessage,
    apis: Array.from(apis.values()),
    loadingApis: getLoadingApis(),
    
    // Actions
    registerApi,
    setApiLoading,
    setApiCompleted,
    setApiFailed,
    reset,
    getApiStatus,
  };
};

export default useApiProgress;
