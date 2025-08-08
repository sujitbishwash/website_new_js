# Supabase and Google OAuth Setup Guide

This guide will help you set up Supabase with Google OAuth for the AI Padhai application.

## Prerequisites

1. A Google Cloud Platform account
2. A Supabase account

## Step 1: Set up Google OAuth

### 1.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API

### 1.2 Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: "AI Padhai"
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes:
   - `email`
   - `profile`
   - `openid`
5. Add test users (your email addresses)

### 1.3 Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `https://your-project-id.supabase.co/auth/v1/callback`
   - `http://localhost:5175/auth/callback` (for development)
5. Copy the Client ID and Client Secret

## Step 2: Set up Supabase

### 2.1 Create a Supabase Project

1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Note down your project URL and anon key

### 2.2 Configure Google OAuth in Supabase

1. Go to your Supabase project dashboard
2. Navigate to "Authentication" > "Providers"
3. Enable Google provider
4. Enter your Google OAuth credentials:
   - Client ID: Your Google OAuth Client ID
   - Client Secret: Your Google OAuth Client Secret
5. Save the configuration

### 2.3 Configure Redirect URLs

1. In Supabase dashboard, go to "Authentication" > "URL Configuration"
2. Add your redirect URLs:
   - Site URL: `http://localhost:5175` (for development)
   - Redirect URLs: `http://localhost:5175/auth/callback`

## Step 3: Environment Variables

Create a `.env` file in your project root with the following variables:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Replace the values with your actual Supabase project URL and anon key.

## Step 4: Database Schema (Optional)

If you want to store additional user data, you can create a `profiles` table in Supabase:

```sql
-- Create a profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create a trigger to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
```

## Step 5: Testing

1. Start your development server: `npm run dev`
2. Navigate to the login page
3. Click "Sign in with Google"
4. Complete the OAuth flow
5. You should be redirected back to your application

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**
   - Make sure the redirect URI in Google OAuth matches exactly
   - Check that the redirect URI in Supabase is correct

2. **"Client ID not found" error**
   - Verify your Google OAuth Client ID is correct
   - Make sure the OAuth consent screen is configured

3. **"Environment variables not found" error**
   - Check that your `.env` file is in the project root
   - Verify the variable names start with `VITE_`
   - Restart your development server after adding environment variables

### Debug Mode

To enable debug logging, add this to your `.env` file:

```env
VITE_SUPABASE_DEBUG=true
```

## Production Deployment

When deploying to production:

1. Update the redirect URIs in Google OAuth to include your production domain
2. Update the Site URL and Redirect URLs in Supabase
3. Set the environment variables in your production environment
4. Ensure your domain is added to the authorized domains in Google OAuth

## Security Notes

- Never commit your `.env` file to version control
- Use environment variables for all sensitive configuration
- Regularly rotate your OAuth client secrets
- Monitor your OAuth usage in Google Cloud Console
