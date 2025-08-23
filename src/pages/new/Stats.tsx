import React, { useState } from "react";
import {
  Flame,
  Award,
  Trophy,
  Unlock,
  ArrowRight,
  Info,
  BarChart,
  Clock,
  BookOpen,
  Target,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Zap,
  TrendingUp,
  BrainCircuit,
  TargetIcon,
} from "lucide-react";

// --- Dark Mode Color Palette ---
const colors = {
  background: "#1d1d1f",
  cardBackground: "#2c2c2e",
  primaryText: "#f5f5f7", // Slightly off-white for better readability
  secondaryText: "#8e8e93",
  accent: "#0A84FF",
  accentLight: "rgba(10, 132, 255, 0.15)",
  divider: "#38383A",
  green: "#34C759",
  yellow: "#FFCC00",
  orange: "#FF9500",
};

// --- Helper function to generate mock data ---
const generateDailyData = (numDays) => {
  const scores = [];
  const hours = [];
  let currentScore = 3; // Starting score
  for (let i = 0; i < numDays; i++) {
    const scoreFluctuation = Math.random() - 0.4;
    currentScore += scoreFluctuation;
    currentScore = Math.max(0, Math.min(10, currentScore));
    scores.push({ day: i, score: parseFloat(currentScore.toFixed(1)) });

    const dayOfWeek = i % 7;
    let dailyHour =
      dayOfWeek === 0 || dayOfWeek === 6
        ? Math.random() * 2 + 2
        : Math.random() * 2 + 0.5;
    if (Math.random() < 0.1) dailyHour = 0;
    hours.push({ day: i, hours: parseFloat(dailyHour.toFixed(1)) });
  }
  return { scores, hours };
};

const { scores: dailyScores, hours: dailyHours } = generateDailyData(45);

// --- Mock Data for SBI PO Aspirant ---
const dashboardData = {
  user: {
    name: "Ankit",
    streak: 5,
    streakHistory: [true, false, true, true, true, true, true],
  },
  progress: [
    { subject: "Quantitative Aptitude", completed: 4, total: 10 },
    { subject: "Reasoning Ability", completed: 6, total: 10 },
    { subject: "English Language", completed: 3, total: 10 },
  ],
  score: {
    dailyScores: dailyScores,
    totalQuestions: 10,
  },
  time: {
    dailyHours: dailyHours,
  },
  exams: [
    { name: "SBI PO Prelims", date: new Date(2025, 8, 4) },
    { name: "IBPS PO Prelims", date: new Date(2025, 9, 12) },
    { name: "RBI Grade B", date: new Date(2025, 8, 21) },
  ],
  performanceMetrics: {
    attemptPercentage: 85,
    accuracyPercentage: 92,

    speed: { goal: 45, achieved: 50 },
  },
  leaderboard: { rank: 10500, totalStudents: 15000 },
  todayStep: {
    title: "Daily Quant Challenge",
    topic: "Data Interpretation",
    questions: 5,
  },
  // Replaced encouragement with AI Remark
  aiRemark:
    "Your accuracy is high at 92%, which is excellent. However, your attempt rate of 85% suggests a potential for improvement in speed. Focus on time-saving techniques in Reasoning to maximize your score.",
  appFilterReward: {
    title: "Reward Unlocked!",
    reason: "For your consistent high accuracy, you've earned a new app theme.",
    filterName: "Focus Mode Theme",
  },
};

// --- UI Component Placeholders ---
const Card = ({ children, className = "", tooltipText }) => (
  <div
    className={`group transition-all duration-300 relative bg-card rounded-xl shadow-sm border border-border overflow-hidden ${className}`}
  >
    {" "}
    <div className="absolute inset-0 border border-transparent rounded-xl group-hover:border-white/20 transition-all duration-300 pointer-events-none"></div>
    {tooltipText && (
      <div className="absolute top-4 right-4 group/info">
        <Info
          className="w-4 h-4 transition-colors text-muted-foreground"
        />

          <div className="border border-border absolute bg-background right-full top-[-0.5rem] ml-0 w-56 p-2 rounded-lg animate-fade-in-up opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
          {tooltipText}
        </div>
      </div>
    )}
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm ${className}`}
    {...props}
  >
    {children}
  </button>
);


// --- Existing Components ---
const StreakTracker = ({ history, streak }) => {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  return (
    <div className="flex flex-col items-center justify-center h-full">
        <div className="flex items-center space-x-2 bg-black bg-opacity-20 px-3 py-1.5 rounded-full mb-4">
            <Flame className="w-5 h-5 text-yellow-300" />
            <span className="font-bold text-md" style={{color: colors.primaryText}}>{streak} Day Streak</span>
        </div>
        <div className="flex justify-center items-center gap-2">
            {days.map((day, index) => (
                <div key={index} className="flex flex-col items-center space-y-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center ${history[index] ? 'bg-white/20' : 'bg-black/20'}`}>
                        {history[index] && <CheckCircle className="w-5 h-5" style={{color: colors.green}} />}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};
const SectionalProgress = ({ sections }) => (
  <div className="space-y-4">
    {sections.map((section) => {
      const percentage = Math.round((section.completed / section.total) * 100);
      return (
        <div key={section.subject}>
          <div className="flex justify-between items-center mb-1">
            <p
              className="text-sm font-medium text-foreground"
            >
              {section.subject}
            </p>
            <p
              className="text-sm font-bold text-muted-foreground"
            >
              {percentage}%
            </p>
          </div>
          <div
            className="w-full rounded-full h-2.5 bg-background"
          >
            <div
              className="h-2.5 rounded-full"
              style={{ width: `${percentage}%`, backgroundColor: colors.green }}
            ></div>
          </div>
        </div>
      );
    })}
  </div>
);

const InteractiveGraph = ({
  data,
  total,
  unit,
  strokeColor,
  gradientColor,
}) => {
  const [tooltip, setTooltip] = useState(null);
  const width = 100;
  const height = 100;

  const pathData = data
    .map((point, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - (point.value / total) * height;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  const handleMouseMove = (e) => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - svgRect.left;
    const index = Math.round((x / svgRect.width) * (data.length - 1));
    const point = data[index];
    const pointX = (index / (data.length - 1)) * 100;
    const pointY = 100 - (point.value / total) * 100;
    setTooltip({ x: pointX, y: pointY, value: point.value, index });
  };

  return (
    <div
      className="h-48 rounded-lg p-4 relative"
      style={{ backgroundColor: colors.background }}
      onMouseLeave={() => setTooltip(null)}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        onMouseMove={handleMouseMove}
      >
        <defs>
          <linearGradient
            id={`gradient-${unit}`}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop
              offset="0%"
              style={{ stopColor: gradientColor, stopOpacity: 0.4 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: gradientColor, stopOpacity: 0 }}
            />
          </linearGradient>
        </defs>
        <path
          d={`${pathData} L ${width} ${height} L 0 ${height} Z`}
          fill={`url(#gradient-${unit})`}
        />
        <path d={pathData} fill="none" stroke={strokeColor} strokeWidth="1" />
        {tooltip && (
          <>
            <line
              x1={tooltip.x}
              y1="0"
              x2={tooltip.x}
              y2="100"
              stroke="#9ca3af"
              strokeWidth="0.25"
              strokeDasharray="1"
            />
            <circle
              cx={tooltip.x}
              cy={tooltip.y}
              r="2"
              fill="white"
              stroke={strokeColor}
              strokeWidth="1"
            />
          </>
        )}
      </svg>
      {tooltip && (
        <div
          className="absolute text-xs text-white px-2 py-1 rounded-md pointer-events-none"
          style={{
            left: `${tooltip.x}%`,
            top: `${tooltip.y - 12}%`,
            transform: "translateX(-50%)",
            backgroundColor: "#111",
          }}
        >
          Day {tooltip.index + 1}: {tooltip.value} {unit}
        </div>
      )}
      <div
        className="absolute bottom-0 left-4 right-4 flex justify-between text-xs"
        style={{ color: colors.secondaryText }}
      >
        <span>45 days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
};

// --- UPDATED & NEW COMPONENTS ---

const ExamCalendar = ({ exams }) => {
  const [view, setView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const changeMonth = (offset) =>
    setCurrentDate(
      new Date(currentDate.setMonth(currentDate.getMonth() + offset))
    );

  const renderMonthView = () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = ["S", "M", "T", "W", "T", "F", "S"];

    const blanks = Array(firstDay).fill(null);
    const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
      <div
        style={{
          borderTop: `1px solid ${colors.divider}`,
          borderLeft: `1px solid ${colors.divider}`,
        }}
      >
        <div
          className="grid grid-cols-7 text-center text-xs font-semibold text-muted-foreground"
        >
          {days.map((d, index) => (
            <div
              key={`${d}-${index}`}
              className="py-2"
              style={{
                borderRight: `1px solid ${colors.divider}`,
                borderBottom: `1px solid ${colors.divider}`,
              }}
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 text-center text-sm">
          {blanks.map((_, i) => (
            <div
              key={`b-${i}`}
              style={{
                borderRight: `1px solid ${colors.divider}`,
                borderBottom: `1px solid ${colors.divider}`,
                minHeight: "3.5rem",
              }}
            ></div>
          ))}
          {dates.map((date) => {
            const isToday =
              today.getDate() === date &&
              today.getMonth() === month &&
              today.getFullYear() === year;
            const examOnThisDay = exams.find(
              (e) =>
                e.date.getDate() === date &&
                e.date.getMonth() === month &&
                e.date.getFullYear() === year
            );

            let dayStyle = { color: colors.primaryText };
            if (examOnThisDay) {
              dayStyle.backgroundColor = colors.accent;
              dayStyle.color = colors.primaryText;
            } else if (isToday) {
              dayStyle.backgroundColor = colors.accentLight;
              dayStyle.color = colors.accent;
            }

            return (
              <div
                key={date}
                className="flex justify-center items-center py-2"
                style={{
                  borderRight: `1px solid ${colors.divider}`,
                  borderBottom: `1px solid ${colors.divider}`,
                }}
                title={examOnThisDay?.name}
              >
                <span
                  className="w-9 h-9 flex items-center justify-center rounded-full transition-colors"
                  style={dayStyle}
                >
                  {date}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  const renderYearView = () => {
    const months = Array.from({ length: 12 }, (_, i) => new Date(currentDate.getFullYear(), i).toLocaleString('default', { month: 'short' }));
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {months.map((month, index) => (
          <button 
            key={month} 
            className="p-2 text-center rounded-lg hover:bg-indigo-100 transition-colors"
            onClick={() => {
              setCurrentDate(new Date(currentDate.getFullYear(), index));
              setView('month');
            }}
          >
            {month}
          </button>
        ))}
      </div>
    );
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <button onClick={() => view === 'month' ? changeMonth(-1) : changeYear(-1)} className="p-1 rounded-md hover:bg-gray-100"><ChevronLeft className="w-5 h-5" /></button>
          <h4 className="font-semibold text-center w-32">
            {view === 'month' ? currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }) : currentDate.getFullYear()}
          </h4>
          <button onClick={() => view === 'month' ? changeMonth(1) : changeYear(1)} className="p-1 rounded-md hover:bg-gray-100"><ChevronRight className="w-5 h-5" /></button>
        </div>
        <button onClick={() => setView(v => v === 'month' ? 'year' : 'month')} className="text-sm text-indigo-600 font-semibold">
          {view === 'month' ? 'Zoom Out' : 'Zoom In'}
        </button>
      </div>
      {view === 'month' ? renderMonthView() : renderYearView()}
    </div>
  );
};

const CircularProgressChart = ({ percentage, label, color, text, icon }) => {
  const Icon = icon;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            strokeWidth="8"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
            className="text-border"
          />
          <circle
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
            transform="rotate(-90 50 50)"
            style={{
              stroke: color,
              transition: "stroke-dashoffset 0.5s ease-out",
            }}
          />
          <text
            x="50"
            y="50"
            className="text-xl font-bold text-foreground"
            textAnchor="middle"
            dy=".3em"
          >
            {text || `${percentage}%`}
          </text>
        </svg>
      </div>
      <div className="flex items-center gap-1.5">
        <Icon className="w-4 h-4" style={{ color }} />
        <p
          className="text-sm font-medium text-muted-foreground"
        >
          {label}
        </p>
      </div>
    </div>
  );
};

const LeaderboardPosition = ({ rank, totalStudents }) => {
  const percentile = (1 - rank / totalStudents) * 100;
  const topPercentage = 100 - percentile;

  return (
    <div className="w-full">
      <p className="text-center mb-2" style={{ color: colors.secondaryText }}>
        You are in the{" "}
        <span className="font-bold" style={{ color: colors.accent }}>
          top {topPercentage.toFixed(1)}%
        </span>{" "}
        of all aspirants. Keep pushing!
      </p>
      <div
        className="w-full rounded-full h-4 relative"
        style={{ backgroundColor: colors.divider }}
      >
        <div
          className="h-4 rounded-full"
          style={{
            width: `${percentile}%`,
            background: `linear-gradient(to right, ${colors.green}, ${colors.accent})`,
          }}
        ></div>
        <div
          className="absolute top-0 h-4 w-1 bg-white rounded-full shadow-lg"
          style={{ left: `calc(${percentile}% - 2px)` }}
        >
          <div
            className="absolute -top-6 -translate-x-1/2 text-xs text-white px-2 py-1 rounded-md"
            style={{ backgroundColor: "#111" }}
          >
            You
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-black"></div>
          </div>
        </div>
      </div>
      <div
        className="flex justify-between text-xs mt-1"
        style={{ color: colors.secondaryText }}
      >
        <span>Bottom 50%</span>
        <span>Top 10%</span>
      </div>
    </div>
  );
};

// --- Main Dashboard Component ---
function Stats() {
  const totalTimeThisPeriod = dashboardData.time.dailyHours.reduce(
    (acc, curr) => acc + curr.hours,
    0
  );
  const daysLeft = Math.ceil(
    (dashboardData.exams[0].date - new Date()) / (1000 * 60 * 60 * 24)
  );
  const latestScore =
    dashboardData.score.dailyScores[dashboardData.score.dailyScores.length - 1]
      .score;
  const { performanceMetrics } = dashboardData;

  const speedScore = Math.round(
    (performanceMetrics.speed.goal / performanceMetrics.speed.achieved) * 100
  );
  return (
    <div className="p-4 sm:p-6 bg-background min-h-screen font-sans">
      <div className="max-w-7xl mx-auto mb-8 text-center">
        <h1
          className="text-3xl font-bold text-foreground"
        >
          Welcome back, {dashboardData.user.name}
        </h1>
      </div>
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-0 md:grid md:grid-cols-4 md:gap-6">
        {/* Welcome + Streak */}
        <Card
          className="md:col-span-4 md:row-span-1"
          tooltipText="Your daily study streak. Consistency is the most important factor for success!"
        >
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Welcome back, {dashboardData.user.name} 👋
                </h2>
                <p className="opacity-90 mt-1">
                  You’ve been consistent for {dashboardData.user.streak} days.
                </p>
              </div>
              <div className="flex items-center space-x-2 bg-background bg-opacity-20 px-3 py-1.5 rounded-full">
                <Flame className="w-5 h-5 text-yellow-300" />
                <span className="font-bold text-md">
                  {dashboardData.user.streak} Day Streak
                </span>
              </div>
            </div>
                <StreakTracker history={dashboardData.user.streakHistory} streak={dashboardData.user.streak} />
          </CardContent>
        </Card>

        {/* Sectional Progress */}
        <Card
          className="md:col-span-2 md:row-span-1"
          tooltipText="Tracks your progress in mastering topics for each subject. Aim for 100% in all sections before the exam."
        >
          <CardContent>
            <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
              <BookOpen
                className="w-5 h-5 mr-2 text-foreground"
              />
              Sectional Progress
            </h3>
            <SectionalProgress sections={dashboardData.progress} />
          </CardContent>
        </Card>

        {/* Performance Analytics */}
        
        <Card className="md:col-span-2 md:row-span-1" tooltipText="Attempt %: Questions you tried. Accuracy %: Correct answers from your attempts. Speed: How fast you answer compared to the ideal time.">
            <CardContent>
            <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
              <TrendingUp
                className="w-5 h-5 mr-2 text-accent"
              />
              Performance Analytics
            </h3>
            <div className="flex flex-wrap justify-around items-center gap-4">
              <CircularProgressChart
                percentage={performanceMetrics.attemptPercentage}
                label="Attempt"
                color={colors.accent}
                icon={CheckCircle}
              />
              <CircularProgressChart
                percentage={performanceMetrics.accuracyPercentage}
                label="Accuracy"
                color={colors.green}
                icon={TargetIcon}
              />
              <CircularProgressChart
                percentage={speedScore > 100 ? 100 : speedScore}
                text={`${speedScore}`}
                label="Speed"
                color={colors.orange}
                icon={Zap}
              />
            </div>
          </CardContent>
        </Card>

        <Card
          className="md:col-span-2 md:row-span-1"
          tooltipText="A visual trend of your daily mock test scores over the last 45 days. Hover over the graph to see daily details."
        >
          <CardContent>
            <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
              <BarChart
                className="w-5 h-5 mr-2"
                style={{ color: colors.accent }}
              />
              Score Improvement
            </h3>
            <p className="text-sm mb-4" style={{ color: colors.secondaryText }}>
              Your performance over the last 45 days. Latest score:{" "}
              <span className="font-bold" style={{ color: colors.green }}>
                {latestScore}/{dashboardData.score.totalQuestions}
              </span>
            </p>
            <InteractiveGraph
              data={dashboardData.score.dailyScores.map((d) => ({
                ...d,
                value: d.score,
              }))}
              total={10}
              unit="score"
              strokeColor={colors.accent}
              gradientColor={colors.accent}
            />
          </CardContent>
        </Card>

        <Card
          className="md:col-span-2 md:row-span-1"
          tooltipText="Tracks the hours you've studied each day for the past 45 days. Consistency is key!"
        >
          <CardContent>
            <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
              <Clock
                className="w-5 h-5 mr-2"
                style={{ color: colors.accent }}
              />
              Time Invested
            </h3>
            <p className="text-sm mb-4" style={{ color: colors.secondaryText }}>
              Your daily study hours over the last 45 days.
            </p>
            <InteractiveGraph
              data={dashboardData.time.dailyHours.map((d) => ({
                ...d,
                value: d.hours,
              }))}
              total={5}
              unit="hrs"
              strokeColor={colors.green}
              gradientColor={colors.green}
            />
          </CardContent>
        </Card>

        {/* Exam Countdown (Full Width) */}
        <Card
          className="md:col-span-4"
          tooltipText="Your exam calendar. Dates marked in blue are upcoming exams. Today is highlighted with a blue glow."
        >
          <CardContent>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
                  <Target
                    className="w-5 h-5 mr-2"
                    style={{ color: colors.accent }}
                  />
                  Upcoming Exams
                </h3>
                <p className="text-sm" style={{ color: colors.secondaryText }}>
                  {daysLeft > 0
                    ? `${daysLeft} days to ${dashboardData.exams[0].name}`
                    : "Exam day is here!"}
                </p>
              </div>
            </div>
            <ExamCalendar exams={dashboardData.exams} />
          </CardContent>
        </Card>

        <Card
          className="md:col-span-4"
          tooltipText="This shows your percentile rank compared to all other students on the platform. It helps you understand your competition."
        >
          <CardContent>
            <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
              <Trophy
                className="w-5 h-5 mr-2"
                style={{ color: colors.accent }}
              />
              Your Position
            </h3>
            <LeaderboardPosition
              rank={dashboardData.leaderboard.rank}
              totalStudents={dashboardData.leaderboard.totalStudents}
            />
          </CardContent>
        </Card>

        {/* AI Remark */}
        <Card
          className="md:col-span-2"
          style={{
            backgroundColor: colors.accentLight,
            borderColor: colors.accent,
          }}
          tooltipText="A personalized insight generated by AI based on your recent performance data to help you focus on what matters most."
        >
          <CardContent>
            <h3 className="text-lg font-semibold mb-4 flex items-center text-accent">
              <BrainCircuit className="w-5 h-5 mr-2" /> AI-Powered Remark
            </h3>
            <p style={{ color: colors.secondaryText }}>
              {dashboardData.aiRemark}
            </p>
          </CardContent>
        </Card>

        <Card
          className="md:col-span-1 md:row-span-1"
          tooltipText="Your recommended task for today. Completing daily challenges is a great way to build a study habit."
        >
          <CardContent className="flex flex-col justify-between h-full">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
              <Zap className="w-5 h-5 mr-2" style={{ color: colors.yellow }} />{" "}
              {dashboardData.todayStep.title}
            </h3>
            <p className="text-sm my-4" style={{ color: colors.secondaryText }}>
              Tackle {dashboardData.todayStep.questions}{" "}
              {dashboardData.todayStep.topic} questions.
            </p>
            <Button>
              Start Challenge <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Combined Challenge & Badge Card */}
        <Card
          className="md:col-span-1 md:row-span-1"
          style={{
            backgroundColor: "rgba(52, 199, 89, 0.1)",
            borderColor: colors.green,
          }}
          tooltipText="Rewards are unlocked based on your achievements, like improving accuracy or maintaining a streak."
        >
          <CardContent className="flex flex-col items-center justify-center text-center h-full">
            <Unlock className="w-12 h-12" style={{ color: colors.green }} />
            <h3
              className="text-lg font-semibold mt-2"
              style={{ color: colors.primaryText }}
            >
              {dashboardData.appFilterReward.title}
            </h3>
            <p className="text-sm" style={{ color: colors.secondaryText }}>
              {dashboardData.appFilterReward.reason}
            </p>
            <p
              className="text-sm font-bold mt-2"
              style={{ color: colors.green }}
            >
              {dashboardData.appFilterReward.filterName}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// The App component that renders the Dashboard
export default function App() {
  return <Stats />;
}
