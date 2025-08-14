import { CACHE_CONFIG, CacheEntry, CacheOperation, CacheStatus } from './cache-config';

// Enhanced cache manager with proper cache-first pattern
export class CacheManager {
    private cache = new Map<string, CacheEntry<any>>();
    private readonly STORAGE_KEY = "enhanced_user_data_cache";
    private syncIntervals = new Map<string, NodeJS.Timeout>();
    private syncCallbacks = new Map<string, () => Promise<any>>();

    constructor() {
        this.loadFromStorage();
        this.log(CacheOperation.SYNC, "Cache manager initialized");
    }

    // Main cache operation: GET with fallback to API
    async get<T>(
        key: string,
        fetchCallback: () => Promise<T>,
        ttl?: number,
        forceRefresh = false
    ): Promise<T | null> {
        const cacheKey = this.normalizeKey(key);
        const cacheTTL = ttl || this.getDefaultTTL(key);

        // Check cache first (unless forcing refresh)
        if (!forceRefresh) {
            const cachedData = this.getFromCache<T>(cacheKey, cacheTTL);
            if (cachedData !== null) {
                this.log(CacheOperation.GET, `Cache hit for ${cacheKey}`, { data: cachedData });
                return cachedData;
            }
        }

        // Cache miss or force refresh - fetch from API
        this.log(CacheOperation.GET, `Cache miss for ${cacheKey}, fetching from API`);

        try {
            const freshData = await fetchCallback();

            // Update cache with fresh data
            this.set(cacheKey, freshData, cacheTTL);

            // Set up periodic sync if not already set
            this.setupPeriodicSync(key, fetchCallback, cacheTTL);

            this.log(CacheOperation.SYNC, `Successfully fetched and cached ${cacheKey}`, { data: freshData });
            return freshData;
        } catch (error) {
            this.log(CacheOperation.GET, `Failed to fetch ${cacheKey}`, { error });

            // Return cached data if available (even if expired) as fallback
            const expiredData = this.getExpiredData<T>(cacheKey);
            if (expiredData !== null) {
                this.log(CacheOperation.GET, `Using expired cache as fallback for ${cacheKey}`);
                return expiredData;
            }

            return null;
        }
    }

    // Get data from cache only (no API fallback)
    getFromCache<T>(key: string, ttl?: number): T | null {
        const cacheKey = this.normalizeKey(key);
        const cacheTTL = ttl || this.getDefaultTTL(key);

        const entry = this.cache.get(cacheKey);
        if (!entry) {
            this.log(CacheOperation.GET, `No cache entry for ${cacheKey}`);
            return null;
        }

        const isValid = this.isValid(entry, cacheTTL);
        if (!isValid) {
            this.log(CacheOperation.GET, `Cache expired for ${cacheKey}`);
            this.cache.delete(cacheKey);
            this.saveToStorage();
            return null;
        }

        this.log(CacheOperation.GET, `Cache hit for ${cacheKey}`, {
            age: Date.now() - entry.timestamp,
            timeUntilExpiry: (entry.timestamp + cacheTTL) - Date.now()
        });

        return entry.data;
    }

    // Set data in cache
    set<T>(key: string, data: T, ttl?: number): void {
        const cacheKey = this.normalizeKey(key);
        const cacheTTL = ttl || this.getDefaultTTL(key);

        const entry: CacheEntry<T> = {
            data,
            timestamp: Date.now(),
            ttl: cacheTTL,
            lastSync: Date.now(),
        };

        this.cache.set(cacheKey, entry);
        this.saveToStorage();

        this.log(CacheOperation.SET, `Cached ${cacheKey}`, {
            data,
            ttl: cacheTTL,
            expiresAt: new Date(entry.timestamp + cacheTTL).toISOString()
        });
    }

    // Invalidate specific cache entry
    invalidate(key: string): void {
        const cacheKey = this.normalizeKey(key);
        const existed = this.cache.has(cacheKey);

        this.cache.delete(cacheKey);
        this.saveToStorage();

        if (existed) {
            this.log(CacheOperation.INVALIDATE, `Invalidated ${cacheKey}`);
        }
    }

    // Clear all cache
    clear(): void {
        this.cache.clear();
        this.saveToStorage();
        this.stopAllSync();

        this.log(CacheOperation.CLEAR, "All cache cleared");
    }

    // Get cache status for debugging
    getCacheStatus(key: string): CacheStatus | null {
        const cacheKey = this.normalizeKey(key);
        const entry = this.cache.get(cacheKey);

        if (!entry) {
            return {
                key: cacheKey,
                exists: false,
                isValid: false,
                age: 0,
                timeUntilExpiry: 0,
                lastSync: 0,
            };
        }

        const now = Date.now();
        const age = now - entry.timestamp;
        const timeUntilExpiry = Math.max(0, (entry.timestamp + entry.ttl) - now);
        const isValid = this.isValid(entry, entry.ttl);

        return {
            key: cacheKey,
            exists: true,
            isValid,
            age,
            timeUntilExpiry,
            lastSync: entry.lastSync,
        };
    }

    // Setup periodic sync for a cache key
    setupPeriodicSync<T>(
        key: string,
        fetchCallback: () => Promise<T>,
        ttl?: number
    ): void {
        const cacheKey = this.normalizeKey(key);
        const syncInterval = this.getSyncInterval(key);

        // Stop existing sync if any
        this.stopSync(key);

        // Store the callback for later use
        this.syncCallbacks.set(cacheKey, fetchCallback);

        // Set up periodic sync
        const interval = setInterval(async () => {
            try {
                this.log(CacheOperation.SYNC, `Periodic sync for ${cacheKey}`);
                const freshData = await fetchCallback();
                this.set(cacheKey, freshData, ttl);
            } catch (error) {
                this.log(CacheOperation.SYNC, `Periodic sync failed for ${cacheKey}`, { error });
            }
        }, syncInterval);

        this.syncIntervals.set(cacheKey, interval);

        this.log(CacheOperation.SYNC, `Periodic sync setup for ${cacheKey}`, {
            interval: syncInterval,
            nextSync: new Date(Date.now() + syncInterval).toISOString()
        });
    }

    // Stop periodic sync for a specific key
    stopSync(key: string): void {
        const cacheKey = this.normalizeKey(key);
        const interval = this.syncIntervals.get(cacheKey);

        if (interval) {
            clearInterval(interval);
            this.syncIntervals.delete(cacheKey);
            this.syncCallbacks.delete(cacheKey);

            this.log(CacheOperation.SYNC, `Stopped sync for ${cacheKey}`);
        }
    }

    // Stop all periodic syncs
    stopAllSync(): void {
        this.syncIntervals.forEach((interval, key) => {
            clearInterval(interval);
            this.log(CacheOperation.SYNC, `Stopped sync for ${key}`);
        });

        this.syncIntervals.clear();
        this.syncCallbacks.clear();

        this.log(CacheOperation.SYNC, "All syncs stopped");
    }

    // Manual sync for a specific key
    async manualSync<T>(key: string): Promise<T | null> {
        const cacheKey = this.normalizeKey(key);
        const fetchCallback = this.syncCallbacks.get(cacheKey);

        if (!fetchCallback) {
            this.log(CacheOperation.SYNC, `No sync callback found for ${cacheKey}`);
            return null;
        }

        try {
            this.log(CacheOperation.SYNC, `Manual sync for ${cacheKey}`);
            const freshData = await fetchCallback();
            this.set(cacheKey, freshData);
            return freshData;
        } catch (error) {
            this.log(CacheOperation.SYNC, `Manual sync failed for ${cacheKey}`, { error });
            return null;
        }
    }

    // Get all cached keys
    getCachedKeys(): string[] {
        return Array.from(this.cache.keys());
    }

    // Check if cache has any data
    hasAnyData(): boolean {
        return this.cache.size > 0;
    }

    // Debug: Show cache contents
    debugCache(): void {
        console.log("🔍 Enhanced Cache Manager Debug Info:");
        console.log("  - Total items:", this.cache.size);
        console.log("  - Keys:", this.getCachedKeys());
        console.log("  - Active syncs:", this.syncIntervals.size);

        this.cache.forEach((entry, key) => {
            const status = this.getCacheStatus(key);
            console.log(`  - ${key}:`, status);
        });

        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            console.log("  - localStorage raw:", stored);
            if (stored) {
                const parsed = JSON.parse(stored);
                console.log("  - localStorage parsed:", parsed);
            }
        } catch (error) {
            console.warn("  - Failed to read localStorage:", error);
        }
    }

    // Private methods
    private normalizeKey(key: string): string {
        return key.toLowerCase().replace(/\s+/g, "_");
    }

    private getDefaultTTL(key: string): number {
        const normalizedKey = this.normalizeKey(key);

        // Map cache keys to TTL values
        if (normalizedKey.includes("profile")) return CACHE_CONFIG.TTL.USER_PROFILE;
        if (normalizedKey.includes("exam")) return CACHE_CONFIG.TTL.EXAM_GOAL;
        if (normalizedKey.includes("stats")) return CACHE_CONFIG.TTL.USER_STATS;
        if (normalizedKey.includes("preferences")) return CACHE_CONFIG.TTL.USER_PREFERENCES;
        if (normalizedKey.includes("exam_data")) return CACHE_CONFIG.TTL.EXAM_DATA;

        // Default TTL
        return 5 * 60 * 1000; // 5 minutes
    }

    private getSyncInterval(key: string): number {
        const normalizedKey = this.normalizeKey(key);

        // Map cache keys to sync intervals
        if (normalizedKey.includes("profile")) return CACHE_CONFIG.SYNC_INTERVALS.USER_PROFILE;
        if (normalizedKey.includes("exam")) return CACHE_CONFIG.SYNC_INTERVALS.EXAM_GOAL;
        if (normalizedKey.includes("stats")) return CACHE_CONFIG.SYNC_INTERVALS.USER_STATS;
        if (normalizedKey.includes("preferences")) return CACHE_CONFIG.SYNC_INTERVALS.USER_PREFERENCES;
        if (normalizedKey.includes("exam_data")) return CACHE_CONFIG.SYNC_INTERVALS.EXAM_DATA;

        // Default sync interval
        return 5 * 60 * 1000; // 5 minutes
    }

    private isValid(entry: CacheEntry<any>, ttl: number): boolean {
        return Date.now() - entry.timestamp < ttl;
    }

    private getExpiredData<T>(key: string): T | null {
        const entry = this.cache.get(key);
        return entry ? entry.data : null;
    }

    private loadFromStorage(): void {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                this.cache = new Map(Object.entries(data));
                this.log(CacheOperation.SYNC, `Loaded ${this.cache.size} items from localStorage`);
            }
        } catch (error) {
            console.warn("Failed to load cache from storage:", error);
        }
    }

    private saveToStorage(): void {
        try {
            const data = Object.fromEntries(this.cache);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.warn("Failed to save cache to storage:", error);
        }
    }

    private log(operation: CacheOperation, message: string, data?: any): void {
        if (!CACHE_CONFIG.DEBUG.ENABLE_LOGGING) return;

        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${operation}: ${message}`;

        if (data) {
            console.log(logMessage, data);
        } else {
            console.log(logMessage);
        }
    }
}

// Export singleton instance
export const cacheManager = new CacheManager();
