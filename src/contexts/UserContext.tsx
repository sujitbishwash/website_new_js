import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { authApi } from '../lib/api-client';

// Interfaces
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExamGoal {
  id: string;
  examType: string;
  targetScore: number;
  targetDate: string;
  currentScore?: number;
  isActive: boolean;
}

export interface UserStats {
  totalTests: number;
  completedTests: number;
  averageScore: number;
  bestScore: number;
  lastTestDate?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
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
}

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Simple cache implementation
class UserDataCache {
  private cache = new Map();

  isValid(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    return Date.now() - item.timestamp < item.ttl;
  }

  get(key: string) {
    const item = this.cache.get(key);
    if (!item || !this.isValid(key)) {
      this.cache.delete(key);
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
  }

  clear(): void {
    this.cache.clear();
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }
}

// Cache instance
const cache = new UserDataCache();

// Provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [examGoal, setExamGoal] = useState<ExamGoal | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile data
  const fetchProfile = useCallback(async () => {
    const cached = cache.get('profile');
    if (cached) {
      setProfile(cached);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await authApi.getUserDetails();
      const userData = response.data?.data;
      
      const profileData: UserProfile = {
        id: userData?.id || 'unknown',
        name: userData?.name || 'User',
        email: userData?.email || '',
        phone: undefined,
        avatar: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      cache.set('profile', profileData, 5 * 60 * 1000); // 5 minutes
      setProfile(profileData);
    } catch (err) {
      setError('Failed to fetch profile');
      console.error('Error fetching profile:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch exam goal (mock data for now)
  const fetchExamGoal = useCallback(async () => {
    const cached = cache.get('examGoal');
    if (cached) {
      setExamGoal(cached);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Mock exam goal data - replace with actual API call when available
      const mockExamGoal: ExamGoal = {
        id: '1',
        examType: 'JEE Main',
        targetScore: 95,
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        currentScore: 75,
        isActive: true,
      };

      cache.set('examGoal', mockExamGoal, 10 * 60 * 1000); // 10 minutes
      setExamGoal(mockExamGoal);
    } catch (err) {
      setError('Failed to fetch exam goal');
      console.error('Error fetching exam goal:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch stats (mock data for now)
  const fetchStats = useCallback(async () => {
    const cached = cache.get('stats');
    if (cached) {
      setStats(cached);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Mock stats data - replace with actual API call
      const mockStats: UserStats = {
        totalTests: 25,
        completedTests: 18,
        averageScore: 75.5,
        bestScore: 92,
        lastTestDate: new Date().toISOString(),
      };

      cache.set('stats', mockStats, 15 * 60 * 1000); // 15 minutes
      setStats(mockStats);
    } catch (err) {
      setError('Failed to fetch stats');
      console.error('Error fetching stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh methods
  const refreshProfile = useCallback(async () => {
    cache.invalidate('profile');
    await fetchProfile();
  }, [fetchProfile]);

  const refreshExamGoal = useCallback(async () => {
    cache.invalidate('examGoal');
    await fetchExamGoal();
  }, [fetchExamGoal]);

  const refreshStats = useCallback(async () => {
    cache.invalidate('stats');
    await fetchStats();
  }, [fetchStats]);

  const refreshAll = useCallback(async () => {
    await Promise.all([refreshProfile(), refreshExamGoal(), refreshStats()]);
  }, [refreshProfile, refreshExamGoal, refreshStats]);

  // Update methods with optimistic updates
  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!profile) return;

    const originalProfile = profile;
    const updatedProfile = { ...profile, ...updates };

    // Optimistic update
    setProfile(updatedProfile);
    cache.set('profile', updatedProfile, 5 * 60 * 1000);

    try {
      // TODO: Implement actual API call to update profile
      // await authApi.updateProfile(updates);
    } catch (err) {
      // Revert on failure
      setProfile(originalProfile);
      cache.set('profile', originalProfile, 5 * 60 * 1000);
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
    }
  }, [profile]);

  const updateExamGoal = useCallback(async (updates: Partial<ExamGoal>) => {
    if (!examGoal) return;

    const originalExamGoal = examGoal;
    const updatedExamGoal = { ...examGoal, ...updates };

    // Optimistic update
    setExamGoal(updatedExamGoal);
    cache.set('examGoal', updatedExamGoal, 10 * 60 * 1000);

    try {
      // TODO: Implement actual API call to update exam goal
      // await authApi.updateExamGoal(updates);
    } catch (err) {
      // Revert on failure
      setExamGoal(originalExamGoal);
      cache.set('examGoal', originalExamGoal, 10 * 60 * 1000);
      setError('Failed to update exam goal');
      console.error('Error updating exam goal:', err);
    }
  }, [examGoal]);

  const updatePreferences = useCallback(async (updates: Partial<UserPreferences>) => {
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
      setError('Failed to update preferences');
      console.error('Error updating preferences:', err);
    }
  }, [preferences]);

  // Cache management
  const clearCache = useCallback(() => {
    cache.clear();
  }, []);

  // Utility methods
  const isProfileComplete = useCallback(() => {
    return !!(profile?.name && profile?.email);
  }, [profile]);

  // Initialize data on mount
  useEffect(() => {
    fetchProfile();
    fetchExamGoal();
    fetchStats();
  }, [fetchProfile, fetchExamGoal, fetchStats]);

  const value: UserContextType = {
    profile,
    examGoal,
    stats,
    preferences,
    isLoading,
    error,
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
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Hook to use the context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
