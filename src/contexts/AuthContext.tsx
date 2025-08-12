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
      // First try to get session from Supabase
      const { session, error } = await authHelpers.getSession();

      if (error) {
        console.error("Error getting session:", error);
        return false;
      }

      if (session?.user) {
        const convertedUser = convertSupabaseUser(session.user);
        setUser(convertedUser);

        // Store token for backward compatibility with existing API
        localStorage.setItem("authToken", session.access_token);
        localStorage.setItem("userData", JSON.stringify(convertedUser));

        return true;
      }

      // Fallback to localStorage for backward compatibility
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("userData");

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          return true;
        } catch (error) {
          console.error("Error parsing user data:", error);
          logout();
          return false;
        }
      }

      return false;
    } catch (error) {
      console.error("Error checking auth:", error);
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
      const { examGoalApi } = await import("../lib/api-client");
      const response = await examGoalApi.getUserExamGoal();

      if (response.data.success && response.data.data) {
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

  const checkUserDetails = async (): Promise<boolean> => {
    try {
      setNameLoading(true);
      console.log("Checking user details...");
      const { authApi } = await import("../lib/api-client");
      const response = await authApi.getUserDetails();
      console.log("User details API response:", response);

      if (response.data?.data?.name && response.data.data.name.trim() !== "") {
        console.log("User has name:", response.data.data.name);
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
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
