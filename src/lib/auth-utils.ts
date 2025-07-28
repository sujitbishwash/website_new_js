// Token management utilities
export const TOKEN_KEY = 'authToken';

export const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
    localStorage.removeItem(TOKEN_KEY);
};

export const isTokenValid = (token: string): boolean => {
    if (!token) return false;

    try {
        // Check if token is expired (assuming JWT format)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;

        return payload.exp > currentTime;
    } catch (error) {
        // If token is not a valid JWT, consider it invalid
        return false;
    }
};

export const getTokenExpiration = (token: string): Date | null => {
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return new Date(payload.exp * 1000);
    } catch (error) {
        return null;
    }
};

// Check if token will expire soon (within 5 minutes)
export const isTokenExpiringSoon = (token: string): boolean => {
    const expiration = getTokenExpiration(token);
    if (!expiration) return true;

    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
    return expiration <= fiveMinutesFromNow;
};

// Clear all auth-related data
export const clearAuthData = (): void => {
    removeToken();
    // Add any other auth-related cleanup here
    // e.g., clear user data, preferences, etc.
}; 