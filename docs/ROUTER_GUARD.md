# Router Guard Implementation

## Overview

This application implements a comprehensive router guard system to protect routes based on authentication status. The system ensures that only authenticated users can access protected pages while allowing unauthenticated users to access login and error pages.

## Architecture

### 1. Authentication Context (`src/contexts/AuthContext.tsx`)

The `AuthContext` provides authentication state management throughout the application:

- **State Management**: Manages user authentication status, user data, and loading states
- **Authentication Methods**: Provides `login()`, `logout()`, and `checkAuth()` functions
- **Persistence**: Stores authentication tokens and user data in localStorage
- **Auto-check**: Automatically checks authentication status on app initialization

### 2. Protected Route Component (`src/components/ProtectedRoute.tsx`)

The `ProtectedRoute` component wraps protected content and handles authentication checks:

- **Authentication Check**: Verifies if the user is authenticated
- **Loading State**: Shows a loading spinner while checking authentication
- **Redirect Logic**: Redirects unauthenticated users to the login page with return URL
- **Return URL**: Preserves the intended destination for post-login navigation

### 3. Router Configuration (`src/routes/index.tsx`)

The router is configured to protect all routes except:

- `/login` - Login page
- `/exam-goal` - Exam goal selection page
- `/*` - 404 Not Found page

All other routes are wrapped with the `ProtectedRoute` component.

## Protected Routes

The following routes are protected and require authentication:

- `/` (Home/Dashboard)
- `/home` (Dashboard)
- `/test-series` (Test Configuration)
- `/exam-info` (Exam Information)
- `/exam-reconfirm` (Exam Reconfirmation)
- `/test-main-page` (Test Interface)
- `/analysis` (Detailed Analysis)
- `/history` (Learning History)
- `/refer-and-earn` (Referral Program)
- `/premium` (Subscription Management)
- `/chat` (Chat Interface)
- `/flashcards` (Flashcard Learning)
- `/profile` (User Profile)
- `/books` (Books)
- `/video-learning/:videoId` (Video Learning)
- `/previous-year-papers` (Coming Soon)
- `/attempted-tests` (Coming Soon)
- `/exams` (Coming Soon)

## Public Routes

The following routes are accessible without authentication:

- `/login` - User authentication page (redirects to dashboard if already authenticated)
- `/exam-goal` - Exam goal selection page (redirects to dashboard if already authenticated)
- `/*` - 404 Not Found page

## User Experience Features

### 1. Return URL Preservation

When an unauthenticated user tries to access a protected route:

1. They are redirected to the login page
2. The original URL is preserved in the location state
3. After successful login, they are redirected back to their intended destination

### 2. Loading States

- Authentication checks show a loading spinner
- Prevents flash of protected content during auth verification
- Provides clear feedback to users

### 3. Logout Functionality

- Logout button available in the sidebar
- Clears all authentication data
- Redirects to login page
- Available on all protected pages

### 4. User Information Display

- Shows actual user email in the sidebar
- Displays user plan information
- Provides quick access to profile and logout

### 5. Authentication Redirect Logic

- **Login Page**: Redirects authenticated users based on exam goal status
  - If user has exam goal → Dashboard
  - If user doesn't have exam goal → Exam Goal page
- **Exam Goal Page**: Redirects authenticated users with exam goal to dashboard
- **Protected Pages**: Redirect unauthenticated users to login with return URL
- **Loading States**: Show appropriate loading indicators during auth checks

## Implementation Details

### Authentication Flow

1. **App Initialization**: `AuthProvider` checks localStorage for existing tokens
2. **Route Access**: `ProtectedRoute` verifies authentication status
3. **Unauthenticated Access**: Redirects to login with return URL
4. **Login Success**: Uses `AuthContext.login()` to set authentication state
5. **Exam Goal Check**: Checks if user has exam goal data in backend
6. **Post-Login Navigation**:
   - If user has exam goal → Dashboard or return URL
   - If user doesn't have exam goal → Exam Goal page

### Token Management

- **Storage**: Tokens stored in localStorage as 'authToken'
- **User Data**: User information stored as JSON in localStorage
- **Auto-cleanup**: Invalid tokens are automatically cleared
- **Logout**: Complete cleanup of all auth data

### Error Handling

- **Invalid Tokens**: Automatically logged out if token parsing fails
- **API Errors**: Graceful handling of authentication API failures
- **Network Issues**: Loading states prevent UI inconsistencies

### Exam Goal Management

- **Backend Check**: `getUserExamGoal()` API endpoint checks if user has exam goal
- **State Management**: `hasExamGoal` and `examGoalLoading` states in AuthContext
- **Automatic Updates**: Exam goal state updates after successful submission
- **Navigation Logic**: Routes users based on exam goal completion status

## Usage Examples

### Using the Auth Context

```typescript
import { useAuth } from "../contexts/AuthContext";

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();

  // Access user information
  console.log(user?.email);

  // Check authentication status
  if (isAuthenticated) {
    // User is logged in
  }

  // Login with token and user data
  login(token, { email: "user@example.com" });

  // Logout user
  logout();
};
```

### Protected Route Usage

```typescript
import ProtectedRoute from '../components/ProtectedRoute';

// In router configuration
{
  path: '/protected-page',
  element: (
    <ProtectedRoute>
      <ProtectedPage />
    </ProtectedRoute>
  )
}
```

## Security Considerations

1. **Token Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)
2. **Token Validation**: Implement server-side token validation
3. **Session Management**: Consider implementing refresh tokens
4. **Route Protection**: All sensitive routes are properly protected
5. **Logout Security**: Complete cleanup of authentication data

## Future Enhancements

1. **Refresh Tokens**: Implement automatic token refresh
2. **Session Timeout**: Add automatic logout on token expiration
3. **Remember Me**: Implement persistent login functionality
4. **Multi-factor Authentication**: Add additional security layers
5. **Role-based Access**: Implement different access levels for different user types
