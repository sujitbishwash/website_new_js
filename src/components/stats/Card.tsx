import { Info } from "lucide-react";
import { ReactNode } from "react";

// --- UI Component Placeholders ---
interface StatsCardProps {
  children: ReactNode;
  className?: string;
  tooltipText?: string;
  noteText?: string;
  style?: React.CSSProperties;
}

const StatsCard: React.FC<StatsCardProps> = ({
  children,
  className = "",
  tooltipText,
  noteText,
}) => (
  <div
    className={`group transition-all duration-300 relative bg-card rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-xl ${className}`}
  >
    {" "}
    {tooltipText && (
      <div className="absolute top-4 right-4 group/info">
        <Info className="w-4 h-4 transition-colors text-muted-foreground" />

        <div className="border border-border absolute bg-background right-full top-[-0.5rem] ml-0 w-56 p-2 rounded-lg animate-fade-in-up scale-0 group-hover/info:scale-100 transition-scale pointer-events-none z-10 shadow-lg">
          {tooltipText}
        </div>
      </div>
    )}
    {children}
    {noteText && (
      <div className="absolute bottom-4 right-4 ">
        <h3 className="text-muted-foreground italic text-sm">*{noteText}</h3>
      </div>
    )}
  </div>
);

export default StatsCard;
