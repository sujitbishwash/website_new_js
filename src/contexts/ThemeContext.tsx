import React, { createContext, useContext, useEffect, useState } from "react";
import {
  ThemeColors,
  ThemeType,
  getThemeColors,
  themeToCSSVariables,
} from "../lib/theme";

interface ThemeContextType {
  theme: ThemeColors;
  themeType: ThemeType;
  setTheme: (themeType: ThemeType) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeType;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = "dark",
}) => {
  const [themeType, setThemeType] = useState<ThemeType>(defaultTheme);
  const [theme, setThemeColors] = useState<ThemeColors>(
    getThemeColors(defaultTheme)
  );

  // Function to change theme
  const setTheme = (newThemeType: ThemeType) => {
    setThemeType(newThemeType);
    setThemeColors(getThemeColors(newThemeType));

    // Save theme preference to localStorage
    localStorage.setItem("theme", newThemeType);

    // Apply theme to document root
    applyThemeToDocument(newThemeType);
  };

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = themeType === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  // Function to apply theme CSS variables to document
  const applyThemeToDocument = (themeType: ThemeType) => {
    const themeColors = getThemeColors(themeType);
    const cssVariables = themeToCSSVariables(themeColors);

    // Apply CSS variables to document root
    Object.entries(cssVariables).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });

    // Update body class for additional styling if needed
    document.body.className = themeType === "dark" ? "dark" : "light";
  };

  // Initialize theme on mount
  useEffect(() => {
    // Try to get saved theme from localStorage
    const savedTheme = localStorage.getItem("theme") as ThemeType;
    const initialTheme =
      savedTheme && ["dark", "light"].includes(savedTheme)
        ? savedTheme
        : defaultTheme;

    setThemeType(initialTheme);
    setThemeColors(getThemeColors(initialTheme));
    applyThemeToDocument(initialTheme);
  }, [defaultTheme]);

  // Apply theme changes when theme changes
  useEffect(() => {
    applyThemeToDocument(themeType);
  }, [themeType]);

  const value: ThemeContextType = {
    theme,
    themeType,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// Hook to use theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Hook to get theme colors directly
export const useThemeColors = (): ThemeColors => {
  const { theme } = useTheme();
  return theme;
};
