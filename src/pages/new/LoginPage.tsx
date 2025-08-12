import { authApi } from "@/lib/api-client";
import { theme } from "@/styles/theme";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ROUTES } from "../../routes/constants";

// --- Style Objects ---
// This approach uses 100% inline styles to avoid dependency on any CSS framework.
const styles = {
  appContainer: {
    backgroundColor: theme.background,
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "sans-serif",
    padding: "1rem",
  },
  loginCard: {
    backgroundColor: theme.cardBackground,
    color: theme.primaryText,
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
    color: theme.accent,
    fontSize: "2.25rem",
    lineHeight: "2.5rem",
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: theme.secondaryText,
    marginTop: "0.5rem",
  },
  formContainer: {
    marginTop: "2rem",
  },
  googleButton: {
    backgroundColor: theme.inputBackground,
    color: theme.primaryText,
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
    borderTop: `1px solid ${theme.divider}`,
  },
  dividerText: {
    color: theme.mutedText,
    padding: "0 1rem",
  },
  inputField: {
    backgroundColor: theme.inputBackground,
    color: theme.primaryText,
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
    color: theme.secondaryText,
    fontSize: "0.875rem",
  },
  changeEmailButton: {
    color: theme.accent,
    background: "none",
    border: "none",
    cursor: "pointer",
    textDecoration: "underline",
    marginLeft: "0.5rem",
    fontSize: "0.875rem",
  },
  otpInputContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "0.5rem",
    marginBottom: "1.5rem",
  },
  otpInputBox: {
    backgroundColor: theme.inputBackground,
    color: theme.primaryText,
    width: "3rem",
    height: "3.5rem",
    borderRadius: "0.5rem",
    border: "1px solid transparent",
    textAlign: "center" as const,
    fontSize: "1.5rem",
    fontWeight: "bold",
    transition: "border-color 0.3s, box-shadow 0.3s",
  },
  actionButton: {
    width: "100%",
    background: `linear-gradient(to right, ${theme.buttonGradientFrom}, ${theme.buttonGradientTo})`,
    color: theme.primaryText,
    fontWeight: "bold",
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    border: "none",
    cursor: "pointer",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    transition: "all 0.3s",
  },
  privacyPolicy: {
    color: theme.mutedText,
    textAlign: "center" as const,
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    marginTop: "2rem",
  },
  privacyLink: {
    color: theme.accent,
    textDecoration: "none",
  },
  errorMessage: {
    color: theme.red,
    fontSize: "0.875rem",
    marginTop: "0.5rem",
    textAlign: "center" as const,
  },
  successMessage: {
    color: theme.green,
    fontSize: "0.875rem",
    marginTop: "0.5rem",
    textAlign: "center" as const,
  },
  inputFieldError: {
    backgroundColor: theme.inputBackground,
    color: theme.primaryText,
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    border: `1px solid ${theme.red}`,
    boxSizing: "border-box" as const,
    marginBottom: "0.5rem", // reduced margin to make room for error
  },
  actionButtonDisabled: {
    width: "100%",
    background: theme.mutedText,
    color: theme.secondaryText,
    fontWeight: "bold",
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    border: "none",
    cursor: "not-allowed",
    opacity: 0.6,
    transition: "all 0.3s",
  },
  actionButtonLoading: {
    width: "100%",
    background: theme.mutedText,
    color: theme.secondaryText,
    fontWeight: "bold",
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    border: "none",
    cursor: "not-allowed",
    opacity: 0.8,
    transition: "all 0.3s",
  },
  // New style for the button that reveals the email input
  emailLoginButton: {
    background: "none",
    border: "none",
    color: theme.accent,
    cursor: "pointer",
    display: "block",
    width: "100%",
    textAlign: "center" as const,
    padding: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: "600",
  },
};

// --- Main App Component ---

const LoginPage: React.FC = () => {
  const { isAuthenticated, isLoading, hasExamGoal, checkExamGoal } = useAuth();
  const navigate = useNavigate();

  // Redirect to appropriate page if already authenticated
  React.useEffect(() => {
    const handleAuthenticatedUser = async () => {
      if (!isLoading && isAuthenticated) {
        try {
          // First check if user has exam goal using the /ums/me endpoint
          const examGoalResponse = await authApi.getAuthenticatedUser();
          console.log("Exam goal response:", examGoalResponse);

          // Check if user has exam goal
          const hasExamGoal =
            examGoalResponse.data && examGoalResponse.data.data !== null;
          console.log("Has exam goal:", hasExamGoal);

          if (hasExamGoal) {
            // User has both name and exam goal, go directly to dashboard
            console.log("User has exam goal, redirecting to dashboard");
            navigate(ROUTES.DASHBOARD, { replace: true });
          } else {
            // User doesn't have exam goal, check if they have a name
            try {
              const userDetailsResponse = await authApi.getUserDetails();
              console.log("User details response:", userDetailsResponse);

              // Check if name is missing
              const hasName =
                userDetailsResponse.data?.data?.name &&
                userDetailsResponse.data.data.name.trim() !== "";
              console.log("Has name:", hasName);

              if (!hasName) {
                // User needs to complete personal details
                console.log("Redirecting to personal details page");
                navigate(ROUTES.PERSONAL_DETAILS, { replace: true });
              } else {
                // User has name but no exam goal
                console.log("Redirecting to exam goal page");
                navigate(ROUTES.EXAM_GOAL, { replace: true });
              }
            } catch (userDetailsError) {
              console.error("Error checking user details:", userDetailsError);
              // Fallback to personal details page if user details API fails
              navigate(ROUTES.PERSONAL_DETAILS, { replace: true });
            }
          }
        } catch (error) {
          console.error("Error checking exam goal:", error);
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
      <div style={styles.appContainer}>
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
      <div style={styles.appContainer}>
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
}) => (
  <input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="Enter your email"
    style={hasError ? styles.inputFieldError : styles.inputField}
  />
);

interface OtpInputProps {
  otp: string[];
  setOtp: (otp: string[]) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ otp, setOtp }) => {
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
    <div style={styles.otpInputContainer}>
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
            ...styles.otpInputBox,
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
}) => (
  <button
    onClick={onClick}
    style={
      loading
        ? styles.actionButtonLoading
        : disabled
        ? styles.actionButtonDisabled
        : styles.actionButton
    }
    disabled={disabled || loading}
  >
    {loading ? loadingText : text}
  </button>
);

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
    ROUTES.DASHBOARD;

  const validateEmail = (email: string): boolean => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const isEmailValid = validateEmail(email);
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

      if (!isEmailValid) {
        setError("Please enter a valid email address.");
        return;
      }

      // Call the API to send OTP
      const response = await authApi.sendOtp(email);

      setSuccess(response.data.data);
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
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
      const response = await authApi.verifyOtp(email, finalOtp);

      // Store the token in localStorage
      localStorage.setItem("authToken", response.data.access_token);

      setSuccess("Login successful! Redirecting...");

      // Use the same logic as AuthCallbackPage to determine where to navigate
      try {
        // First check if user has exam goal using the /ums/me endpoint
        const examGoalResponse = await authApi.getAuthenticatedUser();
        console.log("Exam goal response:", examGoalResponse);

        // Check if user has exam goal
        const hasExamGoal =
          examGoalResponse.data && examGoalResponse.data.data !== null;
        console.log("Has exam goal:", hasExamGoal);

        if (hasExamGoal) {
          // User has both name and exam goal, go directly to dashboard
          console.log("User has exam goal, redirecting to dashboard");
          navigate(from, { replace: true });
        } else {
          // User doesn't have exam goal, check if they have a name
          try {
            const userDetailsResponse = await authApi.getUserDetails();
            console.log("User details response:", userDetailsResponse);

            // Check if name is missing
            const hasName =
              userDetailsResponse.data?.data?.name &&
              userDetailsResponse.data.data.name.trim() !== "";
            console.log("Has name:", hasName);

            if (!hasName) {
              // User needs to complete personal details
              console.log("Redirecting to personal details page");
              navigate(ROUTES.PERSONAL_DETAILS, { replace: true });
            } else {
              // User has name but no exam goal
              console.log("Redirecting to exam goal page");
              navigate(ROUTES.EXAM_GOAL, { replace: true });
            }
          } catch (userDetailsError) {
            console.error("Error checking user details:", userDetailsError);
            // Fallback to personal details page if user details API fails
            navigate(ROUTES.PERSONAL_DETAILS, { replace: true });
          }
        }
      } catch (error) {
        console.error("Error checking exam goal:", error);
        // Fallback to personal details page if exam goal API fails
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
    <div style={styles.loginCard}>
      <Header />
      <div style={styles.formContainer}>
        <GoogleSignInButton />
        <OrDivider />

        {!otpSent ? (
          // Stage 1: Choose login method or enter email
          showEmailLogin ? (
            <>
              {" "}
              <EmailInput
                email={email}
                setEmail={handleEmailChange}
                hasError={Boolean(error)}
              />{" "}
              {error && <div style={styles.errorMessage}>{error}</div>}{" "}
              <ActionButton
                text="Send OTP"
                onClick={handleSendOtp}
                disabled={!isEmailValid}
                loading={isLoading}
                loadingText="Sending OTP..."
              />{" "}
            </>
          ) : (
            <button
              style={styles.emailLoginButton}
              onClick={() => setShowEmailLogin(true)}
            >
              Login with Email{" "}
            </button>
          )
        ) : (
          // OTP Input
          <>
            <div style={styles.otpInfoContainer}>
              <span style={styles.otpInfoText}>
                Enter the OTP sent to <strong>{email}</strong>
              </span>
              <button
                onClick={handleChangeEmail}
                style={styles.changeEmailButton}
              >
                Change
              </button>
            </div>
            <OtpInput otp={otp} setOtp={setOtp} />
            {error && <div style={styles.errorMessage}>{error}</div>}
            {success && <div style={styles.successMessage}>{success}</div>}
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

const Header: React.FC = () => (
  <div style={styles.headerContainer}>
    <h1 style={styles.headerTitle}>Welcome Back</h1>
    <p style={styles.headerSubtitle}>
      Sign in to continue your AI Padhai journey
    </p>
  </div>
);

const GoogleSignInButton: React.FC = () => {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await signInWithGoogle();

      if (error) {
        console.error("Google sign-in error:", error);
        // You can add error handling here (e.g., show a toast notification)
      }

      // If successful, the user will be redirected to the callback URL
      // and the auth state will be updated automatically
    } catch (error) {
      console.error("Google sign-in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      style={styles.googleButton}
      onClick={handleGoogleSignIn}
      disabled={isLoading}
    >
      <svg
        style={{ width: "1.5rem", height: "1.5rem", marginRight: "0.75rem" }}
        viewBox="0 0 48 48"
      >
        <path
          fill="#FFC107"
          d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 8.841C34.553 4.806 29.602 2.5 24 2.5C11.983 2.5 2.5 11.983 2.5 24s9.483 21.5 21.5 21.5c11.147 0 20.25-8.673 20.25-19.75c0-1.343-.138-2.65-.389-3.917z"
        ></path>
        <path
          fill="#FF3D00"
          d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12.5 24 12.5c3.059 0 5.842 1.154 7.961 3.039l5.841-5.841C34.553 4.806 29.602 2.5 24 2.5C16.318 2.5 9.642 6.735 6.306 14.691z"
        ></path>
        <path
          fill="#4CAF50"
          d="M24 45.5c5.842 0 11.017-1.939 14.686-5.22l-6.571-4.819c-1.926 1.386-4.32 2.22-6.815 2.22c-5.22 0-9.651-3.657-11.303-8.841l-6.571 4.82C9.642 38.265 16.318 45.5 24 45.5z"
        ></path>
        <path
          fill="#1976D2"
          d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.16-4.082 5.581l6.571 4.82c3.584-3.264 6.282-8.132 6.282-14.318c0-1.343-.138-2.65-.389-3.917z"
        ></path>
      </svg>
      {isLoading ? "Signing in..." : "Sign in with Google"}
    </button>
  );
};

const OrDivider: React.FC = () => (
  <div style={styles.dividerContainer}>
    <hr style={styles.hr} />
    <span style={styles.dividerText}>OR</span>
    <hr style={styles.hr} />
  </div>
);

const PrivacyPolicyLink: React.FC = () => (
  <p style={styles.privacyPolicy}>
    By continuing, you agree to our{" "}
    <button
      onClick={() => window.open(ROUTES.PRIVACY_POLICY, "_blank")}
      style={styles.privacyLink}
      className="cursor-pointer border-none bg-transparent p-0"
    >
      Privacy Policy
    </button>
  </p>
);

export default LoginPage;
