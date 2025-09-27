import StatsCard from "@/components/stats/Card";
import CardContent from "@/components/stats/CardContent";
const TopperStrategy = () => (
  <StatsCard tooltipText="Learn from the best! See how the topper approached the test.">
    <CardContent>
      <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
        Topper's Strategy
      </h3>
      <ul className="space-y-3 text-sm list-disc list-inside text-[#8e8e93]">
        <li>
          The topper scored{" "}
          <span className="font-bold text-[#0A84FF]">95.25</span> by attempting{" "}
          <span className="font-bold text-[#0A84FF]">97</span> questions.
        </li>
        <li>
          They achieved nearly perfect accuracy in Reasoning and Numerical
          Ability (<span className="font-bold text-[#0A84FF]">&gt;95%</span>).
        </li>
        <li>
          Their time on incorrect questions was only{" "}
          <span className="font-bold text-[#0A84FF]">2 minutes</span>,
          minimizing time lost on wrong answers.
        </li>
      </ul>
    </CardContent>
  </StatsCard>
);
export default TopperStrategy;