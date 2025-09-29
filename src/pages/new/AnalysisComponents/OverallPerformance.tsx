import StatsCard from "@/components/stats/Card";
import CardContent from "@/components/stats/CardContent";
import formatScore from "@/lib/formatScore";
// ScoreDonutChart props
type ScoreDonutChartProps = {
  data: {
    [key: string]: {
      score: number;
      color: string;
    };
  };
  size?: number;
  maxScore?: number;
};

// SummaryItem props
type SummaryItemProps = {
  value: string | number;
  label: string;
  total?: string | number;
};

// Section + Topic shapes
type Topic = {
  correct: number;
  attempted: number;
  totalQs: number;
};

type SectionData = {
  name?: string;
  score?: number;
  maxScore?: number;
  color?: string;
  topics: Topic[];
};

type OverallData = {
  score?: number;
  maxScore?: number;
  rank?: number;
  maxRank?: number;
  percentile?: number;
  accuracy?: number;
  time?: number | string;
  maxTime?: number | string;
};

// Props for the OverallPerformance component
type OverallPerformanceProps = {
  overallData: OverallData;
  sectionsData: Record<string, SectionData>;
};

const ScoreDonutChart: React.FC<ScoreDonutChartProps> = ({
  data,
  size = 200,
  maxScore = 100,
}) => {
  const scoresArray = Object.entries(data).map(([label, { score, color }]) => {
    const hexMatch = color.match(/#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/);
    return {
      label,
      value: score,
      color: hexMatch ? hexMatch[0] : "#FFFFFF",
    };
  });

  const currentScore = scoresArray.reduce(
    (sum, item) => sum + (Number(item.value) || 0),
    0
  );

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
        {scoresArray.map((item, index) => {
          if (item.value <= 0) return null;

          const dasharray = (item.value / maxScore) * circumference;
          const rotation = (cumulative / maxScore) * 360;
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
              strokeDasharray={`${dasharray} ${circumference}`}
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

const SummaryItem: React.FC<SummaryItemProps> = ({ value, label, total }) => (
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
const OverallPerformance: React.FC<OverallPerformanceProps> = ({
  overallData,
  sectionsData,
}) => {
  // guard against undefined
  const allTopics = Object.values(sectionsData || {}).flatMap(
    (s) => s.topics ?? []
  );
  const totalCorrect = allTopics.reduce((sum, t) => sum + t.correct, 0);
  const totalAttempted = allTopics.reduce((sum, t) => sum + t.attempted, 0);
  const totalQs = allTopics.reduce((sum, t) => sum + t.totalQs, 0);
  const totalIncorrect = totalAttempted - totalCorrect;
  const totalSkipped = totalQs - totalAttempted;
  //console.log(allTopics, totalCorrect, totalAttempted, totalQs);
  //console.log(overallData, sectionsData);
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
                  score: overallData?.score ?? 0,
                  color: "#0A84FF",
                },
              }}
              maxScore={overallData?.maxScore ?? 100}
            />
            <div className="w-full">
              <div className="grid grid-cols-2 gap-4 text-center mb-6">
                {Object.entries(sectionsData || {}).map(([name, data]) => {
                  const section: any = data || {};
                  const score =
                    typeof section.marks_scored === "number"
                      ? section.marks_scored.toFixed(2)
                      : String(section.marks_scored ?? "0");
                  const maxScore = section.maxScore ?? "";
                  return (
                    <div
                      key={name}
                      className="bg-background-subtle p-4 rounded-lg"
                    >
                      <p className="text-sm text-[#8e8e93]">
                        {section.name ?? name}
                      </p>
                      <p
                        className={`text-3xl font-bold ${section.color ?? ""}`}
                      >
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
                  value={String(overallData?.rank ?? "")}
                  label="Rank"
                  total={String(overallData?.maxRank ?? "")}
                />
                <SummaryItem
                  value={
                    typeof overallData?.percentile === "number"
                      ? overallData.percentile.toFixed(2)
                      : String(
                          overallData?.percentile ?? ""
                        )
                  }
                  label="Percentile"
                />
                <SummaryItem
                  value={
                    typeof overallData?.accuracy === "number"
                      ? overallData.accuracy.toFixed(2)
                      : String(overallData?.accuracy ?? "")
                  }
                  label="Accuracy"
                />
                <SummaryItem
                  value={String(overallData?.time ?? "")}
                  label="Time"
                  total={String(overallData?.maxTime ?? "")}
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
};
export default OverallPerformance;
