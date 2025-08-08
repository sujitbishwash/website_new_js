// Centralized theme configuration for the entire application
// This allows easy theme switching and maintains consistency across all components

export interface ThemeColors {
  // Background colors
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  
  // Card and surface colors
  card: string;
  cardSecondary: string;
  cardHover: string;
  
  // Text colors
  primaryText: string;
  secondaryText: string;
  mutedText: string;
  inverseText: string;
  
  // Accent and brand colors
  primary: string;
  primaryHover: string;
  secondary: string;
  accent: string;
  accentHover: string;
  
  // Status colors
  success: string;
  successHover: string;
  warning: string;
  warningHover: string;
  error: string;
  errorHover: string;
  info: string;
  infoHover: string;
  
  // Border and divider colors
  border: string;
  borderSecondary: string;
  divider: string;
  
  // Input and form colors
  input: string;
  inputFocus: string;
  inputBorder: string;
  inputBorderFocus: string;
  
  // Button colors
  buttonPrimary: string;
  buttonPrimaryHover: string;
  buttonSecondary: string;
  buttonSecondaryHover: string;
  buttonDanger: string;
  buttonDangerHover: string;
  
  // Gradient colors
  gradientFrom: string;
  gradientTo: string;
  
  // Special purpose colors
  overlay: string;
  shadow: string;
  highlight: string;
}

// Dark theme (current default)
export const darkTheme: ThemeColors = {
  // Background colors
  background: "#111827", // bg-gray-900
  backgroundSecondary: "#1F2937", // bg-gray-800
  backgroundTertiary: "#374151", // bg-gray-700
  
  // Card and surface colors
  card: "#1F2937", // bg-gray-800
  cardSecondary: "#374151", // bg-gray-700
  cardHover: "#4B5563", // bg-gray-600
  
  // Text colors
  primaryText: "#FFFFFF", // text-white
  secondaryText: "#9CA3AF", // text-gray-400
  mutedText: "#6B7280", // text-gray-500
  inverseText: "#111827", // text-gray-900
  
  // Accent and brand colors
  primary: "#3B82F6", // blue-500
  primaryHover: "#2563EB", // blue-600
  secondary: "#60A5FA", // blue-400
  accent: "#60A5FA", // blue-400
  accentHover: "#3B82F6", // blue-500
  
  // Status colors
  success: "#22C55E", // green-500
  successHover: "#16A34A", // green-600
  warning: "#F59E0B", // amber-500
  warningHover: "#D97706", // amber-600
  error: "#EF4444", // red-500
  errorHover: "#DC2626", // red-600
  info: "#3B82F6", // blue-500
  infoHover: "#2563EB", // blue-600
  
  // Border and divider colors
  border: "#4B5563", // border-gray-600
  borderSecondary: "#6B7280", // border-gray-500
  divider: "#4B5563", // border-gray-600
  
  // Input and form colors
  input: "#374151", // bg-gray-700
  inputFocus: "#3B82F6", // border-blue-500
  inputBorder: "#6B7280", // border-gray-500
  inputBorderFocus: "#3B82F6", // border-blue-500
  
  // Button colors
  buttonPrimary: "#3B82F6", // bg-blue-500
  buttonPrimaryHover: "#2563EB", // bg-blue-600
  buttonSecondary: "#6B7280", // bg-gray-500
  buttonSecondaryHover: "#4B5563", // bg-gray-600
  buttonDanger: "#EF4444", // bg-red-500
  buttonDangerHover: "#DC2626", // bg-red-600
  
  // Gradient colors
  gradientFrom: "#3B82F6", // from-blue-500
  gradientTo: "#2563EB", // to-blue-600
  
  // Special purpose colors
  overlay: "rgba(0, 0, 0, 0.5)",
  shadow: "rgba(0, 0, 0, 0.1)",
  highlight: "#3B82F6", // blue-500
};

// Light theme (alternative)
export const lightTheme: ThemeColors = {
  // Background colors
  background: "#FFFFFF", // bg-white
  backgroundSecondary: "#F9FAFB", // bg-gray-50
  backgroundTertiary: "#F3F4F6", // bg-gray-100
  
  // Card and surface colors
  card: "#FFFFFF", // bg-white
  cardSecondary: "#F9FAFB", // bg-gray-50
  cardHover: "#F3F4F6", // bg-gray-100
  
  // Text colors
  primaryText: "#111827", // text-gray-900
  secondaryText: "#6B7280", // text-gray-500
  mutedText: "#9CA3AF", // text-gray-400
  inverseText: "#FFFFFF", // text-white
  
  // Accent and brand colors
  primary: "#3B82F6", // blue-500
  primaryHover: "#2563EB", // blue-600
  secondary: "#60A5FA", // blue-400
  accent: "#60A5FA", // blue-400
  accentHover: "#3B82F6", // blue-500
  
  // Status colors
  success: "#22C55E", // green-500
  successHover: "#16A34A", // green-600
  warning: "#F59E0B", // amber-500
  warningHover: "#D97706", // amber-600
  error: "#EF4444", // red-500
  errorHover: "#DC2626", // red-600
  info: "#3B82F6", // blue-500
  infoHover: "#2563EB", // blue-600
  
  // Border and divider colors
  border: "#E5E7EB", // border-gray-200
  borderSecondary: "#D1D5DB", // border-gray-300
  divider: "#E5E7EB", // border-gray-200
  
  // Input and form colors
  input: "#FFFFFF", // bg-white
  inputFocus: "#3B82F6", // border-blue-500
  inputBorder: "#D1D5DB", // border-gray-300
  inputBorderFocus: "#3B82F6", // border-blue-500
  
  // Button colors
  buttonPrimary: "#3B82F6", // bg-blue-500
  buttonPrimaryHover: "#2563EB", // bg-blue-600
  buttonSecondary: "#6B7280", // bg-gray-500
  buttonSecondaryHover: "#4B5563", // bg-gray-600
  buttonDanger: "#EF4444", // bg-red-500
  buttonDangerHover: "#DC2626", // bg-red-600
  
  // Gradient colors
  gradientFrom: "#3B82F6", // from-blue-500
  gradientTo: "#2563EB", // to-blue-600
  
  // Special purpose colors
  overlay: "rgba(0, 0, 0, 0.1)",
  shadow: "rgba(0, 0, 0, 0.05)",
  highlight: "#3B82F6", // blue-500
};

// Custom themes can be added here
export const customThemes = {
  dark: darkTheme,
  light: lightTheme,
  // Add more themes as needed
  // ocean: oceanTheme,
  // forest: forestTheme,
  // sunset: sunsetTheme,
};

// Default theme
export const defaultTheme = darkTheme;

// Theme type
export type ThemeType = keyof typeof customThemes;

// Helper function to get theme colors
export const getThemeColors = (themeType: ThemeType = 'dark'): ThemeColors => {
  return customThemes[themeType] || defaultTheme;
};

// Helper function to convert theme colors to CSS custom properties
export const themeToCSSVariables = (theme: ThemeColors): Record<string, string> => {
  return {
    '--color-background': theme.background,
    '--color-background-secondary': theme.backgroundSecondary,
    '--color-background-tertiary': theme.backgroundTertiary,
    '--color-card': theme.card,
    '--color-card-secondary': theme.cardSecondary,
    '--color-card-hover': theme.cardHover,
    '--color-primary-text': theme.primaryText,
    '--color-secondary-text': theme.secondaryText,
    '--color-muted-text': theme.mutedText,
    '--color-inverse-text': theme.inverseText,
    '--color-primary': theme.primary,
    '--color-primary-hover': theme.primaryHover,
    '--color-secondary': theme.secondary,
    '--color-accent': theme.accent,
    '--color-accent-hover': theme.accentHover,
    '--color-success': theme.success,
    '--color-success-hover': theme.successHover,
    '--color-warning': theme.warning,
    '--color-warning-hover': theme.warningHover,
    '--color-error': theme.error,
    '--color-error-hover': theme.errorHover,
    '--color-info': theme.info,
    '--color-info-hover': theme.infoHover,
    '--color-border': theme.border,
    '--color-border-secondary': theme.borderSecondary,
    '--color-divider': theme.divider,
    '--color-input': theme.input,
    '--color-input-focus': theme.inputFocus,
    '--color-input-border': theme.inputBorder,
    '--color-input-border-focus': theme.inputBorderFocus,
    '--color-button-primary': theme.buttonPrimary,
    '--color-button-primary-hover': theme.buttonPrimaryHover,
    '--color-button-secondary': theme.buttonSecondary,
    '--color-button-secondary-hover': theme.buttonSecondaryHover,
    '--color-button-danger': theme.buttonDanger,
    '--color-button-danger-hover': theme.buttonDangerHover,
    '--color-gradient-from': theme.gradientFrom,
    '--color-gradient-to': theme.gradientTo,
    '--color-overlay': theme.overlay,
    '--color-shadow': theme.shadow,
    '--color-highlight': theme.highlight,
  };
};
