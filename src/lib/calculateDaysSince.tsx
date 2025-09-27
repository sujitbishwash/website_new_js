// Helper to calculate days since the test was taken
const calculateDaysSince = (dateString: string): string => {
  if (!dateString) return "";
  const today = new Date(); // Current fixed time
  const testDate = new Date(dateString);
  today.setHours(0, 0, 0, 0);
  testDate.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - testDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
};

export default calculateDaysSince;