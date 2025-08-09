export interface ThemeColors {
    background: string;
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
    green: string;
    yellow: string;
    red: string;
}

// Use CSS variables so inline styles react instantly to palette changes
const v = (name: string) => `var(--ap-${name})`;

export const theme: ThemeColors = {
    background: v("background"),
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
    green: v("green"),
    yellow: v("yellow"),
    red: v("red"),
};

// Available color palettes
export type ColorThemeName =
    | "slate" // default (current app look)
    | "ocean" // blue/cyan
    | "forest" // green/teal
    | "rose" // pink/red
    | "amber"; // warm yellow/orange

const palettes: Record<ColorThemeName, ThemeColors> = {
    slate: {
        background: "#111827",
        cardBackground: "#1F2937",
        inputBackground: "#374151",
        primaryText: "#FFFFFF",
        secondaryText: "#9CA3AF",
        mutedText: "#6B7280",
        accent: "#60A5FA",
        accentLight: "rgba(96, 165, 250, 0.1)",
        buttonGradientFrom: "#3B82F6",
        buttonGradientTo: "#2563EB",
        divider: "#4B5563",
        green: "#34D399",
        yellow: "#FBBF24",
        red: "#F87171",
    },
    ocean: {
        background: "#0B1220",
        cardBackground: "#0F172A",
        inputBackground: "#1E293B",
        primaryText: "#E2E8F0",
        secondaryText: "#94A3B8",
        mutedText: "#64748B",
        accent: "#22D3EE",
        accentLight: "rgba(34, 211, 238, 0.12)",
        buttonGradientFrom: "#06B6D4",
        buttonGradientTo: "#0284C7",
        divider: "#334155",
        green: "#10B981",
        yellow: "#F59E0B",
        red: "#EF4444",
    },
    forest: {
        background: "#0B1410",
        cardBackground: "#102117",
        inputBackground: "#1B2B22",
        primaryText: "#E6F2EA",
        secondaryText: "#A7D7BF",
        mutedText: "#6BA68A",
        accent: "#34D399",
        accentLight: "rgba(52, 211, 153, 0.12)",
        buttonGradientFrom: "#10B981",
        buttonGradientTo: "#059669",
        divider: "#335445",
        green: "#22C55E",
        yellow: "#EAB308",
        red: "#DC2626",
    },
    rose: {
        background: "#1A0E14",
        cardBackground: "#2A0F1F",
        inputBackground: "#3B102A",
        primaryText: "#F5E9F0",
        secondaryText: "#F0A7C3",
        mutedText: "#E879F9",
        accent: "#FB7185",
        accentLight: "rgba(251, 113, 133, 0.12)",
        buttonGradientFrom: "#F43F5E",
        buttonGradientTo: "#E11D48",
        divider: "#6B1F3B",
        green: "#86EFAC",
        yellow: "#FDE047",
        red: "#FB7185",
    },
    amber: {
        background: "#16120A",
        cardBackground: "#1F170B",
        inputBackground: "#2A1E0E",
        primaryText: "#FFF7ED",
        secondaryText: "#FED7AA",
        mutedText: "#D97706",
        accent: "#F59E0B",
        accentLight: "rgba(245, 158, 11, 0.12)",
        buttonGradientFrom: "#F59E0B",
        buttonGradientTo: "#D97706",
        divider: "#4B2E0F",
        green: "#84CC16",
        yellow: "#FACC15",
        red: "#F87171",
    },
};

export const getAvailableColorThemes = (): ColorThemeName[] =>
    Object.keys(palettes) as ColorThemeName[];

export const applyColorTheme = (name: ColorThemeName) => {
    const p = palettes[name] || palettes.slate;
    const root = document.documentElement;
    const set = (key: keyof ThemeColors, value: string) =>
        root.style.setProperty(`--ap-${key}`, value);
    (Object.keys(p) as (keyof ThemeColors)[]).forEach((k) => set(k, p[k]));
};



