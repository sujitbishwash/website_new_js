import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ROUTES } from "../../routes/constants";

const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const { login, checkUserState } = useAuth();
  const hasRunRef = useRef(false);

  useEffect(() => {
    // Prevent multiple executions
    if (hasRunRef.current) {
      
      return;
    }
    hasRunRef.current = true;

    const handleAuthCallback = async () => {
      try {
        // Check for token in query parameters first
        const tokenFromQuery = searchParams.get("token");

        if (tokenFromQuery) {
          // Use token from query parameter
          
          localStorage.setItem("authToken", tokenFromQuery);

          // Store the token and let the API calls fetch real user data
          
        } else {
          // No token present; invalid access to callback
          
          setError("Invalid authentication callback.");
          setTimeout(() => navigate(ROUTES.LOGIN), 2000);
          return;
        }

        // Use AuthContext login function to properly set the authentication state
        
        await login(tokenFromQuery);
        
        // Now check user state to determine proper redirect destination
        
        const userState = await checkUserState();
        
        
        // Navigate based on user state
        if (userState.nextStep === "dashboard") {
          
          navigate(ROUTES.HOME, { replace: true });
        } else if (userState.nextStep === "exam-goal") {
          
          navigate(ROUTES.EXAM_GOAL, { replace: true });
        } else {
          
          navigate(ROUTES.PERSONAL_DETAILS, { replace: true });
        }
        return;
      } catch (error) {
        
        setError("An unexpected error occurred.");
        setTimeout(() => {
          navigate(ROUTES.LOGIN);
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]); // Removed function dependencies to prevent re-runs

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#111827",
        color: "#FFFFFF",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: "2rem",
        }}
      >
        {error ? (
          <>
            <h2 style={{ color: "#EF4444", marginBottom: "1rem" }}>
              Authentication Error
            </h2>
            <p style={{ color: "#9CA3AF", marginBottom: "2rem" }}>{error}</p>
            <p style={{ color: "#6B7280" }}>Redirecting to login page...</p>
          </>
        ) : (
          <>
            <h2 style={{ color: "#60A5FA", marginBottom: "1rem" }}>
              Authenticating...
            </h2>
            <p style={{ color: "#9CA3AF" }}>
              Please wait while we complete your sign-in.
            </p>
            <div
              style={{
                marginTop: "2rem",
                width: "40px",
                height: "40px",
                border: "4px solid #374151",
                borderTop: "4px solid #60A5FA",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "2rem auto 0",
              }}
            ></div>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallbackPage;
