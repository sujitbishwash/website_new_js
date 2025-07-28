# Router Guard Implementation

This document explains the router guard implementation for the AI Padhai React application.

## Overview

The router guard system provides authentication-based route protection, ensuring that:

- Unauthenticated users are redirected to the login page
- Authenticated users are redirected away from public routes (like login)
- Token validation and automatic cleanup of expired tokens
- Proper loading states during authentication checks

## Components

### 1. AuthContext (`src/contexts/AuthContext.tsx`)

The central authentication state management system.

**Features:**

- Manages authentication state across the application
- Provides login/logout functions
- Handles token validation and cleanup
- Loading state management

**Usage:**

```tsx
import { useAuth } from "@/contexts/AuthContext";

const MyComponent = () => {
  const { isAuthenticated, login, logout, isLoading } = useAuth();

  // Use auth functions and state
};
```

### 2. ProtectedRoute (`src/components/ProtectedRoute.tsx`)

Wraps routes that require authentication.

**Features:**

- Redirects unauthenticated users to login
- Shows loading spinner during auth checks
- Preserves intended destination for post-login redirect

**Usage:**

```tsx
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

### 3. PublicRoute (`src/components/PublicRoute.tsx`)

Wraps routes that should only be accessible to non-authenticated users.

**Features:**

- Redirects authenticated users to dashboard
- Shows loading spinner during auth checks

**Usage:**

```tsx
<PublicRoute>
  <LoginPage />
</PublicRoute>
```

### 4. LoadingSpinner (`src/components/LoadingSpinner.tsx`)

Reusable loading component for better UX.

**Features:**

- Multiple size options (small, medium, large)
- Accessible with proper ARIA labels
- Customizable styling

**Usage:**

```tsx
<LoadingSpinner size="large" className="my-custom-class" />
```

## Utility Functions

### Auth Utils (`src/lib/auth-utils.ts`)

Token management and validation utilities.

**Functions:**

- `getToken()`: Retrieve token from localStorage
- `setToken(token)`: Store token in localStorage
- `removeToken()`: Remove token from localStorage
- `isTokenValid(token)`: Validate JWT token expiration
- `getTokenExpiration(token)`: Get token expiration date
- `isTokenExpiringSoon(token)`: Check if token expires within 5 minutes
- `clearAuthData()`: Clear all authentication data

## Router Configuration

The router is configured in `src/App.tsx` with the following structure:

```tsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Parent />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <DashboardPage /> },
      { path: "exam-goal", element: <ExamGoalPage /> },
      // ... more protected routes
    ],
  },
  // ... other protected routes
]);
```

## Authentication Flow

1. **App Initialization:**

   - AuthContext checks for existing token
   - Validates token expiration
   - Sets authentication state

2. **Login Process:**

   - User submits credentials
   - API call to authenticate
   - Token stored via AuthContext
   - Redirect to intended destination or default

3. **Route Protection:**

   - ProtectedRoute checks authentication
   - Redirects to login if not authenticated
   - Preserves intended destination

4. **Logout Process:**
   - Clears all auth data
   - Redirects to login page
   - Resets authentication state

## Features

### Token Validation

- Automatic JWT expiration checking
- Invalid token cleanup
- Secure token storage

### Redirect Handling

- Preserves intended destination after login
- Prevents authenticated users from accessing login
- Graceful fallbacks for invalid routes

### Loading States

- Consistent loading experience
- Prevents flash of incorrect content
- Accessible loading indicators

### Security

- Token-based authentication
- Automatic token cleanup
- Secure localStorage usage

## Usage Examples

### Adding a New Protected Route

```tsx
// In App.tsx
{
  path: "/new-feature",
  element: (
    <ProtectedRoute>
      <NewFeaturePage />
    </ProtectedRoute>
  ),
}
```

### Adding a New Public Route

```tsx
// In App.tsx
{
  path: "/register",
  element: (
    <PublicRoute>
      <RegisterPage />
    </PublicRoute>
  ),
}
```

### Using Auth Context in Components

```tsx
import { useAuth } from "@/contexts/AuthContext";

const MyComponent = () => {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // Additional cleanup if needed
  };

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
};
```

## Best Practices

1. **Always wrap protected routes** with `ProtectedRoute`
2. **Always wrap public routes** with `PublicRoute`
3. **Use the AuthContext** for authentication state
4. **Handle loading states** appropriately
5. **Validate tokens** on app initialization
6. **Clear auth data** on logout
7. **Preserve user intent** with redirect handling

## Troubleshooting

### Common Issues

1. **Infinite redirect loops:**

   - Check that PublicRoute and ProtectedRoute are used correctly
   - Ensure login/logout functions update auth state properly

2. **Token not persisting:**

   - Verify localStorage is available
   - Check token storage/retrieval functions

3. **Loading states not showing:**
   - Ensure AuthContext is properly initialized
   - Check isLoading state management

### Debug Tips

1. Check browser localStorage for token
2. Verify token expiration in browser console
3. Monitor network requests for auth calls
4. Check React DevTools for context state
