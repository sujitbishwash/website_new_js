import { useState } from "react";

// Centralized theme colors for easy customization
const theme = {
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

// --- Style Objects ---
// This approach uses 100% inline styles to avoid dependency on any CSS framework.

const styles: Record<string, React.CSSProperties> = {
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
    borderRadius: "1rem", // rounded-2xl
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", // shadow-xl
    padding: "2rem", // p-8
    maxWidth: "28rem", // max-w-md
    width: "100%",
  },
  headerContainer: {
    textAlign: "center" as const,
  },
  headerTitle: {
    color: theme.accent,
    fontSize: "2.25rem", // text-4xl
    lineHeight: "2.5rem",
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: theme.secondaryText,
    marginTop: "0.5rem", // mt-2
  },
  formContainer: {
    marginTop: "2rem", // mt-8
  },
  googleButton: {
    backgroundColor: theme.inputBackground,
    color: theme.primaryText,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600", // font-semibold
    padding: "0.75rem 1rem", // py-3 px-4
    borderRadius: "0.5rem", // rounded-lg
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  dividerContainer: {
    display: "flex",
    alignItems: "center",
    margin: "1.5rem 0", // space-y-6 equivalent
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
  emailInput: {
    backgroundColor: theme.inputBackground,
    color: theme.primaryText,
    width: "100%",
    padding: "0.75rem 1rem", // py-3 px-4
    borderRadius: "0.5rem", // rounded-lg
    border: "none",
    boxSizing: "border-box" as const, // Prevents padding from affecting width
    margin: "1.5rem 0", // space-y-6 equivalent
  },
  PasswordInput: {
    backgroundColor: theme.inputBackground,
    color: theme.primaryText,
    width: "100%",
    padding: "0.75rem 1rem", // py-3 px-4
    borderRadius: "0.5rem", // rounded-lg
    border: "none",
    boxSizing: "border-box" as const, // Prevents padding from affecting width
    margin: "1.5rem 0", // space-y-6 equivalent
  },
  loginButton: {
    width: "100%",
    background: `linear-gradient(to right, ${theme.buttonGradientFrom}, ${theme.buttonGradientTo})`,
    color: theme.primaryText,
    fontWeight: "bold",
    padding: "0.75rem 1rem", // py-3 px-4
    borderRadius: "0.5rem", // rounded-lg
    border: "none",
    cursor: "pointer",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", // shadow-lg
    transition: "all 0.3s",
  },
  privacyPolicy: {
    color: theme.mutedText,
    textAlign: "center" as const,
    fontSize: "0.875rem", // text-sm
    lineHeight: "1.25rem",
    marginTop: "2rem", // mt-8
  },
  privacyLink: {
    color: theme.accent,
    textDecoration: "none",
  },
};

// --- Components ---

const LoginPageNew = () => (
  <div style={styles.appContainer}>
    <LoginCard />
  </div>
);

const LoginCard = () => {
  const [email, setEmail] = useState("");
  const handleLogin = () => console.log(`Logging in with email: ${email}`);

  return (
    <div style={styles.loginCard}>
      <Header />
      <div style={styles.formContainer}>
        <GoogleSignInButton />
        <OrDivider />
        <EmailInput email={email} setEmail={setEmail} />
        <LoginButton onClick={handleLogin} />
      </div>
      <PrivacyPolicyLink />
    </div>
  );
};

const Header = () => (
  <div style={styles.headerContainer}>
    <h1 style={styles.headerTitle}>Welcome Back</h1>
    <p style={styles.headerSubtitle}>
      Sign in to continue your AI Padhai journey
    </p>
  </div>
);

const GoogleSignInButton = () => (
  <button style={styles.googleButton}>
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
    Sign in with Google
  </button>
);

const OrDivider = () => (
  <div style={styles.dividerContainer}>
    <hr style={styles.hr} />
    <span style={styles.dividerText}>OR</span>
    <hr style={styles.hr} />
  </div>
);

interface EmailInputProps {
  email: string;
  setEmail: (email: string) => void;
}

interface PasswordInputProps {
  password: string;
  setPassword: (password: string) => void;
}

const EmailInput: React.FC<EmailInputProps> = ({ email, setEmail }) => (
  <input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="Enter any email id to login"
    style={styles.emailInput}
  />
);

const PasswordInput: React.FC<PasswordInputProps> = ({
  password,
  setPassword,
}) => (
  <input
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Enter password"
    style={styles.emailInput}
  />
);

interface LoginButtonProps {
  onClick: () => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({ onClick }) => (
  <button onClick={onClick} style={styles.loginButton}>
    Login
  </button>
);

const PrivacyPolicyLink = () => (
  <p style={styles.privacyPolicy}>
    By continuing, you agree to our{" "}
    <a href="#" style={styles.privacyLink}>
      Privacy Policy
    </a>
  </p>
);

export default LoginPageNew;
