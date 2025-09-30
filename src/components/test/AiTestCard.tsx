import { ROUTES } from "@/routes/constants";
import { useNavigate } from "react-router-dom";
import { AiRecommendation } from "../types/AiRecommendation";

// --- Component for AI Recommended Tests ---
const AiTestCard = ({ test }: { test: AiRecommendation }) => {
  const navigate = useNavigate();
  return (
    <div className="select-none flex-shrink-0 w-auto bg-background-subtle border border-border rounded-2xl p-5 flex flex-col justify-between transform hover:scale-[1.02] hover:border-primary transition-all duration-300 ease-in-out">
      <div>
        <p className="text-lg font-semibold text-foreground">{test.reason}</p>
        <p className="text-md text-muted-foreground">{test.examName}</p>
      </div>
      <button
        onClick={() => navigate(ROUTES.EXAM_INFO)}
        className="mt-4 w-full px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-white hover:bg-primary/80 transition-colors duration-200 cursor-pointer"
      >
        Start Now
      </button>
    </div>
  );
};
export default AiTestCard;