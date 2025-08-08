# Centralized Theme System

## Overview

The centralized theme system provides a consistent and maintainable way to manage colors and styling across the entire application. It allows for easy theme switching, customization, and ensures visual consistency without hardcoded colors.

## Architecture

### 1. Theme Configuration (`src/lib/theme.ts`)

The core theme configuration file contains:

- **ThemeColors Interface**: Defines all available color properties
- **Theme Objects**: Pre-defined themes (dark, light, etc.)
- **Helper Functions**: Utilities for theme management

### 2. Theme Context (`src/contexts/ThemeContext.tsx`)

Provides React context for theme management:

- **ThemeProvider**: Wraps the application and provides theme state
- **useTheme Hook**: Access theme state and functions
- **useThemeColors Hook**: Direct access to theme colors

### 3. CSS Variables (`src/index.css`)

CSS custom properties for theme colors:

- **Root Variables**: Default theme colors
- **Theme Classes**: `.light`, `.dark` for theme switching
- **Legacy Support**: Backward compatibility with existing CSS

## Usage

### Basic Usage in Components

```tsx
import { useThemeColors } from "../contexts/ThemeContext";

const MyComponent = () => {
  const theme = useThemeColors();

  return (
    <div
      style={{
        backgroundColor: theme.background,
        color: theme.primaryText,
      }}
    >
      <h1 style={{ color: theme.primaryText }}>Title</h1>
      <p style={{ color: theme.secondaryText }}>Description</p>
      <button
        style={{
          backgroundColor: theme.buttonPrimary,
          color: theme.inverseText,
        }}
      >
        Click me
      </button>
    </div>
  );
};
```

### Theme Toggle Component

```tsx
import ThemeToggle from '../components/ThemeToggle';

// Icon only toggle
<ThemeToggle size="sm" variant="icon" />

// Button with text
<ThemeToggle size="md" variant="button" />

// Text only toggle
<ThemeToggle variant="text" />
```

### Theme Switching

```tsx
import { useTheme } from "../contexts/ThemeContext";

const ThemeSwitcher = () => {
  const { themeType, setTheme, toggleTheme } = useTheme();

  return (
    <div>
      <button onClick={() => setTheme("dark")}>Dark</button>
      <button onClick={() => setTheme("light")}>Light</button>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
};
```

## Available Theme Properties

### Background Colors

- `background`: Main page background
- `backgroundSecondary`: Secondary background (cards, sections)
- `backgroundTertiary`: Tertiary background (inputs, buttons)

### Text Colors

- `primaryText`: Main text color
- `secondaryText`: Secondary text color
- `mutedText`: Muted/disabled text color
- `inverseText`: Text for dark backgrounds

### Accent Colors

- `primary`: Primary brand color
- `primaryHover`: Primary color on hover
- `secondary`: Secondary brand color
- `accent`: Accent color
- `accentHover`: Accent color on hover

### Status Colors

- `success`: Success/positive actions
- `successHover`: Success color on hover
- `warning`: Warning/caution actions
- `warningHover`: Warning color on hover
- `error`: Error/negative actions
- `errorHover`: Error color on hover
- `info`: Informational actions
- `infoHover`: Info color on hover

### Border Colors

- `border`: Primary border color
- `borderSecondary`: Secondary border color
- `divider`: Divider/separator color

### Input Colors

- `input`: Input background color
- `inputFocus`: Input focus color
- `inputBorder`: Input border color
- `inputBorderFocus`: Input border focus color

### Button Colors

- `buttonPrimary`: Primary button background
- `buttonPrimaryHover`: Primary button hover
- `buttonSecondary`: Secondary button background
- `buttonSecondaryHover`: Secondary button hover
- `buttonDanger`: Danger button background
- `buttonDangerHover`: Danger button hover

### Special Colors

- `gradientFrom`: Gradient start color
- `gradientTo`: Gradient end color
- `overlay`: Modal/overlay background
- `shadow`: Shadow color
- `highlight`: Highlight color

## Creating Custom Themes

### 1. Define Theme Colors

```tsx
// src/lib/theme.ts
export const oceanTheme: ThemeColors = {
  background: "#0F172A",
  backgroundSecondary: "#1E293B",
  backgroundTertiary: "#334155",
  card: "#1E293B",
  cardSecondary: "#334155",
  cardHover: "#475569",
  primaryText: "#F1F5F9",
  secondaryText: "#94A3B8",
  mutedText: "#64748B",
  inverseText: "#0F172A",
  primary: "#0EA5E9", // Ocean blue
  primaryHover: "#0284C7",
  secondary: "#38BDF8",
  accent: "#38BDF8",
  accentHover: "#0EA5E9",
  success: "#10B981",
  successHover: "#059669",
  warning: "#F59E0B",
  warningHover: "#D97706",
  error: "#EF4444",
  errorHover: "#DC2626",
  info: "#0EA5E9",
  infoHover: "#0284C7",
  border: "#334155",
  borderSecondary: "#475569",
  divider: "#334155",
  input: "#334155",
  inputFocus: "#0EA5E9",
  inputBorder: "#475569",
  inputBorderFocus: "#0EA5E9",
  buttonPrimary: "#0EA5E9",
  buttonPrimaryHover: "#0284C7",
  buttonSecondary: "#475569",
  buttonSecondaryHover: "#334155",
  buttonDanger: "#EF4444",
  buttonDangerHover: "#DC2626",
  gradientFrom: "#0EA5E9",
  gradientTo: "#0284C7",
  overlay: "rgba(15, 23, 42, 0.5)",
  shadow: "rgba(15, 23, 42, 0.1)",
  highlight: "#0EA5E9",
};
```

### 2. Add to Custom Themes

```tsx
export const customThemes = {
  dark: darkTheme,
  light: lightTheme,
  ocean: oceanTheme, // Add your custom theme
};
```

### 3. Update TypeScript Types

```tsx
export type ThemeType = keyof typeof customThemes;
```

## Best Practices

### 1. Use Theme Colors Consistently

✅ **Good**

```tsx
const theme = useThemeColors();
return (
  <div style={{ backgroundColor: theme.background }}>
    <h1 style={{ color: theme.primaryText }}>Title</h1>
  </div>
);
```

❌ **Avoid**

```tsx
return (
  <div style={{ backgroundColor: "#111827" }}>
    <h1 style={{ color: "#FFFFFF" }}>Title</h1>
  </div>
);
```

### 2. Use Semantic Color Names

✅ **Good**

```tsx
style={{ color: theme.success }} // For success states
style={{ color: theme.error }}   // For error states
style={{ color: theme.warning }} // For warning states
```

❌ **Avoid**

```tsx
style={{ color: '#22C55E' }} // Hardcoded green
style={{ color: '#EF4444' }} // Hardcoded red
```

### 3. Use Opacity for Transparency

```tsx
// Use opacity for semi-transparent backgrounds
style={{ backgroundColor: `${theme.card}80` }} // 50% opacity
style={{ backgroundColor: `${theme.card}40` }} // 25% opacity
```

### 4. Maintain Accessibility

```tsx
// Ensure sufficient contrast ratios
const theme = useThemeColors();
const textColor =
  theme.background === "#FFFFFF" ? theme.primaryText : theme.inverseText;
```

## Migration Guide

### From Hardcoded Colors

1. **Replace hardcoded hex values**:

   ```tsx
   // Before
   style={{ backgroundColor: '#1F2937' }}

   // After
   const theme = useThemeColors();
   style={{ backgroundColor: theme.backgroundSecondary }}
   ```

2. **Replace Tailwind color classes**:

   ```tsx
   // Before
   className="bg-gray-800 text-white"

   // After
   const theme = useThemeColors();
   style={{
     backgroundColor: theme.backgroundSecondary,
     color: theme.primaryText
   }}
   ```

3. **Update CSS variables**:

   ```css
   /* Before */
   .my-component {
     background-color: #1f2937;
     color: #ffffff;
   }

   /* After */
   .my-component {
     background-color: var(--color-background-secondary);
     color: var(--color-primary-text);
   }
   ```

## Testing Themes

### Visual Testing

1. Test both light and dark themes
2. Verify contrast ratios meet accessibility standards
3. Check hover and focus states
4. Test with different content types

### Automated Testing

```tsx
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "../contexts/ThemeContext";

test("component uses theme colors", () => {
  render(
    <ThemeProvider defaultTheme="dark">
      <MyComponent />
    </ThemeProvider>
  );

  const element = screen.getByText("Test");
  expect(element).toHaveStyle({ color: "#FFFFFF" });
});
```

## Troubleshooting

### Common Issues

1. **Theme not updating**: Ensure component is wrapped in ThemeProvider
2. **Colors not applying**: Check CSS variable names match theme properties
3. **TypeScript errors**: Verify ThemeColors interface includes all used properties

### Debug Mode

```tsx
const theme = useThemeColors();
console.log("Current theme:", theme);
console.log("Theme type:", themeType);
```

## Future Enhancements

1. **Theme Presets**: Pre-built theme collections
2. **Custom Theme Builder**: UI for creating themes
3. **Theme Export/Import**: Save and share custom themes
4. **System Theme Detection**: Auto-detect OS theme preference
5. **Animation Support**: Smooth theme transitions
6. **Component Library Integration**: Theme-aware component library

## Contributing

When adding new colors or themes:

1. Update the `ThemeColors` interface
2. Add colors to all theme objects
3. Update CSS variables
4. Add documentation
5. Include tests
6. Update migration guide if needed
