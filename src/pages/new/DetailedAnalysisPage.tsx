import { useState } from "react";

// --- Type Definitions ---
interface PerformanceMetricProps {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  colorClass?: string;
}

interface ProgressBarProps {
  percentage: number;
  color?: string;
}

interface SubjectSectionProps {
  title: string;
  marks: string;
  accuracy: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

// --- Icon Components (as inline SVGs for simplicity) ---
const ScoreIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2 text-indigo-400"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);
const RankIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2 text-indigo-400"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M11.99 2A2 2 0 0010 0H2a2 2 0 00-2 2v16a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-3.99V2zM4 4h5v3H4V4zm6 0h5v3h-5V4zm-6 5h5v3H4V9zm6 0h5v3h-5V9zm-6 5h5v3H4v-3zm6 0h5v3h-5v-3z" />
  </svg>
);
const PercentileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2 text-indigo-400"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
  </svg>
);
const AccuracyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2 text-indigo-400"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
      clipRule="evenodd"
    />
  </svg>
);

// --- Component: PerformanceMetric.js ---
const PerformanceMetric = ({
  icon,
  label,
  value,
  subValue,
  colorClass = "text-gray-800",
}: PerformanceMetricProps) => (
  <div className="flex flex-col items-center justify-center text-center p-4 h-full bg-white rounded-lg border border-gray-200/80 shadow-sm">
    <div className="flex items-center text-sm text-gray-500 mb-2">
      {icon}
      <span className="font-medium uppercase tracking-wider">{label}</span>
    </div>
    <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
    {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
  </div>
);

// --- Component: ProgressBar.js ---
const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  color = "bg-blue-500",
}) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
    <div
      className={`${color} h-2.5 rounded-full transition-all duration-500 ease-out`}
      style={{ width: `${percentage}%` }}
    ></div>
  </div>
);

// --- Component: SubjectSection.js ---
const SubjectSection: React.FC<SubjectSectionProps> = ({
  title,
  marks,
  accuracy,
  children,
  isOpen,
  onToggle,
}) => (
  <div className="border border-gray-200/80 rounded-xl mb-6 shadow-sm hover:shadow-md transition-shadow duration-300">
    <button
      onClick={onToggle}
      className="w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors rounded-t-xl focus:outline-none"
    >
      <h3 className="text-md sm:text-lg font-semibold text-indigo-700 text-left">
        {title}
      </h3>
      <div className="flex items-center space-x-4 sm:space-x-6">
        <div className="text-right">
          <p className="text-xs text-gray-500">Marks</p>
          <p className="text-sm font-semibold text-gray-800">{marks}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Accuracy</p>
          <p className="text-sm font-semibold text-gray-800">{accuracy}</p>
        </div>
        <div className="p-2 bg-white rounded-full shadow-inner">
          <svg
            className={`w-5 h-5 text-indigo-600 transform transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>
    </button>
    {isOpen && (
      <div className="p-4 sm:p-6 bg-white rounded-b-xl border-t border-gray-200">
        {children}
      </div>
    )}
  </div>
);

// --- Main Page: DetailedAnalysisTestPage.js ---
export default function DetailedAnalysisTestPage() {
  const [openSection, setOpenSection] = useState<string | null>(
    "general-intelligence"
  );

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const reasoningTopicData = [
    {
      topic: "Analogy",
      attempted: 3,
      correct: 2,
      incorrect: 1,
      accuracy: "66.67%",
    },
    {
      topic: "Classification",
      attempted: 2,
      correct: 2,
      incorrect: 0,
      accuracy: "100.00%",
    },
    {
      topic: "Series",
      attempted: 4,
      correct: 3,
      incorrect: 1,
      accuracy: "75.00%",
    },
    {
      topic: "Coding-Decoding",
      attempted: 3,
      correct: 3,
      incorrect: 0,
      accuracy: "100.00%",
    },
    {
      topic: "Blood Relations",
      attempted: 2,
      correct: 1,
      incorrect: 1,
      accuracy: "50.00%",
    },
    {
      topic: "Syllogism",
      attempted: 2,
      correct: 2,
      incorrect: 0,
      accuracy: "100.00%",
    },
    {
      topic: "Non-Verbal Reasoning",
      attempted: 6,
      correct: 5,
      incorrect: 1,
      accuracy: "83.33%",
    },
  ];

  const awarenessTopicData = [
    {
      topic: "History",
      attempted: 4,
      correct: 3,
      incorrect: 1,
      accuracy: "75.00%",
    },
    {
      topic: "Geography",
      attempted: 3,
      correct: 2,
      incorrect: 1,
      accuracy: "66.67%",
    },
    {
      topic: "Polity",
      attempted: 2,
      correct: 2,
      incorrect: 0,
      accuracy: "100.00%",
    },
    {
      topic: "Economics",
      attempted: 2,
      correct: 1,
      incorrect: 1,
      accuracy: "50.00%",
    },
    {
      topic: "Static GK",
      attempted: 5,
      correct: 3,
      incorrect: 2,
      accuracy: "60.00%",
    },
    {
      topic: "Current Affairs",
      attempted: 6,
      correct: 4,
      incorrect: 2,
      accuracy: "66.67%",
    },
    {
      topic: "Science",
      attempted: 3,
      correct: 2,
      incorrect: 1,
      accuracy: "66.67%",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen p-2 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* --- Header --- */}
        <header className="mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            SSC CGL Tier 1 - Mock 5
          </h1>
          <p className="text-sm text-gray-500 mt-2">Taken on: 2024-07-20</p>
        </header>

        {/* --- Main Content Grid (2 Columns on Large Screens) --- */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* --- Left Column: Overall Performance --- */}
          <aside className="lg:col-span-4 mb-8 lg:mb-0">
            <div className="sticky top-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-5">
                Overall Performance
              </h2>
              <div className="p-6 bg-white rounded-2xl shadow-xl shadow-slate-200/70 border border-gray-200/80">
                <div className="grid grid-cols-2 gap-4">
                  <PerformanceMetric
                    icon={<ScoreIcon />}
                    label="Score"
                    value="132.5"
                    subValue="/ 200"
                    colorClass="text-emerald-500"
                  />
                  <PerformanceMetric
                    icon={<RankIcon />}
                    label="Rank"
                    value="15"
                    subValue="/ 2500"
                    colorClass="text-sky-500"
                  />
                  <PerformanceMetric
                    icon={<PercentileIcon />}
                    label="Percentile"
                    value="99.40%"
                    colorClass="text-amber-500"
                  />
                  <PerformanceMetric
                    icon={<AccuracyIcon />}
                    label="Accuracy"
                    value="82.35%"
                    colorClass="text-violet-500"
                  />
                  <PerformanceMetric
                    icon={<ScoreIcon />}
                    label="Attempted"
                    value="85"
                    subValue="/ 100"
                  />
                  <PerformanceMetric
                    icon={<ScoreIcon />}
                    label="Correct"
                    value="70"
                    colorClass="text-green-500"
                  />
                  <PerformanceMetric
                    icon={<ScoreIcon />}
                    label="Incorrect"
                    value="15"
                    colorClass="text-red-500"
                  />
                  <PerformanceMetric
                    icon={<ScoreIcon />}
                    label="Skipped"
                    value="15"
                  />
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <PerformanceMetric
                    icon={<ScoreIcon />}
                    label="Time Taken"
                    value="55:10"
                    subValue="/ 60:00"
                  />
                </div>
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <p className="text-gray-600 font-medium">
                      Overall Score Percentage:{" "}
                      <span className="font-bold text-gray-800">70.80%</span>
                    </p>
                  </div>
                  <ProgressBar
                    percentage={70.8}
                    color="bg-gradient-to-r from-sky-400 to-indigo-500"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* --- Right Column: Subject-wise Analysis --- */}
          <main className="lg:col-span-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
              Subject-wise Analysis
            </h2>
            <SubjectSection
              title="General Intelligence & Reasoning"
              marks="34 / 50"
              accuracy="81.82%"
              isOpen={openSection === "general-intelligence"}
              onToggle={() => toggleSection("general-intelligence")}
            >
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2 font-medium">
                  Subject Accuracy
                </p>
                <ProgressBar
                  percentage={81.82}
                  color="bg-gradient-to-r from-blue-400 to-violet-500"
                />
              </div>

              <h4 className="text-lg font-semibold text-gray-700 mb-4">
                Topic Breakdown
              </h4>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-slate-100">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Topic
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Attempted
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Correct
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Incorrect
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Accuracy
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reasoningTopicData.map((item, index) => (
                      <tr
                        key={index}
                        className="border-t border-gray-200 odd:bg-white even:bg-slate-50/50"
                      >
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                        >
                          {item.topic}
                        </th>
                        <td className="px-6 py-4 text-center">
                          {item.attempted}
                        </td>
                        <td className="px-6 py-4 text-center text-green-600 font-semibold">
                          {item.correct}
                        </td>
                        <td className="px-6 py-4 text-center text-red-600 font-semibold">
                          {item.incorrect}
                        </td>
                        <td className="px-6 py-4 text-center font-medium">
                          {item.accuracy}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-100 font-semibold text-gray-800 border-t border-gray-300">
                    <tr className="text-xs">
                      <td colSpan={5} className="px-6 py-3">
                        <div className="flex justify-between items-center flex-wrap gap-x-4 gap-y-2">
                          <span>Total Qs: 25</span>
                          <span>Attempted: 22</span>
                          <span>Correct: 18</span>
                          <span>Incorrect: 4</span>
                          <span>Time: 15:30</span>
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </SubjectSection>

            <SubjectSection
              title="General Awareness"
              marks="21 / 50"
              accuracy="66.67%"
              isOpen={openSection === "general-awareness"}
              onToggle={() => toggleSection("general-awareness")}
            >
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2 font-medium">
                  Subject Accuracy
                </p>
                <ProgressBar
                  percentage={66.67}
                  color="bg-gradient-to-r from-orange-400 to-rose-500"
                />
              </div>

              <h4 className="text-lg font-semibold text-gray-700 mb-4">
                Topic Breakdown
              </h4>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-slate-100">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Topic
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Attempted
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Correct
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Incorrect
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Accuracy
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {awarenessTopicData.map((item, index) => (
                      <tr
                        key={index}
                        className="border-t border-gray-200 odd:bg-white even:bg-slate-50/50"
                      >
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                        >
                          {item.topic}
                        </th>
                        <td className="px-6 py-4 text-center">
                          {item.attempted}
                        </td>
                        <td className="px-6 py-4 text-center text-green-600 font-semibold">
                          {item.correct}
                        </td>
                        <td className="px-6 py-4 text-center text-red-600 font-semibold">
                          {item.incorrect}
                        </td>
                        <td className="px-6 py-4 text-center font-medium">
                          {item.accuracy}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-100 font-semibold text-gray-800 border-t border-gray-300">
                    <tr className="text-xs">
                      <td colSpan={5} className="px-6 py-3">
                        <div className="flex justify-between items-center flex-wrap gap-x-4 gap-y-2">
                          <span>Total Qs: 25</span>
                          <span>Attempted: 25</span>
                          <span>Correct: 17</span>
                          <span>Incorrect: 8</span>
                          <span>Time: 12:00</span>
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </SubjectSection>
          </main>
        </div>
      </div>
    </div>
  );
}
