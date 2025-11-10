import type { IconProps } from "./IconProps";

export const Icon: React.FC<IconProps> = ({
  path,
  className = "w-6 h-6",
  strokeWidth = 1.5,
  useFill = false,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={useFill ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d={path} />
  </svg>
);