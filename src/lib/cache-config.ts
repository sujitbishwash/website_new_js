// Centralized cache configuration
export const CACHE_CONFIG = {
    // Cache keys
    KEYS: {
        USER_PROFILE: "user_profile",
        EXAM_GOAL: "exam_goal",
        USER_STATS: "user_stats",
        USER_PREFERENCES: "user_preferences",
        EXAM_DATA: "exam_data",
    },

    // Cache TTL (Time To Live) in milliseconds
    TTL: {
        USER_PROFILE: 5 * 60 * 1000,        // 5 minutes
        EXAM_GOAL: 10 * 60 * 1000,          // 10 minutes
        USER_STATS: 15 * 60 * 1000,         // 15 minutes
        USER_PREFERENCES: 30 * 60 * 1000,    // 30 minutes
        EXAM_DATA: 60 * 60 * 1000,          // 1 hour
    },

    // Background sync intervals in milliseconds
    SYNC_INTERVALS: {
        USER_PROFILE: 5 * 60 * 1000,        // 5 minutes
        EXAM_GOAL: 10 * 60 * 1000,          // 10 minutes
        USER_STATS: 15 * 60 * 1000,         // 15 minutes
        USER_PREFERENCES: 30 * 60 * 1000,    // 30 minutes
        EXAM_DATA: 60 * 60 * 1000,          // 1 hour
    },

    // Cache invalidation rules
    INVALIDATION: {
        // Invalidate related caches when one changes
        USER_PROFILE_CHANGES: ["user_profile"],
        EXAM_GOAL_CHANGES: ["exam_goal"],
        USER_PREFERENCES_CHANGES: ["user_preferences"],
    },

    // Debug settings
    DEBUG: {
        ENABLE_LOGGING: true,
        LOG_CACHE_OPERATIONS: true,
        LOG_SYNC_OPERATIONS: true,
    },
};

// Cache operation types
export enum CacheOperation {
    GET = "GET",
    SET = "SET",
    INVALIDATE = "INVALIDATE",
    CLEAR = "CLEAR",
    SYNC = "SYNC",
}

// Cache entry interface
export interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number;
    lastSync: number;
}

// Cache status interface
export interface CacheStatus {
    key: string;
    exists: boolean;
    isValid: boolean;
    age: number;
    timeUntilExpiry: number;
    lastSync: number;
}
