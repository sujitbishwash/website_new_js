import StatsCard from "@/components/stats/Card";
import CardContent from "@/components/stats/CardContent";
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
              level === "Hard"
                ? "text-red-500"
                : level === "Med"
                ? "text-yellow-500"
                : "text-green-500";

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
export default YourAttemptStrategy;