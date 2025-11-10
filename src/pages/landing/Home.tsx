import fromanycard1 from "@/assets/videos/fromanycard1.mp4";
import fromanycard2 from "@/assets/videos/fromanycard2.mp4";
import fromanycard3 from "@/assets/videos/fromanycard3.mp4";
/*import fromanyvideo from "@/assets/videos/main.mp4";*/
import kf1 from "@/assets/images/thumbnails/kf1.png";
import kf2 from "@/assets/images/thumbnails/kf2.png";
import kf3 from "@/assets/images/thumbnails/kf3.png";
import iitbomabaylogo from "@/assets/images/institutes/Indian_Institute_of_Technology_Bombay_Logo.svg";
import dulogo from "@/assets/images/institutes/University_of_Delhi.png";
import jnulogo from "@/assets/images/institutes/Jawaharlal_Nehru_University_Logo_vectorized.svg";
import iimahemdabadlogo from "@/assets/images/institutes/IIM,_Ahmedabad_Logo.svg";
import iitmadras from "@/assets/images/institutes/IIT_Madras_Logo.svg";
import sbilogo from "@/assets/images/exams/SBI-logo.svg";
import rrblogo from "@/assets/images/exams/Indian_Railways_official.png";
import ssclogo from "@/assets/images//exams/Staff_Selection_Commission_Logo.png";
import ibpslogo from "@/assets/images/exams/959b922fedb8601b8631195cd520fb68.png";
import rbilogo from "@/assets/images/exams/rbi-logo-png_seeklogo-1685622.png";
import { Briefcase, Plus, Target, Trophy } from "lucide-react";
import { Icon } from "@/components/landing/Icon";
import { ICONS } from "@/components/landing/icons";
import { useEffect, useRef, useState } from "react";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes/constants";

const BankLogosBackground = () => {
  const logos = [
    {
      icon: ibpslogo,
      classes: "top-[10%] left-[5%] w-16 h-16 -rotate-[15deg]",
    },
    {
      icon: rrblogo,
      classes: "top-[18%] right-[7%] w-24 h-24 rotate-[20deg]",
    },
    { icon: ssclogo, classes: "top-[50%] left-[10%] w-20 h-20 rotate-[5deg]" },
    {
      icon: sbilogo,
      classes: "top-[70%] right-[10%] w-16 h-16 -rotate-[10deg]",
    },
    {
      icon: rbilogo,
      classes: "top-[45%] right-[5%] w-16 h-16 -rotate-[10deg]",
    },
  ];

  return (
    <div className="absolute inset-0 z-0" aria-hidden="true">
      {logos.map((logo, index) => (
        <img
          key={index}
          src={logo.icon}
          className={`p-4 bg-white/10 rounded-2xl absolute text-black/5 dark:text-white/5 ${logo.classes}`}
        />
      ))}
    </div>
  );
};

// Hero Section Component
const Hero = () => {
  return (
    <section className="relative">
      <BankLogosBackground />
      <div className="pointer-events-none absolute inset-x-0 top-[-22rem] -z-10 h-[180vh] w-full bg-background"></div>
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-24 sm:py-10 ">
        <span className="pb-4 text-6xl font-semibold leading-none sm:text-7xl md:text-7xl relative z-10 flex flex-col text-white">
          Prepare for{" "}
          <span className="font-serif text-6xl sm:text-7xl md:text-7xl italic leading-tight font-normal">
            <span className="inline-block transform-none blur-0 opacity-100">
              government exams
            </span>
          </span>
          smarter, not harder with
        </span>
        <h2 className="pb-4 text-6xl font-semibold leading-none sm:text-7xl md:text-8xl relative z-10 flex flex-col bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 bg-clip-text font-forma text-transparent filter-[url(#inset-shadow)]">
          YouTube and AI.
        </h2>
        <p className="mt-6 text-xl font-semibold text-zinc-500">
          Comprehensive preparation resources for Banking, Railways, SSC and
          more
        </p>
        <div className="mt-10 flex justify-center">
          <Link
            to={ROUTES.LOGIN}
            className="hover:cursor-pointer flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-blue-400/50 via-blue-500/30 to-indigo-600/20 py-3 px-8 font-semibold text-white shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out transform hover:scale-102 border border-blue-400/50 hover:border-blue-400/80 dark:text-white sm:w-auto"
          >
            Start Learning for Free
            <Icon path={ICONS.arrowRight} className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

// Learn From Video Section
const LearnFromVideo = () => {
  type Institute = {
    name: string;
    logoUrl: string;
  };

  const institutes: Institute[] = [
    {
      name: "IIT Bombay",
      logoUrl: iitbomabaylogo,
    },
    {
      name: "Delhi University",
      logoUrl: dulogo,
    },
    {
      name: "JNU",
      logoUrl: jnulogo,
    },
    {
      name: "IIT Madras",
      logoUrl: iitmadras,
    },
    {
      name: "IIM Ahmedabad",
      logoUrl: iimahemdabadlogo,
    },
  ];

  type Feature = {
    title: string;
    description: string;
    src: string;
  };
  const features: Feature[] = [
    {
      title: "Understand Concepts",
      description:
        "Get simplified topic-focused explanations for better clarity.",
      src: "https://www.youtube.com/embed/JTJG-OlSey8",
    },
    {
      title: "Ask Unlimited Questions",
      description:
        "Interact with our AI chatbot to resolve your doubts anytime.",
      src: "https://www.youtube.com/embed/0nbhxYim_O8",
    },
    {
      title: "Be Personalised",
      description:
        "Receive questions and suggestions tailored to your progress and learning.",
      src: "https://www.youtube.com/embed/NMo6tAV2-sk",
    },
  ];

  const videoRef = useRef<HTMLDivElement>(null);
  const [rotationX, setRotationX] = useState<number>(30);

  useEffect(() => {
    const handleScroll = () => {
      if (videoRef.current) {
        const { top, height } = videoRef.current.getBoundingClientRect();
        const initialRotation = 11;

        // Define the scroll range for the animation
        // Start animating when the top of the video is 90% down the viewport
        const startAnimatePoint = window.innerHeight * 0.9;
        // The animation will complete over a scroll distance of 75% of the video's height
        const animationDistance = height * 0.75;
        const endAnimatePoint = startAnimatePoint - animationDistance;

        // Calculate the animation's progress.
        // Progress is 1 (fully tilted) when top >= startAnimatePoint.
        // Progress is 0 (fully flat) when top <= endAnimatePoint.
        const progress =
          (top - endAnimatePoint) / (startAnimatePoint - endAnimatePoint);

        // Clamp progress between 0 and 1 to handle scrolling outside the animation zone
        const clampedProgress = Math.max(0, Math.min(1, progress));

        const currentRotation = clampedProgress * initialRotation;

        setRotationX(currentRotation);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run on initial mount to set the correct rotation
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="py-20 px-4 sm:px-8">
      <div className="container mx-auto text-center">
        <h3 className="text-4xl font-semibold mb-10 text-white">
          Your favorite teachers, your learning journey -
          <span className="relative z-10 bg-gradient-to-r from-blue-700 via-blue-500 to-blue-300 bg-clip-text font-forma text-transparent filter-[url(#inset-shadow)]">
            {" "}
            enhanced by AI.
          </span>
        </h3>
        <div
          ref={videoRef}
          className="bg-black rounded-xl overflow-hidden aspect-video max-w-5xl mx-auto shadow-2xl shadow-blue-600/10 dark:shadow-blue-500/10 origin-top"
          style={{
            transform: `perspective(800px) rotateX(${rotationX}deg)`,
          }}
        >
          <iframe
            className="object-cover object-center w-full h-full"
            src="https://www.youtube.com/embed/gWqeg1OvO7c?autoplay=1&mute=1&modestbranding=1&playsinline=1&rel=0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            frameBorder={0}
          ></iframe>
        </div>
        <p className="md:mt-8 text-gray-400 max-w-2xl mx-auto text-2xl pt-10 md:pt-20 pb-20">
          It just works. See it in action.
          <div>
            Simply Paste the YouTube links — and watch the magic unfold!
          </div>
        </p>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
          {features.map((feature, index) => (
            <div key={index} className="p-4">
              <h4 className="text-2xl font-semibold mb-2 text-white">
                {feature.title}
              </h4>
              <p className="text-lg text-zinc-400">{feature.description}</p>
              <iframe
                className="aspect-[16/10] mt-6 bg-zinc-800 rounded-2xl flex items-center justify-center"
                src={feature.src+"?autoplay=1&mute=1&controls=0&modestbranding=1&playsinline=1&rel=0"}
                allow="autoplay; encrypted-media"
                allowFullScreen
                frameBorder={0}
              >
                Image
              </iframe>
            </div>
          ))}
        </div>

        <div className="mt-24">
          <p className="text-sm text-gray-500 uppercase tracking-widest">
            Loved by students at
          </p>
          <div className="mt-6 flex flex-wrap justify-center items-center gap-x-16 gap-y-6 text-zinc-400">
            {institutes.map((institute) => (
              <img
                key={institute.name}
                src={institute.logoUrl}
                alt={institute.name}
                className="h-20"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Features Section
const Features = () => {
  const featuresData = [
    {
      category: "STUDY TOOLKIT",
      title: "AI Padhai helps you like a true friend",
      description:
        " it does everything a good friend would do. It gives you questions to practice, creates personalized notes, suggests the best videos and books, and keeps you on track with your preparation.",
      src: kf1,
      icon: <Briefcase className="text-zinc-400" />,
    },
    {
      category: "FOCUSED PREPARATION",
      title: "Detailed Analysis",
      description:
        "It provides a detailed analysis of where you make mistakes while solving problems. It also highlights your strengths and weaknesses based on the number of questions you’ve attempted and the study materials you’ve interacted with on our platform.",
      src: kf2,
      icon: <Target className="text-zinc-400" />,
    },

    {
      category: "WINNING STRATEGY",
      title: "Do more with less hard work",
      description:
        "By planning your studies strategically, you focus on what truly matters instead of wasting time on random topics. Regular feedback then helps you track progress, correct mistakes, and move toward your goals more efficiently",
      src: kf3,
      icon: <Trophy className="text-zinc-400" />,
    },
  ];

  return (
    <section className="py-20">
      <div className="">
        {featuresData.map((feature, index) => (
          <div key={index} className={`${index == 1 ? "bg-gray-900" : ""}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center p-6 sm:p-20">
              <div
                className={`text-left max-w-lg ${
                  index % 2 === 1 ? "md:order-last" : ""
                }`}
              >
                {/*<div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center">
                  {feature.icon}
                </div>
                <p className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
                  {feature.category}
                </p>
              </div>*/}
                <h3 className="text-4xl md:text-6xl mb-10 text-white">
                  {feature.title}
                </h3>
                <p className="text-lg text-gray-400">{feature.description}</p>
              </div>
              <div className="aspect-video w-full relative overflow-hidden rounded-3xl bg-zinc-800">
                <img
                  src={feature.src}
                  className="absolute inset-0 h-full w-full object-cover object-top object-left"
                  alt=""
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Dialogue Section
const Dialogue = () => {
  return (
    <section className="relative py-20 px-4 sm:px-8">
      <div
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        aria-hidden="true"
      >
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#67e8f9] to-[#3b82f6] opacity-20 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="relative container mx-auto max-w-3xl text-center">
        <span className="block text-blue-400 text-2xl px-4">
          Accurate feedback is more crucial than you think
        </span>
        <h2 className="mt-10 text-transparent dark:text-white max-w-3xl pb-4 text-6xl font-semibold leading-none sm:text-7xl relative z-10 flex flex-col bg-[linear-gradient(183deg,rgba(20,20,30,0)_13.9%,rgba(30,30,50,0.3)_121.71%),linear-gradient(0deg,#EAEAEB,#EAEAEB)] bg-clip-text font-forma filter-[url(#inset-shadow)]">
          AI Padhai points out where you need improvement.
        </h2>
      </div>
    </section>
  );
};
// FAQ Section
const FAQ = () => {
  const faqs = [
    {
      question: "What exactly is AI Padhai?",
      answer:
        "AI Padhai is your AI study companion, designed to make exam preparation clear and personalized. It connects everything you already use — YouTube videos, notes, books, and mock tests — and turns it into one simple, guided learning journey. It helps you focus on what truly matters instead of feeling lost in too much content.",
    },
    {
      question: "How is this different from other EdTech apps I've tried?",
      answer:
        "Most apps just throw more content at you. We don’t. Our AI studies how you study — what you watch, where you struggle, and how you improve — then builds a preparation plan made just for you. Think of it as having a smart coach who keeps everything organized and connected in one place",
    },
    {
      question: "Which exams can I prepare for here?",
      answer:
        "You can currently prepare for SSC, Banking, Railways, and Class 10 Board exams. We’re already expanding into UPSC, CAT, and other competitive exams — so no matter your goal, AI Padhai will grow with you.",
    },
    {
      question: "How does the AI know what's right for me?",
      answer:
        "The AI learns from your daily habits — what you study, how much time you spend, and where you score high or low — then creates a personalized roadmap that adapts automatically. It’s like having a mentor who constantly learns about you and helps you stay on track.",
    },
    {
      question: "Can I use my own notes or YouTube videos?",
      answer:
        "Of course! You can upload your own notes or paste YouTube links directly. Our AI will summarize them, highlight key takeaways, and even create practice questions — turning your effort into real understanding.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4 sm:px-8">
      <div className="container mx-auto max-w-3xl text-left">
        <h3 className="text-3xl md:text-4xl font-semibold mb-8 text-gray-500">
          Frequently Asked Questions
        </h3>
        <div className="text-left space-y-4">
          {faqs.map((faq, index) => (
            <div
              onClick={() => toggleFAQ(index)}
              key={index}
              className="hover:cursor-pointer border-b border-zinc-800 pb-4"
            >
              <div className="w-full flex justify-between items-center text-lg font-semibold text-white py-2 text-left">
                <span>{faq.question}</span>
                <Plus
                  className={`w-6 h-6 transform transition-transform duration-300 flex-shrink-0 ${
                    openIndex === index ? "rotate-45" : ""
                  }`}
                />
              </div>

              <div
                className={`transition-all duration-300 overflow-hidden ${
                  openIndex === index
                    ? "max-h-40 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="mt-2 text-zinc-400 pr-8">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Main App Component
export default function Home() {
  // 🌟 NEW: Autoplay all videos on scroll
  useEffect(() => {
    const videos = document.querySelectorAll<HTMLVideoElement>("video");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            // must be muted + playsInline for mobile autoplay
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 } // play when at least 50% visible
    );

    videos.forEach((v) => {
      v.muted = true; // ✅ ensure muted
      v.playsInline = true; // ✅ iOS Safari requirement
      v.controls = true; // ✅ show controls
      observer.observe(v);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-black min-h-screen font-sans antialiased text-white transition-colors duration-300 relative text-center overflow-x-clip">
      {/* SVG filter definition for the inset shadow effect on text in the Hero section */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="inset-shadow">
            <feOffset dx="0" dy="1" />
            <feGaussianBlur stdDeviation="1" result="offset-blur" />
            <feComposite
              operator="out"
              in="SourceGraphic"
              in2="offset-blur"
              result="inverse"
            />
            <feFlood floodColor="black" floodOpacity="0.5" result="color" />
            <feComposite
              operator="in"
              in="color"
              in2="inverse"
              result="shadow"
            />
            <feComposite operator="over" in="shadow" in2="SourceGraphic" />
          </filter>
        </defs>
      </svg>
      <div
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        aria-hidden="true"
      >
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#67e8f9] to-[#3b82f6] opacity-20 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <main>
        <Hero />
        <LearnFromVideo />
        <Features />
        {/* I've removed the extra sections from the original file for brevity to focus on the core components */}
        {/* You can add AiAgents, ExamCategories, StudyStrategies, and Newsletter here if needed */}
        <Dialogue />
        <FAQ />
        <FinalCTA />
      </main>
    </div>
  );
}

/*<button className="text-sm text-zinc-400 hover:underline">
            └ Ai Padhai SVG
          </button>*/
