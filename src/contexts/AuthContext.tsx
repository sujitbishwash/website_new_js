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

// Global flag to prevent multiple simultaneous API calls
let isGlobalFetching = false;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasExamGoal, setHasExamGoal] = useState(false);
  const [examGoalLoading, _setExamGoalLoading] = useState(false);
  const [hasName, setHasName] = useState(false);
  const [nameLoading, _setNameLoading] = useState(false);

  // Get user data with localStorage optimization
  const getUserData = async () => {
    // Prevent multiple simultaneous API calls
    if (isGlobalFetching) {
      // Wait for the current request to complete
      while (isGlobalFetching) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    try {
      // Mark as fetching to prevent duplicate calls
      isGlobalFetching = true;

      const { authApi } = await import("../lib/api-client");
      const response = await authApi.getAuthenticatedUser();

      // Also update localStorage with the fresh data
      updateLocalStorageUserData(response.data);

      // Clear global fetching flag
      isGlobalFetching = false;

      return response;
    } catch (error) {
      // If it's an authentication error, clear auth data
      if (error && typeof error === "object" && "status" in error) {
        const apiError = error as any;
        if (apiError.status === 401 || apiError.status === 403) {
          // Don't call logout here as it might cause infinite loops
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");
          setUser(null);
        }
      }

      isGlobalFetching = false;
      return null;
    }
  };

  // Force refresh user data (bypass localStorage)
  const refreshUserData = async () => {
    const response = await getUserData();
    const userInfo = response?.data;
    if (userInfo) {
      localStorage.setItem("userData", JSON.stringify(userInfo));
    }
    return response;
  };

  // Update user data in localStorage
  const updateLocalStorageUserData = (userData: any) => {
    try {
      localStorage.setItem("userData", JSON.stringify(userData));
    } catch (error) {
      // ignore localStorage write errors
    }
  };

  // Check authentication status
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("userData");

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser({ id: parsedUser.id, email: parsedUser.email, name: parsedUser.name });

          // Validate token with API in background (non-blocking)
          try {
            const response = await authApi.getAuthenticatedUser();
            if (response.status === 401 || response.status === 403) {
              // Clear storage on auth error
              localStorage.removeItem("authToken");
              localStorage.removeItem("userData");
              setUser(null);
            }
          } catch {
            // Keep user logged in on background validation error
          }
          return true;
        } catch {
          // If parsing fails, clear storage and proceed to unauthenticated state
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");
          setUser(null);
        }
      }

      // No valid auth found
      setUser(null);
      return false;
    } catch {
      setUser(null);
      return false;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const response = await authApi.googleLogin();
      return response;
    } catch (error) {
      return null;
    }
  };

  const checkExamGoal = async () => {
    try {
      const response = await getUserData();
      const userData = response?.data;
      if (userData?.exam_goal?.exam && userData?.exam_goal?.group) {
        setHasExamGoal(true);
        return true;
      }
      setHasExamGoal(false);
      return false;
    } catch {
      setHasExamGoal(false);
      return false;
    }
  };

  const checkUserState = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("userData");

      if (!token || !userData) {
        return { hasExamGoal: false, hasName: false, nextStep: "personal-details" as const };
      }

      try {
        const parsedUserData = JSON.parse(userData);
        const response = await authApi.getAuthenticatedUser();

        if (!response || response.status !== 200) {
          return { hasExamGoal: false, hasName: false, nextStep: "personal-details" as const };
        }

        const userDataFromAPI = response.data;

        const hasExamGoal = !!(userDataFromAPI?.exam_goal?.exam && userDataFromAPI?.exam_goal?.group);
        const hasPersonalDetails = !!(userDataFromAPI?.gender && userDataFromAPI?.date_of_birth);

        setHasExamGoal(hasExamGoal);
        setHasName(!!parsedUserData?.name);

        if (!hasPersonalDetails) {
          return { hasExamGoal, hasName: !!parsedUserData?.name, nextStep: "personal-details" as const };
        }
        if (!hasExamGoal) {
          return { hasExamGoal, hasName: !!parsedUserData?.name, nextStep: "exam-goal" as const };
        }
        return { hasExamGoal, hasName: !!parsedUserData?.name, nextStep: "dashboard" as const };
      } catch {
        return { hasExamGoal: false, hasName: false, nextStep: "personal-details" as const };
      }
    } catch {
      return { hasExamGoal: false, hasName: false, nextStep: "personal-details" as const };
    }
  };

  const checkUserDetails = async () => {
    try {
      const response = await authApi.getAuthenticatedUser();
      const hasDetails = !!(response?.data?.gender && response?.data?.date_of_birth);
      return hasDetails;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      setIsLoading(false);
    };
    init();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        hasExamGoal,
        examGoalLoading,
        hasName,
        nameLoading,
        login: async () => {},
        logout: async () => {},
        checkAuth,
        checkExamGoal,
        checkUserDetails,
        checkUserState,
        signInWithGoogle,
        getUserData,
        refreshUserData,
        updateLocalStorageUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
