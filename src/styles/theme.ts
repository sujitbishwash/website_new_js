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
    sunset: {
        background: "#181212",
        cardBackground: "#1F1616",
        inputBackground: "#2A1D1D",
        primaryText: "#F4EDEB",
        secondaryText: "#D9C5C2",
        mutedText: "#A89895",
        accent: "#E07A5F",
        accentLight: "rgba(224, 122, 95, 0.08)",
        buttonGradientFrom: "#D87B63",
        buttonGradientTo: "#C16550",
        divider: "#3A2B2B",
        green: "#7FB77E",
        yellow: "#E3B261",
        red: "#D97A7A",
    },

    lavender: {
        background: "#161320",
        cardBackground: "#1E192B",
        inputBackground: "#2A243A",
        primaryText: "#EDEBFA",
        secondaryText: "#C8C5E2",
        mutedText: "#A09DB9",
        accent: "#9A8FBF",
        accentLight: "rgba(154, 143, 191, 0.08)",
        buttonGradientFrom: "#A49AC4",
        buttonGradientTo: "#8C82AE",
        divider: "#3B3550",
        green: "#7CA982",
        yellow: "#D6B36B",
        red: "#C98080",
    },

    rose: {
        background: "#191417",
        cardBackground: "#221B1F",
        inputBackground: "#2E2329",
        primaryText: "#FAF1F3",
        secondaryText: "#E1D0D6",
        mutedText: "#A89DA2",
        accent: "#C87D93",
        accentLight: "rgba(200, 125, 147, 0.08)",
        buttonGradientFrom: "#C98A9E",
        buttonGradientTo: "#B17285",
        divider: "#3E3138",
        green: "#7DAE88",
        yellow: "#D6B36B",
        red: "#C98080",
    },

    amber: {
        background: "#1B1711",
        cardBackground: "#241F18",
        inputBackground: "#322A21",
        primaryText: "#FAF5EB",
        secondaryText: "#E4DACB",
        mutedText: "#B3A692",
        accent: "#C8A15A",
        accentLight: "rgba(200, 161, 90, 0.08)",
        buttonGradientFrom: "#CBAE74",
        buttonGradientTo: "#B8955F",
        divider: "#463C2F",
        green: "#7CA982",
        yellow: "#D6B36B",
        red: "#C98080",
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
            background: "#F4F6F8",   // light gray-blue page background
            cardBackground: "#FFFFFF", // bright white for elevated elements
            inputBackground: "#E9EEF3", // noticeably darker than background for strong field distinction

            primaryText: "#1E293B",       // dark slate for better readability
            secondaryText: "#4B5563",     // neutral gray for subtitles
            mutedText: "#6B7280",         // softer gray for hints
            // keep accent family from selected palette for brand feel
            accent: palette.accent,
            accentLight: palette.accentLight,
            buttonGradientFrom: palette.buttonGradientFrom,
            buttonGradientTo: palette.buttonGradientTo,
            divider: "#E2E8F0",           // light gray, less harsh than pure gray-200
            green: "#22B573",             // balanced success tone
            yellow: "#E2B23A",            // warm but not neon
            red: "#E45858"                 // calm error red
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



