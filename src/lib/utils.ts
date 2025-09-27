import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// First-time user detection utilities
const FIRST_TIME_USER_KEY = 'aipadhai_first_time_user';
const HAS_SEEN_SPLASH_KEY = 'aipadhai_has_seen_splash';

export const isFirstTimeUser = (): boolean => {
  return localStorage.getItem(FIRST_TIME_USER_KEY) === null;
};

export const markAsReturningUser = (): void => {
  localStorage.setItem(FIRST_TIME_USER_KEY, 'false');
};

export const hasSeenSplash = (): boolean => {
  return localStorage.getItem(HAS_SEEN_SPLASH_KEY) === 'true';
};

export const markSplashAsSeen = (): void => {
  localStorage.setItem(HAS_SEEN_SPLASH_KEY, 'true');
};

export const shouldShowSplash = (): boolean => {
  return isFirstTimeUser() && !hasSeenSplash();
};

export const resetFirstTimeUser = (): void => {
  localStorage.removeItem(FIRST_TIME_USER_KEY);
  localStorage.removeItem(HAS_SEEN_SPLASH_KEY);
};

// Authentication utilities
export const hasValidAuthToken = (): boolean => {
  const token = localStorage.getItem('authToken');
  const userData = localStorage.getItem('userData');
  
  return !!(token && userData);
};

export const clearAuthData = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const getUserData = (): any => {
  const userData = localStorage.getItem('userData');
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (error) {
      
      return null;
    }
  }
  return null;
};
