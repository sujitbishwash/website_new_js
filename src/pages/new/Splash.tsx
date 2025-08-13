import React, { useEffect, useMemo, useRef, useState } from "react";

// Centralized theme colors for easy customization
const theme = {
  background: "#111827", // bg-gray-900
  cardBackground: "#1F2937", // bg-gray-800
  primaryText: "#FFFFFF", // text-white
  secondaryText: "#9CA3AF", // text-gray-400
  accent: "#60A5FA", // text-blue-400
  accentLight: "#93C5FD", // A lighter blue for glows/hovers
  divider: "#4B5563", // border-gray-600
};

// --- Helper Components ---

const YouTubeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const AiAgentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5.25 4.5a3.375 3.375 0 00-3.375-3.375h-1.5a3.375 3.375 0 00-3.375 3.375M9 12h6"
    />
  </svg>
);

const PersonalizedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.47 2.118v-.09a2.25 2.25 0 012.244-2.437a3 3 0 005.78-1.128zM15.75 12.75a3 3 0 00-3.363-3.363m3.363 3.363a3 3 0 01-3.363 3.363m3.363-3.363l6.363-6.363m-6.363 6.363a3 3 0 00-3.363-3.363m-3.363 3.363a3 3 0 01-3.363-3.363m0 0a3 3 0 013.363-3.363m0 0a3 3 0 013.363 3.363m0 0l6.363 6.363"
    />
  </svg>
);

interface Hotspot {
  top: string;
  left: string;
  text: string;
}

// --- Feature Data ---
const features = [
  {
    type: "welcome",
    title: "Welcome to AIPadhai",
    description:
      "The future of learning is here. Let's explore how we transform your study sessions.",
  },
  {
    type: "feature",
    icon: <YouTubeIcon />,
    title: "Learn from any YouTube Video",
    description:
      "Paste a video link and our AI creates summaries, interactive transcripts, and notes.",
    image:
      "https://placehold.co/1200x900/1F2937/9CA3AF?text=Interactive+Video+UI",
    hotspots: [
      { top: "30%", left: "25%", text: "AI-generated summary" },
      { top: "55%", left: "60%", text: "Clickable transcript" },
    ] as Hotspot[],
  },
  {
    type: "feature",
    icon: <AiAgentIcon />,
    title: "24/7 AI Agent Guidance",
    description:
      "Ask questions and get instant, detailed explanations from your personal AI tutor.",
    image: "https://placehold.co/1200x900/1F2937/9CA3AF?text=AI+Tutor+Chat",
    hotspots: [
      { top: "40%", left: "50%", text: "Ask any question" },
      { top: "65%", left: "30%", text: "Follow-up suggestions" },
    ] as Hotspot[],
  },
  {
    type: "feature",
    icon: <PersonalizedIcon />,
    title: "Personalized Learning Path",
    description:
      "Receive custom quizzes and materials that adapt to your unique learning style.",
    image:
      "https://placehold.co/1200x900/1F2937/9CA3AF?text=Custom+Quiz+Generation",
    hotspots: [
      { top: "50%", left: "50%", text: "Adaptive quiz questions" },
    ] as Hotspot[],
  },
];

const HotspotComponent: React.FC<{ hotspot: Hotspot }> = ({ hotspot }) => (
  <div
    className="absolute group"
    style={{ top: hotspot.top, left: hotspot.left }}
  >
    <div className="w-4 h-4 rounded-full bg-blue-400 cursor-pointer animate-pulse"></div>
    <div className="absolute bottom-full mb-2 w-max px-3 py-1 text-sm text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none transform -translate-x-1/2 left-1/2">
      {hotspot.text}
    </div>
  </div>
);

const AnimatedTitle: React.FC<{
  text: string;
  isActive: boolean;
  className?: string;
}> = ({ text, isActive, className }) => {
  return (
    <h2
      className={`text-4xl md:text-6xl font-bold ${className}`}
      style={{ color: theme.primaryText }}
    >
      {text.split("").map((char, index) => (
        <span
          key={index}
          className={`inline-block transition-all duration-500 ease-out ${
            isActive ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
          style={{ transitionDelay: `${index * 30}ms` }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h2>
  );
};

const WelcomeSlide: React.FC<{
  isActive: boolean;
  title: string;
  description: string;
}> = ({ isActive, title, description }) => {
  return (
    <div
      className={`absolute inset-0 w-full h-full flex flex-col justify-center items-center text-center p-8 transition-all duration-700 ease-in-out ${
        isActive
          ? "opacity-100 scale-100"
          : "opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <AnimatedTitle text={title} isActive={isActive} />
      <p
        className={`max-w-2xl mt-4 text-lg md:text-xl transition-all duration-700 ease-out delay-300 ${
          isActive ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0"
        }`}
        style={{ color: theme.secondaryText }}
      >
        {description}
      </p>
    </div>
  );
};

const FeatureSlide: React.FC<{ feature: any; isActive: boolean }> = ({
  feature,
  isActive,
}) => {
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!imageRef.current) return;
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    imageRef.current.style.transform = `rotateY(${x * 10}deg) rotateX(${
      -y * 10
    }deg) scale(1.05)`;
    imageRef.current.style.transition = "none";
  };

  const handleMouseLeave = () => {
    if (!imageRef.current) return;
    imageRef.current.style.transform = "rotateY(0) rotateX(0) scale(1)";
    imageRef.current.style.transition = "transform 0.5s ease";
  };

  return (
    <div
      className={`absolute inset-0 w-full h-full grid grid-cols-1 md:grid-cols-2 items-center gap-8 p-8 md:p-16 transition-all duration-700 ease-in-out ${
        isActive
          ? "opacity-100 scale-100"
          : "opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <div className="flex flex-col items-center md:items-start text-center md:text-left">
        <div
          className={`flex items-center gap-4 mb-4 transition-all duration-500 ease-out ${
            isActive ? "animate-pop-in" : "opacity-0"
          }`}
          style={{ color: theme.accent }}
        >
          {feature.icon}
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ color: theme.primaryText }}
          >
            {feature.title}
          </h2>
        </div>
        <p
          className={`max-w-md text-lg md:text-xl transition-all duration-700 ease-out delay-200 ${
            isActive ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0"
          }`}
          style={{ color: theme.secondaryText }}
        >
          {feature.description}
        </p>
      </div>
      <div
        className="w-full h-full flex items-center justify-center [perspective:1000px]"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={imageRef}
          className={`relative transition-transform duration-500 ease-out w-full max-w-2xl`}
        >
          <img
            src={feature.image}
            alt={feature.title}
            className="object-contain w-full h-auto rounded-2xl shadow-2xl"
            style={{ boxShadow: `0 0 40px -10px ${theme.accentLight}30` }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src =
                "https://placehold.co/1200x900/1F2937/FF0000?text=Image+Not+Found";
            }}
          />
          {feature.hotspots?.map((hotspot: Hotspot, index: number) => (
            <HotspotComponent key={index} hotspot={hotspot} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ProgressBar: React.FC<{ duration: number; isPaused: boolean }> = ({
  duration,
  isPaused,
}) => (
  <div className="w-full h-1" style={{ backgroundColor: theme.divider }}>
    <div
      className="h-full bg-blue-400"
      style={{
        animation: `progress ${duration}ms linear forwards`,
        animationPlayState: isPaused ? "paused" : "running",
      }}
    />
  </div>
);

export default function Splash() {
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideDuration = 7000; // 7 seconds

  const goToNext = () =>
    setCurrentFeatureIndex((prev) => (prev + 1) % features.length);
  const goToPrev = () =>
    setCurrentFeatureIndex(
      (prev) => (prev - 1 + features.length) % features.length
    );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isPaused) {
      const timer = setTimeout(goToNext, slideDuration);
      return () => clearTimeout(timer);
    }
  }, [currentFeatureIndex, isPaused]);

  const memoizedProgressBar = useMemo(
    () => <ProgressBar duration={slideDuration} isPaused={isPaused} />,
    [currentFeatureIndex, isPaused]
  );

  return (
    <div
      style={{ backgroundColor: theme.background }}
      className="h-screen w-screen overflow-hidden flex flex-col justify-between items-center relative font-sans antialiased"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <style>{`
                @keyframes progress {
                    from { width: 0%; }
                    to { width: 100%; }
                }
                @keyframes aurora {
                    0% { background-position: 50% 0%; }
                    50% { background-position: 50% 100%; }
                    100% { background-position: 50% 0%; }
                }
                .aurora-background {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-image: radial-gradient(ellipse 80% 80% at 50% -20%, rgba(120, 119, 198, 0.2), rgba(255, 255, 255, 0));
                    animation: aurora 20s infinite linear;
                    z-index: 0;
                }
                @keyframes pop-in {
                    0% { transform: scale(0.5); opacity: 0; }
                    70% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-pop-in {
                    animation: pop-in 0.5s ease-out forwards;
                }
            `}</style>
      <div className="aurora-background"></div>
      <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20">
        <h1 className="text-2xl font-bold" style={{ color: theme.primaryText }}>
          AIPadhai
        </h1>
        <button className="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
          Skip Intro
        </button>
      </header>
      <div className="w-full h-full flex-grow relative z-10">
        {features.map((feature, index) => {
          if (feature.type === "welcome") {
            return (
              <WelcomeSlide
                key={index}
                isActive={index === currentFeatureIndex}
                title={feature.title}
                description={feature.description}
              />
            );
          }
          return (
            <FeatureSlide
              key={index}
              feature={feature}
              isActive={index === currentFeatureIndex}
            />
          );
        })}
      </div>
      <div className="absolute bottom-0 w-full p-8 flex flex-col items-center z-20">
        {currentFeatureIndex === features.length - 1 ? (
          <button
            className={`px-8 py-3 font-bold rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:scale-105 shadow-xl transition-all duration-500 ease-out ${
              currentFeatureIndex === features.length - 1
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          >
            Get Started
          </button>
        ) : (
          <>
            <div className="flex justify-center gap-3 mb-6">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFeatureIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentFeatureIndex === index
                      ? "bg-blue-400 scale-150"
                      : "bg-gray-600 hover:bg-gray-500"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            <div className="w-full max-w-xs">{memoizedProgressBar}</div>
          </>
        )}
      </div>
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all z-20"
        style={{ color: theme.primaryText }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all z-20"
        style={{ color: theme.primaryText }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
