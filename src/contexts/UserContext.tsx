import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

// Interfaces
export interface UserProfile {
  id: string;
  name: string; // Can be empty string if user hasn't set their name
  email: string;
  phone?: string;
  avatar?: string;
  gender?: string;
  date_of_birth?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExamGoal {
  exam: string;
  groupType: string;
}

export interface UserStats {
  totalTests: number;
  completedTests: number;
  averageScore: number;
  bestScore: number;
  lastTestDate?: string;
}

export interface UserPreferences {
  theme: "light" | "dark";
  notifications: boolean;
  language: string;
}

export interface UserContextType {
  // State
  profile: UserProfile | null;
  examGoal: ExamGoal | null;
  stats: UserStats | null;
  preferences: UserPreferences | null;
  isLoading: boolean;
  error: string | null;
  isDataLoaded: boolean; // New: indicates if background data loading is complete

  // Actions
  fetchProfile: () => Promise<void>;
  fetchExamGoal: (forceRefresh?: boolean) => Promise<void>;
  fetchStats: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshExamGoal: () => Promise<void>;
  refreshStats: () => Promise<void>;
  refreshAll: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateExamGoal: (updates: Partial<ExamGoal>) => Promise<void>;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  isProfileComplete: () => boolean;
  syncExamGoalFromAuthContext: () => boolean;
}

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [examGoal, setExamGoal] = useState<ExamGoal | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);


  const { getUserData, isAuthenticated, isLoading: authLoading } = useAuth();

  // Load stored data on mount
  useEffect(() => {
    const loadStoredData = () => {
      console.log("🔄 UserContext: Loading stored data from localStorage...");

      // Check AuthContext's localStorage for exam goal data
      let authContextExamGoal = null;
      try {
        const userData = localStorage.getItem("userData");
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          if (parsedUserData?.exam && parsedUserData?.group_type) {
            authContextExamGoal = {
              exam: parsedUserData.exam,
              groupType: parsedUserData.group_type,
            };
            console.log(
              "🎯 UserContext: Found exam goal in AuthContext localStorage:",
              authContextExamGoal
            );
          }
        }
      } catch (error) {
        console.warn(
          "UserContext: Failed to parse AuthContext localStorage data:",
          error
        );
      }

      if (authContextExamGoal) setExamGoal(authContextExamGoal as ExamGoal);

      // Mark as loaded if we have any stored data
      if (authContextExamGoal) {
        setIsDataLoaded(true);
        console.log("✅ UserContext: Data loaded from localStorage");
      } else {
        console.log("⚠️ UserContext: No stored data found");
      }
    };

    loadStoredData();
  }, []);

  // Fetch profile data only (exam goal is fetched separately when needed)
  const fetchUserData = useCallback(
    async (forceRefresh = false) => {
      console.log(
        "🔍 fetchUserData called",
        new Date().toISOString(),
        "forceRefresh:",
        forceRefresh
      );



      // If AuthContext is still loading, wait for it to complete
      if (authLoading) {
        console.log(
          "⏳ AuthContext is still loading, skipping UserContext fetch..."
        );
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        console.log(
          "📡 UserContext: Fetching profile data from API...",
          new Date().toISOString()
        );
        const response = await getUserData();
        const userData = response?.data;

        console.log("📋 User data from API:", userData);

        // Update profile data only
        const profileData: UserProfile = {
          id: userData?.id || "unknown",
          name: userData?.name || "",
          email: userData?.email || "",
          phone: undefined,
          avatar: undefined,
          gender: userData?.gender || undefined,
          date_of_birth: userData?.date_of_birth || undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };



        // Also check if the AuthContext response contains exam goal data
        if (userData?.exam_goal?.exam && userData?.exam_goal?.group) {
          const examGoalData: ExamGoal = {
            exam: userData.exam_goal.exam,
            groupType: userData.exam_goal.group,
          };

          console.log(
            "🎯 UserContext: Found exam goal data in /ums/me response:",
            examGoalData
          );

          // Update exam goal state
          setExamGoal(examGoalData);
        } else if (userData?.exam && userData?.group_type) {
          // Fallback for old format (if still supported)
          const examGoalData: ExamGoal = {
            exam: userData.exam,
            groupType: userData.group_type,
          };

          console.log(
            "🎯 UserContext: Found exam goal data in legacy format:",
            examGoalData
          );



          // Update exam goal state
          setExamGoal(examGoalData);
        }

        // Update state
        setProfile(profileData);
        setIsDataLoaded(true);

        console.log("✅ Profile data updated successfully");
      } catch (err) {
        setError("Failed to fetch user data");
        console.error("Error fetching user data:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [authLoading, getUserData]
  );

  // Individual fetch methods
  const fetchProfile = useCallback(
    async (forceRefresh = false) => {
      await fetchUserData(forceRefresh);
    },
    [fetchUserData]
  );

  const fetchExamGoal = useCallback(
    async (forceRefresh = false) => {
      console.log("🎯 fetchExamGoal called with forceRefresh:", forceRefresh);



      try {
        setIsLoading(true);
        setError(null);

        console.log("📡 fetchExamGoal: Getting exam goal from /ums/me API...");
        const response = await getUserData();
        const userData = response?.data;
        console.log(
          "📡 fetchExamGoal: /ums/me API response received:",
          userData
        );

        if (userData?.exam_goal?.exam && userData?.exam_goal?.group) {
          const examGoalData: ExamGoal = {
            exam: userData.exam_goal.exam,
            groupType: userData.exam_goal.group,
          };

          console.log("🎯 fetchExamGoal: Parsed exam goal data:", examGoalData);



          // Update state
          setExamGoal(examGoalData);
          console.log("🎯 Exam goal fetched from /ums/me:", examGoalData);
        } else {
          // No exam goal found
          console.log(
            "⚠️ fetchExamGoal: No exam goal found in /ums/me response"
          );

          setExamGoal(null);
          console.log("❌ No exam goal found");
        }
      } catch (err) {
        setError("Failed to fetch exam goal");
        console.error("❌ fetchExamGoal: Error fetching exam goal:", err);
        setExamGoal(null);
      } finally {
        setIsLoading(false);
      }
    },
    [getUserData]
  );

  // Fetch stats from API (when available)
  const fetchStats = useCallback(async () => {

    try {
      setIsLoading(true);
      setError(null);

      // TODO: Replace with actual stats API call when available
      // For now, we'll set stats to null since the API doesn't provide this data yet
      // const response = await statsApi.getUserStats();

      // If no stats API is available, set to null
      setStats(null);
      setIsDataLoaded(true);
    } catch (err) {
      setError("Failed to fetch stats");
      console.error("Error fetching stats:", err);
      // On error, assume no stats
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  }, []);









  // Refresh methods
  const refreshProfile = useCallback(async () => {
    await fetchUserData(true);
  }, [fetchUserData]);

  const refreshExamGoal = useCallback(async () => {
    await fetchExamGoal(true);
  }, [fetchExamGoal]);


  const refreshAll = useCallback(async () => {
    await fetchUserData(true);
  }, [fetchUserData]);

  // Update methods with optimistic updates
  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      if (!profile) return;

      const originalProfile = profile;
      const updatedProfile = { ...profile, ...updates };

      // Optimistic update
      setProfile(updatedProfile);

      try {
        // TODO: Implement actual API call to update profile
        // await authApi.updateProfile(updates);
      } catch (err) {
        // Revert on failure
        setProfile(originalProfile);
        setError("Failed to update profile");
        console.error("Error updating profile:", err);
      }
    },
    [profile]
  );

  const updateExamGoal = useCallback(
    async (updates: Partial<ExamGoal>) => {
      if (!examGoal) return;

      const originalExamGoal = examGoal;
      const updatedExamGoal = { ...examGoal, ...updates };

      // Optimistic update
      setExamGoal(updatedExamGoal);

      try {
        // TODO: Implement actual API call to update exam goal
        // await authApi.updateExamGoal(updates);
      } catch (err) {
        // Revert on failure
        setExamGoal(originalExamGoal);
        setError("Failed to update exam goal");
        console.error("Error updating exam goal:", err);
      }
    },
    [examGoal]
  );

  const updatePreferences = useCallback(
    async (updates: Partial<UserPreferences>) => {
      if (!preferences) return;

      const originalPreferences = preferences;
      const updatedPreferences = { ...preferences, ...updates };

      // Optimistic update
      setPreferences(updatedPreferences);

      try {
        // TODO: Implement actual API call to update preferences
        // await authApi.updatePreferences(updates);
      } catch (err) {
        // Revert on failure
        setPreferences(originalPreferences);
        setError("Failed to update preferences");
        console.error("Error updating preferences:", err);
      }
    },
    [preferences]
  );



  // Utility methods
  const isProfileComplete = useCallback(() => {
    return !!(profile?.gender && profile?.date_of_birth);
  }, [profile]);

  // Sync exam goal data from AuthContext localStorage
  const syncExamGoalFromAuthContext = useCallback(() => {
    try {
      const userData = localStorage.getItem("userData");
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        if (parsedUserData?.exam && parsedUserData?.group_type) {
          const examGoalData: ExamGoal = {
            exam: parsedUserData.exam,
            groupType: parsedUserData.group_type,
          };

          console.log(
            "🔄 UserContext: Syncing exam goal from AuthContext:",
            examGoalData
          );



          // Update state
          setExamGoal(examGoalData);

          return true;
        }
      }
      return false;
    } catch (error) {
      console.warn(
        "UserContext: Failed to sync exam goal from AuthContext:",
        error
      );
      return false;
    }
  }, []);

  // Initialize background sync on mount (after all functions are defined)
  useEffect(() => {
    // Only start background sync if user is authenticated and auth is not loading
    if (!isAuthenticated || authLoading) {
      console.log("⏳ Waiting for authentication to complete...");
      return;
    }

    // Start background sync when component mounts
    console.log("🚀 UserProvider mounted - starting background profile sync");

    // Perform initial profile fetch immediately
    const initialFetch = async () => {
      console.log("📡 Performing initial profile fetch...");
      await fetchUserData();

      // Also fetch exam goal data on mount
      console.log("🎯 Performing initial exam goal fetch...");
      await fetchExamGoal();
    };

    initialFetch();
  }, [
    isAuthenticated,
    authLoading,
    fetchUserData,
    fetchExamGoal,
  ]);

  const value: UserContextType = {
    profile,
    examGoal,
    stats,
    preferences,
    isLoading,
    error,
    isDataLoaded,

    fetchProfile,
    fetchExamGoal,
    fetchStats,
    refreshProfile,
    refreshExamGoal,
    refreshAll,
    updateProfile,
    updateExamGoal,
    updatePreferences,
    isProfileComplete,
    syncExamGoalFromAuthContext,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Hook to use the context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
