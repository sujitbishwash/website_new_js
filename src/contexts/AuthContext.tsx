import type { User as SupabaseUser } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";
import { authHelpers } from "../lib/supabase";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasExamGoal: boolean;
  examGoalLoading: boolean;
  hasName: boolean;
  nameLoading: boolean;
  login: (token: string, userData?: Partial<User>) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
  checkExamGoal: () => Promise<boolean>;
  checkUserDetails: () => Promise<boolean>;
  checkUserState: () => Promise<{
    hasName: boolean;
    hasExamGoal: boolean;
    nextStep: "personal-details" | "exam-goal" | "dashboard";
  }>;
  signInWithGoogle: () => Promise<{ data: any; error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasExamGoal, setHasExamGoal] = useState(false);
  const [examGoalLoading, setExamGoalLoading] = useState(false);
  const [hasName, setHasName] = useState(false);
  const [nameLoading, setNameLoading] = useState(false);

  // Convert Supabase user to our User interface
  const convertSupabaseUser = (supabaseUser: SupabaseUser): User => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || "",
      name:
        supabaseUser.user_metadata?.full_name ||
        supabaseUser.user_metadata?.name ||
        "",
    };
  };

  const checkAuth = async (): Promise<boolean> => {
    try {
      console.log("🔍 Checking authentication...");

      // First try to get session from Supabase
      const { session, error } = await authHelpers.getSession();

      if (error) {
        console.error("❌ Error getting Supabase session:", error);
        return false;
      }

      if (session?.user) {
        console.log("✅ Supabase session found, user:", session.user.email);
        const convertedUser = convertSupabaseUser(session.user);
        setUser(convertedUser);

        // Store token for backward compatibility with existing API
        localStorage.setItem("authToken", session.access_token);
        localStorage.setItem("userData", JSON.stringify(convertedUser));
        console.log("💾 Stored auth token and user data in localStorage");

        return true;
      }

      // Fallback to localStorage for backward compatibility
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("userData");

      console.log(
        "🔍 Checking localStorage - Token:",
        !!token,
        "UserData:",
        !!userData
      );

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          console.log("👤 Parsed user data:", parsedUser.email);

          // Validate token by making an API call
          console.log("🔍 Validating token with API...");
          const { authApi } = await import("../lib/api-client");
          const response = await authApi.getAuthenticatedUser();

          console.log("📡 API response:", response);

          // More flexible validation - check if the request was successful (status 200-299)
          // and if we got any response data, even if it's null
          if (response && response.status >= 200 && response.status < 300) {
            // Token is valid, set user
            console.log("✅ Token is valid, setting user");
            setUser(parsedUser);
            return true;
          } else {
            // Token is invalid, clear storage
            console.log("❌ Invalid token found, clearing storage");
            logout();
            return false;
          }
        } catch (error: any) {
          console.error("❌ Error validating token:", error);
          // Don't clear storage on network errors, only on authentication errors
          if (error.status === 401 || error.status === 403) {
            console.log("🔒 Authentication error, clearing storage");
            logout();
            return false;
          } else {
            console.log("🌐 Network error, keeping authentication data");
            // For network errors, assume token is still valid
            // Parse user data again for network error case
            try {
              const parsedUser = JSON.parse(userData);
              setUser(parsedUser);
              return true;
            } catch (parseError) {
              console.error("❌ Error parsing user data:", parseError);
              logout();
              return false;
            }
          }
        }
      }

      console.log("❌ No valid authentication found");
      return false;
    } catch (error) {
      console.error("❌ Error checking auth:", error);
      return false;
    }
  };

  const login = (token: string, userData?: Partial<User>) => {
    localStorage.setItem("authToken", token);

    if (userData) {
      const userInfo = {
        id: userData.id || "default-id",
        email: userData.email || "",
        name: userData.name || "",
      };
      localStorage.setItem("userData", JSON.stringify(userInfo));
      setUser(userInfo);
    }
  };

  const logout = async () => {
    // Clear state immediately
    setUser(null);
    setHasExamGoal(false);
    setHasName(false);

    // Clear localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");

    try {
      // Sign out from Supabase
      await authHelpers.signOut();
    } catch (error) {
      console.error("Error signing out from Supabase:", error);
    }
  };

  const signInWithGoogle = async () => {
    return await authHelpers.signInWithGoogle();
  };

  const checkExamGoal = async (): Promise<boolean> => {
    try {
      setExamGoalLoading(true);
      const { authApi } = await import("../lib/api-client");
      const response = await authApi.getAuthenticatedUser();

      const hasExamGoal =
        response &&
        response.status >= 200 &&
        response.status < 300 &&
        response.data &&
        response.data.data !== null;

      if (hasExamGoal) {
        setHasExamGoal(true);
        return true;
      } else {
        setHasExamGoal(false);
        return false;
      }
    } catch (error) {
      console.error("Error checking exam goal:", error);
      setHasExamGoal(false);
      return false;
    } finally {
      setExamGoalLoading(false);
    }
  };

  // Method to check user's complete state and determine next step
  const checkUserState = async (): Promise<{
    hasName: boolean;
    hasExamGoal: boolean;
    nextStep: "personal-details" | "exam-goal" | "dashboard";
  }> => {
    try {
      // First check if user has exam goal
      const { authApi } = await import("../lib/api-client");
      const examGoalResponse = await authApi.getAuthenticatedUser();

      // Check if the API call was successful and if user has exam goal data
      const hasExamGoal =
        examGoalResponse &&
        examGoalResponse.status >= 200 &&
        examGoalResponse.status < 300 &&
        examGoalResponse.data &&
        examGoalResponse.data.data !== null;

      if (hasExamGoal) {
        // User has both name and exam goal
        return {
          hasName: true,
          hasExamGoal: true,
          nextStep: "dashboard",
        };
      }

      // User doesn't have exam goal, check if they have a name
      const userDetailsResponse = await authApi.getUserDetails();
      const hasName =
        userDetailsResponse &&
        userDetailsResponse.status >= 200 &&
        userDetailsResponse.status < 300 &&
        userDetailsResponse.data?.data?.name &&
        userDetailsResponse.data.data.name.trim() !== "";

      if (!hasName) {
        // User needs to complete personal details
        return {
          hasName: false,
          hasExamGoal: false,
          nextStep: "personal-details",
        };
      } else {
        // User has name but no exam goal
        return {
          hasName: true,
          hasExamGoal: false,
          nextStep: "exam-goal",
        };
      }
    } catch (error) {
      console.error("Error checking user state:", error);
      // Fallback to personal details page
      return {
        hasName: false,
        hasExamGoal: false,
        nextStep: "personal-details",
      };
    }
  };

  const checkUserDetails = async (): Promise<boolean> => {
    try {
      setNameLoading(true);
      console.log("Checking user details...");
      const { authApi } = await import("../lib/api-client");
      const response = await authApi.getUserDetails();
      console.log("User details API response:", response);

      const hasName =
        response &&
        response.status >= 200 &&
        response.status < 300 &&
        response.data?.data?.name &&
        response.data.data.name.trim() !== "";

      if (hasName) {
        console.log("User has name:", response.data?.data?.name);
        setHasName(true);
        return true;
      } else {
        console.log("User does not have name");
        setHasName(false);
        return false;
      }
    } catch (error) {
      console.error("Error checking user details:", error);
      setHasName(false);
      return false;
    } finally {
      setNameLoading(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth();
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    hasExamGoal,
    examGoalLoading,
    hasName,
    nameLoading,
    login,
    logout,
    checkAuth,
    checkExamGoal,
    checkUserDetails,
    checkUserState,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
