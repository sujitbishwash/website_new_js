import React, { createContext, useContext, useEffect, useState } from "react";
import { ApiResponse, authApi, setAuthErrorHandler } from "../lib/api-client";

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

// Global promise to dedupe /ums/me calls across the app
let globalUserFetchPromise: Promise<ApiResponse<any> | null> | null = null;

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
    if (globalUserFetchPromise) {
      return await globalUserFetchPromise;
    }
    const { authApi } = await import("../lib/api-client");
    globalUserFetchPromise = (async () => {
      try {
        const response = await authApi.getAuthenticatedUser();
        updateLocalStorageUserData(response.data);
        return response;
      } finally {
        globalUserFetchPromise = null;
      }
    })();
    return await globalUserFetchPromise;
  };

  // Force refresh user data (bypass localStorage and fetch fresh data)
  const refreshUserData = async () => {
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
      }
    } catch (error) {
    }
  };

  const checkAuth = async (): Promise<boolean> => {
    try {

      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("userData");

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);

          // Set user immediately from localStorage (optimistic approach)
          setUser(parsedUser);

          // Validate token in background without blocking UI
          try {
            const response = await getUserData();

            // Only logout if we get a clear authentication error
            if (response && (response.status === 401 || response.status === 403)) {
              logout();
              return false;
            } else if (response && response.status >= 200 && response.status < 300) {
              // Update user data with fresh data from API
              if (response.data && response.data.id && response.data.email) {
                updateLocalStorageUserData(response.data);
                setUser({
                  id: response.data.id,
                  email: response.data.email,
                  name: response.data.name
                });
              }
            }
            // For other errors (network, server), keep user logged in
          } catch (validationError: any) {
            // Don't logout on validation errors - keep user logged in
          }

          return true;
        } catch (error: any) {
          // Only logout on clear authentication errors, not on parsing errors
          if (error.status === 401 || error.status === 403) {
            logout();
            return false;
          } else {
            // For any other errors, keep user logged in
            try {
              const parsedUser = JSON.parse(userData);
              setUser(parsedUser);
              return true;
            } catch (parseError) {
              // Even if parsing fails, don't logout - just return false
              return false;
            }
          }
        }
      }
      return false;
    } catch (error) {
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
      const response = await getUserData();

      if (
        response &&
        response.status >= 200 &&
        response.status < 300 &&
        response.data
      ) {
        const completeUserData = response.data;

        // Update localStorage with complete user data
        const updatedUserInfo = {
          id: completeUserData.id || userData?.id || "default-id",
          email: completeUserData.email || userData?.email || "",
          name: completeUserData.name || userData?.name || "",
        };

        localStorage.setItem("userData", JSON.stringify(updatedUserInfo));
        setUser(updatedUserInfo);

      }
    } catch (error) {
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
      return { data: null, error };
    }
  };

  const checkExamGoal = async (): Promise<boolean> => {
    try {
      setExamGoalLoading(true);

      // Get exam goal data from /ums/me API response
      const response = await getUserData();
      const userData = response?.data;

      const hasExamGoal = !!(
        userData?.exam_goal?.exam && userData?.exam_goal?.group
      );
      setHasExamGoal(hasExamGoal);
      return hasExamGoal;
    } catch (error) {
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

      // First check if user is authenticated (has valid token)
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("userData");

      // If no token or user data, user is not authenticated
      if (!token || !userData) {
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
      } catch (parseError) {
        return {
          hasName: false,
          hasExamGoal: false,
          nextStep: "personal-details",
        };
      }

      // Check if user has gender and date_of_birth from localStorage FIRST
      const hasPersonalDetailsFromStorage =
        parsedUserData?.gender && parsedUserData?.date_of_birth;

      // If user has personal details in localStorage, we don't need to call the API for personal details check
      if (hasPersonalDetailsFromStorage) {

        // Check exam goal from localStorage (if available)
        let hasExamGoal: boolean = false;
        if (parsedUserData?.exam_goal) {
          hasExamGoal = !!(
            parsedUserData.exam_goal.exam && parsedUserData.exam_goal.group
          );
        }

        if (hasExamGoal) {
          return {
            hasName: true,
            hasExamGoal: true,
            nextStep: "dashboard",
          };
        } else {
          return {
            hasName: true,
            hasExamGoal: false,
            nextStep: "exam-goal",
          };
        }
      }

      // If we reach here, user doesn't have personal details in localStorage, so we need to call API
      const response = await getUserData();

      // Check if API call failed (including 401/403 authentication errors)
      if (!response || response.status < 200 || response.status >= 300) {

        // Only logout on clear authentication errors
        if (response?.status === 401 || response?.status === 403) {
          // Clear authentication data
          logout();
          return {
            hasName: false,
            hasExamGoal: false,
            nextStep: "personal-details",
          };
        }

        // For other errors (network, server), don't logout - use fallback data
        return {
          hasName: false,
          hasExamGoal: false,
          nextStep: "personal-details",
        };
      }

      const userDataFromAPI = response.data;

      // Check if user has personal details from API
      const hasPersonalDetailsFromAPI =
        userDataFromAPI?.gender && userDataFromAPI?.date_of_birth;

      // Check if user has exam goal from /ums/me response
      let hasExamGoal: boolean = false;
      if (userDataFromAPI?.exam_goal) {
        hasExamGoal = !!(
          userDataFromAPI.exam_goal.exam && userDataFromAPI.exam_goal.group
        );
      }

      if (hasPersonalDetailsFromAPI && hasExamGoal) {
        return {
          hasName: true,
          hasExamGoal: true,
          nextStep: "dashboard",
        };
      } else if (hasPersonalDetailsFromAPI && !hasExamGoal) {
        return {
          hasName: true,
          hasExamGoal: false,
          nextStep: "exam-goal",
        };
      } else {
        return {
          hasName: false,
          hasExamGoal: false,
          nextStep: "personal-details",
        };
      }
    } catch (error) {

      // Only logout on clear authentication errors
      if (error && typeof error === "object" && "status" in error) {
        const apiError = error as any;
        if (apiError.status === 401 || apiError.status === 403) {
          logout();
          return {
            hasName: false,
            hasExamGoal: false,
            nextStep: "personal-details",
          };
        }
      }

      // For other errors, don't logout - use fallback data
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
      const response = await getUserData();

      const hasPersonalDetails =
        response &&
        response.status >= 200 &&
        response.status < 300 &&
        response.data?.gender &&
        response.data?.date_of_birth;

      if (hasPersonalDetails) {
        setHasName(true);
        return true;
      } else {
        setHasName(false);
        return false;
      }
    } catch (error) {
      setHasName(false);
      return false;
    } finally {
      setNameLoading(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      // Register global auth error handler to logout on token expiry
      setAuthErrorHandler((status, endpoint) => {
        console.log(`Auth error on ${endpoint}: ${status}`);
        logout();
      });
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