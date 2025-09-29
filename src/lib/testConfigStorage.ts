// Utility functions for managing test configuration in localStorage
// This ensures testConfig persists across navigation in the test flow

export interface TestConfig {
  subject: string;
  sub_topic: string[];
  level: string;
  language: string;
}

const TEST_CONFIG_KEY = 'test_configuration';
const TEST_CONFIG_EXPIRY_KEY = 'test_config_expiry';
const EXPIRY_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Save test configuration to localStorage with expiry
 */
export const saveTestConfig = (testConfig: TestConfig): void => {
  try {
    const expiryTime = Date.now() + EXPIRY_DURATION;
    localStorage.setItem(TEST_CONFIG_KEY, JSON.stringify(testConfig));
    localStorage.setItem(TEST_CONFIG_EXPIRY_KEY, expiryTime.toString());
  } catch (error) {
    console.error('Failed to save test configuration:', error);
  }
};

/**
 * Get test configuration from localStorage
 * Returns null if expired or not found
 */
export const getTestConfig = (): TestConfig | null => {
  try {
    const storedConfig = localStorage.getItem(TEST_CONFIG_KEY);
    const expiryTime = localStorage.getItem(TEST_CONFIG_EXPIRY_KEY);
    
    if (!storedConfig || !expiryTime) {
      return null;
    }
    
    // Check if expired
    if (Date.now() > parseInt(expiryTime)) {
      clearTestConfig();
      return null;
    }
    
    return JSON.parse(storedConfig);
  } catch (error) {
    console.error('Failed to get test configuration:', error);
    clearTestConfig();
    return null;
  }
};

/**
 * Clear test configuration from localStorage
 */
export const clearTestConfig = (): void => {
  try {
    localStorage.removeItem(TEST_CONFIG_KEY);
    localStorage.removeItem(TEST_CONFIG_EXPIRY_KEY);
  } catch (error) {
    console.error('Failed to clear test configuration:', error);
  }
};

/**
 * Check if test configuration exists and is valid
 */
export const hasValidTestConfig = (): boolean => {
  return getTestConfig() !== null;
};

/**
 * Update specific fields in test configuration
 */
export const updateTestConfig = (updates: Partial<TestConfig>): void => {
  const currentConfig = getTestConfig();
  if (currentConfig) {
    const updatedConfig = { ...currentConfig, ...updates };
    saveTestConfig(updatedConfig);
  }
};

/**
 * Clear test configuration when test starts or user leaves test pages
 * This should be called when:
 * 1. Test actually starts (user clicks "I am ready to begin")
 * 2. User navigates away from test flow pages
 * 3. User explicitly cancels test configuration
 */
export const clearTestConfigOnTestStart = (): void => {
  clearTestConfig();
};

/**
 * Clear test configuration when user leaves test pages
 * This should be called when user navigates to non-test pages
 */
export const clearTestConfigOnLeave = (): void => {
  clearTestConfig();
};
