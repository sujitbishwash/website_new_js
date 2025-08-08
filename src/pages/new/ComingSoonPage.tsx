import React, { useEffect, useState } from "react";
import { useThemeColors } from "../../contexts/ThemeContext";

// --- Helper Components ---

// A simple, reusable component for the animated background dots
const BackgroundDots: React.FC = () => {
  const theme = useThemeColors();

  return (
    <div
      className="absolute top-0 left-0 w-full h-full overflow-hidden z-0"
      style={{ backgroundColor: theme.background }}
    >
      <div
        className="absolute w-full h-full"
        style={{
          background: `radial-gradient(${theme.input} 1px, transparent 1px)`,
          backgroundSize: "16px 16px",
          maskImage:
            "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(0,0,0,1) 70%, transparent 100%)",
        }}
      ></div>
    </div>
  );
};

// Component for each unit of the countdown timer (Days, Hours, etc.)
interface TimeCardProps {
  value: number;
  label: string;
}

const TimeCard: React.FC<TimeCardProps> = ({ value, label }) => {
  const theme = useThemeColors();

  return (
    <div className="flex flex-col items-center">
      <div
        className="text-4xl md:text-6xl lg:text-7xl font-bold"
        style={{ color: theme.primaryText }}
      >
        {String(value).padStart(2, "0")}
      </div>
      <div
        className="text-sm md:text-base"
        style={{ color: theme.secondaryText }}
      >
        {label}
      </div>
    </div>
  );
};

// --- Main Coming Soon Component ---

interface ComingSoonProps {
  // You can pass a target date as a prop for reusability
  targetDate: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ targetDate }) => {
  const theme = useThemeColors();

  // Function to calculate time remaining
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft: {
      days: number;
      hours: number;
      minutes: number;
      seconds: number;
    } = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [email, setEmail] = useState("");

  // Effect to update the countdown every second
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Clear interval on component unmount
    return () => clearTimeout(timer);
  });

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically handle the email submission, e.g., send to an API
    console.log("Email submitted:", email);
    alert(`Thank you! We'll notify ${email} at launch.`);
    setEmail("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden">
      <BackgroundDots />
      <div
        className="relative z-10 w-full max-w-4xl mx-auto p-6 md:p-10 rounded-2xl shadow-2xl text-center"
        style={{ backgroundColor: theme.card }}
      >
        {/* Header Section */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-2 tracking-tight"
          style={{ color: theme.accent }}
        >
          Something Big is Coming
        </h1>
        <p
          className="text-lg md:text-xl mb-8"
          style={{ color: theme.secondaryText }}
        >
          We're preparing to launch a new experience. Get ready!
        </p>

        {/* Countdown Timer Section */}
        <div className="flex justify-center items-center space-x-4 md:space-x-8 my-8 md:my-12">
          <TimeCard value={timeLeft.days || 0} label="Days" />
          <div
            className="text-4xl md:text-6xl"
            style={{ color: theme.divider }}
          >
            :
          </div>
          <TimeCard value={timeLeft.hours || 0} label="Hours" />
          <div
            className="text-4xl md:text-6xl"
            style={{ color: theme.divider }}
          >
            :
          </div>
          <TimeCard value={timeLeft.minutes || 0} label="Minutes" />
          <div
            className="text-4xl md:text-6xl hidden sm:block"
            style={{ color: theme.divider }}
          >
            :
          </div>
          <div className="hidden sm:block">
            <TimeCard value={timeLeft.seconds || 0} label="Seconds" />
          </div>
        </div>

        {/* Subscription Form Section */}
        <div className="mt-8">
          <p className="mb-4 text-base" style={{ color: theme.primaryText }}>
            Be the first to know when we go live.
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row justify-center max-w-md mx-auto gap-3"
          >
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              required
              className="flex-grow px-4 py-3 rounded-md text-white border-0 outline-none focus:ring-2 focus:ring-blue-400 transition-shadow duration-300"
              style={{ backgroundColor: theme.input }}
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-md text-white font-semibold transition-transform duration-300 ease-in-out transform hover:scale-105"
              style={{
                backgroundImage: `linear-gradient(to right, ${theme.gradientFrom}, ${theme.gradientTo})`,
              }}
            >
              Notify Me
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- App Component to Render the Page ---

// Default export: The App component that renders our Coming Soon page.
export default function ComingSoonPage() {
  // Set a target date 30 days from now for the countdown
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 30);

  return (
    <div>
      <ComingSoon targetDate={futureDate.toISOString()} />
    </div>
  );
}
