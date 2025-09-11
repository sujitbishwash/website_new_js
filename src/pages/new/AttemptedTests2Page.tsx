import CustomLoader from "@/components/icons/customloader";
import { LayoutGrid, LayoutList, Menu, Play } from "lucide-react";
import React, { useState } from "react";

// --- TYPE DEFINITIONS ---
type MockTestStatus = "Completed" | "In Progress";
type ViewMode = "grid" | "list"; // 'compact' is removed

interface MockTest {
  id: string;
  examName: string;
  testName: string;
  dateAttempted: string;
  score: number;
  totalMarks: number;
  percentile: number;
  accuracy: number;
  status: MockTestStatus;
}

interface AiRecommendation {
  id: string;
  examName: string;
  reason: string;
}

// --- MOCK DATA ---
const attemptedTestsData: MockTest[] = [
  {
    id: "1",
    examName: "IBPS PO Prelims",
    testName: "Full Mock Test #12",
    dateAttempted: "2025-09-10",
    score: 72.5,
    totalMarks: 100,
    percentile: 92.5,
    accuracy: 85,
    status: "Completed",
  },
  {
    id: "2",
    examName: "SBI Clerk Mains",
    testName: "Sectional Test: Reasoning",
    dateAttempted: "2025-09-08",
    score: 35,
    totalMarks: 50,
    percentile: 88.2,
    accuracy: 90,
    status: "Completed",
  },
  {
    id: "3",
    examName: "SBI PO Prelims",
    testName: "Full Mock Test #8",
    dateAttempted: "2025-09-11",
    score: 23,
    totalMarks: 100,
    percentile: 0,
    accuracy: 0,
    status: "In Progress",
  },
  {
    id: "4",
    examName: "RBI Assistant Prelims",
    testName: "Full Mock Test #5",
    dateAttempted: "2025-09-05",
    score: 45,
    totalMarks: 100,
    percentile: 65.0,
    accuracy: 72,
    status: "Completed",
  },
  {
    id: "5",
    examName: "IBPS RRB Officer Scale I",
    testName: "Live Mock Challenge",
    dateAttempted: "2025-09-02",
    score: 55.75,
    totalMarks: 80,
    percentile: 78.9,
    accuracy: 81,
    status: "Completed",
  },
  {
    id: "6",
    examName: "NABARD Grade A",
    testName: "Phase 1 - Mock Test #3",
    dateAttempted: "2025-08-28",
    score: 112,
    totalMarks: 200,
    percentile: 75.4,
    accuracy: 68,
    status: "Completed",
  },
  {
    id: "7",
    examName: "SBI PO Prelims",
    testName: "Full Mock Test #7",
    dateAttempted: "2025-08-22",
    score: 63,
    totalMarks: 100,
    percentile: 85.0,
    accuracy: 79,
    status: "Completed",
  },
  {
    id: "8",
    examName: "IBPS Clerk Prelims",
    testName: "Full Mock Test #10",
    dateAttempted: "2025-08-25",
    score: 81.25,
    totalMarks: 100,
    percentile: 95.1,
    accuracy: 91,
    status: "Completed",
  },
  {
    id: "9",
    examName: "SBI PO Prelims",
    testName: "Full Mock Test #7",
    dateAttempted: "2025-08-22",
    score: 63,
    totalMarks: 100,
    percentile: 85.0,
    accuracy: 79,
    status: "Completed",
  },

  {
    id: "10",
    examName: "SBI PO Prelims",
    testName: "Full Mock Test #7",
    dateAttempted: "2025-08-22",
    score: 63,
    totalMarks: 100,
    percentile: 85.0,
    accuracy: 79,
    status: "Completed",
  },
  {
    id: "11",
    examName: "IBPS PO Prelims",
    testName: "Sectional: English",
    dateAttempted: "2025-08-20",
    score: 22.5,
    totalMarks: 30,
    percentile: 91.3,
    accuracy: 88,
    status: "Completed",
  },
  {
    id: "12",
    examName: "NABARD Grade A",
    testName: "Phase 1 - Mock Test #3",
    dateAttempted: "2025-08-28",
    score: 112,
    totalMarks: 200,
    percentile: 75.4,
    accuracy: 68,
    status: "Completed",
  },
  {
    id: "13",
    examName: "IBPS Clerk Prelims",
    testName: "Full Mock Test #10",
    dateAttempted: "2025-08-25",
    score: 81.25,
    totalMarks: 100,
    percentile: 95.1,
    accuracy: 91,
    status: "Completed",
  },
  {
    id: "14",
    examName: "SBI PO Prelims",
    testName: "Full Mock Test #7",
    dateAttempted: "2025-08-22",
    score: 63,
    totalMarks: 100,
    percentile: 85.0,
    accuracy: 79,
    status: "Completed",
  },
  {
    id: "15",
    examName: "IBPS PO Prelims",
    testName: "Sectional: English",
    dateAttempted: "2025-08-20",
    score: 22.5,
    totalMarks: 30,
    percentile: 91.3,
    accuracy: 88,
    status: "Completed",
  },
];

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

// --- HELPER & VIEW COMPONENTS ---

// Helper to calculate days since the test was taken
const calculateDaysSince = (dateString: string): string => {
  if (!dateString) return "";
  const today = new Date("2025-09-11T16:58:00"); // Current fixed time
  const testDate = new Date(dateString);
  today.setHours(0, 0, 0, 0);
  testDate.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - testDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
};

// --- Component for AI Recommended Tests ---
const AiTestCard = ({ test }: { test: AiRecommendation }) => (
  <div className="select-none flex-shrink-0 w-auto bg-background-subtle border border-border rounded-2xl p-5 flex flex-col justify-between transform hover:scale-[1.02] hover:border-primary transition-all duration-300 ease-in-out">
    <div>
      <p className="font-semibold text-muted-foreground">{test.examName}</p>
      <p className="text-sm text-primary mt-1">{test.reason}</p>
    </div>
    <button className="mt-4 w-full px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-white hover:bg-primary/80 transition-colors duration-200 cursor-pointer">
      Start Now
    </button>
  </div>
);

// --- Reusable Pill and Color functions ---
const getPercentileColor = (percentile: number) => {
  if (percentile >= 90) return "text-green-400";
  if (percentile >= 75) return "text-sky-400";
  if (percentile > 0) return "text-orange-400";
  return "text-foreground";
};
const ActionButton = ({ status }: { status: MockTestStatus }) => {
  switch (status) {
    case "Completed":
      return (
        <div className="flex gap-4">
          <button
            className="cursor-pointer px-4 py-2 text-sm font-semibold rounded-lg w-full sm:w-auto text-center text-muted-foreground border hover:bg-border"
          >
            Re-attempt
          </button>
          <button
            className="cursor-pointer px-4 py-2 text-sm font-semibold rounded-lg w-full sm:w-auto text-center text-muted-foreground border hover:bg-border"
          >
            View Analysis
          </button>
        </div>
      );

    case "In Progress":
      return (
        <button
          className="px-4 py-2 text-sm font-semibold rounded-lg w-full justify-center text-center bg-amber-500 text-black hover:bg-amber-400 flex gap-2 items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-play-fill"
            viewBox="0 0 16 16"
          >
            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
          </svg>
          Resume Test
        </button>
      );
  }
};


// --- Test Card for Grid and List Views ---
const TestFeedCard = ({ test }: { test: MockTest }) => {
  const daysSince =
    test.status === "Completed" ? calculateDaysSince(test.dateAttempted) : "";

 return (
  <div
    className="
      select-none hover:shadow-xl hover:-translate-y-0.5
      transition-all duration-300 ease-in-out
      bg-card border border-border rounded-2xl sm:shadow-lg 
      hover:border-primary
      p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5
    "
  >
    {/* Left section */}
    <div className="flex-grow">
      <div className="flex justify-between items-start">
        <p className="font-semibold text-lg text-foreground">
          {test.examName}
        </p>
      </div>
      <p className="text-muted-foreground text-sm flex items-center flex-wrap gap-x-2">
        {test.testName}
        {daysSince && (
          <span className="text-xs text-muted-foreground">
            {daysSince}
          </span>
        )}
      </p>
    </div>

    {/* Score / Percentile */}
    {test.status === "Completed" ? (
      <div className="flex sm:flex-row flex-col sm:items-center gap-4 text-center">
        <div>
          <p className="font-semibold text-muted-foreground text-2xl">
            {test.score.toFixed(1)}
            <span className="text-sm text-muted-foreground">
              /{test.totalMarks}
            </span>
          </p>
          <p className="text-xs text-muted-foreground">Score</p>
        </div>
        <div>
          <p
            className={`font-semibold ${getPercentileColor(
              test.percentile
            )} text-2xl`}
          >
            {test.percentile.toFixed(1)}%
          </p>
          <p className="text-xs text-muted-foreground">Percentile</p>
        </div>
      </div>
    ) : (
      <div className="flex items-center">
        <p className="text-sm text-muted-foreground px-3 py-1 rounded-full border border-border">
          In Progress
        </p>
      </div>
    )}

    {/* Action button */}
    <div className="sm:ml-4 flex-shrink-0 w-full sm:w-auto">
      <ActionButton status={test.status} />
    </div>
  </div>
);

};

const TestFeedCard2 = ({ test }: { test: MockTest }) => {
  const daysSince =
    test.status === "Completed" ? calculateDaysSince(test.dateAttempted) : "";

  return (
    <div
      className={`
        select-none bg-card border border-border rounded-2xl shadow-md 
        hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 
        transition-all duration-300 ease-in-out
        flex flex-col overflow-hidden w-full max-w-sm mx-auto
      `}
    >
      {/* Header section with the main exam name */}
      <div className="text-white flex h-28 w-full bg-primary items-center justify-center text-center font-bold text-3xl p-4">
        <h2>{test.examName}</h2>
      </div>
      
      {/* Main content area */}
      <div className="flex flex-col flex-grow p-4">
        
        {/* Test name and date info */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-md text-foreground pr-2">
            {test.testName}
          </h3>
          {daysSince && (
            <p className="text-xs text-muted-foreground whitespace-nowrap pt-1">
              {daysSince}
            </p>
          )}
        </div>

        {/* Conditional content based on status */}
        <div className="flex-grow flex items-center justify-center">
          {test.status === "Completed" ? (
            // Completed State: Grid for Score and Percentile
            <div className="grid grid-cols-2 gap-6 w-full text-center">
              <div>
                <p className="font-bold text-lg text-muted-foreground">
                  {test.score.toFixed(1)}
                  <span className="text-lg text-muted-foreground">/{test.totalMarks}</span>
                </p>
                <p className="text-sm text-muted-foreground">Score</p>
              </div>
              <div>
                <p className={`font-bold text-lg ${getPercentileColor(test.percentile)}`}>
                  {test.percentile.toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground">Percentile</p>
              </div>
            </div>
          ) : (
            // In-Progress State: Badge-like display
            <div className="flex items-center justify-center gap-2 rounded-full bg-blue-500/10 text-blue-500 py-2 px-4">
               
              <p className="text-sm font-semibold">
                In Progress
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer section for the action button */}
      <div className="p-4 border-t border-border/50 bg-background/30 mt-auto">
        <ActionButton status={test.status} />
      </div>
    </div>
  );
};

// --- Pagination Component ---
const Pagination = ({
  totalTests,
  testsPerPage,
  currentPage,
  onPageChange,
}: {
  totalTests: number;
  testsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) => {
  const pageCount = Math.ceil(totalTests / testsPerPage);
  if (pageCount <= 1) return null;
  const pageNumbers = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <nav className="flex justify-center items-center gap-2 mt-8">
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`cursor-pointer w-9 h-9 flex items-center justify-center font-semibold text-sm rounded-lg transition-colors duration-200 ${
            currentPage === number
              ? "bg-primary text-white"
              : "bg-card text-border-high border border-border hover:bg-border"
          }`}
        >
          {number}
        </button>
      ))}
    </nav>
  );
};

// Main App Component
const AttemptedTests2 = () => {
  const [filter, setFilter] = useState<MockTestStatus | "All">("All");
  const [view, setView] = useState<ViewMode>("list");
  const [currentPage, setCurrentPage] = useState(1);
  const TESTS_PER_PAGE = 12;

  const filteredTests = attemptedTestsData
    .filter((test) => filter === "All" || test.status === filter)
    .sort((a, b) => {
      const statusOrder = { "In Progress": 1, Completed: 2 };
      if (statusOrder[a.status] !== statusOrder[b.status])
        return statusOrder[a.status] - statusOrder[b.status];
      return (
        new Date(b.dateAttempted).getTime() -
        new Date(a.dateAttempted).getTime()
      );
    });

  const indexOfLastTest = currentPage * TESTS_PER_PAGE;
  const indexOfFirstTest = indexOfLastTest - TESTS_PER_PAGE;
  const currentTests = filteredTests.slice(indexOfFirstTest, indexOfLastTest);

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  const renderTests = () => {
    if (currentTests.length === 0) {
      return (
        <div className="text-center col-span-full py-20 px-6 bg-gray-900/50 rounded-2xl border border-gray-800">
          <h3 className="text-lg font-semibold text-gray-300">
            No Tests Found
          </h3>
          <p className="text-muted-foreground mt-2">
            There are no tests matching your filters.
          </p>
        </div>
      );
    }
    const layoutClasses =
      view === "grid"
        ? "grid grid-cols-1 md:grid-cols-3 gap-5"
        : "flex flex-col gap-4 sm:gap-5";
    return (
      <div className={layoutClasses}>
        {currentTests.map((test) =>
          view === "list" ? (
            <TestFeedCard key={test.id} test={test} />
          ) : (
            <TestFeedCard2 key={test.id} test={test} />
          )
        )}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 bg-background min-h-screen font-sans text-foreground mt-10 sm:mt-4">
      <div className="mx-auto p-2 sm:p-6 md:p-8 max-w-7xl">
        {/**<header className="mb-10">
          <h1 className="text-4xl font-bold text-gray-100 tracking-tight">
            Attempted Tests
          </h1>
        </header>*/}

        <main className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 items-start">
          {/* --- LEFT COLUMN: ATTEMPT HISTORY --- */}
          <section className="lg:col-span-3">
            <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
              <h2 className="text-4xl font-semibold text-foreground tracking-tight">
                Attempted Tests
              </h2>
              <div className="flex justify-between items-center sm:gap-4 flex-wrap">
                <div className="flex items-center bg-card border border-border p-1 rounded-xl">
                  {(
                    ["All", "Completed", "In Progress"] as (
                      | MockTestStatus
                      | "All"
                    )[]
                  ).map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setFilter(option);
                        setCurrentPage(1);
                      }}
                      className={`cursor-pointer px-3 py-1 text-sm font-semibold rounded-lg transition-colors duration-300 ${
                        filter === option
                          ? "bg-border/20 text-muted-foreground"
                          : "text-border-medium hover:bg-background-subtle"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <div className="flex items-center bg-card border border-border p-1 rounded-xl">
                  {(["list", "grid"] as ViewMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setView(mode)}
                      className={`p-2 rounded-lg transition-colors cursor-pointer ${
                        view === mode
                          ? "bg-border/20 text-muted-foreground"
                          : "text-border-medium hover:bg-background-subtle"
                      }`}
                    >
                      {mode === "list" ? (
                        <Menu className="h-4 w-4" />
                      ) : (
                        <LayoutGrid className="h-4 w-4" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="max-h-auto space-y-5">
              {renderTests()}
            </div>
            <Pagination
              totalTests={filteredTests.length}
              testsPerPage={TESTS_PER_PAGE}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </section>

          {/* --- RIGHT COLUMN: AI RECOMMENDATIONS --- */}
          <section className="lg:col-span-1 lg:sticky top-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 tracking-tight">
              Recommended Tests
            </h2>
            <div className="flex flex-col gap-5">
              {aiRecommendedTests.slice(0, 3).map((test) => (
                <AiTestCard key={test.id} test={test} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AttemptedTests2;
