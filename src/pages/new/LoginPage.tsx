import { authApi } from "@/lib/api-client";
import { theme } from "@/styles/theme";
import React, { useState, useEffect, KeyboardEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ROUTES } from "../../routes/constants";
import AiPadhaiLogo from "../../assets/ai_padhai_logo.svg"; // Adjust path as needed
// --- Style Objects ---
// This approach uses 100% inline styles to avoid dependency on any CSS framework.

// --- Main App Component ---

const LoginPage: React.FC = () => {
  const { isAuthenticated, isLoading, checkUserState } = useAuth();
  const navigate = useNavigate();

  // Redirect to appropriate page if already authenticated
  React.useEffect(() => {
    const handleAuthenticatedUser = async () => {
      if (!isLoading && isAuthenticated) {
        try {
          // Use the stored user data from AuthContext
          const userState = await checkUserState();
          

          // Navigate based on user state
          if (userState.nextStep === "dashboard") {
            
            navigate(ROUTES.HOME, { replace: true });
          } else if (userState.nextStep === "exam-goal") {
            
            navigate(ROUTES.EXAM_GOAL, { replace: true });
          } else {
            
            navigate(ROUTES.PERSONAL_DETAILS, { replace: true });
          }
        } catch (error) {
          
          // Fallback to personal details page if exam goal API fails
          navigate(ROUTES.PERSONAL_DETAILS, { replace: true });
        }
      }
    };

    handleAuthenticatedUser();
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center font-sans p-4">
        <div className="bg-gray-800 text-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="text-2xl mb-4">Loading...</div>
        </div>
      </div>
    );
  }

  // Don't render login form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* We inject a style tag here for the animations */}
      <style>
        {`
          @keyframes focus-animation {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(96, 165, 250, 0.3); }
            50% { transform: scale(1.05); box-shadow: 0 0 10px 5px rgba(96, 165, 250, 0.3); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(96, 165, 250, 0.3); }
          }
          .otp-input-box:focus {
            border-color: ${theme.accent};
            outline: none;
            animation: focus-animation 1.5s infinite;
          }
        `}
      </style>
      <div className="bg-gradient-to-br from-background to-foreground min-h-screen text-foreground font-sans p-4 sm:p-4 md:p-8 flex items-center justify-center">
        <LoginCard />
      </div>
    </>
  );
};

// --- Child Components ---

interface EmailInputProps {
  email: string;
  setEmail: (email: string) => void;
  hasError?: boolean;
  onHitEnter: () => void;
}

const EmailInput: React.FC<EmailInputProps> = ({
  email,
  setEmail,
  hasError = false,
  onHitEnter,
}) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onHitEnter();
    }
  };

  const errorClasses = "border border-red-500 mb-2";
  const normalClasses = "border border-border mb-6";

  return (
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Enter your email"
      className={`bg-card text-foreground w-full py-3 px-4 rounded-lg box-border focus:outline-none focus:ring-2 focus:ring-primary ${
        hasError ? errorClasses : normalClasses
      }`}
      onKeyDown={handleKeyDown}
    />
  );
};

interface OtpInputProps {
  otp: string[];
  setOtp: (otp: string[]) => void;
  onOtpComplete: () => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ otp, setOtp, onOtpComplete }) => {
  useEffect(() => {
    if (otp.join("").length === 6) {
      onOtpComplete();
    }
  }, [otp, onOtpComplete]);
  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && element.nextSibling instanceof HTMLInputElement) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      e.currentTarget.previousSibling instanceof HTMLInputElement
    ) {
      e.currentTarget.previousSibling.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = e.clipboardData.getData("text");
    if (isNaN(Number(value)) || value.length !== 6) return;
    const newOtp = value.split("");
    setOtp(newOtp);
    // Focus the last input box after paste
    if (e.currentTarget.parentNode instanceof HTMLElement) {
      const inputs = e.currentTarget.parentNode.querySelectorAll("input");
      if (inputs.length === 6) (inputs[5] as HTMLInputElement).focus();
    }
  };

  return (
    <div className="flex justify-between gap-2 mb-4">
      {otp.map((data, index) => (
        <input
          key={index}
          className={`otp-input-box bg-background text-foreground w-full h-14 rounded-lg border text-center text-2xl font-bold transition-all ${
            data ? "border-primary" : "border-border-medium"
          }`}
          type="text"
          name="otp"
          inputMode="numeric" // shows number keypad on mobile
          pattern="[0-9]*"
          maxLength={1}
          value={data}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onFocus={(e) => e.currentTarget.select()}
          onPaste={index === 0 ? handlePaste : (e) => e.preventDefault()}
          autoFocus={index === 0} // ✅ only true for first input
        />
      ))}
    </div>
  );
};

interface ActionButtonProps {
  text: string;
  loadingText?: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  text,
  loadingText = "Loading...",
  onClick,
  disabled = false,
  loading = false,
}) => {
  const baseClasses =
    "w-full font-bold py-3 px-4 rounded-lg border-none transition-all";

  const getButtonClasses = () => {
    if (loading) {
      return `${baseClasses} bg-gray-600 text-foreground cursor-not-allowed opacity-80`;
    }
    if (disabled) {
      return `${baseClasses} bg-gray-600 text-foreground cursor-not-allowed opacity-60`;
    }
    return `${baseClasses} bg-primary hover:bg-primary/80 text-white cursor-pointer`;
  };

  return (
    <button
      onClick={onClick}
      className={getButtonClasses()}
      disabled={disabled || loading}
    >
      {loading ? loadingText : text}
    </button>
  );
};

const LoginCard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // New state to control the visibility of the email login form
  const [showEmailLogin, setShowEmailLogin] = useState(false);

  // Get the return URL from location state, or default to dashboard
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    ROUTES.HOME;

  const validateEmail = (email: string): boolean => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const isEmailValid = validateEmail(email);
  const isOtpComplete = otp.join("").length === 6;

  const handleSendOtp = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");
    if (!isEmailValid) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }
    try {
      

      // Call the API to send OTP
      const response = await authApi.sendOtp(email);

      

      setSuccess(response.data.message || "OTP sent successfully!");
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (isLoading) return; // Prevent multiple submissions
    setIsLoading(true);
    setError("");
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      setIsLoading(false);
      return;
    }
    try {
      

      // Call the API to verify OTP
      const response = await authApi.verifyOtp(email, finalOtp);

      

      // Store the token in localStorage and update auth context
      localStorage.setItem("authToken", response.data.access_token);

      // Update the auth context to mark user as authenticated
      await login(response.data.access_token, { email });

      setSuccess("Login successful! Redirecting...");

      // Use the stored user data from AuthContext to determine where to navigate
      try {
        const { checkUserState } = useAuth();
        const userState = await checkUserState();
        

        // Navigate based on user state
        if (userState.nextStep === "dashboard") {
          
          navigate(from, { replace: true });
        } else if (userState.nextStep === "exam-goal") {
          
          navigate(ROUTES.EXAM_GOAL, { replace: true });
        } else {
          
          navigate(ROUTES.PERSONAL_DETAILS, { replace: true });
        }
      } catch (error) {
        
        // Fallback to personal details page if API fails
        navigate(ROUTES.PERSONAL_DETAILS, { replace: true });
      }
    } catch (err: any) {
      setError(err.message || "Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeEmail = () => {
    setOtpSent(false);
    setOtp(new Array(6).fill(""));
    setError("");
    setSuccess("");
  };

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
    setError("");
    setSuccess("");
  };

  return (
    <div className="bg-background text-foreground rounded-[1.25rem] shadow-lg p-4 sm:p-10 max-w-[26rem] w-full border border-border box-border">
      <Header />
      <div className="mt-8">
        <GoogleSignInButton />
        <OrDivider />

        {!otpSent ? (
          // Stage 1: Choose login method or enter email
          showEmailLogin ? (
            <>
              <EmailInput
                email={email}
                setEmail={handleEmailChange}
                hasError={Boolean(error)}
                onHitEnter={handleSendOtp}
              />
              {error && (
                <div className="text-[#d93025] text-sm mt-2 mb-2 text-center">
                  {error}
                </div>
              )}
              <ActionButton
                text="Send OTP"
                onClick={handleSendOtp}
                disabled={!isEmailValid || isLoading}
                loading={isLoading}
                loadingText="Sending OTP..."
              />
            </>
          ) : (
            <button
              className="bg-transparent border-none text-primary cursor-pointer block w-full text-center p-2 text-base font-medium"
              onClick={() => setShowEmailLogin(true)}
            >
              Continue with Email
            </button>
          )
        ) : (
          <>
            <div className="text-center mb-4">
              <span className="text-muted-foreground text-sm">
                Enter the code sent to <strong>{email}</strong>
              </span>
              <button
                onClick={handleChangeEmail}
                className="text-blue-400 bg-none border-none cursor-pointer no-underline ml-2 text-sm font-medium"
              >
                Change
              </button>
            </div>
            <OtpInput
              otp={otp}
              setOtp={setOtp}
              onOtpComplete={handleVerifyOtp}
            />
            {(error || success) && (
              <div
                className={`text-sm mb-2 text-center ${
                  error ? "text-[#d93025]" : "text-[#34c759]"
                }`}
              >
                {error || success}
              </div>
            )}

            <ActionButton
              text="Verify"
              onClick={handleVerifyOtp}
              disabled={!isOtpComplete || isLoading}
              loading={isLoading}
              loadingText="Verifying..."
            />
          </>
        )}
      </div>
      <PrivacyPolicyLink />
    </div>
  );
};

const Header: React.FC = () => (
  <div className="text-center mb-8">
    <div className="flex w-full justify-center items-center">
      <img
        src={AiPadhaiLogo}
        alt="Logo"
        className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-20 lg:w-20"
      />
    </div>

    <h1 className="text-foreground text-3xl font-semibold tracking-wide">
      Welcome Back
    </h1>
    <p className="text-muted-foreground mt-2 text-base">
      Sign in to continue your AI Padhai journey
    </p>
  </div>
);

const GoogleSignInButton: React.FC = () => {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await signInWithGoogle();

      

      if (error) {
        
        // You can add error handling here (e.g., show a toast notification)
      }

      // If successful, the user will be redirected to the callback URL
      // and the auth state will be updated automatically
    } catch (error) {
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className="bg-background text-foreground w-full flex items-center justify-center font-medium py-3 px-4 rounded-xl border border-divider cursor-pointer transition-colors duration-200 ease-in-out hover:bg-foreground/20"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        viewBox="0 0 24 24"
        width="24"
        style={{ marginRight: "0.75rem" }}
      >
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53"
          fill="#EA4335"
        />
        <path d="M1 1h22v22H1z" fill="none" />
      </svg>

      {isLoading ? "Signing in..." : "Continue with Google"}
    </button>
  );
};

const OrDivider: React.FC = () => (
  <div className="flex items-center my-6">
    <hr className="flex-grow border-t border-border" />
    <span className="text-muted-foreground  px-4 text-xs font-medium uppercase">
      OR
    </span>
    <hr className="flex-grow border-t border-border" />
  </div>
);

const PrivacyPolicyLink: React.FC = () => (
  <p className="text-muted-foreground text-center text-xs leading-relaxed mt-8">
    By continuing, you agree to our{" "}
    <a
      href={ROUTES.PRIVACY_POLICY}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary no-underline"
    >
      Privacy Policy
    </a>
  </p>
);

export default LoginPage;
