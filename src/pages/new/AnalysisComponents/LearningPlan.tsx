import StatsCard from "@/components/stats/Card";
import CardContent from "@/components/stats/CardContent";
import { theme } from "@/styles/theme";
interface LearningPlanStep {
  title: string;
  duration: number;
  action: string;
  goal?: string;
  aiTutorPrompt?: string;
}
const LearningPlan: React.FC<{
  summary: string;
  plan: LearningPlanStep[];
  isMobile: boolean;
}> = ({ summary, plan }) => (
  <StatsCard className="md:col-span-4 md:row-span-1">
    <CardContent>
      <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
        Your AI-Powered Learning Plan
      </h3>
      <div
        style={{
          backgroundColor: theme.accentLight,
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "1.5rem",
        }}
      >
        <p style={{ margin: 0, color: theme.accent, fontStyle: "italic" }}>
          "{summary}"
        </p>
      </div>
      <div>
        {plan.map((step, index) => (
          <div
            key={index}
            style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  backgroundColor: theme.accent,
                  color: theme.primaryText,
                  display: "grid",
                  placeItems: "center",
                  fontWeight: "bold",
                }}
              >
                {index + 1}
              </div>
              {index < plan.length - 1 && (
                <div
                  style={{
                    width: "2px",
                    flex: 1,
                    backgroundColor: theme.divider,
                    marginTop: "0.5rem",
                  }}
                />
              )}
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 600 }}>
                {step.title}{" "}
                <span style={{ color: theme.mutedText, fontWeight: 400 }}>
                  {" "}
                  (Est. {step.duration} mins)
                </span>
              </p>
              <p style={{ margin: "0.25rem 0", color: theme.secondaryText }}>
                {step.action}
              </p>
              {step.goal && (
                <p
                  style={{
                    margin: "0.25rem 0",
                    fontSize: "0.9rem",
                    color: theme.green,
                  }}
                >
                  <b>Goal:</b> {step.goal}
                </p>
              )}
              {step.aiTutorPrompt && (
                <p
                  style={{
                    margin: "0.25rem 0",
                    fontSize: "0.9rem",
                    backgroundColor: theme.inputBackground,
                    padding: "0.5rem",
                    borderRadius: "4px",
                  }}
                >
                  <b>AI Tutor Prompt:</b> {step.aiTutorPrompt}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </StatsCard>
);
export default LearningPlan;