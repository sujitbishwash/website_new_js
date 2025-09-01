import React, { useState } from "react";

// --- HELPER COMPONENTS & ICONS ---

const Icon = ({ path, className = "w-6 h-6", solid = false }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    fill={solid ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={path} />
  </svg>
);

const ICONS = {
  trophy: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  percent:
    "M19 14c1.49-1.49 2.37-3.37 2.62-5.38.26-2-.25-4-1.38-5.62S17.96.25 16 0c-1.49 1.49-2.37 3.37-2.62 5.38-.26 2 .25 4 1.38 5.62s2.62 2.75 4.24 2.88c.4.02.79.02 1.18 0 .1.38.19.76.28 1.14M5 10c-1.49 1.49-2.37 3.37-2.62 5.38-.26 2 .25 4 1.38 5.62s2.62 2.75 4.24 2.88c.4.02.79.02 1.18 0 .1-.38.19-.76.28-1.14",
  target:
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z",
  clock:
    "M22 12h-4M6 12H2m14-5.66L17.66 4M8.34 19.66L6.34 17.66m13.32 0l-2-2M8.34 4.34l2 2m-4.24 9.42 A6 6 0 1 1 12 6 a6 6 0 0 1 0 12z",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  crown: "M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 0H5",
  arrowLeft: "M19 12H5m7 7l-7-7 7-7",
  chart: "M3 12l3-3 4 4 9-9",
  book: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
  summary:
    "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
  lightbulb:
    "M9 19c-1.14 0-2.28-.49-3.08-1.39S4.2 15.93 4 14.8c-.28-1.5.28-3.03 1.39-4.14S8.1 9 9.6 9h4.8c1.5 0 2.97.56 4.08 1.67s1.67 2.58 1.39 4.14c-.2 1.13-.89 2.17-1.7 2.97S16.14 19 15 19H9zM9 4.9a.9.9 0 01.9-.9h4.2a.9.9 0 01.9.9v2.1a.9.9 0 01-.9.9H9.9a.9.9 0 01-.9-.9V4.9z",
  arrowUp: "M17 7l-5-5-5 5h10z",
  arrowDown: "M7 17l5 5 5-5H7z",
  chevronDown: "M6 9l6 6 6-6",
  share: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8m-4-6l-4-4-4 4m4-4v12",
  link: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
  twitter:
    "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z",
  check: "M20 6 9 17l-5-5",
  x: "M18 6 6 18m0-12 12 12",
};

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-[#2c2c2e] rounded-2xl p-6 border border-[#38383A] ${className}`}
  >
    {children}
  </div>
);

// --- MOCK DATA ---
const leaderboardData = [
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
];
const currentUser = {
  rank: 167,
  name: "Sagen Tiriya",
  score: 59.75,
  message: "Keep Practicing!",
};
const questionData = [
  { label: "Correct", value: 62, color: "#34C759" },
  { label: "Incorrect", value: 9, color: "#FF3B30" },
  { label: "Unattempted", value: 29, color: "#636366" },
];
const questionData2 = [
  { label: "english", value: 21, color: "#34C759" },
  { label: "numerical", value: 23, color: "#FF3B30" },
  { label: "reasoning", value: 27, color: "#636366" },
];
const sectionScores = {
  "English Language": { score: 21.25, maxScore: 30, color: "text-[#0A84FF]" },
  "Numerical Ability": { score: 18.5, maxScore: 35, color: "text-[#FF3B30]" },
  "Reasoning": { score: 20.0, maxScore: 35, color: "text-[#FFCC00]" },
  "General Awareness": { score: 15.25, maxScore: 40, color: "text-[#34C759]" },
};

const difficultyData = {
  "English Language": {
    maxTime: 20,
    user: [
      { time: 0, difficulty: 1.2 },
      { time: 5, difficulty: 1.8 },
      { time: 10, difficulty: 2.5 },
      { time: 16, difficulty: 2.1 },
    ],
    topper: [
      { time: 0, difficulty: 2.0 },
      { time: 5, difficulty: 2.8 },
      { time: 10, difficulty: 2.2 },
      { time: 15, difficulty: 1.5 },
    ],
  },
  "Numerical Ability": {
    maxTime: 20,
    user: [
      { time: 0, difficulty: 2.0 },
      { time: 8, difficulty: 2.8 },
      { time: 15, difficulty: 3.0 },
      { time: 18, difficulty: 2.5 },
    ],
    topper: [
      { time: 0, difficulty: 3.0 },
      { time: 7, difficulty: 2.5 },
      { time: 12, difficulty: 2.0 },
      { time: 18, difficulty: 1.8 },
    ],
  },
  Reasoning: {
    maxTime: 22, // user went over time
    user: [
      { time: 0, difficulty: 2.2 },
      { time: 10, difficulty: 3.0 },
      { time: 18, difficulty: 2.8 },
      { time: 22, difficulty: 2.6 },
    ],
    topper: [
      { time: 0, difficulty: 2.5 },
      { time: 8, difficulty: 2.9 },
      { time: 15, difficulty: 2.1 },
      { time: 20, difficulty: 1.9 },
    ],
  },
  "General Awareness": {
    maxTime: 15,
    user: [
      { time: 0, difficulty: 1.0 },
      { time: 3, difficulty: 1.5 },
      { time: 7, difficulty: 1.8 },
      { time: 10, difficulty: 1.3 },
    ],
    topper: [
      { time: 0, difficulty: 1.8 },
      { time: 4, difficulty: 1.2 },
      { time: 8, difficulty: 1.5 },
      { time: 12, difficulty: 1.0 },
    ],
  },
};
// --- CORE ANALYSIS COMPONENTS ---
const ScoreDonutChart = ({ data, size = 200 }) => {
  const scoresArray = Object.entries(data).map(([label, { score, color }]) => {
    const hexMatch = color.match(/#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/);
    return {
      label,
      value: score,
      color: hexMatch ? hexMatch[0] : "#FFFFFF", // default to white if color parse fails
    };
  });

  const total = scoresArray.reduce((sum, item) => sum + item.value, 0);
  let cumulative = 0;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          stroke={"#3a3a3c"}
          strokeWidth={strokeWidth}
        />
        {scoresArray.map((item, index) => {
          if (item.value <= 0) return null;
          const dashoffset =
            circumference - (cumulative / total) * circumference;
          const dasharray = (item.value / total) * circumference;
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
              strokeDasharray={`${dasharray} ${circumference - dasharray}`}
              strokeDashoffset={-dashoffset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              className="transition-all duration-500"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm text-[#8e8e93] font-medium">Total Score</span>
        <span className="text-5xl font-bold text-white">
          {total.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

const OverallPerformance = () => (
  <Card>
    <div className="flex items-center justify-between">
      <div className="flex items-center text-2xl font-bold mb-1 text-white ">
        <span className="font-bold text-md">Overall Performance</span>
      </div>
    </div>
    <div className="flex justify-center items-center my-6">
      <div className="flex flex-col md:flex-row items-center justify-around gap-6">
        <div className="flex justify-center">
          <ScoreDonutChart data={sectionScores} />
        </div>
        <DonutChart2 data={questionData2} />
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center mb-6">
            {Object.entries(sectionScores).map(([name, data]) => (
              <div key={name} className="bg-[#3a3a3c] p-4 rounded-lg">
                <p className="text-sm text-[#8e8e93]">{name}</p>
                <p className={`text-3xl font-bold ${data.color}`}>
                  {data.score.toFixed(2)}{" "}
                  <span className="text-lg text-[#636366]">
                    /{data.maxScore}
                  </span>
                </p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <SummaryItem
              icon={
                <Icon path={ICONS.trophy} className="w-8 h-8 text-[#FFCC00]" />
              }
              value="3,093"
              label="Rank"
              total="5,978"
            />
            <SummaryItem
              icon={
                <Icon path={ICONS.percent} className="w-8 h-8 text-[#0A84FF]" />
              }
              value="48.30"
              label="Percentile"
            />
            <SummaryItem
              icon={
                <Icon path={ICONS.target} className="w-8 h-8 text-[#0A84FF]" />
              }
              value="87.32"
              label="Accuracy"
            />
            <SummaryItem
              icon={
                <Icon path={ICONS.clock} className="w-8 h-8 text-[#0A84FF]" />
              }
              value="56:14"
              label="Time"
              total="60:00"
            />
          </div>
        </div>
      </div>
    </div>
  </Card>
);

const SectionalSummary = () => {
  const [activeTab, setActiveTab] = useState("English Language");
  const [isTopicAnalysisOpen, setTopicAnalysisOpen] = useState(true);
  const tabs = [
    "English Language",
    "Numerical Ability",
    "Reasoning",
    "General Awareness",
  ];
  const summaryData = {
    "English Language": {
      score: 21.25,
      maxScore: 30,
      rank: 255,
      maxRank: 5978,
      percentile: 95.8,
      accuracy: 87.32,
      time: "16:25",
      maxTime: "20:00",
      negativeMarks: 5.75,
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
    },
    "Numerical Ability": {
      score: 18.5,
      maxScore: 35,
      rank: 450,
      maxRank: 5978,
      percentile: 92.47,
      accuracy: 80.15,
      time: "18:10",
      maxTime: "20:00",
      negativeMarks: 4.25,
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
    },
    Reasoning: {
      score: 20.0,
      maxScore: 35,
      rank: 310,
      maxRank: 5978,
      percentile: 94.81,
      accuracy: 85.0,
      time: "22:00",
      maxTime: "20:00",
      negativeMarks: 3.5,
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
    },
    "General Awareness": {
      score: 15.25,
      maxScore: 40,
      rank: 520,
      maxRank: 5978,
      percentile: 91.3,
      accuracy: 76.25,
      time: "10:00",
      maxTime: "15:00",
      negativeMarks: 1.25,
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
    },
  };
  const data = summaryData[activeTab];

  return (
    <div>
      <div className="flex bg-[#3a3a3c] rounded-lg p-1 space-x-1 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full py-2.5 text-sm font-semibold rounded-md transition-all duration-300 ${
              activeTab === tab
                ? "bg-[#2c2c2e] text-white"
                : "text-[#8e8e93] hover:bg-[#4a4a4c]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-4xl font-bold text-[#34C759]">
            {data.score}
          </span>
          <span className="text-[#8e8e93]">/{data.maxScore}</span>
        </div>
        <div className="bg-[#FF3B30]/10 text-[#FF3B30] font-semibold px-3 py-1 rounded-full text-xs">
          -{data.negativeMarks} Marks
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <SummaryItem
          icon={<Icon path={ICONS.trophy} className="w-8 h-8 text-[#FFCC00]" />}
          value={data.rank.toLocaleString()}
          label="Rank"
          total={data.maxRank.toLocaleString()}
        />
        <SummaryItem
          icon={
            <Icon path={ICONS.percent} className="w-8 h-8 text-[#0A84FF]" />
          }
          value={data.percentile.toFixed(2)}
          label="Percentile"
        />
        <SummaryItem
          icon={<Icon path={ICONS.target} className="w-8 h-8 text-[#0A84FF]" />}
          value={data.accuracy.toFixed(2)}
          label="Accuracy"
        />
        <SummaryItem
          icon={<Icon path={ICONS.clock} className="w-8 h-8 text-[#0A84FF]" />}
          value={data.time}
          label="Time"
          total={data.maxTime}
        />
      </div>
      <div className="border-t border-[#38383A] my-6"></div>

      <button
        onClick={() => setTopicAnalysisOpen(!isTopicAnalysisOpen)}
        className="flex justify-between items-center w-full"
      >
        <h3 className="text-lg font-bold text-white">
          Topic-wise Analysis for {activeTab}
        </h3>
        <Icon
          path={ICONS.chevronDown}
          className={`w-5 h-5 text-[#8e8e93] transition-transform duration-300 ${
            isTopicAnalysisOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isTopicAnalysisOpen ? "max-h-screen mt-4 " : "max-h-0"
        }`}
      >
        <div className="bg-[#3a3a3c] p-1 rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[#8e8e93] uppercase">
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
              </tr>
            </thead>
            <tbody>
              {data.topics.map((topic) => (
                <tr
                  key={topic.name}
                  className="border-b border-[#2c2c2e] last:border-b-0"
                >
                  <th
                    scope="row"
                    className="px-4 py-4 font-medium text-white whitespace-nowrap"
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const PerformanceDeepDive = () => (
  <Card>
    <div className="border-b border-[#38383A] pb-4 mb-6">
      <h2 className="text-2xl font-bold text-white">Sectional Analysis</h2>
    </div>
    <SectionalSummary />
  </Card>
);

const ComparisonAnalysis = () => {
  const [activeTab, setActiveTab] = useState("Your Score");
  const tabs = [
    { id: "Your Score", icon: ICONS.star },
    { id: "Accuracy", icon: ICONS.target },
    { id: "Correct", icon: ICONS.check },
    { id: "Incorrect", icon: ICONS.x },
    { id: "Time Spent", icon: ICONS.clock },
  ];
  const comparisonData = {
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
      you: { english: 87, numerical: 80, reasoning: 85, generalAwareness: 76 },
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
      you: { english: 22, numerical: 20, reasoning: 20, generalAwareness: 15 },
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
      you: { english: 4, numerical: 3, reasoning: 2, generalAwareness: 5 },
      average: { english: 6, numerical: 7, reasoning: 5, generalAwareness: 7 },
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
  };
  const chartData = comparisonData[activeTab];
  const maxValues = {
    "Your Score": 35,
    Accuracy: 100,
    Correct: 35,
    Incorrect: 10,
    "Time Spent": 1320,
  };
  const maxValue = maxValues[activeTab];
  const sections = [
    { key: "english", name: "English", color: "bg-[#0A84FF]" },
    { key: "numerical", name: "Numerical", color: "bg-[#FF3B30]" },
    { key: "reasoning", name: "Reasoning", color: "bg-[#FFCC00]" },
    { key: "generalAwareness", name: "GA", color: "bg-[#34C759]" },
  ];
  const getGroupTotal = (groupData) => {
    if (activeTab === "Time Spent") {
      const totalSeconds = Object.values(groupData).reduce((a, b) => a + b, 0);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }
    if (activeTab === "Accuracy") {
      const values = Object.values(groupData);
      return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
    }
    return Object.values(groupData)
      .reduce((a, b) => a + b, 0)
      .toFixed(2);
  };

  const yAxisLabels = () => {
    const labels = [];
    for (let i = 4; i >= 0; i--) {
      const value = (maxValue / 4) * i;
      labels.push(
        <div key={i} className="text-xs text-[#636366]">
          {activeTab === "Time Spent"
            ? `${Math.floor(value / 60)}m`
            : Math.round(value)}
        </div>
      );
    }
    return labels;
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold text-white mb-6">
        Comparison Analysis
      </h2>
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 py-2 px-4 text-sm font-semibold rounded-lg transition-colors duration-300 ${
              activeTab === tab.id
                ? "bg-[#0A84FF] text-white"
                : "bg-[#3a3a3c] text-[#8e8e93] hover:bg-[#4a4a4c]"
            }`}
          >
            <Icon path={tab.icon} className="w-4 h-4" />
            <span>{tab.id}</span>
          </button>
        ))}
      </div>

      <div className="flex items-end">
        <div className="flex flex-col justify-between h-56 mr-2 text-right">
          {yAxisLabels()}
        </div>
        <div className="w-full h-56 relative">
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
                className="text-center w-1/3 h-full flex flex-col"
              >
                <div className="flex-grow flex items-end justify-center space-x-1">
                  {sections.map((section) => (
                    <div
                      key={section.key}
                      className={`w-8 rounded-t-md transition-all duration-500 ${section.color}`}
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
                <div>
                  <p className="font-bold text-md text-white mt-2">
                    {getGroupTotal(chartData[groupKey])}
                  </p>
                  <p className="text-[#8e8e93] text-sm mb-1 capitalize">
                    {groupKey}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center space-x-6 mt-4">
        {sections.map((section) => (
          <div key={section.key} className="flex items-center space-x-2">
            {" "}
            <div className={`w-3 h-3 rounded-full ${section.color}`}></div>{" "}
            <span className="text-xs text-[#8e8e93] font-medium">
              {section.name}
            </span>{" "}
          </div>
        ))}
      </div>
    </Card>
  );
};

const DifficultyTimeGraph = ({ data, maxTime }) => {
  const width = 320;
  const height = 180;
  const padding = 25;

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
  const difficultyLevels = ["Easy", "Medium", "Hard"];
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
            return (
              <g key={level}>
                {" "}
                <text
                  x={padding - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-xs fill-current text-[#636366]"
                >
                  {level}
                </text>{" "}
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  className="stroke-current text-[#38383A]"
                  strokeDasharray="2,2"
                />{" "}
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
      <div className="flex justify-center space-x-4 mt-2 text-xs">
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
  const [activeGraphTab, setActiveGraphTab] = useState("English Language");
  const graphTabs = [
    "English Language",
    "Numerical Ability",
    "Reasoning",
    "General Awareness",
  ];
  const activeGraphData = difficultyData[activeGraphTab];
  const timeData = [
    {
      status: "Correct",
      userTime: 2160,
      topperTime: 2040,
      questions: 62,
      color: "bg-[#34C759]",
    },
    {
      status: "Incorrect",
      userTime: 654,
      topperTime: 120,
      questions: 9,
      color: "bg-[#FF3B30]",
    },
    {
      status: "Unattempted",
      userTime: 560,
      topperTime: 960,
      questions: 29,
      color: "bg-[#636366]",
    },
  ];
  const totalUserTime = timeData.reduce((sum, d) => sum + d.userTime, 0);

  return (
    <Card>
      {/**<h2 className="text-xl font-bold mb-4 text-white">
        Your Attempt Strategy
      </h2>
      <div className="flex flex-col md:flex-row items-center justify-around gap-6">
        <DonutChart data={questionData} />
        <div className="w-full">
          {questionData.map((item) => (
            <div key={item.label} className="flex items-center space-x-3 mb-2">
              <div
                style={{ backgroundColor: item.color }}
                className="w-3 h-3 rounded-full flex-shrink-0"
              ></div>
              <div className="flex justify-between w-full text-sm">
                <span className="font-semibold text-white">{item.label}</span>
                <span className="text-[#8e8e93]">{item.value} Qs</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t border-[#38383A] my-6"></div>*/}
      <h3 className="text-lg font-bold mb-4 text-white">
        Time Allocation vs Topper
      </h3>
      <div className="space-y-4">
        {timeData.map((item) => (
          <div key={item.status}>
            <div className="flex justify-between items-center text-sm mb-1.5">
              <span className="font-semibold text-white">
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
                style={{ width: `${(item.topperTime / totalUserTime) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-[#FFCC00] font-medium mt-1.5">
              Topper Time: {Math.floor(item.topperTime / 60)}m{" "}
              {item.topperTime % 60}s
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-[#38383A] my-6"></div>
      <h3 className="text-lg font-bold mb-4 text-white">
        Question Difficulty vs. Time
      </h3>
      <div className="flex bg-[#3a3a3c] rounded-lg p-1 space-x-1 mb-4 text-xs">
        {graphTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveGraphTab(tab)}
            className={`w-full py-2 px-1 font-semibold rounded-md transition-all duration-300 ${
              activeGraphTab === tab
                ? "bg-[#2c2c2e] text-white"
                : "text-[#8e8e93] hover:bg-[#4a4a4c]"
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
    </Card>
  );
};

// --- SIDEBAR & OTHER COMPONENTS ---

const ActionableInsights = () => (
  <Card>
    <div className="flex items-center mb-4">
      <Icon path={ICONS.lightbulb} className="w-7 h-7 text-[#FFCC00] mr-3" />
      <h2 className="text-xl font-bold text-white">Actionable Insights</h2>
    </div>
    <div className="space-y-4 text-sm">
      <div className="flex">
        {" "}
        <Icon
          path={ICONS.arrowUp}
          className="w-5 h-5 text-[#34C759] mr-3 mt-0.5 flex-shrink-0"
        />{" "}
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
        <Icon
          path={ICONS.arrowDown}
          className="w-5 h-5 text-[#FF3B30] mr-3 mt-0.5 flex-shrink-0"
        />{" "}
        <div>
          {" "}
          <h3 className="font-bold text-[#FF3B30]">
            Improvement Area: Pacing in Reasoning
          </h3>{" "}
          <p className="text-[#8e8e93]">
            You spent 22 minutes in the Reasoning section, exceeding the
            20-minute allocation. This extra time could be better used in other
            sections. Focus on timed practice for Reasoning topics.
          </p>{" "}
        </div>{" "}
      </div>
      <div className="flex">
        {" "}
        <Icon
          path={ICONS.target}
          className="w-5 h-5 text-[#0A84FF] mr-3 mt-0.5 flex-shrink-0"
        />{" "}
        <div>
          {" "}
          <h3 className="font-bold text-[#0A84FF]">
            Focus Topic: General Awareness
          </h3>{" "}
          <p className="text-[#8e8e93]">
            With 76.25% accuracy in GA, there's scope for improvement. Focusing
            on Current Affairs and Static GK could provide a significant boost
            to your overall score.
          </p>{" "}
        </div>{" "}
      </div>
    </div>
  </Card>
);

const TopperStrategy = () => (
  <Card>
    <h2 className="text-xl font-bold mb-4 text-white">Topper's Strategy</h2>
    <ul className="space-y-3 text-sm list-disc list-inside text-[#8e8e93]">
      <li>
        The topper scored{" "}
        <span className="font-bold text-[#0A84FF]">95.25</span> by attempting{" "}
        <span className="font-bold text-[#0A84FF]">97</span> questions.
      </li>
      <li>
        They achieved nearly perfect accuracy in Reasoning and Numerical Ability
        (<span className="font-bold text-[#0A84FF]">&gt;95%</span>).
      </li>
      <li>
        Their time on incorrect questions was only{" "}
        <span className="font-bold text-[#0A84FF]">2 minutes</span>, minimizing
        time lost on wrong answers.
      </li>
    </ul>
  </Card>
);

const Leaderboard = () => (
  <Card>
    <h2 className="text-xl font-bold mb-4 text-white">Leaderboard</h2>
    <div className="space-y-2">
      {leaderboardData.map((user) => (
        <div
          key={user.rank}
          className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-[#3a3a3c]/60"
        >
          <div className="flex items-center space-x-3">
            <span className="font-bold text-[#636366] w-6 text-center">
              {user.rank}
            </span>
            <div className="w-9 h-9 rounded-full bg-[#0A84FF]/10 text-[#0A84FF] flex items-center justify-center font-bold text-base">
              {user.name.charAt(0)}
            </div>
            <div className="font-semibold text-white flex items-center">
              {user.name}
              {user.rank === 1 && (
                <Icon
                  path={ICONS.crown}
                  solid={true}
                  className="w-4 h-4 ml-1.5 text-[#FFCC00]"
                />
              )}
            </div>
          </div>
          <span className="font-bold text-[#0A84FF]">
            {user.score.toFixed(2)}
          </span>
        </div>
      ))}
      <div className="p-1">
        <div className="border-t border-dashed border-[#38383A] my-2"></div>
      </div>
      <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-[#0A84FF]/10 border-2 border-[#0A84FF]">
        <div className="flex items-center space-x-3">
          <span className="font-bold text-[#0A84FF] w-6 text-center">
            {currentUser.rank}
          </span>
          <div className="w-9 h-9 rounded-full bg-[#0A84FF] text-white flex items-center justify-center font-bold text-base">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-white">{currentUser.name}</p>
            <p className="text-xs text-[#0A84FF] font-medium">
              {currentUser.message}
            </p>
          </div>
        </div>
        <span className="font-bold text-[#0A84FF]">
          {currentUser.score.toFixed(2)}
        </span>
      </div>
    </div>
  </Card>
);

const RateTest = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  return (
    <div className="text-center mt-6">
      <h3 className="text-lg font-bold mb-2 text-white">Rate this Analysis</h3>
      <p className="text-sm text-[#8e8e93] mb-4">Help us Improve</p>
      <div className="flex justify-center space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
            className="transition-transform duration-200 hover:scale-125"
          >
            <Icon
              path={ICONS.star}
              solid={true}
              className={`w-8 h-8 ${
                (hoverRating || rating) >= star
                  ? "text-[#FFCC00]"
                  : "text-[#3a3a3c]"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

// --- SHARED UTILITY COMPONENTS ---

const SummaryItem = ({ icon, value, label, total }) => (
  <div className="flex flex-col items-center justify-center p-2">
    {/**<div className="bg-[#3a3a3c] rounded-full p-3 mb-2 h-">{icon}</div>*/}
    <p className="text-lg font-bold text-white">
      {value}
      {total && (
        <span className="text-sm font-normal text-[#8e8e93]">/{total}</span>
      )}
    </p>
    <p className="text-xs text-[#8e8e93] font-medium uppercase tracking-wider">
      {label}
    </p>
  </div>
);

const DonutChart = ({ data, size = 160 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulative = 0;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          stroke={"#3a3a3c"}
          strokeWidth={strokeWidth}
        />
        {data.map((item, index) => {
          const dashoffset =
            circumference - (cumulative / total) * circumference;
          const dasharray = (item.value / total) * circumference;
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
              strokeDasharray={`${dasharray} ${circumference - dasharray}`}
              strokeDashoffset={-dashoffset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              className="transition-all duration-500"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">{total}</span>
        <span className="text-sm text-[#8e8e93] font-medium">Questions</span>
      </div>
    </div>
  );
};
const DonutChart2 = ({ data, size = 200 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulative = 0;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          stroke={"#3a3a3c"}
          strokeWidth={strokeWidth}
        />
        {data.map((item, index) => {
          const dashoffset =
            circumference - (cumulative / total) * circumference;
          const dasharray = (item.value / total) * circumference;
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
              strokeDasharray={`${dasharray} ${circumference - dasharray}`}
              strokeDashoffset={-dashoffset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              className="transition-all duration-500"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold text-[#34C759]">59.75</span>
        <span className="text-2xl text-[#8e8e93] font-medium">/100</span>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

export default function TestAnalysis2() {
  const [isShareOpen, setShareOpen] = useState(false);
  return (
    <div className="bg-[#1d1d1f] min-h-screen font-sans text-white">
      <div className="container mx-auto p-4 md:p-8">
        <header className=" relative flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-1">
              Test Analysis
            </h1>
            <p className="text-[#8e8e93]">
              IBPS Clerk Pre 2025 Full Mock Test - 02
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-gradient-to-r from-[#007AFF] to-[#0A84FF] text-white font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition">
              View Solutions
            </button>
            <button className="bg-[#3a3a3c] text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-[#4a4a4c] transition">
              Re-Attempt
            </button>
            <div className="relative">
              <button
                onClick={() => setShareOpen(!isShareOpen)}
                className="flex items-center space-x-2 bg-[#3a3a3c] text-white font-semibold py-2.5 px-2.5 rounded-lg hover:bg-[#4a4a4c] transition"
              >
                <Icon path={ICONS.share} className="w-5 h-5" />
              </button>
              {isShareOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#2c2c2e] border border-[#38383A] rounded-lg shadow-xl z-10">
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-white hover:bg-[#3a3a3c]"
                  >
                    <Icon path={ICONS.twitter} className="w-4 h-4 mr-3" />
                    Share on Twitter
                  </a>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-white hover:bg-[#3a3a3c]"
                  >
                    <Icon path={ICONS.link} className="w-4 h-4 mr-3" />
                    Copy Link
                  </a>
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">
            You did great, {currentUser.name.split(" ")[0]}
          </h2>
        </div>
        <div className="space-y-8">
          <OverallPerformance />

          <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <PerformanceDeepDive />
              <ComparisonAnalysis />

              <TopperStrategy />
              <ActionableInsights />
            </div>

            <div className="space-y-8">
              <YourAttemptStrategy />
              <Leaderboard />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
