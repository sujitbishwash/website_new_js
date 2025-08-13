import { useUser } from "@/contexts/UserContext";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// --- TYPE DEFINITIONS (TypeScript) ---
interface Theme {
  background: string;
  cardBackground: string;
  inputBackground: string;
  primaryText: string;
  secondaryText: string;
  mutedText: string;
  accent: string;
  buttonGradientFrom: string;
  buttonGradientTo: string;
  divider: string;
}

interface QRCodeProps {
  imageUrl: string;
  altText: string;
}

interface PaymentDetailsProps {
  amount: number;
  currency: string;
  recipient: string;
}

interface HeaderProps {
  title: string;
}

interface FooterProps {
  text: string;
}

// --- THEME COLORS ---
// Centralized theme colors for easy customization
const theme: Theme = {
  background: "#111827",
  cardBackground: "#1F2937",
  inputBackground: "#374151",
  primaryText: "#FFFFFF",
  secondaryText: "#9CA3AF",
  mutedText: "#6B7280",
  accent: "#60A5FA",
  buttonGradientFrom: "#3B82F6",
  buttonGradientTo: "#2563EB",
  divider: "#4B5563",
};

// --- CHILD COMPONENTS ---

/**
 * Header Component
 * Displays the title of the page.
 */
const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="w-full p-4 text-center">
      <h1 className="text-2xl font-bold" style={{ color: theme.primaryText }}>
        {title}
      </h1>
    </header>
  );
};

/**
 * QR Code Display Component
 * Renders the QR code image.
 */
const QRCode: React.FC<QRCodeProps> = ({ imageUrl, altText }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-inner">
      <img
        src={imageUrl}
        alt={altText}
        className="w-full h-full object-contain"
        // Fallback placeholder image in case the primary QR code fails to load
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null; // Prevent infinite loop if placeholder also fails
          target.src = `https://placehold.co/400x400/ffffff/000000?text=QR+Code`;
        }}
      />
    </div>
  );
};

/**
 * Payment Details Component
 * Displays the payment amount, recipient, and instructions.
 */
const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  amount,
  currency,
  recipient,
}) => {
  return (
    <div className="flex flex-col items-center text-center w-full">
      <p className="text-lg" style={{ color: theme.secondaryText }}>
        Scan this code to pay
      </p>
      <div className="my-4">
        <span
          className="text-5xl font-bold"
          style={{ color: theme.primaryText }}
        >
          {amount.toFixed(2)}
        </span>
        <span className="text-xl ml-2" style={{ color: theme.secondaryText }}>
          {currency}
        </span>
      </div>
      <p className="text-md" style={{ color: theme.mutedText }}>
        to{" "}
        <span className="font-semibold" style={{ color: theme.secondaryText }}>
          {recipient}
        </span>
      </p>
      <div
        className="w-1/4 my-6 h-px"
        style={{ backgroundColor: theme.divider }}
      />
      <p className="text-sm" style={{ color: theme.secondaryText }}>
        Open your payment app and scan the QR code to complete the transaction.
      </p>
    </div>
  );
};

/**
 * Footer Component
 * Displays a closing message or information.
 */
const Footer: React.FC<FooterProps> = ({ text }) => {
  return (
    <footer className="w-full p-4 text-center">
      <p className="text-sm" style={{ color: theme.mutedText }}>
        {text}
      </p>
    </footer>
  );
};

// --- MAIN APP COMPONENT ---

/**
 * The main application component that assembles the payment page.
 */
const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useUser();
  const amount = (location.state as { amount?: number })?.amount || 999;
  // --- STATE MANAGEMENT ---
  // The QR code URL can be changed here to update the image dynamically.
  // Using a placeholder from placehold.co for demonstration.
  // Replace this with your actual QR code image URL.
  const qrCodeUrl =
    "https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=upi://pay?pa=example@upi&pn=Example%20Name&am=150.00&cu=INR";

  const paymentInfo = {
    amount: amount,
    currency: "INR",
    recipient: profile?.name || "User",
  };

  useEffect(() => {
    setTimeout(() => {
      navigate("/payment-success", {
        state: {
          amount: paymentInfo.amount,
          planType: paymentInfo.amount >= 2000 ? "Annual" : "Monthly",
          recipient: paymentInfo.recipient,
        },
      });
    }, 5000);
  }, [navigate, amount, profile?.name]);

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-6 md:p-8"
      style={{
        backgroundColor: theme.background,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Header title="Complete Your Payment" />

      <main className="w-full flex justify-center">
        {/* Payment Card */}
        <div
          className="w-full max-w-sm rounded-2xl shadow-2xl flex flex-col items-center p-6 sm:p-8 space-y-6"
          style={{ backgroundColor: theme.cardBackground }}
        >
          <QRCode
            imageUrl={qrCodeUrl}
            altText={`QR Code for paying ${paymentInfo.recipient}`}
          />
          <PaymentDetails
            amount={paymentInfo.amount}
            currency={paymentInfo.currency}
            recipient={paymentInfo.recipient}
          />
        </div>
      </main>

      <Footer text="Powered by Gemini Payments" />
    </div>
  );
};

export default PaymentPage;
