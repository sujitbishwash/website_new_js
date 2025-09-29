import StatsCard from "@/components/stats/Card";
import CardContent from "@/components/stats/CardContent";
import { BicepsFlexed, Siren, Sparkle, Target } from "lucide-react";
const ActionableInsights = () => (
  <StatsCard
    tooltipText="Key takeaways and specific suggestions to improve your score."
    className="md:col-span-4 md:row-span-1"
  >
    <CardContent>
      <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
        <Sparkle className="w-7 h-7 text-primary mr-3" />
        <span>Actionable Insights Demo</span>
      </h3>
      <div className="space-y-4 text-md">
        <div className="flex">
          {" "}
          <BicepsFlexed className="w-5 h-5 text-[#34C759] mr-3 mt-0.5 flex-shrink-0" />{" "}
          <div>
            {" "}
            <h3 className="font-bold text-[#34C759]">
              Strength Area: English Language
            </h3>{" "}
            <p className="text-[#8e8e93]">
              Your score of 21.25 with 87.32% accuracy is excellent. Your
              percentile of 95.80 in this section is your highest. Keep
              reinforcing this strength.
            </p>{" "}
          </div>{" "}
        </div>
        <div className="flex">
          {" "}
          <Siren className="w-5 h-5 text-[#FF3B30] mr-3 mt-0.5 flex-shrink-0" />{" "}
          <div>
            {" "}
            <h3 className="font-bold text-[#FF3B30]">
              Improvement Area: Pacing in Reasoning
            </h3>{" "}
            <p className="text-[#8e8e93]">
              You spent 22 minutes in the Reasoning section, exceeding the
              20-minute allocation. This extra time could be better used in
              other sections. Focus on timed practice for Reasoning topics.
            </p>{" "}
          </div>{" "}
        </div>
        <div className="flex">
          {" "}
          <Target className="w-5 h-5 text-[#0A84FF] mr-3 mt-0.5 flex-shrink-0" />{" "}
          <div>
            {" "}
            <h3 className="font-bold text-[#0A84FF]">
              Focus Topic: General Awareness
            </h3>{" "}
            <p className="text-[#8e8e93]">
              With 76.25% accuracy in GA, there's scope for improvement.
              Focusing on Current Affairs and Static GK could provide a
              significant boost to your overall score.
            </p>{" "}
          </div>{" "}
        </div>
      </div>
    </CardContent>
  </StatsCard>
);
export default ActionableInsights;