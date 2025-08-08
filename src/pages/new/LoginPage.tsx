import { authApi } from "@/lib/api-client";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useThemeColors } from "../../contexts/ThemeContext";
import { ROUTES } from "../../routes/constants";

// --- Style Objects ---
// This approach uses 100% inline styles to avoid dependency on any CSS framework.
const styles = {
  appContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "sans-serif",
    padding: "1rem",
  },
  loginCard: {
    borderRadius: "1rem",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    padding: "2rem",
    maxWidth: "28rem",
    width: "100%",
    boxSizing: "border-box" as const,
  },
  headerContainer: {
    textAlign: "center" as const,
  },
  headerTitle: {
    fontSize: "2.25rem",
    lineHeight: "2.5rem",
    fontWeight: "bold",
  },
  headerSubtitle: {
    marginTop: "0.5rem",
  },
  formContainer: {
    marginTop: "2rem",
  },
  googleButton: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  dividerContainer: {
    display: "flex",
    alignItems: "center",
    margin: "1.5rem 0",
  },
  hr: {
    width: "100%",
    border: "none",
  },
  dividerText: {
    padding: "0 1rem",
  },
  inputField: {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    border: "none",
    boxSizing: "border-box" as const,
    marginBottom: "1.5rem",
  },
  otpInfoContainer: {
    textAlign: "center" as const,
    marginBottom: "1rem",
  },
  otpInfoText: {
    marginBottom: "0.5rem",
  },
  otpInfoEmail: {
    fontWeight: "600",
  },
  otpContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "0.5rem",
    marginBottom: "1.5rem",
  },
  otpInput: {
    width: "3rem",
    height: "3rem",
    textAlign: "center" as const,
    fontSize: "1.25rem",
    fontWeight: "600",
    borderRadius: "0.5rem",
    border: "none",
  },
  actionButton: {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s",
    position: "relative" as const,
  },
  changeEmailButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    textDecoration: "underline",
    marginTop: "1rem",
  },
  privacyPolicyContainer: {
    textAlign: "center" as const,
    marginTop: "1.5rem",
  },
  privacyPolicyLink: {
    textDecoration: "underline",
    cursor: "pointer",
  },
};

// --- Main App Component ---

const LoginPage: React.FC = () => {
  const { isAuthenticated, isLoading, checkExamGoal } = useAuth();
  const navigate = useNavigate();
  const theme = useThemeColors();

  // Redirect to appropriate page if already authenticated
  React.useEffect(() => {
    const handleAuthenticatedUser = async () => {
      if (!isLoading && isAuthenticated) {
        // Check if user has exam goal
        const hasGoal = await checkExamGoal();
        if (hasGoal) {
          navigate(ROUTES.DASHBOARD, { replace: true });
        } else {
          navigate(ROUTES.EXAM_GOAL, { replace: true });
        }
      }
    };

    handleAuthenticatedUser();
  }, [isAuthenticated, isLoading, navigate, checkExamGoal]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div
        style={{ ...styles.appContainer, backgroundColor: theme.background }}
      >
        <div style={{ ...styles.loginCard, textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            Loading...
          </div>
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
      <div
        style={{
          ...styles.appContainer,
          backgroundColor: theme.background,
        }}
      >
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
}

const EmailInput: React.FC<EmailInputProps> = ({
  email,
  setEmail,
  hasError = false,
}) => {
  const theme = useThemeColors();
  return (
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Enter your email"
      style={{
        ...styles.inputField,
        backgroundColor: hasError ? theme.input : theme.input,
        color: theme.primaryText,
        border: hasError ? `1px solid ${theme.error}` : "none",
      }}
    />
  );
};

interface OtpInputProps {
  otp: string[];
  setOtp: (otp: string[]) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ otp, setOtp }) => {
  const theme = useThemeColors();
  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;
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
    <div style={styles.otpContainer}>
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          name="otp"
          maxLength={1}
          value={data}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onFocus={(e) => e.currentTarget.select()}
          onPaste={index === 0 ? handlePaste : () => {}}
          style={{
            ...styles.otpInput,
            ...(data ? { borderColor: theme.accent } : {}),
          }}
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
  const theme = useThemeColors();
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.actionButton,
        background: loading
          ? `linear-gradient(to right, ${theme.gradientFrom}, ${theme.gradientTo})`
          : disabled
          ? `linear-gradient(to right, ${theme.gradientFrom}, ${theme.gradientTo})`
          : `linear-gradient(to right, ${theme.gradientFrom}, ${theme.gradientTo})`,
        color: theme.primaryText,
        fontWeight: "bold",
        opacity: loading ? 0.8 : 1,
        cursor: loading ? "not-allowed" : disabled ? "not-allowed" : "pointer",
      }}
      disabled={disabled || loading}
    >
      {loading ? loadingText : text}
    </button>
  );
};

const LoginCard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, checkExamGoal } = useAuth();
  const theme = useThemeColors();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get the return URL from location state, or default to dashboard
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    ROUTES.DASHBOARD;

  const validateEmail = (email: string): boolean => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const isValidEmail = validateEmail(email);
  const isOtpComplete = otp.join("").length === 6;

  const handleSendOtp = async () => {
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      if (!email) {
        setError("Please enter an email address.");
        return;
      }

      if (!isValidEmail) {
        setError("Please enter a valid email address.");
        return;
      }

      /*
      // Call the API to send OTP
      const response = await authApi.sendOtp(email);

      if (response.data.success) {
        setSuccess("OTP sent successfully! Please check your email.");
        setOtpSent(true);
      } else {
        setError(
          response.data.message || "Failed to send OTP. Please try again."
        );
      }
      */
      //  its a dummy code need to be removed when apui ready
      setTimeout(() => {
        setOtpSent(true);
        setIsLoading(false);
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      // setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      const finalOtp = otp.join("");
      if (finalOtp.length !== 6) {
        setError("Please enter the complete 6-digit OTP.");
        return;
      }

      // Call the API to verify OTP
      /*
      const response = await authApi.verifyOtp(email, finalOtp);

      if (response.data.success) {
        // Store the token in localStorage
        localStorage.setItem("authToken", response.data.access_token);

        setSuccess("Login successful! Redirecting...");

        
      } else {
        setError(response.data.message || "Invalid OTP. Please try again.");
      }
        */

      // Navigate to appropriate page after a short delay
      setTimeout(async () => {
        // dummy code need to be removed when api is ready
        const response = await authApi.login(email, "securepassword");

        // Use the auth context to login
        login(response.data.access_token, { email });

        // Check if user has exam goal and navigate accordingly
        const hasGoal = await checkExamGoal();
        if (hasGoal) {
          // User has exam goal, navigate to return URL or dashboard
          navigate(from);
        } else {
          // User doesn't have exam goal, navigate to exam goal page
          navigate(ROUTES.EXAM_GOAL);
        }
        setIsLoading(false);
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to verify OTP. Please try again.");
    } finally {
      // setIsLoading(false);
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
    <div
      style={{
        ...styles.loginCard,
        backgroundColor: theme.card,
        color: theme.primaryText,
      }}
    >
      <Header />
      <div style={styles.formContainer}>
        <GoogleSignInButton />
        <OrDivider />

        {!otpSent ? (
          // Email Input for OTP
          <>
            <EmailInput
              email={email}
              setEmail={handleEmailChange}
              hasError={Boolean(error && !isValidEmail)}
            />
            {error && (
              <div style={{ color: theme.error, marginTop: "0.5rem" }}>
                {error}
              </div>
            )}
            <ActionButton
              text="Send OTP"
              onClick={handleSendOtp}
              disabled={!isValidEmail}
              loading={isLoading}
              loadingText="Sending OTP..."
            />
          </>
        ) : (
          // OTP Input
          <>
            <div style={styles.otpInfoContainer}>
              <span style={styles.otpInfoText}>
                Enter the OTP sent to{" "}
                <span style={styles.otpInfoEmail}>{email}</span>
              </span>
              <button
                onClick={handleChangeEmail}
                style={styles.changeEmailButton}
              >
                Change
              </button>
            </div>
            <OtpInput otp={otp} setOtp={setOtp} />
            {error && (
              <div style={{ color: theme.error, marginTop: "0.5rem" }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ color: theme.success, marginTop: "0.5rem" }}>
                {success}
              </div>
            )}
            <ActionButton
              text="Verify OTP"
              onClick={handleVerifyOtp}
              disabled={!isOtpComplete}
              loading={isLoading}
              loadingText="Verifying OTP..."
            />
          </>
        )}
      </div>
      <PrivacyPolicyLink />
    </div>
  );
};

const Header: React.FC = () => {
  const theme = useThemeColors();
  return (
    <div style={styles.headerContainer}>
      <h1
        style={{
          ...styles.headerTitle,
          color: theme.accent,
        }}
      >
        AI Padhai
      </h1>
      <p
        style={{
          ...styles.headerSubtitle,
          color: theme.secondaryText,
        }}
      >
        Your AI-powered learning companion
      </p>
    </div>
  );
};

const GoogleSignInButton: React.FC = () => {
  const theme = useThemeColors();
  return (
    <button
      style={{
        ...styles.googleButton,
        backgroundColor: theme.input,
        color: theme.primaryText,
      }}
      onClick={() => {
        // Google sign-in logic would go here
        console.log("Google sign-in clicked");
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        style={{ marginRight: "0.75rem" }}
      >
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      Continue with Google
    </button>
  );
};

const OrDivider: React.FC = () => {
  const theme = useThemeColors();
  return (
    <div style={styles.dividerContainer}>
      <hr
        style={{
          ...styles.hr,
          borderTop: `1px solid ${theme.border}`,
        }}
      />
      <span
        style={{
          ...styles.dividerText,
          color: theme.mutedText,
        }}
      >
        or
      </span>
      <hr
        style={{
          ...styles.hr,
          borderTop: `1px solid ${theme.border}`,
        }}
      />
    </div>
  );
};

const PrivacyPolicyLink: React.FC = () => {
  const theme = useThemeColors();
  return (
    <div style={styles.privacyPolicyContainer}>
      <p
        style={{
          color: theme.secondaryText,
          fontSize: "0.875rem",
        }}
      >
        By continuing, you agree to our{" "}
        <span
          style={{
            ...styles.privacyPolicyLink,
            color: theme.accent,
          }}
          onClick={() => {
            // Privacy policy link logic
            console.log("Privacy policy clicked");
          }}
        >
          Privacy Policy
        </span>
      </p>
    </div>
  );
};

export default LoginPage;
