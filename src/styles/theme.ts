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
export const palettes: Record<string, ThemeColors> = {
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
};

export type ColorThemeName = keyof typeof palettes;

export const getAvailableColorThemes = (): ColorThemeName[] =>
    Object.keys(palettes) as ColorThemeName[];

export const applyColorTheme = (name: ColorThemeName) => {
    const palette = palettes[name] || palettes.slate;
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");

    // Derive light/dark variants to ensure clear contrast differences
    const p: ThemeColors = isDark
        ? palette
        : {
            // Light mode overrides for professional contrast
            background: "#FFFFFF",
            cardBackground: "#FFFFFF",
            inputBackground: "#F3F4F6",
            primaryText: "#0F172A",
            secondaryText: "#475569",
            mutedText: "#64748B",
            // keep accent family from selected palette for brand feel
            accent: palette.accent,
            accentLight: palette.accentLight,
            buttonGradientFrom: palette.buttonGradientFrom,
            buttonGradientTo: palette.buttonGradientTo,
            divider: "#E5E7EB",
            green: "#16A34A",
            yellow: "#CA8A04",
            red: "#DC2626",
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



