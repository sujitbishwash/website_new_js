import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Pause, Play, Square } from 'lucide-react';

export interface TimerMetadata {
  total_time: number;
  start_time: string;
  end_time?: string;
  is_paused: boolean;
  pause_duration: number;
}

interface TestTimerProps {
  duration?: number; // Duration in seconds, if not provided, timer runs indefinitely
  onTimeUpdate?: (timeElapsed: number, metadata: TimerMetadata) => void;
  onTimeExpired?: (metadata: TimerMetadata) => void;
  autoStart?: boolean;
  className?: string;
  showControls?: boolean;
  warningThreshold?: number; // Show warning when this many seconds remain
}

export const TestTimer: React.FC<TestTimerProps> = ({
  duration,
  onTimeUpdate,
  onTimeExpired,
  autoStart = true,
  className = '',
  showControls = true,
  warningThreshold = 60, // 1 minute warning by default
}) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(autoStart ? new Date() : null);
  const [pauseStartTime, setPauseStartTime] = useState<Date | null>(null);
  const [totalPauseDuration, setTotalPauseDuration] = useState(0);

  // Calculate remaining time
  const remainingTime = duration ? Math.max(0, duration - timeElapsed) : null;
  const isTimeLow = remainingTime !== null && remainingTime <= warningThreshold;
  const isExpired = remainingTime !== null && remainingTime <= 0;

  // Format time display
  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, []);

  // Get current metadata
  const getMetadata = useCallback((): TimerMetadata => {
    const now = new Date();
    return {
      total_time: timeElapsed,
      start_time: startTime?.toISOString() || now.toISOString(),
      end_time: !isRunning && !isPaused ? now.toISOString() : undefined,
      is_paused: isPaused,
      pause_duration: totalPauseDuration,
    };
  }, [timeElapsed, startTime, isRunning, isPaused, totalPauseDuration]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => {
          const newTime = prev + 1;
          
          // Check if time has expired
          if (duration && newTime >= duration) {
            setIsRunning(false);
            onTimeExpired?.(getMetadata());
            return duration;
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, isPaused, duration, onTimeExpired, getMetadata]);

  // Notify parent of time updates
  useEffect(() => {
    onTimeUpdate?.(timeElapsed, getMetadata());
  }, [timeElapsed, onTimeUpdate, getMetadata]);

  // Handle pause/resume
  const handlePauseResume = () => {
    if (isPaused) {
      // Resume
      if (pauseStartTime) {
        const pauseDuration = Math.floor((new Date().getTime() - pauseStartTime.getTime()) / 1000);
        setTotalPauseDuration(prev => prev + pauseDuration);
        setPauseStartTime(null);
      }
      setIsPaused(false);
    } else {
      // Pause
      setPauseStartTime(new Date());
      setIsPaused(true);
    }
  };

  // Handle start/stop
  const handleStartStop = () => {
    if (isRunning) {
      setIsRunning(false);
      setIsPaused(false);
      setPauseStartTime(null);
    } else {
      setIsRunning(true);
      if (!startTime) {
        setStartTime(new Date());
      }
    }
  };

  // Reset timer
  // const handleReset = () => {
  //   setTimeElapsed(0);
  //   setIsRunning(false);
  //   setIsPaused(false);
  //   setStartTime(autoStart ? new Date() : null);
  //   setPauseStartTime(null);
  //   setTotalPauseDuration(0);
  // };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Timer Display */}
      <div className="flex items-center gap-2">
        <Clock className={`h-5 w-5 ${isTimeLow ? 'text-red-500' : 'text-foreground'}`} />
        <div className="flex flex-col">
          <span className={`text-sm font-medium ${isTimeLow ? 'text-red-500' : 'text-foreground'}`}>
            {duration ? 'Time Left' : 'Time Elapsed'}
          </span>
          <span
            className={`font-mono text-lg font-bold ${
              isTimeLow
                ? 'text-red-500 animate-pulse'
                : isExpired
                ? 'text-red-600'
                : 'text-foreground'
            }`}
          >
            {formatTime(remainingTime ?? timeElapsed)}
          </span>
        </div>
      </div>

      {/* Controls */}
      {showControls && (
        <div className="flex items-center gap-1">
          <button
            onClick={handlePauseResume}
            disabled={!isRunning && !isPaused}
            className={`p-2 rounded-lg transition-colors ${
              !isRunning && !isPaused
                ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                : isPaused
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-yellow-600 hover:bg-yellow-700 text-white'
            }`}
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </button>
          
          <button
            onClick={handleStartStop}
            className={`p-2 rounded-lg transition-colors ${
              isRunning
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            title={isRunning ? 'Stop' : 'Start'}
          >
            <Square className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Status Indicator */}
      <div className="flex items-center gap-1">
        <div
          className={`w-2 h-2 rounded-full ${
            isExpired
              ? 'bg-red-500'
              : isTimeLow
              ? 'bg-yellow-500 animate-pulse'
              : isPaused
              ? 'bg-yellow-500'
              : isRunning
              ? 'bg-green-500'
              : 'bg-gray-500'
          }`}
        />
        <span className="text-xs text-muted-foreground">
          {isExpired
            ? 'Expired'
            : isTimeLow
            ? 'Low Time'
            : isPaused
            ? 'Paused'
            : isRunning
            ? 'Running'
            : 'Stopped'}
        </span>
      </div>
    </div>
  );
};

export default TestTimer;
