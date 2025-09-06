import { ChevronDown } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import VideoFeedbackModal from "@/components/feedback/VideoFeedbackModal";
import { videoApi } from "@/lib/api-client";

// Star Rating Component with Animation

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

// Removed unused demo data arrays

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

// Helper function to format text with markdown-like syntax
const formatText = (text: string) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text
    .replace(/\n\n/g, '<br/><br/>') // Double newlines
    .replace(/\n/g, '<br/>'); // Single newlines
};

const SummaryPointItem: React.FC<{ point: SummaryPoint }> = ({ point }) => (
  <li className="mb-2">
    <div className="flex items-start">
      <span
        className="mr-3 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full text-foreground"
      ></span>
      <div 
        className="text-muted-foreground"
        dangerouslySetInnerHTML={{ __html: formatText(point.text) }}
      />
      <SourceIcon />
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
                className="mr-3 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full text-muted-foreground"
              ></span>
              <div 
                className="text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: formatText(subPoint.text) }}
              />
              <SourceIcon />
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
      className="text-2xl font-bold mb-4 text-foreground"
      dangerouslySetInnerHTML={{ __html: formatText(section.title) }}
    />
    <ul className="list-none p-0">
      {section.points.map((point) => (
        <SummaryPointItem key={point.id} point={point} />
      ))}
    </ul>
  </div>
);

// Footer with explicit Rate button and modal handling
const SummaryFeedback: React.FC<SummaryProps> = ({
  videoId,
  canSubmitFeedback,
  existingFeedback,
  markAsSubmitted,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Debug modal state changes
  useEffect(() => {
    console.log("🔍 Summary modal state changed:", { isOpen, canSubmitFeedback, existingFeedback: !!existingFeedback });
  }, [isOpen, canSubmitFeedback, existingFeedback]);

  console.log(canSubmitFeedback, existingFeedback, markAsSubmitted);
  

  const open = () => {
    console.log("🔍 Summary feedback button clicked:", {
      canSubmitFeedback,
      existingFeedback: !!existingFeedback,
      hasMarkAsSubmitted: !!markAsSubmitted
    });
    console.log("🔍 Setting modal to open - isOpen will be:", true);
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);
  
  const handleDismiss = () => {
    console.log("🔍 Summary feedback modal dismissed by user");
    setIsOpen(false);
    // Mark that user has dismissed the feedback request
    if (markAsSubmitted) {
      markAsSubmitted();
    }
  };

  const handleSkip = () => {
    console.log("🔍 Summary feedback skipped");
    setIsOpen(false);
    // Mark that user has skipped the feedback request
    if (markAsSubmitted) {
      markAsSubmitted();
    }
  };

  const onSubmit = async (payload: unknown) => {
    console.log("Summary feedback submitted:", payload);
    
    if (markAsSubmitted) {
      markAsSubmitted();
    }
    setIsOpen(false);
  };

  return (
    <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Share your thoughts about this summary.
      </div>
      {existingFeedback ? (
        // Show feedback submitted message
        <div className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-600 text-gray-300 flex items-center gap-2">
          <span>✓ Feedback submitted</span>
          {existingFeedback.rating && (
            <span className="text-yellow-400">
              {existingFeedback.rating}/5 stars
            </span>
          )}
        </div>
      ) : (
        // Show rate button if no feedback yet
        <button
          onClick={open}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors"
          disabled={canSubmitFeedback !== true}
        >
          Rate Summary
        </button>
      )}
      <VideoFeedbackModal
        isOpen={isOpen}
        onClose={close}
        videoId={videoId}
        videoTitle={"Summary"}
        playPercentage={100}
        onSubmit={onSubmit}
        onSkip={handleSkip}
        onDismiss={handleDismiss}
        canSubmitFeedback={canSubmitFeedback}
        existingFeedback={existingFeedback}
        markAsSubmitted={markAsSubmitted}
        componentName="Summary"
      />
    </div>
  );
};

// Updated header with a dropdown selector
const SummaryHeader: React.FC<{
  activeLength: SummaryLength;
  onLengthChange: (length: SummaryLength) => void;
}> = ({ activeLength, onLengthChange }) => {
  const lengths: SummaryLength[] = ["small", "medium", "long"];

  return (
    <div className="flex justify-center items-center mb-4">
      <div className="relative">
        <select
          value={activeLength}
          onChange={(e) => onLengthChange(e.target.value as SummaryLength)}
          className="appearance-none px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 capitalize w-48 text-center bg-background text-foreground border border-border cursor-pointer hover:bg-accent"
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
          className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-foreground"
        >
          <ChevronDown/>
        </div>
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-10">
    <div
      className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-accent"
      style={{ borderColor: `${theme.accent} transparent` }}
    ></div>
    <p className="ml-4 text-lg">
      Loading Summary...
    </p>
  </div>
);

// --- MAIN APP COMPONENT ---

// Add props interface for feedback state
interface FeedbackData {
  id: string;
  rating: number;
  description: string;
  date_submitted: string;
  page_url: string;
}

interface SummaryProps {
  // Only videoId is required, feedback props are optional
  videoId: string;
  canSubmitFeedback?: boolean | undefined;
  existingFeedback?: FeedbackData | null;
  markAsSubmitted?: () => void;
}

const Summary: React.FC<SummaryProps> = React.memo(({
  videoId,
  canSubmitFeedback,
  existingFeedback,
  markAsSubmitted,
}) => {
  // Debug feedback props
  console.log("🔍 Summary Component - Mounted/Re-rendered with props:", {
    videoId,
    canSubmitFeedback,
    existingFeedback: !!existingFeedback,
    hasMarkAsSubmitted: !!markAsSubmitted,
    timestamp: new Date().toISOString()
  });

  // Temporarily disable feedback to prevent re-renders
  const feedbackCanSubmitFeedback = false;
  const feedbackExistingFeedback = null;
  const feedbackMarkAsSubmitted = () => {};

  const [summaryData, setSummaryData] = useState<SummarySectionData[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [summaryLength, setSummaryLength] = useState<SummaryLength>("long");

  // Add ref to track if we've already fetched data for this videoId
  const fetchedVideoIdRef = useRef<string | null>(null);
  const isFetchingRef = useRef<boolean>(false);

  // Fetch summary data from API - ULTRA AGGRESSIVE APPROACH
  useEffect(() => {
    const fetchSummaryData = async () => {
      // ULTRA AGGRESSIVE: Only fetch if we haven't fetched this videoId before
      if (!videoId || fetchedVideoIdRef.current === videoId) {
        console.log("🔍 ULTRA AGGRESSIVE: Skipping summary fetch - already fetched:", { 
          videoId, 
          fetchedVideoId: fetchedVideoIdRef.current
        });
        return;
      }

      // ULTRA AGGRESSIVE: Set fetching flag immediately
      if (isFetchingRef.current) {
        console.log("🔍 ULTRA AGGRESSIVE: Already fetching summary, skipping");
        return;
      }

      if (!videoId) {
        console.log("🔍 No videoId provided, using demo data");
        setSummaryData(longSummaryData);
        setIsLoading(false);
        return;
      }

      console.log("🔍 ULTRA AGGRESSIVE: Starting summary fetch for videoId:", videoId);
      isFetchingRef.current = true;
      fetchedVideoIdRef.current = videoId; // Mark as fetched IMMEDIATELY
      setIsLoading(true);
      setError(null);

      try {
        const response = await videoApi.getVideoSummary(videoId);
        
        console.log("📊 Raw API response:", response);
        
        // Check if response has the expected structure
        if (!response) {
          throw new Error("Empty response from API");
        }

        let transformedData: SummarySectionData[] = [];

        // Handle different possible response structures
        if (response.sections && Array.isArray(response.sections)) {
          // Transform API response to our component format
          transformedData = response.sections.map((section: unknown, index: number) => {
            const sectionData = section as { title?: string; content?: string; text?: string; description?: string };
            return {
              id: `section_${index}`,
              title: sectionData.title || `Section ${index + 1}`,
              points: [{
                id: `point_${index}`,
                text: sectionData.content || sectionData.text || sectionData.description || "No content available"
              }]
            };
          });
        } else if (response.transcript) {
          // Handle the actual API response format with transcript field
          const transcriptText = response.transcript;
          
          // Split the transcript into sections based on markdown headers
          const sections = transcriptText.split(/\n\n\*\*(.*?)\*\*/g);
          const processedSections: SummarySectionData[] = [];
          
          for (let i = 0; i < sections.length; i += 2) {
            if (sections[i + 1]) {
              // This is a section with a header
              const title = sections[i + 1].trim();
              const content = sections[i + 2] || sections[i].trim();
              
              // Split content into points based on bullet points or newlines
              const points = content
                .split(/\n\*|\n-|\n\d+\./)
                .filter((point: string) => point.trim().length > 0)
                .map((point: string, pointIndex: number) => ({
                  id: `point_${i}_${pointIndex}`,
                  text: point.trim().replace(/^\*|\d+\./, '').trim()
                }));

              processedSections.push({
                id: `section_${i}`,
                title: title,
                points: points.length > 0 ? points : [{
                  id: `point_${i}`,
                  text: content.trim()
                }]
              });
            }
          }
          
          // If no sections were created, try to create sections from the content
          if (processedSections.length === 0) {
            // Look for common patterns in the transcript
            const keyTakeawayMatch = transcriptText.match(/\*\*Key Takeaway:\*\*(.*?)(?=\*\*|$)/s);
            const mainPointsMatch = transcriptText.match(/\*\*Main Points Covered:\*\*(.*?)(?=\*\*|$)/s);
            const adviceMatch = transcriptText.match(/\*\*Advice for.*?:\*\*(.*?)(?=\*\*|$)/s);
            
            if (keyTakeawayMatch) {
              processedSections.push({
                id: "key_takeaway",
                title: "Key Takeaway",
                points: [{
                  id: "key_takeaway_point",
                  text: keyTakeawayMatch[1].trim()
                }]
              });
            }
            
            if (mainPointsMatch) {
              const mainPoints = mainPointsMatch[1]
                .split(/\n\*|\n-|\n\d+\./)
                .filter((point: string) => point.trim().length > 0)
                .map((point: string, index: number) => ({
                  id: `main_point_${index}`,
                  text: point.trim().replace(/^\*|\d+\./, '').trim()
                }));
              
              processedSections.push({
                id: "main_points",
                title: "Main Points Covered",
                points: mainPoints
              });
            }
            
            if (adviceMatch) {
              const advicePoints = adviceMatch[1]
                .split(/\n\*|\n-|\n\d+\./)
                .filter((point: string) => point.trim().length > 0)
                .map((point: string, index: number) => ({
                  id: `advice_point_${index}`,
                  text: point.trim().replace(/^\*|\d+\./, '').trim()
                }));
              
              processedSections.push({
                id: "advice",
                title: "Advice for SBI PO Aspirants",
                points: advicePoints
              });
            }
            
            // If still no sections, create a single section with the full transcript
            if (processedSections.length === 0) {
              processedSections.push({
                id: "summary",
                title: "Video Summary",
                points: [{
                  id: "summary_point",
                  text: transcriptText
                }]
              });
            }
          }
          
          transformedData = processedSections;
        } else if (response.summary) {
          // If only summary text is available, create a single section
          transformedData = [{
            id: "summary",
            title: "Video Summary",
            points: [{
              id: "summary_point",
              text: response.summary
            }]
          }];
        } else if (Array.isArray(response)) {
          // If response is directly an array
          transformedData = response.map((item: unknown, index: number) => {
            const itemData = item as { title?: string; content?: string; text?: string; description?: string };
            return {
              id: `section_${index}`,
              title: itemData.title || `Section ${index + 1}`,
              points: [{
                id: `point_${index}`,
                text: itemData.content || itemData.text || itemData.description || "No content available"
              }]
            };
          });
        } else {
          // Fallback: create a single section with available data
          transformedData = [{
            id: "summary",
            title: "Video Summary",
            points: [{
              id: "summary_point",
              text: JSON.stringify(response) || "No summary content available"
            }]
          }];
        }

        // If still no data, use demo data
        if (transformedData.length === 0) {
          console.log("⚠️ No valid summary data found, using demo data");
          transformedData = longSummaryData;
        }

        setSummaryData(transformedData);
        console.log("✅ Summary data processed successfully:", transformedData);
      } catch (err: unknown) {
        const error = err as { message?: string; status?: number; response?: { data?: unknown } };
        console.error("❌ Error fetching summary:", err);
        console.error("❌ Error details:", {
          message: error.message,
          status: error.status,
          response: error.response?.data
        });
        
        setError(error.message || "Failed to load summary");
        
        // Fallback to demo data on error
        setSummaryData(longSummaryData);
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    };

    fetchSummaryData();
  }, [videoId]); // Only fetch when videoId changes

  // Reset refs when component unmounts or videoId changes
  useEffect(() => {
    return () => {
      fetchedVideoIdRef.current = null;
      isFetchingRef.current = false;
    };
  }, [videoId]);



  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <SummaryHeader
          activeLength={summaryLength}
          onLengthChange={setSummaryLength}
        />
        
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-400 mb-4">
              <p className="text-lg font-semibold">Failed to load summary</p>
              <p className="text-sm">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {summaryData?.map((section, index) => (
              <SummarySection key={index} section={section} />
            ))}
            <SummaryFeedback videoId={videoId} canSubmitFeedback={feedbackCanSubmitFeedback} existingFeedback={feedbackExistingFeedback} markAsSubmitted={feedbackMarkAsSubmitted} />
          </div>
        )}
      </div>
    </div>
  );
});

Summary.displayName = 'Summary';

export default Summary;
