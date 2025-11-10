import { FinalCTA } from "@/components/landing/FinalCTA";
import { Image } from "lucide-react";
import React from "react";

import f1 from "@/assets/images/thumbnails/f1.png";
import f2 from "@/assets/images/thumbnails/f2.png";
import f3 from "@/assets/images/thumbnails/f3.png";
import f4 from "@/assets/images/thumbnails/f4.png";
import f5 from "@/assets/images/thumbnails/f5.png";
import f6 from "@/assets/images/thumbnails/f6.png";
import f7 from "@/assets/images/thumbnails/f7.png";
import f8 from "@/assets/images/thumbnails/f8.png";
import f9 from "@/assets/images/thumbnails/f9.png";

import finalctabg from "@/assets/images/doodles/final_cta_bg.png";
// --- TYPE DEFINITIONS ---

interface FeatureCardProps {
  title: string;
  description: string;
  img?: string;
}

// --- REUSABLE COMPONENTS ---

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  img,
}) => (
  <div className="group overflow-hidden space-y-10  rounded-xl">
    <div className="aspect-video bg-white/5 flex items-center justify-center rounded-xl overflow-hidden">
      {img ? (
        <img src={img} alt={title} className="w-full h-full object-cover object-top rounded-xl transition-transform duration-300 group-hover:scale-115" />
      ) : (
        <Image className="text-gray-400 text-sm w-8 h-8 group-hover:scale-115" />
      )}
    </div>
    <div className="text-left">
  <span className="font-semibold text-white text-2xl">{title}</span>
  <span className="text-white/50 text-xl">&nbsp;{description}</span>
</div>

  </div>
);

// --- PAGE SECTIONS ---

const FeaturesHero: React.FC = () => (
  <section className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white py-18 md:py-24">
    <img
      src={finalctabg}
      alt=""
      aria-hidden="true"
      className="opacity-10 absolute bottom-70 left-1/2 -translate-x-1/2 w-full object-cover z-0"
    />
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-5xl md:text-6xl font-bold mb-8">
        The {" "}
          <span
            className="font-[700] italic"
            style={{ fontFamily: '"Instrument Serif", serif' }}
          >
            <span className="text-5xl md:text-6xl">
              Unfair Advantage
            </span>
          </span>{" "} for Preparation
      </h1>
      <p className="mt-6 text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
        Everything you need to ace your government exams.
      </p>
    </div>
  </section>
);

const FeatureShowcase: React.FC = () => {
  const foundationFeatures = [
    {
      title: "Video Lectures",
      description:
        "Clear, concise videos that break down even the most complex subjects.",
      img: f1,
    },
    {
      title: "Study Materials",
      description:
        "Go deeper with focused notes, question banks, and exam blueprints.",
        img: f2,
    },
    {
      title: "Current Affairs",
      description:
        "Stay ahead with daily news analysis and monthly GK compilations.",
        img: f3,
    },
  ];

  const aiFeatures = [
    {
      title: "Question Agent",
      description:
        "Get tailored practice questions that adapt to your specific skill level.",
        img: f4,
    },
    {
      title: "Suggestion Agent",
      description:
        "Receive smart recommendations for videos and topics based on your progress.",
      img: f5,
    },
    {
      title: "Explainer Agent",
      description:
        "Instantly get simple, clear explanations on any concept you're stuck on.",
        img: f6,
    },
  ];

  const performanceFeatures = [
    {
      title: "Mock Tests",
      description:
        "Experience full-length simulated exams to master timing and pressure.",
        img: f7,
    },
    {
      title: "Reports Agent",
      description:
        "Track your scores and get detailed insights to understand your progress clearly.",
        img: f8,
    },
    {
      title: "Book Agent",
      description:
        "Quickly absorb key takeaways from popular books on strategy and performance.",
      img: f9,
    },
  ];

  return (
    <div className="py-20 space-y-30">
      {/* Section 1: Core Resources */}
      <div className="container mx-auto px-6">
        <h2 className="text-4xl text-white mb-2 text-center">
          A Strong Foundation
        </h2>
        <p className="text-white/50 text-lg mb-14 text-center max-w-2xl mx-auto">
          Huge source for reliable, syllabus-aligned study materials.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-24">
          {foundationFeatures.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>

      {/* Section 2: AI Agents */}
      <div className="container mx-auto px-6">
        <h2 className="text-4xl text-white mb-2 text-center">
          Smarter Studying
        </h2>
        <p className="text-white/50 text-lg mb-14 text-center max-w-2xl mx-auto">
          Our AI analyzes your performance to guide your focus.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-24">
          {aiFeatures.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>

      {/* Section 3: Performance */}
      <div className="container mx-auto px-6">
        <h2 className="text-4xl text-white mb-2 text-center">
          Ready for Exam Day
        </h2>
        <p className="text-white/50 text-lg mb-14 text-center max-w-2xl mx-auto">
          Simulate real exam conditions to build confidence.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-24">
          {performanceFeatures.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

const Features: React.FC = () => {
  return (
    <div className="bg-black min-h-screen font-sans antialiased text-white">
      <main>
        <FeaturesHero />
        <FeatureShowcase />
        <FinalCTA />
      </main>
    </div>
  );
};

export default Features;
