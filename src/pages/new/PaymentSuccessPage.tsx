import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { ROUTES } from "../../routes/constants";

// Centralized theme colors for easy customization
const theme = {
  background: "#111827",
  cardBackground: "#1F2937",
  inputBackground: "#374151",
  primaryText: "#FFFFFF",
  secondaryText: "#9CA3AF",
  mutedText: "#6B7280",
  accent: "#60A5FA",
  accentLight: "#93C5FD",
  buttonGradientFrom: "#3B82F6",
  buttonGradientTo: "#2563EB",
  divider: "#4B5563",
  success: "#4ADE80",
};

// --- SVG Icon Components ---

const CheckmarkIcon: React.FC = () => (
  <svg
    className="w-16 h-16 mx-auto mb-4"
    style={{ color: theme.success }}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const BenefitIcon: React.FC<{ path: string }> = ({ path }) => (
  <div
    className="p-2 rounded-full"
    style={{ backgroundColor: theme.inputBackground, color: theme.accentLight }}
  >
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={path}
      />
    </svg>
  </div>
);

// --- Reusable UI Components ---

const Header: React.FC = () => (
  <header className="py-6 px-4 sm:px-6 lg:px-8">
    <h1
      className="text-3xl sm:text-4xl font-bold text-center tracking-wider"
      style={{ color: theme.primaryText }}
    >
      AI Padhai
    </h1>
  </header>
);

const Footer: React.FC = () => (
  <footer className="text-center py-6 px-4 sm:px-6 lg:px-8">
    <p style={{ color: theme.mutedText }}>
      &copy; {new Date().getFullYear()} AI Padhai. All rights reserved.
    </p>
  </footer>
);

// --- Feature/Benefit Components ---

interface BenefitItemProps {
  iconPath: string;
  text: string;
}

const BenefitItem: React.FC<BenefitItemProps> = ({ iconPath, text }) => (
  <li className="flex items-center space-x-4">
    <BenefitIcon path={iconPath} />
    <span className="text-base" style={{ color: theme.secondaryText }}>
      {text}
    </span>
  </li>
);

const PremiumBenefits: React.FC = () => {
  const benefits = [
    {
      iconPath:
        "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
      text: "Unlimited Messages",
    },
    {
      iconPath:
        "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
      text: "Unlimited Videos",
    },
    {
      iconPath:
        "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      text: "Unlimited Questions",
    },
    {
      iconPath:
        "M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
      text: "Unlimited Suggestions",
    },
    {
      iconPath:
        "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      text: "Personalised Learning",
    },
  ];

  return (
    <div className="mt-8">
      <h3
        className="text-xl font-bold text-center mb-6"
        style={{ color: theme.primaryText }}
      >
        Your Premium Benefits
      </h3>
      <ul className="space-y-4">
        {benefits.map((benefit) => (
          <BenefitItem key={benefit.text} {...benefit} />
        ))}
      </ul>
    </div>
  );
};

// Main Congratulations Card Component
interface CongratulationsCardProps {
  userName: string;
  planType: string;
}

const CongratulationsCard: React.FC<CongratulationsCardProps> = ({
  userName,
  planType,
}) => {
  const navigate = useNavigate();
  return (
    <div
      className="rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-lg mx-auto text-center overflow-hidden"
      style={{
        backgroundColor: theme.cardBackground,
        boxShadow: `0 0 30px ${theme.accent}20`,
      }}
    >
      <CheckmarkIcon />
      <h2
        className="text-3xl sm:text-4xl font-extrabold mb-2"
        style={{ color: theme.primaryText }}
      >
        You're on the {planType} Plan!
      </h2>
      <p className="text-lg mb-6" style={{ color: theme.secondaryText }}>
        Congratulations, {userName}! You've unlocked the full power of AI
        Padhai.
      </p>

      <div
        className="p-4 rounded-lg my-6"
        style={{ backgroundColor: theme.inputBackground }}
      >
        <h3 className="font-semibold text-md" style={{ color: theme.accent }}>
          Important Notice
        </h3>
        <p className="mt-2 text-sm" style={{ color: theme.secondaryText }}>
          Your premium status will be reflected on your account within 2-3
          hours.
        </p>
      </div>

      <div
        className="border-t my-8"
        style={{ borderColor: theme.divider }}
      ></div>

      <PremiumBenefits />

      <button
        className="mt-10 w-full font-bold py-3 px-4 rounded-lg text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        style={{
          background: `linear-gradient(to right, ${theme.buttonGradientFrom}, ${theme.buttonGradientTo})`,
          color: theme.primaryText,
          boxShadow: `0 4px 15px ${theme.buttonGradientFrom}50`,
        }}
        onClick={() => {
          navigate(ROUTES.HOME);
        }}
      >
        Start Learning
      </button>
    </div>
  );
};

// --- Main App Component ---

const PaymentSuccessPage: React.FC = () => {
  const location = useLocation();
  const { profile } = useUser();
  const paymentData = location.state as {
    amount?: number;
    planType?: string;
    recipient?: string;
  } | null;

  // Use real user data from context, fallback to navigation state, then defaults
  const userName = profile?.name || paymentData?.recipient || "Learner";
  const [planType, setPlanType] = useState<string | null>(
    paymentData?.planType || null
  );
  const [isLoading, setIsLoading] = useState<boolean>(!paymentData?.planType);

  useEffect(() => {
    document.body.style.backgroundColor = theme.background;

    // If we don't have plan data from navigation, simulate fetching it
    if (!paymentData?.planType) {
      const fetchSubscriptionData = () => {
        setTimeout(() => {
          // In a real application, this would be an API call.
          // We'll randomly choose between Monthly and Yearly for this demo.
          const fetchedPlan = Math.random() > 0.5 ? "Yearly" : "Monthly";
          setPlanType(fetchedPlan);
          setIsLoading(false);
        }, 1500); // Simulate a 1.5-second network delay
      };

      fetchSubscriptionData();
    }

    // Cleanup function to reset body background color when component unmounts
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="min-h-screen flex flex-col justify-center font-sans">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        {isLoading || !planType ? (
          <div className="text-center">
            <p style={{ color: theme.primaryText }}>
              Loading your subscription details...
            </p>
          </div>
        ) : (
          <CongratulationsCard userName={userName} planType={planType} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccessPage;
