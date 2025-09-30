// @ts-nocheck
/* eslint-disable */
import StatsCard from "@/components/stats/Card";
import CardContent from "@/components/stats/CardContent";
import OverallPerformance from "./AnalysisComponents/OverallPerformance";
import SectionalSummary from "./AnalysisComponents/SectionalSummary";
import ComparisonAnalysis from "./AnalysisComponents/ComparisonAnalysis";
import CognitiveSkills from "./AnalysisComponents/CognitiveSkills";
import YourAttemptStrategy from "./AnalysisComponents/YourAttemptStrategy";
import TopperStrategy from "./AnalysisComponents/TopperStrategy";
import ActionableInsights from "./AnalysisComponents/ActionableInsights";
import LearningPlan from "./AnalysisComponents/LearningPlan";
import Leaderboard from "./AnalysisComponents/Leaderboard";
import {
  ArrowDown,
  ArrowRight,
  BicepsFlexed,
  Check,
  Clock,
  Copy,
  Crown,
  RefreshCcw,
  Share,
  Siren,
  Smile,
  Sparkle,
  Star,
  Target,
  Text,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { quizApi } from "@/lib/api-client";

import { theme } from "@/styles/theme";
import ShareModal from "@/components/modals/ShareModal";
import VideoFeedbackModal from "@/components/feedback/VideoFeedbackModal";
import { ComponentName, feedbackApi } from "@/lib/api-client";
import { useMultiFeedbackTracker } from "@/hooks/useFeedbackTracker";
import RankBadge from "@/components/stats/RankBadge";
import { ROUTES } from "@/routes/constants";

import CustomLoader from "@/components/icons/customloader";
import formatScore from "@/lib/formatScore";
import calculateDaysSince from "@/lib/calculateDaysSince";
import Leaderboard2 from "./AnalysisComponents/Leaderboard2";
import AiTestCard from "@/components/test/AiTestCard";
import { AiRecommendation } from "@/components/types/AiRecommendation";

// --- SERVER DATA (Attempted tests) ---
// Right side recommendations remain dummy below. Left side will be fetched from API.

const aiRecommendedTests: AiRecommendation[] = [
  {
    id: "rec-1",
    examName: "SBI PO Prelims: Sectional",
    reason: "Improve your Quant speed",
  },
  {
    id: "rec-2",
    examName: "RBI Assistant: Full Mock",
    reason: "High accuracy needed",
  },
  {
    id: "rec-3",
    examName: "IBPS Clerk Mains: Reasoning",
    reason: "Focus on complex puzzles",
  },
  {
    id: "rec-4",
    examName: "General Awareness Quiz",
    reason: "Based on recent news",
  }, // This one will now be hidden
];
// --- MOCK DATA ---
let userPerformance: any = {
  user: {
    name: "Sagen Tiriya",
    message: "Keep Practicing!",
  },
  level: "medium",
  date: "2025-09-20",
  leaderboard: [
    { rank: 1, name: "Heena Shaikh", score: 95.25 },
    { rank: 2, name: "Jethaalal Gada", score: 95.25 },
    { rank: 3, name: "Kajal Jain", score: 94.5 },
    { rank: 4, name: "Souhardya Kar", score: 93.0 },
    { rank: 5, name: "Vaibhav", score: 93.0 },
    { rank: 6, name: "Priya Sharma", score: 92.75 },
    { rank: 7, name: "Rohan Mehta", score: 91.5 },
    { rank: 8, name: "Anjali Verma", score: 90.0 },
    { rank: 9, name: "Vikram Singh", score: 89.25 },
    { rank: 10, name: "Sneha Patil", score: 88.5 },
  ],
  overall: {
    score: 69.0,
    maxScore: 140,
    rank: 255,
    maxRank: 5978,
    percentile: 95.8,
    accuracy: 87.32,
    time: "56:14",
    maxTime: "60:00",
    negativeMarks: 5.75,
    cutoff: 15.0,
    cognitiveSkills: [
      {
        name: "Conceptual",
        score: 88,
        description: "Strong grasp of theories.",
      },
      {
        name: "Application",
        score: 75,
        description: "Good at applying formulas.",
      },
      { name: "Critical", score: 65, description: "Area for improvement." },
      {
        name: "Procedural",
        score: 90,
        description: "Excellent at following steps.",
      },
      {
        name: "Spatial",
        score: 70,
        description: "Can visualize problems well.",
      },
    ],
    aiSummary:
      "Great work on the Algebra quiz, Alex! Focus on Critical Problem-Solving in Inequalities.",
    learningPlan: [
      {
        title: "Strengthen Foundations",
        duration: 30,
        action: "Review 'Solving Multi-Step Inequalities.'",
        goal: "Complete the quiz with 85%.",
      },
    ],
  },
  sections: {
    english: {
      key: "english",
      name: "English",
      color: "text-[#0A84FF]",
      score: 21.25,
      maxScore: 30,
      rank: 255,
      maxRank: 5978,
      percentile: 95.8,
      accuracy: 87.32,
      time: "16:25",
      maxTime: "20:00",
      negativeMarks: 5.75,
      cutoff: 15.0,
      topics: [
        {
          name: "Reading Comprehension",
          accuracy: 90,
          time: "8m 15s",
          totalQs: 10,
          attempted: 9,
          correct: 8,
          score: 7.75,
        },
        {
          name: "Error Spotting",
          accuracy: 75,
          time: "4m 30s",
          totalQs: 5,
          attempted: 4,
          correct: 3,
          score: 2.75,
        },
        {
          name: "Para Jumbles",
          accuracy: 60,
          time: "6m 05s",
          totalQs: 5,
          attempted: 5,
          correct: 3,
          score: 2.5,
        },
        {
          name: "Fill in the Blanks",
          accuracy: 95,
          time: "3m 45s",
          totalQs: 10,
          attempted: 10,
          correct: 9,
          score: 8.75,
        },
      ],
      difficultyTrend: {
        maxTime: 20,
        user: [
          { time: 0, difficulty: 1.2 },
          { time: 5, difficulty: 1.8 },
          { time: 10, difficulty: 2.5 },
          { time: 16, difficulty: 2.1 },
        ],
        topper: [
          { time: 0, difficulty: 2.0 },
          { time: 3, difficulty: 2.5 },
          { time: 5, difficulty: 2.8 },
          { time: 8, difficulty: 2.6 },
          { time: 10, difficulty: 2.2 },
          { time: 13, difficulty: 1.9 },
          { time: 15, difficulty: 1.5 },
          { time: 18, difficulty: 1.4 },
          { time: 20, difficulty: 1.3 },
        ],
      },
    },
    numerical: {
      key: "numerical",
      name: "Quant",
      color: "text-[#FF3B30]",
      score: 18.5,
      maxScore: 35,
      rank: 450,
      maxRank: 5978,
      percentile: 92.47,
      accuracy: 80.15,
      time: "18:10",
      maxTime: "20:00",
      negativeMarks: 4.25,
      cutoff: 12.5,
      topics: [
        {
          name: "Data Interpretation",
          accuracy: 85,
          time: "9m 20s",
          totalQs: 10,
          attempted: 10,
          correct: 8,
          score: 7.5,
        },
        {
          name: "Quadratic Equations",
          accuracy: 90,
          time: "3m 15s",
          totalQs: 5,
          attempted: 5,
          correct: 4,
          score: 3.75,
        },
        {
          name: "Simplification",
          accuracy: 70,
          time: "4m 05s",
          totalQs: 10,
          attempted: 8,
          correct: 7,
          score: 6.75,
        },
        {
          name: "Number Series",
          accuracy: 75,
          time: "1m 30s",
          totalQs: 5,
          attempted: 4,
          correct: 3,
          score: 2.75,
        },
      ],
      difficultyTrend: {
        maxTime: 20,
        user: [
          { time: 0, difficulty: 2.0 },
          { time: 8, difficulty: 2.8 },
          { time: 15, difficulty: 3.0 },
          { time: 18, difficulty: 2.5 },
        ],
        topper: [
          { time: 0, difficulty: 3.0 },
          { time: 3, difficulty: 2.8 },
          { time: 5, difficulty: 2.6 },
          { time: 7, difficulty: 2.5 },
          { time: 10, difficulty: 2.3 },
          { time: 12, difficulty: 2.0 },
          { time: 15, difficulty: 1.9 },
          { time: 18, difficulty: 1.8 },
          { time: 20, difficulty: 1.7 },
        ],
      },
    },
    reasoning: {
      key: "reasoning",
      name: "Reasoning",
      color: "text-[#FFCC00]",
      score: 20.0,
      maxScore: 35,
      rank: 310,
      maxRank: 5978,
      percentile: 94.81,
      accuracy: 85.0,
      time: "22:00",
      maxTime: "20:00",
      negativeMarks: 3.5,
      cutoff: 14.0,
      topics: [
        {
          name: "Puzzles",
          accuracy: 80,
          time: "12m 00s",
          totalQs: 15,
          attempted: 12,
          correct: 10,
          score: 9.5,
        },
        {
          name: "Seating Arrangement",
          accuracy: 85,
          time: "6m 10s",
          totalQs: 10,
          attempted: 10,
          correct: 8,
          score: 7.5,
        },
        {
          name: "Syllogism",
          accuracy: 95,
          time: "2m 30s",
          totalQs: 5,
          attempted: 5,
          correct: 5,
          score: 5.0,
        },
        {
          name: "Blood Relation",
          accuracy: 75,
          time: "1m 20s",
          totalQs: 5,
          attempted: 4,
          correct: 3,
          score: 2.75,
        },
      ],
      difficultyTrend: {
        maxTime: 22,
        user: [
          { time: 0, difficulty: 2.2 },
          { time: 10, difficulty: 3.0 },
          { time: 18, difficulty: 2.8 },
          { time: 22, difficulty: 2.6 },
        ],
        topper: [
          { time: 0, difficulty: 2.5 },
          { time: 4, difficulty: 3.0 },
          { time: 8, difficulty: 2.9 },
          { time: 12, difficulty: 2.4 },
          { time: 15, difficulty: 2.1 },
          { time: 18, difficulty: 2.0 },
          { time: 20, difficulty: 1.9 },
          { time: 22, difficulty: 1.8 },
        ],
      },
    },
    generalAwareness: {
      key: "generalAwareness",
      name: "G.A.",
      color: "text-[#34C759]",
      score: 15.25,
      maxScore: 40,
      rank: 520,
      maxRank: 5978,
      percentile: 91.3,
      accuracy: 76.25,
      time: "10:00",
      maxTime: "15:00",
      negativeMarks: 1.25,
      cutoff: 10.5,
      topics: [
        {
          name: "Current Affairs",
          accuracy: 80,
          time: "4m 00s",
          totalQs: 15,
          attempted: 10,
          correct: 8,
          score: 7.75,
        },
        {
          name: "Static GK",
          accuracy: 70,
          time: "3m 30s",
          totalQs: 15,
          attempted: 10,
          correct: 7,
          score: 6.75,
        },
        {
          name: "Banking Awareness",
          accuracy: 75,
          time: "2m 30s",
          totalQs: 10,
          attempted: 4,
          correct: 3,
          score: 2.75,
        },
      ],
      difficultyTrend: {
        maxTime: 15,
        user: [
          { time: 0, difficulty: 1.0 },
          { time: 3, difficulty: 1.5 },
          { time: 7, difficulty: 1.8 },
          { time: 10, difficulty: 1.3 },
        ],
        topper: [
          { time: 0, difficulty: 1.8 },
          { time: 2, difficulty: 1.5 },
          { time: 4, difficulty: 1.2 },
          { time: 6, difficulty: 1.4 },
          { time: 8, difficulty: 1.5 },
          { time: 10, difficulty: 1.3 },
          { time: 12, difficulty: 1.0 },
          { time: 15, difficulty: 0.9 },
        ],
      },
    },
  },
  comparisons: {
    metrics: ["Your Score", "Accuracy", "Correct", "Incorrect", "Time Spent"],
    maxValues: {
      "Your Score": 35,
      Accuracy: 100,
      Correct: 35,
      Incorrect: 10,
      "Time Spent": 1320,
    },
    data: {
      "Your Score": {
        you: {
          english: 21.25,
          numerical: 18.5,
          reasoning: 20.0,
          generalAwareness: 15.25,
        },
        average: {
          english: 18.5,
          numerical: 15.2,
          reasoning: 17.8,
          generalAwareness: 12.5,
        },
        topper: {
          english: 28.0,
          numerical: 32.5,
          reasoning: 34.75,
          generalAwareness: 35.0,
        },
      },
      Accuracy: {
        you: {
          english: 87.32,
          numerical: 80.15,
          reasoning: 85.0,
          generalAwareness: 76.25,
        },
        average: {
          english: 75,
          numerical: 68,
          reasoning: 72,
          generalAwareness: 65,
        },
        topper: {
          english: 98,
          numerical: 96,
          reasoning: 99,
          generalAwareness: 95,
        },
      },
      Correct: {
        you: {
          english: 28,
          numerical: 22,
          reasoning: 28,
          generalAwareness: 28,
        },
        average: {
          english: 19,
          numerical: 16,
          reasoning: 18,
          generalAwareness: 13,
        },
        topper: {
          english: 28,
          numerical: 33,
          reasoning: 35,
          generalAwareness: 35,
        },
      },
      Incorrect: {
        you: { english: 4, numerical: 5, reasoning: 5, generalAwareness: 9 },
        average: {
          english: 6,
          numerical: 7,
          reasoning: 5,
          generalAwareness: 7,
        },
        topper: { english: 1, numerical: 1, reasoning: 0, generalAwareness: 2 },
      },
      "Time Spent": {
        you: {
          english: 985,
          numerical: 1090,
          reasoning: 1320,
          generalAwareness: 600,
        },
        average: {
          english: 1020,
          numerical: 1150,
          reasoning: 1300,
          generalAwareness: 720,
        },
        topper: {
          english: 900,
          numerical: 1050,
          reasoning: 1200,
          generalAwareness: 600,
        },
      },
    },
  },
};

// --- MAIN APP COMPONENT ---

export default function TestAnalysis2() {
  const shareDropdownRef = useRef<HTMLDivElement>(null);
  const [isShareOpen, setShareOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  // Resolve sessionId from router state or from query string (MUST be above feedback tracker)
  const sessionId = useMemo(() => {
    const fromState = (location.state as any)?.sessionId;
    if (fromState) return Number(fromState);
    const params = new URLSearchParams(location.search);
    const fromQuery = params.get("sessionId");
    return fromQuery ? Number(fromQuery) : undefined;
  }, [location.state, location.search]);
  // Feedback availability for Test component
  const {
    feedbackStates,
    isLoading: isFeedbackLoading,
    checkFeedback,
  } = useMultiFeedbackTracker({
    components: [ComponentName.Test],
    sourceId: String(sessionId ?? ""),
    pageUrl: typeof window !== "undefined" ? window.location.href : "",
    onFeedbackExists: () => {},
  });
  const testFeedbackState = feedbackStates[ComponentName.Test];

  // Open feedback modal only when tracker confirms eligibility and no prior feedback
  useEffect(() => {
    if (!sessionId || isFeedbackLoading) return;
    const canOpen = !!(
      testFeedbackState?.canSubmitFeedback &&
      !testFeedbackState?.existingFeedback
    );
    setIsFeedbackOpen(canOpen);
  }, [
    sessionId,
    isFeedbackLoading,
    testFeedbackState?.canSubmitFeedback,
    testFeedbackState?.existingFeedback,
  ]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shareDropdownRef.current &&
        !shareDropdownRef.current.contains(event.target as Node)
      ) {
        setShareOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // Ensure the tracker actually calls the API once sessionId is known
  useEffect(() => {
    if (sessionId) {
      checkFeedback();
    }
  }, [sessionId, checkFeedback]);

  // Fetch test analysis after page load, then hydrate UI dataset
  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!sessionId || Number.isNaN(sessionId)) return;
      setIsLoadingAnalysis(true);
      setAnalysisError(null);
      try {
        const data = await quizApi.testAnalysis(sessionId);
        setAnalysisData(data || {});

        // Optional: if backend already returns an object compatible with current UI
        // shape, assign directly. Otherwise map it here.
        if (data && typeof data === "object") {
          const d: any = data;
          // Example mapping – adjust keys based on your API
          userPerformance = {
            user: {
              name: d?.user?.name || "Student",
              message: d?.message || "",
            },
            level: d?.level || userPerformance.level,
            date: d?.date || userPerformance.date,
            leaderboard: d?.leaderboard || userPerformance.leaderboard,
            overall: {
              score: d?.overall?.score ?? userPerformance.overall.score,
              maxScore:
                d?.overall?.maxScore ?? userPerformance.overall.maxScore,
              rank: d?.overall?.rank ?? userPerformance.overall.rank,
              maxRank: d?.overall?.maxRank ?? userPerformance.overall.maxRank,
              percentile:
                d?.overall?.percentile ?? userPerformance.overall.percentile,
              accuracy:
                d?.overall?.accuracy ?? userPerformance.overall.accuracy,
              time: d?.overall?.time ?? userPerformance.overall.time,
              maxTime: d?.overall?.maxTime ?? userPerformance.overall.maxTime,
              negativeMarks:
                d?.overall?.negativeMarks ??
                userPerformance.overall.negativeMarks,
              cutoff: d?.overall?.cutoff ?? userPerformance.overall.cutoff,
              cognitiveSkills:
                d?.overall?.cognitiveSkills ??
                userPerformance.overall.cognitiveSkills,
              aiSummary:
                d?.overall?.aiSummary ?? userPerformance.overall.aiSummary,
              learningPlan:
                d?.overall?.learningPlan ??
                userPerformance.overall.learningPlan,
            },
            sections: d?.sections ?? userPerformance.sections,
            comparisons: userPerformance.comparisons,
            //comparisons: d?.comparisons ?? userPerformance.comparisons,
          };
        }
      } catch (e: any) {
        setAnalysisError(e?.message || "Failed to load analysis");
      } finally {
        setIsLoadingAnalysis(false);
      }
    };
    fetchAnalysis();
  }, [sessionId]);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const handleShare = useCallback(() => {
    setIsShareModalOpen(true);
  }, []);

  const handleCloseShareModal = useCallback(() => {
    setIsShareModalOpen(false);
  }, []);
  // Block render until API loads (if sessionId was provided)
  if (sessionId && isLoadingAnalysis) {
    return (
      <div className="fixed inset-0 flex flex-1 flex-col z-10 items-center justify-center bg-background bg-opacity-70 h-full">
        <CustomLoader className="h-15 w-15" />
        <p className="text-lg text-muted-foreground mt-8">
          Fetching analysis...
        </p>
      </div>
    );
  }

  if (sessionId && analysisError) {
    return (
      <div className="p-4 sm:p-6 bg-background min-h-screen font-sans text-foreground mt-10 sm:mt-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-3">{analysisError}</p>
          <p className="text-sm text-muted-foreground">
            Try reloading the page.
          </p>
        </div>
      </div>
    );
  }
  //<div className="p-4 sm:p-6 bg-background min-h-screen font-sans text-foreground mt-10 sm:mt-4">
  return (
    <div className="bg-background overflow-hidden w-full flex flex-col max-h-[100vh]">
      {isLoadingAnalysis && (
        <div className="max-w-7xl mx-auto mb-4">
          <div className="text-sm text-muted-foreground">
            Loading analysis...
          </div>
        </div>
      )}
      {analysisError && (
        <div className="max-w-7xl mx-auto mb-4">
          <div className="text-sm text-red-400">{analysisError}</div>
        </div>
      )}
      {/**<div className="max-w-7xl mx-auto mb-8 text-center">
          <h1 className="text-3xl font-semibold text-foreground">
            You did great, {currentUser.name.split(" ")[0]}
          </h1>
        </div>*/}
      <main className="w-full overflow-y-auto px-4 sm:px-6 lg:px-8 pb-10 grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 items-start">
        {/* --- LEFT COLUMN: ATTEMPT HISTORY --- */}
        <section className="lg:col-span-3">
          <div className="max-w-7xl mx-auto mt-10 sm:mt-4">
            <div>
              <div className="lg:col-span-12 flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl sm:text-3xl font-bold">
                    Detailed Test Report
                  </h1>
                  <div ref={shareDropdownRef} className="relative">
                    <button
                      onClick={() => setShareOpen(!isShareOpen)}
                      className="flex items-center gap-2 p-2 text-sm font-medium text-primary bg-foreground/10 border border-primary/20 rounded-xl hover:bg-foreground/20 disabled:opacity-50 disabled:cursor-wait transition-colors cursor-pointer"
                    >
                      <Share className="w-5 h-5" />
                    </button>
                    {isShareOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-background-subtle border border-border rounded-lg shadow-xl z-10">
                        <a
                          onClick={handleShare}
                          href="#"
                          className="flex items-center px-4 py-2 text-sm hover:bg-accent"
                        >
                          <Share className="w-4 h-4 mr-3" />
                          Share
                        </a>
                        <a
                          href="#"
                          className="flex items-center px-4 py-2 text-sm hover:bg-accent"
                        >
                          <Copy className="w-4 h-4 mr-3" />
                          Copy Link
                        </a>
                        <a
                          href="#"
                          className="flex items-center px-4 py-2 text-sm hover:bg-accent"
                        >
                          <Smile className="w-4 h-4 mr-3" />
                          Help improve this
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center text-muted-foreground text-sm sm:text-base gap-x-2 gap-y-1 mt-2 md:mt-0">
                  {/* Topics */}
                  <span className="flex items-center">
                    <span className="font-semibold mr-1">Topics:</span>
                    <span>
                      {Object.values(userPerformance.sections)
                        .map((s) => s.name)
                        .join(", ")}
                    </span>
                  </span>

                  {/* Separator */}
                  <span className="hidden sm:inline">|</span>

                  {/* Level */}
                  <span className="flex items-center">
                    <span className="font-semibold mr-1">Level:</span>
                    <span>{userPerformance.level}</span>
                  </span>

                  {/* Separator */}
                  <span className="hidden sm:inline">|</span>

                  {/* Attempted */}
                  <span className="flex items-center">
                    <span className="font-semibold mr-1">Attempted</span>
                    <span>{calculateDaysSince(userPerformance.date)}</span>
                  </span>
                </div>
              </div>
              <div className="space-y-6 gap-0 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6 overflow-y-auto pb-10">
                <OverallPerformance
                  overallData={userPerformance.overall}
                  sectionsData={userPerformance.sections}
                />

                <SectionalSummary sections={userPerformance.sections} />
                <ComparisonAnalysis comparisons={userPerformance.comparisons} />
                <CognitiveSkills
                  skills={userPerformance.overall.cognitiveSkills}
                />

                <YourAttemptStrategy sections={userPerformance.sections} />
                {/**<TopperStrategy />*/}
                {<ActionableInsights />}
                {/*<LearningPlan
          summary={overallScores.aiSummary}
          plan={overallScores.learningPlan}
        />*/}

                {/**<Leaderboard
            leaderboard={userPerformance.leaderboard}
            currentUser={userPerformance.user}
            currentRank={userPerformance.overall.rank}
            currentScore={userPerformance.overall.score}
          />*/}
                <Leaderboard2
                  leaderboard={userPerformance.leaderboard}
                  currentUser={userPerformance.user}
                  currentRank={userPerformance.overall.rank}
                  currentScore={userPerformance.overall.score}
                />
              </div>
            </div>
            <ShareModal
              isOpen={isShareModalOpen}
              onClose={handleCloseShareModal}
              url={`https://www.youtube.com`}
            />
            {/* Test Feedback Modal */}
            <VideoFeedbackModal
              isOpen={isFeedbackOpen}
              onClose={() => setIsFeedbackOpen(false)}
              videoId={String(sessionId ?? "")}
              onSubmit={async () => Promise.resolve()}
              componentName="Test"
            />
          </div>
        </section>
        {/* --- RIGHT COLUMN: AI RECOMMENDATIONS --- */}
        <section className="lg:col-span-1 lg:sticky top-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Recommended Tests
          </h2>
          <div className="flex flex-col gap-5">
            {aiRecommendedTests.slice(0, 3).map((test) => (
              <AiTestCard key={test.id} test={test} />
            ))}
          </div>
        </section>
      </main>
      <div className="flex-shrink-0 p-2  border-t border-border">
        <div className="flex flex-row items-center gap-3">
          <button
            onClick={() => {
              const params = new URLSearchParams(location.search);
              const sid =
                (location.state as any)?.sessionId || params.get("sessionId");
              if (sid) {
                navigate(
                  `${ROUTES.TEST_MAIN_PAGE.replace(
                    ":id",
                    String(sid)
                  )}/solutions`
                );
              } else {
                navigate(ROUTES.TEST_SOLUTION.replace(":id", ""));
              }
            }}
            className="
    w-full flex-1 px-4 py-3 flex items-center justify-center gap-2 
    text-lg font-semibold rounded-lg backdrop-blur-sm border-1 transition-all 
    duration-300 text-white hover:opacity-90 bg-primary hover:bg-primary/80 cursor-pointer
  "
          >
            {/* Icon hidden on small screens */}
            <Text className="hidden sm:block w-5 h-5" />
            {/* Shorter text on mobile */}
            <span className="sm:inline hidden">Full Answer Review</span>
            <span className="inline sm:hidden">Review</span>
          </button>

          <button
            className="
    w-full flex-1 px-4 py-3 flex items-center justify-center gap-2 rounded-lg 
    text-lg font-semibold text-foreground bg-background border border-divider bg-card
    hover:bg-foreground/20 transition-transform transform focus:outline-none focus:shadow-sm cursor-pointer
  "
          >
            <RefreshCcw className="hidden sm:block w-5 h-5" />
            <span className="sm:inline hidden">Re-Attempt</span>
            <span className="inline sm:hidden">Retry</span>
          </button>

          <button
            className="
    w-full flex-1 px-4 py-3 flex items-center justify-center gap-2 rounded-lg 
    text-lg font-semibold text-foreground bg-background border border-divider bg-card 
    hover:bg-foreground/20 transition-transform transform focus:outline-none focus:shadow-sm cursor-pointer
  "
          >
            <span className="sm:inline hidden">Next Test</span>
            <span className="inline sm:hidden">Next</span>
            <ArrowRight className="hidden sm:block w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
