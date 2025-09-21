import { ROUTES } from "@/routes/constants";
import { EllipsisVertical, RefreshCcw, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState, useMemo, FC } from "react";
import { useNavigate } from "react-router-dom";
import { attemptedTestsApi } from "@/lib/api-client";

// --- TYPE DEFINITIONS ---
type MockTestStatus = "Completed" | "In Progress";

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

// --- HELPER & VIEW COMPONENTS ---

// Helper to calculate days since the test was taken
const calculateDaysSince = (dateString: string): string => {
  if (!dateString) return "";
  const today = new Date();
  const testDate = new Date(dateString);
  today.setHours(0, 0, 0, 0);
  testDate.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - testDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
};

const SkeletonCard: FC = () => (
    <div className="animate-pulse bg-card border border-border rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-5 flex flex-col sm:flex-row items-start justify-between gap-5">
        <div className="flex-1 w-full">
            <div className="h-6 bg-muted-foreground/30 rounded w-3/4"></div>
            <div className="h-4 bg-muted-foreground/30 rounded w-1/2 mt-3"></div>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
            <div className="text-center">
                <div className="h-8 w-16 bg-muted-foreground/30 rounded-md"></div>
            </div>
            <div className="text-center hidden sm:block">
                <div className="h-8 w-16 bg-muted-foreground/30 rounded-md"></div>
            </div>
            <div className="h-8 w-8 bg-muted-foreground/30 rounded-full"></div>
        </div>
    </div>
);

// --- Component for AI Recommended Tests ---
const AiTestCard = ({ test }: { test: AiRecommendation }) => {
  const navigate = useNavigate();
  return (
    <div className="select-none flex-shrink-0 w-auto bg-background-subtle border border-border rounded-2xl p-5 flex flex-col justify-between transform hover:scale-[1.02] hover:border-primary transition-all duration-300 ease-in-out">
      <div>
        <p className="text-lg font-semibold text-foreground">{test.reason}</p>
        <p className="text-md text-muted-foreground">{test.examName}</p>
      </div>
      <button
        onClick={() => navigate(ROUTES.EXAM_INFO)}
        className="mt-4 w-full px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-white hover:bg-primary/80 transition-colors duration-200 cursor-pointer"
      >
        Start Now
      </button>
    </div>
  );
};

// --- Reusable Pill and Color functions ---
const getPercentileColor = (percentile: number) => {
  if (percentile >= 90) return "text-green-400";
  if (percentile >= 75) return "text-sky-400";
  if (percentile > 0) return "text-orange-400";
  return "text-foreground";
};

const ActionButton = ({
  sessionId,
  status,
  isMoreOpen,
  setMoreOpen,
}: {
  sessionId: string;
  status: MockTestStatus;
  isMoreOpen: boolean;
  setMoreOpen: (isOpen: boolean) => void;
}) => {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setMoreOpen]);

  if (status === "In Progress") {
    return (
      <>
        <button className="cursor-pointer px-4 py-2 text-md hover:bg-foreground/10 font-semibold rounded-lg w-full justify-center text-center text-foreground flex gap-2 items-center transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="bi bi-play-fill w-5 h-5"
            viewBox="0 0 16 16"
          >
            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
          </svg>
          <span className="hidden sm:inline">Resume Test</span>
        </button>
      </>
    );
  }

  return (
    <div className="relative sm:block hidden" ref={dropdownRef}>
      <button
        onClick={() => setMoreOpen(!isMoreOpen)}
        className="p-1 rounded-full hover:bg-foreground/10 cursor-pointer"
      >
        <EllipsisVertical className="text-muted-foreground" size={20} />
      </button>
      {isMoreOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-xl z-20 ">
          <span
            onClick={() => navigate(ROUTES.ANALYSIS2, {
          state: { sessionId: sessionId },
        })}
            className="cursor-pointer flex items-center px-4 py-2 text-sm hover:bg-foreground/10 rounded-t-lg gap-4"
          >
            <TrendingUp className="h-5 w-5 text-muted-foreground" /> View
            Analysis
          </span>
          <span
            onClick={() => navigate(ROUTES.EXAM_INFO)}
            className="cursor-pointer flex items-center px-4 py-2 text-sm hover:bg-foreground/10 rounded-b-lg gap-4"
          >
            <RefreshCcw className="h-5 w-5 text-muted-foreground" />
            Re-Attempt
          </span>
        </div>
      )}
    </div>
  );
};

// --- Test Card ---
const TestFeedCard = ({ test }: { test: MockTest }) => {
  const [isMoreOpen, setMoreOpen] = useState(false);
  const daysSince =
    test.status === "Completed" ? calculateDaysSince(test.dateAttempted) : "";

  return (
    <div
      className={`
      select-none hover:shadow-xl hover:-translate-y-0.5
      transition-all duration-300 ease-in-out
      bg-card border border-border rounded-xl sm:rounded-2xl shadow-sm 
      hover:border-primary
      p-3 sm:p-5 flex flex-row ${
        test.status === "Completed" ? "items-start" : "items-center"
      } justify-between gap-5
    ${isMoreOpen ? "z-20" : "z-auto"}`}
    >
      {/* Left section */}
      <div className="flex-col hidden sm:block">
        <span className="flex justify-between items-start font-semibold text-md sm:text-lg text-foreground">
          {test.examName} • {test.testName}
        </span>
        {daysSince && (
          <span className="flex items-center flex-wrap gap-x-2 text-xs text-muted-foreground">
            {daysSince}
          </span>
        )}
      </div>
      <div className="flex-col sm:hidden block">
        <span className="font-semibold text-md sm:text-lg text-foreground">
          {test.examName} • {test.testName}
          {daysSince && (
            <span className="text-sm text-muted-foreground">
              {" "}
              • {daysSince}
            </span>
          )}
        </span>
      </div>

      {/* Score / Percentile */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-center">
        {test.status === "Completed" && (
          <>
            <div className="text-end sm:text-center">
              <p 
              className={`font-semibold text-muted-foreground text-lg sm:text-2xl text-4xl font-bold  ${
                          test.score >= test.totalMarks * 0.7
                            ? "text-green-400"
                            : test.score > test.totalMarks * 0.4
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}>
                {String(test.score)}
                <span className="text-sm text-muted-foreground">
                  /{test.totalMarks}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">Score</p>
            </div>
            <div className="hidden sm:block">
              {typeof test.percentile === "number" && test.percentile > 0 ? (
                <>
                  <p
                    className={`font-semibold ${getPercentileColor(
                      test.percentile
                    )} text-lg sm:text-2xl`}
                  >
                    {test.percentile.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">Percentile</p>
                </>
              ) : null}
            </div>
          </>
        )}
        {/* Action button */}

        <ActionButton
        sessionId={test.id}
          status={test.status}
          isMoreOpen={isMoreOpen}
          setMoreOpen={setMoreOpen}
        />
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
  const [currentPage, setCurrentPage] = useState(1);
  const TESTS_PER_PAGE = 12;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attemptedTests, setAttemptedTests] = useState<MockTest[]>([]);
  const [total, setTotal] = useState(0);

  // Fetch attempted tests from backend
  useEffect(() => {
    const fetchAttempted = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const resp = await attemptedTestsApi.getAttemptedTests(
          currentPage,
          TESTS_PER_PAGE
        );
        // Map API to UI model
        const mapped: MockTest[] = (resp.tests || []).map((t: any) => ({
          id: String(t.id ?? t.session_id ?? Math.random()),
          examName: String(t.subject || t.title || "Test"),
          testName: String(t.topics?.join(", ") || t.title || "Attempt"),
          dateAttempted: t.date || new Date().toISOString(),
          score: Number(t.total_marks_scored ?? t.positive_score ?? 0),
          totalMarks: Number(t.total_marks ?? 100),
          percentile: typeof t.percentile === "number" ? t.percentile : 0,
          accuracy: typeof t.accuracy === "number" ? t.accuracy : 0,
          status: ((t.status || "")
            .toString()
            .toLowerCase()
            .includes("progress")
            ? "In Progress"
            : "Completed") as MockTestStatus,
        }));
        setAttemptedTests(mapped);
        setTotal(resp.total ?? mapped.length);
      } catch (e: any) {
        setError(e?.message || "Failed to load attempted tests");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAttempted();
  }, [currentPage]);

  const filteredTests = useMemo(() => {
    const base = attemptedTests.sort((a, b) => {
      const statusOrder = { "In Progress": 1, Completed: 2 } as const;
      if (statusOrder[a.status] !== statusOrder[b.status])
        return statusOrder[a.status] - statusOrder[b.status];
      return (
        new Date(b.dateAttempted).getTime() -
        new Date(a.dateAttempted).getTime()
      );
    });
    if (filter === "All") return base;
    return base.filter((t) => t.status === filter);
  }, [attemptedTests, filter]);

  const currentTests = filteredTests; // server paginated; already page-scoped

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  const renderTests = () => {
    if (isLoading) {
            return (
                <div className="flex flex-col gap-4 sm:gap-5">
                    {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
            );
        }
        
        if (error) {
            return;
        }
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
    return (
      <div className="flex flex-col gap-4 sm:gap-5">
        {currentTests.map((test) => (
          <TestFeedCard key={test.id} test={test} />
        ))}
      </div>
    );
  };

  return (
    <div className="p-2 sm:p-6 bg-background min-h-screen font-sans text-foreground mt:2">
      <div className="mx-auto p-2 sm:p-6 md:p-8 max-w-7xl">
        {/**<header className="mb-10">
          <h1 className="text-4xl font-bold text-gray-100">
            Attempted Tests
          </h1>
        </header>*/}

        <main className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 items-start">
          {/* --- LEFT COLUMN: ATTEMPT HISTORY --- */}
          <section className="lg:col-span-3">
            <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
              <h2 className="text-2xl sm:text-4xl font-semibold text-foreground w-full text-center sm:w-auto sm:text-left">
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
              </div>
            </div>

            {/**isLoading && (
              <div className="text-muted-foreground h-auto font-sans flex flex-col justify-center items-center p-4 gap-4">
                <CustomLoader className="h-15 w-15" />
                <span className="text-muted-foreground text-lg">
                  Loading...
                </span>
              </div>
            )*/}
            {error && (
              <div className="text-center text-red-400 py-4">{error}</div>
            )}
              <div className="max-h-auto space-y-5">{renderTests()}</div>
            <Pagination
              totalTests={total}
              testsPerPage={TESTS_PER_PAGE}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
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
      </div>
    </div>
  );
};

export default AttemptedTests2;
