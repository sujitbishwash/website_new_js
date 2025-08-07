import React, { createContext, useContext, useEffect, useState } from "react";

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
  login: (token: string, userData?: Partial<User>) => void;
  logout: () => void;
  checkAuth: () => boolean;
  checkExamGoal: () => Promise<boolean>;
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

  const checkAuth = (): boolean => {
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

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setUser(null);
    setHasExamGoal(false);
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

  useEffect(() => {
    checkAuth();
    setIsLoading(false);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    hasExamGoal,
    examGoalLoading,
    login,
    logout,
    checkAuth,
    checkExamGoal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
