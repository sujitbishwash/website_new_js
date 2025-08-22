import React, { createContext, useContext, useEffect, useState } from "react";
import { ApiResponse, authApi } from "../lib/api-client";

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
  login: (token: string, userData?: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  checkExamGoal: () => Promise<boolean>;
  checkUserDetails: () => Promise<boolean>;
  checkUserState: () => Promise<{
    hasName: boolean;
    hasExamGoal: boolean;
    nextStep: "personal-details" | "exam-goal" | "dashboard";
  }>;
  signInWithGoogle: () => Promise<any>;
  // Get user data (from localStorage or API)
  getUserData: () => Promise<ApiResponse<{
    exam?: string;
    group_type?: string;
    name?: string;
    email?: string;
    id?: string;
    phoneno?: string;
    type?: string;
    usercode?: string;
    gender?: string;
    date_of_birth?: string;
    exam_goal?: {
      exam: string | null;
      group: string | null;
    };
  } | null> | null>;
  // Force refresh user data (bypass localStorage)
  refreshUserData: () => Promise<ApiResponse<{
    exam?: string;
    group_type?: string;
    name?: string;
    email?: string;
    id?: string;
    phoneno?: string;
    type?: string;
    usercode?: string;
    gender?: string;
    date_of_birth?: string;
    exam_goal?: {
      exam: string | null;
      group: string | null;
    };
  } | null> | null>;
  // Update user data in localStorage
  updateLocalStorageUserData: (userData: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Add cache for user data
let userDataCache: {
  data: {
    exam?: string;
    group_type?: string;
    name?: string;
    email?: string;
    id?: string;
    phoneno?: string;
    type?: string;
    usercode?: string;
    gender?: string;
    date_of_birth?: string;
    exam_goal?: {
      exam: string | null;
      group: string | null;
    };
  } | null;
  timestamp: number;
  isFetching?: boolean;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Global flag to prevent multiple simultaneous API calls
let isGlobalFetching = false;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasExamGoal, setHasExamGoal] = useState(false);
  const [examGoalLoading, setExamGoalLoading] = useState(false);
  const [hasName, setHasName] = useState(false);
  const [nameLoading, setNameLoading] = useState(false);

  // Get user data with localStorage optimization
  const getUserData = async () => {
    console.log("🔍 getUserData called", new Date().toISOString());

    // Check if cache is valid
    if (
      userDataCache &&
      Date.now() - userDataCache.timestamp < CACHE_DURATION
    ) {
      console.log("📋 Using stored user data");
      return {
        data: userDataCache.data,
        status: 200,
      };
    }

    // Prevent multiple simultaneous API calls
    if (isGlobalFetching) {
      console.log("⏳ Global API call already in progress, waiting...");
      // Wait for the current request to complete
      while (isGlobalFetching) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      // Return the stored data that should now be available
      if (
        userDataCache &&
        Date.now() - userDataCache.timestamp < CACHE_DURATION
      ) {
        console.log("📋 Using stored user data after waiting");
        return {
          data: userDataCache.data,
          status: 200,
        };
      }
    }

    try {
      console.log(
        "📡 Fetching fresh user data from API",
        new Date().toISOString()
      );

      // Mark as fetching to prevent duplicate calls
      isGlobalFetching = true;

      const { authApi } = await import("../lib/api-client");
      const response = await authApi.getAuthenticatedUser();
      console.log("✅ API call completed", new Date().toISOString());

      // Update stored data
      userDataCache = {
        data: response.data || null, // API returns data directly, not wrapped in data.data
        timestamp: Date.now(),
      };

      // Also update localStorage with the fresh data
      updateLocalStorageUserData(response.data);

      // Clear global fetching flag
      isGlobalFetching = false;

      return response;
    } catch (error) {
      console.error("❌ Error fetching user data:", error);

      // If it's an authentication error, clear cache and auth data
      if (error && typeof error === "object" && "status" in error) {
        const apiError = error as any;
        if (apiError.status === 401 || apiError.status === 403) {
          console.log(
            "🔒 Authentication error - clearing stored data and auth data"
          );
          userDataCache = null;
          // Don't call logout here as it might cause infinite loops
          // The calling function (checkUserState) will handle logout
        }
      }

      // Clear global fetching flag on error
      isGlobalFetching = false;
      return null;
    }
  };

  // Clear stored data when user logs out
  const clearUserDataCache = () => {
    console.log("🧹 Clearing stored user data");
    userDataCache = null;
    isGlobalFetching = false;
  };

  // Force refresh user data (bypass localStorage and fetch fresh data)
  const refreshUserData = async () => {
    console.log("🔄 Refreshing user data from API");
    userDataCache = null; // Clear stored data
    return await getUserData(); // This will fetch fresh data
  };

  // Update user data in localStorage
  const updateLocalStorageUserData = (userData: any) => {
    try {
      if (userData) {
        const userInfo = {
          id: userData.id || "default-id",
          email: userData.email || "",
          name: userData.name || "",
        };
        localStorage.setItem("userData", JSON.stringify(userInfo));
        console.log("✅ Updated user data in localStorage:", userInfo);
      }
    } catch (error) {
      console.error("❌ Error updating user data in localStorage:", error);
    }
  };

  const checkAuth = async (): Promise<boolean> => {
    try {
      console.log("🔍 Checking authentication...");

      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("userData");

      console.log("🔑 Token exists:", !!token);
      console.log("👤 User data exists:", !!userData);

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          console.log("👤 Parsed user data:", parsedUser.email);

          // Validate token by making an API call
          console.log("🔍 Validating token with API...");
          const response = await getUserData();

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

  const login = async (token: string, userData?: Partial<User>) => {
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

    // After login, fetch and store the complete user profile
    try {
      console.log("🔄 Fetching complete user profile after login...");
      const response = await getUserData();

      if (
        response &&
        response.status >= 200 &&
        response.status < 300 &&
        response.data
      ) {
        const completeUserData = response.data;
        console.log("📋 Complete user data fetched:", completeUserData);

        // Update localStorage with complete user data
        const updatedUserInfo = {
          id: completeUserData.id || userData?.id || "default-id",
          email: completeUserData.email || userData?.email || "",
          name: completeUserData.name || userData?.name || "",
        };

        localStorage.setItem("userData", JSON.stringify(updatedUserInfo));
        setUser(updatedUserInfo);

        console.log("✅ Complete user profile stored in localStorage");
      }
    } catch (error) {
      console.error(
        "❌ Error fetching complete user profile after login:",
        error
      );
      // Don't fail login if profile fetch fails
    }
  };

  const logout = async () => {
    // Clear state immediately
    setUser(null);
    setHasExamGoal(false);
    setHasName(false);
    clearUserDataCache(); // Clear cache on logout

    // Clear localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");

    // No external signout needed; backend tokens are stateless
  };

  const signInWithGoogle = async () => {
    try {
      // This will redirect the user to the backend OAuth endpoint
      // The backend will handle the Google OAuth flow and redirect back to our callback
      const response = await authApi.googleLogin();

      // The response won't actually be used since we're redirecting,
      // but we return it for consistency
      return { data: response.data, error: null };
    } catch (error) {
      console.error("Google sign-in error:", error);
      return { data: null, error };
    }
  };

  const checkExamGoal = async (): Promise<boolean> => {
    try {
      setExamGoalLoading(true);

      // Get exam goal data from /ums/me API response
      const response = await getUserData();
      const userData = response?.data;

      console.log("🎯 Exam goal check from /ums/me:", userData);

      const hasExamGoal = !!(
        userData?.exam_goal?.exam && userData?.exam_goal?.group
      );

      if (hasExamGoal) {
        console.log("✅ User has exam goal:", userData.exam_goal);
        setHasExamGoal(true);
        return true;
      } else {
        console.log("❌ User does not have exam goal");
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
      console.log("🔍 Starting checkUserState...");

      // First check if user is authenticated (has valid token)
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("userData");

      console.log("🔑 Token exists:", !!token);
      console.log("👤 User data exists:", !!userData);

      // If no token or user data, user is not authenticated
      if (!token || !userData) {
        console.log("❌ User not authenticated - no token or user data");
        return {
          hasName: false,
          hasExamGoal: false,
          nextStep: "personal-details",
        };
      }

      // Parse user data from localStorage first
      let parsedUserData: any;
      try {
        parsedUserData = JSON.parse(userData);
        console.log("📋 Parsed user data from localStorage:", parsedUserData);
      } catch (parseError) {
        console.error(
          "❌ Error parsing user data from localStorage:",
          parseError
        );
        return {
          hasName: false,
          hasExamGoal: false,
          nextStep: "personal-details",
        };
      }

      // Check if user has gender and date_of_birth from localStorage FIRST
      const hasPersonalDetailsFromStorage =
        parsedUserData?.gender && parsedUserData?.date_of_birth;
      console.log(
        "📝 Has personal details from localStorage:",
        hasPersonalDetailsFromStorage,
        "Gender:",
        parsedUserData?.gender,
        "DateOfBirth:",
        parsedUserData?.date_of_birth
      );

      // If user has personal details in localStorage, we don't need to call the API for personal details check
      if (hasPersonalDetailsFromStorage) {
        console.log(
          "✅ User has personal details in localStorage, skipping API call for personal details check"
        );

        // Check exam goal from localStorage (if available)
        let hasExamGoal: boolean = false;
        if (parsedUserData?.exam_goal) {
          hasExamGoal = !!(
            parsedUserData.exam_goal.exam && parsedUserData.exam_goal.group
          );
          console.log(
            "🎯 Exam goal check from localStorage:",
            hasExamGoal,
            "Exam:",
            parsedUserData.exam_goal.exam,
            "Group:",
            parsedUserData.exam_goal.group
          );
        }

        if (hasExamGoal) {
          console.log(
            "✅ User has both personal details (from localStorage) and exam goal, going to dashboard"
          );
          return {
            hasName: true,
            hasExamGoal: true,
            nextStep: "dashboard",
          };
        } else {
          console.log(
            "✅ User has personal details (from localStorage) but no exam goal, going to exam goal"
          );
          return {
            hasName: true,
            hasExamGoal: false,
            nextStep: "exam-goal",
          };
        }
      }

      // If we reach here, user doesn't have personal details in localStorage, so we need to call API
      console.log(
        "📡 User doesn't have personal details in localStorage, calling API to check..."
      );
      const response = await getUserData();
      console.log("📊 /ums/me API response:", response);

      // Check if API call failed (including 401/403 authentication errors)
      if (!response || response.status < 200 || response.status >= 300) {
        console.log("❌ API call failed or unauthorized");

        // If it's an authentication error (401/403), user is logged out
        if (response?.status === 401 || response?.status === 403) {
          console.log("🔒 Authentication error - user logged out");
          // Clear authentication data
          logout();
        }

        return {
          hasName: false,
          hasExamGoal: false,
          nextStep: "personal-details",
        };
      }

      const userDataFromAPI = response.data;
      console.log("📋 User data from API:", userDataFromAPI);

      // Check if user has personal details from API
      const hasPersonalDetailsFromAPI =
        userDataFromAPI?.gender && userDataFromAPI?.date_of_birth;
      console.log(
        "📝 Has personal details from API:",
        hasPersonalDetailsFromAPI,
        "Gender:",
        userDataFromAPI?.gender,
        "DateOfBirth:",
        userDataFromAPI?.date_of_birth
      );

      // Check if user has exam goal from /ums/me response
      let hasExamGoal: boolean = false;
      if (userDataFromAPI?.exam_goal) {
        hasExamGoal = !!(
          userDataFromAPI.exam_goal.exam && userDataFromAPI.exam_goal.group
        );
        console.log(
          "🎯 Exam goal check from /ums/me:",
          hasExamGoal,
          "Exam:",
          userDataFromAPI.exam_goal.exam,
          "Group:",
          userDataFromAPI.exam_goal.group
        );
      }

      if (hasPersonalDetailsFromAPI && hasExamGoal) {
        console.log(
          "✅ User has both personal details (from API) and exam goal, going to dashboard"
        );
        return {
          hasName: true,
          hasExamGoal: true,
          nextStep: "dashboard",
        };
      } else if (hasPersonalDetailsFromAPI && !hasExamGoal) {
        console.log(
          "✅ User has personal details (from API) but no exam goal, going to exam goal"
        );
        return {
          hasName: true,
          hasExamGoal: false,
          nextStep: "exam-goal",
        };
      } else {
        console.log("❌ User needs personal details");
        return {
          hasName: false,
          hasExamGoal: false,
          nextStep: "personal-details",
        };
      }
    } catch (error) {
      console.error("❌ Error checking user state:", error);

      // If it's an authentication error, clear auth data
      if (error && typeof error === "object" && "status" in error) {
        const apiError = error as any;
        if (apiError.status === 401 || apiError.status === 403) {
          console.log(
            "🔒 Authentication error in catch block - clearing auth data"
          );
          logout();
        }
      }

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
      const response = await getUserData();
      console.log("User details API response:", response);

      const hasPersonalDetails =
        response &&
        response.status >= 200 &&
        response.status < 300 &&
        response.data?.gender &&
        response.data?.date_of_birth;

      if (hasPersonalDetails) {
        console.log(
          "User has personal details:",
          response.data?.gender,
          response.data?.date_of_birth
        );
        setHasName(true);
        return true;
      } else {
        console.log("User does not have personal details");
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
    getUserData,
    refreshUserData,
    updateLocalStorageUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
