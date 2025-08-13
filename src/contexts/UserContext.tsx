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
  fetchExamGoal: () => Promise<void>;
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
}

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Enhanced cache implementation with persistence
class UserDataCache {
  private cache = new Map();
  private readonly STORAGE_KEY = "user_data_cache";

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.cache = new Map(Object.entries(data));
      }
    } catch (error) {
      console.warn("Failed to load cache from storage:", error);
    }
  }

  private saveToStorage() {
    try {
      const data = Object.fromEntries(this.cache);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn("Failed to save cache to storage:", error);
    }
  }

  isValid(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    return Date.now() - item.timestamp < item.ttl;
  }

  get(key: string) {
    const item = this.cache.get(key);
    if (!item || !this.isValid(key)) {
      this.cache.delete(key);
      this.saveToStorage();
      return null;
    }
    return item.data;
  }

  set(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
    this.saveToStorage();
  }

  clear(): void {
    this.cache.clear();
    localStorage.removeItem(this.STORAGE_KEY);
  }

  invalidate(key: string): void {
    this.cache.delete(key);
    this.saveToStorage();
  }

  // New: Check if any data exists in cache
  hasAnyData(): boolean {
    return this.cache.size > 0;
  }

  // New: Get all stored keys
  getStoredKeys(): string[] {
    return Array.from(this.cache.keys());
  }
}

// Cache instance
const cache = new UserDataCache();

// Global flag to prevent multiple simultaneous exam goal API calls
let isExamGoalFetching = false;

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
  const [backgroundSyncInterval, setBackgroundSyncInterval] =
    useState<NodeJS.Timeout | null>(null);
  const [isBackgroundSyncEnabled, setIsBackgroundSyncEnabled] = useState(false);
  const [isFetching, setIsFetching] = useState(false); // Prevent multiple simultaneous API calls

  const { getUserData, isAuthenticated, isLoading: authLoading } = useAuth();

  // Load stored data on mount
  useEffect(() => {
    const loadStoredData = () => {
      const storedProfile = cache.get("profile");
      const storedExamGoal = cache.get("examGoal");
      const storedStats = cache.get("stats");
      const storedPreferences = cache.get("preferences");

      if (storedProfile) setProfile(storedProfile);
      if (storedExamGoal) setExamGoal(storedExamGoal);
      if (storedStats) setStats(storedStats);
      if (storedPreferences) setPreferences(storedPreferences);

      // Mark as loaded if we have any stored data
      if (storedProfile || storedExamGoal || storedStats || storedPreferences) {
        setIsDataLoaded(true);
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

      // Prevent multiple simultaneous API calls
      if (isFetching) {
        console.log("⏳ API call already in progress, skipping...");
        return;
      }

      const storedProfile = cache.get("profile");

      // If we have stored profile data and not forcing refresh, use stored data
      if (storedProfile && !forceRefresh) {
        console.log("📋 Using stored profile data from UserContext");
        setProfile(storedProfile);
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
        setIsFetching(true);
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
        cache.set("profile", profileData, 5 * 60 * 1000); // 5 minutes

        // Update state
        setProfile(profileData);
        setIsDataLoaded(true);

        console.log("✅ Profile data updated successfully");
      } catch (err) {
        setError("Failed to fetch user data");
        console.error("Error fetching user data:", err);
      } finally {
        setIsLoading(false);
        setIsFetching(false);
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
    // Check cache first before making API call
    const storedExamGoal = cache.get("examGoal");
    if (storedExamGoal && !forceRefresh) {
      setExamGoal(storedExamGoal);
      console.log("📋 Using stored exam goal data in fetchExamGoal");
      return;
    }

    // Use dedicated exam goal API for direct access
    // Prevent multiple simultaneous API calls
    if (isExamGoalFetching) {
      console.log("⏳ Exam goal API call already in progress, waiting...");
      // Wait for the current request to complete
      while (isExamGoalFetching) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      // Check cache again after waiting
      const storedAfterWait = cache.get("examGoal");
      if (storedAfterWait) {
        setExamGoal(storedAfterWait);
        console.log("📋 Using stored exam goal data after waiting");
        return;
      }
    }

    try {
      setIsLoading(true);
      setError(null);
      isExamGoalFetching = true;

      const { examGoalApi } = await import("../lib/api-client");
      const response = await examGoalApi.getUserExamGoal();

      if (response?.data?.success && response.data.data) {
        const examGoalData: ExamGoal = {
          exam: response.data.data.exam,
          groupType: response.data.data.group_type,
        };

        // Cache the exam goal data
        cache.set("examGoal", examGoalData, 10 * 60 * 1000); // 10 minutes

        // Update state
        setExamGoal(examGoalData);
        console.log("🎯 Exam goal fetched directly:", examGoalData);
      } else {
        // No exam goal found
        cache.invalidate("examGoal");
        setExamGoal(null);
        console.log("❌ No exam goal found");
      }
    } catch (err) {
      setError("Failed to fetch exam goal");
      console.error("Error fetching exam goal:", err);
      setExamGoal(null);
    } finally {
      setIsLoading(false);
      isExamGoalFetching = false;
    }
  }, []);

  // Fetch stats from API (when available)
  const fetchStats = useCallback(async (forceRefresh = false) => {
    const stored = cache.get("stats");
    if (stored && !forceRefresh) {
      setStats(stored);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // TODO: Replace with actual stats API call when available
      // For now, we'll set stats to null since the API doesn't provide this data yet
      // const response = await statsApi.getUserStats();

      // If no stats API is available, set to null
      cache.invalidate("stats");
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
        cache.set("profile", profileData, 5 * 60 * 1000); // 5 minutes
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
    if (backgroundSyncInterval) return;

    console.log("🚀 Starting background sync...");
    setIsBackgroundSyncEnabled(true);

    // Perform initial sync
    performBackgroundSync();

    // Set up periodic sync every 30 minutes (profile data changes less frequently)
    const interval = setInterval(performBackgroundSync, 30 * 60 * 1000);
    setBackgroundSyncInterval(interval);
  }, [backgroundSyncInterval]);

  // Stop background sync
  const stopBackgroundSync = useCallback(() => {
    if (backgroundSyncInterval) {
      clearInterval(backgroundSyncInterval);
      setBackgroundSyncInterval(null);
      setIsBackgroundSyncEnabled(false);
      console.log("⏹️ Background sync stopped");
    }
  }, [backgroundSyncInterval]);

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
    cache.invalidate("profile");
    await fetchUserData(true);
  }, [fetchUserData]);

  const refreshExamGoal = useCallback(async () => {
    cache.invalidate("examGoal");
    await fetchExamGoal(true);
  }, [fetchExamGoal]);

  const refreshStats = useCallback(async () => {
    cache.invalidate("stats");
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
      cache.set("profile", updatedProfile, 5 * 60 * 1000);

      try {
        // TODO: Implement actual API call to update profile
        // await authApi.updateProfile(updates);
      } catch (err) {
        // Revert on failure
        setProfile(originalProfile);
        cache.set("profile", originalProfile, 5 * 60 * 1000);
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
      cache.set("examGoal", updatedExamGoal, 10 * 60 * 1000);

      try {
        // TODO: Implement actual API call to update exam goal
        // await authApi.updateExamGoal(updates);
      } catch (err) {
        // Revert on failure
        setExamGoal(originalExamGoal);
        cache.set("examGoal", originalExamGoal, 10 * 60 * 1000);
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
    cache.clear();
    setProfile(null);
    setExamGoal(null);
    setStats(null);
    setPreferences(null);
    setIsDataLoaded(false);
  }, []);

  // Utility methods
  const isProfileComplete = useCallback(() => {
    return !!(profile?.name && profile?.email);
  }, [profile]);

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
    };

    initialFetch();
    startBackgroundSync();

    return () => {
      stopBackgroundSync();
    };
  }, [isAuthenticated, authLoading, fetchUserData]); // Only run when auth state changes

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
