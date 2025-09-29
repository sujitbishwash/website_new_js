import StatsCard from "@/components/stats/Card";
import CardContent from "@/components/stats/CardContent";
import { Check, Clock, Star, Target, X } from "lucide-react";
import { useState } from "react";
interface ComparisonAnalysisProps {
    comparisons: {
      data: Record<string, any>;
      maxValues: Record<string, number>;
    };
}

const ComparisonAnalysis = ({ comparisons }: ComparisonAnalysisProps) => {
  const [activeTab, setActiveTab] = useState("Your Score");
  const tabs = [
    { id: "Your Score", icon: <Star className="w-4 h-4" /> },
    { id: "Accuracy", icon: <Target className="w-4 h-4" /> },
    { id: "Correct", icon: <Check className="w-4 h-4" /> },
    { id: "Incorrect", icon: <X className="w-4 h-4" /> },
    { id: "Time Spent", icon: <Clock className="w-4 h-4" /> },
  ];

  const chartData = comparisons.data[activeTab];
  const maxValue = comparisons.maxValues[activeTab];
  //console.log(chartData, maxValue);
  // FIX: Add a guard clause to prevent crash if data for a tab is not found.
  if (!chartData || !maxValue) {
    return (
      <StatsCard
        tooltipText="Compare your performance against the average and the topper across different metrics."
        className="lg:col-span-8"
      >
        <CardContent>
          <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
            Comparison Analysis
          </h3>
          <p className="text-muted-foreground">
            Comparison data is not available for the selected metric.
          </p>
        </CardContent>
      </StatsCard>
    );
  }

  const getGroupTotal = (groupData: any) => {
    if (!groupData) return 0;
    if (activeTab === "Time Spent") {
      const totalSeconds = Object.values(groupData).reduce(
        (a: number, b: any) => a + Number(b || 0),
        0
      );
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }
    if (activeTab === "Accuracy") {
      const values = Object.values(groupData).map((v: any) => Number(v || 0));
      return (
        values.reduce((a: number, b: number) => a + b, 0) / (values.length || 1)
      ).toFixed(2);
    }
    const total = Object.values(groupData).reduce(
      (a: number, b: any) => a + Number(b || 0),
      0
    );
    return Number.isInteger(total) ? total : total.toFixed(2);
  };

  const yAxisLabels = () => {
    const labels = [];
    for (let i = 4; i >= 0; i--) {
      const value = (maxValue / 4) * i;
      labels.push(
        <div key={i} className="text-md text-[#636366]">
          {activeTab === "Accuracy"
            ? `${Math.floor(value / 60)}%`
            : activeTab === "Time Spent"
            ? `${Math.floor(value / 60)}m`
            : Math.round(value)}
        </div>
      );
    }
    return labels;
  };

  const comparisonSections = [
    { key: "english", name: "English", color: "bg-[#0A84FF]" },
    { key: "numerical", name: "Numerical", color: "bg-[#FF3B30]" },
    { key: "reasoning", name: "Reasoning", color: "bg-[#FFCC00]" },
    { key: "generalAwareness", name: "GA", color: "bg-[#34C759]" },
  ];

  return (
    <StatsCard
      tooltipText="Compare your performance against the average and the topper across different metrics."
      className="lg:col-span-8"
    >
      <CardContent>
        <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
          Comparison Analysis Demo
        </h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-1.5 px-3 sm:py-2 sm:px-4 text-sm font-semibold rounded-lg transition-colors duration-300 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "bg-background-subtle text-muted-foreground hover:bg-accent"
              }`}
            >
              {tab.icon}
              <span>{tab.id}</span>
            </button>
          ))}
        </div>

        <div className="flex">
          <div className="flex flex-col justify-between h-56 mr-4 text-right">
            {yAxisLabels()}
          </div>
          <div className="w-full flex flex-col">
            <div className="w-full h-56 relative border-b border-solid border-[#38383A]">
              <div className="absolute inset-0 grid grid-rows-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="border-t border-dashed border-[#38383A]"
                  ></div>
                ))}
              </div>
              <div className="absolute inset-0 flex justify-around items-end">
                {Object.keys(chartData).map((groupKey) => (
                  <div
                    key={groupKey}
                    className="w-1/3 h-full flex items-end justify-center space-x-1 px-1"
                  >
                    {comparisonSections.map((section) => (
                      <div
                        key={section.key}
                        className={`w-3 sm:w-5 rounded-t-md transition-all duration-500 ${section.color}`}
                        style={{
                          height: `${
                            (chartData[groupKey][section.key] / maxValue) * 100
                          }%`,
                        }}
                        title={`${section.name}: ${
                          chartData[groupKey][section.key]
                        }`}
                      ></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full flex justify-around">
              {Object.keys(chartData).map((groupKey) => (
                <div key={groupKey} className="text-center w-1/3 pt-2">
                  <p className="font-bold text-sm sm:text-md">
                    {getGroupTotal(chartData[groupKey])}
                  </p>
                  <p className="text-[#8e8e93] text-xs sm:text-sm mb-1 capitalize">
                    {groupKey}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 mt-4">
          {comparisonSections.map((section) => (
            <div key={section.key} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${section.color}`}></div>
              <span className="text-xs text-[#8e8e93] font-medium">
                {section.name}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </StatsCard>
  );
};
export default ComparisonAnalysis;