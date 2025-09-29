import StatsCard from "@/components/stats/Card";
import CardContent from "@/components/stats/CardContent";
import { ArrowDown } from "lucide-react";
import { useState } from "react";

// SummaryItem props
type SummaryItemProps = {
  value: string | number;
  label: string;
  total?: string | number;
};
// If you don’t have a shared types file you can inline:
type TopicType = {
  name: string;
  accuracy: number;
  time: string;
  totalQs: number;
  attempted: number;
  correct: number;
  score: number;
};

type SectionDataType = {
  key: string;
  name: string;
  color?: string;
  marks_scored: number;
  maxScore: number;
  rank: number;
  maxRank: number;
  percentile: number;
  accuracy: number;
  time: string;
  maxTime: string;
  topics: TopicType[];
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
// Props so you can pass in data instead of reading a global:
interface SectionalSummaryProps {
  sections: Record<string, SectionDataType>;
}

const SectionalSummary: React.FC<SectionalSummaryProps> = ({ sections }) => {
  const sectionTabs = Object.values(sections).map(
    (s) => s.name
  );
  const [activeTab, setActiveTab] = useState<string>(sectionTabs[0]);
  const [isTopicAnalysisOpen, setTopicAnalysisOpen] = useState<boolean>(true);

  // find the active section
  const activeSection = Object.values(sections).find(
    (s) => s.name === activeTab
  );

  if (!activeSection) return null; // Or a loading/error state
  //console.log(allTopics, totalCorrect, totalAttempted, totalQs);
  //console.log(sections);
  //console.log(activeSection);

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
                {typeof activeSection?.marks_scored === "number"
                  ? activeSection.marks_scored.toFixed(2)
                  : String(activeSection?.marks_scored ?? "0")}
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
                  value={String(activeSection?.rank ?? "NA")}
                  label="Rank"
                  total={String(activeSection?.maxRank ?? "")}
                />
                <SummaryItem
                  value={
                    typeof activeSection?.percentile === "number"
                      ? activeSection.percentile.toFixed(2)
                      : String(activeSection?.percentile ?? "NA")
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
            className={`transition-all duration-500 ease-in-out overflow-x-auto ${
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

                      <td className="px-4 py-4 text-center">
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