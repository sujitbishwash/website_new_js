import React from "react";
import { useThemeColors } from "../contexts/ThemeContext";
import ThemeToggle from "./ThemeToggle";

const ThemeDemo: React.FC = () => {
  const theme = useThemeColors();

  return (
    <div
      className="p-8 min-h-screen"
      style={{ backgroundColor: theme.background }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1
              className="text-3xl font-bold"
              style={{ color: theme.primaryText }}
            >
              Theme System Demo
            </h1>
            <ThemeToggle size="lg" variant="button" />
          </div>
          <p className="text-lg" style={{ color: theme.secondaryText }}>
            This component demonstrates the centralized theme system with
            various UI elements.
          </p>
        </div>

        {/* Color Palette */}
        <div
          className="mb-8 p-6 rounded-lg border"
          style={{
            backgroundColor: theme.card,
            borderColor: theme.border,
          }}
        >
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: theme.primaryText }}
          >
            Color Palette
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Background Colors */}
            <div>
              <h3
                className="font-semibold mb-2"
                style={{ color: theme.primaryText }}
              >
                Backgrounds
              </h3>
              <div className="space-y-2">
                <div
                  className="h-8 rounded border"
                  style={{ backgroundColor: theme.background }}
                />
                <div
                  className="h-8 rounded border"
                  style={{ backgroundColor: theme.backgroundSecondary }}
                />
                <div
                  className="h-8 rounded border"
                  style={{ backgroundColor: theme.backgroundTertiary }}
                />
              </div>
            </div>

            {/* Text Colors */}
            <div>
              <h3
                className="font-semibold mb-2"
                style={{ color: theme.primaryText }}
              >
                Text Colors
              </h3>
              <div className="space-y-2">
                <div
                  className="h-8 rounded flex items-center px-2"
                  style={{
                    backgroundColor: theme.cardSecondary,
                    color: theme.primaryText,
                  }}
                >
                  Primary
                </div>
                <div
                  className="h-8 rounded flex items-center px-2"
                  style={{
                    backgroundColor: theme.cardSecondary,
                    color: theme.secondaryText,
                  }}
                >
                  Secondary
                </div>
                <div
                  className="h-8 rounded flex items-center px-2"
                  style={{
                    backgroundColor: theme.cardSecondary,
                    color: theme.mutedText,
                  }}
                >
                  Muted
                </div>
              </div>
            </div>

            {/* Status Colors */}
            <div>
              <h3
                className="font-semibold mb-2"
                style={{ color: theme.primaryText }}
              >
                Status Colors
              </h3>
              <div className="space-y-2">
                <div
                  className="h-8 rounded flex items-center px-2"
                  style={{
                    backgroundColor: theme.success,
                    color: theme.inverseText,
                  }}
                >
                  Success
                </div>
                <div
                  className="h-8 rounded flex items-center px-2"
                  style={{
                    backgroundColor: theme.warning,
                    color: theme.inverseText,
                  }}
                >
                  Warning
                </div>
                <div
                  className="h-8 rounded flex items-center px-2"
                  style={{
                    backgroundColor: theme.error,
                    color: theme.inverseText,
                  }}
                >
                  Error
                </div>
              </div>
            </div>

            {/* Accent Colors */}
            <div>
              <h3
                className="font-semibold mb-2"
                style={{ color: theme.primaryText }}
              >
                Accent Colors
              </h3>
              <div className="space-y-2">
                <div
                  className="h-8 rounded flex items-center px-2"
                  style={{
                    backgroundColor: theme.primary,
                    color: theme.inverseText,
                  }}
                >
                  Primary
                </div>
                <div
                  className="h-8 rounded flex items-center px-2"
                  style={{
                    backgroundColor: theme.secondary,
                    color: theme.inverseText,
                  }}
                >
                  Secondary
                </div>
                <div
                  className="h-8 rounded flex items-center px-2"
                  style={{
                    backgroundColor: theme.accent,
                    color: theme.inverseText,
                  }}
                >
                  Accent
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Elements */}
        <div
          className="mb-8 p-6 rounded-lg border"
          style={{
            backgroundColor: theme.card,
            borderColor: theme.border,
          }}
        >
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: theme.primaryText }}
          >
            Interactive Elements
          </h2>

          {/* Buttons */}
          <div className="mb-6">
            <h3
              className="font-semibold mb-3"
              style={{ color: theme.primaryText }}
            >
              Buttons
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                className="px-4 py-2 rounded-lg font-medium transition-colors"
                style={{
                  backgroundColor: theme.buttonPrimary,
                  color: theme.inverseText,
                }}
              >
                Primary Button
              </button>
              <button
                className="px-4 py-2 rounded-lg font-medium transition-colors"
                style={{
                  backgroundColor: theme.buttonSecondary,
                  color: theme.inverseText,
                }}
              >
                Secondary Button
              </button>
              <button
                className="px-4 py-2 rounded-lg font-medium transition-colors"
                style={{
                  backgroundColor: theme.buttonDanger,
                  color: theme.inverseText,
                }}
              >
                Danger Button
              </button>
            </div>
          </div>

          {/* Input Fields */}
          <div className="mb-6">
            <h3
              className="font-semibold mb-3"
              style={{ color: theme.primaryText }}
            >
              Input Fields
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter text here..."
                className="w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                style={
                  {
                    backgroundColor: theme.input,
                    borderColor: theme.inputBorder,
                    color: theme.primaryText,
                    "--tw-ring-color": theme.inputBorderFocus,
                  } as React.CSSProperties
                }
              />
              <textarea
                placeholder="Enter longer text here..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 resize-none"
                style={
                  {
                    backgroundColor: theme.input,
                    borderColor: theme.inputBorder,
                    color: theme.primaryText,
                    "--tw-ring-color": theme.inputBorderFocus,
                  } as React.CSSProperties
                }
              />
            </div>
          </div>

          {/* Cards */}
          <div>
            <h3
              className="font-semibold mb-3"
              style={{ color: theme.primaryText }}
            >
              Cards
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: theme.cardSecondary,
                  borderColor: theme.border,
                }}
              >
                <h4
                  className="font-semibold mb-2"
                  style={{ color: theme.primaryText }}
                >
                  Card Title
                </h4>
                <p className="text-sm" style={{ color: theme.secondaryText }}>
                  This is a sample card with theme colors applied.
                </p>
              </div>
              <div
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: theme.cardSecondary,
                  borderColor: theme.border,
                }}
              >
                <h4
                  className="font-semibold mb-2"
                  style={{ color: theme.primaryText }}
                >
                  Another Card
                </h4>
                <p className="text-sm" style={{ color: theme.secondaryText }}>
                  All cards use consistent theme colors.
                </p>
              </div>
              <div
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: theme.cardSecondary,
                  borderColor: theme.border,
                }}
              >
                <h4
                  className="font-semibold mb-2"
                  style={{ color: theme.primaryText }}
                >
                  Third Card
                </h4>
                <p className="text-sm" style={{ color: theme.secondaryText }}>
                  Easy to maintain and customize.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gradient Example */}
        <div
          className="p-6 rounded-lg border"
          style={{
            backgroundColor: theme.card,
            borderColor: theme.border,
          }}
        >
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: theme.primaryText }}
          >
            Gradient Example
          </h2>
          <div
            className="h-32 rounded-lg flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${theme.gradientFrom} 0%, ${theme.gradientTo} 100%)`,
              color: theme.inverseText,
            }}
          >
            <span className="text-xl font-semibold">Gradient Background</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeDemo;
