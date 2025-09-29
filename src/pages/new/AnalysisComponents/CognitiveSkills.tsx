import StatsCard from "@/components/stats/Card";
import CardContent from "@/components/stats/CardContent";
import { theme } from "@/styles/theme";
interface CognitiveSkill {
  name: string;
  score: number;
  description: string;
}
const ProgressBar: React.FC<{
  value: number;
  color: string;
  height?: string;
}> = ({ value, color, height = "8px" }) => (
  <div
    className="bg-border-high"
    style={{
      borderRadius: "4px",
      overflow: "hidden",
      height,
    }}
  >
    <div
      style={{
        width: `${value}%`,
        backgroundColor: color,
        height,
        borderRadius: "4px",
        transition: "width 0.5s ease-in-out",
      }}
    />
  </div>
);
const CognitiveSkills: React.FC<{
  skills: CognitiveSkill[];
}> = ({ skills }) => (
  <StatsCard
    className="lg:col-span-4"
    tooltipText="An analysis of your cognitive abilities based on your test performance."
  >
    <CardContent>
      <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
        Cognitive Skill Profile Demo
      </h3>
      <div>
        {skills.map((skill) => (
          <div key={skill.name} style={{ marginBottom: "1rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.25rem",
              }}
            >
              <p style={{ margin: 0, fontWeight: 600, fontSize: "0.9rem" }}>
                {skill.name}
              </p>
              <p
                className="text-primary"
                style={{
                  margin: 0,
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              >
                {skill.score}%
              </p>
            </div>

            <ProgressBar
              value={skill.score}
              color={theme.buttonGradientFrom}
              height="8px"
            />

            <p
              style={{
                margin: "0.5rem 0 0 0",
                fontSize: "0.8rem",
              }}
            >
              {skill.description}
            </p>
          </div>
        ))}
      </div>
    </CardContent>
  </StatsCard>
);

export default CognitiveSkills;