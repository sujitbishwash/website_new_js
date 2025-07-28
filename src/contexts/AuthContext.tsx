import {
  clearAuthData,
  getToken,
  isTokenValid,
  setToken,
} from "@/lib/auth-utils";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
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
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = (): boolean => {
    const token = getToken();
    if (!token) return false;

    const isValid = isTokenValid(token);
    if (!isValid) {
      // Token is invalid, clear it
      clearAuthData();
      setIsAuthenticated(false);
      return false;
    }

    return true;
  };

  const login = (token: string) => {
    setToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearAuthData();
    setIsAuthenticated(false);
  };

  useEffect(() => {
    // Check authentication status on app load
    const isValid = checkAuth();
    setIsAuthenticated(isValid);
    setIsLoading(false);
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
