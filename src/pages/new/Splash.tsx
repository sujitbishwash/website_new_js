import { markAsReturningUser, markSplashAsSeen } from "@/lib/utils";
import { ROUTES } from "@/routes/constants";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AiPadhaiLogo from "../../assets/ai_padhai_logo.svg"; // Adjust path as needed

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
  <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33" />
    <path d="m9.75 15.02 5.75-3.27-5.75-3.27z" />
  </svg>

);

const AiAgentIcon = () => (
  <svg height="50" width="50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 37.172 37.172"><g stroke-width="0" /><g stroke-linecap="round" stroke-linejoin="round" /><path fill="currentColor" d="M37.01 14.722a1.52 1.52 0 0 0-1.475-.836l-1.849.135C31.68 6.772 25.041 1.425 17.161 1.425 7.698 1.425 0 9.124 0 18.586s7.698 17.161 17.161 17.161a17.23 17.23 0 0 0 13.896-7.088 1.527 1.527 0 0 0-2.47-1.794 14.17 14.17 0 0 1-11.427 5.83c-7.781 0-14.11-6.33-14.11-14.11s6.329-14.11 14.11-14.11c6.266 0 11.586 4.109 13.421 9.772l-.963.07a1.526 1.526 0 0 0-.886 2.676l2.77 2.392c.27.434.746.724 1.293.724.029 0 .055-.006.084-.008l.025.004a1.53 1.53 0 0 0 1.155-.529l2.742-3.175a1.52 1.52 0 0 0 .21-1.683" /><path fill="currentColor" d="M9.093 23.903v-1.482l1.351-1.221c2.284-2.043 3.393-3.218 3.425-4.44 0-.853-.514-1.528-1.722-1.528-.9 0-1.689.449-2.235.869l-.692-1.754c.788-.593 2.01-1.077 3.426-1.077 2.365 0 3.667 1.383 3.667 3.281 0 1.753-1.27 3.153-2.782 4.504l-.965.804v.031h3.941v2.012H9.093zm13.259 0v-2.494h-4.633v-1.591l3.957-6.371h2.992v6.129h1.254v1.833h-1.254v2.494zm0-4.327V17.26c0-.628.032-1.27.08-1.946h-.064c-.339.676-.612 1.287-.965 1.946l-1.399 2.284v.032z" /></svg>

);

const PersonalizedIcon = () => (
  <svg width="50" height="50" viewBox="0 0 0.72 0.72" xmlns="http://www.w3.org/2000/svg"><g fill="none"><path d="M.72 0v.72H0V0zM.378.698.376.699H.375L.373.698H.372L.371.711v.001l.003.002.003-.002V.711L.376.698.375.697M.383.694.377.697.378.71l.006.003h.001L.384.695zm-.021 0H.361L.36.712l.001.001L.367.71.368.697z" /><path d="M.36.06q.017 0 .033.002a.03.03 0 0 1-.007.06.24.24 0 1 0 .212.212.03.03 0 1 1 .06-.007Q.66.343.66.36a.3.3 0 1 1-.3-.3M.359.236a.03.03 0 0 1-.022.037A.09.09 0 0 0 .36.45.09.09 0 0 0 .447.382a.03.03 0 0 1 .058.015A.15.15 0 0 1 .21.36.15.15 0 0 1 .322.215a.03.03 0 0 1 .037.022M.555.065a.03.03 0 0 1 .019.028v.055h.055A.03.03 0 0 1 .65.199L.544.304a.03.03 0 0 1-.021.009H.45L.395.368A.03.03 0 0 1 .353.326L.408.27V.198A.03.03 0 0 1 .417.177L.523.071A.03.03 0 0 1 .556.064m-.041.1L.468.21v.042H.51L.556.206H.544a.03.03 0 0 1-.03-.03z" fill="currentColor" /></g></svg>
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
    title: "Welcome to AI Padhai",
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
          className={`inline-block transition-all duration-500 ease-out ${isActive ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
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
      className={`absolute inset-0 w-full h-full flex flex-col justify-center items-center text-center p-8 transition-all duration-700 ease-in-out ${isActive
        ? "opacity-100 scale-100"
        : "opacity-0 scale-95 pointer-events-none"
        }`}
    >
      <AnimatedTitle text={title} isActive={isActive} />
      <p
        className={`max-w-2xl mt-4 text-lg md:text-xl transition-all duration-700 ease-out delay-300 ${isActive ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0"
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
    imageRef.current.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10
      }deg) scale(1.05)`;
    imageRef.current.style.transition = "none";
  };

  const handleMouseLeave = () => {
    if (!imageRef.current) return;
    imageRef.current.style.transform = "rotateY(0) rotateX(0) scale(1)";
    imageRef.current.style.transition = "transform 0.5s ease";
  };

  return (
    <div className={`absolute inset-0 w-full h-full flex justify-center items-center p-8 transition-all duration-700 ease-in-out ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-16 w-full max-w-7xl">
        {/* Text Content */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className={`flex items-center gap-4 mb-4 transition-all duration-500 ease-out ${isActive ? "animate-pop-in" : "opacity-0"}`} style={{ color: theme.accent }}>
            {feature.icon}
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: theme.primaryText }}>
              {feature.title}
            </h2>
          </div>
          <p className={`max-w-md text-lg md:text-xl transition-all duration-700 ease-out delay-200 ${isActive ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0"}`} style={{ color: theme.secondaryText }}>
            {feature.description}
          </p>
        </div>

        {/* Image Content */}
        <div className="w-full flex items-center justify-center [perspective:1000px]" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
          <div ref={imageRef} className={`relative transition-transform duration-500 ease-out w-full max-w-2xl`}>
            <img
              src={feature.image}
              alt={feature.title}
              className="object-contain w-full h-auto rounded-2xl shadow-2xl"
              style={{ boxShadow: `0 0 40px -10px ${theme.accentLight}30` }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "https://placehold.co/1200x900/1F2937/FF0000?text=Image+Not+Found";
              }}
            />
            {feature.hotspots?.map((hotspot: Hotspot, index: number) => (
              <HotspotComponent key={index} hotspot={hotspot} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProgressBar: React.FC<{ duration: number }> = ({ duration }) => (
  <div className="w-full h-1" style={{ backgroundColor: theme.divider }}>
    <div
      className="h-full bg-blue-400"
      style={{
        animation: `progress ${duration}ms linear forwards`,
      }}
    />
  </div>
);

export default function Splash() {
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  const [isFinalCtaVisible, setIsFinalCtaVisible] = useState(false);
  const slideDuration = 3000; // 7 seconds
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Mark splash as seen and user as returning
    markSplashAsSeen();
    markAsReturningUser();

    // Navigate to login page
    navigate(ROUTES.LOGIN);
  };

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

  // Auto-advance timer
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentFeatureIndex < features.length - 1) {
        goToNext();
      } else {
        // On the last slide, timer completion triggers the final CTA
        setIsFinalCtaVisible(true);
      }
    }, slideDuration);

    return () => clearTimeout(timer);
  }, [currentFeatureIndex]);



  return (
    <div
      style={{ backgroundColor: theme.background }}
      className="h-screen w-screen overflow-hidden flex flex-col justify-between items-center relative font-sans antialiased"
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
                @keyframes glow {
                    0%, 100% { box-shadow: 0 0 20px rgba(96, 165, 250, 0.4), 0 0 30px rgba(96, 165, 250, 0.3); }
                    50% { box-shadow: 0 0 30px rgba(96, 165, 250, 0.6), 0 0 45px rgba(96, 165, 250, 0.5); }
                }
                .animate-glow {
                    animation: glow 2.5s infinite ease-in-out;
                }
            `}</style>
      <div className="aurora-background"></div><header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
        <div
          className={`flex items-center gap-2 overflow-hidden transition-all duration-300 lg:w-auto`}
        >
          <img src={AiPadhaiLogo} alt="Logo" width={30} height={30} />
          <h1
            className={`text-xl font-semibold whitespace-nowrap overflow-hidden transition-all duration-300 lg:w-auto`}
          >
            AI Padhai
          </h1>
        </div>
        {!isFinalCtaVisible && (
          <button
            onClick={handleGetStarted}
            className="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer "
          >
            Skip Intro
          </button>)}
      </header>
      {/* Slide Content */}
      <div className="w-full h-full flex-grow relative z-10">
        {features.map((feature, index) => {
          if (feature.type === "welcome") {
            return <WelcomeSlide key={index} isActive={index === currentFeatureIndex} {...feature} />;
          }
          return <FeatureSlide key={index} feature={feature} isActive={index === currentFeatureIndex} />;
        })}
      </div>

      {/* Footer Navigation */}
      <div className={`absolute bottom-0 w-full p-8 flex flex-col items-center z-20 transition-opacity duration-300 ${isFinalCtaVisible ? 'opacity-0' : 'opacity-100'}`}>
        <div className="flex justify-center gap-3 mb-6">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentFeatureIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${currentFeatureIndex === index ? "bg-blue-400 scale-150" : "bg-gray-600 hover:bg-gray-500"}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <div className="w-full max-w-xs">
          <ProgressBar key={currentFeatureIndex} duration={slideDuration} />
        </div>
      </div>

      {/* Side Navigation Buttons */}
      {currentFeatureIndex > 0 && !isFinalCtaVisible && (
        <button onClick={goToPrev} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors z-20" aria-label="Previous slide">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      {currentFeatureIndex < features.length - 1 && !isFinalCtaVisible && (
        <button onClick={goToNext} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors z-20" aria-label="Next slide">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Final CTA Overlay */}
      <div className={`absolute inset-0 w-full h-full flex flex-col justify-center items-center text-center p-8 z-40 bg-gray-900/70 backdrop-blur-sm transition-opacity duration-700 ease-in-out ${isFinalCtaVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`transition-all duration-700 ease-in-out ${isFinalCtaVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
          <button
            onClick={handleGetStarted}
            className="px-12 py-4 text-3xl font-semibold rounded-full text-white bg-blue-600 hover:bg-blue-500 transform hover:scale-105 transition-all duration-300 ease-in-out animate-glow cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
