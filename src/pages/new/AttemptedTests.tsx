import React, { useEffect, useMemo, useState } from "react";

//==============================================================================
// 1. TYPE DEFINITIONS (TypeScript)
//==============================================================================
interface User {
  name: string;
}

interface TestData {
  id: string;
  name: string;
  subject: "Algebra" | "Geometry" | "Calculus" | "Trigonometry";
  date: string;
  overallScore: number;
  peerAverage: number;
  top10PercentScore: number;
  accuracy: number;
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: number;
  totalTime: number;
  avgTimePerQuestion: number;
  peerAvgTimePerQuestion: number;
  performanceTrend: number;
  topics: TopicPerformance[];
  cognitiveSkills: CognitiveSkill[];
  aiSummary: string;
  learningPlan: LearningPlanStep[];
  achievements: Achievement[];
  streak: number;
}

type TopicStatus = "Mastered" | "Proficient" | "Needs Work" | "Priority";

interface TopicPerformance {
  name: string;
  score: number;
  status: TopicStatus;
  difficulty: { easy: number; medium: number; hard: number };
}

interface CognitiveSkill {
  name: string;
  score: number;
  description: string;
}

interface Achievement {
  name: string;
  description: string;
}

interface LearningPlanStep {
  title: string;
  duration: number;
  action: string;
  goal?: string;
  aiTutorPrompt?: string;
}

interface AvailableTest {
  id: string;
  name: string;
  subject: "Algebra" | "Geometry" | "Calculus" | "Trigonometry";
  description: string;
}

interface PageData {
  user: User;
  tests: TestData[];
  availableTests: AvailableTest[];
}

//==============================================================================
// 2. MOCK DATA
//==============================================================================
const analysisData: PageData = {
  user: { name: "Alex" },
  tests: [
    {
      id: "test1",
      name: "Advanced Algebra - Chapter 5 Quiz",
      subject: "Algebra",
      date: "2023-08-15",
      overallScore: 82,
      peerAverage: 74,
      top10PercentScore: 91,
      accuracy: 82,
      correctAnswers: 41,
      totalQuestions: 50,
      timeTaken: 35,
      totalTime: 45,
      avgTimePerQuestion: 42,
      peerAvgTimePerQuestion: 50,
      performanceTrend: 7,
      topics: [
        {
          name: "Linear Equations",
          score: 90,
          status: "Mastered",
          difficulty: { easy: 100, medium: 90, hard: 80 },
        },
        {
          name: "Polynomials",
          score: 80,
          status: "Proficient",
          difficulty: { easy: 100, medium: 85, hard: 60 },
        },
        {
          name: "Quadratic Functions",
          score: 60,
          status: "Needs Work",
          difficulty: { easy: 90, medium: 50, hard: 40 },
        },
        {
          name: "Inequalities",
          score: 50,
          status: "Priority",
          difficulty: { easy: 75, medium: 40, hard: 20 },
        },
      ],
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
      achievements: [{ name: "Algebra Ace", description: "Scored above 80%." }],
      streak: 3,
    },
    {
      id: "test2",
      name: "Geometry - Angles and Lines",
      subject: "Geometry",
      date: "2023-08-10",
      overallScore: 91,
      peerAverage: 85,
      top10PercentScore: 95,
      accuracy: 91,
      correctAnswers: 46,
      totalQuestions: 50,
      timeTaken: 30,
      totalTime: 40,
      avgTimePerQuestion: 36,
      peerAvgTimePerQuestion: 45,
      performanceTrend: 5,
      topics: [
        {
          name: "Angle Properties",
          score: 95,
          status: "Mastered",
          difficulty: { easy: 100, medium: 95, hard: 90 },
        },
        {
          name: "Parallel Lines",
          score: 90,
          status: "Mastered",
          difficulty: { easy: 100, medium: 90, hard: 85 },
        },
        {
          name: "Transversals",
          score: 88,
          status: "Proficient",
          difficulty: { easy: 95, medium: 85, hard: 80 },
        },
      ],
      cognitiveSkills: [
        {
          name: "Conceptual",
          score: 92,
          description: "Excellent grasp of concepts.",
        },
        {
          name: "Application",
          score: 90,
          description: "Strong application skills.",
        },
        {
          name: "Critical",
          score: 85,
          description: "Good problem-solving abilities.",
        },
        {
          name: "Procedural",
          score: 95,
          description: "Flawless execution of methods.",
        },
        {
          name: "Spatial",
          score: 98,
          description: "Exceptional spatial reasoning.",
        },
      ],
      aiSummary:
        "Fantastic job on the Geometry test! You have a solid understanding across the board.",
      learningPlan: [],
      achievements: [
        { name: "Geometry Genius", description: "Scored above 90%." },
      ],
      streak: 2,
    },
    {
      id: "test3",
      name: "Calculus - Introduction to Derivatives",
      subject: "Calculus",
      date: "2023-08-05",
      overallScore: 75,
      peerAverage: 78,
      top10PercentScore: 88,
      accuracy: 75,
      correctAnswers: 30,
      totalQuestions: 40,
      timeTaken: 50,
      totalTime: 60,
      avgTimePerQuestion: 75,
      peerAvgTimePerQuestion: 70,
      performanceTrend: -3,
      topics: [
        {
          name: "Limit Definition",
          score: 70,
          status: "Needs Work",
          difficulty: { easy: 80, medium: 70, hard: 60 },
        },
        {
          name: "Power Rule",
          score: 85,
          status: "Proficient",
          difficulty: { easy: 95, medium: 85, hard: 75 },
        },
        {
          name: "Product Rule",
          score: 65,
          status: "Priority",
          difficulty: { easy: 70, medium: 60, hard: 50 },
        },
      ],
      cognitiveSkills: [
        {
          name: "Conceptual",
          score: 70,
          description: "Good start on concepts.",
        },
        {
          name: "Application",
          score: 80,
          description: "You can apply basic rules well.",
        },
        {
          name: "Critical",
          score: 60,
          description: "Complex problems are a challenge.",
        },
        {
          name: "Procedural",
          score: 85,
          description: "Follows calculus procedures correctly.",
        },
        {
          name: "Spatial",
          score: 65,
          description: "Struggles to visualize rates of change.",
        },
      ],
      aiSummary:
        "A solid first attempt at Calculus. Let's focus on mastering the Product Rule.",
      learningPlan: [
        {
          title: "Review Product Rule",
          duration: 40,
          action: "Watch the 'Calculus Product Rule' video.",
        },
      ],
      achievements: [
        {
          name: "Calculus Pioneer",
          description: "Completed your first calculus test.",
        },
      ],
      streak: 1,
    },
    {
      id: "test4",
      name: "Algebra - Functions and Relations",
      subject: "Algebra",
      date: "2023-08-01",
      overallScore: 78,
      peerAverage: 75,
      top10PercentScore: 89,
      accuracy: 78,
      correctAnswers: 39,
      totalQuestions: 50,
      timeTaken: 40,
      totalTime: 45,
      avgTimePerQuestion: 48,
      peerAvgTimePerQuestion: 50,
      performanceTrend: 3,
      topics: [
        {
          name: "Function Notation",
          score: 70,
          status: "Needs Work",
          difficulty: { easy: 80, medium: 70, hard: 60 },
        },
        {
          name: "Domain and Range",
          score: 80,
          status: "Proficient",
          difficulty: { easy: 90, medium: 80, hard: 70 },
        },
        {
          name: "Inverse Functions",
          score: 75,
          status: "Needs Work",
          difficulty: { easy: 85, medium: 75, hard: 65 },
        },
      ],
      cognitiveSkills: [
        {
          name: "Conceptual",
          score: 80,
          description: "Good conceptual understanding.",
        },
        {
          name: "Application",
          score: 75,
          description: "Applies concepts well.",
        },
        {
          name: "Critical",
          score: 72,
          description: "Improving critical thinking.",
        },
        {
          name: "Procedural",
          score: 85,
          description: "Strong procedural skills.",
        },
        { name: "Spatial", score: 75, description: "Good spatial awareness." },
      ],
      aiSummary:
        "Good job on the functions test. Let's work on function notation.",
      learningPlan: [],
      achievements: [],
      streak: 0,
    },
  ],
  availableTests: [
    {
      id: "at1",
      name: "Calculus II - Integration Techniques",
      subject: "Calculus",
      description: "Master various methods of integration.",
    },
    {
      id: "at2",
      name: "Trigonometry Basics - Sine, Cosine, Tangent",
      subject: "Trigonometry",
      description: "Build a strong foundation in trigonometric ratios.",
    },
    {
      id: "at3",
      name: "Advanced Geometry - Circle Theorems",
      subject: "Geometry",
      description: "Explore the fascinating properties of circles.",
    },
    {
      id: "at4",
      name: "Algebraic Expressions",
      subject: "Algebra",
      description: "Sharpen your skills in manipulating expressions.",
    },
  ],
};

//==============================================================================
// 3. THEME & STYLES
//==============================================================================
const theme = {
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
  divider: "#374151",
  green: "#34D399",
  yellow: "#FBBF24",
  red: "#F87171",
};

const GlobalStyles = () => (
  <style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
            animation: fadeIn 0.5s ease-out forwards;
        }
    `}</style>
);

const styles: { [key: string]: (isMobile: boolean) => React.CSSProperties } = {
  app: (isMobile) => ({
    backgroundColor: theme.background,
    color: theme.primaryText,
    fontFamily: "'Inter', sans-serif",
    minHeight: "100vh",
    padding: isMobile ? "1rem" : "2rem 4rem",
  }),
  header: (_isMobile) => ({ marginBottom: "2rem" }),
  h1: (isMobile) => ({
    fontSize: isMobile ? "1.5rem" : "2rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
  }),
  p: (isMobile) => ({
    color: theme.secondaryText,
    fontSize: isMobile ? "0.9rem" : "1rem",
  }),
  card: (isMobile) => ({
    backgroundColor: theme.cardBackground,
    borderRadius: "12px",
    padding: isMobile ? "1rem" : "1.5rem",
    marginBottom: "1.5rem",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  }),
  h2: (isMobile) => ({
    fontSize: isMobile ? "1.2rem" : "1.5rem",
    fontWeight: "600",
    marginBottom: "1.5rem",
    borderLeft: `4px solid ${theme.accent}`,
    paddingLeft: "1rem",
  }),
  grid: (isMobile) => ({
    display: "grid",
    gridTemplateColumns: isMobile
      ? "1fr"
      : "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1.5rem",
  }),
  button: (isMobile) => ({
    background: `linear-gradient(to right, ${theme.buttonGradientFrom}, ${theme.buttonGradientTo})`,
    color: theme.primaryText,
    border: "none",
    borderRadius: "8px",
    padding: "0.75rem 1.5rem",
    fontSize: isMobile ? "0.9rem" : "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  }),
  inputContainer: (_isMobile) => ({
    position: "relative",
    marginBottom: "2rem",
  }),
  input: (isMobile) => ({
    backgroundColor: theme.inputBackground,
    color: theme.primaryText,
    border: `1px solid ${theme.divider}`,
    borderRadius: "8px",
    padding: "0.75rem 1rem 0.75rem 2.5rem",
    fontSize: isMobile ? "0.9rem" : "1rem",
    width: "100%",
    boxSizing: "border-box",
  }),
};

//==============================================================================
// 4. ICON COMPONENTS
//==============================================================================
const TrendUpIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={theme.green}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ verticalAlign: "middle", marginRight: "4px" }}
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);
const BackIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ verticalAlign: "middle", marginRight: "8px" }}
  >
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);
const SearchIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke={theme.mutedText}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      position: "absolute",
      left: "0.75rem",
      top: "50%",
      transform: "translateY(-50%)",
    }}
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const LightbulbIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={theme.yellow}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18h6M12 22V18M12 14a4 4 0 1 0-4-4H8a4 4 0 0 0 4 4Z"></path>
    <path d="M12 2v1"></path>
    <path d="M6.34 4.34l.71.71"></path>
    <path d="M17.66 4.34l-.71.71"></path>
  </svg>
);
const StatusIcon = ({ status }: { status: TopicStatus }) => {
  const iconMap = {
    Mastered: {
      color: theme.green,
      path: "M22 11.08V12a10 10 0 1 1-5.93-9.14",
    },
    Proficient: { color: theme.green, path: "M20 6L9 17l-5-5" },
    "Needs Work": {
      color: theme.yellow,
      path: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
    },
    Priority: {
      color: theme.red,
      path: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    },
  };
  const { color, path } = iconMap[status];
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ verticalAlign: "middle", marginRight: "8px" }}
    >
      {" "}
      {status === "Mastered" ? (
        <>
          <path d={path}></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </>
      ) : (
        <path d={path}></path>
      )}{" "}
    </svg>
  );
};

//==============================================================================
// 5. REUSABLE UI COMPONENTS
//==============================================================================
const Card: React.FC<{
  children: React.ReactNode;
  isMobile: boolean;
  onClick?: () => void;
  className?: string;
}> = ({ children, isMobile, onClick, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardStyle = {
    ...styles.card(isMobile),
    transform: isHovered && onClick ? "scale(1.02)" : "scale(1)",
    boxShadow:
      isHovered && onClick
        ? `0 0 20px ${theme.accentLight}`
        : styles.card(isMobile).boxShadow,
    cursor: onClick ? "pointer" : "default",
  };
  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`fade-in ${className}`}
    >
      {children}
    </div>
  );
};
const SectionHeader: React.FC<{ title: string; isMobile: boolean }> = ({
  title,
  isMobile,
}) => <h2 style={styles.h2(isMobile)}>{title}</h2>;
const ProgressBar: React.FC<{
  value: number;
  color: string;
  height?: string;
}> = ({ value, color, height = "8px" }) => (
  <div
    style={{
      backgroundColor: theme.divider,
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

//==============================================================================
// 6. NEW & ENHANCED FEATURE COMPONENTS
//==============================================================================

const CognitiveSkills: React.FC<{
  skills: CognitiveSkill[];
  isMobile: boolean;
}> = ({ skills, isMobile }) => (
  <Card isMobile={isMobile}>
    <SectionHeader title="Cognitive Skill Profile" isMobile={isMobile} />
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
              style={{
                margin: 0,
                color: theme.accent,
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              {skill.score}%
            </p>
          </div>
          <ProgressBar value={skill.score} color={theme.accent} height="8px" />
          <p
            style={{
              margin: "0.5rem 0 0 0",
              color: theme.secondaryText,
              fontSize: "0.8rem",
            }}
          >
            {skill.description}
          </p>
        </div>
      ))}
    </div>
  </Card>
);

const AIRecommendationCard: React.FC<{
  tests: TestData[];
  availableTests: AvailableTest[];
  isMobile: boolean;
}> = ({ tests, availableTests, isMobile }) => {
  const recommendation = useMemo(() => {
    if (!tests.length) return null;

    const subjectScores: {
      [key in TestData["subject"]]?: { total: number; count: number };
    } = {};
    tests.forEach((test) => {
      if (!subjectScores[test.subject]) {
        subjectScores[test.subject] = { total: 0, count: 0 };
      }
      subjectScores[test.subject]!.total += test.overallScore;
      subjectScores[test.subject]!.count += 1;
    });

    let lowestSubject: TestData["subject"] | null = null;
    let lowestAvg = 101;

    for (const subject in subjectScores) {
      const avg =
        subjectScores[subject as TestData["subject"]]!.total /
        subjectScores[subject as TestData["subject"]]!.count;
      if (avg < lowestAvg) {
        lowestAvg = avg;
        lowestSubject = subject as TestData["subject"];
      }
    }

    if (!lowestSubject) return null;

    const recommendedTest = availableTests.find(
      (t) =>
        t.subject === lowestSubject && !tests.some((ht) => ht.name === t.name)
    );
    if (!recommendedTest) return null;

    return {
      reason: `Your lowest average score is in ${lowestSubject}. Let's work on that!`,
      test: recommendedTest,
    };
  }, [tests, availableTests]);

  if (!recommendation) return null;

  return (
    <Card isMobile={isMobile} className="fade-in">
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <LightbulbIcon />
        <div>
          <h3 style={{ margin: 0, color: theme.yellow }}>AI Recommendation</h3>
          <p style={{ margin: "0.25rem 0 1rem 0", color: theme.secondaryText }}>
            {recommendation.reason}
          </p>
          <p style={{ margin: "0 0 0.5rem 0", fontWeight: 600 }}>
            {recommendation.test.name}
          </p>
          <p style={{ margin: "0 0 1rem 0", color: theme.mutedText }}>
            {recommendation.test.description}
          </p>
          <button style={styles.button(isMobile)}>
            Start Recommended Test
          </button>
        </div>
      </div>
    </Card>
  );
};

//==============================================================================
// 7. DETAILED VIEW COMPONENTS (Unchanged logic, but will benefit from new Card style)
//==============================================================================
const TestDashboard: React.FC<{ test: TestData; isMobile: boolean }> = ({
  test,
  isMobile,
}) => (
  <Card isMobile={isMobile}>
    <SectionHeader
      title="At a Glance: Your Test Dashboard"
      isMobile={isMobile}
    />
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "center",
        gap: "2rem",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <p style={{ color: theme.secondaryText, margin: 0 }}>Overall Score</p>
        <p
          style={{
            fontSize: "3rem",
            fontWeight: "bold",
            color: theme.accent,
            margin: "0.5rem 0",
          }}
        >
          {test.overallScore}%
        </p>
        <div style={{ fontSize: "0.9rem", color: theme.mutedText }}>
          <p style={{ margin: 0 }}>Peer Avg: {test.peerAverage}%</p>
          <p style={{ margin: 0 }}>Top 10%: {test.top10PercentScore}%</p>
        </div>
      </div>
      <div style={{ flex: 1, width: "100%" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr",
            gap: "1rem",
          }}
        >
          <div>
            <p style={{ color: theme.secondaryText, margin: "0 0 0.5rem 0" }}>
              Accuracy
            </p>
            <p style={{ fontSize: "1.2rem", fontWeight: 600, margin: 0 }}>
              {test.accuracy}% ({test.correctAnswers}/{test.totalQuestions})
            </p>
          </div>
          <div>
            <p style={{ color: theme.secondaryText, margin: "0 0 0.5rem 0" }}>
              Time
            </p>
            <p style={{ fontSize: "1.2rem", fontWeight: 600, margin: 0 }}>
              {test.timeTaken} / {test.totalTime} min
            </p>
          </div>
          <div>
            <p style={{ color: theme.secondaryText, margin: "0 0 0.5rem 0" }}>
              Pacing
            </p>
            <p style={{ fontSize: "1.2rem", fontWeight: 600, margin: 0 }}>
              {test.avgTimePerQuestion}s / question
            </p>
          </div>
          <div>
            <p style={{ color: theme.secondaryText, margin: "0 0 0.5rem 0" }}>
              Trend
            </p>
            <p
              style={{
                fontSize: "1.2rem",
                fontWeight: 600,
                margin: 0,
                color: theme.green,
              }}
            >
              <TrendUpIcon />
              {test.performanceTrend > 0
                ? `+${test.performanceTrend}`
                : test.performanceTrend}
              %
            </p>
          </div>
        </div>
      </div>
    </div>
  </Card>
);
const PerformanceBreakdown: React.FC<{
  topics: TopicPerformance[];
  isMobile: boolean;
}> = ({ topics, isMobile }) => (
  <Card isMobile={isMobile}>
    <SectionHeader
      title="Deep Dive: Performance by Topic"
      isMobile={isMobile}
    />
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${theme.divider}` }}>
            <th
              style={{
                padding: "0.75rem",
                textAlign: "left",
                color: theme.secondaryText,
              }}
            >
              Topic
            </th>
            <th
              style={{
                padding: "0.75rem",
                textAlign: "left",
                color: theme.secondaryText,
              }}
            >
              Score
            </th>
            <th
              style={{
                padding: "0.75rem",
                textAlign: "left",
                color: theme.secondaryText,
              }}
            >
              Status
            </th>
            {!isMobile && (
              <th
                style={{
                  padding: "0.75rem",
                  textAlign: "left",
                  color: theme.secondaryText,
                }}
              >
                Difficulty Breakdown
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {topics.map((topic) => (
            <tr
              key={topic.name}
              style={{ borderBottom: `1px solid ${theme.divider}` }}
            >
              <td style={{ padding: "1rem 0.75rem", fontWeight: 600 }}>
                {topic.name}
              </td>
              <td style={{ padding: "1rem 0.75rem" }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <span style={{ width: "40px" }}>{topic.score}%</span>
                  <ProgressBar
                    value={topic.score}
                    color={
                      topic.score > 80
                        ? theme.green
                        : topic.score > 60
                        ? theme.yellow
                        : theme.red
                    }
                  />
                </div>
              </td>
              <td style={{ padding: "1rem 0.75rem" }}>
                <span style={{ display: "flex", alignItems: "center" }}>
                  <StatusIcon status={topic.status} /> {topic.status}
                </span>
              </td>
              {!isMobile && (
                <td
                  style={{
                    padding: "1rem 0.75rem",
                    fontSize: "0.9rem",
                    color: theme.secondaryText,
                  }}
                >
                  <span style={{ marginRight: "1rem" }}>
                    <b>E:</b> {topic.difficulty.easy}%
                  </span>
                  <span style={{ marginRight: "1rem" }}>
                    <b>M:</b> {topic.difficulty.medium}%
                  </span>
                  <span>
                    <b>H:</b> {topic.difficulty.hard}%
                  </span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
);
const LearningPlan: React.FC<{
  summary: string;
  plan: LearningPlanStep[];
  isMobile: boolean;
}> = ({ summary, plan, isMobile }) => (
  <Card isMobile={isMobile}>
    <SectionHeader title="Your AI-Powered Learning Plan" isMobile={isMobile} />
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
  </Card>
);
const Achievements: React.FC<{
  achievements: Achievement[];
  streak: number;
  isMobile: boolean;
}> = ({ achievements, streak, isMobile }) => (
  <Card isMobile={isMobile}>
    <SectionHeader title="Achievements & Motivation" isMobile={isMobile} />
    <p style={{ color: theme.yellow, fontWeight: 600 }}>
      Current Streak: You are on a {streak}-test improvement streak! Keep it up!
      🔥
    </p>
    <div style={{ marginTop: "1rem" }}>
      {achievements.map((ach) => (
        <div
          key={ach.name}
          style={{
            backgroundColor: theme.inputBackground,
            padding: "0.75rem",
            borderRadius: "8px",
            marginBottom: "0.5rem",
          }}
        >
          <p style={{ margin: 0, fontWeight: 600 }}>🏆 {ach.name}</p>
          <p
            style={{
              margin: "0.25rem 0 0 0",
              color: theme.secondaryText,
              fontSize: "0.9rem",
            }}
          >
            {ach.description}
          </p>
        </div>
      ))}
    </div>
  </Card>
);
const ReviewAndRelearn: React.FC<{ isMobile: boolean }> = ({ isMobile }) => (
  <Card isMobile={isMobile}>
    <SectionHeader title="Review & Relearn" isMobile={isMobile} />
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: "1rem",
      }}
    >
      <button style={{ ...styles.button(isMobile), flex: 1 }}>
        Full Answer Review
      </button>
      <button
        style={{
          ...styles.button(isMobile),
          flex: 1,
          background: theme.inputBackground,
          border: `1px solid ${theme.accent}`,
        }}
      >
        Build a "Tough Questions" Quiz
      </button>
    </div>
  </Card>
);

//==============================================================================
// 8. VIEW COMPONENTS
//==============================================================================
const TestDetailView: React.FC<{
  test: TestData;
  onBack: () => void;
  isMobile: boolean;
}> = ({ test, onBack, isMobile }) => (
  <div className="fade-in">
    <button
      onClick={onBack}
      style={{
        ...styles.button(isMobile),
        background: "none",
        border: `1px solid ${theme.accent}`,
        marginBottom: "2rem",
      }}
    >
      <BackIcon /> Back to Test History
    </button>
    <header style={styles.header(isMobile)}>
      <h1 style={styles.h1(isMobile)}>{test.name}</h1>
      <p style={styles.p(isMobile)}>
        Detailed analysis for your attempt on{" "}
        {new Date(test.date).toLocaleDateString()}.
      </p>
    </header>
    <main>
      <TestDashboard test={test} isMobile={isMobile} />
      <PerformanceBreakdown topics={test.topics} isMobile={isMobile} />
      <div style={styles.grid(isMobile)}>
        <CognitiveSkills skills={test.cognitiveSkills} isMobile={isMobile} />
        <Achievements
          achievements={test.achievements}
          streak={test.streak}
          isMobile={isMobile}
        />
      </div>
      <LearningPlan
        summary={test.aiSummary}
        plan={test.learningPlan}
        isMobile={isMobile}
      />
      <ReviewAndRelearn isMobile={isMobile} />
    </main>
  </div>
);

const TestHistoryList: React.FC<{
  user: User;
  tests: TestData[];
  availableTests: AvailableTest[];
  onSelectTest: (test: TestData) => void;
  isMobile: boolean;
}> = ({ user, tests, availableTests, onSelectTest, isMobile }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredTests = tests
    .filter((test) =>
      test.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="fade-in">
      <header style={styles.header(isMobile)}>
        <h1 style={styles.h1(isMobile)}>Test History</h1>
        <p style={styles.p(isMobile)}>
          Welcome back,{" "}
          <span style={{ fontWeight: "bold", color: theme.primaryText }}>
            {user.name}
          </span>
          ! Review your past attempts and get recommendations.
        </p>
      </header>
      <AIRecommendationCard
        tests={tests}
        availableTests={availableTests}
        isMobile={isMobile}
      />
      <div style={styles.inputContainer(isMobile)}>
        <SearchIcon />
        <input
          type="text"
          placeholder="Search for a test..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.input(isMobile)}
        />
      </div>
      <div>
        {filteredTests.length > 0 ? (
          filteredTests.map((test) => (
            <Card
              key={test.id}
              isMobile={isMobile}
              onClick={() => onSelectTest(test)}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontWeight: 600,
                      fontSize: isMobile ? "1rem" : "1.1rem",
                    }}
                  >
                    {test.name}
                  </p>
                  <p
                    style={{
                      margin: "0.25rem 0 0 0",
                      color: theme.secondaryText,
                      fontSize: "0.9rem",
                    }}
                  >
                    {new Date(test.date).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: isMobile ? "1.2rem" : "1.5rem",
                      fontWeight: "bold",
                      color:
                        test.overallScore > 80
                          ? theme.green
                          : test.overallScore > 60
                          ? theme.yellow
                          : theme.red,
                    }}
                  >
                    {test.overallScore}%
                  </p>
                  <p
                    style={{
                      margin: "0.25rem 0 0 0",
                      color: theme.mutedText,
                      fontSize: "0.8rem",
                    }}
                  >
                    Score
                  </p>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card isMobile={isMobile}>
            <p style={{ textAlign: "center", color: theme.secondaryText }}>
              No tests found matching your search.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

//==============================================================================
// 9. MAIN APP COMPONENT
//==============================================================================
const AttemptedTests = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedTest, setSelectedTest] = useState<TestData | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { user, tests, availableTests } = analysisData;

  return (
    <div style={styles.app(isMobile)}>
      <GlobalStyles />
      {selectedTest ? (
        <TestDetailView
          test={selectedTest}
          onBack={() => setSelectedTest(null)}
          isMobile={isMobile}
        />
      ) : (
        <TestHistoryList
          user={user}
          tests={tests}
          availableTests={availableTests}
          onSelectTest={(test) => setSelectedTest(test)}
          isMobile={isMobile}
        />
      )}
    </div>
  );
};

export default AttemptedTests;
