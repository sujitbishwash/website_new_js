import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { CACHE_CONFIG } from "../lib/cache-config";
import { cacheManager } from "../lib/cache-manager";
import { useAuth } from "./AuthContext";

// Interfaces
export interface UserProfile {
  id: string;
  name: string; // Can be empty string if user hasn't set their name
  email: string;
  phone?: string;
  avatar?: string;
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
  isBackgroundLoading: boolean; // New: indicates if background sync is running
  isBackgroundSyncEnabled: boolean; // New: indicates if background sync is enabled

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
  clearCache: () => void;
  isProfileComplete: () => boolean;
  startBackgroundSync: () => void; // New: manually trigger background sync
  stopBackgroundSync: () => void; // New: stop background sync
  enableBackgroundSync: () => void; // New: enable background sync
  disableBackgroundSync: () => void; // New: disable background sync
  syncExamGoalFromAuthContext: () => boolean; // New: sync exam goal from AuthContext
  debugCache: () => void; // New: debug cache contents
  resetFetchFlags: () => void; // New: reset fetch flags
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
  const [isBackgroundLoading, setIsBackgroundLoading] = useState(false);
  const [isBackgroundSyncEnabled, setIsBackgroundSyncEnabled] = useState(false);

  const { getUserData, isAuthenticated, isLoading: authLoading } = useAuth();

  // Load stored data on mount
  useEffect(() => {
    const loadStoredData = () => {
      console.log("🔄 UserContext: Loading stored data from cache...");

      const storedProfile = cacheManager.getFromCache("profile");
      const storedExamGoal = cacheManager.getFromCache("examGoal");
      const storedStats = cacheManager.getFromCache("stats");
      const storedPreferences = cacheManager.getFromCache("preferences");

      console.log("📋 UserContext: Stored data found:", {
        profile: !!storedProfile,
        examGoal: !!storedExamGoal,
        stats: !!storedStats,
        preferences: !!storedPreferences,
        examGoalData: storedExamGoal,
      });

      // Also check AuthContext's localStorage for exam goal data
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

      // Use AuthContext exam goal if UserContext cache doesn't have it
      const finalExamGoal = storedExamGoal || authContextExamGoal;
      if (finalExamGoal && !storedExamGoal) {
        console.log("💾 UserContext: Storing AuthContext exam goal in cache");
        cacheManager.set("examGoal", finalExamGoal, CACHE_CONFIG.TTL.EXAM_GOAL);
      }

      if (storedProfile) setProfile(storedProfile as UserProfile);
      if (finalExamGoal) setExamGoal(finalExamGoal as ExamGoal);
      if (storedStats) setStats(storedStats as UserStats);
      if (storedPreferences)
        setPreferences(storedPreferences as UserPreferences);

      // Mark as loaded if we have any stored data
      if (storedProfile || finalExamGoal || storedStats || storedPreferences) {
        setIsDataLoaded(true);
        console.log("✅ UserContext: Data loaded from cache");
      } else {
        console.log("⚠️ UserContext: No cached data found");
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

      const storedProfile = cacheManager.getFromCache("profile");

      // If we have stored profile data and not forcing refresh, use stored data
      if (storedProfile && !forceRefresh) {
        console.log("📋 Using stored profile data from UserContext");
        setProfile(storedProfile as UserProfile);
        setIsDataLoaded(true);
        return;
      }

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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Cache the profile data
        cacheManager.set("profile", profileData, CACHE_CONFIG.TTL.USER_PROFILE);

        // Also check if the AuthContext response contains exam goal data
        if (userData?.exam && userData?.group_type) {
          const examGoalData: ExamGoal = {
            exam: userData.exam,
            groupType: userData.group_type,
          };

          console.log(
            "🎯 UserContext: Found exam goal data in AuthContext response:",
            examGoalData
          );

          // Cache the exam goal data
          cacheManager.set(
            "examGoal",
            examGoalData,
            CACHE_CONFIG.TTL.EXAM_GOAL
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
    [authLoading]
  );

  // Individual fetch methods
  const fetchProfile = useCallback(
    async (forceRefresh = false) => {
      await fetchUserData(forceRefresh);
    },
    [fetchUserData]
  );

  const fetchExamGoal = useCallback(async (forceRefresh = false) => {
    console.log("🎯 fetchExamGoal called with forceRefresh:", forceRefresh);

    // Check cache first before making API call
    const storedExamGoal = cacheManager.getFromCache("examGoal");
    console.log(
      "📋 fetchExamGoal: Stored exam goal from cache:",
      storedExamGoal
    );

    if (storedExamGoal && !forceRefresh) {
      setExamGoal(storedExamGoal as ExamGoal);
      console.log("📋 Using stored exam goal data in fetchExamGoal");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log("📡 fetchExamGoal: Making API call to getUserExamGoal...");
      const { examGoalApi } = await import("../lib/api-client");
      const response = await examGoalApi.getUserExamGoal();
      console.log("📡 fetchExamGoal: API response received:", response);

      if (response?.data?.success && response.data.data) {
        const examGoalData: ExamGoal = {
          exam: response.data.data.exam,
          groupType: response.data.data.group_type,
        };

        console.log("🎯 fetchExamGoal: Parsed exam goal data:", examGoalData);

        // Cache the exam goal data
        cacheManager.set("examGoal", examGoalData, CACHE_CONFIG.TTL.EXAM_GOAL);
        console.log("💾 fetchExamGoal: Exam goal data cached successfully");

        // Update state
        setExamGoal(examGoalData);
        console.log("🎯 Exam goal fetched directly:", examGoalData);
      } else {
        // No exam goal found
        console.log("⚠️ fetchExamGoal: No exam goal found in API response");
        cacheManager.invalidate("examGoal");
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
  }, []);

  // Fetch stats from API (when available)
  const fetchStats = useCallback(async (forceRefresh = false) => {
    const stored = cacheManager.getFromCache("stats");
    if (stored && !forceRefresh) {
      setStats(stored as UserStats);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // TODO: Replace with actual stats API call when available
      // For now, we'll set stats to null since the API doesn't provide this data yet
      // const response = await statsApi.getUserStats();

      // If no stats API is available, set to null
      cacheManager.invalidate("stats");
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

  // Background sync function - only sync profile data, not exam goal
  const performBackgroundSync = useCallback(async () => {
    if (isBackgroundLoading) return;

    try {
      setIsBackgroundLoading(true);
      console.log("🔄 Performing background profile sync...");

      // Only fetch profile data, not exam goal
      const response = await getUserData();
      const userData = response?.data;

      if (userData) {
        const profileData: UserProfile = {
          id: userData?.id || "unknown",
          name: userData?.name || "",
          email: userData?.email || "",
          phone: undefined,
          avatar: undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Update profile cache only
        cacheManager.set("profile", profileData, CACHE_CONFIG.TTL.USER_PROFILE);
        setProfile(profileData);
      }

      console.log("✅ Background profile sync completed");
    } catch (error) {
      console.error("❌ Background sync failed:", error);
    } finally {
      setIsBackgroundLoading(false);
    }
  }, [isBackgroundLoading]);

  // Start background sync
  const startBackgroundSync = useCallback(() => {
    console.log("🚀 Starting background sync...");
    setIsBackgroundSyncEnabled(true);

    // Perform initial sync
    performBackgroundSync();

    // Set up periodic sync using cache manager
    cacheManager.setupPeriodicSync(
      "profile",
      async () => {
        const response = await getUserData();
        const userData = response?.data;
        if (userData) {
          const profileData: UserProfile = {
            id: userData?.id || "unknown",
            name: userData?.name || "",
            email: userData?.email || "",
            phone: undefined,
            avatar: undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return profileData;
        }
        return null;
      },
      CACHE_CONFIG.TTL.USER_PROFILE
    );
  }, []);

  // Stop background sync
  const stopBackgroundSync = useCallback(() => {
    console.log("⏹️ Background sync stopped");
    setIsBackgroundSyncEnabled(false);
    cacheManager.stopSync("profile");
  }, []);

  // Enable background sync
  const enableBackgroundSync = useCallback(() => {
    if (!isBackgroundSyncEnabled) {
      startBackgroundSync();
    }
  }, [isBackgroundSyncEnabled]);

  // Disable background sync
  const disableBackgroundSync = useCallback(() => {
    if (isBackgroundSyncEnabled) {
      stopBackgroundSync();
    }
  }, [isBackgroundSyncEnabled]);

  // Refresh methods
  const refreshProfile = useCallback(async () => {
    cacheManager.invalidate("profile");
    await fetchUserData(true);
  }, [fetchUserData]);

  const refreshExamGoal = useCallback(async () => {
    cacheManager.invalidate("examGoal");
    await fetchExamGoal(true);
  }, [fetchExamGoal]);

  const refreshStats = useCallback(async () => {
    cacheManager.invalidate("stats");
    await fetchStats(true);
  }, [fetchStats]);

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
      cacheManager.set("profile", updatedProfile, 5 * 60 * 1000);

      try {
        // TODO: Implement actual API call to update profile
        // await authApi.updateProfile(updates);
      } catch (err) {
        // Revert on failure
        setProfile(originalProfile);
        cacheManager.set("profile", originalProfile, 5 * 60 * 1000);
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
      cacheManager.set("examGoal", updatedExamGoal, 10 * 60 * 1000);

      try {
        // TODO: Implement actual API call to update exam goal
        // await authApi.updateExamGoal(updates);
      } catch (err) {
        // Revert on failure
        setExamGoal(originalExamGoal);
        cacheManager.set("examGoal", originalExamGoal, 10 * 60 * 1000);
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

  // Cache management
  const clearCache = useCallback(() => {
    cacheManager.clear();
    setProfile(null);
    setExamGoal(null);
    setStats(null);
    setPreferences(null);
    setIsDataLoaded(false);
    // setHasAttemptedInitialFetch(false); // Reset fetch flag when cache is cleared
  }, []);

  // Reset fetch flags (useful for testing or manual refresh)
  const resetFetchFlags = useCallback(() => {
    // setHasAttemptedInitialFetch(false);
  }, []);

  // Utility methods
  const isProfileComplete = useCallback(() => {
    return !!(profile?.name && profile?.email);
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

          // Cache the exam goal data
          cacheManager.set("examGoal", examGoalData, 10 * 60 * 1000);

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
    startBackgroundSync();

    return () => {
      stopBackgroundSync();
    };
  }, [isAuthenticated, authLoading, fetchUserData, fetchExamGoal]);

  const value: UserContextType = {
    profile,
    examGoal,
    stats,
    preferences,
    isLoading,
    error,
    isDataLoaded,
    isBackgroundLoading,
    isBackgroundSyncEnabled,
    fetchProfile,
    fetchExamGoal,
    fetchStats,
    refreshProfile,
    refreshExamGoal,
    refreshStats,
    refreshAll,
    updateProfile,
    updateExamGoal,
    updatePreferences,
    clearCache,
    isProfileComplete,
    startBackgroundSync,
    stopBackgroundSync,
    enableBackgroundSync,
    disableBackgroundSync,
    syncExamGoalFromAuthContext,
    debugCache: cacheManager.debugCache, // Add debugCache to the context value
    resetFetchFlags, // Add resetFetchFlags to the context value
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
