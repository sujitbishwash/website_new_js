import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { theme } from '@/styles/theme';

interface ProgressBarProps {
  isLoading: boolean;
  progress: number; // 0-100
  message?: string;
  showPercentage?: boolean;
  showMessage?: boolean;
  height?: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  isLoading,
  progress,
  message = "Loading...",
  showPercentage = true,
  showMessage = false,
  height = 4,
  className = ""
}) => {
  const [displayProgress, setDisplayProgress] = React.useState(0);

  // Animate progress changes
  React.useEffect(() => {
    const targetProgress = Math.min(100, Math.max(0, progress));
    const interval = setInterval(() => {
      setDisplayProgress(prev => {
        const diff = targetProgress - prev;
        if (Math.abs(diff) < 0.1) {
          clearInterval(interval);
          return targetProgress;
        }
        return prev + diff * 0.1; // Smooth animation
      });
    }, 50);

    return () => clearInterval(interval);
  }, [progress]);

  if (!isLoading) return null;

  return (
    <div className={`w-full ${className}`}>
      <Box className="mb-2">
        {showMessage && <div className="flex justify-between items-center mb-1">
          <Typography 
            variant="body2" 
            className="text-muted-foreground text-sm"
          >
            {message}
          </Typography>
          {showPercentage && (
            <Typography 
              variant="body2" 
              className="text-muted-foreground text-sm font-medium"
            >
              {Math.round(displayProgress)}%
            </Typography>
          )}
        </div>}
        <LinearProgress
          variant="determinate"
          value={displayProgress}
          sx={{
            height: height,
            borderRadius: height / 2,
            backgroundColor: theme.divider,
            '& .MuiLinearProgress-bar': {
              borderRadius: height / 2,
              background: `linear-gradient(90deg, ${theme.accent} 0%, ${theme.buttonGradientTo} 100%)`,
              transition: 'transform 0.3s ease-in-out',
            },
          }}
        />
      </Box>
    </div>
  );
};

export default ProgressBar;
