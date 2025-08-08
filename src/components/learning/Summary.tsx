import { useEffect, useState } from "react";
import { useThemeColors } from "../../contexts/ThemeContext";

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
const SourceIcon = () => {
  const theme = useThemeColors();

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={theme.accent}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" />
    </svg>
  );
};

// --- MAIN APP COMPONENT ---

export default function Summary() {
  const [summaryData, setSummaryData] = useState<SummarySectionData[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [summaryLength, setSummaryLength] = useState<SummaryLength>("long");
  const theme = useThemeColors();

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
    if (isLoading) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "3rem",
            color: theme.accent,
          }}
        >
          <div
            style={{
              width: "2rem",
              height: "2rem",
              border: `3px solid ${theme.border}`,
              borderTop: `3px solid ${theme.accent}`,
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      );
    }
    if (error) {
      return (
        <p
          style={{
            textAlign: "center",
            color: theme.accent,
          }}
        >
          {error}
        </p>
      );
    }
    if (summaryData) {
      return summaryData.map((section) => (
        <div
          key={section.id}
          style={{
            marginBottom: "2rem",
            padding: "1.5rem",
            backgroundColor: theme.card,
            borderRadius: "0.75rem",
            border: `1px solid ${theme.border}`,
          }}
        >
          <h3
            style={{
              color: theme.primaryText,
              fontSize: "1.25rem",
              fontWeight: "600",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <SourceIcon />
            {section.title}
          </h3>
          {section.points.map((point) => (
            <div
              key={point.id}
              style={{
                marginBottom: "1rem",
                padding: "1rem",
                backgroundColor: theme.card,
                borderRadius: "0.5rem",
                border: `1px solid ${theme.border}`,
              }}
            >
              <p
                style={{
                  color: theme.primaryText,
                  fontSize: "1rem",
                  lineHeight: "1.6",
                  marginBottom: point.subPoints ? "0.5rem" : "0",
                }}
              >
                {point.text}
              </p>
              {point.subPoints && (
                <div style={{ marginLeft: "1.5rem" }}>
                  {point.subPoints.map((subPoint) => (
                    <div
                      key={subPoint.id}
                      style={{
                        marginTop: "0.5rem",
                        padding: "0.5rem",
                        backgroundColor: theme.cardSecondary,
                        borderRadius: "0.25rem",
                        border: `1px solid ${theme.borderSecondary}`,
                      }}
                    >
                      <p
                        style={{
                          color: theme.secondaryText,
                          fontSize: "0.9rem",
                          lineHeight: "1.5",
                        }}
                      >
                        {subPoint.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ));
    }
    return null;
  };

  const lengths = [
    {
      key: "small" as SummaryLength,
      label: "Short",
      description: "Key points only",
    },
    {
      key: "medium" as SummaryLength,
      label: "Medium",
      description: "Balanced overview",
    },
    {
      key: "long" as SummaryLength,
      label: "Detailed",
      description: "Comprehensive analysis",
    },
  ];

  return (
    <div className="w-full h-full font-sans">
      <div className="max-w-4xl mx-auto">
        <main
          className="rounded-xl p-6 sm:p-8"
          style={{ backgroundColor: theme.card }}
        >
          <div
            style={{
              marginBottom: "2rem",
              padding: "1.5rem",
              backgroundColor: theme.card,
              borderRadius: "0.75rem",
              border: `1px solid ${theme.border}`,
            }}
          >
            <h2
              style={{
                color: theme.primaryText,
                fontSize: "1.5rem",
                fontWeight: "600",
                marginBottom: "1rem",
              }}
            >
              Summary Length
            </h2>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              {lengths.map((length) => (
                <button
                  key={length.key}
                  onClick={() => setSummaryLength(length.key)}
                  style={{
                    padding: "0.75rem 1rem",
                    borderRadius: "0.5rem",
                    border: `2px solid ${
                      summaryLength === length.key ? theme.accent : theme.border
                    }`,
                    backgroundColor:
                      summaryLength === length.key
                        ? theme.accent
                        : "transparent",
                    color:
                      summaryLength === length.key
                        ? theme.primaryText
                        : theme.secondaryText,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    minWidth: "120px",
                  }}
                  onMouseEnter={(e) => {
                    if (summaryLength !== length.key) {
                      e.currentTarget.style.backgroundColor = theme.cardHover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (summaryLength !== length.key) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <span
                    style={{
                      fontWeight: "600",
                      fontSize: "0.9rem",
                    }}
                  >
                    {length.label}
                  </span>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      opacity: 0.8,
                    }}
                  >
                    {length.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div
            className="border-t my-6"
            style={{ borderColor: theme.border }}
          ></div>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
