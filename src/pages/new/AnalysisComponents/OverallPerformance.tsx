import StatsCard from "@/components/stats/Card";
import CardContent from "@/components/stats/CardContent";
import formatScore from "@/lib/formatScore";
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
  const currentScore = scoresArray.reduce(
    (sum, item) => sum + (Number(item.value) || 0),
    0
  );
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
        <span className="text-5xl font-bold">{formatScore(currentScore)}</span>
        <span className="text-2xl text-[#8e8e93] font-medium">
          /{formatScore(maxScore)}
        </span>
      </div>
    </div>
  );
};

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
const OverallPerformance = (overallPerformanceData, sectionsData) => {
  // --- DATA TRANSFORMATIONS ---
const allTopics = Object.values(sectionsData).flatMap(
  (s) => s.topics
);
const totalCorrect = allTopics.reduce((sum, t) => sum + t.correct, 0);
const totalAttempted = allTopics.reduce((sum, t) => sum + t.attempted, 0);
const totalQs = allTopics.reduce((sum, t) => sum + t.totalQs, 0);
const totalIncorrect = totalAttempted - totalCorrect;
const totalSkipped = totalQs - totalAttempted;
  return (
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
                score: overallPerformanceData?.score ?? 0,
                color: "#0A84FF",
              },
            }}
            maxScore={overallPerformanceData?.maxScore ?? 100}
          />
          <div className="w-full">
            <div className="grid grid-cols-2 gap-4 text-center mb-6">
              {Object.entries(sectionsData).map(([name, data]) => {
                const section: any = data || {};
                const score =
                  typeof section.score === "number"
                    ? section.score.toFixed(2)
                    : String(section.score ?? "0");
                const maxScore = section.maxScore ?? "";
                return (
                  <div
                    key={name}
                    className="bg-background-subtle p-4 rounded-lg"
                  >
                    <p className="text-sm text-[#8e8e93]">
                      {section.name ?? name}
                    </p>
                    <p className={`text-3xl font-bold ${section.color ?? ""}`}>
                      {score}{" "}
                      <span className="text-lg text-[#636366]">
                        /{maxScore}
                      </span>
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 text-center">
              <SummaryItem
                value={String(overallPerformanceData?.overall?.rank ?? "")}
                label="Rank"
                total={String(overallPerformanceData?.overall?.maxRank ?? "")}
              />
              <SummaryItem
                value={
                  typeof overallPerformanceData?.percentile ===
                  "number"
                    ? overallPerformanceData.percentile.toFixed(2)
                    : String(
                        overallPerformanceData?.overall?.percentile ?? ""
                      )
                }
                label="Percentile"
              />
              <SummaryItem
                value={
                  typeof overallPerformanceData?.accuracy ===
                  "number"
                    ? overallPerformanceData.accuracy.toFixed(2)
                    : String(overallPerformanceData?.overall?.accuracy ?? "")
                }
                label="Accuracy"
              />
              <SummaryItem
                value={String(overallPerformanceData?.time ?? "")}
                label="Time"
                total={String(overallPerformanceData?.maxTime ?? "")}
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
)};
export default OverallPerformance;