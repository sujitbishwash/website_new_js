import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Google OAuth configuration
export const googleAuthConfig = {
    provider: 'google',
    options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
            access_type: 'offline',
            prompt: 'consent',
        },
    },
};

// Auth helper functions
export const authHelpers = {
    // Sign in with Google
    signInWithGoogle: async () => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });

            if (error) {
                throw error;
            }

            return { data, error: null };
        } catch (error) {
            console.error('Google sign-in error:', error);
            return { data: null, error };
        }
    },

    // Sign out
    signOut: async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                throw error;
            }
            return { error: null };
        } catch (error) {
            console.error('Sign out error:', error);
            return { error };
        }
    },

    // Get current user
    getCurrentUser: async () => {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                throw error;
            }
            return { user, error: null };
        } catch (error) {
            console.error('Get current user error:', error);
            return { user: null, error };
        }
    },

    // Get session
    getSession: async () => {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) {
                throw error;
            }
            return { session, error: null };
        } catch (error) {
            console.error('Get session error:', error);
            return { session: null, error };
        }
    },

    // Listen to auth state changes
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
        return supabase.auth.onAuthStateChange(callback);
    },
};
