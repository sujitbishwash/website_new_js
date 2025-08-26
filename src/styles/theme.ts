export interface ThemeColors {
  background: string;
  backgroundSubtle: string; // New subtle background color
  cardBackground: string;
  inputBackground: string;
  primaryText: string;
  secondaryText: string;
  mutedText: string;
  accent: string;
  accentLight: string;
  buttonGradientFrom: string;
  buttonGradientTo: string;
  divider: string;
  dividerMedium: string;
  dividerHigh: string;
  green: string;
  yellow: string;
  red: string;
}

// Use CSS variables so inline styles react instantly to palette changes
const v = (name: string) => `var(--ap-${name})`;

export const theme: ThemeColors = {
  background: v("background"),
  backgroundSubtle: v("backgroundSubtle"), // Added new color
  cardBackground: v("cardBackground"),
  inputBackground: v("inputBackground"),
  primaryText: v("primaryText"),
  secondaryText: v("secondaryText"),
  mutedText: v("mutedText"),
  accent: v("accent"),
  accentLight: v("accentLight"),
  buttonGradientFrom: v("buttonGradientFrom"),
  buttonGradientTo: v("buttonGradientTo"),
  divider: v("divider"),
  dividerMedium: v("divider"),
  dividerHigh: v("divider"),
  green: v("green"),
  yellow: v("yellow"),
  red: v("red"),
};

// Available color palettes
export const palettes: Record<string, ThemeColors> = {
  default: {
    background: "#1d1d1f",
    backgroundSubtle: "#232325", // A bit lighter than background
    cardBackground: "#2c2c2e",
    inputBackground: "#3a3a3c",
    primaryText: "#FFFFFF",
    secondaryText: "#8e8e93",
    mutedText: "#636366",
    accent: "#0A84FF",
    accentLight: "rgba(10, 132, 255, 0.10)",
    buttonGradientFrom: "#007AFF",
    buttonGradientTo: "#0A84FF",
    divider: "#38383A",
    dividerMedium: "#2C2C2E",
    dividerHigh: "#1F1F20",
    green: "#34C759",
    yellow: "#FFCC00",
    red: "#FF3B30",
  },
  ocean: {
    background: "#0B1220",
    backgroundSubtle: "#101828", // A bit lighter than background
    cardBackground: "#0F172A",
    inputBackground: "#1E293B",
    primaryText: "#E2E8F0",
    secondaryText: "#94A3B8",
    mutedText: "#64748B",
    accent: "#1CA7B8",
    accentLight: "rgba(28, 167, 184, 0.10)",
    buttonGradientFrom: "#06B6D4",
    buttonGradientTo: "#0284C7",
    divider: "#334155",
    dividerMedium: "#2C2C2E",
    dividerHigh: "#1F1F20",
    green: "#10B981",
    yellow: "#F59E0B",
    red: "#EF4444",
  },
  forest: {
    background: "#0B1410",
    backgroundSubtle: "#111A16", // A bit lighter than background
    cardBackground: "#102117",
    inputBackground: "#1B2B22",
    primaryText: "#E6F2EA",
    secondaryText: "#A7D7BF",
    mutedText: "#6BA68A",
    accent: "#2DAA80",
    accentLight: "rgba(45, 170, 128, 0.10)",
    buttonGradientFrom: "#10B981",
    buttonGradientTo: "#059669",
    divider: "#335445",
    dividerMedium: "#2C2C2E",
    dividerHigh: "#1F1F20",
    green: "#22C55E",
    yellow: "#EAB308",
    red: "#DC2626",
  },
  sunset: {
    background: "#181212",
    backgroundSubtle: "#1F1919", // A bit lighter than background
    cardBackground: "#1F1616",
    inputBackground: "#2A1D1D",
    primaryText: "#F4EDEB",
    secondaryText: "#D9C5C2",
    mutedText: "#A89895",
    accent: "#C36B53",
    accentLight: "rgba(195, 107, 83, 0.07)",
    buttonGradientFrom: "#D87B63",
    buttonGradientTo: "#C16550",
    divider: "#3A2B2B",
    dividerMedium: "#2C2C2E",
    dividerHigh: "#1F1F20",
    green: "#7FB77E",
    yellow: "#E3B261",
    red: "#D97A7A",
  },
  lavender: {
    background: "#161320",
    backgroundSubtle: "#1C1926", // A bit lighter than background
    cardBackground: "#1E192B",
    inputBackground: "#2A243A",
    primaryText: "#EDEBFA",
    secondaryText: "#C8C5E2",
    mutedText: "#A09DB9",
    accent: "#857AA3",
    accentLight: "rgba(133, 122, 163, 0.07)",
    buttonGradientFrom: "#A49AC4",
    buttonGradientTo: "#8C82AE",
    divider: "#3B3550",
    dividerMedium: "#2C2C2E",
    dividerHigh: "#1F1F20",
    green: "#7CA982",
    yellow: "#D6B36B",
    red: "#C98080",
  },
  rose: {
    background: "#191417",
    backgroundSubtle: "#201A1D", // A bit lighter than background
    cardBackground: "#221B1F",
    inputBackground: "#2E2329",
    primaryText: "#FAF1F3",
    secondaryText: "#E1D0D6",
    mutedText: "#A89DA2",
    accent: "#B36F83",
    accentLight: "rgba(179, 111, 131, 0.07)",
    buttonGradientFrom: "#C98A9E",
    buttonGradientTo: "#B17285",
    divider: "#3E3138",
    dividerMedium: "#2C2C2E",
    dividerHigh: "#1F1F20",
    green: "#7DAE88",
    yellow: "#D6B36B",
    red: "#C98080",
  },
  amber: {
    background: "#1B1711",
    backgroundSubtle: "#221D17", // A bit lighter than background
    cardBackground: "#241F18",
    inputBackground: "#322A21",
    primaryText: "#FAF5EB",
    secondaryText: "#E4DACB",
    mutedText: "#B3A692",
    accent: "#AD8A4E",
    accentLight: "rgba(173, 138, 78, 0.07)",
    buttonGradientFrom: "#CBAE74",
    buttonGradientTo: "#B8955F",
    divider: "#463C2F",
    dividerMedium: "#2C2C2E",
    dividerHigh: "#1F1F20",
    green: "#7CA982",
    yellow: "#D6B36B",
    red: "#C98080",
  },
};

export type ColorThemeName = keyof typeof palettes;

export const getAvailableColorThemes = (): ColorThemeName[] =>
  Object.keys(palettes) as ColorThemeName[];

export const applyColorTheme = (name: ColorThemeName) => {
  const palette = palettes[name] || palettes.default;
  const root = document.documentElement;
  const isDark = root.classList.contains("dark");

  // Derive light/dark variants to ensure clear contrast differences
  const p: ThemeColors = isDark
    ? {
        // Dark mode overrides
        background: "#1d1d1f",
        backgroundSubtle: "#232325", // Subtle dark variant
        cardBackground: "#2c2c2e",
        inputBackground: "#3a3a3c",
        primaryText: "#FFFFFF",
        secondaryText: "#8e8e93",
        mutedText: "#636366",
        accent: palette.accent,
        accentLight: palette.accentLight,
        buttonGradientFrom: palette.buttonGradientFrom,
        buttonGradientTo: palette.buttonGradientTo,
        divider: "#38383A",
        dividerMedium: "#505053",
        dividerHigh: "#6A6A6D",
        green: "#34C759",
        yellow: "#FFCC00",
        red: "#FF3B30",
      }
    : {
        // Light mode overrides
        background: "#F4F6F8",
        backgroundSubtle: "#FBFCFD", // Subtle light variant
        cardBackground: "#FFFFFF",
        inputBackground: "#E9EEF3",
        primaryText: "#1E293B",
        secondaryText: "#4B5563",
        mutedText: "#6B7280",
        accent: palette.accent,
        accentLight: palette.accentLight,
        buttonGradientFrom: palette.buttonGradientFrom,
        buttonGradientTo: palette.buttonGradientTo,
        divider: "#CBD5E1",
        dividerMedium: "#94A3B8",
        dividerHigh: "#64748B",
        green: "#22B573",
        yellow: "#E2B23A",
        red: "#E45858",
      };

  const set = (key: keyof ThemeColors, value: string) =>
    root.style.setProperty(`--ap-${key}`, value);
  (Object.keys(p) as (keyof ThemeColors)[]).forEach((k) => set(k, p[k]));

  // Sync Tailwind CSS token variables for cohesive look across the app
  const setUI = (varName: string, value: string) =>
    root.style.setProperty(varName, value);

  // Base surfaces and text
  setUI("--background", p.background);
  setUI("--foreground", p.primaryText);
  setUI("--card", p.cardBackground);
  setUI("--card-foreground", p.primaryText);
  // Custoom
  setUI("--background-subtle", p.backgroundSubtle);
  // Primary & accent
  setUI("--primary", p.accent);
  setUI("--primary-foreground", p.primaryText);
  setUI("--accent", p.accentLight);
  setUI("--accent-foreground", p.primaryText);
  // Secondary & muted
  setUI("--secondary", p.inputBackground);
  setUI("--secondary-foreground", p.primaryText);
  setUI("--muted", p.inputBackground);
  setUI("--muted-foreground", p.secondaryText);
  // Borders/inputs/ring
  setUI("--border", p.divider);
  setUI("--border-medium", p.dividerMedium);
  setUI("--border-high", p.dividerHigh);
  setUI("--input", p.inputBackground);
  setUI("--ring", p.accent);
  // Sidebar tokens (align with card scheme)
  setUI("--sidebar", p.cardBackground);
  setUI("--sidebar-foreground", p.primaryText);
  setUI("--sidebar-primary", p.accent);
  setUI("--sidebar-primary-foreground", p.primaryText);
  setUI("--sidebar-accent", p.accentLight);
  setUI("--sidebar-accent-foreground", p.primaryText);
  setUI("--sidebar-border", p.divider);
  setUI("--sidebar-ring", p.accent);
};