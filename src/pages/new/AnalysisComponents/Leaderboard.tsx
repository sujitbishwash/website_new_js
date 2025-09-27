import StatsCard from "@/components/stats/Card";
import CardContent from "@/components/stats/CardContent";
const Leaderboard = () => {
  const leaderboardData = (userPerformance as any)?.leaderboard || [];
  const currentUser = (userPerformance as any)?.user || { name: "" };
  const chunkSize = 5;
  const column1 = leaderboardData.slice(0, chunkSize);
  const column2 = leaderboardData.slice(chunkSize, chunkSize * 2);
  // Helper function to determine badge styles based on rank
  const getBadgeClasses = (rank) => {
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

  // A reusable component for each user row in the leaderboard
  const UserRow = ({ user }: { user: any }) => (
    <div
      key={user.rank}
      className="flex items-center justify-between text-lg  rounded-lg hover:bg-accent transition-colors duration-200"
    >
      <div className="flex items-center space-x-3">
        <RankBadge color={getBadgeClasses(user.rank)} number={user.rank} />
        <div className="font-semibold text-foreground flex items-center">
          {user.name}
          {user.rank === 1 && (
            <Crown className="w-4 h-4 ml-1.5 text-[#FFD60A]" />
          )}
        </div>
      </div>
      <span className="font-bold text-primary tracking-wider">
        {typeof user.score === "number"
          ? formatScore(user.score)
          : String(user.score ?? "0")}
      </span>
    </div>
  );
  return (
    <StatsCard
      tooltipText="See where you stand among the top performers in this test."
      className="md:col-span-8 md:row-span-1"
    >
      <CardContent>
        <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
          Leaderboard
        </h3>

        {/* Leaderboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
          {/* Column 1 */}
          <div className="space-y-2">
            {column1.map((user) => (
              <UserRow key={user.rank} user={user} />
            ))}
          </div>
          {/* Column 2 */}
          <div className="space-y-2 mt-2 md:mt-0">
            {column2.map((user) => (
              <UserRow key={user.rank} user={user} />
            ))}
          </div>
        </div>

        {/* Your current user row below */}
        <div className="p-1">
          <div className="border-t border-1 my-2"></div>
        </div>
        {/* Current User Row */}
        <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-accent border border-primary/50">
          <div className="flex items-center space-x-3">
            <RankBadge
              color={getBadgeClasses(userPerformance.overall.rank)}
              number={userPerformance.overall.rank}
            />
            <div className="font-semibold text-gray-100 flex items-center space-x-2">
              <p className="font-bold text-lg text-foreground">
                {currentUser.name}
              </p>
              <p className=" text-primary font-medium mt-0.5">
                {currentUser.message}
              </p>
            </div>
          </div>
          <span className="font-bold text-primary tracking-wider">
            {formatScore(userPerformance.overall.score)}
          </span>
        </div>
      </CardContent>
    </StatsCard>
  );
};
export default Leaderboard;