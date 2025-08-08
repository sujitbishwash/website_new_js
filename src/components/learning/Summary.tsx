import React, { useEffect, useState } from "react";

// Centralized theme colors for easy customization
const theme = {
  background: "#111827",
  cardBackground: "#1F2937",
  inputBackground: "#374151",
  primaryText: "#FFFFFF",
  secondaryText: "#9CA3AF",
  mutedText: "#6B7280",
  accent: "#60A5FA",
  divider: "#4B5563",
};

// --- TYPE DEFINITIONS (TypeScript) ---
type SummaryLength = "small" | "medium" | "long";

interface SummaryPoint {
  id: string;
  text: string;
  subPoints?: SummaryPoint[];
}

interface SummarySectionData {
  id: string;
  title: string;
  points: SummaryPoint[];
}

// --- DYNAMIC DEMO DATA (for different lengths) ---
const longSummaryData: SummarySectionData[] = [
  {
    id: "intro",
    title: "The Future of Renewable Energy: A 2025 Outlook",
    points: [
      {
        id: "d_p1",
        text: "This video provides a comprehensive analysis of the renewable energy sector, focusing on key trends, technological advancements, and future projections.",
      },
      {
        id: "d_p2",
        text: "The global shift towards sustainability is accelerating, driven by both policy changes and consumer demand.",
      },
    ],
  },
  {
    id: "solar",
    title: "Key Innovations in Solar Power",
    points: [
      {
        id: "d_p3",
        text: "Perovskite solar cells are emerging as a high-efficiency, low-cost alternative to traditional silicon-based panels.",
        subPoints: [
          {
            id: "d_sp1",
            text: "They have achieved efficiency rates over 25% in lab settings.",
          },
          {
            id: "d_sp2",
            text: "Challenges remain in long-term stability and large-scale manufacturing.",
          },
        ],
      },
      {
        id: "d_p4",
        text: "Bifacial solar panels, which capture light from both sides, are increasing energy yield by up to 30% in optimal conditions.",
      },
    ],
  },
  {
    id: "wind",
    title: "The Rise of Wind Energy",
    points: [
      {
        id: "d_p5",
        text: "Offshore wind farms are becoming larger and more powerful, with turbine capacities now exceeding 15 MW.",
      },
      {
        id: "d_p6",
        text: "Floating wind turbines are opening up new deep-water areas for energy generation that were previously inaccessible.",
      },
    ],
  },
  {
    id: "challenges",
    title: "Challenges and Future Outlook",
    points: [
      {
        id: "d_p7",
        text: "Energy storage remains the most significant hurdle. Advances in battery technology, like solid-state batteries, are critical.",
      },
      {
        id: "d_p8",
        text: "Grid modernization is necessary to handle the intermittent nature of renewable sources and ensure a stable power supply.",
      },
    ],
  },
];

const mediumSummaryData: SummarySectionData[] = [
  longSummaryData[0], // Intro
  longSummaryData[1], // Solar
];

const smallSummaryData: SummarySectionData[] = [
  longSummaryData[0], // Intro
];

// --- SVG ICON ---
const SourceIcon = () => (
  <span
    style={{
      color: theme.mutedText,
      backgroundColor: "#2d3748",
      borderRadius: "50%",
      width: "18px",
      height: "18px",
      display: "inline-flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "12px",
      marginLeft: "8px",
      cursor: "pointer",
    }}
  >
    S
  </span>
);

// --- MODULAR COMPONENTS ---

const SummaryPointItem: React.FC<{ point: SummaryPoint }> = ({ point }) => (
  <li className="mb-2">
    <div className="flex items-start">
      <span
        className="mr-3 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
        style={{ backgroundColor: theme.accent }}
      ></span>
      <p style={{ color: theme.secondaryText }}>
        {point.text}
        <SourceIcon />
      </p>
    </div>
    {point.subPoints && (
      <ul
        className="ml-6 mt-2 list-none pl-4 border-l"
        style={{ borderColor: theme.divider }}
      >
        {point.subPoints.map((subPoint) => (
          <li key={subPoint.id} className="mb-2">
            <div className="flex items-start">
              <span
                className="mr-3 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                style={{ backgroundColor: theme.mutedText }}
              ></span>
              <p style={{ color: theme.secondaryText }}>
                {subPoint.text}
                <SourceIcon />
              </p>
            </div>
          </li>
        ))}
      </ul>
    )}
  </li>
);

const SummarySection: React.FC<{ section: SummarySectionData }> = ({
  section,
}) => (
  <div className="mb-8">
    <h2
      className="text-2xl font-bold mb-4"
      style={{ color: theme.primaryText }}
    >
      {section.title}
    </h2>
    <ul className="list-none p-0">
      {section.points.map((point) => (
        <SummaryPointItem key={point.id} point={point} />
      ))}
    </ul>
  </div>
);

// Updated header with a dropdown selector
const SummaryHeader: React.FC<{
  activeLength: SummaryLength;
  onLengthChange: (length: SummaryLength) => void;
}> = ({ activeLength, onLengthChange }) => {
  const lengths: SummaryLength[] = ["small", "medium", "long"];

  return (
    <div className="flex justify-center items-center mb-8">
      <div className="relative">
        <select
          value={activeLength}
          onChange={(e) => onLengthChange(e.target.value as SummaryLength)}
          className="appearance-none px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 capitalize w-48 text-center"
          style={{
            backgroundColor: theme.inputBackground,
            color: theme.primaryText,
            border: `1px solid ${theme.divider}`,
            cursor: "pointer",
          }}
        >
          {lengths.map((length) => (
            <option
              key={length}
              value={length}
              style={{
                backgroundColor: theme.inputBackground,
                color: theme.primaryText,
              }}
            >
              {length.charAt(0).toUpperCase() + length.slice(1)} Summary
            </option>
          ))}
        </select>
        <div
          className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3"
          style={{ color: theme.secondaryText }}
        >
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-10">
    <div
      className="w-16 h-16 border-4 border-dashed rounded-full animate-spin"
      style={{ borderColor: `${theme.accent} transparent` }}
    ></div>
    <p className="ml-4 text-lg" style={{ color: theme.primaryText }}>
      Loading Summary...
    </p>
  </div>
);

// --- MAIN APP COMPONENT ---

export default function Summary() {
  const [summaryData, setSummaryData] = useState<SummarySectionData[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [summaryLength, setSummaryLength] = useState<SummaryLength>("long");

  useEffect(() => {
    const fetchSummaryData = () => {
      setIsLoading(true);
      setError(null);

      setTimeout(() => {
        try {
          // In a real app, you'd fetch based on the length:
          // `https://api.example.com/summary?length=${summaryLength}`
          switch (summaryLength) {
            case "small":
              setSummaryData(smallSummaryData);
              break;
            case "medium":
              setSummaryData(mediumSummaryData);
              break;
            case "long":
              setSummaryData(longSummaryData);
              break;
            default:
              setSummaryData(longSummaryData);
          }
        } catch (err) {
          setError("Failed to fetch summary. Please try again later.");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }, 1000); // Shortened delay
    };

    fetchSummaryData();
  }, [summaryLength]); // Re-run the effect when summaryLength changes

  const renderContent = () => {
    if (isLoading) return <LoadingSpinner />;
    if (error)
      return (
        <p className="text-center" style={{ color: theme.accent }}>
          {error}
        </p>
      );
    if (summaryData)
      return summaryData.map((section) => (
        <SummarySection key={section.id} section={section} />
      ));
    return null;
  };

  return (
    <div className="w-full h-full font-sans">
      <div className="max-w-4xl mx-auto">
        <main
          className="rounded-xl p-6 sm:p-8"
          style={{ backgroundColor: theme.cardBackground }}
        >
          <SummaryHeader
            activeLength={summaryLength}
            onLengthChange={setSummaryLength}
          />
          <div
            className="border-t my-6"
            style={{ borderColor: theme.divider }}
          ></div>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
