import React from "react";
import { useThemeColors } from "../contexts/ThemeContext";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  text,
  className = "",
}) => {
  const theme = useThemeColors();

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-solid`}
        style={{
          borderColor: `${theme.border} transparent ${theme.border} transparent`,
          borderTopColor: theme.accent,
        }}
      />
      {text && (
        <p className="mt-2 text-sm" style={{ color: theme.secondaryText }}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
