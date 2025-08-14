import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { ROUTES } from "../../routes/constants";

const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { checkUserState, checkAuth, refreshUserData } = useAuth();

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
          console.log(
            "🔑 Token stored:",
            data.session.access_token
              ? `${data.session.access_token.substring(0, 20)}...`
              : "null"
          );

          // Also store user data in localStorage for AuthContext
          const userInfo = {
            id: data.session.user.id,
            email: data.session.user.email || "",
            name: data.session.user.user_metadata?.name || "",
          };
          localStorage.setItem("userData", JSON.stringify(userInfo));
          console.log("👤 User data stored:", userInfo);

          // Update AuthContext state
          console.log("🔄 Updating AuthContext state...");
          await checkAuth();

          // Small delay to ensure token is properly stored
          await new Promise((resolve) => setTimeout(resolve, 100));

          try {
            // Force refresh user data to ensure we have the latest data
            console.log("🔄 Force refreshing user data...");
            await refreshUserData();

            // Use the stored user data from AuthContext to determine where to navigate
            console.log("🔍 About to call checkUserState...");
            const userState = await checkUserState();
            console.log("User state:", userState);

            // Navigate based on user state
            if (userState.nextStep === "dashboard") {
              console.log("User has exam goal, redirecting to dashboard");
              navigate(ROUTES.DASHBOARD, { replace: true });
            } else if (userState.nextStep === "exam-goal") {
              console.log("Redirecting to exam goal page");
              navigate(ROUTES.EXAM_GOAL, { replace: true });
            } else {
              console.log("Redirecting to personal details page");
              navigate(ROUTES.PERSONAL_DETAILS, { replace: true });
            }
          } catch (error) {
            console.error("Error checking user state:", error);
            // Fallback to personal details page if API fails
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
