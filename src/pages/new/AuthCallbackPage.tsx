import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { ROUTES } from "../../routes/constants";

const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth callback error:", error);
          setError("Authentication failed. Please try again.");
          setTimeout(() => {
            navigate(ROUTES.LOGIN);
          }, 3000);
          return;
        }

        if (data.session) {
          // Successfully authenticated
          console.log("User authenticated:", data.session.user);

          // Redirect to dashboard or exam goal page
          // You can add logic here to check if user has exam goal
          navigate(ROUTES.DASHBOARD, { replace: true });
        } else {
          // No session found
          setError("No authentication session found.");
          setTimeout(() => {
            navigate(ROUTES.LOGIN);
          }, 3000);
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        setError("An unexpected error occurred.");
        setTimeout(() => {
          navigate(ROUTES.LOGIN);
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

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
