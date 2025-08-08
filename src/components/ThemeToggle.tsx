import { Moon, Sun } from "lucide-react";
import React from "react";
import { useTheme } from "../contexts/ThemeContext";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "icon" | "button" | "text";
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = "",
  size = "md",
  variant = "icon",
}) => {
  const { themeType, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const handleToggle = () => {
    toggleTheme();
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleToggle}
        className={`${sizeClasses[size]} rounded-lg transition-colors duration-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        style={{
          backgroundColor: "var(--color-card-hover)",
          color: "var(--color-primary-text)",
        }}
        aria-label={`Switch to ${
          themeType === "dark" ? "light" : "dark"
        } theme`}
      >
        {themeType === "dark" ? (
          <Sun size={iconSizes[size]} />
        ) : (
          <Moon size={iconSizes[size]} />
        )}
      </button>
    );
  }

  if (variant === "button") {
    return (
      <button
        onClick={handleToggle}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        style={{
          backgroundColor: "var(--color-card)",
          color: "var(--color-primary-text)",
          border: "1px solid var(--color-border)",
        }}
      >
        {themeType === "dark" ? (
          <>
            <Sun size={iconSizes[size]} />
            <span>Light Mode</span>
          </>
        ) : (
          <>
            <Moon size={iconSizes[size]} />
            <span>Dark Mode</span>
          </>
        )}
      </button>
    );
  }

  if (variant === "text") {
    return (
      <button
        onClick={handleToggle}
        className={`text-sm transition-colors duration-200 hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        style={{
          color: "var(--color-secondary-text)",
        }}
      >
        {themeType === "dark" ? "Light Mode" : "Dark Mode"}
      </button>
    );
  }

  return null;
};

export default ThemeToggle;
