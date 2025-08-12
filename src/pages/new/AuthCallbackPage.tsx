import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../lib/api-client";
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

          // Store the token for API calls
          localStorage.setItem("authToken", data.session.access_token);

          try {
            // Check if user has name and exam goal
            const [userDetailsResponse, examGoalResponse] = await Promise.all([
              authApi.getUserDetails(),
              authApi.getAuthenticatedUser(),
            ]);

            console.log("User details response:", userDetailsResponse);
            console.log("Exam goal response:", examGoalResponse);

            // Check if name is missing
            const hasName =
              userDetailsResponse.data?.data?.name &&
              userDetailsResponse.data.data.name.trim() !== "";

            // Check if user has exam goal
            const hasExamGoal =
              examGoalResponse.data?.success &&
              examGoalResponse.data.data !== null;

            console.log("Has name:", hasName);
            console.log("Has exam goal:", hasExamGoal);

            // Determine redirect based on user state
            if (!hasName) {
              // User needs to complete personal details
              console.log("Redirecting to personal details page");
              navigate(ROUTES.PERSONAL_DETAILS, { replace: true });
            } else if (!hasExamGoal) {
              // User has name but no exam goal
              console.log("Redirecting to exam goal page");
              navigate(ROUTES.EXAM_GOAL, { replace: true });
            } else {
              // User has both name and exam goal
              console.log("Redirecting to dashboard");
              navigate(ROUTES.DASHBOARD, { replace: true });
            }
          } catch (error) {
            console.error("Error checking user details:", error);
            // Fallback to personal details page if API calls fail
            navigate(ROUTES.PERSONAL_DETAILS, { replace: true });
          }
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
