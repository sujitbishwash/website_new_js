
function formatScore(value: number): string {
  const rounded = Math.round(value * 100) / 100; // round to 2 decimals
  return Number.isInteger(rounded)
    ? rounded.toString()
    : rounded.toFixed(2);
}
export default formatScore;