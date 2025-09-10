// @ts-nocheck
/* eslint-disable */
import StatsCard from "@/components/stats/Card";
import CardContent from "@/components/stats/CardContent";
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
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { quizApi } from "@/lib/api-client";

import { theme } from "@/styles/theme";
import ShareModal from "@/components/modals/ShareModal";
import VideoFeedbackModal from "@/components/feedback/VideoFeedbackModal";
import RankBadge from "@/components/stats/RankBadge";

interface LearningPlanStep {
  title: string;
  duration: number;
  action: string;
  goal?: string;
  aiTutorPrompt?: string;
}
interface CognitiveSkill {
  name: string;
  score: number;
  description: string;
}
// --- HELPER COMPONENTS & ICONS ---

// --- UI Component Placeholders ---

// --- MOCK DATA ---
let userPerformance: any = {
  user: {
    name: "Sagen Tiriya",
    message: "Keep Practicing!",
  },
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
// --- DATA TRANSFORMATIONS ---
const allTopics = Object.values(userPerformance.sections).flatMap(
  (s) => s.topics
);
const totalCorrect = allTopics.reduce((sum, t) => sum + t.correct, 0);
const totalAttempted = allTopics.reduce((sum, t) => sum + t.attempted, 0);
const totalQs = allTopics.reduce((sum, t) => sum + t.totalQs, 0);
const totalIncorrect = totalAttempted - totalCorrect;
const totalSkipped = totalQs - totalAttempted;
// --- CORE ANALYSIS COMPONENTS ---

const OverallPerformance = () => (
  <StatsCard
    tooltipText="A high-level summary of your scores, rank, and percentile in this test."
    className="md:col-span-4 md:row-span-2"
  >
    <CardContent>
      <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
        Overall Performance
      </h3>
      <div className="flex justify-center items-center my-6">
        <div className="flex flex-col  items-center justify-around gap-6">
          <ScoreDonutChart
            data={{
              overall: {
                score: (userPerformance as any)?.overall?.score ?? 0,
                color: '#0A84FF',
              },
            }}
            maxScore={(userPerformance as any)?.overall?.maxScore ?? 100}
          />
          <div className="w-full">
            <div className="grid grid-cols-2 gap-4 text-center mb-6">
              {Object.entries(userPerformance.sections).map(([name, data]) => {
                const section: any = data || {};
                const score = typeof section.score === 'number' ? section.score.toFixed(2) : String(section.score ?? '0');
                const maxScore = section.maxScore ?? '';
                return (
                  <div key={name} className="bg-background-subtle p-4 rounded-lg">
                    <p className="text-sm text-[#8e8e93]">{section.name ?? name}</p>
                    <p className={`text-3xl font-bold ${section.color ?? ''}`}>
                      {score}{" "}
                      <span className="text-lg text-[#636366]">/{maxScore}</span>
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 text-center">
              <SummaryItem
                value={String((userPerformance as any)?.overall?.rank ?? '')}
                label="Rank"
                total={String((userPerformance as any)?.overall?.maxRank ?? '')}
              />
              <SummaryItem
                value={typeof (userPerformance as any)?.overall?.percentile === 'number' ? (userPerformance as any).overall.percentile.toFixed(2) : String((userPerformance as any)?.overall?.percentile ?? '')}
                label="Percentile"
              />
              <SummaryItem
                value={typeof (userPerformance as any)?.overall?.accuracy === 'number' ? (userPerformance as any).overall.accuracy.toFixed(2) : String((userPerformance as any)?.overall?.accuracy ?? '')}
                label="Accuracy"
              />
              <SummaryItem
                value={String((userPerformance as any)?.overall?.time ?? '')}
                label="Time"
                total={String((userPerformance as any)?.overall?.maxTime ?? '')}
              />
            </div>

            <div className="mt-6">
              <div className="flex w-full h-2 rounded-full overflow-hidden bg-background-subtle">
                <div
                  className="bg-[#34C759]"
                  style={{ width: `${(totalCorrect / totalQs) * 100}%` }}
                  title={`Correct: ${totalCorrect}`}
                ></div>
                <div
                  className="bg-[#FF3B30]"
                  style={{ width: `${(totalIncorrect / totalQs) * 100}%` }}
                  title={`Incorrect: ${totalIncorrect}`}
                ></div>
                <div
                  className="bg-[#8e8e93]"
                  style={{ width: `${(totalSkipped / totalQs) * 100}%` }}
                  title={`Skipped: ${totalSkipped}`}
                ></div>
              </div>
              <div className="flex flex-wrap justify-between text-xs mt-2 px-1 gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#34C759]"></div>
                  <span className="text-[#c7c7cc]">
                    Correct: <b>{totalCorrect}</b>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#FF3B30]"></div>
                  <span className="text-[#c7c7cc]">
                    Incorrect: <b>{totalIncorrect}</b>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#8e8e93]"></div>
                  <span className="text-[#c7c7cc]">
                    Skipped: <b>{totalSkipped}</b>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </StatsCard>
);

const SectionalSummary = () => {
  const sectionTabs = Object.values(userPerformance.sections).map(
    (s) => s.name
  );
  const [activeTab, setActiveTab] = useState(sectionTabs[0]);
  const [isTopicAnalysisOpen, setTopicAnalysisOpen] = useState(true);

  const activeSection = Object.values(userPerformance.sections).find(
    (s) => s.name === activeTab
  );

  if (!activeSection) return null; // Or a loading/error state

  return (
    <StatsCard
      tooltipText="A detailed breakdown of your performance in each section."
      className="md:col-span-8"
    >
      <CardContent>
        <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
          Section-wise Analysis
        </h3>
        <div>
          <div className="flex bg-background-subtle rounded-lg p-1 space-x-1 mb-6">
            {sectionTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full py-2.5 text-sm font-semibold rounded-md transition-all duration-300 cursor-pointer ${
                  activeTab === tab
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:bg-accent"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex flex-col md:flex-row items-center justify-around gap-6">
            <div className="flex flex-col items-center justify-center p-2">
              <p className={`text-4xl font-bold ${activeSection?.color ?? ''}`}>
                {typeof activeSection?.score === 'number' ? activeSection.score.toFixed(2) : String(activeSection?.score ?? '0')}
                <span className="text-sm font-normal text-[#8e8e93]">
                  /{String(activeSection?.maxScore ?? '')}
                </span>
              </p>
              <p className="text-xs text-[#8e8e93] font-medium uppercase tracking-wider">
                Score
              </p>
            </div>
            <div className="w-full">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <SummaryItem
                  value={String(activeSection?.rank ?? '')}
                  label="Rank"
                  total={String(activeSection?.maxRank ?? '')}
                />
                <SummaryItem
                  value={typeof activeSection?.percentile === 'number' ? activeSection.percentile.toFixed(2) : String(activeSection?.percentile ?? '')}
                  label="Percentile"
                />
                <SummaryItem
                  value={typeof activeSection?.accuracy === 'number' ? activeSection.accuracy.toFixed(2) : String(activeSection?.accuracy ?? '')}
                  label="Accuracy"
                />
                <SummaryItem
                  value={String(activeSection?.time ?? '')}
                  label="Time"
                  total={String(activeSection?.maxTime ?? '')}
                />
              </div>
            </div>
          </div>
          <div className="border-t border-1 my-6"></div>

          <button
            onClick={() => setTopicAnalysisOpen(!isTopicAnalysisOpen)}
            className="flex justify-between items-center w-full cursor-pointer"
          >
            <h3 className="text-lg font-bold text-primary">
              See Topic-wise Breakdown
            </h3>
            <ArrowDown
              className={`text-[#8e8e93] transition-transform duration-300 ${
                isTopicAnalysisOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              isTopicAnalysisOpen ? "max-h-screen mt-4 " : "max-h-0"
            }`}
          >
            <div className="bg-background-subtle p-1 rounded-lg">
              <table className="w-full text-md text-left">
                <thead className="text-xs text-muted-foreground uppercase">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Topic
                    </th>
                    <th scope="col" className="px-4 py-3 text-center">
                      Score
                    </th>
                    <th scope="col" className="px-4 py-3 text-center">
                      Accuracy
                    </th>
                    <th scope="col" className="px-4 py-3 text-center">
                      Time
                    </th>
                    <th scope="col" className="px-4 py-3 text-center">
                      Correct
                    </th>

                    <th scope="col" className="px-4 py-3 text-center">
                      Skipped
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {activeSection.topics.map((topic) => (
                    <tr
                      key={topic.name}
                      className="border-b border-border last:border-b-0"
                    >
                      <th
                        scope="row"
                        className="px-4 py-4 font-medium whitespace-nowrap"
                      >
                        {topic.name}
                      </th>
                      <td className="px-4 py-4 text-center">
                        {topic.score.toFixed(2)}
                      </td>
                      <td
                        className={`px-4 py-4 text-center font-bold ${
                          topic.accuracy > 80
                            ? "text-[#34C759]"
                            : topic.accuracy > 60
                            ? "text-[#FFCC00]"
                            : "text-[#FF3B30]"
                        }`}
                      >
                        {topic.accuracy}%
                      </td>
                      <td className="px-4 py-4 text-center">{topic.time}</td>
                      <td className="px-4 py-4 text-center">{`${topic.correct}/${topic.attempted}`}</td>

                      <td className="block text-right relative py-2 md:table-cell md:text-center md:px-4 md:py-4">
                        <span className="font-bold text-[#8e8e93] md:hidden absolute left-0">
                          Skipped
                        </span>
                        {topic.totalQs - topic.attempted}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CardContent>
    </StatsCard>
  );
};

const ComparisonAnalysis = () => {
  const [activeTab, setActiveTab] = useState("Your Score");
  const tabs = [
    { id: "Your Score", icon: <Star className="w-4 h-4" /> },
    { id: "Accuracy", icon: <Target className="w-4 h-4" /> },
    { id: "Correct", icon: <Check className="w-4 h-4" /> },
    { id: "Incorrect", icon: <X className="w-4 h-4" /> },
    { id: "Time Spent", icon: <Clock className="w-4 h-4" /> },
  ];

  const chartData = userPerformance.comparisons.data[activeTab];
  const maxValue = userPerformance.comparisons.maxValues[activeTab];

  // FIX: Add a guard clause to prevent crash if data for a tab is not found.
  if (!chartData || !maxValue) {
    return (
      <StatsCard
        tooltipText="Compare your performance against the average and the topper across different metrics."
        className="lg:col-span-8"
      >
        <CardContent>
          <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
            Comparison Analysis
          </h3>
          <p className="text-muted-foreground">
            Comparison data is not available for the selected metric.
          </p>
        </CardContent>
      </StatsCard>
    );
  }

  const getGroupTotal = (groupData: any) => {
    if (!groupData) return 0;
    if (activeTab === "Time Spent") {
      const totalSeconds = Object.values(groupData).reduce((a: number, b: any) => a + Number(b || 0), 0);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }
    if (activeTab === "Accuracy") {
      const values = Object.values(groupData).map((v: any) => Number(v || 0));
      return (values.reduce((a: number, b: number) => a + b, 0) / (values.length || 1)).toFixed(2);
    }
    const total = Object.values(groupData).reduce((a: number, b: any) => a + Number(b || 0), 0);
    return Number.isInteger(total) ? total : total.toFixed(2);
  };

  const yAxisLabels = () => {
    const labels = [];
    for (let i = 4; i >= 0; i--) {
      const value = (maxValue / 4) * i;
      labels.push(
        <div key={i} className="text-md text-[#636366]">
          {activeTab === "Accuracy"
            ? `${Math.floor(value / 60)}%`
            : activeTab === "Time Spent"
            ? `${Math.floor(value / 60)}m`
            : Math.round(value)}
        </div>
      );
    }
    return labels;
  };

  const comparisonSections = [
    { key: "english", name: "English", color: "bg-[#0A84FF]" },
    { key: "numerical", name: "Numerical", color: "bg-[#FF3B30]" },
    { key: "reasoning", name: "Reasoning", color: "bg-[#FFCC00]" },
    { key: "generalAwareness", name: "GA", color: "bg-[#34C759]" },
  ];

  return (
    <StatsCard
      tooltipText="Compare your performance against the average and the topper across different metrics."
      className="lg:col-span-8"
    >
      <CardContent>
        <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
          Comparison Analysis
        </h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-1.5 px-3 sm:py-2 sm:px-4 text-sm font-semibold rounded-lg transition-colors duration-300 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "bg-background-subtle text-muted-foreground hover:bg-accent"
              }`}
            >
              {tab.icon}
              <span>{tab.id}</span>
            </button>
          ))}
        </div>

        <div className="flex">
          <div className="flex flex-col justify-between h-56 mr-4 text-right">
            {yAxisLabels()}
          </div>
          <div className="w-full flex flex-col">
            <div className="w-full h-56 relative border-b border-solid border-[#38383A]">
              <div className="absolute inset-0 grid grid-rows-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="border-t border-dashed border-[#38383A]"
                  ></div>
                ))}
              </div>
              <div className="absolute inset-0 flex justify-around items-end">
                {Object.keys(chartData).map((groupKey) => (
                  <div
                    key={groupKey}
                    className="w-1/3 h-full flex items-end justify-center space-x-1 px-1"
                  >
                    {comparisonSections.map((section) => (
                      <div
                        key={section.key}
                        className={`w-3 sm:w-5 rounded-t-md transition-all duration-500 ${section.color}`}
                        style={{
                          height: `${
                            (chartData[groupKey][section.key] / maxValue) * 100
                          }%`,
                        }}
                        title={`${section.name}: ${
                          chartData[groupKey][section.key]
                        }`}
                      ></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full flex justify-around">
              {Object.keys(chartData).map((groupKey) => (
                <div key={groupKey} className="text-center w-1/3 pt-2">
                  <p className="font-bold text-sm sm:text-md">
                    {getGroupTotal(chartData[groupKey])}
                  </p>
                  <p className="text-[#8e8e93] text-xs sm:text-sm mb-1 capitalize">
                    {groupKey}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 mt-4">
          {comparisonSections.map((section) => (
            <div key={section.key} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${section.color}`}></div>
              <span className="text-xs text-[#8e8e93] font-medium">
                {section.name}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </StatsCard>
  );
};

const DifficultyTimeGraph = ({ data, maxTime }) => {
  const width = 500;
  const height = 200;
  const padding = 35;

  const scaleX = (time) => (time / maxTime) * (width - padding * 2) + padding;
  const scaleY = (difficulty) =>
    height - padding - ((difficulty - 1) / 2) * (height - padding * 2.5);

  const createPath = (dataset) => {
    if (!dataset || dataset.length === 0) return "";
    let pathD = `M ${scaleX(dataset[0].time)} ${scaleY(dataset[0].difficulty)}`;
    dataset.slice(1).forEach((point) => {
      pathD += ` L ${scaleX(point.time)} ${scaleY(point.difficulty)}`;
    });
    return pathD;
  };

  const userPath = createPath(data.user);
  const topperPath = createPath(data.topper);
  const difficultyLevels = ["Easy", "Med", "Hard"];
  const timeLabels = Array.from({ length: 5 }, (_, i) =>
    Math.round(i * (maxTime / 4))
  );

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <g>
          {difficultyLevels.map((level, i) => {
            const y =
              height -
              padding -
              (i * (height - padding * 2.5)) / (difficultyLevels.length - 1);
            const colorClass = 
                level === 'Hard' ? 'text-red-500' :
                level === 'Med' ? 'text-yellow-500' :
                'text-green-500';

            return (
              <g key={level}>
                <text
                  x={padding - 8}
                  y={y + 4}
                  textAnchor="end"
                  className={`text-[10px] fill-current ${colorClass}`}
                >
                  {level}
                </text>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  className={`stroke-current ${colorClass}`}
                  strokeDasharray="2,2"
                />
              </g>
            );
          })}
          {timeLabels.map((time) => {
            const x = scaleX(time);
            return (
              <g key={time}>
                {" "}
                <text
                  x={x}
                  y={height - padding + 15}
                  textAnchor="middle"
                  className="text-xs fill-current text-[#636366]"
                >
                  {time}m
                </text>{" "}
              </g>
            );
          })}
        </g>
        <path
          d={userPath}
          className="stroke-current text-[#0A84FF]"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={topperPath}
          className="stroke-current text-[#FFCC00]"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <div className="flex justify-center space-x-4 text-xs">
        <div className="flex items-center space-x-1.5">
          {" "}
          <div className="w-3 h-3 rounded-full bg-[#0A84FF]"></div>{" "}
          <span className="text-[#8e8e93]">You</span>{" "}
        </div>
        <div className="flex items-center space-x-1.5">
          {" "}
          <div className="w-3 h-3 rounded-full bg-[#FFCC00]"></div>{" "}
          <span className="text-[#8e8e93]">Topper</span>{" "}
        </div>
      </div>
    </div>
  );
};

const YourAttemptStrategy = () => {
  const sectionTabs = Object.values(userPerformance.sections).map(
    (s) => s.name
  );
  const [activeGraphTab, setActiveGraphTab] = useState(sectionTabs[0]);

  const activeSection = Object.values(userPerformance.sections).find(
    (s) => s.name === activeGraphTab
  );
  const activeGraphData = activeSection?.difficultyTrend;

  if (!activeGraphData) return null;

  return (
    <StatsCard
      tooltipText="Analyze how you managed your time and questions compared to the topper."
      className="md:col-span-8 md:row-span-1"
    >
      <CardContent>
        {/**<h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
          Time Allocation vs Topper
        </h3><div className="space-y-4">
          {timeData.map((item) => (
            <div key={item.status}>
              <div className="flex justify-between items-center text-sm mb-1.5">
                <span className="font-semibold">
                  {item.status} ({item.questions})
                </span>
                <span className="text-[#8e8e93]">
                  {Math.floor(item.userTime / 60)}m {item.userTime % 60}s
                </span>
              </div>
              <div className="w-full bg-[#3a3a3c] rounded-full h-2 mb-1">
                <div
                  className={`${item.color} h-2 rounded-full`}
                  style={{ width: `${(item.userTime / totalUserTime) * 100}%` }}
                ></div>
              </div>
              <div className="w-full bg-[#3a3a3c] rounded-full h-2">
                <div
                  className="bg-[#FFCC00] h-2 rounded-full"
                  style={{
                    width: `${(item.topperTime / totalUserTime) * 100}%`,
                  }}
                ></div>
              </div>
              <div className="text-xs text-[#FFCC00] font-medium mt-1.5">
                Topper Time: {Math.floor(item.topperTime / 60)}m{" "}
                {item.topperTime % 60}s
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-1 my-6"></div>*/}
        <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
          Question Difficulty vs. Time
        </h3>
        <div className="flex bg-background-subtle rounded-lg p-1 space-x-1 text-sm">
          {sectionTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveGraphTab(tab)}
              className={`w-full py-2 px-1 font-semibold rounded-md transition-all duration-300 cursor-pointer ${
                activeGraphTab === tab
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:bg-accent"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <DifficultyTimeGraph
          data={activeGraphData}
          maxTime={activeGraphData.maxTime}
        />
      </CardContent>
    </StatsCard>
  );
};

const ReviewAndRelearn = () => (
  <div className="lg:col-span-12">
    <div className="flex flex-col sm:flex-row items-center gap-3">
      <button className="w-full flex-1 px-4 py-3 flex items-center justify-center gap-2 text-lg font-semibold rounded-lg backdrop-blur-sm border-1 transition-all duration-300 text-white hover:opacity-90 bg-primary hover:bg-primary/80 cursor-pointer">
        <Text className="w-5 h-5" />
        Full Answer Review
      </button>
      <button className="w-full flex-1 px-4 py-3 flex items-center justify-center gap-2 rounded-lg text-lg font-semibold text-foreground bg-background border border-divider hover:bg-foreground/20 transition-transform transform focus:outline-none focus:shadow-sm cursor-pointer">
        <RefreshCcw className="w-5 h-5" />
        Re-Attempt
      </button>
      <button className="w-full flex-1 px-4 py-3 flex items-center justify-center gap-2 rounded-lg text-lg font-semibold text-foreground bg-background border border-divider hover:bg-foreground/20 transition-transform transform focus:outline-none focus:shadow-sm cursor-pointer">
        Next Test
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  </div>
);

// --- SIDEBAR & OTHER COMPONENTS ---

const ActionableInsights = () => (
  <StatsCard
    tooltipText="Key takeaways and specific suggestions to improve your score."
    className="md:col-span-4 md:row-span-1"
  >
    <CardContent>
      <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
        <Sparkle className="w-7 h-7 text-primary mr-3" />
        <span>Actionable Insights</span>
      </h3>
      <div className="space-y-4 text-md">
        <div className="flex">
          {" "}
          <BicepsFlexed className="w-5 h-5 text-[#34C759] mr-3 mt-0.5 flex-shrink-0" />{" "}
          <div>
            {" "}
            <h3 className="font-bold text-[#34C759]">
              Strength Area: English Language
            </h3>{" "}
            <p className="text-[#8e8e93]">
              Your score of 21.25 with 87.32% accuracy is excellent. Your
              percentile of 95.80 in this section is your highest. Keep
              reinforcing this strength.
            </p>{" "}
          </div>{" "}
        </div>
        <div className="flex">
          {" "}
          <Siren className="w-5 h-5 text-[#FF3B30] mr-3 mt-0.5 flex-shrink-0" />{" "}
          <div>
            {" "}
            <h3 className="font-bold text-[#FF3B30]">
              Improvement Area: Pacing in Reasoning
            </h3>{" "}
            <p className="text-[#8e8e93]">
              You spent 22 minutes in the Reasoning section, exceeding the
              20-minute allocation. This extra time could be better used in
              other sections. Focus on timed practice for Reasoning topics.
            </p>{" "}
          </div>{" "}
        </div>
        <div className="flex">
          {" "}
          <Target className="w-5 h-5 text-[#0A84FF] mr-3 mt-0.5 flex-shrink-0" />{" "}
          <div>
            {" "}
            <h3 className="font-bold text-[#0A84FF]">
              Focus Topic: General Awareness
            </h3>{" "}
            <p className="text-[#8e8e93]">
              With 76.25% accuracy in GA, there's scope for improvement.
              Focusing on Current Affairs and Static GK could provide a
              significant boost to your overall score.
            </p>{" "}
          </div>{" "}
        </div>
      </div>
    </CardContent>
  </StatsCard>
);
const ProgressBar: React.FC<{
  value: number;
  color: string;
  height?: string;
}> = ({ value, color, height = "8px" }) => (
  <div
    className="bg-border-high"
    style={{
      borderRadius: "4px",
      overflow: "hidden",
      height,
    }}
  >
    <div
      style={{
        width: `${value}%`,
        backgroundColor: color,
        height,
        borderRadius: "4px",
        transition: "width 0.5s ease-in-out",
      }}
    />
  </div>
);
const CognitiveSkills: React.FC<{
  skills: CognitiveSkill[];
}> = ({ skills }) => (
  <StatsCard
    className="lg:col-span-4"
    tooltipText="An analysis of your cognitive abilities based on your test performance."
  >
    <CardContent>
      <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
        Cognitive Skill Profile
      </h3>
      <div>
        {skills.map((skill) => (
          <div key={skill.name} style={{ marginBottom: "1rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.25rem",
              }}
            >
              <p style={{ margin: 0, fontWeight: 600, fontSize: "0.9rem" }}>
                {skill.name}
              </p>
              <p
                className="text-primary"
                style={{
                  margin: 0,
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              >
                {skill.score}%
              </p>
            </div>

            <ProgressBar
              value={skill.score}
              color={theme.buttonGradientFrom}
              height="8px"
            />

            <p
              style={{
                margin: "0.5rem 0 0 0",
                fontSize: "0.8rem",
              }}
            >
              {skill.description}
            </p>
          </div>
        ))}
      </div>
    </CardContent>
  </StatsCard>
);

const LearningPlan: React.FC<{
  summary: string;
  plan: LearningPlanStep[];
  isMobile: boolean;
}> = ({ summary, plan }) => (
  <StatsCard className="md:col-span-4 md:row-span-1">
    <CardContent>
      <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
        Your AI-Powered Learning Plan
      </h3>
      <div
        style={{
          backgroundColor: theme.accentLight,
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "1.5rem",
        }}
      >
        <p style={{ margin: 0, color: theme.accent, fontStyle: "italic" }}>
          "{summary}"
        </p>
      </div>
      <div>
        {plan.map((step, index) => (
          <div
            key={index}
            style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  backgroundColor: theme.accent,
                  color: theme.primaryText,
                  display: "grid",
                  placeItems: "center",
                  fontWeight: "bold",
                }}
              >
                {index + 1}
              </div>
              {index < plan.length - 1 && (
                <div
                  style={{
                    width: "2px",
                    flex: 1,
                    backgroundColor: theme.divider,
                    marginTop: "0.5rem",
                  }}
                />
              )}
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 600 }}>
                {step.title}{" "}
                <span style={{ color: theme.mutedText, fontWeight: 400 }}>
                  {" "}
                  (Est. {step.duration} mins)
                </span>
              </p>
              <p style={{ margin: "0.25rem 0", color: theme.secondaryText }}>
                {step.action}
              </p>
              {step.goal && (
                <p
                  style={{
                    margin: "0.25rem 0",
                    fontSize: "0.9rem",
                    color: theme.green,
                  }}
                >
                  <b>Goal:</b> {step.goal}
                </p>
              )}
              {step.aiTutorPrompt && (
                <p
                  style={{
                    margin: "0.25rem 0",
                    fontSize: "0.9rem",
                    backgroundColor: theme.inputBackground,
                    padding: "0.5rem",
                    borderRadius: "4px",
                  }}
                >
                  <b>AI Tutor Prompt:</b> {step.aiTutorPrompt}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </StatsCard>
);

const TopperStrategy = () => (
  <StatsCard tooltipText="Learn from the best! See how the topper approached the test.">
    <CardContent>
      <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
        Topper's Strategy
      </h3>
      <ul className="space-y-3 text-sm list-disc list-inside text-[#8e8e93]">
        <li>
          The topper scored{" "}
          <span className="font-bold text-[#0A84FF]">95.25</span> by attempting{" "}
          <span className="font-bold text-[#0A84FF]">97</span> questions.
        </li>
        <li>
          They achieved nearly perfect accuracy in Reasoning and Numerical
          Ability (<span className="font-bold text-[#0A84FF]">&gt;95%</span>).
        </li>
        <li>
          Their time on incorrect questions was only{" "}
          <span className="font-bold text-[#0A84FF]">2 minutes</span>,
          minimizing time lost on wrong answers.
        </li>
      </ul>
    </CardContent>
  </StatsCard>
);

const Leaderboard = () => {
  const leaderboardData = (userPerformance as any)?.leaderboard || [];
  const currentUser = (userPerformance as any)?.user || { name: '' };
  const chunkSize = 5;
  const column1 = leaderboardData.slice(0, chunkSize);
  const column2 = leaderboardData.slice(chunkSize, chunkSize * 2);
  // Helper function to determine badge styles based on rank
  const getBadgeClasses = (rank) => {
    switch (rank) {
      case 1: // Gold
        return "#FFD60A";
      case 2: // Silver
        return "#C0C0C0";
      case 3: // Bronze
        return "#CD7F32";
      default:
        if (rank >= 4 && rank <= 10) {
          // Iron
          return "#43464B";
        }
        return "#5A5A5A"; // Default
    }
  };

  // A reusable component for each user row in the leaderboard
  const UserRow = ({ user }: { user: any }) => (
    <div
      key={user.rank}
      className="flex items-center justify-between text-lg  rounded-lg hover:bg-accent transition-colors duration-200"
    >
      <div className="flex items-center space-x-3">
        
          <RankBadge color={getBadgeClasses(user.rank)} number={user.rank}/>
        <div className="font-semibold text-foreground flex items-center">
          {user.name}
          {user.rank === 1 && (
            <Crown className="w-4 h-4 ml-1.5 text-[#FFD60A]" />
          )}
        </div>
      </div>
      <span className="font-bold text-primary tracking-wider">
        {typeof user.score === 'number' ? user.score.toFixed(2) : String(user.score ?? '0')}
      </span>
    </div>
  );
  return (
    <StatsCard
      tooltipText="See where you stand among the top performers in this test."
      className="md:col-span-8 md:row-span-1"
    >
      <CardContent>
        <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
          Leaderboard
        </h3>

        {/* Leaderboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
          {/* Column 1 */}
          <div className="space-y-2">
            {column1.map((user) => (
              <UserRow key={user.rank} user={user} />
            ))}
          </div>
          {/* Column 2 */}
          <div className="space-y-2 mt-2 md:mt-0">
            {column2.map((user) => (
              <UserRow key={user.rank} user={user} />
            ))}
          </div>
        </div>

        {/* Your current user row below */}
        <div className="p-1">
          <div className="border-t border-1 my-2"></div>
        </div>
        {/* Current User Row */}
        <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-accent border border-primary/50">
          <div className="flex items-center space-x-3">
            <RankBadge color={getBadgeClasses(userPerformance.overall.rank)} number={userPerformance.overall.rank}/>
            <div className="font-semibold text-gray-100 flex items-center space-x-2">
              <p className="font-bold text-lg text-foreground">
                {currentUser.name}
              </p>
              <p className=" text-primary font-medium mt-0.5">
                {currentUser.message}
              </p>
            </div>
          </div>
          <span className="font-bold text-primary tracking-wider">
            {userPerformance.overall.score.toFixed(2)}
          </span>
        </div>
      </CardContent>
    </StatsCard>
  );
};

// --- SHARED UTILITY COMPONENTS ---

const SummaryItem = ({ value, label, total }) => (
  <div className="flex flex-col items-center justify-center p-2">
    <p className="text-xs text-[#8e8e93] font-medium uppercase tracking-wider">
      {label}
    </p>
    <p className="text-lg font-bold">
      {value}
      {total && (
        <span className="text-sm font-normal text-[#8e8e93]">/{total}</span>
      )}
    </p>
  </div>
);

const ScoreDonutChart = ({ data, size = 200, maxScore = 100 }) => {
  // Convert the data object into an array suitable for mapping.
  // It also parses the color string to ensure it's a valid hex code.
  const scoresArray = Object.entries(data).map(([label, { score, color }]) => {
    const hexMatch = color.match(/#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/);
    return {
      label,
      value: score,
      color: hexMatch ? hexMatch[0] : "#FFFFFF", // default to white if color parse fails
    };
  });

  // Calculate the current total score for display.
  const currentScore = scoresArray.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
  let cumulative = 0; // Used to stack the segments of the chart correctly.

  // Define the chart's dimensions and properties.
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: size, height: size }}
    >
      {/* The SVG container for the chart */}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* The background circle for the donut chart */}
        <circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          stroke={"#3a3a3c"} // A dark gray background track
          strokeWidth={strokeWidth}
        />
        {/* Map through the scores to create each colored segment */}
        {scoresArray.map((item, index) => {
          if (item.value <= 0) return null; // Don't render segments with no value.

          const dasharray = (item.value / maxScore) * circumference;
          // NEW LOGIC: Calculate rotation for each segment instead of using offset.
          const rotation = (cumulative / maxScore) * 360;

          // Add the current item's value to the cumulative total for the next iteration.
          cumulative += item.value;

          return (
            <circle
              key={index}
              r={radius}
              cx={size / 2}
              cy={size / 2}
              fill="transparent"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              // The dash array now only needs the segment length and the rest of the circle
              strokeDasharray={`${dasharray} ${circumference}`}
              // The transform now rotates each segment into its correct position.
              // We start with -90 degrees to make the circle start at the top.
              transform={`rotate(${rotation - 90} ${size / 2} ${size / 2})`}
              className="transition-all duration-500"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm text-[#8e8e93] font-medium">Total Score</span>
        <span className="text-5xl font-bold">{currentScore.toFixed(0)}</span>
        <span className="text-2xl text-[#8e8e93] font-medium">/100</span>
      </div>
    </div>
  );
};
// --- MAIN APP COMPONENT ---

export default function TestAnalysis2() {
  const [isShareOpen, setShareOpen] = useState(false);
  const location = useLocation();
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<Record<string, unknown> | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Resolve sessionId from router state or from query string
  const sessionId = useMemo(() => {
    const fromState = (location.state as any)?.sessionId;
    if (fromState) return Number(fromState);
    const params = new URLSearchParams(location.search);
    const fromQuery = params.get("sessionId");
    return fromQuery ? Number(fromQuery) : undefined;
  }, [location.state, location.search]);

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
        if (data && typeof data === 'object') {
          const d: any = data;
          // Example mapping – adjust keys based on your API
          userPerformance = {
            user: { name: d?.user?.name || "Student", message: d?.message || "" },
            leaderboard: d?.leaderboard || userPerformance.leaderboard,
            overall: {
              score: d?.overall?.score ?? userPerformance.overall.score,
              maxScore: d?.overall?.maxScore ?? userPerformance.overall.maxScore,
              rank: d?.overall?.rank ?? userPerformance.overall.rank,
              maxRank: d?.overall?.maxRank ?? userPerformance.overall.maxRank,
              percentile: d?.overall?.percentile ?? userPerformance.overall.percentile,
              accuracy: d?.overall?.accuracy ?? userPerformance.overall.accuracy,
              time: d?.overall?.time ?? userPerformance.overall.time,
              maxTime: d?.overall?.maxTime ?? userPerformance.overall.maxTime,
              negativeMarks: d?.overall?.negativeMarks ?? userPerformance.overall.negativeMarks,
              cutoff: d?.overall?.cutoff ?? userPerformance.overall.cutoff,
              cognitiveSkills: d?.overall?.cognitiveSkills ?? userPerformance.overall.cognitiveSkills,
              aiSummary: d?.overall?.aiSummary ?? userPerformance.overall.aiSummary,
              learningPlan: d?.overall?.learningPlan ?? userPerformance.overall.learningPlan,
            },
            sections: d?.sections ?? userPerformance.sections,
            comparisons: d?.comparisons ?? userPerformance.comparisons,
          };
        }
      } catch (e: any) {
        
        setAnalysisError(e?.message || "Failed to load analysis");
      } finally {
        setIsLoadingAnalysis(false);
        // Open feedback modal once analysis is available
        setIsFeedbackOpen(true);
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
      <div className="p-4 sm:p-6 bg-background min-h-screen font-sans text-foreground mt-10 sm:mt-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Fetching analysis...</p>
        </div>
      </div>
    );
  }

  if (sessionId && analysisError) {
    return (
      <div className="p-4 sm:p-6 bg-background min-h-screen font-sans text-foreground mt-10 sm:mt-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-3">{analysisError}</p>
          <p className="text-sm text-muted-foreground">Try reloading the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-background min-h-screen font-sans text-foreground mt-10 sm:mt-4">
      {isLoadingAnalysis && (
        <div className="max-w-7xl mx-auto mb-4">
          <div className="text-sm text-muted-foreground">Loading analysis...</div>
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
      <div className="max-w-7xl mx-auto">
        <div className="lg:col-span-12 flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold">
              Detailed Test Report
            </h1>
            <div className="relative">
              <button
                onClick={() => setShareOpen(!isShareOpen)}
                className="flex border-1 items-center space-x-2 bg-background text-foreground font-semibold p-2.5 rounded-lg hover:bg-foreground/20 transition cursor-pointer"
              >
                <Share className="w-5 h-5" />
              </button>
              {isShareOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-background-subtle border border-border rounded-lg shadow-xl z-10">
                  <a onClick={handleShare}
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
          <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 text-muted-foreground mt-2 md:mt-0 text-sm sm:text-base">
            <h3 className="text-left">
              IBPS Clerk Pre 2025 Full Mock Test - 02
            </h3>
            <span className="hidden sm:block">|</span>
            <h3 className="text-left">Attempted on 27/08/25</h3>
          </div>
        </div>
        <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6">
          <OverallPerformance />
          <SectionalSummary />
          <ComparisonAnalysis />
          <CognitiveSkills skills={userPerformance.overall.cognitiveSkills} />

          <YourAttemptStrategy />
          {/**<TopperStrategy />*/}
          <ActionableInsights />
          {/*<LearningPlan
          summary={overallScores.aiSummary}
          plan={overallScores.learningPlan}
        />*/}

          <Leaderboard />
          <ReviewAndRelearn />
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
      </div>
    </div>
  );
}
