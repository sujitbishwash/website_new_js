import StatsCard from "@/components/stats/Card";
import CardContent from "@/components/stats/CardContent";
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
              <p className={`text-4xl font-bold ${activeSection?.color ?? ""}`}>
                {typeof activeSection?.score === "number"
                  ? activeSection.score.toFixed(2)
                  : String(activeSection?.score ?? "0")}
                <span className="text-sm font-normal text-[#8e8e93]">
                  /{String(activeSection?.maxScore ?? "")}
                </span>
              </p>
              <p className="text-xs text-[#8e8e93] font-medium uppercase tracking-wider">
                Score
              </p>
            </div>
            <div className="w-full">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <SummaryItem
                  value={String(activeSection?.rank ?? "")}
                  label="Rank"
                  total={String(activeSection?.maxRank ?? "")}
                />
                <SummaryItem
                  value={
                    typeof activeSection?.percentile === "number"
                      ? activeSection.percentile.toFixed(2)
                      : String(activeSection?.percentile ?? "")
                  }
                  label="Percentile"
                />
                <SummaryItem
                  value={
                    typeof activeSection?.accuracy === "number"
                      ? activeSection.accuracy.toFixed(2)
                      : String(activeSection?.accuracy ?? "")
                  }
                  label="Accuracy"
                />
                <SummaryItem
                  value={String(activeSection?.time ?? "")}
                  label="Time"
                  total={String(activeSection?.maxTime ?? "")}
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

export default SectionalSummary;