import React from "react";
import { Crown } from "lucide-react";
import RankBadge from "@/components/stats/RankBadge";
import formatScore from "@/lib/formatScore";
import StatsCard from "@/components/stats/Card";
// Types for a leaderboard entry
interface LeaderboardUser {
  rank: number;
  name: string;
  score: number;
}

// Props: pass in data instead of using a global
interface LeaderboardProps {
  leaderboard: LeaderboardUser[];
  currentUser: { name: string; message?: string };
  currentRank: number;
  currentScore: number;
}
const getBadgeClasses = (rank: number): string => {
  switch (rank) {
    case 1: // Gold
      return "#FFD60A";
    case 2: // Silver
      return "#C0C0C0";
    case 3: // Bronze
      return "#CD7F32";
    default:
      if (rank >= 4 && rank <= 10) {
        // Iron
        return "#43464B";
      }
      return "#5A5A5A"; // Default
  }
};
const Leaderboard2: React.FC<LeaderboardProps> = ({
  leaderboard,
  currentUser,
  currentRank,
  currentScore,
}) => {
  {
    /* --- Leaderboard Section --- */
  }
  return (
    <StatsCard
      tooltipText="See where you stand among the top performers in this test."
      noteText="Considers first attempt only"
      className="col-span-8 row-span-1 rounded-2xl border border-divider bg-card p-6 mb-16 lg:mb-0 shadow-sm md:p-8 hover:shadow-xl transition-all duration-500 ease-in-out"
    >
      <h3 className="justify-center text-lg font-semibold mb-4 flex items-center text-foreground gap-2">
        <Crown /> Leaderboard
      </h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-divider">
            <th className="pb-4 text-left text-sm font-medium uppercase text-muted-foreground">
              Rank
            </th>
            <th className="pb-4 pl-2 text-left text-sm font-medium uppercase text-muted-foreground">
              Name
            </th>
            <th className="pb-4 text-left text-sm font-medium uppercase text-muted-foreground">
              Score
            </th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user) => (
            <tr
              key={user.rank}
              className={`border-b border-divider last:border-b-0 ${
                user.rank === currentRank ? "bg-accent" : ""
              }`}
            >
              <td className="whitespace-nowrap font-semibold text-foreground">
                <RankBadge
                  color={getBadgeClasses(user.rank)}
                  number={user.rank}
                />
              </td>
              <td className="whitespace-nowrap py-4 px-2 font-bold text-foreground text-lg overflow-x-auto max-w-[200px]">
                {user.name}
              </td>
              <td className="whitespace-nowrap py-4 text-blue-500 font-bold tracking-wider text-xl">
                {formatScore(user.score)}
              </td>
            </tr>
          ))}
          {currentRank > 10 && (
            <tr className="bg-accent">
              <td className="whitespace-nowrap font-semibold text-foreground">
                <RankBadge number={currentRank} />
              </td>
              <td className="whitespace-nowrap py-4 px-2 font-bold text-foreground text-lg">
                {currentUser.name}
              </td>
              <td className="whitespace-nowrap py-4 text-blue-500 font-bold tracking-wider text-xl">
                {currentScore}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </StatsCard>
  );
};
export default Leaderboard2;
